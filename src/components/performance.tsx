import Link from "next/link";
import { cookies } from "next/headers";

import {
  MessagesSquare,
  Network,
  BrainCircuit,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function Performance() {

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


  const performance =
    dictionary.performance;


  return (
    <section
      className="
        overflow-hidden
        bg-gradient-to-br
        from-blue-600
        to-blue-800
        px-4
        py-16
        text-white
        sm:px-6
        sm:py-20
        md:px-8
        md:py-24
        lg:py-28
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* ========================================
            HEADER
        ======================================== */}

        <div
          className="
            mx-auto
            mb-10
            max-w-5xl
            text-center
            sm:mb-12
            md:mb-14
            lg:mb-16
          "
        >

          <p
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-blue-200
              sm:mb-4
              sm:text-sm
              sm:tracking-widest
            "
          >
            {performance.eyebrow}
          </p>


          <h2
            className="
              text-[2.35rem]
              font-bold
              leading-[1.06]
              tracking-[-0.03em]
              sm:text-4xl
              md:text-5xl
              lg:text-5xl
            "
          >
            {performance.titleLine1}

            <br />

            {performance.titleLine2}
          </h2>

        </div>


        {/* ========================================
            PERFORMANCE CARDS
        ======================================== */}

        <div
          className="
            grid
            gap-5
            sm:gap-6
            md:grid-cols-2
            lg:grid-cols-3
            lg:gap-8
          "
        >

          {/* ======================================
              GUEST RESPONSE
          ====================================== */}

          <Link
            href="/performance/guest-response"
            className="
              group
              cursor-pointer
              rounded-[1.75rem]
              bg-white/15
              p-6
              text-center
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white/20
              hover:shadow-xl
              sm:rounded-[2rem]
              sm:p-8
              lg:rounded-[2.5rem]
              lg:p-10
              lg:hover:-translate-y-3
              lg:hover:scale-105
              lg:hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-white/15
                transition
                duration-300
                group-hover:scale-105
                sm:h-20
                sm:w-20
                sm:rounded-3xl
                lg:h-24
                lg:w-24
                lg:group-hover:scale-110
                lg:group-hover:rotate-3
              "
            >

              <MessagesSquare
                size={34}
                className="
                  sm:h-10
                  sm:w-10
                  lg:h-12
                  lg:w-12
                "
              />

            </div>


            <p
              className="
                mt-5
                text-3xl
                font-bold
                sm:mt-6
                sm:text-4xl
                lg:mt-8
              "
            >
              &lt; 1h
            </p>


            <p
              className="
                mt-2
                text-base
                font-medium
                text-blue-100
                sm:mt-3
                sm:text-lg
              "
            >
              {
                performance.guestResponse
                  .label
              }
            </p>


            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-white/80
                transition
                group-hover:text-white
                sm:mt-5
                lg:mt-6
              "
            >
              {
                performance.guestResponse
                  .explore
              }{" "}
              →
            </p>

          </Link>


          {/* ======================================
              PLATFORM NETWORK
          ====================================== */}

          <Link
            href="/performance/platform-network"
            className="
              group
              cursor-pointer
              rounded-[1.75rem]
              bg-white/15
              p-6
              text-center
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white/20
              hover:shadow-xl
              sm:rounded-[2rem]
              sm:p-8
              lg:rounded-[2.5rem]
              lg:p-10
              lg:hover:-translate-y-3
              lg:hover:scale-105
              lg:hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-white/15
                transition
                duration-300
                group-hover:scale-105
                sm:h-20
                sm:w-20
                sm:rounded-3xl
                lg:h-24
                lg:w-24
                lg:group-hover:scale-110
                lg:group-hover:-rotate-3
              "
            >

              <Network
                size={34}
                className="
                  sm:h-10
                  sm:w-10
                  lg:h-12
                  lg:w-12
                "
              />

            </div>


            <p
              className="
                mt-5
                text-3xl
                font-bold
                sm:mt-6
                sm:text-4xl
                lg:mt-8
              "
            >
              10+
            </p>


            <p
              className="
                mt-2
                text-base
                font-medium
                text-blue-100
                sm:mt-3
                sm:text-lg
              "
            >
              {
                performance.platformNetwork
                  .label
              }
            </p>


            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-white/80
                transition
                group-hover:text-white
                sm:mt-5
                lg:mt-6
              "
            >
              {
                performance.platformNetwork
                  .explore
              }{" "}
              →
            </p>

          </Link>


          {/* ======================================
              PRICING ENGINE
          ====================================== */}

          <Link
            href="/performance/pricing-engine"
            className="
              group
              cursor-pointer
              rounded-[1.75rem]
              bg-white/15
              p-6
              text-center
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white/20
              hover:shadow-xl
              sm:rounded-[2rem]
              sm:p-8
              md:col-span-2
              lg:col-span-1
              lg:rounded-[2.5rem]
              lg:p-10
              lg:hover:-translate-y-3
              lg:hover:scale-105
              lg:hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-white/15
                transition
                duration-300
                group-hover:scale-105
                sm:h-20
                sm:w-20
                sm:rounded-3xl
                lg:h-24
                lg:w-24
                lg:group-hover:scale-110
                lg:group-hover:rotate-3
              "
            >

              <BrainCircuit
                size={34}
                className="
                  sm:h-10
                  sm:w-10
                  lg:h-12
                  lg:w-12
                "
              />

            </div>


            <p
              className="
                mt-5
                text-3xl
                font-bold
                sm:mt-6
                sm:text-4xl
                lg:mt-8
              "
            >
              AI
            </p>


            <p
              className="
                mt-2
                text-base
                font-medium
                text-blue-100
                sm:mt-3
                sm:text-lg
              "
            >
              {
                performance.pricingEngine
                  .label
              }
            </p>


            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-white/80
                transition
                group-hover:text-white
                sm:mt-5
                lg:mt-6
              "
            >
              {
                performance.pricingEngine
                  .explore
              }{" "}
              →
            </p>

          </Link>

        </div>

      </div>

    </section>
  );
}
