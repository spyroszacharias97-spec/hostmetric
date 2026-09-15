import { guestyClient } from "@/lib/guesty/client";

export type GuestyGuestBreakdown = {
  adults?: number;
  children?: number;
  infants?: number;
  pets?: number;
};

export type CreateGuestyQuoteInput = {
  listingId: string;

  checkInDate: string;
  checkOutDate: string;

  guestsCount: number;

  numberOfGuests?: GuestyGuestBreakdown;

  coupons?: string[];
};

export type GuestyRatePlan = {
  _id?: string;
  id?: string;
  name?: string;

  [key: string]: unknown;
};

export type GuestyQuote = {
  _id: string;

  createdAt?: string;
  expiresAt?: string;

  listingId?: string;

  checkInDateLocalized?: string;
  checkOutDateLocalized?: string;

  guestsCount?: number;

  ratePlans?: GuestyRatePlan[];

  currency?: string;

  money?: {
    currency?: string;
    fareAccommodation?: number;
    fareCleaning?: number;
    subTotalPrice?: number;
    hostPayout?: number;
    totalPrice?: number;

    [key: string]: unknown;
  };

  [key: string]: unknown;
};

function validateDate(
  value: string,
  fieldName: string
) {
  const datePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) {
    throw new Error(
      `${fieldName} must use YYYY-MM-DD format.`
    );
  }
}

export async function createGuestyQuote(
  input: CreateGuestyQuoteInput
) {
  if (!input.listingId.trim()) {
    throw new Error(
      "Guesty listing ID is required."
    );
  }

  validateDate(
    input.checkInDate,
    "Check-in date"
  );

  validateDate(
    input.checkOutDate,
    "Check-out date"
  );

  if (
    input.checkOutDate <=
    input.checkInDate
  ) {
    throw new Error(
      "Check-out date must be after check-in date."
    );
  }

  if (
    !Number.isInteger(input.guestsCount) ||
    input.guestsCount < 1
  ) {
    throw new Error(
      "Guest count must be at least 1."
    );
  }

  const body = {
    listingId:
      input.listingId.trim(),

    checkInDateLocalized:
      input.checkInDate,

    checkOutDateLocalized:
      input.checkOutDate,

    guestsCount:
      input.guestsCount,

    ...(input.numberOfGuests
      ? {
          numberOfGuests:
            input.numberOfGuests,
        }
      : {}),

    ...(input.coupons?.length
      ? {
          coupons:
            input.coupons.join(","),
        }
      : {}),
  };

  return guestyClient.post<GuestyQuote>(
    "/reservations/quotes",
    body
  );
}

export async function getGuestyQuote(
  quoteId: string
) {
  if (!quoteId.trim()) {
    throw new Error(
      "Guesty quote ID is required."
    );
  }

  return guestyClient.get<GuestyQuote>(
    `/reservations/quotes/${encodeURIComponent(
      quoteId
    )}`
  );
}