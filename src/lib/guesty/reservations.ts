import { guestyClient } from "@/lib/guesty/client";

export type GuestyBookingType =
  | "instant"
  | "inquiry";

export type GuestyReservedUntil =
  | -1
  | 12
  | 24
  | 36
  | 48
  | 72;

export type GuestyReservationGuest = {
  firstName: string;
  lastName: string;
  email: string;

  phone?: string;

  [key: string]: unknown;
};

export type GuestyReservationPolicy = {
  [key: string]: unknown;
};

export type GuestyReservationNotes = {
  [key: string]: unknown;
};

export type GuestyReservation = {
  _id?: string;
  id?: string;

  status?: string;
  platform?: string;
  confirmationCode?: string;

  createdAt?: string;
  guestId?: string;

  money?: {
    payments?: unknown[];
    [key: string]: unknown;
  };

  [key: string]: unknown;
};

export type CreateGuestyInstantReservationInput = {
  quoteId: string;
  ratePlanId: string;
  ccToken: string;

  guest: GuestyReservationGuest;

  policy?: GuestyReservationPolicy;
};

export type CreateGuestyInquiryInput = {
  quoteId: string;
  ratePlanId: string;

  guest: GuestyReservationGuest;

  ccToken?: string;
  policy?: GuestyReservationPolicy;

  reservedUntil?: GuestyReservedUntil;
};

export type CreateGuestyInstantChargeInput = {
  quoteId: string;
  ratePlanId: string;

  guest: GuestyReservationGuest;

  /*
   * Stripe:
   * confirmationToken
   *
   * GuestyPay / another Guesty-supported provider:
   * initialPaymentMethodId
   *
   * Exactly one must be supplied.
   */
  confirmationToken?: string;
  initialPaymentMethodId?: string;

  reservedUntil?: GuestyReservedUntil;
  reuse?: boolean;

  policy?: GuestyReservationPolicy;
  notes?: GuestyReservationNotes;
};

export type VerifyGuestyPaymentInput = {
  reservationId: string;
  paymentId: string;

  threeDSResult?: Record<string, unknown>;
};

function requireValue(
  value: string,
  fieldName: string
) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(
      `${fieldName} is required.`
    );
  }

  return trimmed;
}

function normalizeGuest(
  guest: GuestyReservationGuest
): GuestyReservationGuest {
  return {
    ...guest,

    firstName: requireValue(
      guest.firstName,
      "Guest first name"
    ),

    lastName: requireValue(
      guest.lastName,
      "Guest last name"
    ),

    email: requireValue(
      guest.email,
      "Guest email"
    ),

    ...(guest.phone?.trim()
      ? {
          phone: guest.phone.trim(),
        }
      : {}),
  };
}

export async function createGuestyInstantReservation(
  input: CreateGuestyInstantReservationInput
) {
  const quoteId = requireValue(
    input.quoteId,
    "Guesty quote ID"
  );

  const ratePlanId = requireValue(
    input.ratePlanId,
    "Guesty rate plan ID"
  );

  const ccToken = requireValue(
    input.ccToken,
    "Guesty payment token"
  );

  return guestyClient.post<GuestyReservation>(
    `/reservations/quotes/${encodeURIComponent(
      quoteId
    )}/instant`,
    {
      ratePlanId,
      ccToken,

      guest: normalizeGuest(
        input.guest
      ),

      ...(input.policy
        ? {
            policy: input.policy,
          }
        : {}),
    }
  );
}

export async function createGuestyInquiry(
  input: CreateGuestyInquiryInput
) {
  const quoteId = requireValue(
    input.quoteId,
    "Guesty quote ID"
  );

  const ratePlanId = requireValue(
    input.ratePlanId,
    "Guesty rate plan ID"
  );

  return guestyClient.post<GuestyReservation>(
    `/reservations/quotes/${encodeURIComponent(
      quoteId
    )}/inquiry`,
    {
      ratePlanId,

      guest: normalizeGuest(
        input.guest
      ),

      ...(input.ccToken?.trim()
        ? {
            ccToken:
              input.ccToken.trim(),
          }
        : {}),

      ...(input.policy
        ? {
            policy: input.policy,
          }
        : {}),

      ...(input.reservedUntil !== undefined
        ? {
            reservedUntil:
              input.reservedUntil,
          }
        : {}),
    }
  );
}

export async function createGuestyInstantChargeReservation(
  input: CreateGuestyInstantChargeInput
) {
  const quoteId = requireValue(
    input.quoteId,
    "Guesty quote ID"
  );

  const ratePlanId = requireValue(
    input.ratePlanId,
    "Guesty rate plan ID"
  );

  const confirmationToken =
    input.confirmationToken?.trim();

  const initialPaymentMethodId =
    input.initialPaymentMethodId?.trim();

  const paymentMethodsProvided =
    Number(Boolean(confirmationToken)) +
    Number(Boolean(initialPaymentMethodId));

  if (paymentMethodsProvided !== 1) {
    throw new Error(
      "Exactly one payment method is required: confirmationToken or initialPaymentMethodId."
    );
  }

  return guestyClient.post<GuestyReservation>(
    `/reservations/quotes/${encodeURIComponent(
      quoteId
    )}/instant-charge`,
    {
      ratePlanId,

      guest: normalizeGuest(
        input.guest
      ),

      ...(confirmationToken
        ? {
            confirmationToken,
          }
        : {}),

      ...(initialPaymentMethodId
        ? {
            initialPaymentMethodId,
          }
        : {}),

      ...(input.reservedUntil !== undefined
        ? {
            reservedUntil:
              input.reservedUntil,
          }
        : {}),

      ...(input.reuse !== undefined
        ? {
            reuse: input.reuse,
          }
        : {}),

      ...(input.policy
        ? {
            policy: input.policy,
          }
        : {}),

      ...(input.notes
        ? {
            notes: input.notes,
          }
        : {}),
    }
  );
}

export async function verifyGuestyPayment(
  input: VerifyGuestyPaymentInput
) {
  const reservationId =
    requireValue(
      input.reservationId,
      "Guesty reservation ID"
    );

  const paymentId =
    requireValue(
      input.paymentId,
      "Guesty payment ID"
    );

  return guestyClient.post<
    Record<string, unknown>
  >(
    `/reservations/${encodeURIComponent(
      reservationId
    )}/verify-payment`,
    {
      paymentId,

      ...(input.threeDSResult
        ? {
            threeDSResult:
              input.threeDSResult,
          }
        : {}),
    }
  );
}

export async function getGuestyReservationDetails(
  reservationId: string
) {
  const id = requireValue(
    reservationId,
    "Guesty reservation ID"
  );

  return guestyClient.get<GuestyReservation>(
    `/reservations/${encodeURIComponent(
      id
    )}/details`
  );
}