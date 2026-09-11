import Link from "next/link";
import { cookies } from "next/headers";

import {
  Building2,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  X,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";

import { getAdminDictionary } from "@/i18n/admin";
import AdminPropertyStatusButton from "@/components/admin-property-status-button";
import AdminDeleteButton from "@/components/admin-delete-button";

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


type PropertyRow = {
  id: number;
  property_name: string | null;
  property_type: string | null;
  country: string | null;
  city: string | null;
  status: string | null;
  full_name: string | null;
  email: string | null;
  physical_units: number;
};


async function getProperties() {
  const sql = getSql();

  const rows = await sql`
    SELECT
      p.id,
      p.property_name,
      p.property_type,
      p.country,
      p.city,
      p.status,
      c.full_name,
      c.email,
      COALESCE(
        SUM(pu.quantity),
        0
      )::int AS physical_units
    FROM properties p
    LEFT JOIN contacts c
      ON c.id = p.contact_id
    LEFT JOIN property_units pu
      ON pu.property_id = p.id
    GROUP BY
      p.id,
      p.property_name,
      p.property_type,
      p.country,
      p.city,
      p.status,
      c.full_name,
      c.email
    ORDER BY
      CASE
        WHEN p.status = 'pending'
          OR p.status IS NULL
          THEN 0
        WHEN p.status = 'active'
          THEN 1
        ELSE 2
      END,
      p.updated_at DESC NULLS LAST,
      p.id DESC;
  `;

  return rows as unknown as PropertyRow[];
}


type PropertiesPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};


export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params =
    await searchParams;

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

  const d =
    adminDictionary.properties;

  const propertyD =
    adminDictionary.propertyDetails;

  const allProperties =
    await getProperties();

  const requestedStatus =
    params.status === "active" ||
    params.status === "pending" ||
    params.status === "inactive"
      ? params.status
      : "all";

  const query =
    (params.q ?? "")
      .trim()
      .toLocaleLowerCase();

  const normalizeStatus = (
    status: string | null
  ) => {
    if (status === "active") {
      return "active";
    }

    if (status === "inactive") {
      return "inactive";
    }

    return "pending";
  };

  const filteredProperties =
    allProperties.filter(
      (property) => {
        if (
          requestedStatus !== "all" &&
          normalizeStatus(
            property.status
          ) !== requestedStatus
        ) {
          return false;
        }

        if (!query) {
          return true;
        }

        const searchable =
          [
            property.property_name,
            property.property_type,
            property.country,
            property.city,
            property.full_name,
            property.email,
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase();

        return searchable.includes(
          query
        );
      }
    );

  const counts = {
    all:
      allProperties.length,

    active:
      allProperties.filter(
        (property) =>
          normalizeStatus(
            property.status
          ) === "active"
      ).length,

    pending:
      allProperties.filter(
        (property) =>
          normalizeStatus(
            property.status
          ) === "pending"
      ).length,

    inactive:
      allProperties.filter(
        (property) =>
          normalizeStatus(
            property.status
          ) === "inactive"
      ).length,
  };

  const statusLabel = (
    status: string | null
  ) => {
    if (status === "active") {
      return propertyD.status.active;
    }

    if (status === "inactive") {
      return propertyD.status.inactive;
    }

    return propertyD.status.pending;
  };

  const statusClass = (
    status: string | null
  ) => {
    if (status === "active") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    if (status === "inactive") {
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }

    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  };

  const filterItems = [
    {
      key: "all",
      label: d.filters.all,
      count: counts.all,
      icon: Building2,
    },
    {
      key: "active",
      label: d.filters.active,
      count: counts.active,
      icon: CheckCircle2,
    },
    {
      key: "pending",
      label: d.filters.pending,
      count: counts.pending,
      icon: Clock3,
    },
    {
      key: "inactive",
      label: d.filters.inactive,
      count: counts.inactive,
      icon: Building2,
    },
  ];

  const filterHref = (
    status: string
  ) => {
    const search =
      new URLSearchParams();

    if (status !== "all") {
      search.set(
        "status",
        status
      );
    }

    if (params.q?.trim()) {
      search.set(
        "q",
        params.q.trim()
      );
    }

    const value =
      search.toString();

    return value
      ? `/admin/properties?${value}`
      : "/admin/properties";
  };

  const clearSearchHref = () => {
    if (
      requestedStatus === "all"
    ) {
      return "/admin/properties";
    }

    return `/admin/properties?status=${requestedStatus}`;
  };

  return (
    <div className="pb-12">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
            {d.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {d.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
            {d.description}
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
        >
          <Plus size={17} />
          {d.actions.newProperty}
        </Link>
      </div>


      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {filterItems.map(
          (item) => {
            const Icon =
              item.icon;

            const selected =
              requestedStatus ===
              item.key;

            return (
              <Link
                key={item.key}
                href={filterHref(
                  item.key
                )}
                className={[
                  "rounded-2xl border p-5 transition",
                  "hover:-translate-y-0.5 hover:shadow-sm",
                  selected
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className={[
                        "text-sm font-black",
                        selected
                          ? "text-blue-100"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {item.label}
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {item.count}
                    </p>
                  </div>

                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-2xl",
                      selected
                        ? "bg-white/15 text-white"
                        : "bg-blue-50 text-blue-600",
                    ].join(" ")}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </Link>
            );
          }
        )}
      </div>


      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          action="/admin/properties"
          method="GET"
          className="flex flex-col gap-3 sm:flex-row"
        >
          {requestedStatus !== "all" ? (
            <input
              type="hidden"
              name="status"
              value={requestedStatus}
            />
          ) : null}

          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder={d.search.placeholder}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
          >
            <Search size={17} />
            {d.search.button}
          </button>

          {params.q ? (
            <Link
              href={clearSearchHref()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <X size={17} />
              {d.search.clear}
            </Link>
          ) : null}
        </form>
      </div>


      <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        {filteredProperties.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredProperties.map(
              (property) => {
                const location =
                  [
                    property.city,
                    property.country,
                  ]
                    .filter(Boolean)
                    .join(", ");

                return (
                  <div
                    key={property.id}
                    className="group px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="truncate text-xl font-black text-slate-950">
                            {property.property_name ||
                              propertyD.fallback.unnamedProperty}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(
                              property.status
                            )}`}
                          >
                            {statusLabel(
                              property.status
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          {property.full_name ||
                            property.email ||
                            "—"}
                        </p>
                      </div>


                      <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[620px]">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                            {d.fields.propertyType}
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {property.property_type ||
                              propertyD.fallback.noValue}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                            {d.fields.location}
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {location ||
                              propertyD.fallback.noValue}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-5">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                              {d.fields.units}
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-900">
                              {property.physical_units}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Link
                              href={`/admin/properties/${property.id}`}
                              className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                            >
                              {d.actions.openProperty}
                            </Link>

                            <AdminPropertyStatusButton
                              propertyId={property.id}
                              currentStatus={property.status}
                              activateLabel={propertyD.actions.activateProperty}
                              deactivateLabel={
                                propertyD.actions.deactivateProperty
                              }
                            />

                            <AdminDeleteButton
                              endpoint={`/api/admin/properties/${property.id}`}
                              label={
                                currentLocale === "el"
                                  ? "Διαγραφή"
                                  : "Delete"
                              }
                              confirmMessage={
                                currentLocale === "el"
                                  ? `Θέλεις σίγουρα να διαγράψεις το ακίνητο «${
                                      property.property_name ||
                                      propertyD.fallback.unnamedProperty
                                    }»; Θα διαγραφεί και το συνδεδεμένο Get Started, αλλά ο πελάτης θα παραμείνει.`
                                  : `Are you sure you want to delete “${
                                      property.property_name ||
                                      propertyD.fallback.unnamedProperty
                                    }”? The linked Get Started submission will also be deleted, but the client will remain.`
                              }
                              compact
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Building2 size={23} />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              {query
                ? d.empty.searchTitle
                : d.empty.title}
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              {query
                ? d.empty.searchDescription
                : d.empty.description}
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
