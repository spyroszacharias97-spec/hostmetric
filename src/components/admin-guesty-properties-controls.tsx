"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  Power,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";


type GuestyProperty = {
  id: number;

  guestyListingId:
    string;

  name:
    string;

  location:
    string;

  syncStatus:
    string;

  lastSyncedAt:
    string | null;

  lastSyncError:
    string | null;

  directBookingEnabled:
    boolean;
};


export type AdminGuestyPropertiesDictionary = {
  global: {
    title: string;
    description: string;
    propertyRequirement: string;
    credentialsWarning: string;
    statusLabel: string;
    on: string;
    off: string;
    turnOn: string;
    turnOff: string;
    sync: string;
    syncing: string;
    addProperty: string;
  };
  connection: {
    connect: string;
    title: string;
    description: string;
    clientId: string;
    clientIdPlaceholder: string;
    clientSecret: string;
    clientSecretPlaceholder: string;
    showSecret: string;
    hideSecret: string;
    cancel: string;
    saveAndConnect: string;
    connecting: string;
    required: string;
    connectionError: string;
    connectedAndSynced: string;
  };
  property: {
    locationUnavailable: string;
    directBookingOn: string;
    directBookingOff: string;
    sync: string;
    calendar: string;
    delete: string;
    synced: string;
    syncing: string;
    error: string;
    pending: string;
  };
  addModal: {
    title: string;
    description: string;
    listingId: string;
    placeholder: string;
    cancel: string;
    add: string;
    adding: string;
  };
  calendarModal: {
    title: string;
    from: string;
    to: string;
    load: string;
    loading: string;
    close: string;
    available: string;
    unavailable: string;
    reserved: string;
    booked: string;
    minimumNights: string;
  };
  confirm: {
    delete: string;
  };
  tooltips: {
    syncAll: string;
    credentialsRequired: string;
    syncProperty: string;
    calendar: string;
  };
  groups: {
    synced: string;
    syncedDescription: string;
    syncedEmpty: string;
    attention: string;
    attentionDescription: string;
    attentionEmpty: string;
  };
  form: {
    title: string;
    nickname: string;
    listingType: string;
    bedrooms: string;
    bathrooms: string;
    accommodates: string;
    city: string;
    state: string;
    country: string;
    currency: string;
    required: string;
    optional: string;
    optionalBeforeSync: string;
  };
  messages: {
    listingIdRequired: string;
    loadGlobalError: string;
    updateGlobalError: string;
    addError: string;
    syncAllError: string;
    syncPropertyError: string;
    updatePropertyError: string;
    removeError: string;
    calendarError: string;
    fromToRequired: string;
    invalidDateRange: string;
  };
};

type AdminGuestyPropertiesControlsProps = {
  properties:
    GuestyProperty[];

  guestyConfigured:
    boolean;

  dictionary:
    AdminGuestyPropertiesDictionary;
};


type CalendarDay = {
  date:
    string;

  status?:
    string;

  minNights?:
    number;

  isBaseMinNights?:
    boolean;

  cta?:
    boolean;

  ctd?:
    boolean;

  [key: string]:
    unknown;
};


function getToday() {
  const date =
    new Date();

  return date
    .toISOString()
    .slice(
      0,
      10
    );
}


function getFutureDate(
  days:
    number
) {
  const date =
    new Date();

  date.setDate(
    date.getDate() +
      days
  );

  return date
    .toISOString()
    .slice(
      0,
      10
    );
}


function getErrorMessage(
  value:
    unknown,
  fallback:
    string
) {
  if (
    value &&
    typeof value ===
      "object" &&
    "error" in value &&
    typeof value.error ===
      "string"
  ) {
    return value.error;
  }

  return fallback;
}


export default function AdminGuestyPropertiesControls({
  properties,
  guestyConfigured,
  dictionary,
}: AdminGuestyPropertiesControlsProps) {
  const router =
    useRouter();


  const [
    globalEnabled,
    setGlobalEnabled,
  ] =
    useState<boolean | null>(
      null
    );


  const [
    globalLoading,
    setGlobalLoading,
  ] =
    useState(false);


  const [
    globalLoaded,
    setGlobalLoaded,
  ] =
    useState(false);


  const [
    globalSyncLoading,
    setGlobalSyncLoading,
  ] =
    useState(false);


  const [
    syncedOpen,
    setSyncedOpen,
  ] =
    useState(true);


  const [
    attentionOpen,
    setAttentionOpen,
  ] =
    useState(true);


  const [
    connectionOpen,
    setConnectionOpen,
  ] =
    useState(false);

  const [
    clientId,
    setClientId,
  ] =
    useState("");

  const [
    clientSecret,
    setClientSecret,
  ] =
    useState("");

  const [
    showClientSecret,
    setShowClientSecret,
  ] =
    useState(false);

  const [
    connectionLoading,
    setConnectionLoading,
  ] =
    useState(false);

  const [
    connectionError,
    setConnectionError,
  ] =
    useState<string | null>(
      null
    );

  const [
    busyPropertyId,
    setBusyPropertyId,
  ] =
    useState<number | null>(
      null
    );


  const [
    actionError,
    setActionError,
  ] =
    useState<string | null>(
      null
    );


  const [
    calendarProperty,
    setCalendarProperty,
  ] =
    useState<GuestyProperty | null>(
      null
    );


  const [
    calendarFrom,
    setCalendarFrom,
  ] =
    useState(
      getToday()
    );


  const [
    calendarTo,
    setCalendarTo,
  ] =
    useState(
      getFutureDate(
        30
      )
    );


  const [
    calendarLoading,
    setCalendarLoading,
  ] =
    useState(false);


  const [
    calendarError,
    setCalendarError,
  ] =
    useState<string | null>(
      null
    );


  const [
    calendarDays,
    setCalendarDays,
  ] =
    useState<CalendarDay[]>(
      []
    );


  async function loadGlobalSetting() {
    if (
      globalLoaded ||
      globalLoading
    ) {
      return;
    }

    setGlobalLoading(
      true
    );

    try {
      const response =
        await fetch(
          "/api/admin/guesty-properties/settings",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.loadGlobalError
          )
        );
      }

      setGlobalEnabled(
        Boolean(
          data.settings
            ?.directBookingEnabled
        )
      );

      setGlobalLoaded(
        true
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : dictionary.messages.loadGlobalError
      );
    } finally {
      setGlobalLoading(
        false
      );
    }
  }


  useEffect(() => {
    void loadGlobalSetting();
    // loadGlobalSetting intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function toggleGlobalBooking() {
    setActionError(
      null
    );

    let currentValue =
      globalEnabled;


    if (
      !globalLoaded
    ) {
      setGlobalLoading(
        true
      );

      try {
        const response =
          await fetch(
            "/api/admin/guesty-properties/settings",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            getErrorMessage(
              data,
              dictionary.messages.loadGlobalError
            )
          );
        }

        currentValue =
          Boolean(
            data.settings
              ?.directBookingEnabled
          );

        setGlobalEnabled(
          currentValue
        );

        setGlobalLoaded(
          true
        );
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : dictionary.messages.loadGlobalError
        );

        setGlobalLoading(
          false
        );

        return;
      }
    }


    const nextValue =
      !Boolean(
        currentValue
      );


    setGlobalLoading(
      true
    );


    try {
      const response =
        await fetch(
          "/api/admin/guesty-properties/settings",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                directBookingEnabled:
                  nextValue,
              }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.updateGlobalError
          )
        );
      }


      setGlobalEnabled(
        Boolean(
          data.settings
            ?.directBookingEnabled
        )
      );


      setGlobalLoaded(
        true
      );


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : dictionary.messages.updateGlobalError
      );
    } finally {
      setGlobalLoading(
        false
      );
    }
  }


  async function connectGuesty() {
    setConnectionError(
      null
    );

    const normalizedClientId =
      clientId.trim();

    const normalizedClientSecret =
      clientSecret.trim();

    if (
      !normalizedClientId ||
      !normalizedClientSecret
    ) {
      setConnectionError(
        dictionary.connection.required
      );

      return;
    }

    setConnectionLoading(
      true
    );

    try {
      const response =
        await fetch(
          "/api/admin/guesty-properties/connection",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                clientId:
                  normalizedClientId,

                clientSecret:
                  normalizedClientSecret,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.connection.connectionError
          )
        );
      }

      const syncResponse =
        await fetch(
          "/api/admin/guesty-properties/sync",
          {
            method:
              "POST",
          }
        );

      const syncData =
        await syncResponse.json();

      if (
        !syncResponse.ok ||
        !syncData.success
      ) {
        throw new Error(
          getErrorMessage(
            syncData,
            dictionary.messages.syncAllError
          )
        );
      }

      setClientId("");
      setClientSecret("");
      setShowClientSecret(false);
      setConnectionOpen(false);

      router.refresh();
    } catch (error) {
      setConnectionError(
        error instanceof Error
          ? error.message
          : dictionary.connection.connectionError
      );
    } finally {
      setConnectionLoading(
        false
      );
    }
  }


  async function syncAllGuestyProperties() {
    setActionError(
      null
    );

    setGlobalSyncLoading(
      true
    );

    try {
      const response =
        await fetch(
          "/api/admin/guesty-properties/sync",
          {
            method:
              "POST",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.syncAllError
          )
        );
      }

      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : dictionary.messages.syncAllError
      );
    } finally {
      setGlobalSyncLoading(
        false
      );
    }
  }


  async function syncProperty(
    property:
      GuestyProperty
  ) {
    setActionError(
      null
    );

    setBusyPropertyId(
      property.id
    );


    try {
      const response =
        await fetch(
          `/api/admin/guesty-properties/${property.id}/sync`,
          {
            method:
              "POST",
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.syncPropertyError
          )
        );
      }


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : dictionary.messages.syncPropertyError
      );

      router.refresh();
    } finally {
      setBusyPropertyId(
        null
      );
    }
  }


  async function toggleProperty(
    property:
      GuestyProperty
  ) {
    setActionError(
      null
    );

    setBusyPropertyId(
      property.id
    );


    try {
      const response =
        await fetch(
          `/api/admin/guesty-properties/${property.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                directBookingEnabled:
                  !property
                    .directBookingEnabled,
              }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.updatePropertyError
          )
        );
      }


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : dictionary.messages.updatePropertyError
      );
    } finally {
      setBusyPropertyId(
        null
      );
    }
  }


  async function deleteProperty(
    property:
      GuestyProperty
  ) {
    const confirmed =
      window.confirm(
        dictionary.confirm.delete
      );


    if (!confirmed) {
      return;
    }


    setActionError(
      null
    );

    setBusyPropertyId(
      property.id
    );


    try {
      const response =
        await fetch(
          `/api/admin/guesty-properties/${property.id}`,
          {
            method:
              "DELETE",
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.removeError
          )
        );
      }


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : dictionary.messages.removeError
      );
    } finally {
      setBusyPropertyId(
        null
      );
    }
  }


  async function loadCalendar() {
    if (
      !calendarProperty
    ) {
      return;
    }


    if (
      !calendarFrom ||
      !calendarTo
    ) {
      setCalendarError(
        dictionary.messages.fromToRequired
      );

      return;
    }


    if (
      calendarFrom >
      calendarTo
    ) {
      setCalendarError(
        dictionary.messages.invalidDateRange
      );

      return;
    }


    setCalendarLoading(
      true
    );

    setCalendarError(
      null
    );

    setCalendarDays(
      []
    );


    try {
      const params =
        new URLSearchParams({
          from:
            calendarFrom,

          to:
            calendarTo,
        });


      const response =
        await fetch(
          `/api/admin/guesty-properties/${calendarProperty.id}/calendar?${params.toString()}`,
          {
            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            dictionary.messages.calendarError
          )
        );
      }


      setCalendarDays(
        Array.isArray(
          data.calendar
        )
          ? data.calendar
          : []
      );
    } catch (error) {
      setCalendarError(
        error instanceof Error
          ? error.message
          : dictionary.messages.calendarError
      );
    } finally {
      setCalendarLoading(
        false
      );
    }
  }


  function openCalendar(
    property:
      GuestyProperty
  ) {
    setCalendarProperty(
      property
    );

    setCalendarError(
      null
    );

    setCalendarDays(
      []
    );
  }


  const syncedProperties =
    properties.filter(
      (property) =>
        property.syncStatus ===
        "synced"
    );


  const attentionProperties =
    properties.filter(
      (property) =>
        property.syncStatus !==
        "synced"
    );


  function renderPropertyCard(
    property:
      GuestyProperty
  ) {
    const busy =
      busyPropertyId ===
      property.id;

    const synced =
      property.syncStatus ===
      "synced";

    const statusLabel =
      property.syncStatus ===
      "error"
        ? dictionary.property.error
        : property.syncStatus ===
            "connected"
          ? dictionary.property.pending
          : property.syncStatus ===
              "syncing"
            ? dictionary.property.syncing
            : property.syncStatus;

    return (
      <article
        key={
          property.id
        }
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          transition
          hover:border-slate-300
          hover:shadow-md
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                text-base
                font-black
                text-slate-950
              "
              title={
                property.name
              }
            >
              {
                property.name
              }
            </h3>

            <p
              className="
                mt-1
                truncate
                text-sm
                font-semibold
                text-slate-500
              "
              title={
                property.location
              }
            >
              {
                property.location
              }
            </p>
          </div>

          <span
            className={`
              shrink-0
              rounded-full
              px-2.5
              py-1
              text-[11px]
              font-black
              uppercase
              tracking-wide

              ${
                synced
                  ? "bg-emerald-50 text-emerald-700"
                  : property.syncStatus ===
                      "error"
                    ? "bg-red-50 text-red-700"
                    : property.syncStatus ===
                        "syncing"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
              }
            `}
          >
            {
              statusLabel
            }
          </span>
        </div>

        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-full
              px-2.5
              py-1
              text-[11px]
              font-black
              uppercase
              tracking-wide

              ${
                property.directBookingEnabled
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {
              property.directBookingEnabled
                ? (
                  <Check
                    size={13}
                  />
                )
                : (
                  <Power
                    size={13}
                  />
                )
            }

            {
              property.directBookingEnabled
                ? dictionary.property.directBookingOn
                : dictionary.property.directBookingOff
            }
          </span>
        </div>

        {
          property.lastSyncError && (
            <p
              className="
                mt-3
                line-clamp-2
                text-xs
                font-semibold
                leading-5
                text-red-600
              "
              title={
                property.lastSyncError
              }
            >
              {
                property.lastSyncError
              }
            </p>
          )
        }

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-2
          "
        >
          <button
            type="button"
            onClick={() =>
              syncProperty(
                property
              )
            }
            disabled={
              busy ||
              !guestyConfigured
            }
            title={
              guestyConfigured
                ? dictionary.tooltips.syncProperty
                : dictionary.tooltips.credentialsRequired
            }
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-3
              text-xs
              font-black
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {
              busy
                ? (
                  <Loader2
                    size={15}
                    className="
                      animate-spin
                    "
                  />
                )
                : (
                  <RefreshCw
                    size={15}
                  />
                )
            }

            {
              busy
                ? dictionary.global.syncing
                : dictionary.property.sync
            }
          </button>

          <button
            type="button"
            onClick={() =>
              openCalendar(
                property
              )
            }
            disabled={
              !guestyConfigured
            }
            title={
              guestyConfigured
                ? dictionary.tooltips.calendar
                : dictionary.tooltips.credentialsRequired
            }
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-xs
              font-bold
              text-slate-700
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <CalendarDays
              size={15}
            />

            {dictionary.property.calendar}
          </button>

          <button
            type="button"
            onClick={() =>
              toggleProperty(
                property
              )
            }
            disabled={
              busy
            }
            className={`
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              px-3
              text-xs
              font-black
              transition
              disabled:cursor-not-allowed
              disabled:opacity-60

              ${
                property.directBookingEnabled
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >
            {
              property.directBookingEnabled
                ? (
                  <Check
                    size={15}
                  />
                )
                : (
                  <Power
                    size={15}
                  />
                )
            }

            {
              property.directBookingEnabled
                ? dictionary.property.directBookingOn
                : dictionary.property.directBookingOff
            }
          </button>

          <button
            type="button"
            onClick={() =>
              deleteProperty(
                property
              )
            }
            disabled={
              busy
            }
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-50
              px-3
              text-xs
              font-bold
              text-red-700
              transition
              hover:bg-red-100
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Trash2
              size={15}
            />

            {dictionary.property.delete}
          </button>
        </div>
      </article>
    );
  }


  return (
    <>
      {/* GLOBAL CONTROLS */}
      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Power
                size={20}
                className="
                  text-blue-600
                "
              />

              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                {dictionary.global.title}
              </h2>
            </div>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              {dictionary.global.description}{" "}
              {dictionary.global.propertyRequirement}
            </p>

            {
              !guestyConfigured && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-bold
                    text-amber-600
                  "
                >
                  {dictionary.global.credentialsWarning}
                </p>
              )
            }
          </div>


          <div
            className="
              w-full
              lg:max-w-3xl
            "
          >
            <div
              className="
                flex
                justify-start
                lg:justify-end
              "
            >
              <div
                className={`
                  min-w-[230px]
                  rounded-2xl
                  border
                  px-4
                  py-3

                  ${
                    globalEnabled
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }
                `}
                aria-live="polite"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {dictionary.global.statusLabel}
                </div>

                <div
                  className={`
                    mt-1
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-black

                    ${
                      globalEnabled
                        ? "text-emerald-700"
                        : "text-slate-700"
                    }
                  `}
                >
                  {globalLoading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <span
                      className={`
                        h-2.5
                        w-2.5
                        rounded-full

                        ${
                          globalEnabled
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }
                      `}
                    />
                  )}

                  {globalEnabled
                    ? dictionary.global.on
                    : dictionary.global.off}
                </div>
              </div>
            </div>

            <div
              className="
                mt-4
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={
                  toggleGlobalBooking
                }
                disabled={
                  globalLoading
                }
                className={`
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-5
                  text-sm
                  font-black
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  ${
                    globalEnabled
                      ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                      : "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                  }
                `}
              >
                {
                  globalLoading
                    ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    )
                    : (
                      <Power
                        size={17}
                      />
                    )
                }

                {
                  globalEnabled
                    ? dictionary.global.turnOff
                    : dictionary.global.turnOn
                }
              </button>

              {
                guestyConfigured
                  ? (
                    <button
                      type="button"
                      onClick={
                        syncAllGuestyProperties
                      }
                      disabled={
                        globalSyncLoading
                      }
                      title={
                        dictionary.tooltips.syncAll
                      }
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-blue-200
                        bg-blue-50
                        px-5
                        text-sm
                        font-black
                        text-blue-700
                        transition
                        hover:bg-blue-100
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {
                        globalSyncLoading
                          ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          )
                          : (
                            <RefreshCw
                              size={17}
                            />
                          )
                      }

                      {
                        globalSyncLoading
                          ? dictionary.global.syncing
                          : dictionary.global.sync
                      }
                    </button>
                  )
                  : (
                    <button
                      type="button"
                      onClick={() => {
                        setConnectionError(
                          null
                        );

                        setConnectionOpen(
                          true
                        );
                      }}
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5
                        text-sm
                        font-black
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                      "
                    >
                      <Link2
                        size={17}
                      />

                      {dictionary.connection.connect}
                    </button>
                  )
              }
            </div>
          </div>
        </div>


        {
          actionError && (
            <div
              className="
                mt-4
                rounded-2xl
                border
                border-red-100
                bg-red-50
                px-4
                py-3
                text-sm
                font-semibold
                text-red-700
              "
            >
              {
                actionError
              }
            </div>
          )
        }
      </section>


      {/* PROPERTY GROUPS */}
      {
        properties.length >
          0 && (
          <section
            className="
              space-y-4
            "
          >
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <button
                type="button"
                onClick={() =>
                  setSyncedOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-4
                  text-left
                  transition
                  hover:bg-slate-50
                  sm:px-6
                "
              >
                <div>
                  <h2
                    className="
                      text-base
                      font-black
                      text-slate-950
                    "
                  >
                    {dictionary.groups.synced} (
                    {
                      syncedProperties.length
                    }
                    )
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-500
                    "
                  >
                    {dictionary.groups.syncedDescription}
                  </p>
                </div>

                <ChevronDown
                  size={19}
                  className={`
                    shrink-0
                    text-slate-500
                    transition-transform

                    ${
                      syncedOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {
                syncedOpen && (
                  <div
                    className="
                      border-t
                      border-slate-100
                      p-4
                      sm:p-5
                    "
                  >
                    {
                      syncedProperties.length >
                        0
                        ? (
                          <div
                            className="
                              grid
                              gap-3
                              sm:grid-cols-2
                              xl:grid-cols-3
                            "
                          >
                            {
                              syncedProperties.map(
                                renderPropertyCard
                              )
                            }
                          </div>
                        )
                        : (
                          <div
                            className="
                              rounded-2xl
                              bg-slate-50
                              px-4
                              py-6
                              text-center
                              text-sm
                              font-semibold
                              text-slate-500
                            "
                          >
                            {dictionary.groups.syncedEmpty}
                          </div>
                        )
                    }
                  </div>
                )
              }
            </div>


            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <button
                type="button"
                onClick={() =>
                  setAttentionOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-4
                  text-left
                  transition
                  hover:bg-slate-50
                  sm:px-6
                "
              >
                <div>
                  <h2
                    className="
                      text-base
                      font-black
                      text-slate-950
                    "
                  >
                    {dictionary.groups.attention} (
                    {
                      attentionProperties.length
                    }
                    )
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-500
                    "
                  >
                    {dictionary.groups.attentionDescription}
                  </p>
                </div>

                <ChevronDown
                  size={19}
                  className={`
                    shrink-0
                    text-slate-500
                    transition-transform

                    ${
                      attentionOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {
                attentionOpen && (
                  <div
                    className="
                      border-t
                      border-slate-100
                      p-4
                      sm:p-5
                    "
                  >
                    {
                      attentionProperties.length >
                        0
                        ? (
                          <div
                            className="
                              grid
                              gap-3
                              sm:grid-cols-2
                              xl:grid-cols-3
                            "
                          >
                            {
                              attentionProperties.map(
                                renderPropertyCard
                              )
                            }
                          </div>
                        )
                        : (
                          <div
                            className="
                              rounded-2xl
                              bg-slate-50
                              px-4
                              py-6
                              text-center
                              text-sm
                              font-semibold
                              text-slate-500
                            "
                          >
                            {dictionary.groups.attentionEmpty}
                          </div>
                        )
                    }
                  </div>
                )
              }
            </div>
          </section>
        )
      }


      {/* GUESTY CONNECTION MODAL */}
      {
        connectionOpen && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-slate-950/45
              p-4
              backdrop-blur-sm
            "
          >
            <div
              className="
                w-full
                max-w-lg
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-2xl
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  border-b
                  border-slate-100
                  px-6
                  py-5
                "
              >
                <div>
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <Link2
                      size={21}
                    />
                  </div>

                  <h2
                    className="
                      mt-4
                      text-xl
                      font-black
                      text-slate-950
                    "
                  >
                    {dictionary.connection.title}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {dictionary.connection.description}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    connectionLoading
                  }
                  onClick={() =>
                    setConnectionOpen(
                      false
                    )
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <X size={19} />
                </button>
              </div>

              <div
                className="
                  space-y-5
                  px-6
                  py-6
                "
              >
                <label className="block">
                  <span
                    className="
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {dictionary.connection.clientId}
                  </span>

                  <input
                    value={clientId}
                    onChange={(event) =>
                      setClientId(
                        event.target.value
                      )
                    }
                    autoComplete="off"
                    placeholder={
                      dictionary.connection.clientIdPlaceholder
                    }
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      text-sm
                      font-semibold
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />
                </label>

                <label className="block">
                  <span
                    className="
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {dictionary.connection.clientSecret}
                  </span>

                  <div
                    className="
                      relative
                      mt-2
                    "
                  >
                    <input
                      type={
                        showClientSecret
                          ? "text"
                          : "password"
                      }
                      value={clientSecret}
                      onChange={(event) =>
                        setClientSecret(
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                      placeholder={
                        dictionary.connection.clientSecretPlaceholder
                      }
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-4
                        pr-12
                        text-sm
                        font-semibold
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-50
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowClientSecret(
                          !showClientSecret
                        )
                      }
                      title={
                        showClientSecret
                          ? dictionary.connection.hideSecret
                          : dictionary.connection.showSecret
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        hover:bg-slate-100
                      "
                    >
                      {
                        showClientSecret
                          ? <EyeOff size={18} />
                          : <Eye size={18} />
                      }
                    </button>
                  </div>
                </label>

                {
                  connectionError && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-700
                      "
                    >
                      {connectionError}
                    </div>
                  )
                }
              </div>

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-slate-100
                  bg-slate-50
                  px-6
                  py-4
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  disabled={
                    connectionLoading
                  }
                  onClick={() =>
                    setConnectionOpen(
                      false
                    )
                  }
                  className="
                    min-h-11
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    text-sm
                    font-black
                    text-slate-700
                    hover:bg-slate-100
                  "
                >
                  {dictionary.connection.cancel}
                </button>

                <button
                  type="button"
                  disabled={
                    connectionLoading
                  }
                  onClick={
                    connectGuesty
                  }
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    text-sm
                    font-black
                    text-white
                    shadow-sm
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {
                    connectionLoading
                      ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      )
                      : (
                        <Link2 size={17} />
                      )
                  }

                  {
                    connectionLoading
                      ? dictionary.connection.connecting
                      : dictionary.connection.saveAndConnect
                  }
                </button>
              </div>
            </div>
          </div>
        )
      }


      {/* CALENDAR MODAL */}
      {
        calendarProperty && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-slate-950/50
              p-4
              backdrop-blur-sm
            "
          >
            <div
              className="
                max-h-[90vh]
                w-full
                max-w-5xl
                overflow-y-auto
                rounded-3xl
                bg-white
                shadow-2xl
              "
            >
              <div
                className="
                  sticky
                  top-0
                  z-10
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-100
                  bg-white
                  p-5
                  sm:p-6
                "
              >
                <div>
                  <h2
                    className="
                      text-xl
                      font-black
                      text-slate-950
                    "
                  >
                    {dictionary.calendarModal.title}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {
                      calendarProperty.name
                    }
                  </p>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setCalendarProperty(
                      null
                    )
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    text-slate-500
                    transition
                    hover:bg-slate-50
                  "
                >
                  <X
                    size={19}
                  />
                </button>
              </div>


              <div
                className="
                  p-5
                  sm:p-6
                "
              >
                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-[1fr_1fr_auto]
                    sm:items-end
                  "
                >
                  <label>
                    <span
                      className="
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      {dictionary.calendarModal.from}
                    </span>

                    <input
                      type="date"
                      value={
                        calendarFrom
                      }
                      onChange={(
                        event
                      ) =>
                        setCalendarFrom(
                          event
                            .target
                            .value
                        )
                      }
                      className="
                        mt-2
                        min-h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-3.5
                        text-sm
                        outline-none
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-50
                      "
                    />
                  </label>


                  <label>
                    <span
                      className="
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      {dictionary.calendarModal.to}
                    </span>

                    <input
                      type="date"
                      value={
                        calendarTo
                      }
                      onChange={(
                        event
                      ) =>
                        setCalendarTo(
                          event
                            .target
                            .value
                        )
                      }
                      className="
                        mt-2
                        min-h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-3.5
                        text-sm
                        outline-none
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-50
                      "
                    />
                  </label>


                  <button
                    type="button"
                    onClick={
                      loadCalendar
                    }
                    disabled={
                      calendarLoading
                    }
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      px-5
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-blue-700
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {
                      calendarLoading
                        ? (
                          <Loader2
                            size={17}
                            className="
                              animate-spin
                            "
                          />
                        )
                        : (
                          <CalendarDays
                            size={17}
                          />
                        )
                    }

                    Load Calendar
                  </button>
                </div>


                {
                  calendarError && (
                    <div
                      className="
                        mt-5
                        rounded-2xl
                        border
                        border-red-100
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-700
                      "
                    >
                      {
                        calendarError
                      }
                    </div>
                  )
                }


                {
                  !calendarLoading &&
                  !calendarError &&
                  calendarDays.length ===
                    0 && (
                    <div
                      className="
                        mt-6
                        rounded-2xl
                        bg-slate-50
                        p-8
                        text-center
                        text-sm
                        font-semibold
                        text-slate-500
                      "
                    >
                      Select a date range and
                      load the live Guesty
                      calendar.
                    </div>
                  )
                }


                {
                  calendarDays.length >
                    0 && (
                    <div
                      className="
                        mt-6
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                      "
                    >
                      {
                        calendarDays.map(
                          (
                            day
                          ) => (
                            <div
                              key={
                                day.date
                              }
                              className="
                                rounded-2xl
                                border
                                border-slate-200
                                p-4
                              "
                            >
                              <p
                                className="
                                  text-sm
                                  font-black
                                  text-slate-900
                                "
                              >
                                {
                                  day.date
                                }
                              </p>

                              <p
                                className="
                                  mt-2
                                  text-xs
                                  font-bold
                                  uppercase
                                  tracking-wide
                                  text-slate-500
                                "
                              >
                                {
                                  day.status ??
                                  "Unknown"
                                }
                              </p>

                              <p
                                className="
                                  mt-2
                                  text-xs
                                  text-slate-500
                                "
                              >
                                Minimum nights:{" "}
                                {
                                  day.minNights ??
                                  "—"
                                }
                              </p>
                            </div>
                          )
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}