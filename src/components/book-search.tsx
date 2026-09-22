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

export type BookingSearchDictionary = {
  fields: {
    where: string;
    destinationPlaceholder: string;
    destinations: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    guest: string;
    guestsPlural: string;
    adults: string;
    adultsDescription: string;
    children: string;
    childrenDescription: string;
    infants: string;
    infant: string;
    infantsDescription: string;
  };
  actions: {
    search: string;
    searching: string;
    viewStay: string;
  };
  destinations: {
    searchHint: string;
  };
  results: {
    exploreTitle: string;
    availableTitle: string;
    propertiesSingular: string;
    propertiesPlural: string;
    staySingular: string;
    stayPlural: string;
    availableSuffix: string;
    loadingProperties: string;
    intro: string;
    guestyConnected: string;
    noBookableTitle: string;
    noBookableDescription: string;
    noResultsTitle: string;
    noResultsDescription: string;
    noPhoto: string;
    selectDatesPricing: string;
  };
  property: {
    bedroomSingular: string;
    bedroomPlural: string;
    bathroomSingular: string;
    bathroomPlural: string;
    bedroomsShort: string;
    bathroomsShort: string;
    upToGuests: string;
    total: string;
    totalStay: string;
    defaultTitle: string;
  };
  map: {
    ariaLabel: string;
    viewPropertyAria: string;
    noLocationsTitle: string;
    noLocationsDescription: string;
  };
  errors: {
    datesRequired: string;
    checkoutAfterCheckin: string;
    adultRequired: string;
    loadProperties: string;
    searchProperties: string;
    directBookingUnavailable: string;
  };
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
  listing: BookingSearchResult,
  defaultTitle: string
) {
  return (
    listing.title ||
    listing.nickname ||
    defaultTitle
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

export default function BookSearch({
  dictionary,
}: {
  dictionary: BookingSearchDictionary;
}) {
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
        ? dictionary.fields.guest
        : dictionary.fields.guestsPlural
    }${
      infants > 0
        ? `, ${infants} ${
            infants === 1
              ? dictionary.fields.infant
              : dictionary.fields.infants
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
    initialLoading,
    setInitialLoading,
  ] = useState(true);

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
    const controller =
      new AbortController();

    async function loadBookableProperties() {
      try {
        setInitialLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/booking/search?browse=true",
            {
              method: "GET",
              cache: "no-store",
              signal:
                controller.signal,
            }
          );

        const data =
          (await response.json()) as BookingSearchResponse;

        if (!response.ok) {
          throw new Error(
            data.error ||
              dictionary.errors.loadProperties
          );
        }

        if (data.enabled === false) {
          setResults([]);
          setDestinations([]);
          return;
        }

        setResults(
          Array.isArray(data.results)
            ? data.results
            : []
        );

        setDestinations(
          Array.isArray(data.destinations)
            ? data.destinations
            : []
        );
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
            : dictionary.errors.loadProperties
        );
      } finally {
        if (!controller.signal.aborted) {
          setInitialLoading(false);
        }
      }
    }

    void loadBookableProperties();

    return () => {
      controller.abort();
    };
  }, []);

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
        dictionary.errors.datesRequired
      );

      return;
    }

    if (
      checkOut <= checkIn
    ) {
      setError(
        dictionary.errors.checkoutAfterCheckin
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
        dictionary.errors.adultRequired
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
            dictionary.errors.searchProperties
        );
      }

      if (
        data.enabled === false
      ) {
        setResults([]);
        setHasSearched(true);

        setError(
          dictionary.errors.directBookingUnavailable
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
          : dictionary.errors.searchProperties
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
                    {dictionary.fields.where}
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
                    placeholder={dictionary.fields.destinationPlaceholder}
                    autoComplete="off"
                    className="mt-1 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              {destinationOpen ? (
                <div className="absolute left-0 top-[82px] z-50 w-full min-w-[320px] overflow-hidden rounded-[24px] border border-sky-100 bg-white p-2 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)] sm:w-[390px]">
                  <div className="px-3 pb-2 pt-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      {dictionary.fields.destinations}
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
                      {dictionary.destinations.searchHint}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <label className="flex min-h-[74px] items-center gap-3 border-t border-sky-100 px-5 transition hover:bg-sky-50 lg:border-l lg:border-t-0">
              <CalendarDays className="h-5 w-5 shrink-0 text-sky-700" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-950">
                  {dictionary.fields.checkIn}
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
                  {dictionary.fields.checkOut}
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
                    {dictionary.fields.guests}
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
                      label: dictionary.fields.adults,
                      description:
                        "Ages 13 or above",
                      value: adults,
                      minimum: 1,
                      maximum: 16,
                      setter: setAdults,
                      icon: Users,
                    },
                    {
                      label: dictionary.fields.children,
                      description:
                        "Ages 2–12",
                      value: children,
                      minimum: 0,
                      maximum: 15,
                      setter: setChildren,
                      icon: Baby,
                    },
                    {
                      label: dictionary.fields.infants,
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
                  ? dictionary.actions.searching
                  : dictionary.actions.search}
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

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {initialLoading
                ? dictionary.results.loadingProperties
                : hasSearched
                  ? `${results.length} ${
                    results.length === 1
                      ? dictionary.results.staySingular
                      : dictionary.results.stayPlural
                  } ${dictionary.results.availableSuffix}`
                  : `${results.length} ${
                    results.length === 1
                      ? dictionary.results.propertiesSingular
                      : dictionary.results.propertiesPlural
                  }`}
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {hasSearched
                ? dictionary.results.availableTitle
                : dictionary.results.exploreTitle}
            </h2>

            {!hasSearched ? (
              <p className="mt-1 text-sm text-slate-500">
                {dictionary.results.intro}
              </p>
            ) : null}
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-sky-100 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {dictionary.results.guestyConnected}
          </div>
        </div>

        {initialLoading ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(440px,1.08fr)]">
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[210px] animate-pulse rounded-[26px] border border-sky-100 bg-white"
                />
              ))}
            </div>

            <div className="min-h-[420px] animate-pulse rounded-[28px] border border-sky-100 bg-sky-50 lg:h-[420px]" />
          </div>
        ) : results.length === 0 ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(440px,1.08fr)]">
            <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-sky-100 bg-white px-8 text-center shadow-sm">
              <div className="max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <Search className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-950">
                  {hasSearched
                    ? dictionary.results.noResultsTitle
                    : dictionary.results.noBookableTitle}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {hasSearched
                    ? dictionary.results.noResultsDescription
                    : dictionary.results.noBookableDescription}
                </p>
              </div>
            </div>

            <aside className="min-h-[420px] overflow-hidden rounded-[28px] border border-sky-100 bg-sky-50 shadow-[0_18px_55px_-34px_rgba(14,116,144,0.38)] lg:sticky lg:top-24 lg:h-[420px]">
              <BookingMap
                properties={[]}
                dictionary={dictionary}
                activePropertyId={null}
              />
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(440px,1.08fr)]">
            <div className="space-y-4">
              {results.map((listing) => {
                const image =
                  getMainPicture(listing);

                const location =
                  getListingLocation(listing);

                const price =
                  getListingPrice(listing);

                const isActive =
                  activePropertyId ===
                  listing.id;

                return (
                  <article
                    id={`booking-property-${listing.id}`}
                    key={listing.id}
                    onMouseEnter={() =>
                      setActivePropertyId(
                        listing.id
                      )
                    }
                    onMouseLeave={() =>
                      setActivePropertyId(null)
                    }
                    onClick={() =>
                      setActivePropertyId(
                        listing.id
                      )
                    }
                    className={`group overflow-hidden rounded-[26px] border bg-white shadow-[0_14px_45px_-28px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-28px_rgba(14,116,144,0.45)] ${
                      isActive
                        ? "border-sky-600 ring-2 ring-sky-500/15"
                        : "border-sky-100"
                    }`}
                  >
                    <div className="grid sm:grid-cols-[210px_minmax(0,1fr)]">
                      <div className="relative min-h-[190px] overflow-hidden bg-slate-100 sm:min-h-[220px]">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              listing.pictures[0]
                                ?.caption ||
                              getListingName(
                                listing,
                                dictionary.property.defaultTitle
                              )
                            }
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full min-h-[190px] items-center justify-center px-6 text-center text-sm text-slate-400 sm:min-h-[220px]">
                            {dictionary.results.noPhoto}
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-slate-950">
                              {getListingName(
                                listing,
                                dictionary.property.defaultTitle
                              )}
                            </h3>

                            {location ? (
                              <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-700" />
                                <span className="truncate">
                                  {location}
                                </span>
                              </p>
                            ) : null}
                          </div>

                          {listing.type ? (
                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                              {listing.type}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                          {listing.bedrooms !== null ? (
                            <span className="rounded-full bg-slate-50 px-2.5 py-1.5">
                              {listing.bedrooms} {listing.bedrooms === 1
                                ? dictionary.property.bedroomSingular
                                : dictionary.property.bedroomPlural}
                            </span>
                          ) : null}

                          {listing.bathrooms !== null ? (
                            <span className="rounded-full bg-slate-50 px-2.5 py-1.5">
                              {listing.bathrooms} {listing.bathrooms === 1
                                ? dictionary.property.bathroomSingular
                                : dictionary.property.bathroomPlural}
                            </span>
                          ) : null}

                          {listing.accommodates !== null ? (
                            <span className="rounded-full bg-slate-50 px-2.5 py-1.5">
                              {dictionary.property.upToGuests.replace(
                                "{count}",
                                String(listing.accommodates)
                              )}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-auto pt-5">
                          {hasSearched && price ? (
                            <div className="mb-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                              <span className="text-xs font-medium text-slate-500">
                                {dictionary.property.totalStay}
                              </span>

                              <span className="text-lg font-semibold tracking-tight text-slate-950">
                                {price}
                              </span>
                            </div>
                          ) : !hasSearched ? (
                            <p className="mb-3 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                              {dictionary.results.selectDatesPricing}
                            </p>
                          ) : null}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              const params =
                                new URLSearchParams();

                              if (checkIn) {
                                params.set(
                                  "checkIn",
                                  checkIn
                                );
                              }

                              if (checkOut) {
                                params.set(
                                  "checkOut",
                                  checkOut
                                );
                              }

                              params.set(
                                "adults",
                                String(adults)
                              );

                              params.set(
                                "children",
                                String(children)
                              );

                              params.set(
                                "infants",
                                String(infants)
                              );

                              const query =
                                params.toString();

                              window.location.href =
                                `/book/${listing.id}${
                                  query
                                    ? `?${query}`
                                    : ""
                                }`;
                            }}
                            className="h-10 w-full rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:from-sky-800 hover:to-cyan-700"
                          >
                            {dictionary.actions.viewStay}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="min-h-[420px] overflow-hidden rounded-[28px] border border-sky-100 bg-sky-50 shadow-[0_18px_55px_-34px_rgba(14,116,144,0.38)] lg:sticky lg:top-24 lg:h-[420px]">
              <BookingMap
                properties={results}
                dictionary={dictionary}
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
                      behavior: "smooth",
                      block: "center",
                    });
                }}
              />
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}