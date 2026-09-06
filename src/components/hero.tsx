import Link from "next/link";
import { cookies } from "next/headers";

import AnimatedWave from "@/components/animated-wave";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

import {
  getLocalizedPath,
} from "@/i18n/routing";


export default async function Hero() {

  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;


  let currentLocale: Locale =
    defaultLocale;


  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(currentLocale);

  const hero =
    dictionary.hero;


  /* ==========================================
     LOCALIZED ROUTES
  ========================================== */

  const getStartedPath =
    getLocalizedPath(
      "/get-started",
      currentLocale
    );

  const revenuePath =
    getLocalizedPath(
      "/insights/revenue",
      currentLocale
    );

  const guestRatingPath =
    getLocalizedPath(
      "/insights/guest-rating",
      currentLocale
    );

  const occupancyPath =
    getLocalizedPath(
      "/insights/occupancy",
      currentLocale
    );

  const aiPricingPath =
    getLocalizedPath(
      "/insights/ai-pricing",
      currentLocale
    );


  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:py-24">

      {/* ANIMATED BLUE WAVE */}
      <AnimatedWave />


      {/* HERO CONTENT */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">

        {/* LEFT */}
        <div className="min-w-0">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 sm:mb-4 sm:text-sm sm:tracking-widest">
            {hero.eyebrow}
          </p>


          <h1 className="max-w-full break-words text-[clamp(2.65rem,12vw,4rem)] font-bold leading-[1.03] tracking-[-0.04em] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-6xl lg:leading-tight">
            {hero.titleLine1}

            <br />

            {hero.titleLine2}
          </h1>


          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
            {hero.description}
          </p>


          <div className="mt-7 flex flex-col gap-3 min-[380px]:flex-row sm:mt-8 sm:gap-4">

            <Link
              href={getStartedPath}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-black px-5 py-3.5 text-center text-sm font-medium text-white transition duration-300 hover:scale-[1.03] sm:px-7 sm:py-4 sm:text-base"
            >
              {hero.getStarted} →
            </Link>


            <a
              href="#how-it-works"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-gray-300 bg-white/80 px-5 py-3.5 text-center text-sm font-medium backdrop-blur-sm transition duration-300 hover:bg-white sm:px-7 sm:py-4 sm:text-base"
            >
              {hero.seeHowItWorks}
            </a>

          </div>

        </div>


        {/* RIGHT */}
        <div className="grid min-w-0 grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5">

          {/* REVENUE */}
          <Link
            href={revenuePath}
            className="group min-w-0 cursor-pointer rounded-2xl border border-blue-100 bg-[#f5fbff]/95 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 lg:hover:-translate-y-2 lg:hover:scale-105"
          >

            <p className="text-sm text-gray-500">
              {hero.revenue.title}
            </p>

            <p className="mt-3 text-3xl font-bold sm:text-4xl">
              +24%
            </p>

            <p className="mt-2 text-sm text-green-600">
              {hero.revenue.subtitle}
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition lg:mt-5 lg:opacity-0 lg:group-hover:opacity-100">
              {hero.revenue.explore} →
            </p>

          </Link>


          {/* GUEST RATING */}
          <Link
            href={guestRatingPath}
            className="group min-w-0 cursor-pointer rounded-2xl border border-blue-100 bg-[#f5fbff]/95 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 lg:hover:-translate-y-2 lg:hover:scale-105"
          >

            <p className="text-sm text-gray-500">
              {hero.guestRating.title}
            </p>

            <p className="mt-3 text-3xl font-bold sm:text-4xl">
              9.6 ★
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {hero.guestRating.subtitle}
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition lg:mt-5 lg:opacity-0 lg:group-hover:opacity-100">
              {hero.guestRating.explore} →
            </p>

          </Link>


          {/* OCCUPANCY */}
          <Link
            href={occupancyPath}
            className="group min-w-0 cursor-pointer rounded-2xl border border-blue-100 bg-[#f5fbff]/95 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 lg:hover:-translate-y-2 lg:hover:scale-105"
          >

            <p className="text-sm text-gray-500">
              {hero.occupancy.title}
            </p>

            <p className="mt-3 text-3xl font-bold sm:text-4xl">
              94%
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {hero.occupancy.subtitle}
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition lg:mt-5 lg:opacity-0 lg:group-hover:opacity-100">
              {hero.occupancy.explore} →
            </p>

          </Link>


          {/* AI PRICING */}
          <Link
            href={aiPricingPath}
            className="group min-w-0 cursor-pointer rounded-2xl border border-emerald-100 bg-[#f4fbf7]/95 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 lg:hover:-translate-y-2 lg:hover:scale-105"
          >

            <p className="text-sm text-gray-500">
              {hero.aiPricing.title}
            </p>

            <p className="mt-3 break-words text-xl font-bold sm:text-2xl">
              {hero.aiPricing.status}
            </p>

            <p className="mt-2 text-sm text-blue-600">
              {hero.aiPricing.subtitle}
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition lg:mt-5 lg:opacity-0 lg:group-hover:opacity-100">
              {hero.aiPricing.explore} →
            </p>

          </Link>

        </div>

      </div>

    </section>
  );
}
