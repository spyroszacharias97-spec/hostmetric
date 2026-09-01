import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import {
  Award,
  Star,
  Users,
  Sparkles,
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function FeaturedResults() {
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

  const featuredResults =
    dictionary.featuredResults;


  /* =========================================================
     RESPONSIVE PRESENTATION
     Mobile-first layout only. Content, translations, metrics,
     image source and destination routes remain unchanged.
  ========================================================= */

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 md:px-10 md:py-24 lg:py-32">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[620px] max-w-[150vw] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px] sm:h-[520px] sm:w-[820px] sm:blur-[120px] lg:h-[600px] lg:w-[1000px] lg:blur-[140px]" />


      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            INTRO
        ===================================================== */}

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 sm:text-sm sm:tracking-[0.28em]">
            {featuredResults.eyebrow}
          </p>


          <h2 className="mt-4 text-[2.3rem] font-bold leading-[1.08] tracking-tight sm:mt-5 sm:text-5xl lg:mt-6 lg:text-6xl">

            {featuredResults.titleLine1}

            <br />

            {featuredResults.titleLine2}

          </h2>


          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8 md:mt-7 md:text-xl">
            {featuredResults.description}
          </p>

        </div>


        {/* =====================================================
            AWARD + PROPERTY RESULTS
        ===================================================== */}

        <div className="mt-10 grid items-stretch gap-5 sm:mt-12 sm:gap-6 lg:mt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-7">

          {/* AWARD IMAGE */}
          <div className="flex items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-3 shadow-2xl sm:rounded-[1.75rem] sm:p-5 md:rounded-[2rem] md:p-7">

            <div className="relative w-full overflow-hidden rounded-[1.1rem] sm:rounded-[1.3rem] md:rounded-[1.5rem]">

              <Image
                src="/awards/niki-breeze-booking-award-2026.png"
                alt={featuredResults.awardImageAlt}
                width={1400}
                height={1000}
                className="h-auto w-full rounded-[1.1rem] object-contain sm:rounded-[1.3rem] md:rounded-[1.5rem]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

            </div>

          </div>


          {/* PROPERTY RESULTS */}
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 sm:rounded-[1.75rem] sm:p-6 md:rounded-[2rem] md:p-9">

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">

              <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 sm:px-4 sm:py-2 sm:text-sm">
                Niki Breeze
              </span>


              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                {featuredResults.property.location}
              </span>


              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                {featuredResults.property.type}
              </span>

            </div>


            <h3 className="mt-5 text-2xl font-bold leading-tight sm:mt-6 sm:text-3xl md:mt-7 md:text-4xl">
              {featuredResults.property.title}
            </h3>


            <p className="mt-4 text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">
              {featuredResults.property.description}
            </p>


            {/* METRICS */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">

              {/* BOOKING RATING */}
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 sm:rounded-2xl sm:p-5">

                <Star
                  className="h-6 w-6 text-yellow-400 sm:h-[27px] sm:w-[27px]"
                />


                <p className="mt-4 text-3xl font-bold sm:mt-5 sm:text-4xl">
                  9.6

                  <span className="ml-1 text-sm text-slate-500 sm:text-lg">
                    / 10
                  </span>
                </p>


                <p className="mt-2 text-sm font-semibold leading-snug sm:text-base">
                  {
                    featuredResults.metrics
                      .bookingRating.title
                  }
                </p>


                <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  {
                    featuredResults.metrics
                      .bookingRating.description
                  }
                </p>

              </div>


              {/* STAFF */}
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 sm:rounded-2xl sm:p-5">

                <MessageCircle
                  className="h-6 w-6 text-blue-400 sm:h-[27px] sm:w-[27px]"
                />


                <p className="mt-4 text-3xl font-bold sm:mt-5 sm:text-4xl">
                  9.9

                  <span className="ml-1 text-sm text-slate-500 sm:text-lg">
                    / 10
                  </span>
                </p>


                <p className="mt-2 text-sm font-semibold leading-snug sm:text-base">
                  {
                    featuredResults.metrics
                      .staffRating.title
                  }
                </p>


                <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  {
                    featuredResults.metrics
                      .staffRating.description
                  }
                </p>

              </div>


              {/* REVIEWS */}
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 sm:rounded-2xl sm:p-5">

                <Users
                  className="h-6 w-6 text-cyan-400 sm:h-[27px] sm:w-[27px]"
                />


                <p className="mt-4 text-3xl font-bold sm:mt-5 sm:text-4xl">
                  73
                </p>


                <p className="mt-2 text-sm font-semibold leading-snug sm:text-base">
                  {
                    featuredResults.metrics
                      .guestReviews.title
                  }
                </p>


                <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  {
                    featuredResults.metrics
                      .guestReviews.description
                  }
                </p>

              </div>


              {/* AWARD */}
              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 sm:rounded-2xl sm:p-5">

                <Award
                  className="h-6 w-6 text-blue-300 sm:h-[27px] sm:w-[27px]"
                />


                <p className="mt-4 text-3xl font-bold sm:mt-5 sm:text-4xl">
                  9.5

                  <span className="ml-1 text-sm text-blue-300 sm:text-lg">
                    / 10
                  </span>
                </p>


                <p className="mt-2 text-sm font-semibold leading-snug sm:text-base">
                  {
                    featuredResults.metrics
                      .award.title
                  }
                </p>


                <p className="mt-2 text-xs leading-5 text-blue-200 sm:text-sm sm:leading-6">
                  {
                    featuredResults.metrics
                      .award.description
                  }
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            REVENUE GROWTH
        ===================================================== */}

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-cyan-500/10 sm:mt-6 sm:rounded-[1.75rem] lg:mt-7 lg:rounded-[2rem]">

          <div className="grid items-center gap-8 p-5 sm:p-7 md:p-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">

            {/* NUMBERS */}
            <div>

              <div className="flex items-center gap-2 text-blue-300 sm:gap-3">

                <TrendingUp className="h-6 w-6 shrink-0 sm:h-[30px] sm:w-[30px]" />


                <span className="text-xs font-bold uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.2em]">
                  {featuredResults.revenue.eyebrow}
                </span>

              </div>


              <div className="mt-6 flex flex-wrap items-end gap-3 sm:mt-8 sm:items-center sm:gap-5">

                {/* BEFORE */}
                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {featuredResults.revenue.before}
                  </p>


                  <p className="mt-2 text-2xl font-bold text-slate-400 sm:text-3xl">
                    €12,000
                  </p>

                </div>


                <ArrowUpRight
                  className="h-7 w-7 shrink-0 text-green-400 sm:h-[34px] sm:w-[34px]"
                />


                {/* AFTER */}
                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    {featuredResults.revenue.after}
                  </p>


                  <p className="mt-2 text-4xl font-bold sm:text-5xl">
                    €16,300
                  </p>

                </div>

              </div>


              <div className="mt-6 inline-flex max-w-full rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm sm:mt-7 sm:px-5 sm:text-base">

                <span className="font-bold text-green-400">
                  {featuredResults.revenue.growthBadge}
                </span>

              </div>

            </div>


            {/* EXPLANATION */}
            <div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300 sm:text-sm sm:tracking-[0.18em]">
                {featuredResults.revenue.propertyLabel}
              </p>


              <h3 className="mt-3 text-xl font-bold leading-tight sm:mt-4 sm:text-2xl md:text-3xl">
                {featuredResults.revenue.title}
              </h3>


              <p className="mt-4 text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">
                {featuredResults.revenue.paragraph1}
              </p>


              <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {featuredResults.revenue.paragraph2}
              </p>


              <p className="mt-4 text-xs leading-5 text-slate-500 sm:mt-5 sm:leading-6">
                {featuredResults.revenue.disclaimer}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <div className="mt-12 flex flex-col items-center text-center sm:mt-14 lg:mt-16">

          <Sparkles
            className="h-7 w-7 text-blue-400 sm:h-8 sm:w-8"
          />


          <h3 className="mt-4 text-2xl font-bold leading-tight sm:mt-5 sm:text-3xl">
            {featuredResults.cta.title}
          </h3>


          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400 sm:mt-4 sm:text-lg sm:leading-8">
            {featuredResults.cta.description}
          </p>


          <Link
            href="/get-started"
            className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/20 sm:mt-8 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            {featuredResults.cta.button} →
          </Link>

        </div>


        {/* AWARD CLARIFICATION */}
        <p className="mx-auto mt-9 max-w-3xl text-center text-[11px] leading-5 text-slate-600 sm:mt-12 sm:text-xs sm:leading-6">
          {featuredResults.awardClarification}
        </p>

      </div>

    </section>
  );
}