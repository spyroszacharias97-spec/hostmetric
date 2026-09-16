import {
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { getGuestyReservationDetails } from "@/lib/guesty/reservations";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

    const reservationId =
      requireString(id);

    if (!reservationId) {
      return NextResponse.json(
        {
          error:
            "Reservation ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Guesty remains the source of truth
     * for the final reservation state.
     *
     * We fetch the reservation directly
     * from Guesty instead of trusting
     * reservation information supplied
     * by the browser.
     */
    const reservation =
      await getGuestyReservationDetails(
        reservationId
      );

    /*
     * Return only the fields needed by
     * the public confirmation experience.
     *
     * Do not expose Guesty's complete
     * reservation object publicly.
     */
    return NextResponse.json({
      reservation: {
        id:
          reservation._id ??
          reservation.id ??
          reservationId,

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