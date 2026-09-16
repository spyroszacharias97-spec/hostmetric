import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { getGuestyQuote } from "@/lib/guesty/quotes";
import { createGuestyInstantChargeReservation } from "@/lib/guesty/reservations";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;
};

type ReservationRequestBody = {
  propertyId?: unknown;

  quoteId?: unknown;
  ratePlanId?: unknown;

  initialPaymentMethodId?: unknown;

  guest?: {
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
    phone?: unknown;
  };
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

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

function getQuoteRatePlanIds(
  quote: Awaited<
    ReturnType<
      typeof getGuestyQuote
    >
  >
) {
  return (
    quote.rates
      ?.ratePlans ??
    []
  )
    .map(
      (ratePlan) =>
        ratePlan._id ??
        ratePlan.id
    )
    .filter(
      (
        value
      ): value is string =>
        typeof value ===
          "string" &&
        Boolean(
          value.trim()
        )
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
      (await request.json()) as ReservationRequestBody;

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

    const quoteId =
      requireString(
        body.quoteId
      );

    const ratePlanId =
      requireString(
        body.ratePlanId
      );

    const initialPaymentMethodId =
      requireString(
        body.initialPaymentMethodId
      );

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

    if (
      !initialPaymentMethodId
    ) {
      return NextResponse.json(
        {
          error:
            "GuestyPay payment method is required.",
        },
        {
          status: 400,
        }
      );
    }

    const firstName =
      requireString(
        body.guest
          ?.firstName
      );

    const lastName =
      requireString(
        body.guest
          ?.lastName
      );

    const email =
      requireString(
        body.guest?.email
      );

    const phone =
      requireString(
        body.guest?.phone
      );

    if (
      !firstName ||
      !lastName ||
      !email
    ) {
      return NextResponse.json(
        {
          error:
            "Guest first name, last name and email are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isValidEmail(email)
    ) {
      return NextResponse.json(
        {
          error:
            "A valid guest email is required.",
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

    /*
     * Retrieve the quote directly from Guesty.
     *
     * This prevents the browser from choosing
     * an arbitrary rate plan or pairing a quote
     * with a different listing.
     */
    const quote =
      await getGuestyQuote(
        quoteId
      );

    if (
      quote.listingId !==
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

    const validRatePlanIds =
      getQuoteRatePlanIds(
        quote
      );

    if (
      !validRatePlanIds.includes(
        ratePlanId
      )
    ) {
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

    /*
     * GuestyPay:
     *
     * The browser obtains this payment method ID
     * from the GuestyPay SDK.
     *
     * Raw card details never reach this route.
     */
    const reservation =
      await createGuestyInstantChargeReservation(
        {
          quoteId,
          ratePlanId,

          initialPaymentMethodId,

          guest: {
            firstName,
            lastName,
            email,

            ...(phone
              ? {
                  phone,
                }
              : {}),
          },
        }
      );

    return NextResponse.json({
      reservation,
    });
  } catch (error) {
    console.error(
      "Failed to create Guesty reservation.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to complete reservation.",
      },
      {
        status: 500,
      }
    );
  }
}