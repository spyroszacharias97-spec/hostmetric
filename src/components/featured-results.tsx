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


  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white md:px-10 lg:py-32">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />


      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            INTRO
        ===================================================== */}

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-400">
            {featuredResults.eyebrow}
          </p>


          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">

            {featuredResults.titleLine1}

            <br />

            {featuredResults.titleLine2}

          </h2>


          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            {featuredResults.description}
          </p>

        </div>


        {/* =====================================================
            AWARD + PROPERTY RESULTS
        ===================================================== */}

        <div className="mt-16 grid items-stretch gap-7 lg:grid-cols-[0.92fr_1.08fr]">

          {/* AWARD IMAGE */}
          <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl md:p-7">

            <div className="relative w-full overflow-hidden rounded-[1.5rem]">

              <Image
                src="/awards/niki-breeze-booking-award-2026.png"
                alt={featuredResults.awardImageAlt}
                width={1400}
                height={1000}
                className="h-auto w-full rounded-[1.5rem] object-contain"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

            </div>

          </div>


          {/* PROPERTY RESULTS */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 md:p-9">

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                Niki Breeze
              </span>


              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {featuredResults.property.location}
              </span>


              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {featuredResults.property.type}
              </span>

            </div>


            <h3 className="mt-7 text-3xl font-bold md:text-4xl">
              {featuredResults.property.title}
            </h3>


            <p className="mt-5 text-lg leading-8 text-slate-300">
              {featuredResults.property.description}
            </p>


            {/* METRICS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {/* BOOKING RATING */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                <Star
                  size={27}
                  className="text-yellow-400"
                />


                <p className="mt-5 text-4xl font-bold">
                  9.6

                  <span className="ml-1 text-lg text-slate-500">
                    / 10
                  </span>
                </p>


                <p className="mt-2 font-semibold">
                  {
                    featuredResults.metrics
                      .bookingRating.title
                  }
                </p>


                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {
                    featuredResults.metrics
                      .bookingRating.description
                  }
                </p>

              </div>


              {/* STAFF */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                <MessageCircle
                  size={27}
                  className="text-blue-400"
                />


                <p className="mt-5 text-4xl font-bold">
                  9.9

                  <span className="ml-1 text-lg text-slate-500">
                    / 10
                  </span>
                </p>


                <p className="mt-2 font-semibold">
                  {
                    featuredResults.metrics
                      .staffRating.title
                  }
                </p>


                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {
                    featuredResults.metrics
                      .staffRating.description
                  }
                </p>

              </div>


              {/* REVIEWS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                <Users
                  size={27}
                  className="text-cyan-400"
                />


                <p className="mt-5 text-4xl font-bold">
                  73
                </p>


                <p className="mt-2 font-semibold">
                  {
                    featuredResults.metrics
                      .guestReviews.title
                  }
                </p>


                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {
                    featuredResults.metrics
                      .guestReviews.description
                  }
                </p>

              </div>


              {/* AWARD */}
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">

                <Award
                  size={27}
                  className="text-blue-300"
                />


                <p className="mt-5 text-4xl font-bold">
                  9.5

                  <span className="ml-1 text-lg text-blue-300">
                    / 10
                  </span>
                </p>


                <p className="mt-2 font-semibold">
                  {
                    featuredResults.metrics
                      .award.title
                  }
                </p>


                <p className="mt-2 text-sm leading-6 text-blue-200">
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

        <div className="mt-7 overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-cyan-500/10">

          <div className="grid items-center gap-10 p-8 md:p-10 lg:grid-cols-[0.75fr_1.25fr]">

            {/* NUMBERS */}
            <div>

              <div className="flex items-center gap-3 text-blue-300">

                <TrendingUp size={30} />


                <span className="text-sm font-bold uppercase tracking-[0.2em]">
                  {featuredResults.revenue.eyebrow}
                </span>

              </div>


              <div className="mt-8 flex flex-wrap items-center gap-5">

                {/* BEFORE */}
                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {featuredResults.revenue.before}
                  </p>


                  <p className="mt-2 text-3xl font-bold text-slate-400">
                    €12,000
                  </p>

                </div>


                <ArrowUpRight
                  size={34}
                  className="text-green-400"
                />


                {/* AFTER */}
                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    {featuredResults.revenue.after}
                  </p>


                  <p className="mt-2 text-5xl font-bold">
                    €16,300
                  </p>

                </div>

              </div>


              <div className="mt-7 inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-5 py-2">

                <span className="font-bold text-green-400">
                  {featuredResults.revenue.growthBadge}
                </span>

              </div>

            </div>


            {/* EXPLANATION */}
            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                {featuredResults.revenue.propertyLabel}
              </p>


              <h3 className="mt-4 text-2xl font-bold md:text-3xl">
                {featuredResults.revenue.title}
              </h3>


              <p className="mt-5 text-lg leading-8 text-slate-300">
                {featuredResults.revenue.paragraph1}
              </p>


              <p className="mt-4 text-lg leading-8 text-slate-300">
                {featuredResults.revenue.paragraph2}
              </p>


              <p className="mt-5 text-xs leading-6 text-slate-500">
                {featuredResults.revenue.disclaimer}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <div className="mt-16 flex flex-col items-center text-center">

          <Sparkles
            size={32}
            className="text-blue-400"
          />


          <h3 className="mt-5 text-3xl font-bold">
            {featuredResults.cta.title}
          </h3>


          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            {featuredResults.cta.description}
          </p>


          <Link
            href="/get-started"
            className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/20"
          >
            {featuredResults.cta.button} →
          </Link>

        </div>


        {/* AWARD CLARIFICATION */}
        <p className="mx-auto mt-12 max-w-3xl text-center text-xs leading-6 text-slate-600">
          {featuredResults.awardClarification}
        </p>

      </div>

    </section>
  );
}