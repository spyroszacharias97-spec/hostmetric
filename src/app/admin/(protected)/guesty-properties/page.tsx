import {
  Building2,
  CircleAlert,
  CircleCheck,
  PlugZap,
} from "lucide-react";

import {
  neon,
} from "@neondatabase/serverless";

import {
  isGuestyConfigured,
} from "@/lib/guesty/config";

import AdminGuestyPropertiesControls, {
  type AdminGuestyPropertiesDictionary,
} from "@/components/admin-guesty-properties-controls";

import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";


type GuestyPropertyRow = {
  id: number;

  guesty_listing_id:
    string;

  title:
    string | null;

  nickname:
    string | null;

  listing_type:
    string | null;

  bedrooms:
    number | null;

  bathrooms:
    number | null;

  accommodates:
    number | null;

  city:
    string | null;

  state:
    string | null;

  country:
    string | null;

  currency:
    string | null;

  direct_booking_enabled:
    boolean;

  sync_status:
    string;

  last_synced_at:
    string | null;

  last_sync_error:
    string | null;
};


function getSql() {
  const databaseUrl =
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing."
    );
  }

  return neon(databaseUrl);
}


function formatDate(
  value:
    string | null,
  locale: Locale,
  neverLabel: string
) {
  if (!value) {
    return neverLabel;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    locale === "el" ? "el-GR" : "en-GB",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  ).format(date);
}


function getPropertyName(
  property:
    GuestyPropertyRow
) {
  return (
    property.title ||
    property.nickname ||
    property.guesty_listing_id
  );
}


function getLocation(
  property:
    GuestyPropertyRow,
  unavailableLabel: string
) {
  const parts = [
    property.city,
    property.state,
    property.country,
  ].filter(Boolean);

  return (
    parts.join(", ") ||
    unavailableLabel
  );
}


function getSyncClasses(
  status:
    string
) {
  switch (status) {
    case "synced":
      return "bg-emerald-50 text-emerald-700";

    case "syncing":
      return "bg-blue-50 text-blue-700";

    case "error":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}


async function getGuestyProperties() {
  const sql =
    getSql();

  const rows =
    await sql`
      SELECT
        id,
        guesty_listing_id,
        title,
        nickname,
        listing_type,
        bedrooms,
        bathrooms,
        accommodates,
        city,
        state,
        country,
        currency,
        direct_booking_enabled,
        sync_status,
        last_synced_at,
        last_sync_error
      FROM guesty_properties
      ORDER BY
        COALESCE(
          title,
          nickname,
          guesty_listing_id
        ) ASC;
    `;

  return rows.map(
    (row) => ({
      id:
        Number(row.id),

      guesty_listing_id:
        String(
          row.guesty_listing_id
        ),

      title:
        row.title
          ? String(row.title)
          : null,

      nickname:
        row.nickname
          ? String(row.nickname)
          : null,

      listing_type:
        row.listing_type
          ? String(
              row.listing_type
            )
          : null,

      bedrooms:
        row.bedrooms === null ||
        row.bedrooms === undefined
          ? null
          : Number(
              row.bedrooms
            ),

      bathrooms:
        row.bathrooms === null ||
        row.bathrooms === undefined
          ? null
          : Number(
              row.bathrooms
            ),

      accommodates:
        row.accommodates === null ||
        row.accommodates === undefined
          ? null
          : Number(
              row.accommodates
            ),

      city:
        row.city
          ? String(row.city)
          : null,

      state:
        row.state
          ? String(row.state)
          : null,

      country:
        row.country
          ? String(row.country)
          : null,

      currency:
        row.currency
          ? String(row.currency)
          : null,

      direct_booking_enabled:
        Boolean(
          row.direct_booking_enabled
        ),

      sync_status:
        String(
          row.sync_status
        ),

      last_synced_at:
        row.last_synced_at
          ? String(
              row.last_synced_at
            )
          : null,

      last_sync_error:
        row.last_sync_error
          ? String(
              row.last_sync_error
            )
          : null,
    })
  ) as GuestyPropertyRow[];
}


export default async function GuestyPropertiesPage() {
  const cookieStore =
    await cookies();

  const savedLocale =
    cookieStore.get(
      "hostmetric_locale"
    )?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(
      savedLocale
    )
  ) {
    currentLocale =
      savedLocale;
  }

  const siteDictionary =
    await getDictionary(
      currentLocale
    );

  const dictionary =
    (
      siteDictionary as {
        adminGuestyProperties:
          AdminGuestyPropertiesDictionary & {
            integration: string;
            title: string;
            description: string;
            apiConfigured: string;
            apiNotConfigured: string;
            stats: {
              properties: string;
              bookable: string;
              syncErrors: string;
            };
            empty: {
              title: string;
              description: string;
            };
          };
      }
    ).adminGuestyProperties;

  const [
    properties,
    guestyConfigured,
  ] =
    await Promise.all([
      getGuestyProperties(),
      isGuestyConfigured(),
    ]);

  const totalProperties =
    properties.length;

  const bookableProperties =
    properties.filter(
      (property) =>
        property.direct_booking_enabled
    ).length;

  const syncErrors =
    properties.filter(
      (property) =>
        property.sync_status ===
        "error"
    ).length;

  return (
    <div
      className="
        space-y-6
        sm:space-y-8
      "
    >

      {/* HEADER */}
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:p-7
          lg:p-8
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
          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-blue-600
              "
            >
              <PlugZap
                size={18}
              />

              {dictionary.integration}
            </div>

            <h1
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
                text-slate-950
                sm:text-4xl
              "
            >
              {dictionary.title}
            </h1>

            <p
              className="
                mt-3
                max-w-3xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              {dictionary.description}
            </p>
          </div>

          <div
            className={`
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              text-sm
              font-bold

              ${
                guestyConfigured
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }
            `}
          >
            {
              guestyConfigured
                ? (
                  <CircleCheck
                    size={17}
                  />
                )
                : (
                  <CircleAlert
                    size={17}
                  />
                )
            }

            {
              guestyConfigured
                ? dictionary.apiConfigured
                : dictionary.apiNotConfigured
            }
          </div>
        </div>
      </section>


      {/* STATS */}
      <section
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
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
            <Building2
              size={21}
            />
          </div>

          <p
            className="
              mt-4
              text-3xl
              font-black
              text-slate-950
            "
          >
            {
              totalProperties
            }
          </p>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-slate-500
            "
          >
            {dictionary.stats.properties}
          </p>
        </div>


        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-600
            "
          >
            <CircleCheck
              size={21}
            />
          </div>

          <p
            className="
              mt-4
              text-3xl
              font-black
              text-slate-950
            "
          >
            {
              bookableProperties
            }
          </p>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-slate-500
            "
          >
            {dictionary.stats.bookable}
          </p>
        </div>


        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-600
            "
          >
            <CircleAlert
              size={21}
            />
          </div>

          <p
            className="
              mt-4
              text-3xl
              font-black
              text-slate-950
            "
          >
            {
              syncErrors
            }
          </p>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-slate-500
            "
          >
            {dictionary.stats.syncErrors}
          </p>
        </div>
      </section>


      <AdminGuestyPropertiesControls
        guestyConfigured={
          guestyConfigured
        }
        dictionary={
          dictionary
        }
        properties={
          properties.map(
            (property) => ({
              id:
                property.id,

              guestyListingId:
                property.guesty_listing_id,

              name:
                getPropertyName(
                  property
                ),

              location:
                getLocation(
                  property,
                  dictionary.property.locationUnavailable
                ),

              syncStatus:
                property.sync_status,

              lastSyncedAt:
                property.last_synced_at,

              lastSyncError:
                property.last_sync_error,

              directBookingEnabled:
                property.direct_booking_enabled,
            })
          )
        }
      />




      {/* EMPTY STATE */}
      {
        properties.length === 0 && (
          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-5
                py-16
                text-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-500
                "
              >
                <Building2
                  size={25}
                />
              </div>

              <h3
                className="
                  mt-4
                  text-lg
                  font-black
                  text-slate-900
                "
              >
                {dictionary.empty.title}
              </h3>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {dictionary.empty.description}
              </p>
            </div>
          </section>
        )
      }

    </div>
  );
}