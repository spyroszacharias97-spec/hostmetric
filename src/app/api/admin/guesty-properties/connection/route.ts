import {
  NextResponse,
} from "next/server";

import {
  neon,
} from "@neondatabase/serverless";

import {
  auth,
} from "@/auth";

import {
  clearGuestyAccessTokenCache,
} from "@/lib/guesty/auth";

import {
  guestyConfig,
} from "@/lib/guesty/config";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function getSql() {
  const databaseUrl =
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing."
    );
  }

  return neon(databaseUrl);
}

function stringValue(
  value: unknown
) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(
  request: Request
) {
  const session =
    await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body =
      await request.json();

    const clientId =
      stringValue(
        body?.clientId
      );

    const clientSecret =
      stringValue(
        body?.clientSecret
      );

    if (
      !clientId ||
      !clientSecret
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Client ID and Client Secret are required.",
        },
        {
          status: 400,
        }
      );
    }

    const tokenBody =
      new URLSearchParams({
        grant_type:
          "client_credentials",

        scope:
          "booking_engine:api",

        client_id:
          clientId,

        client_secret:
          clientSecret,
      });

    const tokenResponse =
      await fetch(
        guestyConfig.authUrl,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/x-www-form-urlencoded",

            "Cache-Control":
              "no-cache",
          },

          body:
            tokenBody,

          cache:
            "no-store",
        }
      );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Guesty rejected the Client ID or Client Secret.",
        },
        {
          status: 400,
        }
      );
    }

    const tokenData =
      (await tokenResponse.json()) as {
        access_token?: unknown;
      };

    if (
      typeof tokenData.access_token !==
        "string" ||
      !tokenData.access_token
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Guesty returned an invalid authentication response.",
        },
        {
          status: 502,
        }
      );
    }

    const sql =
      getSql();

    await sql`
      INSERT INTO guesty_connection (
        id,
        client_id,
        client_secret,
        connection_status,
        last_connected_at,
        last_error,
        created_at,
        updated_at
      )
      VALUES (
        1,
        ${clientId},
        ${clientSecret},
        'connected',
        NOW(),
        NULL,
        NOW(),
        NOW()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        client_id =
          EXCLUDED.client_id,

        client_secret =
          EXCLUDED.client_secret,

        connection_status =
          'connected',

        last_connected_at =
          NOW(),

        last_error =
          NULL,

        updated_at =
          NOW();
    `;

    clearGuestyAccessTokenCache();

    return NextResponse.json({
      success: true,
      connected: true,
    });
  } catch (error) {
    console.error(
      "Guesty connection failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not connect Guesty.",
      },
      {
        status: 500,
      }
    );
  }
}
