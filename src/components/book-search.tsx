"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import BookingMap from "@/components/booking-map";

type GuestyPicture = {
  original: string | null;
  thumbnail: string | null;
  caption: string | null;
};

type BookingSearchResult = {
  id: number;
  guestyListingId: string;

  title: string | null;
  nickname: string | null;
  type: string | null;

  bedrooms: number | null;
  bathrooms: number | null;
  accommodates: number | null;

  amenities: string[];

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

  pictures: GuestyPicture[];

  currency: string | null;
  totalPrice: number | null;
};

type BookingSearchResponse = {
  enabled?: boolean;

  total?: number;

  results?: BookingSearchResult[];

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

function getListingName(
  listing: BookingSearchResult
) {
  return (
    listing.title ||
    listing.nickname ||
    "HostMetric Stay"
  );
}

function getListingLocation(
  listing: BookingSearchResult
) {
  return [
    listing.address.city,
    listing.address.state,
    listing.address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getMainPicture(
  listing: BookingSearchResult
) {
  const picture =
    listing.pictures.find(
      (item) =>
        item.thumbnail ||
        item.original
    );

  return (
    picture?.thumbnail ||
    picture?.original ||
    null
  );
}


function formatCurrencyAmount(
  amount: number,
  currency: string | null
) {
  if (!Number.isFinite(amount)) {
    return null;
  }

  const normalizedCurrency =
    currency
      ?.trim()
      .toUpperCase();

  if (
    normalizedCurrency &&
    /^[A-Z]{3}$/.test(
      normalizedCurrency
    )
  ) {
    try {
      return new Intl.NumberFormat(
        undefined,
        {
          style: "currency",
          currency:
            normalizedCurrency,
          maximumFractionDigits: 0,
        }
      ).format(amount);
    } catch {
      // Fall through to a safe
      // currency-code representation.
    }
  }

  if (normalizedCurrency) {
    return `${normalizedCurrency} ${amount.toLocaleString()}`;
  }

  return amount.toLocaleString();
}

function getListingPrice(
  listing: BookingSearchResult
) {
  if (
    typeof listing.totalPrice !==
      "number" ||
    !Number.isFinite(
      listing.totalPrice
    )
  ) {
    return null;
  }

  return formatCurrencyAmount(
    listing.totalPrice,
    listing.currency
  );
}

export default function BookSearch() {
  const today =
    useMemo(
      () =>
        getLocalDateString(
          new Date()
        ),
      []
    );

  const [
    destination,
    setDestination,
  ] = useState("");

  const [
    checkIn,
    setCheckIn,
  ] = useState("");

  const [
    checkOut,
    setCheckOut,
  ] = useState("");

  const [
    guests,
    setGuests,
  ] = useState(2);

  const [
    results,
    setResults,
  ] = useState<
    BookingSearchResult[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    hasSearched,
    setHasSearched,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    activePropertyId,
    setActivePropertyId,
  ] = useState<
    number | null
  >(null);

  async function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setActivePropertyId(null);

    if (
      !checkIn ||
      !checkOut
    ) {
      setError(
        "Please select your check-in and check-out dates."
      );

      return;
    }

    if (
      checkOut <= checkIn
    ) {
      setError(
        "Check-out must be after check-in."
      );

      return;
    }

    if (
      !Number.isInteger(
        guests
      ) ||
      guests < 1
    ) {
      setError(
        "Please select at least one guest."
      );

      return;
    }

    try {
      setLoading(true);

      const params =
        new URLSearchParams({
          checkIn,
          checkOut,
          guests:
            String(guests),
        });

      const trimmedDestination =
        destination.trim();

      if (
        trimmedDestination
      ) {
        params.set(
          "destination",
          trimmedDestination
        );
      }

      const response =
        await fetch(
          `/api/booking/search?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const data =
        (await response.json()) as BookingSearchResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to search properties."
        );
      }

      if (
        data.enabled === false
      ) {
        setResults([]);
        setHasSearched(true);

        setError(
          "Direct booking is currently unavailable."
        );

        return;
      }

      setResults(
        Array.isArray(
          data.results
        )
          ? data.results
          : []
      );

      setHasSearched(true);
    } catch (searchError) {
      setResults([]);
      setHasSearched(true);

      setError(
        searchError instanceof Error
          ? searchError.message
          : "Unable to search properties."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="relative z-10">
        <form
          onSubmit={
            handleSearch
          }
          className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.10)]"
        >
          <div className="grid lg:grid-cols-[1.35fr_1fr_1fr_0.85fr_auto] lg:items-center">
            <label className="group flex min-h-[74px] cursor-text items-center gap-3 rounded-[22px] px-5 transition hover:bg-slate-50">
              <MapPin className="h-5 w-5 shrink-0 text-slate-500" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-950">
                  Where
                </span>

                <input
                  type="text"
                  value={
                    destination
                  }
                  onChange={(
                    event
                  ) =>
                    setDestination(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search destinations"
                  autoComplete="off"
                  className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <label className="flex min-h-[74px] items-center gap-3 border-t border-slate-100 px-5 transition hover:bg-slate-50 lg:border-l lg:border-t-0">
              <CalendarDays className="h-5 w-5 shrink-0 text-slate-500" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-950">
                  Check in
                </span>

                <input
                  type="date"
                  value={
                    checkIn
                  }
                  min={today}
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
                  className="mt-1 w-full bg-transparent text-sm text-slate-600 outline-none"
                />
              </span>
            </label>

            <label className="flex min-h-[74px] items-center gap-3 border-t border-slate-100 px-5 transition hover:bg-slate-50 lg:border-l lg:border-t-0">
              <CalendarDays className="h-5 w-5 shrink-0 text-slate-500" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-950">
                  Check out
                </span>

                <input
                  type="date"
                  value={
                    checkOut
                  }
                  min={
                    checkIn
                      ? addDays(
                          checkIn,
                          1
                        )
                      : today
                  }
                  onChange={(
                    event
                  ) =>
                    setCheckOut(
                      event.target
                        .value
                    )
                  }
                  className="mt-1 w-full bg-transparent text-sm text-slate-600 outline-none"
                />
              </span>
            </label>

            <label className="flex min-h-[74px] items-center gap-3 border-t border-slate-100 px-5 transition hover:bg-slate-50 lg:border-l lg:border-t-0">
              <Users className="h-5 w-5 shrink-0 text-slate-500" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-950">
                  Guests
                </span>

                <select
                  value={
                    guests
                  }
                  onChange={(
                    event
                  ) =>
                    setGuests(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="mt-1 w-full cursor-pointer bg-transparent text-sm text-slate-600 outline-none"
                >
                  {Array.from(
                    {
                      length: 16,
                    },
                    (
                      _,
                      index
                    ) =>
                      index + 1
                  ).map(
                    (value) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {value}{" "}
                        {value ===
                        1
                          ? "guest"
                          : "guests"}
                      </option>
                    )
                  )}
                </select>
              </span>
            </label>

            <div className="p-2">
              <button
                type="submit"
                disabled={
                  loading
                }
                className="flex h-[58px] w-full items-center justify-center gap-2 rounded-[20px] bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
              >
                <Search className="h-4 w-4" />

                {loading
                  ? "Searching..."
                  : "Search"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {!hasSearched ? (
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="grid min-h-[360px] place-items-center px-6 py-16 text-center">
            <div className="max-w-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-6 w-6 text-slate-700" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                Find your perfect stay
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Search by destination,
                travel dates and guests.
                Availability is checked
                directly through Guesty.
              </p>
            </div>
          </div>
        </section>
      ) : results.length ===
        0 ? (
        <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            No stays found
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Try different dates,
            destination or number of
            guests.
          </p>
        </section>
      ) : (
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {results.length}{" "}
                {results.length ===
                1
                  ? "stay"
                  : "stays"}{" "}
                available
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Places to stay
              </h2>
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:self-auto"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map(
                (listing) => {
                  const image =
                    getMainPicture(
                      listing
                    );

                  const location =
                    getListingLocation(
                      listing
                    );

                  const price =
                    getListingPrice(
                      listing
                    );

                  const isActive =
                    activePropertyId ===
                    listing.id;

                  return (
                    <article
                      id={`booking-property-${listing.id}`}
                      key={
                        listing.id
                      }
                      onMouseEnter={() =>
                        setActivePropertyId(
                          listing.id
                        )
                      }
                      onMouseLeave={() =>
                        setActivePropertyId(
                          null
                        )
                      }
                      onClick={() =>
                        setActivePropertyId(
                          listing.id
                        )
                      }
                      className={`group overflow-hidden rounded-[26px] border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                        isActive
                          ? "border-slate-950 ring-2 ring-slate-950/10"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {image ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              listing
                                .pictures[0]
                                ?.caption ||
                              getListingName(
                                listing
                              )
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
                            No property
                            photo available
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-slate-950">
                              {getListingName(
                                listing
                              )}
                            </h3>

                            {location ? (
                              <p className="mt-1 truncate text-sm text-slate-500">
                                {
                                  location
                                }
                              </p>
                            ) : null}
                          </div>

                          {listing.type ? (
                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              {
                                listing.type
                              }
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-slate-600">
                          {listing.bedrooms !==
                          null ? (
                            <span>
                              {
                                listing.bedrooms
                              }{" "}
                              bd
                            </span>
                          ) : null}

                          {listing.bathrooms !==
                          null ? (
                            <span>
                              {
                                listing.bathrooms
                              }{" "}
                              ba
                            </span>
                          ) : null}

                          {listing.accommodates !==
                          null ? (
                            <span>
                              Up to{" "}
                              {
                                listing.accommodates
                              }
                            </span>
                          ) : null}
                        </div>

                        {price ? (
                          <div className="mt-5 border-t border-slate-100 pt-4">
                            <div className="flex items-end justify-between gap-3">
                              <span className="text-xs font-medium text-slate-500">
                                Total stay
                              </span>

                              <span className="text-lg font-semibold tracking-tight text-slate-950">
                                {price}
                              </span>
                            </div>
                          </div>
                        ) : null}

                        <button
                          type="button"
                          className="mt-5 h-11 w-full rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View stay
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            <aside className="min-h-[520px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
              <BookingMap
                properties={
                  results
                }
                activePropertyId={
                  activePropertyId
                }
                onPropertySelect={(
                  propertyId
                ) => {
                  setActivePropertyId(
                    propertyId
                  );

                  document
                    .getElementById(
                      `booking-property-${propertyId}`
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                      block:
                        "center",
                    });
                }}
              />
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}