import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { google } from "googleapis";
import { Readable } from "node:stream";

export const runtime = "nodejs";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY!);

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

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

function getDriveClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Google Drive credentials are missing.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = String(formData.get("fullName") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const propertyType = String(
      formData.get("propertyType") ?? ""
    ).trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const cityArea = String(formData.get("cityArea") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const consent = formData.get("consent") === "on";

    const photos = formData
      .getAll("photos")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (!fullName || !country || !email || !message || consent !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    if (photos.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: `You can upload up to ${MAX_FILES} photos.`,
        },
        { status: 400 }
      );
    }

    for (const photo of photos) {
      if (!ALLOWED_IMAGE_TYPES.has(photo.type)) {
        return NextResponse.json(
          {
            success: false,
            error: "Only JPG, PNG and WEBP images are allowed.",
          },
          { status: 400 }
        );
      }

      if (photo.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `Each photo must be smaller than ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
          },
          { status: 400 }
        );
      }
    }

    // Save the contact submission to Neon first.
    const result = await sql`
      INSERT INTO contact_submissions (
        full_name,
        country,
        property_type,
        email,
        phone,
        city_area,
        message,
        consent
      )
      VALUES (
        ${fullName},
        ${country},
        ${propertyType || null},
        ${email},
        ${phone || null},
        ${cityArea || null},
        ${message},
        ${consent}
      )
      RETURNING id, created_at;
    `;

    const submission = result[0];
    const uploadedPhotos: Array<{
      id: string;
      name: string;
      webViewLink: string | null;
    }> = [];

    let driveFolderLink: string | null = null;

    // Upload photos to Google Drive, when the visitor attached any.
    if (photos.length > 0) {
      const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      if (!parentFolderId) {
        throw new Error("GOOGLE_DRIVE_FOLDER_ID is missing.");
      }

      const drive = getDriveClient();

      // Create one folder for this specific contact request.
      const submissionFolder = await drive.files.create({
        requestBody: {
          name: `${submission.id} - ${fullName}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [parentFolderId],
        },
        fields: "id,name,webViewLink",
      });

      const submissionFolderId = submissionFolder.data.id;

      if (!submissionFolderId) {
        throw new Error("Could not create the Google Drive submission folder.");
      }

      driveFolderLink =
        submissionFolder.data.webViewLink ??
        `https://drive.google.com/drive/folders/${submissionFolderId}`;

      for (let index = 0; index < photos.length; index += 1) {
        const photo = photos[index];
        const originalName = safeFileName(photo.name) || `photo-${index + 1}`;
        const fileName = `${String(index + 1).padStart(2, "0")}-${originalName}`;
        const buffer = Buffer.from(await photo.arrayBuffer());

        const uploadedFile = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [submissionFolderId],
          },
          media: {
            mimeType: photo.type,
            body: Readable.from(buffer),
          },
          fields: "id,name,webViewLink",
        });

        if (uploadedFile.data.id) {
          uploadedPhotos.push({
            id: uploadedFile.data.id,
            name: uploadedFile.data.name ?? fileName,
            webViewLink:
              uploadedFile.data.webViewLink ??
              `https://drive.google.com/file/d/${uploadedFile.data.id}/view`,
          });
        }
      }
    }

    const safeFullName = escapeHtml(fullName);
    const safeCountry = escapeHtml(country);
    const safePropertyType = escapeHtml(
      propertyType || "Δεν δηλώθηκε"
    );
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Δεν δηλώθηκε");
    const safeCityArea = escapeHtml(cityArea || "Δεν δηλώθηκε");
    const safeMessage = escapeHtml(message);

    const photosHtml =
      uploadedPhotos.length > 0
        ? `
          <hr />
          <p><strong>Φωτογραφίες:</strong> ${uploadedPhotos.length}</p>
          ${
            driveFolderLink
              ? `<p><a href="${driveFolderLink}">Άνοιγμα φακέλου φωτογραφιών στο Google Drive</a></p>`
              : ""
          }
          <ul>
            ${uploadedPhotos
              .map(
                (photo) =>
                  `<li><a href="${photo.webViewLink}">${escapeHtml(photo.name)}</a></li>`
              )
              .join("")}
          </ul>
        `
        : `
          <hr />
          <p><strong>Φωτογραφίες:</strong> Δεν επισυνάφθηκαν</p>
        `;

    // Send notification email to HostMetric.
    const { error: emailError } = await resend.emails.send({
      from: "HostMetric Website <notifications@hostmetric.gr>",
      to: ["info@hostmetric.gr"],
      replyTo: email,
      subject: `Νέο αίτημα από ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
          <h2>Νέο αίτημα μέσω HostMetric</h2>

          <p>
            Υποβλήθηκε νέο αίτημα μέσω της φόρμας επικοινωνίας του hostmetric.gr.
          </p>

          <hr />

          <p><strong>Ονοματεπώνυμο:</strong> ${safeFullName}</p>
          <p><strong>Χώρα ακινήτου:</strong> ${safeCountry}</p>
          <p><strong>Τύπος ακινήτου:</strong> ${safePropertyType}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Τηλέφωνο:</strong> ${safePhone}</p>
          <p><strong>Πόλη / Περιοχή:</strong> ${safeCityArea}</p>

          <hr />

          <p><strong>Μήνυμα:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>

          ${photosHtml}

          <hr />

          <p style="font-size: 12px; color: #777;">
            Submission ID: ${submission.id}
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend notification error:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        submission,
        uploadedPhotos: uploadedPhotos.length,
        driveFolderLink,
        emailNotificationSent: !emailError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while processing the submission.",
      },
      { status: 500 }
    );
  }
}