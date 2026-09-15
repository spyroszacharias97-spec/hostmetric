import { guestyClient } from "@/lib/guesty/client";

export type GuestyListing = {
  _id: string;
  nickname?: string;
  title?: string;
  type?: string;

  bedrooms?: number;
  bathrooms?: number;
  accommodates?: number;

  amenities?: string[];

  address?: {
    full?: string;
    city?: string;
    country?: string;
    state?: string;
    street?: string;
    zipCode?: string;
    lat?: number;
    lng?: number;
  };

  pictures?: Array<{
    original?: string;
    thumbnail?: string;
    caption?: string;
  }>;

  prices?: {
    currency?: string;
  };

  totalPrice?: number;
};

export type GuestyListingsResponse = {
  results: GuestyListing[];

  pagination?: {
    total?: number;

    cursor?: {
      next?: string;
    };
  };
};

export type GuestyListingsSearchParams = {
  checkIn?: string;
  checkOut?: string;

  minOccupancy?: number;

  numberOfBedrooms?: number;
  numberOfBathrooms?: number;

  limit?: number;
  cursor?: string;

  fields?: string[];
};

function buildQueryString(
  params: GuestyListingsSearchParams
) {
  const searchParams =
    new URLSearchParams();

  if (params.checkIn) {
    searchParams.set(
      "checkIn",
      params.checkIn
    );
  }

  if (params.checkOut) {
    searchParams.set(
      "checkOut",
      params.checkOut
    );
  }

  if (
    params.minOccupancy !== undefined
  ) {
    searchParams.set(
      "minOccupancy",
      String(params.minOccupancy)
    );
  }

  if (
    params.numberOfBedrooms !== undefined
  ) {
    searchParams.set(
      "numberOfBedrooms",
      String(params.numberOfBedrooms)
    );
  }

  if (
    params.numberOfBathrooms !== undefined
  ) {
    searchParams.set(
      "numberOfBathrooms",
      String(params.numberOfBathrooms)
    );
  }

  searchParams.set(
    "limit",
    String(params.limit ?? 20)
  );

  if (params.cursor) {
    searchParams.set(
      "cursor",
      params.cursor
    );
  }

  if (params.fields?.length) {
    searchParams.set(
      "fields",
      params.fields.join(" ")
    );
  }

  return searchParams.toString();
}

export async function getGuestyListings(
  params: GuestyListingsSearchParams = {}
) {
  const query =
    buildQueryString(params);

  return guestyClient.get<GuestyListingsResponse>(
    `/listings?${query}`
  );
}

export async function getGuestyListing(
  listingId: string,
  fields?: string[]
) {
  const id = listingId.trim();

  if (!id) {
    throw new Error(
      "Guesty listing ID is required."
    );
  }

  const searchParams =
    new URLSearchParams();

  if (fields?.length) {
    searchParams.set(
      "fields",
      fields.join(" ")
    );
  }

  const query =
    searchParams.toString();

  return guestyClient.get<GuestyListing>(
    `/listings/${encodeURIComponent(id)}${
      query ? `?${query}` : ""
    }`
  );
}