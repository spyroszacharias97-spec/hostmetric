import { google } from "googleapis";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

async function requireAdmin() {
  const session = await auth();

  return Boolean(
    session?.user?.email
  );
}

function getGoogleCredentials(): ServiceAccountCredentials {
  const raw =
    process.env
      .GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing."
    );
  }

  let parsed: ServiceAccountCredentials;

  try {
    parsed =
      JSON.parse(
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
    client_email:
      parsed.client_email,

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
    email:
      credentials.client_email,

    key:
      credentials.private_key,

    scopes: [
      "https://www.googleapis.com/auth/drive",
    ],
  });
}

function getGuidesFolderId() {
  const folderId =
    process.env
      .GOOGLE_GUIDES_FOLDER_ID
      ?.trim();

  if (!folderId) {
    throw new Error(
      "GOOGLE_GUIDES_FOLDER_ID is missing."
    );
  }

  return folderId;
}

function safeFileName(
  value: string
) {
  return value
    .normalize("NFKD")
    .replace(
      /[^a-zA-Z0-9._-]+/g,
      "-"
    )
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export async function POST(
  request: Request
) {
  try {
    if (
      !(await requireAdmin())
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const folderId =
      getGuidesFolderId();

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const slug =
      safeFileName(
        String(
          formData.get(
            "slug"
          ) ?? "guide"
        )
      );

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing image file.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size <= 0 ||
      file.size >
        MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The image must be smaller than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const googleAuth =
      getGoogleAuth();

    const accessTokenResponse =
      await googleAuth
        .getAccessToken();

    const accessToken =
      accessTokenResponse.token;

    if (!accessToken) {
      throw new Error(
        "Could not obtain a Google access token."
      );
    }

    const extension =
      file.type ===
      "image/webp"
        ? "webp"
        : file.type ===
            "image/png"
          ? "png"
          : "jpg";

    const storedName =
      `${slug || "guide"}-${Date.now()}.${extension}`;

    const initiationUrl =
      new URL(
        "https://www.googleapis.com/upload/drive/v3/files"
      );

    initiationUrl
      .searchParams
      .set(
        "uploadType",
        "resumable"
      );

    initiationUrl
      .searchParams
      .set(
        "supportsAllDrives",
        "true"
      );

    initiationUrl
      .searchParams
      .set(
        "fields",
        "id,name,mimeType,size"
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
              String(
                file.size
              ),
          },

          body:
            JSON.stringify({
              name:
                storedName,

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
      initiationResponse
        .headers
        .get("location");

    if (!uploadUrl) {
      throw new Error(
        "Google Drive did not return an upload URL."
      );
    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const uploadResponse =
      await fetch(
        uploadUrl,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              file.type,

            "Content-Length":
              String(
                file.size
              ),
          },

          body:
            buffer,
        }
      );

    if (
      !uploadResponse.ok
    ) {
      const details =
        await uploadResponse.text();

      throw new Error(
        `Google Drive upload failed (${uploadResponse.status}): ${details}`
      );
    }

    const uploaded =
      (await uploadResponse.json()) as {
        id?: string;
      };

    if (!uploaded.id) {
      throw new Error(
        "Google Drive did not return a file ID."
      );
    }

    return NextResponse.json({
      success: true,

      fileId:
        uploaded.id,

      url:
        `/api/guides/images/${uploaded.id}`,

      storedName,
    });
  } catch (error) {
    console.error(
      "[admin/guides/images] upload failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}