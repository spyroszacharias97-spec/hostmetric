import { guestyClient } from "@/lib/guesty/client";

export type GuestyCalendarStatus =
  | "available"
  | "unavailable"
  | "reserved"
  | "booked";

export type GuestyCalendarDay = {
  date: string;

  minNights?: number;

  isBaseMinNights?: boolean;

  status?: GuestyCalendarStatus;

  cta?: boolean;

  ctd?: boolean;

  [key: string]: unknown;
};

export type GuestyCalendarResponse =
  GuestyCalendarDay[];

export type GuestyCalendarParams = {
  from: string;
  to: string;
};

function requireDate(
  value: string,
  fieldName: string
) {
  const trimmed =
    value.trim();

  if (!trimmed) {
    throw new Error(
      `${fieldName} is required.`
    );
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      trimmed
    )
  ) {
    throw new Error(
      `${fieldName} must use YYYY-MM-DD format.`
    );
  }

  return trimmed;
}

export async function getGuestyListingCalendar(
  listingId: string,
  {
    from,
    to,
  }: GuestyCalendarParams
) {
  const id =
    listingId.trim();

  if (!id) {
    throw new Error(
      "Guesty listing ID is required."
    );
  }

  const calendarFrom =
    requireDate(
      from,
      "Calendar from date"
    );

  const calendarTo =
    requireDate(
      to,
      "Calendar to date"
    );

  if (
    calendarFrom >
    calendarTo
  ) {
    throw new Error(
      "Calendar from date cannot be after calendar to date."
    );
  }

  const params =
    new URLSearchParams({
      from:
        calendarFrom,

      to:
        calendarTo,
    });

  return guestyClient.get<GuestyCalendarResponse>(
    `/listings/${encodeURIComponent(
      id
    )}/calendar?${params.toString()}`
  );
}