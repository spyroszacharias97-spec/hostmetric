"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  Plus,
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


type AdminGuestyPropertiesControlsProps = {
  properties:
    GuestyProperty[];

  guestyConfigured:
    boolean;
};


type AddPropertyForm = {
  guestyListingId:
    string;

  title:
    string;

  nickname:
    string;

  listingType:
    string;

  bedrooms:
    string;

  bathrooms:
    string;

  accommodates:
    string;

  city:
    string;

  state:
    string;

  country:
    string;

  currency:
    string;
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


const EMPTY_ADD_FORM:
  AddPropertyForm = {
    guestyListingId:
      "",

    title:
      "",

    nickname:
      "",

    listingType:
      "",

    bedrooms:
      "",

    bathrooms:
      "",

    accommodates:
      "",

    city:
      "",

    state:
      "",

    country:
      "",

    currency:
      "",
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
    addOpen,
    setAddOpen,
  ] =
    useState(false);


  const [
    addLoading,
    setAddLoading,
  ] =
    useState(false);


  const [
    addError,
    setAddError,
  ] =
    useState<string | null>(
      null
    );


  const [
    addForm,
    setAddForm,
  ] =
    useState<AddPropertyForm>(
      EMPTY_ADD_FORM
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
            "Could not load the global direct booking setting."
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
          : "Could not load the global direct booking setting."
      );
    } finally {
      setGlobalLoading(
        false
      );
    }
  }


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
              "Could not load the global direct booking setting."
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
            : "Could not load the global direct booking setting."
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
            "Could not update the global direct booking setting."
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
          : "Could not update the global direct booking setting."
      );
    } finally {
      setGlobalLoading(
        false
      );
    }
  }


  async function addProperty() {
    setAddError(
      null
    );


    if (
      !addForm
        .guestyListingId
        .trim()
    ) {
      setAddError(
        "Guesty Listing ID is required."
      );

      return;
    }


    setAddLoading(
      true
    );


    try {
      const response =
        await fetch(
          "/api/admin/guesty-properties",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                guestyListingId:
                  addForm
                    .guestyListingId
                    .trim(),

                title:
                  addForm.title,

                nickname:
                  addForm.nickname,

                listingType:
                  addForm
                    .listingType,

                bedrooms:
                  addForm.bedrooms,

                bathrooms:
                  addForm.bathrooms,

                accommodates:
                  addForm
                    .accommodates,

                city:
                  addForm.city,

                state:
                  addForm.state,

                country:
                  addForm.country,

                currency:
                  addForm.currency,
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
            "Could not add the Guesty property."
          )
        );
      }


      setAddForm(
        EMPTY_ADD_FORM
      );

      setAddOpen(
        false
      );

      router.refresh();
    } catch (error) {
      setAddError(
        error instanceof Error
          ? error.message
          : "Could not add the Guesty property."
      );
    } finally {
      setAddLoading(
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
            "Could not synchronize Guesty properties."
          )
        );
      }

      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not synchronize Guesty properties."
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
            "Could not synchronize the Guesty property."
          )
        );
      }


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not synchronize the Guesty property."
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
            "Could not update direct booking."
          )
        );
      }


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not update direct booking."
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
        `Remove "${property.name}" from HostMetric?\n\nThis removes only the HostMetric Guesty record. It does not delete the listing from Guesty.`
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
            "Could not remove the Guesty property."
          )
        );
      }


      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not remove the Guesty property."
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
        "From and to dates are required."
      );

      return;
    }


    if (
      calendarFrom >
      calendarTo
    ) {
      setCalendarError(
        "From date cannot be after the to date."
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
            "Could not load the Guesty calendar."
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
          : "Could not load the Guesty calendar."
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
        ? "Sync Error"
        : property.syncStatus ===
            "connected"
          ? "Unsynced"
          : property.syncStatus ===
              "syncing"
            ? "Syncing"
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
                ? "Direct Booking ON"
                : "Direct Booking OFF"
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
                ? "Synchronize this property with Guesty"
                : "Guesty API credentials are required"
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
                ? "Syncing..."
                : "Sync Now"
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
                ? "Open live Guesty availability"
                : "Guesty API credentials are required"
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

            Calendar
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
                ? "Booking ON"
                : "Booking OFF"
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

            Remove
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
                Global Direct Booking
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
              Controls whether the HostMetric
              direct booking experience is
              enabled globally. Individual
              properties must also have Direct
              Booking enabled.
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
                  Guesty API credentials are
                  not configured yet. The
                  controls are ready, but live
                  Guesty sync and calendar
                  requests will require valid
                  credentials.
                </p>
              )
            }
          </div>


          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <button
              type="button"
              onClick={
                loadGlobalSetting
              }
              disabled={
                globalLoading
              }
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                font-bold
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {
                globalLoading
                  ? (
                    <Loader2
                      size={17}
                      className="
                        animate-spin
                      "
                    />
                  )
                  : (
                    <RefreshCw
                      size={17}
                    />
                  )
              }

              {
                globalLoaded
                  ? (
                    globalEnabled
                      ? "Book Now is ON"
                      : "Book Now is OFF"
                  )
                  : "Check Book Now Status"
              }
            </button>


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
                px-5
                text-sm
                font-black
                text-white
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60

                ${
                  globalEnabled
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }
              `}
            >
              <Power
                size={17}
              />

              {
                globalEnabled
                  ? "Turn Book Now OFF"
                  : "Turn Book Now ON"
              }
            </button>


            <button
              type="button"
              onClick={
                syncAllGuestyProperties
              }
              disabled={
                globalSyncLoading ||
                !guestyConfigured
              }
              title={
                guestyConfigured
                  ? "Import and update all listings from Guesty"
                  : "Guesty API credentials are required"
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
                disabled:opacity-50
              "
            >
              {
                globalSyncLoading
                  ? (
                    <Loader2
                      size={17}
                      className="
                        animate-spin
                      "
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
                  ? "Syncing Guesty..."
                  : "Sync Guesty"
              }
            </button>


            <button
              type="button"
              onClick={() => {
                setAddError(
                  null
                );

                setAddOpen(
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
                transition
                hover:bg-blue-700
              "
            >
              <Plus
                size={18}
              />

              Add Guesty Property
            </button>
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
                    Synced (
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
                    Properties successfully synchronized with Guesty.
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
                            No synchronized Guesty properties yet.
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
                    Unsynced / Needs Attention (
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
                    Newly connected properties and properties whose latest sync needs attention.
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
                            No properties need attention.
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


      {/* ADD PROPERTY MODAL */}
      {
        addOpen && (
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
                max-w-3xl
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
                    Add Guesty Property
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Connect a Guesty listing
                    to HostMetric. Guesty
                    Listing ID is required.
                  </p>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setAddOpen(
                      false
                    )
                  }
                  disabled={
                    addLoading
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
                  grid
                  gap-4
                  p-5
                  sm:grid-cols-2
                  sm:p-6
                "
              >
                {
                  [
                    [
                      "guestyListingId",
                      "Guesty Listing ID",
                      "Required",
                    ],

                    [
                      "title",
                      "Title",
                      "Optional before sync",
                    ],

                    [
                      "nickname",
                      "Nickname",
                      "Optional",
                    ],

                    [
                      "listingType",
                      "Listing Type",
                      "Optional",
                    ],

                    [
                      "bedrooms",
                      "Bedrooms",
                      "Optional",
                    ],

                    [
                      "bathrooms",
                      "Bathrooms",
                      "Optional",
                    ],

                    [
                      "accommodates",
                      "Guest Capacity",
                      "Optional",
                    ],

                    [
                      "city",
                      "City",
                      "Optional",
                    ],

                    [
                      "state",
                      "State / Region",
                      "Optional",
                    ],

                    [
                      "country",
                      "Country",
                      "Optional",
                    ],

                    [
                      "currency",
                      "Currency",
                      "EUR",
                    ],
                  ].map(
                    ([
                      key,
                      label,
                      placeholder,
                    ]) => (
                      <label
                        key={
                          key
                        }
                        className="
                          block
                        "
                      >
                        <span
                          className="
                            text-sm
                            font-bold
                            text-slate-700
                          "
                        >
                          {
                            label
                          }
                        </span>

                        <input
                          type={
                            key ===
                              "bedrooms" ||
                            key ===
                              "bathrooms" ||
                            key ===
                              "accommodates"
                              ? "number"
                              : "text"
                          }
                          min={
                            key ===
                            "accommodates"
                              ? "1"
                              : key ===
                                    "bedrooms" ||
                                  key ===
                                    "bathrooms"
                                ? "0"
                                : undefined
                          }
                          step={
                            key ===
                            "bathrooms"
                              ? "0.5"
                              : key ===
                                    "bedrooms" ||
                                  key ===
                                    "accommodates"
                                ? "1"
                                : undefined
                          }
                          value={
                            addForm[
                              key as keyof AddPropertyForm
                            ]
                          }
                          onChange={(
                            event
                          ) =>
                            setAddForm(
                              (
                                current
                              ) => ({
                                ...current,

                                [key]:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          placeholder={
                            placeholder
                          }
                          className="
                            mt-2
                            min-h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3.5
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-blue-400
                            focus:ring-4
                            focus:ring-blue-50
                          "
                        />
                      </label>
                    )
                  )
                }
              </div>


              {
                addError && (
                  <div
                    className="
                      mx-5
                      mb-4
                      rounded-2xl
                      border
                      border-red-100
                      bg-red-50
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-red-700
                      sm:mx-6
                    "
                  >
                    {
                      addError
                    }
                  </div>
                )
              }


              <div
                className="
                  flex
                  justify-end
                  gap-3
                  border-t
                  border-slate-100
                  p-5
                  sm:p-6
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setAddOpen(
                      false
                    )
                  }
                  disabled={
                    addLoading
                  }
                  className="
                    min-h-11
                    rounded-xl
                    border
                    border-slate-200
                    px-5
                    text-sm
                    font-bold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={
                    addProperty
                  }
                  disabled={
                    addLoading
                  }
                  className="
                    inline-flex
                    min-h-11
                    items-center
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
                    addLoading
                      ? (
                        <Loader2
                          size={17}
                          className="
                            animate-spin
                          "
                        />
                      )
                      : (
                        <Plus
                          size={17}
                        />
                      )
                  }

                  Add Property
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
                    Guesty Calendar
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
                      From
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
                      To
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