import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import BookSearch, {
  type BookingSearchDictionary,
} from "@/components/book-search";
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

  let bookingSearch = (
    dictionary as {
      bookingSearch?: BookingSearchDictionary;
    }
  ).bookingSearch;

  if (!bookingPage || !bookingSearch) {
    const fallbackDictionary =
      await getDictionary(defaultLocale);

    if (!bookingPage) {
      bookingPage = (
        fallbackDictionary as {
          bookingPage?: BookingPageDictionary;
        }
      ).bookingPage;
    }

    if (!bookingSearch) {
      bookingSearch = (
        fallbackDictionary as {
          bookingSearch?: BookingSearchDictionary;
        }
      ).bookingSearch;
    }
  }

  if (!bookingPage) {
    throw new Error(
      "bookingPage is missing from the default language dictionary."
    );
  }

  if (!bookingSearch) {
    throw new Error(
      "bookingSearch is missing from the default language dictionary."
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <section className="relative isolate overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute right-[-5rem] top-[-7rem] h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-[100%] bg-blue-100/60 blur-3xl" />

          <svg
            className="absolute bottom-0 left-0 h-28 w-full text-sky-200/65 sm:h-36"
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 112C173 64 297 155 468 116C638 77 714 27 882 62C1052 98 1181 154 1440 84"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M0 132C173 84 297 175 468 136C638 97 714 47 882 82C1052 118 1181 174 1440 104"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.7"
            />
            <path
              d="M0 152C173 104 297 195 468 156C638 117 714 67 882 102C1052 138 1181 194 1440 124"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.45"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-32">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/75 px-4 py-2 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 sm:text-sm">
                {bookingPage.eyebrow}
              </p>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
              {bookingPage.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {bookingPage.description}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-12 sm:-mt-14 sm:px-6 lg:px-8">
        <BookSearch
          dictionary={bookingSearch}
        />
      </section>
    </main>
  );
}
