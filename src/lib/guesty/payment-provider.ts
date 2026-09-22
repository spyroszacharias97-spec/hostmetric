import { guestyClient } from "@/lib/guesty/client";

export type GuestyPaymentProvider = {
  _id?: string;

  providerType?: string;
  providerAccountId?: string;
  status?: string;

  paymentProcessorName?: string;
  accountName?: string;
  paymentProcessorId?: string;

  [key: string]: unknown;
};

export async function getGuestyPaymentProvider(
  listingId: string
) {
  const normalizedListingId =
    listingId.trim();

  if (!normalizedListingId) {
    throw new Error(
      "Guesty listing ID is required."
    );
  }

  return guestyClient.get<GuestyPaymentProvider>(
    `/listings/${encodeURIComponent(
      normalizedListingId
    )}/payment-provider`
  );
}
