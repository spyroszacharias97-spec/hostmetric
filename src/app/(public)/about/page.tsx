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
  BrainCircuit,
  BarChart3,
  HeartHandshake,
  Users,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  LineChart,
} from "lucide-react";


export default async function AboutPage() {
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

  const about =
    dictionary.aboutPage;


  return (
    <main className="min-h-screen bg-white text-slate-950">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-8 pb-28 pt-28">

        <AnimatedWave />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="max-w-5xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              {about.hero.eyebrow}
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              {about.hero.titleLine1}
              <br />
              {about.hero.titleLine2}
            </h1>

            <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-600 md:text-2xl">
              {about.hero.description}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          OUR PHILOSOPHY
      ================================================= */}

      <section className="px-8 py-24">

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              {about.philosophy.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              {about.philosophy.titleLine1}
              <br />
              {about.philosophy.titleLine2}
            </h2>

          </div>


          <div className="space-y-6 text-lg leading-8 text-slate-600">

            <p>
              {about.philosophy.paragraph1}
            </p>

            <p>
              {about.philosophy.paragraph2}
            </p>

            <p>
              {about.philosophy.paragraph3}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          SCIENCE + HUMAN
      ================================================= */}

      <section className="bg-slate-50 px-8 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              {about.approach.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
              {about.approach.title}
            </h2>

            <p className="mt-7 text-xl leading-9 text-slate-600">
              {about.approach.description}
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* PERFORMANCE METRICS */}

            <div className="rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <BarChart3
                size={40}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-2xl font-bold">
                {about.approach.cards.performanceMetrics.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {about.approach.cards.performanceMetrics.description}
              </p>

            </div>


            {/* MARKET INTELLIGENCE */}

            <div className="rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <BrainCircuit
                size={40}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-2xl font-bold">
                {about.approach.cards.marketIntelligence.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {about.approach.cards.marketIntelligence.description}
              </p>

            </div>


            {/* CONTINUOUS OPTIMIZATION */}

            <div className="rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <LineChart
                size={40}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-2xl font-bold">
                {about.approach.cards.continuousOptimization.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {about.approach.cards.continuousOptimization.description}
              </p>

            </div>


            {/* HUMAN COMMUNICATION */}

            <div className="rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <MessageCircle
                size={40}
                className="text-blue-600"
              />

              <h3 className="mt-6 text-2xl font-bold">
                {about.approach.cards.humanCommunication.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {about.approach.cards.humanCommunication.description}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FAMILY STYLE
      ================================================= */}

      <section className="px-8 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-[40px] bg-[#10214a] text-white">

            <div className="grid lg:grid-cols-2">

              <div className="p-10 md:p-16">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">

                  <Users
                    size={34}
                    className="text-blue-300"
                  />

                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
                  {about.familyBusiness.eyebrow}
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                  {about.familyBusiness.title}
                </h2>

              </div>


              <div className="border-t border-white/10 p-10 md:p-16 lg:border-l lg:border-t-0">

                <p className="text-xl leading-9 text-white/75">
                  {about.familyBusiness.paragraph1}
                </p>

                <p className="mt-7 text-xl leading-9 text-white/75">
                  {about.familyBusiness.paragraph2}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          ALIGNMENT
      ================================================= */}

      <section className="bg-blue-50 px-8 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <TrendingUp
                size={52}
                className="text-blue-600"
              />

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                {about.sharedSuccess.eyebrow}
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
                {about.sharedSuccess.title}
              </h2>

            </div>


            <div className="rounded-[32px] bg-white p-9 shadow-sm md:p-12">

              <p className="text-xl leading-9 text-slate-600">
                {about.sharedSuccess.description}
              </p>

              <div className="mt-9 flex items-start gap-4">

                <ShieldCheck
                  size={30}
                  className="mt-1 shrink-0 text-blue-600"
                />

                <p className="text-lg leading-8 text-slate-600">
                  {about.sharedSuccess.principle}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="bg-[#2166f3] px-8 py-24 text-white">

        <div className="mx-auto max-w-5xl text-center">

          <HeartHandshake
            size={50}
            className="mx-auto text-blue-100"
          />

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
            {about.cta.eyebrow}
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            {about.cta.titleLine1}
            <br />
            {about.cta.titleLine2}
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-xl leading-9 text-blue-100">
            {about.cta.description}
          </p>

          <Link
            href="/get-started"
            className="mt-10 inline-flex cursor-pointer rounded-2xl bg-white px-9 py-4 text-lg font-bold text-blue-600 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
          >
            {about.cta.button} →
          </Link>

        </div>

      </section>

    </main>
  );
}