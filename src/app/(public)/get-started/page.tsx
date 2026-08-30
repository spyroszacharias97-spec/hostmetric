import AnimatedWave from "@/components/animated-wave";
import OnboardingForm from "@/components/onboarding-form";

import { auth } from "@/auth";
import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

type PageSearchParams = {
  admin?: string | string[];
  contactId?: string | string[];
};

type InitialContact = {
  contactId: number;
  fullName: string | null;
  email: string;
  phone: string | null;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

async function getAdminInitialContact(
  contactId: number
): Promise<InitialContact | null> {
  const sql = getSql();

  const rows = await sql`
    SELECT
      id,
      full_name,
      email,
      phone
    FROM contacts
    WHERE id = ${contactId}
    LIMIT 1;
  `;

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  return {
    contactId: Number(row.id),
    fullName: row.full_name
      ? String(row.full_name)
      : null,
    email: String(row.email),
    phone: row.phone
      ? String(row.phone)
      : null,
  };
}

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
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

  const params = await searchParams;

  const adminMode =
    getSingleSearchParam(params.admin) === "1";

  const contactIdValue =
    getSingleSearchParam(params.contactId);

  let initialContact:
    | InitialContact
    | null = null;

  let adminContactId:
    | number
    | null = null;

  if (adminMode) {
    const session = await auth();

    if (!session?.user?.email) {
      redirect(
        `/admin/login?callbackUrl=${encodeURIComponent(
          `/get-started?admin=1&contactId=${contactIdValue}`
        )}`
      );
    }

    adminContactId =
      Number(contactIdValue);

    if (
      !Number.isInteger(adminContactId) ||
      adminContactId < 1
    ) {
      notFound();
    }

    initialContact =
      await getAdminInitialContact(
        adminContactId
      );

    if (!initialContact) {
      notFound();
    }
  }

  const dictionary =
    await getDictionary(currentLocale);

  const getStarted =
    dictionary.getStartedPage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-6 py-20 md:px-10">
      <AnimatedWave />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            {getStarted.hero.eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-7xl">
            {getStarted.hero.title}
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-slate-600">
            {getStarted.hero.description}
          </p>
        </div>

        <OnboardingForm
          dictionary={
            dictionary.onboardingForm
          }
          adminMode={adminMode}
          adminContactId={
            adminContactId
          }
          initialContact={
            initialContact
          }
          returnTo={
            adminContactId
              ? `/admin/leads/${adminContactId}`
              : undefined
          }
        />
      </div>
    </main>
  );
}
