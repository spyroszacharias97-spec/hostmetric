import { google } from "googleapis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

type RouteContext = {
  params: Promise<{
    fileId: string;
  }>;
};

function getGoogleCredentials(): ServiceAccountCredentials {
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing."
    );
  }

  const parsed =
    JSON.parse(raw) as ServiceAccountCredentials;

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
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
}

function validDriveFileId(
  value: string
) {
  return /^[A-Za-z0-9_-]+$/.test(
    value
  );
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { fileId } =
      await context.params;

    if (
      !fileId ||
      !validDriveFileId(fileId)
    ) {
      return NextResponse.json(
        { error: "Invalid image id." },
        { status: 400 }
      );
    }

    const auth = getGoogleAuth();
    const accessTokenResponse =
      await auth.getAccessToken();

    const accessToken =
      accessTokenResponse.token;

    if (!accessToken) {
      throw new Error(
        "Could not obtain a Google access token."
      );
    }

    const metadataResponse =
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
          fileId
        )}?fields=mimeType,name&supportsAllDrives=true`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    if (!metadataResponse.ok) {
      return NextResponse.json(
        { error: "Image not found." },
        { status: 404 }
      );
    }

    const metadata =
      (await metadataResponse.json()) as {
        mimeType?: string;
      };

    if (
      !metadata.mimeType?.startsWith(
        "image/"
      )
    ) {
      return NextResponse.json(
        { error: "File is not an image." },
        { status: 415 }
      );
    }

    const mediaResponse =
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
          fileId
        )}?alt=media&supportsAllDrives=true`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: "Image not found." },
        { status: 404 }
      );
    }

    const bytes =
      await mediaResponse.arrayBuffer();

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type":
          metadata.mimeType,
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error(
      "[guides/images] read failed:",
      error
    );

    return NextResponse.json(
      { error: "Image unavailable." },
      { status: 500 }
    );
  }
}
