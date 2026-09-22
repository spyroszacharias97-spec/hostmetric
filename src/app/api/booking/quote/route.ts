import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import {
  createGuestyQuote,
  type GuestyGuestBreakdown,
} from "@/lib/guesty/quotes";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;
};

type QuoteRequestBody = {
  propertyId?: unknown;
  checkInDate?: unknown;
  checkOutDate?: unknown;
  guestsCount?: unknown;

  numberOfGuests?: {
    adults?: unknown;
    children?: unknown;
    infants?: unknown;
    pets?: unknown;
  };

  coupons?: unknown;
};

type GuestyQuoteForSession = Awaited<
  ReturnType<typeof createGuestyQuote>
> & {
  _id?: string;
  id?: string;
  expiresAt?: string;
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
  if (value === true) return true;
  if (value === false) return false;

  if (typeof value === "string") {
    const normalized =
      value.trim().toLowerCase();

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

function parseOptionalGuestCount(
  value: unknown
) {
  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function parseGuestBreakdown(
  value:
    QuoteRequestBody["numberOfGuests"]
): GuestyGuestBreakdown | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const adults =
    parseOptionalGuestCount(
      value.adults
    );

  const children =
    parseOptionalGuestCount(
      value.children
    );

  const infants =
    parseOptionalGuestCount(
      value.infants
    );

  const pets =
    parseOptionalGuestCount(
      value.pets
    );

  if (
    adults === null ||
    children === null ||
    infants === null ||
    pets === null
  ) {
    return null;
  }

  return {
    ...(adults !== undefined
      ? { adults }
      : {}),

    ...(children !== undefined
      ? { children }
      : {}),

    ...(infants !== undefined
      ? { infants }
      : {}),

    ...(pets !== undefined
      ? { pets }
      : {}),
  };
}

function parseCoupons(
  value: unknown
) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const coupons =
    value
      .filter(
        (
          coupon
        ): coupon is string =>
          typeof coupon ===
          "string"
      )
      .map((coupon) =>
        coupon.trim()
      )
      .filter(Boolean);

  if (
    coupons.length !==
    value.length
  ) {
    return null;
  }

  return coupons;
}

function getQuoteId(
  quote: GuestyQuoteForSession
) {
  const value =
    quote._id ?? quote.id;

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}

function getSessionExpiry(
  quote: GuestyQuoteForSession
) {
  if (
    typeof quote.expiresAt ===
    "string"
  ) {
    const expiresAt =
      new Date(
        quote.expiresAt
      );

    if (
      !Number.isNaN(
        expiresAt.getTime()
      ) &&
      expiresAt.getTime() >
        Date.now()
    ) {
      return expiresAt;
    }
  }

  return new Date(
    Date.now() +
      24 * 60 * 60 * 1000
  );
}

export async function POST(
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
    const body =
      (await request.json()) as QuoteRequestBody;

    const propertyId =
      typeof body.propertyId ===
      "number"
        ? body.propertyId
        : Number(
            body.propertyId
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

    if (
      typeof body.checkInDate !==
        "string" ||
      !isValidDate(
        body.checkInDate
      )
    ) {
      return NextResponse.json(
        {
          error:
            "A valid check-in date is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.checkOutDate !==
        "string" ||
      !isValidDate(
        body.checkOutDate
      )
    ) {
      return NextResponse.json(
        {
          error:
            "A valid check-out date is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      body.checkOutDate <=
      body.checkInDate
    ) {
      return NextResponse.json(
        {
          error:
            "Check-out date must be after check-in date.",
        },
        {
          status: 400,
        }
      );
    }

    const guestsCount =
      typeof body.guestsCount ===
      "number"
        ? body.guestsCount
        : Number(
            body.guestsCount
          );

    if (
      !Number.isInteger(
        guestsCount
      ) ||
      guestsCount < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Guest count must be at least 1.",
        },
        {
          status: 400,
        }
      );
    }

    const numberOfGuests =
      parseGuestBreakdown(
        body.numberOfGuests
      );

    if (
      numberOfGuests === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid guest breakdown.",
        },
        {
          status: 400,
        }
      );
    }

    const coupons =
      parseCoupons(
        body.coupons
      );

    if (coupons === null) {
      return NextResponse.json(
        {
          error:
            "Coupons must be an array of strings.",
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

    const quote =
      (await createGuestyQuote({
        listingId:
          property.guesty_listing_id,

        checkInDate:
          body.checkInDate,

        checkOutDate:
          body.checkOutDate,

        guestsCount,

        ...(numberOfGuests
          ? {
              numberOfGuests,
            }
          : {}),

        ...(coupons?.length
          ? {
              coupons,
            }
          : {}),
      })) as GuestyQuoteForSession;

    const quoteId =
      getQuoteId(quote);

    if (!quoteId) {
      console.error(
        "Guesty quote response did not include a quote ID."
      );

      return NextResponse.json(
        {
          error:
            "Unable to initialize booking session.",
        },
        {
          status: 502,
        }
      );
    }

    const expiresAt =
      getSessionExpiry(
        quote
      );

    /*
     * The selected rate plan and guest email
     * do not exist yet at quote creation time.
     * They are bound to this session later,
     * during the reservation step.
     *
     * The public token is the capability the
     * browser must present. Guesty IDs alone
     * are never treated as authorization.
     */
    const sessionRows =
      (await sql`
        INSERT INTO booking_sessions (
          guesty_property_id,
          guesty_listing_id,
          quote_id,
          rate_plan_id,
          guest_email,
          status,
          expires_at
        )
        VALUES (
          ${property.id},
          ${property.guesty_listing_id},
          ${quoteId},
          '',
          '',
          'quote_created',
          ${expiresAt.toISOString()}
        )
        RETURNING
          public_token,
          expires_at;
      `) as unknown as Array<{
        public_token: string;
        expires_at: string | Date;
      }>;

    const bookingSession =
      sessionRows[0];

    if (
      !bookingSession
        ?.public_token
    ) {
      throw new Error(
        "Booking session was not created."
      );
    }

    return NextResponse.json({
      propertyId:
        property.id,

      bookingSessionToken:
        bookingSession.public_token,

      bookingSessionExpiresAt:
        bookingSession.expires_at,

      quote,
    });
  } catch (error) {
    console.error(
      "Failed to create Guesty booking quote.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create booking quote.",
      },
      {
        status: 500,
      }
    );
  }
}
