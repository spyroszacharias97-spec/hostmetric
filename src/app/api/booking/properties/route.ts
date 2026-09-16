import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

import { features } from "@/config/features";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;

  title: string | null;
  nickname: string | null;
  listing_type: string | null;

  bedrooms: string | number | null;
  bathrooms: string | number | null;
  accommodates: number | null;

  city: string | null;
  state: string | null;
  country: string | null;

  currency: string | null;

  sync_status: string;
  last_synced_at: string | null;

  guesty_data: unknown;
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

export async function GET() {
  /*
   * Deployment-level safety gate.
   *
   * At the moment direct booking is enabled
   * only outside production.
   */
  if (!features.directBooking) {
    return NextResponse.json(
      {
        enabled: false,
        properties: [],
      },
      {
        status: 404,
      }
    );
  }

  try {
    const sql = getSql();

    /*
     * Global Direct Booking switch.
     *
     * Fail closed:
     * if the setting does not exist or cannot
     * be interpreted as true, no properties
     * are exposed publicly.
     */
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
      return NextResponse.json({
        enabled: false,
        properties: [],
      });
    }

    /*
     * Only properties that are:
     *
     * 1. explicitly enabled for direct booking
     * 2. successfully synced with Guesty
     *
     * may be exposed to the public booking flow.
     */
    const properties =
      (await sql`
        SELECT
          id,
          guesty_listing_id,
          title,
          nickname,
          listing_type,
          bedrooms,
          bathrooms,
          accommodates,
          city,
          state,
          country,
          currency,
          sync_status,
          last_synced_at,
          guesty_data
        FROM guesty_properties
        WHERE
          direct_booking_enabled = TRUE
          AND sync_status = 'synced'
        ORDER BY
          COALESCE(
            nickname,
            title,
            guesty_listing_id
          ) ASC;
      `) as unknown as GuestyPropertyRow[];

    return NextResponse.json({
      enabled: true,

      properties:
        properties.map(
          (property) => ({
            id:
              property.id,

            guestyListingId:
              property
                .guesty_listing_id,

            name:
              property.nickname ??
              property.title ??
              "Guesty Property",

            title:
              property.title,

            nickname:
              property.nickname,

            listingType:
              property.listing_type,

            bedrooms:
              property.bedrooms ===
                null
                ? null
                : Number(
                    property.bedrooms
                  ),

            bathrooms:
              property.bathrooms ===
                null
                ? null
                : Number(
                    property.bathrooms
                  ),

            accommodates:
              property.accommodates,

            location: {
              city:
                property.city,

              state:
                property.state,

              country:
                property.country,
            },

            currency:
              property.currency,

            lastSyncedAt:
              property.last_synced_at,

            guestyData:
              property.guesty_data,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Failed to load public Guesty properties.",
      error
    );

    return NextResponse.json(
      {
        enabled: false,
        properties: [],
        error:
          "Unable to load booking properties.",
      },
      {
        status: 500,
      }
    );
  }
}