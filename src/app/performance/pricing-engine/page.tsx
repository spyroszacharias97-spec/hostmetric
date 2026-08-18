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
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Database,
  MapPin,
  TrendingUp,
} from "lucide-react";

export default async function PricingEnginePage() {
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

  const dictionary =
    await getDictionary(currentLocale);

  const pricingEngine =
    dictionary.pricingEnginePage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">

      {/* ANIMATED WAVE */}
      <AnimatedWave />

      <div className="relative z-10 mx-auto max-w-6xl px-8 py-20">

        <Link
          href="/"
          className="text-lg font-medium text-blue-300 transition hover:text-white"
        >
          ← {pricingEngine.back}
        </Link>


        <div className="mt-24">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
            {pricingEngine.eyebrow}
          </p>

          <h1 className="mt-6 max-w-5xl text-6xl font-bold leading-tight">
            {pricingEngine.titleLine1}
            <br />
            {pricingEngine.titleLine2}
          </h1>

          <p className="mt-8 max-w-4xl text-2xl leading-10 text-gray-300">
            {pricingEngine.description}
          </p>


          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">

              <Building2
                size={36}
                className="text-blue-300"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {
                  pricingEngine.cards
                    .comparableProperties.title
                }
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                {
                  pricingEngine.cards
                    .comparableProperties.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">

              <MapPin
                size={36}
                className="text-blue-300"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {
                  pricingEngine.cards
                    .localMarketDemand.title
                }
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                {
                  pricingEngine.cards
                    .localMarketDemand.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">

              <Database
                size={36}
                className="text-blue-300"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {
                  pricingEngine.cards
                    .historicalBookingData.title
                }
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                {
                  pricingEngine.cards
                    .historicalBookingData.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">

              <CalendarClock
                size={36}
                className="text-blue-300"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {
                  pricingEngine.cards
                    .bookingPace.title
                }
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                {
                  pricingEngine.cards
                    .bookingPace.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">

              <ChartNoAxesCombined
                size={36}
                className="text-blue-300"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {
                  pricingEngine.cards
                    .revenueKpis.title
                }
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                {
                  pricingEngine.cards
                    .revenueKpis.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">

              <TrendingUp
                size={36}
                className="text-blue-300"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {
                  pricingEngine.cards
                    .priceElasticity.title
                }
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                {
                  pricingEngine.cards
                    .priceElasticity.description
                }
              </p>

            </div>

          </div>


          <div className="mt-12 rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 p-12 backdrop-blur-sm">

            <BrainCircuit
              size={52}
              className="text-blue-300"
            />

            <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              {pricingEngine.objective.eyebrow}
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              {pricingEngine.objective.titleLine1}
              <br />
              {pricingEngine.objective.titleLine2}
            </h2>

            <p className="mt-7 max-w-4xl text-xl leading-9 text-gray-300">
              {pricingEngine.objective.description}
            </p>


            <div className="mt-9 rounded-2xl bg-black/30 p-7 text-center font-mono text-xl">
              {pricingEngine.objective.formula}
            </div>

          </div>


          <Link
            href="/get-started"
            className="mt-12 inline-block rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
          >
            {pricingEngine.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}