import Link from "next/link";
import { cookies } from "next/headers";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function SmarterDistributionPage() {

  /* =========================================================
     CURRENT LANGUAGE
  ========================================================= */

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


  /* =========================================================
     LOAD TRANSLATIONS
  ========================================================= */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  const smarterDistribution =
    dictionary.smarterDistributionPage;


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
      "
    >

      {/* =====================================================
          SMARTER DISTRIBUTION HERO / CONTENT SECTION
      ====================================================== */}

      <section
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/details/distribution.jpg')",
        }}
      >

        {/* ===================================================
            DARK BACKGROUND OVERLAY

            Mobile receives a slightly stronger overlay so
            long translated text stays easy to read against
            the background image.
        ==================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-black/75
            sm:bg-black/70
          "
        />


        {/* ===================================================
            PAGE CONTAINER
        ==================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-6xl
            px-4
            py-10
            text-white
            sm:px-6
            sm:py-12
            md:px-8
            md:py-16
            lg:py-24
          "
        >

          {/* ===============================================
              BACK LINK
          ================================================ */}

          <Link
            href="/"
            className="
              inline-flex
              items-center
              text-sm
              font-medium
              text-white
              transition
              duration-300
              hover:text-blue-300
              sm:text-base
              md:text-lg
            "
          >
            ← {smarterDistribution.back}
          </Link>


          {/* ===============================================
              MAIN CONTENT
          ================================================ */}

          <div
            className="
              mt-14
              max-w-4xl
              sm:mt-16
              md:mt-20
              lg:mt-28
            "
          >

            {/* =============================================
                EYEBROW
            ============================================== */}

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-300
                sm:text-sm
                sm:tracking-[0.22em]
                md:tracking-[0.25em]
              "
            >
              {smarterDistribution.eyebrow}
            </p>


            {/* =============================================
                MAIN TITLE
            ============================================== */}

            <h1
              className="
                mt-4
                max-w-4xl
                break-words
                text-4xl
                font-bold
                leading-[1.05]
                tracking-tight
                min-[390px]:text-[2.7rem]
                sm:mt-5
                sm:text-5xl
                md:mt-6
                md:text-6xl
              "
            >
              {smarterDistribution.title}
            </h1>


            {/* =============================================
                DESCRIPTION
            ============================================== */}

            <p
              className="
                mt-5
                max-w-4xl
                text-base
                leading-7
                text-gray-200
                sm:mt-6
                sm:text-lg
                sm:leading-8
                md:mt-8
                md:text-2xl
                md:leading-10
              "
            >
              {smarterDistribution.description}
            </p>


            {/* =================================================
                SMARTER DISTRIBUTION CARDS
            ================================================== */}

            <div
              className="
                mt-10
                grid
                grid-cols-1
                gap-4
                sm:mt-12
                sm:gap-5
                md:mt-14
                md:grid-cols-2
                md:gap-6
              "
            >

              {/* ===========================================
                  ADR
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .adr
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .adr
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  REVPAN
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .revpan
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .revpan
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  PRICE ELASTICITY
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .priceElasticity
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .priceElasticity
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  COMPETITIVE POSITIONING
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .competitivePositioning
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .competitivePositioning
                      .description
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
