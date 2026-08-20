import Link from "next/link";
import { cookies } from "next/headers";

import AnimatedWave from "@/components/animated-wave";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


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


  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white px-8 py-24">

      {/* ANIMATED BLUE WAVE */}
      <AnimatedWave />


      {/* HERO CONTENT */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* LEFT */}
        <div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
            {hero.eyebrow}
          </p>


          <h1 className="text-6xl font-bold leading-tight tracking-tight">
            {hero.titleLine1}

            <br />

            {hero.titleLine2}
          </h1>


          <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
            {hero.description}
          </p>


          <div className="mt-8 flex gap-4">

            <Link
              href="/get-started"
              className="rounded-xl bg-black px-7 py-4 font-medium text-white transition duration-300 hover:scale-105"
            >
              {hero.getStarted} →
            </Link>


            <a
              href="#how-it-works"
              className="rounded-xl border border-gray-300 bg-white/80 px-7 py-4 font-medium backdrop-blur-sm transition duration-300 hover:bg-white"
            >
              {hero.seeHowItWorks}
            </a>

          </div>

        </div>


        {/* RIGHT */}
        <div className="grid grid-cols-2 gap-5">

          {/* REVENUE */}
          <Link
            href="/insights/revenue"
            className="group cursor-pointer rounded-2xl border border-blue-100 bg-[#f5fbff]/95 p-6 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          >

            <p className="text-sm text-gray-500">
              {hero.revenue.title}
            </p>

            <p className="mt-3 text-4xl font-bold">
              +24%
            </p>

            <p className="mt-2 text-sm text-green-600">
              {hero.revenue.subtitle}
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
              {hero.revenue.explore} →
            </p>

          </Link>


          {/* GUEST RATING */}
          <Link
            href="/insights/guest-rating"
            className="group cursor-pointer rounded-2xl border border-blue-100 bg-[#f5fbff]/95 p-6 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          >

            <p className="text-sm text-gray-500">
              {hero.guestRating.title}
            </p>

            <p className="mt-3 text-4xl font-bold">
              9.6 ★
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {hero.guestRating.subtitle}
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
              {hero.guestRating.explore} →
            </p>

          </Link>


          {/* OCCUPANCY */}
          <Link
            href="/insights/occupancy"
            className="group cursor-pointer rounded-2xl border border-blue-100 bg-[#f5fbff]/95 p-6 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          >

            <p className="text-sm text-gray-500">
              {hero.occupancy.title}
            </p>

            <p className="mt-3 text-4xl font-bold">
              94%
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {hero.occupancy.subtitle}
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
              {hero.occupancy.explore} →
            </p>

          </Link>


          {/* AI PRICING */}
          <Link
            href="/insights/ai-pricing"
            className="group cursor-pointer rounded-2xl border border-emerald-100 bg-[#f4fbf7]/95 p-6 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          >

            <p className="text-sm text-gray-500">
              {hero.aiPricing.title}
            </p>

            <p className="mt-3 text-2xl font-bold">
              {hero.aiPricing.status}
            </p>

            <p className="mt-2 text-sm text-blue-600">
              {hero.aiPricing.subtitle}
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
              {hero.aiPricing.explore} →
            </p>

          </Link>

        </div>

      </div>

    </section>
  );
}