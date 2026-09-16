"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Baby,
  CalendarDays,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
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

type BookingDestination = {
  label: string;
  city: string | null;
  state: string | null;
  country: string | null;
};

type BookingSearchResponse = {
  enabled?: boolean;

  total?: number;

  destinations?: BookingDestination[];

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
    destinations,
    setDestinations,
  ] = useState<
    BookingDestination[]
  >([]);

  const [
    destinationOpen,
    setDestinationOpen,
  ] = useState(false);

  const [
    guestsOpen,
    setGuestsOpen,
  ] = useState(false);

  const destinationRef =
    useRef<HTMLDivElement>(null);

  const guestsRef =
    useRef<HTMLDivElement>(null);

  const guests =
    adults + children;

  const guestSummary =
    `${guests} ${
      guests === 1
        ? "guest"
        : "guests"
    }${
      infants > 0
        ? `, ${infants} ${
            infants === 1
              ? "infant"
              : "infants"
          }`
        : ""
    }`;

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

  useEffect(() => {
    function handlePointerDown(
      event: MouseEvent
    ) {
      const target =
        event.target as Node;

      if (
        destinationRef.current &&
        !destinationRef.current.contains(
          target
        )
      ) {
        setDestinationOpen(false);
      }

      if (
        guestsRef.current &&
        !guestsRef.current.contains(
          target
        )
      ) {
        setGuestsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };
  }, []);

  const filteredDestinations =
    useMemo(() => {
      const query =
        destination
          .trim()
          .toLocaleLowerCase();

      const source =
        destinations.length > 0
          ? destinations
          : Array.from(
              new Map(
                results
                  .map((listing) => {
                    const city =
                      listing.address.city;
                    const country =
                      listing.address.country;

                    const label =
                      [city, country]
                        .filter(Boolean)
                        .join(", ");

                    if (!label) {
                      return null;
                    }

                    return [
                      label.toLocaleLowerCase(),
                      {
                        label,
                        city,
                        state:
                          listing.address.state,
                        country,
                      } satisfies BookingDestination,
                    ] as const;
                  })
                  .filter(
                    (
                      item
                    ): item is readonly [
                      string,
                      BookingDestination,
                    ] => item !== null
                  )
              ).values()
            );

      if (!query) {
        return source.slice(0, 8);
      }

      return source
        .filter((item) =>
          [
            item.label,
            item.city,
            item.state,
            item.country,
          ]
            .filter(
              (
                value
              ): value is string =>
                Boolean(value)
            )
            .some((value) =>
              value
                .toLocaleLowerCase()
                .includes(query)
            )
        )
        .slice(0, 8);
    }, [
      destination,
      destinations,
      results,
    ]);

  function changeCounter(
    setter: (
      value:
        | number
        | ((current: number) => number)
    ) => void,
    delta: number,
    minimum: number,
    maximum: number
  ) {
    setter((current) =>
      Math.min(
        maximum,
        Math.max(
          minimum,
          current + delta
        )
      )
    );
  }

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
      !Number.isInteger(adults) ||
      adults < 1 ||
      !Number.isInteger(children) ||
      children < 0 ||
      !Number.isInteger(infants) ||
      infants < 0
    ) {
      setError(
        "Please select at least one adult."
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

      setDestinations(
        Array.isArray(
          data.destinations
        )
          ? data.destinations
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
          className="rounded-[28px] border border-sky-100 bg-white/95 p-2 shadow-[0_22px_70px_-28px_rgba(14,116,144,0.38)] backdrop-blur-xl"
        >
          <div className="grid lg:grid-cols-[1.35fr_1fr_1fr_0.85fr_auto] lg:items-center">
            <div
              ref={destinationRef}
              className="relative"
            >
              <label className="group flex min-h-[74px] cursor-text items-center gap-3 rounded-[22px] px-5 transition hover:bg-sky-50">
                <MapPin className="h-5 w-5 shrink-0 text-sky-700" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-950">
                    Where
                  </span>

                  <input
                    type="text"
                    value={destination}
                    onFocus={() =>
                      setDestinationOpen(
                        true
                      )
                    }
                    onChange={(event) => {
                      setDestination(
                        event.target.value
                      );
                      setDestinationOpen(
                        true
                      );
                    }}
                    placeholder="Search destinations"
                    autoComplete="off"
                    className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              {destinationOpen ? (
                <div className="absolute left-0 top-[82px] z-50 w-full min-w-[320px] overflow-hidden rounded-[24px] border border-sky-100 bg-white p-2 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)] sm:w-[390px]">
                  <div className="px-3 pb-2 pt-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Destinations
                    </p>
                  </div>

                  {filteredDestinations.length >
                  0 ? (
                    <div className="space-y-1">
                      {filteredDestinations.map(
                        (item) => (
                          <button
                            key={`${item.label}-${item.state ?? ""}`}
                            type="button"
                            onClick={() => {
                              setDestination(
                                item.label
                              );
                              setDestinationOpen(
                                false
                              );
                            }}
                            className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-sky-50"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                              <MapPin className="h-5 w-5" />
                            </span>

                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-slate-950">
                                {item.label}
                              </span>

                              {item.state ? (
                                <span className="mt-0.5 block truncate text-xs text-slate-500">
                                  {item.state}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-5 text-sm text-slate-500">
                      Search to see destinations
                      from available HostMetric
                      stays.
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <label className="flex min-h-[74px] items-center gap-3 border-t border-sky-100 px-5 transition hover:bg-sky-50 lg:border-l lg:border-t-0">
              <CalendarDays className="h-5 w-5 shrink-0 text-sky-700" />

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

            <label className="flex min-h-[74px] items-center gap-3 border-t border-sky-100 px-5 transition hover:bg-sky-50 lg:border-l lg:border-t-0">
              <CalendarDays className="h-5 w-5 shrink-0 text-sky-700" />

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

            <div
              ref={guestsRef}
              className="relative border-t border-sky-100 lg:border-l lg:border-t-0"
            >
              <button
                type="button"
                onClick={() =>
                  setGuestsOpen(
                    (current) =>
                      !current
                  )
                }
                className="flex min-h-[74px] w-full items-center gap-3 px-5 text-left transition hover:bg-sky-50"
              >
                <Users className="h-5 w-5 shrink-0 text-sky-700" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-950">
                    Guests
                  </span>

                  <span className="mt-1 block truncate text-sm text-slate-600">
                    {guestSummary}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition ${
                    guestsOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {guestsOpen ? (
                <div className="absolute right-0 top-[82px] z-50 w-[330px] rounded-[24px] border border-sky-100 bg-white p-5 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)]">
                  {[
                    {
                      label: "Adults",
                      description:
                        "Ages 13 or above",
                      value: adults,
                      minimum: 1,
                      maximum: 16,
                      setter: setAdults,
                      icon: Users,
                    },
                    {
                      label: "Children",
                      description:
                        "Ages 2–12",
                      value: children,
                      minimum: 0,
                      maximum: 15,
                      setter: setChildren,
                      icon: Baby,
                    },
                    {
                      label: "Infants",
                      description:
                        "Under 2",
                      value: infants,
                      minimum: 0,
                      maximum: 5,
                      setter: setInfants,
                      icon: Baby,
                    },
                  ].map((item) => {
                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-5 border-b border-slate-100 py-4 first:pt-0 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                            <Icon className="h-5 w-5" />
                          </span>

                          <span>
                            <span className="block text-sm font-semibold text-slate-950">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {item.description}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={
                              item.value <=
                              item.minimum
                            }
                            onClick={() =>
                              changeCounter(
                                item.setter,
                                -1,
                                item.minimum,
                                item.maximum
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-sky-500 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-5 text-center text-sm font-semibold text-slate-950">
                            {item.value}
                          </span>

                          <button
                            type="button"
                            disabled={
                              item.value >=
                              item.maximum
                            }
                            onClick={() =>
                              changeCounter(
                                item.setter,
                                1,
                                item.minimum,
                                item.maximum
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-sky-500 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="p-2">
              <button
                type="submit"
                disabled={
                  loading
                }
                className="flex h-[58px] w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-sky-700 to-cyan-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(3,105,161,0.75)] transition hover:from-sky-800 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
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
        <section className="relative isolate overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-50 shadow-[0_28px_80px_-38px_rgba(14,116,144,0.42)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl" />
            <div className="absolute -bottom-32 right-[-4rem] h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl" />
            <div className="absolute left-[38%] top-[-8rem] h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />

            <svg
              className="absolute bottom-0 left-0 h-40 w-full text-sky-300/50"
              viewBox="0 0 1440 220"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 126C176 75 310 176 493 127C679 77 786 49 950 88C1115 127 1241 172 1440 105"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M0 151C176 100 310 201 493 152C679 102 786 74 950 113C1115 152 1241 197 1440 130"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.7"
              />
              <path
                d="M0 176C176 125 310 226 493 177C679 127 786 99 950 138C1115 177 1241 222 1440 155"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.45"
              />
            </svg>
          </div>

          <div className="relative grid min-h-[360px] place-items-center px-6 py-16 text-center">
            <div className="max-w-xl rounded-[28px] border border-white/80 bg-white/65 px-8 py-9 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur-md sm:px-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-600/20">
                <Search className="h-6 w-6" />
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

              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full border border-white bg-white/75 px-3 py-1.5 shadow-sm">
                  Real-time availability
                </span>
                <span className="rounded-full border border-white bg-white/75 px-3 py-1.5 shadow-sm">
                  Secure booking
                </span>
                <span className="rounded-full border border-white bg-white/75 px-3 py-1.5 shadow-sm">
                  Direct rates
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : results.length ===
        0 ? (
        <section className="rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 px-6 py-16 text-center shadow-[0_24px_70px_-38px_rgba(14,116,144,0.35)]">
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
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 sm:self-auto"
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
                      className={`group overflow-hidden rounded-[26px] border bg-white shadow-[0_14px_45px_-28px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_-28px_rgba(14,116,144,0.45)] ${
                        isActive
                          ? "border-sky-600 ring-2 ring-sky-500/15"
                          : "border-sky-100"
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
                          className="mt-5 h-11 w-full rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-800 hover:to-cyan-700"
                        >
                          View stay
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            <aside className="min-h-[520px] overflow-hidden rounded-[28px] border border-sky-100 bg-sky-50 shadow-[0_18px_55px_-34px_rgba(14,116,144,0.38)] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
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