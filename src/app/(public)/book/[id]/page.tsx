"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  MapPin,
  Users,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

type GuestyPicture = {
  original: string | null;
  thumbnail: string | null;
  caption: string | null;
};

type BookingProperty = {
  id: number;
  guestyListingId: string;
  title: string | null;
  nickname: string | null;
  type: string | null;
  description: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  accommodates: number | null;
  amenities: string[];
  pictures: GuestyPicture[];
  address: {
    full: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    street: string | null;
    zipCode: string | null;
    lat: number | null;
    lng: number | null;
  };
};

type PropertyResponse = {
  property?: BookingProperty;
  error?: string;
};

type QuoteRatePlan = {
  _id?: string;
  id?: string;
  name?: string;
  type?: string;
  money?: unknown;
};

type QuoteResponse = {
  bookingSessionToken?: string;
  bookingSessionExpiresAt?: string;
  quote?: {
    _id?: string;
    id?: string;
    rates?: {
      ratePlans?: QuoteRatePlan[];
    };
  };
  error?: string;
};

function getLocalDateString(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(
  dateString: string,
  days: number
) {
  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  date.setDate(
    date.getDate() + days
  );

  return getLocalDateString(
    date
  );
}

function getPropertyName(
  property: BookingProperty
) {
  return (
    property.title ||
    property.nickname ||
    "HostMetric Stay"
  );
}

function getLocation(
  property: BookingProperty
) {
  return (
    property.address.full ||
    [
      property.address.city,
      property.address.state,
      property.address.country,
    ]
      .filter(Boolean)
      .join(", ")
  );
}

function getRatePlanId(
  ratePlan: QuoteRatePlan
) {
  return (
    ratePlan._id ??
    ratePlan.id ??
    null
  );
}

export default function BookPropertyPage() {
  const params = useParams<{
    id: string;
  }>();

  const searchParams =
    useSearchParams();

  const propertyId =
    Number(params.id);

  const today =
    useMemo(
      () =>
        getLocalDateString(
          new Date()
        ),
      []
    );

  const [
    property,
    setProperty,
  ] = useState<
    BookingProperty | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    checkIn,
    setCheckIn,
  ] = useState("");

  const [
    checkOut,
    setCheckOut,
  ] = useState("");

  const [
    adults,
    setAdults,
  ] = useState(2);

  const [
    children,
    setChildren,
  ] = useState(0);

  const [
    infants,
    setInfants,
  ] = useState(0);

  const [
    quoteLoading,
    setQuoteLoading,
  ] = useState(false);

  const [
    quoteError,
    setQuoteError,
  ] = useState<
    string | null
  >(null);

  const [
    quote,
    setQuote,
  ] = useState<
    QuoteResponse["quote"] | null
  >(null);

  const [
    bookingSessionToken,
    setBookingSessionToken,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    const urlCheckIn =
      searchParams.get(
        "checkIn"
      );

    const urlCheckOut =
      searchParams.get(
        "checkOut"
      );

    const urlAdults =
      Number(
        searchParams.get(
          "adults"
        )
      );

    const urlChildren =
      Number(
        searchParams.get(
          "children"
        )
      );

    const urlInfants =
      Number(
        searchParams.get(
          "infants"
        )
      );

    if (
      urlCheckIn &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        urlCheckIn
      ) &&
      urlCheckIn >= today
    ) {
      setCheckIn(
        urlCheckIn
      );
    }

    if (
      urlCheckOut &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        urlCheckOut
      ) &&
      (
        !urlCheckIn ||
        urlCheckOut >
          urlCheckIn
      )
    ) {
      setCheckOut(
        urlCheckOut
      );
    }

    if (
      Number.isInteger(
        urlAdults
      ) &&
      urlAdults >= 1 &&
      urlAdults <= 16
    ) {
      setAdults(
        urlAdults
      );
    }

    if (
      Number.isInteger(
        urlChildren
      ) &&
      urlChildren >= 0 &&
      urlChildren <= 15
    ) {
      setChildren(
        urlChildren
      );
    }

    if (
      Number.isInteger(
        urlInfants
      ) &&
      urlInfants >= 0 &&
      urlInfants <= 5
    ) {
      setInfants(
        urlInfants
      );
    }
  }, [
    searchParams,
    today,
  ]);

  useEffect(() => {
    if (
      !Number.isInteger(
        propertyId
      ) ||
      propertyId < 1
    ) {
      setError(
        "Invalid property."
      );
      setLoading(false);
      return;
    }

    const controller =
      new AbortController();

    async function loadProperty() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            `/api/booking/properties/${propertyId}`,
            {
              method: "GET",
              cache: "no-store",
              signal:
                controller.signal,
            }
          );

        const data =
          (await response.json()) as PropertyResponse;

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load property."
          );
        }

        if (!data.property) {
          throw new Error(
            "Property not found."
          );
        }

        setProperty(
          data.property
        );
      } catch (loadError) {
        if (
          loadError instanceof
            DOMException &&
          loadError.name ===
            "AbortError"
        ) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load property."
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setLoading(false);
        }
      }
    }

    void loadProperty();

    return () => {
      controller.abort();
    };
  }, [propertyId]);

  async function handleQuote(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!property) {
      return;
    }

    setQuoteError(null);
    setQuote(null);
    setBookingSessionToken(
      null
    );

    if (
      !checkIn ||
      !checkOut
    ) {
      setQuoteError(
        "Select check-in and check-out dates."
      );
      return;
    }

    if (
      checkOut <= checkIn
    ) {
      setQuoteError(
        "Check-out must be after check-in."
      );
      return;
    }

    const guestsCount =
      adults + children;

    if (
      adults < 1 ||
      guestsCount < 1
    ) {
      setQuoteError(
        "At least one adult is required."
      );
      return;
    }

    try {
      setQuoteLoading(true);

      const response =
        await fetch(
          "/api/booking/quote",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                propertyId:
                  property.id,

                checkInDate:
                  checkIn,

                checkOutDate:
                  checkOut,

                guestsCount,

                numberOfGuests: {
                  adults,
                  children,
                  infants,
                  pets: 0,
                },
              }),
          }
        );

      const data =
        (await response.json()) as QuoteResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load rates."
        );
      }

      if (
        !data.quote ||
        !data.bookingSessionToken
      ) {
        throw new Error(
          "Booking quote is incomplete."
        );
      }

      setQuote(
        data.quote
      );

      setBookingSessionToken(
        data.bookingSessionToken
      );
    } catch (quoteRequestError) {
      setQuoteError(
        quoteRequestError instanceof
          Error
          ? quoteRequestError.message
          : "Unable to load rates."
      );
    } finally {
      setQuoteLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-[520px] animate-pulse rounded-[32px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (
    error ||
    !property
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Stay unavailable
          </h1>

          <p className="mt-4 text-slate-600">
            {error ||
              "This stay is not available for direct booking."}
          </p>

          <a
            href="/book"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to stays
          </a>
        </div>
      </main>
    );
  }

  const name =
    getPropertyName(
      property
    );

  const location =
    getLocation(
      property
    );

  const ratePlans =
    quote?.rates
      ?.ratePlans ?? [];

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <a
          href="/book"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 transition hover:text-sky-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </a>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
            {name}
          </h1>

          {location ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 sm:text-base">
              <MapPin className="h-4 w-4 shrink-0 text-sky-700" />
              {location}
            </p>
          ) : null}
        </div>

        <section className="mt-8 grid gap-3 overflow-hidden rounded-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {property.pictures
            .slice(0, 5)
            .map(
              (
                picture,
                index
              ) => {
                const src =
                  picture.original ||
                  picture.thumbnail;

                if (!src) {
                  return null;
                }

                return (
                  <div
                    key={`${src}-${index}`}
                    className={`overflow-hidden bg-slate-200 ${
                      index === 0
                        ? "sm:col-span-2 sm:row-span-2"
                        : ""
                    }`}
                  >
                    <img
                      src={src}
                      alt={
                        picture.caption ||
                        name
                      }
                      className="h-full min-h-[220px] w-full object-cover sm:min-h-[240px]"
                    />
                  </div>
                );
              }
            )}

          {property.pictures.length ===
          0 ? (
            <div className="col-span-full flex min-h-[360px] items-center justify-center bg-slate-100 text-sm text-slate-400">
              No property photos available
            </div>
          ) : null}
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div>
            <div className="flex flex-wrap gap-3">
              {property.bedrooms !==
              null ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  <BedDouble className="h-4 w-4 text-sky-700" />
                  {property.bedrooms}{" "}
                  {property.bedrooms ===
                  1
                    ? "bedroom"
                    : "bedrooms"}
                </span>
              ) : null}

              {property.bathrooms !==
              null ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  <Bath className="h-4 w-4 text-sky-700" />
                  {property.bathrooms}{" "}
                  {property.bathrooms ===
                  1
                    ? "bathroom"
                    : "bathrooms"}
                </span>
              ) : null}

              {property.accommodates !==
              null ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  <Users className="h-4 w-4 text-sky-700" />
                  Up to{" "}
                  {property.accommodates}{" "}
                  guests
                </span>
              ) : null}
            </div>

            {property.description ? (
              <section className="mt-9 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  About this stay
                </h2>

                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                  {
                    property.description
                  }
                </p>
              </section>
            ) : null}

            {property.amenities.length >
            0 ? (
              <section className="mt-9 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  What this place offers
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {property.amenities
                    .slice(0, 20)
                    .map(
                      (
                        amenity
                      ) => (
                        <div
                          key={
                            amenity
                          }
                          className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                        >
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                          {amenity}
                        </div>
                      )
                    )}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-sky-100 bg-white p-5 shadow-[0_24px_70px_-34px_rgba(14,116,144,0.38)] sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Check availability
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Live rates and availability are loaded directly from Guesty.
              </p>

              <form
                onSubmit={
                  handleQuote
                }
                className="mt-6 space-y-4"
              >
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200">
                  <label className="border-r border-slate-200 p-3">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Check in
                    </span>

                    <input
                      type="date"
                      min={today}
                      value={
                        checkIn
                      }
                      onChange={(
                        event
                      ) => {
                        const value =
                          event.target
                            .value;

                        setCheckIn(
                          value
                        );

                        if (
                          checkOut &&
                          checkOut <=
                            value
                        ) {
                          setCheckOut(
                            addDays(
                              value,
                              1
                            )
                          );
                        }
                      }}
                      className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </label>

                  <label className="p-3">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Check out
                    </span>

                    <input
                      type="date"
                      min={
                        checkIn
                          ? addDays(
                              checkIn,
                              1
                            )
                          : today
                      }
                      value={
                        checkOut
                      }
                      onChange={(
                        event
                      ) =>
                        setCheckOut(
                          event.target
                            .value
                        )
                      }
                      className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="rounded-2xl border border-slate-200 p-3">
                    <span className="block text-xs font-semibold text-slate-600">
                      Adults
                    </span>

                    <input
                      type="number"
                      min={1}
                      max={16}
                      value={adults}
                      onChange={(
                        event
                      ) =>
                        setAdults(
                          Math.max(
                            1,
                            Number(
                              event.target
                                .value
                            ) || 1
                          )
                        )
                      }
                      className="mt-2 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                    />
                  </label>

                  <label className="rounded-2xl border border-slate-200 p-3">
                    <span className="block text-xs font-semibold text-slate-600">
                      Children
                    </span>

                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={
                        children
                      }
                      onChange={(
                        event
                      ) =>
                        setChildren(
                          Math.max(
                            0,
                            Number(
                              event.target
                                .value
                            ) || 0
                          )
                        )
                      }
                      className="mt-2 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                    />
                  </label>

                  <label className="rounded-2xl border border-slate-200 p-3">
                    <span className="block text-xs font-semibold text-slate-600">
                      Infants
                    </span>

                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={
                        infants
                      }
                      onChange={(
                        event
                      ) =>
                        setInfants(
                          Math.max(
                            0,
                            Math.min(
                              5,
                              Number(
                                event.target
                                  .value
                              ) || 0
                            )
                          )
                        )
                      }
                      className="mt-2 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                    />
                  </label>
                </div>

                {quoteError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {quoteError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={
                    quoteLoading
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-800 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarDays className="h-4 w-4" />

                  {quoteLoading
                    ? "Loading rates..."
                    : "Check availability"}
                </button>
              </form>

              {quote ? (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-sm font-semibold text-slate-950">
                    Available rate plans
                  </p>

                  {ratePlans.length >
                  0 ? (
                    <div className="mt-3 space-y-3">
                      {ratePlans.map(
                        (
                          ratePlan,
                          index
                        ) => {
                          const ratePlanId =
                            getRatePlanId(
                              ratePlan
                            );

                          return (
                            <div
                              key={
                                ratePlanId ??
                                index
                              }
                              className="rounded-2xl border border-slate-200 p-4"
                            >
                              <p className="text-sm font-semibold text-slate-950">
                                {ratePlan.name ||
                                  `Rate plan ${
                                    index +
                                    1
                                  }`}
                              </p>

                              {ratePlan.type ? (
                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    ratePlan.type
                                  }
                                </p>
                              ) : null}

                              {ratePlanId &&
                              bookingSessionToken ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const quoteId =
                                      quote?._id ??
                                      quote?.id;

                                    if (
                                      !quoteId ||
                                      !bookingSessionToken
                                    ) {
                                      return;
                                    }

                                    const checkoutParams =
                                      new URLSearchParams({
                                        bookingSessionToken,
                                        quoteId,
                                        ratePlanId,
                                        checkIn,
                                        checkOut,
                                        adults: String(adults),
                                        children: String(children),
                                        infants: String(infants),
                                      });

                                    window.location.href =
                                      `/book/${property.id}/checkout?${checkoutParams.toString()}`;
                                  }}
                                  className="mt-4 h-10 w-full rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-4 text-sm font-semibold text-white transition hover:from-sky-800 hover:to-cyan-700"
                                >
                                  Continue to checkout
                                </button>
                              ) : null}
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      No bookable rate plan was returned for these dates.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
