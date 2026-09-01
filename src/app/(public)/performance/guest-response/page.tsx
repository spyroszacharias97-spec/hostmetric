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
  Clock3,
  MessagesSquare,
  HeartHandshake,
  Star,
} from "lucide-react";


export default async function GuestResponsePage() {

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


  const guestResponse =
    dictionary.guestResponsePage;


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-sky-50
        via-white
        to-blue-100
        text-slate-950
      "
    >

      {/* =====================================================
          ANIMATED BACKGROUND WAVE
      ====================================================== */}

      <AnimatedWave />


      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-6xl
          px-4
          py-10
          sm:px-6
          sm:py-12
          md:px-8
          md:py-16
          lg:py-20
        "
      >

        {/* ===================================================
            BACK LINK
        ==================================================== */}

        <Link
          href="/"
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            text-blue-600
            transition
            hover:text-blue-800
            sm:text-base
            md:text-lg
          "
        >
          ← {guestResponse.back}
        </Link>


        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <div
          className="
            mt-14
            max-w-5xl
            sm:mt-16
            md:mt-20
            lg:mt-24
          "
        >

          {/* ===============================================
              EYEBROW
          ================================================ */}

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {guestResponse.eyebrow}
          </p>


          {/* ===============================================
              MAIN TITLE
          ================================================ */}

          <h1
            className="
              mt-4
              max-w-5xl
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

            {guestResponse.titleLine1}

            <br />

            {guestResponse.titleLine2}

          </h1>


          {/* ===============================================
              DESCRIPTION
          ================================================ */}

          <p
            className="
              mt-5
              max-w-4xl
              text-base
              leading-7
              text-slate-600
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {guestResponse.description}
          </p>


          {/* =================================================
              GUEST RESPONSE CARDS
          ================================================== */}

          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-4
              sm:mt-12
              sm:gap-5
              md:mt-16
              md:grid-cols-2
              md:gap-6
            "
          >

            {/* =============================================
                CONTINUOUS COVERAGE
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <Clock3
                className="
                  h-8
                  w-8
                  text-blue-600
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .continuousCoverage
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .continuousCoverage
                    .description
                }
              </p>

            </div>


            {/* =============================================
                NATURAL COMMUNICATION
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <MessagesSquare
                className="
                  h-8
                  w-8
                  text-blue-600
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .naturalCommunication
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .naturalCommunication
                    .description
                }
              </p>

            </div>


            {/* =============================================
                HOSPITALITY TRAINING
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <HeartHandshake
                className="
                  h-8
                  w-8
                  text-blue-600
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .hospitalityTraining
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .hospitalityTraining
                    .description
                }
              </p>

            </div>


            {/* =============================================
                BETTER REVIEWS
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <Star
                className="
                  h-8
                  w-8
                  text-yellow-500
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .betterReviews
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .betterReviews
                    .description
                }
              </p>

            </div>

          </div>


          {/* =================================================
              FINAL CTA
          ================================================== */}

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
              hover:bg-blue-700
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
            {guestResponse.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
