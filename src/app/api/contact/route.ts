import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { google } from "googleapis";

export const runtime = "nodejs";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return new Resend(apiKey);
}

const MAX_FILES = 50;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

type UploadFileMetadata = {
  name: string;
  type: string;
  size: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeFileName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function isValidDriveId(value: string) {
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

function getGoogleCredentials(): ServiceAccountCredentials {
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing."
    );
  }

  let parsed: ServiceAccountCredentials;

  try {
    parsed = JSON.parse(
      raw
    ) as ServiceAccountCredentials;
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON."
    );
  }

  if (
    !parsed.client_email ||
    !parsed.private_key
  ) {
    throw new Error(
      "Google service account credentials are incomplete."
    );
  }

  return {
    client_email: parsed.client_email,
    private_key:
      parsed.private_key.replace(
        /\\n/g,
        "\n"
      ),
  };
}

function getGoogleAuth() {
  const credentials =
    getGoogleCredentials();

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      "https://www.googleapis.com/auth/drive",
    ],
  });
}

function getDriveClient() {
  const auth = getGoogleAuth();

  return google.drive({
    version: "v3",
    auth,
  });
}

async function verifySubmissionFolder(
  driveFolderId: string
) {
  const parentFolderId =
    process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!parentFolderId) {
    throw new Error(
      "GOOGLE_DRIVE_FOLDER_ID is missing."
    );
  }

  if (
    !isValidDriveId(driveFolderId)
  ) {
    throw new Error(
      "Invalid Google Drive folder ID."
    );
  }

  const drive = getDriveClient();

  const folder = await drive.files.get({
    fileId: driveFolderId,
    fields:
      "id,name,mimeType,parents,trashed",
    supportsAllDrives: true,
  });

  if (
    folder.data.mimeType !==
      "application/vnd.google-apps.folder" ||
    folder.data.trashed ||
    !folder.data.parents?.includes(
      parentFolderId
    )
  ) {
    throw new Error(
      "The upload folder is not a valid HostMetric contact folder."
    );
  }

  return drive;
}

async function createUploadBatch(
  fullName: string,
  files: UploadFileMetadata[]
) {
  if (!fullName.trim()) {
    throw new Error(
      "Full name is required."
    );
  }

  if (
    !Array.isArray(files) ||
    files.length === 0
  ) {
    throw new Error(
      "No photos were provided."
    );
  }

  if (files.length > MAX_FILES) {
    throw new Error(
      `You can upload up to ${MAX_FILES} photos.`
    );
  }

  files.forEach((file) => {
    if (
      !file ||
      typeof file.name !== "string" ||
      typeof file.type !== "string" ||
      typeof file.size !== "number"
    ) {
      throw new Error(
        "Invalid photo metadata."
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.has(
        file.type
      )
    ) {
      throw new Error(
        "Only JPG, PNG and WEBP images are allowed."
      );
    }

    if (
      file.size <= 0 ||
      file.size > MAX_FILE_SIZE
    ) {
      throw new Error(
        `Each photo must be smaller than ${
          MAX_FILE_SIZE /
          1024 /
          1024
        } MB.`
      );
    }
  });

  const parentFolderId =
    process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!parentFolderId) {
    throw new Error(
      "GOOGLE_DRIVE_FOLDER_ID is missing."
    );
  }

  const auth = getGoogleAuth();
  const drive = google.drive({
    version: "v3",
    auth,
  });

  const timestamp =
    new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

  const safeName =
    safeFileName(fullName) ||
    "contact";

  const submissionFolder =
    await drive.files.create({
      requestBody: {
        name: `${timestamp} - ${safeName}`,
        mimeType:
          "application/vnd.google-apps.folder",
        parents: [
          parentFolderId,
        ],
      },
      fields:
        "id,name,webViewLink",
      supportsAllDrives: true,
    });

  const folderId =
    submissionFolder.data.id;

  if (!folderId) {
    throw new Error(
      "Could not create the Google Drive upload folder."
    );
  }

  const accessTokenResponse =
    await auth.getAccessToken();

  const accessToken =
    accessTokenResponse.token;

  if (!accessToken) {
    throw new Error(
      "Could not obtain a Google access token."
    );
  }

  const uploads: Array<{
    index: number;
    uploadUrl: string;
  }> = [];

  try {
    for (
      let index = 0;
      index < files.length;
      index += 1
    ) {
      const file = files[index];

      const originalName =
        safeFileName(file.name) ||
        `photo-${index + 1}`;

      const fileName =
        `${String(index + 1).padStart(
          2,
          "0"
        )}-${originalName}`;

      const initiationUrl =
        new URL(
          "https://www.googleapis.com/upload/drive/v3/files"
        );

      initiationUrl.searchParams.set(
        "uploadType",
        "resumable"
      );

      initiationUrl.searchParams.set(
        "supportsAllDrives",
        "true"
      );

      initiationUrl.searchParams.set(
        "fields",
        "id,name,mimeType,webViewLink,parents"
      );

      const initiationResponse =
        await fetch(
          initiationUrl.toString(),
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
              "Content-Type":
                "application/json; charset=UTF-8",
              "X-Upload-Content-Type":
                file.type,
              "X-Upload-Content-Length":
                String(file.size),
            },
            body: JSON.stringify({
              name: fileName,
              parents: [
                folderId,
              ],
            }),
          }
        );

      if (
        !initiationResponse.ok
      ) {
        const details =
          await initiationResponse.text();

        throw new Error(
          `Google Drive could not create an upload session (${initiationResponse.status}): ${details}`
        );
      }

      const uploadUrl =
        initiationResponse.headers.get(
          "location"
        );

      if (!uploadUrl) {
        throw new Error(
          "Google Drive did not return a resumable upload URL."
        );
      }

      uploads.push({
        index,
        uploadUrl,
      });
    }
  } catch (error) {
    /*
     * If session preparation fails,
     * remove the empty/partial request folder.
     */
    try {
      await drive.files.delete({
        fileId: folderId,
        supportsAllDrives: true,
      });
    } catch (cleanupError) {
      console.error(
        "Could not clean up failed Drive folder:",
        cleanupError
      );
    }

    throw error;
  }

  return {
    folderId,
    driveFolderLink:
      submissionFolder.data
        .webViewLink ??
      `https://drive.google.com/drive/folders/${folderId}`,
    uploads,
  };
}

async function getUploadedPhotos(
  driveFolderId: string
) {
  const drive =
    await verifySubmissionFolder(
      driveFolderId
    );

  const response =
    await drive.files.list({
      q: `'${driveFolderId}' in parents and trashed = false`,
      pageSize: MAX_FILES,
      orderBy: "name",
      fields:
        "files(id,name,mimeType,webViewLink,parents)",
      includeItemsFromAllDrives:
        true,
      supportsAllDrives: true,
    });

  const files =
    response.data.files ?? [];

  const photos = files
    .filter((file) =>
      file.mimeType?.startsWith(
        "image/"
      )
    )
    .slice(0, MAX_FILES)
    .map((file) => ({
      id: file.id ?? "",
      name:
        file.name ??
        "photo",
      webViewLink:
        file.webViewLink ??
        (file.id
          ? `https://drive.google.com/file/d/${file.id}/view`
          : ""),
    }))
    .filter(
      (photo) =>
        photo.id &&
        photo.webViewLink
    );

  return photos;
}

async function cleanupUploadBatch(
  folderId: string
) {
  const drive =
    await verifySubmissionFolder(
      folderId
    );

  await drive.files.delete({
    fileId: folderId,
    supportsAllDrives: true,
  });
}

async function submitContact(
  body: Record<string, unknown>
) {
  const fullName =
    String(
      body.fullName ?? ""
    ).trim();

  const country =
    String(
      body.country ?? ""
    ).trim();

  const propertyType =
    String(
      body.propertyType ?? ""
    ).trim();

  const email =
    String(
      body.email ?? ""
    ).trim();

  const phone =
    String(
      body.phone ?? ""
    ).trim();

  const cityArea =
    String(
      body.cityArea ?? ""
    ).trim();

  const message =
    String(
      body.message ?? ""
    ).trim();

  const consent =
    body.consent === true;

  const driveFolderId =
    typeof body.driveFolderId ===
      "string" &&
    body.driveFolderId
      ? body.driveFolderId
      : null;

  const expectedPhotoCount =
    typeof body.expectedPhotoCount === "number" &&
    Number.isInteger(body.expectedPhotoCount) &&
    body.expectedPhotoCount >= 0
      ? Math.min(body.expectedPhotoCount, MAX_FILES)
      : 0;

  if (
    !fullName ||
    !country ||
    !propertyType ||
    !email ||
    !phone ||
    !cityArea ||
    !message ||
    consent !== true
  ) {
    throw new Error(
      "Missing required fields."
    );
  }

  let uploadedPhotos: Array<{
    id: string;
    name: string;
    webViewLink: string;
  }> = [];

  let driveFolderLink:
    | string
    | null = null;

  if (driveFolderId) {
    // Google may need a brief moment before newly uploaded files appear
    // in Drive's list response. Retry a few times before finalizing.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      uploadedPhotos =
        await getUploadedPhotos(
          driveFolderId
        );

      if (
        uploadedPhotos.length >= expectedPhotoCount ||
        expectedPhotoCount === 0
      ) {
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );
    }

    if (uploadedPhotos.length < expectedPhotoCount) {
      throw new Error(
        `Ανέβηκαν ${uploadedPhotos.length} από ${expectedPhotoCount} φωτογραφίες. Παρακαλώ δοκιμάστε ξανά.`
      );
    }

    driveFolderLink =
      `https://drive.google.com/drive/folders/${driveFolderId}`;
  }

  const photoUrls =
    uploadedPhotos.map(
      (photo) =>
        photo.webViewLink
    );

  const photoUrlsText =
    photoUrls.join("\n");

  /*
   * Save the final submission in Neon.
   * photo_urls is a PostgreSQL text[] column.
   */
  const sql = getSql();

  const result = await sql`
    INSERT INTO contact_submissions (
      full_name,
      country,
      property_type,
      email,
      phone,
      city_area,
      message,
      consent,
      photo_urls
    )
    VALUES (
      ${fullName},
      ${country},
      ${propertyType || null},
      ${email},
      ${phone || null},
      ${cityArea || null},
      ${message},
      ${consent},
      CASE
        WHEN ${photoUrls.length} = 0
          THEN ARRAY[]::text[]
        ELSE string_to_array(
          ${photoUrlsText},
          E'\n'
        )
      END
    )
    RETURNING id, created_at, photo_urls;
  `;

  const submission =
    result[0];

  const safeFullName =
    escapeHtml(fullName);

  const safeCountry =
    escapeHtml(country);

  const safePropertyType =
    escapeHtml(
      propertyType ||
        "Δεν δηλώθηκε"
    );

  const safeEmail =
    escapeHtml(email);

  const safePhone =
    escapeHtml(
      phone ||
        "Δεν δηλώθηκε"
    );

  const safeCityArea =
    escapeHtml(
      cityArea ||
        "Δεν δηλώθηκε"
    );

  const safeMessage =
    escapeHtml(message);

  const photosHtml =
    uploadedPhotos.length > 0
      ? `
        <hr />

        <p>
          <strong>Φωτογραφίες:</strong>
          ${uploadedPhotos.length}
        </p>

        ${
          driveFolderLink
            ? `
              <p>
                <a
                  href="${driveFolderLink}"
                  style="
                    display:inline-block;
                    padding:10px 16px;
                    border-radius:8px;
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    font-weight:700;
                  "
                >
                  Άνοιγμα φακέλου φωτογραφιών
                </a>
              </p>
            `
            : ""
        }

        <ol>
          ${uploadedPhotos
            .map(
              (photo) => `
                <li style="margin-bottom:8px;">
                  <a href="${photo.webViewLink}">
                    ${escapeHtml(
                      photo.name
                    )}
                  </a>
                </li>
              `
            )
            .join("")}
        </ol>
      `
      : `
        <hr />

        <p>
          <strong>Φωτογραφίες:</strong>
          Δεν επισυνάφθηκαν
        </p>
      `;

  const resend = getResendClient();

  const {
    error: emailError,
  } =
    await resend.emails.send({
      from:
        "HostMetric Website <notifications@hostmetric.gr>",

      to: [
        "info@hostmetric.gr",
      ],

      replyTo: email,

      subject:
        `Νέο αίτημα από ${fullName}`,

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:0 auto;
          "
        >

          <h2>
            Νέο αίτημα μέσω HostMetric
          </h2>

          <p>
            Υποβλήθηκε νέο αίτημα μέσω της φόρμας επικοινωνίας του hostmetric.gr.
          </p>

          <hr />

          <p>
            <strong>Ονοματεπώνυμο:</strong>
            ${safeFullName}
          </p>

          <p>
            <strong>Χώρα ακινήτου:</strong>
            ${safeCountry}
          </p>

          <p>
            <strong>Τύπος ακινήτου:</strong>
            ${safePropertyType}
          </p>

          <p>
            <strong>Email:</strong>
            ${safeEmail}
          </p>

          <p>
            <strong>Τηλέφωνο:</strong>
            ${safePhone}
          </p>

          <p>
            <strong>Πόλη / Περιοχή:</strong>
            ${safeCityArea}
          </p>

          <hr />

          <p>
            <strong>Μήνυμα:</strong>
          </p>

          <p style="white-space:pre-wrap;">
            ${safeMessage}
          </p>

          ${photosHtml}

          <hr />

          <p
            style="
              font-size:12px;
              color:#777;
            "
          >
            Submission ID:
            ${submission.id}
          </p>

        </div>
      `,
    });

  if (emailError) {
    console.error(
      "Resend notification error:",
      emailError
    );
  }

  return {
    submission,
    uploadedPhotos:
      uploadedPhotos.length,
    driveFolderLink,
    emailNotificationSent:
      !emailError,
  };
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as Record<
        string,
        unknown
      >;

    const action =
      String(
        body.action ?? ""
      );

    if (
      action ===
      "create-upload-batch"
    ) {
      const fullName =
        String(
          body.fullName ?? ""
        ).trim();

      const files =
        Array.isArray(body.files)
          ? (body.files as UploadFileMetadata[])
          : [];

      const batch =
        await createUploadBatch(
          fullName,
          files
        );

      return NextResponse.json(
        {
          success: true,
          ...batch,
        },
        {
          status: 201,
        }
      );
    }

    if (
      action ===
      "cleanup-upload-batch"
    ) {
      const folderId =
        String(
          body.folderId ?? ""
        ).trim();

      await cleanupUploadBatch(
        folderId
      );

      return NextResponse.json({
        success: true,
      });
    }

    if (
      action ===
      "submit-contact"
    ) {
      const result =
        await submitContact(body);

      return NextResponse.json(
        {
          success: true,
          ...result,
        },
        {
          status: 201,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid contact API action.",
      },
      {
        status: 400,
      }
    );

  } catch (error) {
    console.error(
      "Contact submission error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while processing the submission.",
      },
      {
        status: 500,
      }
    );
  }
}