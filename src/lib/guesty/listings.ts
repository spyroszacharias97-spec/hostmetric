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

  propertyType?: string;

  minPrice?: number;
  maxPrice?: number;
  currency?: string;

  includeAmenities?: string[];
  excludeAmenities?: string[];

  city?: string;
  country?: string;
  state?: string;
  neighborhood?: string;

  minLng?: number;
  maxLng?: number;
  minLat?: number;
  maxLat?: number;

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

  if (params.propertyType) {
    searchParams.set(
      "propertyType",
      params.propertyType
    );
  }

  if (
    params.minPrice !== undefined
  ) {
    searchParams.set(
      "minPrice",
      String(params.minPrice)
    );
  }

  if (
    params.maxPrice !== undefined
  ) {
    searchParams.set(
      "maxPrice",
      String(params.maxPrice)
    );
  }

  if (params.currency) {
    searchParams.set(
      "currency",
      params.currency
    );
  }

  if (
    params.includeAmenities?.length
  ) {
    searchParams.set(
      "includeAmenities",
      params.includeAmenities.join(",")
    );
  }

  if (
    params.excludeAmenities?.length
  ) {
    searchParams.set(
      "excludeAmenities",
      params.excludeAmenities.join(",")
    );
  }

  if (params.city) {
    searchParams.set(
      "city",
      params.city
    );
  }

  if (params.country) {
    searchParams.set(
      "country",
      params.country
    );
  }

  if (params.state) {
    searchParams.set(
      "state",
      params.state
    );
  }

  if (params.neighborhood) {
    searchParams.set(
      "neighborhood",
      params.neighborhood
    );
  }

  if (params.minLng !== undefined) {
    searchParams.set(
      "minLng",
      String(params.minLng)
    );
  }

  if (params.maxLng !== undefined) {
    searchParams.set(
      "maxLng",
      String(params.maxLng)
    );
  }

  if (params.minLat !== undefined) {
    searchParams.set(
      "minLat",
      String(params.minLat)
    );
  }

  if (params.maxLat !== undefined) {
    searchParams.set(
      "maxLat",
      String(params.maxLat)
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
