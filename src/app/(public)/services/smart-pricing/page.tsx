import Link from "next/link";
import { cookies } from "next/headers";

import {
  getDictionary,
} from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function SmartPricingPage() {

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


  const smartPricing =
    dictionary.smartPricingPage;


  /* =========================================================
     RESPONSIVE SMART PRICING PAGE

     Mobile-first presentation:
     - keeps the existing content and translations
     - keeps all existing routes
     - removes the ADR formula
     - removes the RevPAR formula
     - preserves ADR and RevPAR explanation cards
     - avoids fixed background behavior on small mobile screens
  ========================================================= */

  return (
    <main
      id="top"
      className="
        min-h-screen
        overflow-x-hidden
        bg-cover
        bg-center
        text-white
        md:bg-fixed
      "
      style={{
        backgroundImage:
          "linear-gradient(rgba(3, 37, 65, 0.58), rgba(3, 37, 65, 0.70)), url('/services/smart-pricing.jpg')",
      }}
    >

      <div
        className="
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

        {/* ==========================================
            BACK LINK
        ========================================== */}

        <Link
          href="/"
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            transition
            duration-300
            hover:text-sky-200
            sm:text-base
            md:text-lg
          "
        >
          ← {smartPricing.back}
        </Link>


        {/* ==========================================
            PAGE INTRODUCTION
        ========================================== */}

        <div
          className="
            mt-12
            max-w-5xl
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
              text-sky-200
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {smartPricing.eyebrow}
          </p>


          <h1
            className="
              mt-4
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
            {smartPricing.titleLine1}

            <br />

            {smartPricing.titleLine2}
          </h1>


          <p
            className="
              mt-6
              max-w-4xl
              text-base
              leading-7
              text-white/90
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {smartPricing.description}
          </p>


          {/* ==========================================
              PRICING INFORMATION CARDS
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
              md:gap-6
            "
          >

            {/* ==========================================
                ADR
                Formula intentionally removed.
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-sky-200
                  sm:text-base
                "
              >
                {smartPricing.cards.adr.label}
              </p>


              <h2
                className="
                  mt-2
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.adr.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.adr.description}
              </p>

            </div>


            {/* ==========================================
                REVPAR
                Formula intentionally removed.
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-sky-200
                  sm:text-base
                "
              >
                {smartPricing.cards.revpar.label}
              </p>


              <h2
                className="
                  mt-2
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.revpar.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.revpar.description}
              </p>

            </div>


            {/* ==========================================
                BOOKING PACE
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.bookingPace.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.bookingPace.description}
              </p>

            </div>


            {/* ==========================================
                LEAD TIME
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.leadTime.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.leadTime.description}
              </p>

            </div>


            {/* ==========================================
                PRICE ELASTICITY
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.priceElasticity.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.priceElasticity.description}
              </p>

            </div>


            {/* ==========================================
                COMPETITIVE POSITIONING
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {
                  smartPricing
                    .cards
                    .competitivePositioning
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  smartPricing
                    .cards
                    .competitivePositioning
                    .description
                }
              </p>

            </div>

          </div>


          {/* ==========================================
              DYNAMIC REVENUE MANAGEMENT
          ========================================== */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-white/20
              bg-white/15
              p-5
              backdrop-blur-md
              sm:mt-10
              sm:p-7
              md:rounded-3xl
              md:p-10
            "
          >

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-sky-200
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {
                smartPricing
                  .dynamicRevenueManagement
                  .eyebrow
              }
            </p>


            <h2
              className="
                mt-3
                break-words
                text-2xl
                font-bold
                leading-tight
                sm:mt-4
                sm:text-3xl
              "
            >
              {
                smartPricing
                  .dynamicRevenueManagement
                  .title
              }
            </h2>


            <p
              className="
                mt-4
                break-words
                text-base
                leading-7
                text-white/85
                sm:mt-5
                sm:text-lg
                sm:leading-8
              "
            >
              {
                smartPricing
                  .dynamicRevenueManagement
                  .description
              }
            </p>

          </div>


          {/* ==========================================
              CALL TO ACTION
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
              bg-white
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-slate-950
              transition
              duration-300
              hover:-translate-y-1
              hover:scale-[1.02]
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-8
              sm:py-4
              sm:text-lg
              md:mt-12
              md:hover:scale-105
            "
          >
            {smartPricing.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
