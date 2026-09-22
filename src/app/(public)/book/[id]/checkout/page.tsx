"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { loadScript } from "@guestyorg/tokenization-js";

type PropertyResponse = {
  property?: {
    id: number;
    guestyListingId: string;
    title: string | null;
    nickname: string | null;
    pictures: Array<{
      original: string | null;
      thumbnail: string | null;
      caption: string | null;
    }>;
    address: {
      full: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
    };
  };
  error?: string;
};

type PaymentProviderResponse = {
  propertyId?: number;
  paymentAvailable?: boolean;
  paymentProviderId?: string | null;
  error?: string;
};

type GuestyTokenizationV3RenderOptions = {
  containerId: string;
  providerId: string;
  onStatusChange?: (isValid: boolean) => void;
  showSupportedCards?: boolean;
  showPciCompliantLink?: boolean;
  styles?: {
    borderRadius?: number;
    inputHeight?: number;
    fontFamily?: string;
  };
};

type GuestyTokenizationV3 = {
  render: (
    options: GuestyTokenizationV3RenderOptions
  ) => Promise<void>;
  destroy: () => void;
};

type CheckoutPricingResponse = {
  propertyId?: number;
  guestyListingId?: string;
  bookingSessionToken?: string;
  quoteId?: string;
  ratePlan?: {
    id: string;
    name: string | null;
    type: string | null;
    amount: number;
    currency: string;
  };
  expiresAt?: string;
  error?: string;
};

type GuestyTokenizationV3SubmitResult = {
  initialPaymentMethodId?: string;
  _id?: string;
  id?: string;
  [key: string]: unknown;
};

type GuestyTokenizationV3WithSubmit = GuestyTokenizationV3 & {
  submit: (options: {
    amount: number;
    currency: string;
    listingId: string;
    quoteId: string;
    guest: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  }) => Promise<GuestyTokenizationV3SubmitResult>;
  handle3DSChallenge: (options: {
    threeDSChallenge: Record<string, unknown>;
  }) => Promise<Record<string, unknown>>;
};

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const propertyId = Number(params.id);

  const bookingSessionToken =
    searchParams.get("bookingSessionToken")?.trim() ?? "";
  const quoteId = searchParams.get("quoteId")?.trim() ?? "";
  const ratePlanId = searchParams.get("ratePlanId")?.trim() ?? "";

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = Number(searchParams.get("adults") ?? "1");
  const children = Number(searchParams.get("children") ?? "0");
  const infants = Number(searchParams.get("infants") ?? "0");

  const [property, setProperty] =
    useState<PropertyResponse["property"] | null>(null);
  const [paymentProviderId, setPaymentProviderId] =
    useState<string | null>(null);
  const [paymentAvailable, setPaymentAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentFormReady, setPaymentFormReady] = useState(false);
  const [paymentFormValid, setPaymentFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricing, setPricing] =
    useState<CheckoutPricingResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const guestySdkRef =
    useRef<GuestyTokenizationV3WithSubmit | null>(null);

  const bookingContextValid = useMemo(
    () =>
      Number.isInteger(propertyId) &&
      propertyId > 0 &&
      Boolean(bookingSessionToken) &&
      Boolean(quoteId) &&
      Boolean(ratePlanId),
    [propertyId, bookingSessionToken, quoteId, ratePlanId]
  );

  useEffect(() => {
    if (!bookingContextValid) {
      setError(
        "This checkout session is incomplete. Please return to the stay and select a rate again."
      );
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadCheckout() {
      try {
        setLoading(true);
        setError(null);

        const checkoutParams =
          new URLSearchParams({
            propertyId:
              String(propertyId),
            bookingSessionToken,
            quoteId,
            ratePlanId,
          });

        const [
          propertyResponse,
          providerResponse,
          pricingResponse,
        ] = await Promise.all([
          fetch(`/api/booking/properties/${propertyId}`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`/api/booking/properties/${propertyId}/payment-provider`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`/api/booking/checkout?${checkoutParams.toString()}`, {
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        const propertyData =
          (await propertyResponse.json()) as PropertyResponse;
        const providerData =
          (await providerResponse.json()) as PaymentProviderResponse;
        const pricingData =
          (await pricingResponse.json()) as CheckoutPricingResponse;

        if (!propertyResponse.ok || !propertyData.property) {
          throw new Error(
            propertyData.error || "Unable to load the selected stay."
          );
        }

        if (!providerResponse.ok) {
          throw new Error(
            providerData.error || "Unable to load payment configuration."
          );
        }

        if (!pricingResponse.ok || !pricingData.ratePlan) {
          throw new Error(
            pricingData.error || "Unable to load secure Guesty pricing."
          );
        }

        if (
          pricingData.propertyId !== propertyId ||
          pricingData.guestyListingId !== propertyData.property.guestyListingId ||
          pricingData.bookingSessionToken !== bookingSessionToken ||
          pricingData.quoteId !== quoteId ||
          pricingData.ratePlan.id !== ratePlanId
        ) {
          throw new Error(
            "Secure checkout data does not match this booking."
          );
        }

        setProperty(propertyData.property);
        setPricing(pricingData);
        setPaymentAvailable(providerData.paymentAvailable === true);
        setPaymentProviderId(providerData.paymentProviderId ?? null);
      } catch (loadError) {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load checkout."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCheckout();

    return () => controller.abort();
  }, [
    bookingContextValid,
    propertyId,
    bookingSessionToken,
    quoteId,
    ratePlanId,
  ]);

  useEffect(() => {
    if (
      loading ||
      !paymentAvailable ||
      !paymentProviderId ||
      !property?.guestyListingId
    ) {
      return;
    }

    const resolvedPaymentProviderId =
      paymentProviderId;

    let cancelled = false;

    async function mountGuestyPay() {
      try {
        setPaymentFormReady(false);
        setPaymentFormValid(false);

        const guestyTokenization = await loadScript({
          version: "v3",
        });

        if (cancelled || !guestyTokenization) {
          return;
        }

        const guestyTokenizationV3 =
          guestyTokenization as unknown as GuestyTokenizationV3WithSubmit;

        guestySdkRef.current =
          guestyTokenizationV3;

        await guestyTokenizationV3.render({
          containerId: "guesty-tokenization-container",
          providerId: resolvedPaymentProviderId,
          onStatusChange: (isValid: boolean) => {
            if (!cancelled) {
              setPaymentFormValid(isValid);
            }
          },
          showSupportedCards: true,
          showPciCompliantLink: true,
          styles: {
            borderRadius: 12,
            inputHeight: 48,
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          },
        });

        if (!cancelled) {
          setPaymentFormReady(true);
        }
      } catch (sdkError) {
        console.error("Failed to initialize GuestyPay.", sdkError);

        if (!cancelled) {
          setError(
            "GuestyPay could not be initialized for this property."
          );
        }
      }
    }

    void mountGuestyPay();

    return () => {
      cancelled = true;

      try {
        guestySdkRef.current?.destroy();
      } catch {
        // Ignore cleanup errors.
      }

      guestySdkRef.current = null;
    };
  }, [
    loading,
    paymentAvailable,
    paymentProviderId,
    property?.guestyListingId,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("First name, last name and email are required.");
      return;
    }

    const selectedRatePlan =
      pricing?.ratePlan;

    if (
      !selectedRatePlan ||
      !pricing?.guestyListingId
    ) {
      setError("Secure Guesty pricing is not available.");
      return;
    }

    if (!guestySdkRef.current) {
      setError("GuestyPay is not ready yet.");
      return;
    }

    try {
      setSubmitting(true);

      const guest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        ...(phone.trim()
          ? {
              phone: phone.trim(),
            }
          : {}),
      };

      const guestyPay =
        guestySdkRef.current;

      const paymentMethod =
        await guestyPay.submit({
          amount:
            selectedRatePlan.amount,
          currency:
            selectedRatePlan.currency,
          listingId:
            pricing.guestyListingId,
          quoteId,
          guest,
        });

      const initialPaymentMethodId =
        paymentMethod.initialPaymentMethodId ??
        paymentMethod._id ??
        paymentMethod.id ??
        null;

      if (!initialPaymentMethodId) {
        throw new Error(
          "GuestyPay did not return a payment method ID."
        );
      }

      const reservationResponse =
        await fetch(
          "/api/booking/reservation",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                propertyId,
                bookingSessionToken,
                quoteId,
                ratePlanId,
                initialPaymentMethodId,
                guest,
              }),
          }
        );

      const reservationData =
        (await reservationResponse.json()) as {
          bookingSessionToken?: string;
          requiresPaymentVerification?: boolean;
          threeDSChallenge?: Record<string, unknown>;
          error?: string;
        };

      if (!reservationResponse.ok) {
        throw new Error(
          reservationData.error ||
            "Unable to complete reservation."
        );
      }

      if (
        reservationData.requiresPaymentVerification
      ) {
        let threeDSResult:
          | Record<string, unknown>
          | undefined;

        if (reservationData.threeDSChallenge) {
          threeDSResult =
            await guestyPay.handle3DSChallenge({
              threeDSChallenge:
                reservationData.threeDSChallenge,
            });
        }

        const verificationResponse =
          await fetch(
            "/api/booking/reservation/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                bookingSessionToken,
                ...(threeDSResult
                  ? {
                      threeDSResult,
                    }
                  : {}),
              }),
            }
          );

        const verificationData =
          (await verificationResponse.json()) as {
            error?: string;
          };

        if (!verificationResponse.ok) {
          throw new Error(
            verificationData.error ||
              "Unable to verify the payment."
          );
        }
      }

      window.location.href =
        `/book/${propertyId}/confirmation?bookingSessionToken=${encodeURIComponent(
          bookingSessionToken
        )}`;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to complete payment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-[620px] animate-pulse rounded-[32px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  const propertyName =
    property?.title || property?.nickname || "HostMetric Stay";

  const location =
    property?.address.full ||
    [
      property?.address.city,
      property?.address.state,
      property?.address.country,
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <a
          href={`/book/${propertyId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 transition hover:text-sky-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to stay
        </a>

        <div className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Secure checkout
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
            Complete your booking
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Your payment details are securely collected by GuestyPay and are
            not stored by HostMetric.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          >
            <section>
              <h2 className="text-xl font-semibold text-slate-950">
                Guest details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  First name
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-sky-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Last name
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-sky-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-sky-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Phone
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-sky-500"
                  />
                </label>
              </div>
            </section>

            <section className="border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">Payment</h2>
                  <p className="text-xs text-slate-500">
                    Secure GuestyPay payment form
                  </p>
                </div>
              </div>

              {!paymentAvailable || !paymentProviderId ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  GuestyPay is not configured for this property yet. Once the
                  real Guesty payment provider is connected, the secure payment
                  form will appear here automatically.
                </div>
              ) : (
                <div className="mt-5">
                  <div
                    id="guesty-tokenization-container"
                    className="min-h-[260px] overflow-hidden rounded-2xl"
                  />

                  {!paymentFormReady ? (
                    <p className="mt-3 text-sm text-slate-500">
                      Loading secure GuestyPay form...
                    </p>
                  ) : null}
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={
                !paymentAvailable ||
                !paymentProviderId ||
                !paymentFormReady ||
                !paymentFormValid ||
                !pricing?.ratePlan ||
                submitting
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 px-5 text-sm font-semibold text-white transition hover:from-sky-800 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LockKeyhole className="h-4 w-4" />
              {submitting
                ? "Processing securely..."
                : pricing?.ratePlan
                  ? `Pay ${pricing.ratePlan.amount.toFixed(2)} ${pricing.ratePlan.currency}`
                  : "Pay securely with GuestyPay"}
            </button>

            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Card details are entered inside Guesty&apos;s secure payment
              iframe. HostMetric does not receive or store the raw card data.
            </div>
          </form>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              {property?.pictures?.[0] ? (
                <img
                  src={
                    property.pictures[0].original ||
                    property.pictures[0].thumbnail ||
                    ""
                  }
                  alt={propertyName}
                  className="h-48 w-full object-cover"
                />
              ) : null}

              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-950">
                  {propertyName}
                </h2>

                {location ? (
                  <p className="mt-1 text-sm text-slate-500">{location}</p>
                ) : null}

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                  {checkIn && checkOut ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Dates</span>
                      <span className="text-right font-medium text-slate-900">
                        {checkIn} → {checkOut}
                      </span>
                    </div>
                  ) : null}

                  {pricing?.ratePlan ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Total</span>
                      <span className="text-right text-base font-bold text-slate-950">
                        {pricing.ratePlan.amount.toFixed(2)}{" "}
                        {pricing.ratePlan.currency}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Guests</span>
                    <span className="text-right font-medium text-slate-900">
                      {adults} adult{adults === 1 ? "" : "s"}
                      {children > 0
                        ? `, ${children} child${children === 1 ? "" : "ren"}`
                        : ""}
                      {infants > 0
                        ? `, ${infants} infant${infants === 1 ? "" : "s"}`
                        : ""}
                    </span>
                  </div>
                </div>

                <p className="mt-5 rounded-xl bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-800">
                  Final pricing and payment are controlled by the Guesty quote
                  and selected rate plan.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
