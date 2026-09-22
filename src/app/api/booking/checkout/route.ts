import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { getGuestyQuote } from "@/lib/guesty/quotes";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;
};

type BookingSessionRow = {
  id: number;
  guesty_property_id: number;
  guesty_listing_id: string;
  quote_id: string;
  status: string;
  expires_at: string | Date;
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

function requireString(
  value: unknown
) {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}

function isRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getQuoteId(
  quote: unknown
) {
  if (!isRecord(quote)) {
    return null;
  }

  return (
    requireString(
      quote._id
    ) ??
    requireString(
      quote.id
    )
  );
}

function getQuoteListingId(
  quote: unknown
) {
  if (!isRecord(quote)) {
    return null;
  }

  return requireString(
    quote.listingId
  );
}

function getRatePlans(
  quote: unknown
) {
  if (!isRecord(quote)) {
    return [];
  }

  const rates =
    quote.rates;

  if (!isRecord(rates)) {
    return [];
  }

  const ratePlans =
    rates.ratePlans;

  return Array.isArray(ratePlans)
    ? ratePlans
    : [];
}

function getRatePlanId(
  ratePlan: unknown
) {
  if (!isRecord(ratePlan)) {
    return null;
  }

  return (
    requireString(
      ratePlan._id
    ) ??
    requireString(
      ratePlan.id
    )
  );
}

function getRatePlanName(
  ratePlan: unknown
) {
  if (!isRecord(ratePlan)) {
    return null;
  }

  return requireString(
    ratePlan.name
  );
}

function getRatePlanType(
  ratePlan: unknown
) {
  if (!isRecord(ratePlan)) {
    return null;
  }

  return requireString(
    ratePlan.type
  );
}

function getRatePlanMoney(
  ratePlan: unknown
) {
  if (!isRecord(ratePlan)) {
    return null;
  }

  const money =
    ratePlan.money;

  if (!isRecord(money)) {
    return null;
  }

  const hostPayout =
    money.hostPayout;

  const currency =
    requireString(
      money.currency
    );

  if (
    typeof hostPayout !==
      "number" ||
    !Number.isFinite(
      hostPayout
    ) ||
    hostPayout < 0 ||
    !currency
  ) {
    return null;
  }

  return {
    amount: hostPayout,
    currency:
      currency.toUpperCase(),
  };
}

export async function GET(
  request: NextRequest
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
    const propertyId =
      Number(
        request.nextUrl.searchParams.get(
          "propertyId"
        )
      );

    const bookingSessionToken =
      requireString(
        request.nextUrl.searchParams.get(
          "bookingSessionToken"
        )
      );

    const quoteId =
      requireString(
        request.nextUrl.searchParams.get(
          "quoteId"
        )
      );

    const ratePlanId =
      requireString(
        request.nextUrl.searchParams.get(
          "ratePlanId"
        )
      );

    if (
      !Number.isInteger(
        propertyId
      ) ||
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

    if (!bookingSessionToken) {
      return NextResponse.json(
        {
          error:
            "Booking session token is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!quoteId) {
      return NextResponse.json(
        {
          error:
            "Quote ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ratePlanId) {
      return NextResponse.json(
        {
          error:
            "Rate plan ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const sql =
      getSql();

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

    /*
     * The browser may display IDs, but it cannot
     * authorize checkout with Guesty IDs alone.
     *
     * The HostMetric public booking-session token
     * must match the property, listing and quote.
     */
    const sessionRows =
      (await sql`
        SELECT
          id,
          guesty_property_id,
          guesty_listing_id,
          quote_id,
          status,
          expires_at
        FROM booking_sessions
        WHERE
          public_token::text = ${bookingSessionToken}
          AND guesty_property_id = ${property.id}
          AND guesty_listing_id = ${property.guesty_listing_id}
          AND quote_id = ${quoteId}
          AND status = 'quote_created'
          AND expires_at > NOW()
        LIMIT 1;
      `) as unknown as BookingSessionRow[];

    const bookingSession =
      sessionRows[0];

    if (!bookingSession) {
      return NextResponse.json(
        {
          error:
            "Booking session is invalid, expired or already used.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Guesty remains the pricing source of truth.
     * We retrieve the quote again server-side and
     * never trust an amount/currency from the URL.
     */
    const quote =
      await getGuestyQuote(
        quoteId
      );

    const returnedQuoteId =
      getQuoteId(
        quote
      );

    if (
      returnedQuoteId &&
      returnedQuoteId !==
        quoteId
    ) {
      return NextResponse.json(
        {
          error:
            "Guesty returned a different quote.",
        },
        {
          status: 502,
        }
      );
    }

    const listingId =
      getQuoteListingId(
        quote
      );

    if (
      listingId !==
      property.guesty_listing_id
    ) {
      return NextResponse.json(
        {
          error:
            "Quote does not belong to this property.",
        },
        {
          status: 400,
        }
      );
    }

    const selectedRatePlan =
      getRatePlans(
        quote
      ).find(
        (ratePlan) =>
          getRatePlanId(
            ratePlan
          ) === ratePlanId
      );

    if (!selectedRatePlan) {
      return NextResponse.json(
        {
          error:
            "Invalid rate plan for this quote.",
        },
        {
          status: 400,
        }
      );
    }

    const money =
      getRatePlanMoney(
        selectedRatePlan
      );

    if (!money) {
      console.error(
        "Selected Guesty rate plan is missing a valid money.hostPayout or money.currency."
      );

      return NextResponse.json(
        {
          error:
            "Guesty did not return complete pricing for this rate plan.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json(
      {
        propertyId:
          property.id,

        guestyListingId:
          property.guesty_listing_id,

        bookingSessionToken,

        quoteId,

        ratePlan: {
          id:
            ratePlanId,

          name:
            getRatePlanName(
              selectedRatePlan
            ),

          type:
            getRatePlanType(
              selectedRatePlan
            ),

          amount:
            money.amount,

          currency:
            money.currency,
        },

        expiresAt:
          bookingSession.expires_at,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to load secure checkout pricing.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load checkout pricing.",
      },
      {
        status: 500,
      }
    );
  }
}
