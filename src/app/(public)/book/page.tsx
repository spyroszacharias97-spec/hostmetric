import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import BookSearch from "@/components/book-search";
import { features } from "@/config/features";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type BookingPageDictionary = {
  eyebrow: string;
  title: string;
  description: string;
};

function parseBooleanSetting(value: unknown) {
  if (value === true) {
    return true;
  }

  if (value === false) {
    return false;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    return (
      normalized === "true" ||
      normalized === '"true"'
    );
  }

  return false;
}

async function isDirectBookingEnabled() {
  if (!features.directBooking) {
    return false;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return false;
  }

  try {
    const sql = neon(databaseUrl);

    const rows = (await sql`
      SELECT setting_value
      FROM guesty_settings
      WHERE setting_key = 'direct_booking_enabled'
      LIMIT 1;
    `) as unknown as DirectBookingSettingRow[];

    return parseBooleanSetting(
      rows[0]?.setting_value
    );
  } catch (error) {
    console.error(
      "Failed to load public direct booking status.",
      error
    );

    return false;
  }
}

export default async function BookPage() {
  const directBookingEnabled =
    await isDirectBookingEnabled();

  if (!directBookingEnabled) {
    notFound();
  }

  const cookieStore = await cookies();

  const savedLocale = cookieStore.get(
    "hostmetric_locale"
  )?.value;

  let currentLocale: Locale = defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }

  const dictionary =
    await getDictionary(currentLocale);

  let bookingPage = (
    dictionary as {
      bookingPage?: BookingPageDictionary;
    }
  ).bookingPage;

  if (!bookingPage) {
    const fallbackDictionary =
      await getDictionary(defaultLocale);

    bookingPage = (
      fallbackDictionary as {
        bookingPage?: BookingPageDictionary;
      }
    ).bookingPage;
  }

  if (!bookingPage) {
    throw new Error(
      "bookingPage is missing from the default language dictionary."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {bookingPage.eyebrow}
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {bookingPage.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {bookingPage.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BookSearch />
      </section>
    </main>
  );
}
