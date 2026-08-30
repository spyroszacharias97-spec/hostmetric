import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  Home,
  Mail,
  MapPin,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

import {
  getAdminDictionary,
} from "@/i18n/admin";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


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


type OnboardingPropertyRow = {
  submission_id: number;
  contact_id: number;
  property_id: number | null;

  owner_name: string | null;
  email: string;
  phone: string | null;

  property_name: string | null;
  property_type: string | null;
  country: string | null;
  city: string | null;

  onboarding_status: string | null;
  property_status: string | null;

  physical_units: number;

  created_at:
    | string
    | Date
    | null;
};


async function getCompletedGetStartedProperties() {
  const sql = getSql();

  const rows = await sql`
    SELECT
      os.id AS submission_id,
      os.contact_id,

      p.id AS property_id,

      COALESCE(
        c.full_name,
        NULLIF(
          TRIM(
            CONCAT(
              COALESCE(os.first_name, ''),
              ' ',
              COALESCE(os.last_name, '')
            )
          ),
          ''
        )
      ) AS owner_name,

      COALESCE(
        c.email,
        os.email
      ) AS email,

      COALESCE(
        c.phone,
        os.phone
      ) AS phone,

      COALESCE(
        p.property_name,
        os.property_name
      ) AS property_name,

      COALESCE(
        p.property_type,
        os.property_type
      ) AS property_type,

      COALESCE(
        p.country,
        os.property_country
      ) AS country,

      COALESCE(
        p.city,
        os.property_city
      ) AS city,

      os.status AS onboarding_status,
      p.status AS property_status,

      COALESCE(
        (
          SELECT
            SUM(
              CASE
                WHEN pu.quantity IS NULL
                  OR pu.quantity < 1
                  THEN 1
                ELSE pu.quantity
              END
            )::int
          FROM property_units pu
          WHERE pu.property_id = p.id
        ),
        0
      )::int AS physical_units,

      os.created_at

    FROM onboarding_submissions os

    INNER JOIN contacts c
      ON c.id = os.contact_id

    LEFT JOIN properties p
      ON p.source_onboarding_submission_id =
        os.id

    ORDER BY
      os.created_at DESC NULLS LAST,
      os.id DESC;
  `;

  return rows.map(
    (row) => ({
      submission_id:
        Number(
          row.submission_id
        ),

      contact_id:
        Number(
          row.contact_id
        ),

      property_id:
        row.property_id === null ||
        row.property_id === undefined
          ? null
          : Number(
              row.property_id
            ),

      owner_name:
        row.owner_name
          ? String(
              row.owner_name
            )
          : null,

      email:
        String(
          row.email ?? ""
        ),

      phone:
        row.phone
          ? String(
              row.phone
            )
          : null,

      property_name:
        row.property_name
          ? String(
              row.property_name
            )
          : null,

      property_type:
        row.property_type
          ? String(
              row.property_type
            )
          : null,

      country:
        row.country
          ? String(
              row.country
            )
          : null,

      city:
        row.city
          ? String(
              row.city
            )
          : null,

      onboarding_status:
        row.onboarding_status
          ? String(
              row.onboarding_status
            )
          : null,

      property_status:
        row.property_status
          ? String(
              row.property_status
            )
          : null,

      physical_units:
        Number(
          row.physical_units ?? 0
        ),

      created_at:
        row.created_at as
          | string
          | Date
          | null,
    })
  ) satisfies OnboardingPropertyRow[];
}


function formatDate(
  value:
    | string
    | Date
    | null,
  locale: string
) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(
          value
        );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(
    date
  );
}


function getStatusClasses(
  status:
    | string
    | null
) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700";

    case "inactive":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-amber-50 text-amber-700";
  }
}


type AdminOnboardingPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};


export default async function AdminOnboardingPage({
  searchParams,
}: AdminOnboardingPageProps) {
  const params =
    (await searchParams) ?? {};

  const searchQuery =
    params.q?.trim() ?? "";

  const normalizedSearchQuery =
    searchQuery.toLocaleLowerCase();

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


  const adminDictionary =
    await getAdminDictionary(
      currentLocale
    );

  const propertiesDictionary =
    adminDictionary.properties;

  const leadsDictionary =
    adminDictionary.leads;

  const propertyDetailsDictionary =
    adminDictionary.propertyDetails;

  const dateLocale =
    adminDictionary.common
      .dateLocale;


  const allSubmissions =
    await getCompletedGetStartedProperties();


  const statusPriority = (
    status: string | null
  ) => {
    switch (status) {
      case "active":
        return 1;

      case "inactive":
        return 2;

      default:
        return 0;
    }
  };


  const submissions =
    allSubmissions
      .filter(
        (item) => {
          if (!normalizedSearchQuery) {
            return true;
          }

          const searchableText = [
            item.property_name,
            item.owner_name,
            item.email,
            item.phone,
            item.property_type,
            item.city,
            item.country,
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase();

          return searchableText.includes(
            normalizedSearchQuery
          );
        }
      )
      .sort(
        (a, b) => {
          const statusDifference =
            statusPriority(
              a.property_status
            ) -
            statusPriority(
              b.property_status
            );

          if (statusDifference !== 0) {
            return statusDifference;
          }

          const aDate =
            a.created_at
              ? new Date(
                  a.created_at
                ).getTime()
              : 0;

          const bDate =
            b.created_at
              ? new Date(
                  b.created_at
                ).getTime()
              : 0;

          return bDate - aDate;
        }
      );

  const statusGroups = [
    {
      key: "pending",
      label:
        propertiesDictionary.filters
          .pending,
      items: submissions.filter(
        (item) =>
          (item.property_status ??
            "pending") ===
          "pending"
      ),
      className:
        "border-amber-200 bg-amber-50/40",
      countClassName:
        "bg-amber-100 text-amber-700",
    },
    {
      key: "active",
      label:
        propertiesDictionary.filters
          .active,
      items: submissions.filter(
        (item) =>
          item.property_status ===
          "active"
      ),
      className:
        "border-emerald-200 bg-emerald-50/30",
      countClassName:
        "bg-emerald-100 text-emerald-700",
    },
    {
      key: "inactive",
      label:
        propertiesDictionary.filters
          .inactive,
      items: submissions.filter(
        (item) =>
          item.property_status ===
          "inactive"
      ),
      className:
        "border-slate-200 bg-slate-50/70",
      countClassName:
        "bg-slate-200 text-slate-700",
    },
  ] as const;



  return (
    <div>

      {/* PAGE HEADER */}
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        <div>
          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.2em]
              text-blue-600
            "
          >
            {
              adminDictionary.dashboard
                .eyebrow
            }
          </p>


          <h1
            className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              text-slate-950
              sm:text-4xl
            "
          >
            {
              adminDictionary.navigation
                .getStarted
            }
          </h1>


          <p
            className="
              mt-3
              max-w-3xl
              text-base
              leading-7
              text-slate-500
            "
          >
            {
              leadsDictionary.sections
                .completed.description
            }
          </p>
        </div>


        <Link
          href="/admin/get-started/new"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            gap-2
            self-start
            rounded-2xl
            bg-blue-600
            px-5
            py-3
            text-sm
            font-black
            text-white
            shadow-sm
            transition
            hover:-translate-y-0.5
            hover:bg-blue-700
            hover:shadow-md
          "
        >
          <Plus size={17} />

          {
            propertiesDictionary.actions
              .newProperty
          }
        </Link>

      </div>


      {/* SUMMARY */}
      <div
        className="
          mt-8
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex h-11 w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Building2
              size={20}
            />
          </div>


          <div>

            <p className="text-sm font-semibold text-slate-500">
              {
                leadsDictionary.stats
                  .completed
              }
            </p>

            <p className="mt-1 text-2xl font-black text-slate-950">
              {
                allSubmissions.length
              }
            </p>

          </div>

        </div>

      </div>


      {/* SEARCH */}
      <form
        action="/admin/get-started"
        method="GET"
        className="
          mt-8
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
          "
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder={
                propertiesDictionary.search
                  .placeholder
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-4
                text-sm
                font-semibold
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-300
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>

          <button
            type="submit"
            className="
              inline-flex
              h-12
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
            <Search size={16} />

            {
              propertiesDictionary.search
                .button
            }
          </button>

          {searchQuery ? (
            <Link
              href="/admin/get-started"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                text-sm
                font-black
                text-slate-600
                transition
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-900
              "
            >
              {
                propertiesDictionary.search
                  .clear
              }
            </Link>
          ) : null}
        </div>
      </form>


      {/* PROPERTY LIST */}
      <section className="mt-8">

        {submissions.length > 0 ? (

          <div className="space-y-5">

            {statusGroups.map(
              (statusGroup) => (
                <details
                  key={statusGroup.key}
                  open={
                    statusGroup.key ===
                    "pending"
                  }
                  className={`
                    group/status
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white
                    shadow-sm
                    ${statusGroup.className}
                  `}
                >
                  <summary
                    className="
                      flex
                      cursor-pointer
                      list-none
                      items-center
                      justify-between
                      gap-4
                      bg-white
                      px-5
                      py-5
                      transition
                      hover:bg-slate-50/80
                      [&::-webkit-details-marker]:hidden
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >
                      <h2
                        className="
                          truncate
                          text-xl
                          font-black
                          text-slate-950
                        "
                      >
                        {
                          statusGroup.label
                        }
                      </h2>

                      <span
                        className={`
                          inline-flex
                          min-w-8
                          items-center
                          justify-center
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-black
                          ${statusGroup.countClassName}
                        `}
                      >
                        {
                          statusGroup
                            .items.length
                        }
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                      "
                    >
                      <ChevronDown
                        size={19}
                        className="
                          transition-transform
                          duration-200
                          group-open/status:rotate-180
                        "
                      />
                    </div>
                  </summary>

                  <div
                    className="
                      border-t
                      border-slate-100
                      bg-slate-50/30
                      p-4
                      sm:p-5
                    "
                  >
                    {statusGroup.items.length >
                    0 ? (
                      <div
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        {statusGroup.items.map(
                          (item) => {

                const location =
                  [
                    item.city,
                    item.country,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(", ");

                const displayedStatus =
                  item.property_status ??
                  "pending";

                const statusLabel =
                  displayedStatus ===
                  "active"
                    ? propertyDetailsDictionary
                        .status.active
                    : displayedStatus ===
                        "inactive"
                      ? propertyDetailsDictionary
                          .status.inactive
                      : propertyDetailsDictionary
                          .status.pending;

                const cardContent = (
                  <>
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <div className="min-w-0">

                        <div className="flex items-start gap-3">

                          <div
                            className="
                              flex h-11 w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-slate-100
                              text-slate-700
                            "
                          >
                            <Home
                              size={19}
                            />
                          </div>


                          <div className="min-w-0">

                            <h2
                              className="
                                truncate
                                text-lg
                                font-black
                                text-slate-950
                              "
                            >
                              {
                                item.property_name ||
                                leadsDictionary
                                  .fallback
                                  .unnamedProperty
                              }
                            </h2>


                            <div
                              className="
                                mt-1
                                flex
                                items-center
                                gap-1.5
                                text-sm
                                text-slate-500
                              "
                            >
                              <UserRound
                                size={14}
                              />

                              <span className="truncate">
                                {
                                  item.owner_name ||
                                  leadsDictionary
                                    .fallback
                                    .unnamedClient
                                }
                              </span>
                            </div>

                          </div>

                        </div>

                      </div>


                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          font-black
                          ${getStatusClasses(
                            displayedStatus
                          )}
                        `}
                      >
                        {
                          statusLabel
                        }
                      </span>

                    </div>


                    <div
                      className="
                        mt-5
                        grid
                        gap-4
                        border-t
                        border-slate-100
                        pt-4
                        sm:grid-cols-2
                      "
                    >

                      <div>

                        <p className="text-xs font-semibold text-slate-400">
                          {
                            propertiesDictionary
                              .fields.owner
                          }
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <Mail
                            size={14}
                          />

                          <span className="truncate">
                            {
                              item.email
                            }
                          </span>
                        </div>

                      </div>


                      <div>

                        <p className="text-xs font-semibold text-slate-400">
                          {
                            propertiesDictionary
                              .fields.propertyType
                          }
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {
                            item.property_type ||
                            leadsDictionary
                              .fallback
                              .noValue
                          }
                        </p>

                      </div>


                      <div>

                        <p className="text-xs font-semibold text-slate-400">
                          {
                            propertiesDictionary
                              .fields.location
                          }
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <MapPin
                            size={14}
                          />

                          <span>
                            {
                              location ||
                              leadsDictionary
                                .fallback
                                .noAddress
                            }
                          </span>
                        </div>

                      </div>


                      <div>

                        <p className="text-xs font-semibold text-slate-400">
                          {
                            leadsDictionary
                              .fields.physicalProperties
                          }
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <Building2
                            size={14}
                          />

                          <span>
                            {
                              item.physical_units
                            }
                          </span>
                        </div>

                      </div>


                      <div>

                        <p className="text-xs font-semibold text-slate-400">
                          {
                            leadsDictionary
                              .fields.latestContact
                          }
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <CalendarDays
                            size={14}
                          />

                          <span>
                            {
                              formatDate(
                                item.created_at,
                                dateLocale
                              ) ||
                              leadsDictionary
                                .fallback
                                .noDate
                            }
                          </span>
                        </div>

                      </div>



                    </div>


                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-slate-100
                        pt-4
                      "
                    >

                      <Link
                        href={`/admin/leads/${item.contact_id}`}
                        className="
                          relative
                          z-20
                          text-sm
                          font-bold
                          text-slate-500
                          transition
                          hover:text-blue-600
                        "
                      >
                        {
                          leadsDictionary.actions
                            .openClient
                        }
                      </Link>


                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-black
                          text-blue-600
                        "
                      >
                        {
                          propertiesDictionary.actions
                            .openProperty
                        }

                        <ArrowRight
                          size={16}
                          className="
                            transition-transform
                            group-hover:translate-x-1
                          "
                        />
                      </div>

                    </div>
                  </>
                );


                if (
                  item.property_id
                ) {
                  return (
                    <div
                      key={
                        item.submission_id
                      }
                      className="
                        group
                        relative
                        block
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        transition
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-blue-200
                        hover:shadow-md
                      "
                    >
                      <Link
                        href={`/admin/properties/${item.property_id}`}
                        aria-label={
                          item.property_name ||
                          leadsDictionary
                            .fallback
                            .unnamedProperty
                        }
                        className="
                          absolute
                          inset-0
                          z-0
                          rounded-2xl
                        "
                      />

                      <div
                        className="
                          relative
                          z-10
                          pointer-events-none
                        "
                      >
                        <div
                          className="
                            pointer-events-auto
                          "
                        >
                          {
                            cardContent
                          }
                        </div>
                      </div>
                    </div>
                  );
                }


                return (
                  <div
                    key={
                      item.submission_id
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >
                    {
                      cardContent
                    }
                  </div>
                );
                          }
                        )}

                      </div>
                    ) : (
                      <div
                        className="
                          rounded-xl
                          border
                          border-dashed
                          border-slate-200
                          bg-white
                          px-5
                          py-8
                          text-center
                          text-sm
                          font-semibold
                          text-slate-400
                        "
                      >
                        {
                          leadsDictionary.sections
                            .completed.empty
                        }
                      </div>
                    )}
                  </div>
                </details>
              )
            )}

          </div>

        ) : (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-10
              text-center
              text-sm
              text-slate-500
            "
          >
            {
              searchQuery
                ? propertiesDictionary.empty
                    .searchDescription
                : leadsDictionary.sections
                    .completed.empty
            }
          </div>

        )}

      </section>

    </div>
  );
}
