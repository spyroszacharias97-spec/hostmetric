import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { verifyGuestyPayment } from "@/lib/guesty/reservations";

type VerifyPaymentRequestBody = {
  reservationId?: unknown;
  paymentId?: unknown;

  threeDSResult?: unknown;
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

    const reservationId =
      requireString(
        body.reservationId
      );

    const paymentId =
      requireString(
        body.paymentId
      );

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

    if (!paymentId) {
      return NextResponse.json(
        {
          error:
            "Payment ID is required.",
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

    /*
     * Guesty performs the actual payment
     * verification.
     *
     * HostMetric never receives or stores
     * raw card details.
     */
    const verification =
      await verifyGuestyPayment({
        reservationId,
        paymentId,

        ...(body.threeDSResult
          ? {
              threeDSResult:
                body.threeDSResult,
            }
          : {}),
      });

    return NextResponse.json({
      reservationId,
      paymentId,
      verification,
    });
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