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


export default async function AiPricingPage() {

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


  const aiPricing =
    dictionary.aiPricingPage;


  /* =========================================================
     RESPONSIVE AI PRICING PAGE
     Mobile-first presentation. Content, routes, translations
     and locale handling remain unchanged.
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
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.82)), url('/insights/ai-pricing.jpg')",
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
          ← {aiPricing.back}
        </Link>


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
              text-blue-400
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {aiPricing.eyebrow}
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
            {aiPricing.title}
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
            {aiPricing.description}
          </p>


          {/* ==========================================
              AI PRICING CARDS
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
                PRICE ELASTICITY
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .priceElasticity
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .priceElasticity
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                DEMAND CURVES
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .demandCurves
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .demandCurves
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                MARKET POSITIONING
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .marketPositioning
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .marketPositioning
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                CONTINUOUS RECALCULATION
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .continuousRecalculation
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .continuousRecalculation
                    .description
                }
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
