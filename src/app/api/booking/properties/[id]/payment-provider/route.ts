import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

import { features } from "@/config/features";
import { getGuestyPaymentProvider } from "@/lib/guesty/payment-provider";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;
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

  if (
    typeof value === "string"
  ) {
    const normalized =
      value
        .trim()
        .toLowerCase();

    return (
      normalized === "true" ||
      normalized === '"true"'
    );
  }

  return false;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  if (!features.directBooking) {
    return NextResponse.json(
      {
        error:
          "Direct booking is not available.",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const { id } =
      await context.params;

    const propertyId =
      Number(id);

    if (
      !Number.isInteger(propertyId) ||
      propertyId < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid property ID.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    const settingRows =
      (await sql`
        SELECT setting_value
        FROM guesty_settings
        WHERE setting_key =
          'direct_booking_enabled'
        LIMIT 1;
      `) as unknown as DirectBookingSettingRow[];

    const globalDirectBookingEnabled =
      parseBooleanSetting(
        settingRows[0]
          ?.setting_value
      );

    if (
      !globalDirectBookingEnabled
    ) {
      return NextResponse.json(
        {
          error:
            "Direct booking is currently disabled.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Resolve the real Guesty listing ID
     * exclusively on the server.
     */
    const propertyRows =
      (await sql`
        SELECT
          id,
          guesty_listing_id
        FROM guesty_properties
        WHERE
          id = ${propertyId}
          AND direct_booking_enabled = TRUE
          AND sync_status = 'synced'
        LIMIT 1;
      `) as unknown as GuestyPropertyRow[];

    const property =
      propertyRows[0];

    if (!property) {
      return NextResponse.json(
        {
          error:
            "Booking property not found.",
        },
        {
          status: 404,
        }
      );
    }

    const provider =
      await getGuestyPaymentProvider(
        property.guesty_listing_id
      );

    /*
     * Do not expose the complete Guesty
     * provider response publicly.
     *
     * The checkout backend can use the full
     * provider object later when tokenization
     * is implemented.
     */
    return NextResponse.json({
      propertyId:
        property.id,

      paymentAvailable:
        provider.active !== false,

      provider: {
        name:
          provider.name ??
          null,

        type:
          provider.type ??
          provider.provider ??
          null,
      },
    });
  } catch (error) {
    console.error(
      "Failed to load Guesty payment provider.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load payment configuration.",
      },
      {
        status: 500,
      }
    );
  }
}