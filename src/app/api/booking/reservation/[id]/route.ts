import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { getGuestyReservationDetails } from "@/lib/guesty/reservations";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type BookingSessionRow = {
  id: number;
  reservation_id: string;
  status: string;
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

export async function GET(
  request: NextRequest,
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

    /*
     * [id] is now the HostMetric booking-session
     * token, not a Guesty reservation ID.
     *
     * This prevents a public visitor from
     * requesting arbitrary Guesty reservations.
     */
    const bookingSessionToken =
      requireString(id);

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

    const sql = getSql();

    const sessionRows =
      (await sql`
        SELECT
          id,
          reservation_id,
          status
        FROM booking_sessions
        WHERE
          public_token::text = ${bookingSessionToken}
          AND reservation_id IS NOT NULL
          AND status IN (
            'payment_verified',
            'confirmed'
          )
        LIMIT 1;
      `) as unknown as BookingSessionRow[];

    const bookingSession =
      sessionRows[0];

    if (!bookingSession) {
      return NextResponse.json(
        {
          error:
            "Reservation confirmation not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Guesty remains the source of truth
     * for the final reservation state.
     *
     * The Guesty reservation ID comes only
     * from our server-side booking session.
     */
    const reservation =
      await getGuestyReservationDetails(
        bookingSession.reservation_id
      );

    const guestyStatus =
      typeof reservation.status ===
      "string"
        ? reservation.status
            .trim()
            .toLowerCase()
        : "";

    /*
     * Once Guesty confirms the reservation,
     * persist that state locally as well.
     */
    if (
      guestyStatus ===
        "confirmed" &&
      bookingSession.status !==
        "confirmed"
    ) {
      await sql`
        UPDATE booking_sessions
        SET
          status = 'confirmed',
          confirmed_at = COALESCE(
            confirmed_at,
            NOW()
          ),
          updated_at = NOW()
        WHERE
          id = ${bookingSession.id};
      `;
    }

    /*
     * Return only the fields needed by
     * the public confirmation experience.
     *
     * Do not expose Guesty's complete
     * reservation object publicly.
     */
    return NextResponse.json({
      bookingSessionToken,

      reservation: {
        id:
          reservation._id ??
          reservation.id ??
          bookingSession.reservation_id,

        status:
          reservation.status ??
          null,

        confirmationCode:
          reservation.confirmationCode ??
          null,

        createdAt:
          reservation.createdAt ??
          null,
      },
    });
  } catch (error) {
    console.error(
      "Failed to load Guesty reservation details.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load reservation confirmation.",
      },
      {
        status: 500,
      }
    );
  }
}
