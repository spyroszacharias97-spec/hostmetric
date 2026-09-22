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

type BookingSessionRow = {
  id: number;
  guesty_property_id: number;
  guesty_listing_id: string;
  quote_id: string;
  status: string;
  expires_at: string | Date;
};

type ReservationRequestBody = {
  propertyId?: unknown;

  bookingSessionToken?: unknown;

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

function getReservationId(
  reservation: unknown
) {
  if (!isRecord(reservation)) {
    return null;
  }

  return (
    requireString(
      reservation._id
    ) ??
    requireString(
      reservation.id
    )
  );
}

function getReservationStatus(
  reservation: unknown
) {
  if (!isRecord(reservation)) {
    return null;
  }

  return requireString(
    reservation.status
  );
}

type PendingAuthPayment = {
  paymentId: string;
  threeDSChallenge: Record<string, unknown> | null;
};

function findThreeDSChallenge(
  value: unknown
): Record<string, unknown> | null {
  if (!isRecord(value)) {
    return null;
  }

  const directChallenge =
    value.threeDSChallenge;

  if (isRecord(directChallenge)) {
    return directChallenge;
  }

  for (const nestedValue of Object.values(value)) {
    if (isRecord(nestedValue)) {
      const nestedChallenge =
        findThreeDSChallenge(nestedValue);

      if (nestedChallenge) {
        return nestedChallenge;
      }
    }
  }

  return null;
}

function getPendingAuthPayment(
  reservation: unknown
): PendingAuthPayment | null {
  if (!isRecord(reservation)) {
    return null;
  }

  const money =
    reservation.money;

  if (!isRecord(money)) {
    return null;
  }

  const payments =
    money.payments;

  if (!Array.isArray(payments)) {
    return null;
  }

  for (
    const payment of payments
  ) {
    if (!isRecord(payment)) {
      continue;
    }

    const status =
      requireString(
        payment.status
      );

    if (
      status?.toUpperCase() !==
      "PENDING_AUTH"
    ) {
      continue;
    }

    const paymentId =
      requireString(
        payment._id
      ) ??
      requireString(
        payment.id
      );

    if (paymentId) {
      return {
        paymentId,
        threeDSChallenge:
          findThreeDSChallenge(payment),
      };
    }
  }

  return null;
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

    const bookingSessionToken =
      requireString(
        body.bookingSessionToken
      );

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
     * The browser must prove possession of the
     * HostMetric booking-session token.
     *
     * Guesty quote/reservation IDs alone are
     * never treated as authorization.
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
     * Atomically claim the booking session before
     * calling Guesty. This prevents two concurrent
     * browser requests from using the same quote.
     */
    const claimedRows =
      (await sql`
        UPDATE booking_sessions
        SET
          rate_plan_id = ${ratePlanId},
          guest_email = ${email.toLowerCase()},
          status = 'payment_pending',
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id}
          AND status = 'quote_created'
          AND expires_at > NOW()
        RETURNING id;
      `) as unknown as Array<{
        id: number;
      }>;

    if (!claimedRows[0]) {
      return NextResponse.json(
        {
          error:
            "Booking session is already being processed.",
        },
        {
          status: 409,
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
    let reservation: Awaited<
      ReturnType<
        typeof createGuestyInstantChargeReservation
      >
    >;

    try {
      reservation =
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
    } catch (error) {
      /*
       * The session was claimed before the Guesty call.
       * If instant-charge fails, do not leave it stuck
       * forever in payment_pending and do not reopen it
       * for an unsafe blind payment retry.
       */
      await sql`
        UPDATE booking_sessions
        SET
          status = 'failed',
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id}
          AND status = 'payment_pending'
          AND reservation_id IS NULL;
      `;

      throw error;
    }

    const reservationId =
      getReservationId(
        reservation
      );

    if (!reservationId) {
      console.error(
        "Guesty instant-charge response did not include a reservation ID."
      );

      await sql`
        UPDATE booking_sessions
        SET
          status = 'failed',
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id}
          AND status = 'payment_pending'
          AND reservation_id IS NULL;
      `;

      return NextResponse.json(
        {
          error:
            "Reservation was submitted but its Guesty ID could not be confirmed.",
        },
        {
          status: 502,
        }
      );
    }

    /*
     * Guesty requires /verify-payment only when
     * the instant-charge payment is PENDING_AUTH.
     */
    const pendingAuthPayment =
      getPendingAuthPayment(
        reservation
      );

    const pendingAuthPaymentId =
      pendingAuthPayment?.paymentId ??
      null;

    const threeDSChallenge =
      pendingAuthPayment
        ?.threeDSChallenge ??
      findThreeDSChallenge(
        reservation
      );

    const reservationStatus =
      getReservationStatus(
        reservation
      );

    const nextSessionStatus =
      pendingAuthPaymentId
        ? "payment_authentication_required"
        : reservationStatus
              ?.toLowerCase() ===
            "confirmed"
          ? "confirmed"
          : "payment_pending";

    await sql`
      UPDATE booking_sessions
      SET
        reservation_id = ${reservationId},
        payment_id = ${pendingAuthPaymentId},
        status = ${nextSessionStatus},
        reservation_created_at = NOW(),
        confirmed_at = CASE
          WHEN ${nextSessionStatus} = 'confirmed'
          THEN NOW()
          ELSE confirmed_at
        END,
        updated_at = NOW()
      WHERE
        id = ${bookingSession.id};
    `;

    return NextResponse.json({
      bookingSessionToken,

      requiresPaymentVerification:
        Boolean(
          pendingAuthPaymentId
        ),

      ...(pendingAuthPaymentId &&
      threeDSChallenge
        ? {
            threeDSChallenge,
          }
        : {}),

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
