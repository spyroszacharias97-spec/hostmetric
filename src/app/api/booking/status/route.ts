import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

import { features } from "@/config/features";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

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
  if (value === true) {
    return true;
  }

  if (value === false) {
    return false;
  }

  if (typeof value === "string") {
    return (
      value.trim().toLowerCase() ===
      "true"
    );
  }

  return false;
}

export async function GET() {
  /*
   * Deployment gate first.
   *
   * Development / localhost:
   * features.directBooking = true
   *
   * Production:
   * features.directBooking = false
   * until we intentionally open it.
   */
  if (!features.directBooking) {
    return NextResponse.json(
      {
        enabled: false,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  try {
    const sql = getSql();

    const rows =
      (await sql`
        SELECT
          setting_value
        FROM guesty_settings
        WHERE setting_key =
          'direct_booking_enabled'
        LIMIT 1;
      `) as unknown as DirectBookingSettingRow[];

    const enabled =
      parseBooleanSetting(
        rows[0]?.setting_value
      );

    return NextResponse.json(
      {
        enabled,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Direct booking status error:",
      error
    );

    /*
     * Fail closed:
     * if the setting cannot be read,
     * the public booking navigation
     * stays hidden.
     */
    return NextResponse.json(
      {
        enabled: false,
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
