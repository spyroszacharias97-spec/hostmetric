import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { getGuestyListing } from "@/lib/guesty/listings";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getSql() {
  const databaseUrl =
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function parseBooleanSetting(value: unknown) {
  if (value === true) return true;
  if (value === false) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    return (
      normalized === "true" ||
      normalized === '"true"'
    );
  }

  return false;
}

function parsePropertyId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}

function asRecord(
  value: unknown
): Record<string, unknown> | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string"
    ? value
    : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function getPictures(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const picture = asRecord(item);

      if (!picture) {
        return null;
      }

      const original = asString(
        picture.original
      );

      const thumbnail = asString(
        picture.thumbnail
      );

      if (!original && !thumbnail) {
        return null;
      }

      return {
        original,
        thumbnail,
        caption: asString(
          picture.caption
        ),
      };
    })
    .filter(
      (
        picture
      ): picture is {
        original: string | null;
        thumbnail: string | null;
        caption: string | null;
      } => picture !== null
    );
}

export async function GET(
  _request: NextRequest,
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
    const { id } = await context.params;
    const propertyId = parsePropertyId(id);

    if (!propertyId) {
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

    if (
      !parseBooleanSetting(
        settingRows[0]?.setting_value
      )
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
     * Resolve the Guesty listing ID only from
     * HostMetric's enabled/synced property row.
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

    const property = propertyRows[0];

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

    /*
     * Guesty is the source of truth for
     * the live public listing details.
     */
    const listing =
      await getGuestyListing(
        property.guesty_listing_id
      );

    const raw = asRecord(listing) ?? {};
    const address =
      asRecord(raw.address) ?? {};

    return NextResponse.json({
      property: {
        id: property.id,

        guestyListingId:
          property.guesty_listing_id,

        title: asString(
          raw.title
        ),

        nickname: asString(
          raw.nickname
        ),

        type: asString(
          raw.type
        ),

        description: asString(
          raw.description
        ),

        bedrooms: asNumber(
          raw.bedrooms
        ),

        bathrooms: asNumber(
          raw.bathrooms
        ),

        accommodates: asNumber(
          raw.accommodates
        ),

        amenities: asStringArray(
          raw.amenities
        ),

        pictures: getPictures(
          raw.pictures
        ),

        address: {
          full: asString(
            address.full
          ),

          city: asString(
            address.city
          ),

          state: asString(
            address.state
          ),

          country: asString(
            address.country
          ),

          street: asString(
            address.street
          ),

          zipCode:
            asString(
              address.zipCode
            ) ??
            asString(
              address.zipcode
            ),

          lat: asNumber(
            address.lat
          ),

          lng: asNumber(
            address.lng
          ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Failed to load Guesty booking property details.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load booking property.",
      },
      {
        status: 500,
      }
    );
  }
}
