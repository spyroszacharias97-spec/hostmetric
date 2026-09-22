import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { verifyGuestyPayment } from "@/lib/guesty/reservations";

type VerifyPaymentRequestBody = {
  bookingSessionToken?: unknown;
  threeDSResult?: unknown;
};

type BookingSessionRow = {
  id: number;
  reservation_id: string;
  payment_id: string;
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
      (await request.json()) as VerifyPaymentRequestBody;

    const bookingSessionToken =
      requireString(
        body.bookingSessionToken
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

    if (
      body.threeDSResult !==
        undefined &&
      !isRecord(
        body.threeDSResult
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid 3DS result.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    /*
     * Reservation/payment IDs are resolved only
     * from the HostMetric booking session.
     *
     * The public browser is never allowed to
     * choose an arbitrary Guesty reservationId
     * or paymentId.
     */
    const sessionRows =
      (await sql`
        SELECT
          id,
          reservation_id,
          payment_id,
          status,
          expires_at
        FROM booking_sessions
        WHERE
          public_token::text = ${bookingSessionToken}
          AND status = 'payment_authentication_required'
          AND reservation_id IS NOT NULL
          AND payment_id IS NOT NULL
          AND expires_at > NOW()
        LIMIT 1;
      `) as unknown as BookingSessionRow[];

    const bookingSession =
      sessionRows[0];

    if (!bookingSession) {
      return NextResponse.json(
        {
          error:
            "Payment verification session is invalid, expired or already completed.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Claim the verification atomically so the
     * same browser session cannot trigger two
     * concurrent Guesty verification requests.
     */
    const claimedRows =
      (await sql`
        UPDATE booking_sessions
        SET
          status = 'payment_pending',
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id}
          AND status = 'payment_authentication_required'
          AND expires_at > NOW()
        RETURNING id;
      `) as unknown as Array<{
        id: number;
      }>;

    if (!claimedRows[0]) {
      return NextResponse.json(
        {
          error:
            "Payment verification is already being processed.",
        },
        {
          status: 409,
        }
      );
    }

    try {
      /*
       * Guesty requires this call immediately
       * after instant-charge when its payment
       * status is PENDING_AUTH.
       */
      const verification =
        await verifyGuestyPayment({
          reservationId:
            bookingSession.reservation_id,

          paymentId:
            bookingSession.payment_id,

          ...(body.threeDSResult
            ? {
                threeDSResult:
                  body.threeDSResult,
              }
            : {}),
        });

      await sql`
        UPDATE booking_sessions
        SET
          status = 'payment_verified',
          payment_verified_at = NOW(),
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id};
      `;

      return NextResponse.json({
        bookingSessionToken,
        verification,
      });
    } catch (error) {
      /*
       * Guesty documents that a failed 3DS
       * verification closes the reservation.
       * Do not leave this session reusable.
       */
      await sql`
        UPDATE booking_sessions
        SET
          status = 'failed',
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id};
      `;

      throw error;
    }
  } catch (error) {
    console.error(
      "Failed to verify Guesty payment.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to verify payment.",
      },
      {
        status: 500,
      }
    );
  }
}
