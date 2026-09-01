import Link from "next/link";
import { cookies } from "next/headers";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function BookingManagementPage() {

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


  const bookingManagement =
    dictionary.bookingManagementPage;


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-cover
        bg-center
        bg-no-repeat
        text-white
        md:bg-fixed
      "
      style={{
        backgroundImage:
          "linear-gradient(rgba(3, 37, 65, 0.58), rgba(3, 37, 65, 0.68)), url('/services/booking-management.jpg')",
      }}
    >

      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}

      <div
        className="
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
            text-white
            transition
            duration-300
            hover:text-sky-200
            sm:text-base
            md:text-lg
          "
        >
          ← {bookingManagement.back}
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
              text-sky-200
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {bookingManagement.eyebrow}
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

            {bookingManagement.titleLine1}

            <br />

            {bookingManagement.titleLine2}

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
              text-white/90
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {bookingManagement.description}
          </p>


          {/* =================================================
              BOOKING MANAGEMENT CARDS
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
                CALENDAR SYNCHRONIZATION
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .calendarSynchronization
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .calendarSynchronization
                    .description
                }
              </p>

            </div>


            {/* =============================================
                AVAILABILITY MANAGEMENT
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .availabilityManagement
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .availabilityManagement
                    .description
                }
              </p>

            </div>


            {/* =============================================
                LENGTH OF STAY CONTROLS
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .lengthOfStayControls
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .lengthOfStayControls
                    .description
                }
              </p>

            </div>


            {/* =============================================
                GAP NIGHT MANAGEMENT
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .gapNightManagement
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .gapNightManagement
                    .description
                }
              </p>

            </div>


            {/* =============================================
                BOOKING PACE
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .bookingPace
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .bookingPace
                    .description
                }
              </p>

            </div>


            {/* =============================================
                MULTI-CHANNEL COORDINATION
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .multiChannelCoordination
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .multiChannelCoordination
                    .description
                }
              </p>

            </div>

          </div>


          {/* =================================================
              CONNECTED STRATEGY
          ================================================== */}

          <div
            className="
              mt-6
              min-w-0
              rounded-2xl
              border
              border-white/20
              bg-white/15
              p-5
              backdrop-blur-md
              sm:mt-8
              sm:p-6
              md:mt-10
              md:rounded-3xl
              md:p-8
              lg:p-10
            "
          >

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                text-sky-200
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {
                bookingManagement
                  .connectedStrategy
                  .eyebrow
              }
            </p>


            <h2
              className="
                mt-3
                break-words
                text-xl
                font-bold
                leading-tight
                sm:mt-4
                sm:text-2xl
                md:text-3xl
              "
            >
              {
                bookingManagement
                  .connectedStrategy
                  .title
              }
            </h2>


            <p
              className="
                mt-4
                text-base
                leading-7
                text-white/85
                sm:mt-5
                sm:text-lg
                sm:leading-8
              "
            >
              {
                bookingManagement
                  .connectedStrategy
                  .description
              }
            </p>

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
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-8
              sm:py-4
              sm:text-lg
              md:mt-12
              lg:hover:scale-105
            "
          >
            {bookingManagement.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
