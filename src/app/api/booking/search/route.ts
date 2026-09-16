import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import {
  getGuestyListings,
  type GuestyListing,
} from "@/lib/guesty/listings";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type EnabledPropertyRow = {
  id: number;
  guesty_listing_id: string;
};

const GUESTY_SEARCH_FIELDS = [
  "_id",
  "title",
  "nickname",
  "type",
  "bedrooms",
  "bathrooms",
  "accommodates",
  "amenities",
  "address",
  "pictures",
  "prices",
  "totalPrice",
] as const;

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

function isValidDate(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const date =
    new Date(
      `${value}T00:00:00Z`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  return (
    date
      .toISOString()
      .slice(0, 10) ===
    value
  );
}

function parsePositiveInteger(
  value: string | null
) {
  if (!value) {
    return undefined;
  }

  const parsed =
    Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    return null;
  }

  return parsed;
}

function parseNonNegativeNumber(
  value: string | null
) {
  if (!value) {
    return undefined;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return null;
  }

  return parsed;
}

function parseStringList(
  value: string | null
) {
  if (!value) {
    return undefined;
  }

  const items =
    value
      .split(",")
      .map((item) =>
        item.trim()
      )
      .filter(Boolean);

  return items.length
    ? items
    : undefined;
}

function normalizeText(
  value: string
) {
  return value
    .trim()
    .toLocaleLowerCase();
}

function matchesDestination(
  listing: GuestyListing,
  destination: string
) {
  const normalizedDestination =
    normalizeText(destination);

  if (!normalizedDestination) {
    return true;
  }

  const address =
    listing.address;

  const searchableValues = [
    address?.full,
    address?.city,
    address?.state,
    address?.country,
    address?.street,
    address?.zipCode,
    listing.title,
    listing.nickname,
  ]
    .filter(
      (
        value
      ): value is string =>
        typeof value ===
        "string"
    )
    .map(normalizeText);

  return searchableValues.some(
    (value) =>
      value.includes(
        normalizedDestination
      )
  );
}

function toPublicListing(
  listing: GuestyListing,
  localPropertyId: number
) {
  return {
    id:
      localPropertyId,

    guestyListingId:
      listing._id,

    title:
      listing.title ??
      null,

    nickname:
      listing.nickname ??
      null,

    type:
      listing.type ??
      null,

    bedrooms:
      listing.bedrooms ??
      null,

    bathrooms:
      listing.bathrooms ??
      null,

    accommodates:
      listing.accommodates ??
      null,

    amenities:
      Array.isArray(
        listing.amenities
      )
        ? listing.amenities
        : [],

    address: {
      full:
        listing.address
          ?.full ??
        null,

      city:
        listing.address
          ?.city ??
        null,

      state:
        listing.address
          ?.state ??
        null,

      country:
        listing.address
          ?.country ??
        null,

      street:
        listing.address
          ?.street ??
        null,

      zipCode:
        listing.address
          ?.zipCode ??
        null,

      lat:
        typeof listing.address
          ?.lat === "number"
          ? listing.address.lat
          : null,

      lng:
        typeof listing.address
          ?.lng === "number"
          ? listing.address.lng
          : null,
    },

    pictures:
      Array.isArray(
        listing.pictures
      )
        ? listing.pictures.map(
            (picture) => ({
              original:
                picture.original ??
                null,

              thumbnail:
                picture.thumbnail ??
                null,

              caption:
                picture.caption ??
                null,
            })
          )
        : [],

    currency:
      listing.prices
        ?.currency ??
      null,

    totalPrice:
      typeof listing.totalPrice ===
      "number"
        ? listing.totalPrice
        : null,
  };
}

export async function GET(
  request: NextRequest
) {
  if (!features.directBooking) {
    return NextResponse.json(
      {
        enabled: false,
        results: [],
      },
      {
        status: 404,
      }
    );
  }

  try {
    const searchParams =
      request.nextUrl
        .searchParams;

    const destination =
      searchParams
        .get("destination")
        ?.trim() ?? "";

    const checkIn =
      searchParams
        .get("checkIn")
        ?.trim() ?? "";

    const checkOut =
      searchParams
        .get("checkOut")
        ?.trim() ?? "";

    const guests =
      parsePositiveInteger(
        searchParams.get(
          "guests"
        )
      );

    const bedrooms =
      parsePositiveInteger(
        searchParams.get(
          "bedrooms"
        )
      );

    const bathrooms =
      parsePositiveInteger(
        searchParams.get(
          "bathrooms"
        )
      );

    const propertyType =
      searchParams
        .get("propertyType")
        ?.trim() || undefined;

    const minPrice =
      parseNonNegativeNumber(
        searchParams.get(
          "minPrice"
        )
      );

    const maxPrice =
      parseNonNegativeNumber(
        searchParams.get(
          "maxPrice"
        )
      );

    const currency =
      searchParams
        .get("currency")
        ?.trim()
        .toUpperCase() ||
      undefined;

    const includeAmenities =
      parseStringList(
        searchParams.get(
          "includeAmenities"
        )
      );

    const excludeAmenities =
      parseStringList(
        searchParams.get(
          "excludeAmenities"
        )
      );

    if (
      !checkIn ||
      !checkOut ||
      !isValidDate(checkIn) ||
      !isValidDate(checkOut)
    ) {
      return NextResponse.json(
        {
          error:
            "Valid check-in and check-out dates are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      checkOut <= checkIn
    ) {
      return NextResponse.json(
        {
          error:
            "Check-out must be after check-in.",
        },
        {
          status: 400,
        }
      );
    }

    if (guests === null) {
      return NextResponse.json(
        {
          error:
            "Guests must be a positive integer.",
        },
        {
          status: 400,
        }
      );
    }

    if (bedrooms === null) {
      return NextResponse.json(
        {
          error:
            "Bedrooms must be a positive integer.",
        },
        {
          status: 400,
        }
      );
    }

    if (bathrooms === null) {
      return NextResponse.json(
        {
          error:
            "Bathrooms must be a positive integer.",
        },
        {
          status: 400,
        }
      );
    }

    if (minPrice === null) {
      return NextResponse.json(
        {
          error:
            "Minimum price must be zero or greater.",
        },
        {
          status: 400,
        }
      );
    }

    if (maxPrice === null) {
      return NextResponse.json(
        {
          error:
            "Maximum price must be zero or greater.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      maxPrice < minPrice
    ) {
      return NextResponse.json(
        {
          error:
            "Maximum price must be greater than or equal to minimum price.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      (minPrice !== undefined ||
        maxPrice !== undefined) &&
      !currency
    ) {
      return NextResponse.json(
        {
          error:
            "Currency is required when filtering by price.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    /*
     * HostMetric global Direct Booking
     * switch. Fail closed.
     */
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
        settingRows[0]
          ?.setting_value
      )
    ) {
      return NextResponse.json({
        enabled: false,
        results: [],
      });
    }

    /*
     * Only Guesty listings explicitly
     * enabled by HostMetric may appear
     * on the public booking engine.
     */
    const enabledRows =
      (await sql`
        SELECT
          id,
          guesty_listing_id
        FROM guesty_properties
        WHERE
          direct_booking_enabled = TRUE
          AND sync_status = 'synced';
      `) as unknown as EnabledPropertyRow[];

    if (
      enabledRows.length === 0
    ) {
      return NextResponse.json({
        enabled: true,
        results: [],
        total: 0,
      });
    }

    const enabledProperties =
      new Map(
        enabledRows.map(
          (property) => [
            property
              .guesty_listing_id,
            property.id,
          ]
        )
      );

    /*
     * Guesty is the source of truth for
     * availability and search pricing.
     *
     * totalPrice requires explicit fields.
     * We use conservative 50-item pages
     * and follow Guesty's cursor until all
     * matching results are retrieved.
     */
    const guestyResults:
      GuestyListing[] = [];

    let cursor:
      | string
      | undefined;

    do {
      const response =
        await getGuestyListings({
          checkIn,
          checkOut,

          ...(guests
            ? {
                minOccupancy:
                  guests,
              }
            : {}),

          ...(bedrooms
            ? {
                numberOfBedrooms:
                  bedrooms,
              }
            : {}),

          ...(bathrooms
            ? {
                numberOfBathrooms:
                  bathrooms,
              }
            : {}),

          ...(propertyType
            ? {
                propertyType,
              }
            : {}),

          ...(minPrice !== undefined
            ? {
                minPrice,
              }
            : {}),

          ...(maxPrice !== undefined
            ? {
                maxPrice,
              }
            : {}),

          ...((minPrice !== undefined ||
            maxPrice !== undefined) &&
          currency
            ? {
                currency,
              }
            : {}),

          ...(includeAmenities
            ? {
                includeAmenities,
              }
            : {}),

          ...(excludeAmenities
            ? {
                excludeAmenities,
              }
            : {}),

          fields: [
            ...GUESTY_SEARCH_FIELDS,
          ],

          limit: 50,
          cursor,
        });

      guestyResults.push(
        ...response.results
      );

      cursor =
        response.pagination
          ?.cursor?.next;
    } while (cursor);

    /*
     * A listing must satisfy BOTH:
     *
     * Guesty:
     * available for the requested search.
     *
     * HostMetric:
     * synced and explicitly enabled for
     * Direct Booking.
     */
    const results =
      guestyResults
        .filter((listing) =>
          enabledProperties.has(
            listing._id
          )
        )
        .filter((listing) =>
          matchesDestination(
            listing,
            destination
          )
        )
        .map((listing) =>
          toPublicListing(
            listing,
            enabledProperties.get(
              listing._id
            )!
          )
        );

    return NextResponse.json({
      enabled: true,

      search: {
        destination:
          destination ||
          null,

        checkIn,
        checkOut,

        guests:
          guests ?? null,

        bedrooms:
          bedrooms ?? null,

        bathrooms:
          bathrooms ?? null,

        propertyType:
          propertyType ?? null,

        minPrice:
          minPrice ?? null,

        maxPrice:
          maxPrice ?? null,

        currency:
          currency ?? null,

        includeAmenities:
          includeAmenities ?? [],

        excludeAmenities:
          excludeAmenities ?? [],
      },

      total:
        results.length,

      results,
    });
  } catch (error) {
    console.error(
      "Failed to search Guesty booking properties.",
      error
    );

    return NextResponse.json(
      {
        enabled: false,
        results: [],
        error:
          "Unable to search available properties.",
      },
      {
        status: 500,
      }
    );
  }
}