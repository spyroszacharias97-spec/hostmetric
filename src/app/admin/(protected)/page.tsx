import Link from "next/link";
import { cookies } from "next/headers";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";

import { getAdminDictionary } from "@/i18n/admin";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

type CountRow = {
  count: number;
};

type PropertyRow = {
  id: number;
  property_name: string | null;
  property_type: string | null;
  status: string | null;
  full_name: string | null;
  email: string | null;
  physical_units: number;
};

async function getDashboardData() {
  const sql = getSql();

  const [
    clientRows,
    contactRows,
    unansweredContactRows,
    onboardingRows,
    propertyCountRows,
    activeRows,
    pendingRows,
    inactiveRows,
    properties,
  ] = await Promise.all([
    sql`
      SELECT COUNT(*)::int AS count
      FROM contacts;
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM contact_submissions;
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM contact_submissions
      WHERE COALESCE(answered, FALSE) = FALSE;
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM onboarding_submissions;
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM properties;
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM properties
      WHERE status = 'active';
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM properties
      WHERE status = 'pending'
         OR status IS NULL;
    `,

    sql`
      SELECT COUNT(*)::int AS count
      FROM properties
      WHERE status = 'inactive';
    `,

    sql`
      SELECT
        p.id,
        p.property_name,
        p.property_type,
        p.status,
        c.full_name,
        c.email,
        COALESCE(SUM(pu.quantity), 0)::int AS physical_units
      FROM properties p
      LEFT JOIN contacts c
        ON c.id = p.contact_id
      LEFT JOIN property_units pu
        ON pu.property_id = p.id
      GROUP BY
        p.id,
        p.property_name,
        p.property_type,
        p.status,
        c.full_name,
        c.email
      ORDER BY
        CASE
          WHEN p.status = 'pending' OR p.status IS NULL THEN 0
          WHEN p.status = 'active' THEN 1
          ELSE 2
        END,
        p.updated_at DESC NULLS LAST,
        p.id DESC;
    `,
  ]);

  return {
    clients: Number(
      (clientRows[0] as CountRow | undefined)?.count ?? 0
    ),

    contactRequests: Number(
      (contactRows[0] as CountRow | undefined)?.count ?? 0
    ),

    unansweredContactRequests: Number(
      (unansweredContactRows[0] as CountRow | undefined)?.count ?? 0
    ),

    getStarted: Number(
      (onboardingRows[0] as CountRow | undefined)?.count ?? 0
    ),

    properties: Number(
      (propertyCountRows[0] as CountRow | undefined)?.count ?? 0
    ),

    active: Number(
      (activeRows[0] as CountRow | undefined)?.count ?? 0
    ),

    pending: Number(
      (pendingRows[0] as CountRow | undefined)?.count ?? 0
    ),

    inactive: Number(
      (inactiveRows[0] as CountRow | undefined)?.count ?? 0
    ),

    propertyRows: properties as unknown as PropertyRow[],
  };
}

export default async function AdminPage() {
  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }

  const adminDictionary =
    await getAdminDictionary(currentLocale);

  const d = adminDictionary.dashboard;
  const propertyD = adminDictionary.propertyDetails;
  const propertiesD = adminDictionary.properties;

  const data = await getDashboardData();

  const topCards = [
    {
      label: d.cards.contactRequests,
      value: data.contactRequests,
      href: "/admin/contact-requests",
      icon: Clock3,
      unanswered:
        data.unansweredContactRequests,
    },
    {
      label: d.cards.leads,
      value: data.clients,
      href: "/admin/leads",
      icon: Users,
      unanswered: 0,
    },
    {
      label: d.cards.getStarted,
      value: data.getStarted,
      href: "/admin/get-started",
      icon: CheckCircle2,
      unanswered: data.pending,
    },
    {
      label: d.cards.properties,
      value: data.properties,
      href: "/admin/properties",
      icon: Building2,
      unanswered: 0,
    },
  ];

  const statusCards = [
    {
      label: propertiesD.filters.active,
      value: data.active,
      href: "/admin/properties?status=active",
      className:
        "border-emerald-200 bg-emerald-50/70 text-emerald-800",
    },
    {
      label: propertiesD.filters.pending,
      value: data.pending,
      href: "/admin/properties?status=pending",
      className:
        "border-amber-200 bg-amber-50/70 text-amber-800",
    },
    {
      label: propertiesD.filters.inactive,
      value: data.inactive,
      href: "/admin/properties?status=inactive",
      className:
        "border-slate-200 bg-slate-50 text-slate-700",
    },
  ];

  const statusLabel = (status: string | null) => {
    if (status === "active") {
      return propertyD.status.active;
    }

    if (status === "inactive") {
      return propertyD.status.inactive;
    }

    return propertyD.status.pending;
  };

  const statusClass = (status: string | null) => {
    if (status === "active") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    if (status === "inactive") {
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }

    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  };

  return (
    <div className="pb-12">
      {/* HEADER */}
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

      {/* MAIN DASHBOARD CARDS */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-4xl font-black text-slate-950">
                    {card.value}
                  </p>
                </div>

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  {card.unanswered > 0 ? (
                    <div
                      title={d.cards.contactRequests}
                      className="
                        absolute
                        -right-2
                        -top-2
                        flex
                        h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-600
                        px-1.5
                        text-xs
                        font-black
                        text-white
                        shadow-sm
                        ring-2
                        ring-white
                      "
                    >
                      {card.unanswered}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-black text-blue-600 opacity-0 transition group-hover:opacity-100">
                {d.actions.open}
                <ArrowRight size={15} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* PROPERTY STATUS */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {statusCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group rounded-3xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${card.className}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em]">
                  {card.label}
                </p>

                <p className="mt-2 text-3xl font-black">
                  {card.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 transition group-hover:translate-x-1">
                <ArrowRight size={17} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PROPERTIES */}
      <section className="mt-8 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              {d.propertiesSection.eyebrow}
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {d.propertiesSection.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {d.propertiesSection.description}
            </p>
          </div>

          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
          >
            {d.propertiesSection.allProperties}
            <ArrowRight size={15} />
          </Link>
        </div>

        {data.propertyRows.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.propertyRows.map((property) => (
              <Link
                key={property.id}
                href={`/admin/properties/${property.id}`}
                className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="truncate text-lg font-black text-slate-950">
                      {property.property_name ||
                        propertyD.fallback.unnamedProperty}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(
                        property.status
                      )}`}
                    >
                      {statusLabel(property.status)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {property.full_name ||
                      property.email ||
                      propertyD.fallback.noValue}

                    {property.property_type
                      ? ` · ${property.property_type}`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      {d.propertiesSection.units}
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-900">
                      {property.physical_units}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
            {d.propertiesSection.empty}
          </div>
        )}
      </section>
    </div>
  );
}