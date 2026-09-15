import {
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  neon,
} from "@neondatabase/serverless";

import {
  auth,
} from "@/auth";


export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";


const DIRECT_BOOKING_SETTING =
  "direct_booking_enabled";


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


function parseBooleanSetting(
  value: unknown
) {
  if (
    value === true ||
    value === "true"
  ) {
    return true;
  }

  return false;
}


export async function GET() {
  try {
    const session =
      await auth();


    if (
      !session?.user?.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }


    const sql =
      getSql();


    const rows =
      await sql`
        SELECT
          setting_value,
          updated_at
        FROM
          guesty_settings
        WHERE
          setting_key =
            ${DIRECT_BOOKING_SETTING}
        LIMIT 1;
      `;


    const row =
      rows[0];


    /*
     * Fail closed.
     *
     * If the setting does not exist for any
     * reason, direct booking remains OFF.
     */
    const directBookingEnabled =
      row
        ? parseBooleanSetting(
            row.setting_value
          )
        : false;


    return NextResponse.json(
      {
        success: true,

        settings: {
          directBookingEnabled,

          updatedAt:
            row?.updated_at ??
            null,
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "[admin-guesty-settings] Get settings error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not load Guesty settings.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function PATCH(
  request: Request
) {
  try {
    const session =
      await auth();


    if (
      !session?.user?.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }


    const payload =
      (await request
        .json()
        .catch(() => null)) as
        | {
            directBookingEnabled?:
              unknown;
          }
        | null;


    if (
      typeof payload?.directBookingEnabled !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "directBookingEnabled must be a boolean.",
        },
        {
          status: 400,
        }
      );
    }


    const directBookingEnabled =
      payload.directBookingEnabled;


    const sql =
      getSql();


    const value =
      directBookingEnabled
        ? "true"
        : "false";


    const rows =
      await sql`
        INSERT INTO guesty_settings (
          setting_key,
          setting_value,
          created_at,
          updated_at
        )
        VALUES (
          ${DIRECT_BOOKING_SETTING},
          ${value}::jsonb,
          NOW(),
          NOW()
        )

        ON CONFLICT (
          setting_key
        )

        DO UPDATE SET
          setting_value =
            EXCLUDED.setting_value,

          updated_at =
            NOW()

        RETURNING
          setting_value,
          updated_at;
      `;


    const row =
      rows[0];


    if (!row) {
      throw new Error(
        "Direct booking setting could not be updated."
      );
    }


    revalidatePath(
      "/admin/guesty-properties"
    );

    revalidatePath(
      "/book"
    );

    revalidatePath(
      "/"
    );


    return NextResponse.json({
      success: true,

      settings: {
        directBookingEnabled:
          parseBooleanSetting(
            row.setting_value
          ),

        updatedAt:
          row.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "[admin-guesty-settings] Update settings error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not update Guesty settings.",
      },
      {
        status: 500,
      }
    );
  }
}