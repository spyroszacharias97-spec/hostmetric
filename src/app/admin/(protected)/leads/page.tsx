import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Building2,
  MessagesSquare,
  Users,
  Search,
  X,
  ChevronDown,
  Plus,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";

import { cookies } from "next/headers";

import {
  getAdminDictionary,
  type AdminDictionary,
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


type LeadRow = {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  contact_requests: number;
  has_onboarding: boolean;
  property_count: number;
};


type LeadsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};


async function getLeads() {
  const sql = getSql();

  const rows = await sql`
    SELECT
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.created_at,
      c.updated_at,

      COUNT(
        DISTINCT cs.id
      )::int AS contact_requests,

      EXISTS (
        SELECT 1
        FROM onboarding_submissions os
        WHERE os.contact_id = c.id
      ) AS has_onboarding,

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
          FROM properties p
          INNER JOIN property_units pu
            ON pu.property_id = p.id
          WHERE p.contact_id = c.id
        ),
        0
      )::int AS property_count

    FROM contacts c

    LEFT JOIN contact_submissions cs
      ON cs.contact_id = c.id

    GROUP BY
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.created_at,
      c.updated_at

    ORDER BY
      c.updated_at DESC NULLS LAST,
      c.created_at DESC NULLS LAST,
      c.id DESC;
  `;

  return rows.map((row) => ({
    id: Number(row.id),

    full_name:
      row.full_name
        ? String(row.full_name)
        : null,

    email: String(row.email),

    phone:
      row.phone
        ? String(row.phone)
        : null,

    created_at:
      row.created_at as
        | string
        | Date
        | null,

    updated_at:
      row.updated_at as
        | string
        | Date
        | null,

    contact_requests: Number(
      row.contact_requests ?? 0
    ),

    has_onboarding:
      Boolean(row.has_onboarding),

    property_count: Number(
      row.property_count ?? 0
    ),
  })) satisfies LeadRow[];
}


function formatDate(
  value: string | Date | null,
  locale: string
) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(date.getTime())
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
  ).format(date);
}


function normalizeSearchValue(
  value: string
) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}


function LeadCard({
  lead,
  dictionary,
  dateLocale,
}: {
  lead: LeadRow;
  dictionary: AdminDictionary["leads"];
  dateLocale: string;
}) {
  const latestDate =
    formatDate(
      lead.updated_at ??
        lead.created_at,
      dateLocale
    );

  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className="
        group block
        rounded-2xl
        border border-slate-200
        bg-white
        px-5
        py-4
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:border-blue-200
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                font-black
                text-slate-700
              "
            >
              {(
                lead.full_name ||
                lead.email
              )
                .charAt(0)
                .toUpperCase()}
            </div>


            <div className="min-w-0">

              <h3
                className="
                  truncate
                  text-base
                  font-bold
                  text-slate-950
                "
              >
                {lead.full_name ||
                  dictionary.fallback
                    .unnamedClient}
              </h3>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail size={14} />

                <span className="truncate">
                  {lead.email}
                </span>
              </div>

            </div>

          </div>

        </div>


        <div
          className={`
            shrink-0
            rounded-full
            px-3 py-1.5
            text-xs
            font-bold

            ${
              lead.has_onboarding
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {lead.has_onboarding
            ? dictionary.status.completed
            : dictionary.status.pending}
        </div>

      </div>


      <div
        className="
          mt-4
          grid
          gap-x-6
          gap-y-3
          border-t
          border-slate-100
          pt-3
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >

        <div>
          <p className="text-xs font-semibold text-slate-400">
            {dictionary.fields.phone}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Phone size={14} />

            <span>
              {lead.phone ||
                dictionary.fallback
                  .noPhone}
            </span>
          </div>
        </div>


        <div>
          <p className="text-xs font-semibold text-slate-400">
            {dictionary.fields.requests}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <MessagesSquare
              size={14}
            />

            <span>
              {lead.contact_requests}
            </span>
          </div>
        </div>


        <div>
          <p className="text-xs font-semibold text-slate-400">
            {dictionary.fields.properties}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Building2 size={14} />

            <span>
              {lead.property_count}
            </span>
          </div>
        </div>


        <div>
          <p className="text-xs font-semibold text-slate-400">
            {
              dictionary.fields
                .latestContact
            }
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Clock3 size={14} />

            <span>
              {latestDate ||
                dictionary.fallback
                  .noDate}
            </span>
          </div>
        </div>

      </div>


      <div
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-2
          text-sm
          font-bold
          text-blue-600
        "
      >
        {dictionary.actions.openClient}

        <ArrowRight
          size={16}
          className="
            transition-transform
            group-hover:translate-x-1
          "
        />
      </div>

    </Link>
  );
}


function LeadSection({
  leads,
  dictionary,
  dateLocale,
  title,
  description,
  emptyText,
  defaultOpen,
}: {
  leads: LeadRow[];
  dictionary: AdminDictionary["leads"];
  dateLocale: string;
  title: string;
  description: string;
  emptyText: string;
  defaultOpen: boolean;
}) {
  return (
    <details
      className="
        group
        mt-10
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
      open={defaultOpen}
    >
      <summary
        className="
          flex
          cursor-pointer
          list-none
          items-center
          justify-between
          gap-4
          px-5
          py-5
          transition
          hover:bg-slate-50
          [&::-webkit-details-marker]:hidden
        "
      >
        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-xl font-black text-slate-950">
              {title}
            </h2>

            <span
              className="
                rounded-full
                bg-blue-50
                px-2.5
                py-1
                text-xs
                font-black
                text-blue-700
              "
            >
              {leads.length}
            </span>

          </div>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

        </div>

        <div
          className="
            flex h-10 w-10
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
              group-open:rotate-180
            "
          />
        </div>

      </summary>

      <div className="border-t border-slate-100 px-5 pb-5">

        {leads.length > 0 ? (
          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-3
            "
          >
            {leads.map(
              (lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  dictionary={dictionary}
                  dateLocale={dateLocale}
                />
              )
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
            {emptyText}
          </div>
        )}

      </div>

    </details>
  );
}


export default async function LeadsPage({
  searchParams,
}: LeadsPageProps) {
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

  const dictionary =
    adminDictionary.leads;

  const dateLocale =
    adminDictionary.common
      .dateLocale;

  const leads =
    await getLeads();

  const resolvedSearchParams =
    searchParams
      ? await searchParams
      : undefined;

  const rawQuery =
    resolvedSearchParams?.q;

  const query =
    (
      Array.isArray(rawQuery)
        ? rawQuery[0]
        : rawQuery
    )?.trim() ?? "";

  const normalizedQuery =
    normalizeSearchValue(
      query
    );

  const filteredLeads =
    normalizedQuery
      ? leads.filter(
          (lead) => {
            const searchableText =
              normalizeSearchValue(
                [
                  lead.full_name ?? "",
                  lead.email,
                  lead.phone ?? "",
                ].join(" ")
              );

            return searchableText.includes(
              normalizedQuery
            );
          }
        )
      : leads;

  const completedLeads =
    filteredLeads.filter(
      (lead) =>
        lead.has_onboarding
    );

  const pendingLeads =
    filteredLeads.filter(
      (lead) =>
        !lead.has_onboarding
    );

  const completedTotal =
    leads.filter(
      (lead) =>
        lead.has_onboarding
    ).length;

  const pendingTotal =
    leads.filter(
      (lead) =>
        !lead.has_onboarding
    ).length;


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
          {dictionary.eyebrow}
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
          {dictionary.title}
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
          {dictionary.description}
        </p>

        </div>

        <Link
          href="/admin/get-started/new#new-client"
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
            dictionary.actions
              .newClient
          }
        </Link>

      </div>


      {/* SEARCH */}
      <form
        action="/admin/leads"
        method="get"
        className="
          mt-8
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:flex-row
        "
      >

        <div className="relative min-w-0 flex-1">

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
            defaultValue={query}
            placeholder={
              dictionary.search
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
          <Search size={17} />

          {dictionary.search.button}
        </button>


        {query ? (
          <Link
            href="/admin/get-started"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              text-sm
              font-black
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            <X size={17} />

            {dictionary.search.clear}
          </Link>
        ) : null}

      </form>


      {/* STATISTICS */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-3
        "
      >

        <div
          className="
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
                flex h-10 w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <Users size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                {dictionary.stats.total}
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {leads.length}
              </p>
            </div>

          </div>
        </div>


        <div
          className="
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
                flex h-10 w-10
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <CheckCircle2
                size={19}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                {
                  dictionary.stats
                    .completed
                }
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {completedTotal}
              </p>
            </div>

          </div>
        </div>


        <div
          className="
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
                flex h-10 w-10
                items-center
                justify-center
                rounded-xl
                bg-amber-50
                text-amber-600
              "
            >
              <Clock3 size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                {
                  dictionary.stats
                    .pending
                }
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {pendingTotal}
              </p>
            </div>

          </div>
        </div>

      </div>


      {query &&
      filteredLeads.length === 0 ? (
        <div
          className="
            mt-10
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-8
            text-center
            text-sm
            font-semibold
            text-slate-500
          "
        >
          {
            dictionary.search
              .noResults
          }
        </div>
      ) : (
        <>

          {/* COMPLETED */}
          <LeadSection
            leads={completedLeads}
            dictionary={dictionary}
            dateLocale={dateLocale}
            title={
              dictionary.sections
                .completed.title
            }
            description={
              dictionary.sections
                .completed.description
            }
            emptyText={
              dictionary.sections
                .completed.empty
            }
            defaultOpen={
              Boolean(query)
            }
          />


          {/* PENDING */}
          <LeadSection
            leads={pendingLeads}
            dictionary={dictionary}
            dateLocale={dateLocale}
            title={
              dictionary.sections
                .pending.title
            }
            description={
              dictionary.sections
                .pending.description
            }
            emptyText={
              dictionary.sections
                .pending.empty
            }
            defaultOpen={
              Boolean(query)
            }
          />

        </>
      )}

    </div>
  );
}