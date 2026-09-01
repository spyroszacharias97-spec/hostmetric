import Link from "next/link";
import { cookies } from "next/headers";

import AnimatedWave from "@/components/animated-wave";

import {
  getDictionary,
} from "@/i18n/get-dictionary";

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

  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

  const cookieStore =
    await cookies();


  const savedLocale =
    cookieStore.get(
      "hostmetric_locale"
    )?.value;


  let currentLocale: Locale =
    defaultLocale;


  if (
    savedLocale &&
    isSupportedLocale(
      savedLocale
    )
  ) {
    currentLocale =
      savedLocale;
  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  const pricingEngine =
    dictionary.pricingEnginePage;


  /* =========================================================
     RESPONSIVE PRICING ENGINE PAGE
     The formula block has been intentionally removed from
     every viewport, including desktop and mobile.
  ========================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-slate-950
        via-blue-950
        to-slate-950
        text-white
      "
    >

      {/* ==========================================
          ANIMATED WAVE
      ========================================== */}

      <AnimatedWave />


      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-4
          py-10
          sm:px-6
          sm:py-14
          md:px-8
          md:py-20
        "
      >

        <Link
          href="/"
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            text-blue-300
            transition
            hover:text-white
            sm:text-base
            md:text-lg
          "
        >
          ← {pricingEngine.back}
        </Link>


        <div
          className="
            mt-12
            sm:mt-16
            md:mt-20
            lg:mt-24
          "
        >

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-blue-400
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {pricingEngine.eyebrow}
          </p>


          <h1
            className="
              mt-4
              max-w-5xl
              break-words
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              sm:mt-5
              sm:text-5xl
              md:mt-6
              md:text-6xl
            "
          >
            {pricingEngine.titleLine1}

            <br />

            {pricingEngine.titleLine2}
          </h1>


          <p
            className="
              mt-6
              max-w-4xl
              text-base
              leading-7
              text-gray-300
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {pricingEngine.description}
          </p>


          {/* ==========================================
              DATA CARDS
          ========================================== */}

          <div
            className="
              mt-10
              grid
              gap-4
              sm:mt-12
              sm:gap-5
              md:mt-16
              md:grid-cols-2
              lg:grid-cols-3
              lg:gap-6
            "
          >

            <div
              className="
                rounded-2xl
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
              "
            >

              <Building2
                className="
                  h-8
                  w-8
                  text-blue-300
                  md:h-9
                  md:w-9
                "
              />


              <h2
                className="
                  mt-4
                  text-xl
                  font-bold
                  sm:mt-5
                  md:text-2xl
                "
              >
                {
                  pricingEngine
                    .cards
                    .comparableProperties
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  leading-7
                  text-gray-300
                  sm:mt-4
                "
              >
                {
                  pricingEngine
                    .cards
                    .comparableProperties
                    .description
                }
              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
              "
            >

              <MapPin
                className="
                  h-8
                  w-8
                  text-blue-300
                  md:h-9
                  md:w-9
                "
              />


              <h2
                className="
                  mt-4
                  text-xl
                  font-bold
                  sm:mt-5
                  md:text-2xl
                "
              >
                {
                  pricingEngine
                    .cards
                    .localMarketDemand
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  leading-7
                  text-gray-300
                  sm:mt-4
                "
              >
                {
                  pricingEngine
                    .cards
                    .localMarketDemand
                    .description
                }
              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
              "
            >

              <Database
                className="
                  h-8
                  w-8
                  text-blue-300
                  md:h-9
                  md:w-9
                "
              />


              <h2
                className="
                  mt-4
                  text-xl
                  font-bold
                  sm:mt-5
                  md:text-2xl
                "
              >
                {
                  pricingEngine
                    .cards
                    .historicalBookingData
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  leading-7
                  text-gray-300
                  sm:mt-4
                "
              >
                {
                  pricingEngine
                    .cards
                    .historicalBookingData
                    .description
                }
              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
              "
            >

              <CalendarClock
                className="
                  h-8
                  w-8
                  text-blue-300
                  md:h-9
                  md:w-9
                "
              />


              <h2
                className="
                  mt-4
                  text-xl
                  font-bold
                  sm:mt-5
                  md:text-2xl
                "
              >
                {
                  pricingEngine
                    .cards
                    .bookingPace
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  leading-7
                  text-gray-300
                  sm:mt-4
                "
              >
                {
                  pricingEngine
                    .cards
                    .bookingPace
                    .description
                }
              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
              "
            >

              <ChartNoAxesCombined
                className="
                  h-8
                  w-8
                  text-blue-300
                  md:h-9
                  md:w-9
                "
              />


              <h2
                className="
                  mt-4
                  text-xl
                  font-bold
                  sm:mt-5
                  md:text-2xl
                "
              >
                {
                  pricingEngine
                    .cards
                    .revenueKpis
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  leading-7
                  text-gray-300
                  sm:mt-4
                "
              >
                {
                  pricingEngine
                    .cards
                    .revenueKpis
                    .description
                }
              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
              "
            >

              <TrendingUp
                className="
                  h-8
                  w-8
                  text-blue-300
                  md:h-9
                  md:w-9
                "
              />


              <h2
                className="
                  mt-4
                  text-xl
                  font-bold
                  sm:mt-5
                  md:text-2xl
                "
              >
                {
                  pricingEngine
                    .cards
                    .priceElasticity
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  leading-7
                  text-gray-300
                  sm:mt-4
                "
              >
                {
                  pricingEngine
                    .cards
                    .priceElasticity
                    .description
                }
              </p>

            </div>

          </div>


          {/* ==========================================
              OBJECTIVE
              Formula intentionally removed.
          ========================================== */}

          <div
            className="
              mt-10
              rounded-[1.75rem]
              border
              border-blue-400/20
              bg-blue-500/10
              p-5
              backdrop-blur-sm
              sm:mt-12
              sm:p-7
              md:rounded-[2.5rem]
              md:p-10
              lg:p-12
            "
          >

            <BrainCircuit
              className="
                h-10
                w-10
                text-blue-300
                sm:h-11
                sm:w-11
                md:h-[52px]
                md:w-[52px]
              "
            />


            <p
              className="
                mt-5
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-300
                sm:mt-6
                sm:text-sm
                sm:tracking-[0.2em]
                md:mt-7
              "
            >
              {
                pricingEngine
                  .objective
                  .eyebrow
              }
            </p>


            <h2
              className="
                mt-3
                text-2xl
                font-bold
                leading-tight
                sm:mt-4
                sm:text-3xl
                md:text-4xl
              "
            >
              {
                pricingEngine
                  .objective
                  .titleLine1
              }

              <br />

              {
                pricingEngine
                  .objective
                  .titleLine2
              }
            </h2>


            <p
              className="
                mt-5
                max-w-4xl
                text-base
                leading-7
                text-gray-300
                sm:text-lg
                sm:leading-8
                md:mt-7
                md:text-xl
                md:leading-9
              "
            >
              {
                pricingEngine
                  .objective
                  .description
              }
            </p>

          </div>


          {/* ==========================================
              CTA
          ========================================== */}

          <Link
            href="/get-started"
            className="
              mt-8
              inline-flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-white
              transition
              hover:-translate-y-1
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-8
              sm:py-4
              sm:text-lg
              md:mt-12
            "
          >
            {pricingEngine.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
