import { cookies } from "next/headers";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function PlatformDetails() {

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


  const platformDetails =
    dictionary.platformDetails;


  return (
    <section
      className="
        px-4
        py-16
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
          space-y-6
          sm:space-y-8
          lg:space-y-10
        "
      >

        {/* =================================================
            GREATER VISIBILITY
        ================================================= */}

        <div
          id="greater-visibility"
          className="
            group
            relative
            min-h-[460px]
            scroll-mt-24
            overflow-hidden
            rounded-[1.75rem]
            bg-gray-900
            sm:min-h-[480px]
            sm:rounded-[2rem]
            md:min-h-[500px]
            lg:min-h-[430px]
            lg:rounded-[2.5rem]
          "
        >

          {/* BACKGROUND IMAGE */}
          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              transition
              duration-700
              lg:group-hover:scale-105
            "
            style={{
              backgroundImage:
                "url('/details/visibility.jpg')",
            }}
          />


          {/* DARK OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-black/65
              sm:bg-black/60
            "
          />


          {/* CONTENT */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[460px]
              max-w-3xl
              flex-col
              justify-end
              p-6
              text-white
              sm:min-h-[480px]
              sm:p-8
              md:min-h-[500px]
              md:p-10
              lg:min-h-[430px]
              lg:p-12
            "
          >

            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.17em]
                text-blue-300
                sm:mb-4
                sm:text-sm
                sm:tracking-widest
              "
            >
              {
                platformDetails
                  .greaterVisibility
                  .eyebrow
              }
            </p>


            <h2
              className="
                text-[2.35rem]
                font-bold
                leading-[1.05]
                tracking-[-0.03em]
                sm:text-4xl
                md:text-5xl
                lg:text-5xl
              "
            >
              {
                platformDetails
                  .greaterVisibility
                  .title
              }
            </h2>


            <p
              className="
                mt-5
                text-base
                leading-7
                text-gray-200
                sm:mt-6
                sm:text-lg
                sm:leading-8
                md:text-xl
              "
            >
              {
                platformDetails
                  .greaterVisibility
                  .paragraph1
              }
            </p>


            <p
              className="
                mt-4
                text-sm
                leading-7
                text-gray-300
                sm:text-base
                sm:leading-8
                md:text-lg
              "
            >
              {
                platformDetails
                  .greaterVisibility
                  .paragraph2
              }
            </p>

          </div>

        </div>


        {/* =================================================
            CENTRALIZED MANAGEMENT
        ================================================= */}

        <div
          id="centralized-management"
          className="
            group
            relative
            min-h-[460px]
            scroll-mt-24
            overflow-hidden
            rounded-[1.75rem]
            bg-gray-900
            sm:min-h-[480px]
            sm:rounded-[2rem]
            md:min-h-[500px]
            lg:min-h-[430px]
            lg:rounded-[2.5rem]
          "
        >

          {/* BACKGROUND IMAGE */}
          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              transition
              duration-700
              lg:group-hover:scale-105
            "
            style={{
              backgroundImage:
                "url('/details/management.jpg')",
            }}
          />


          {/* DARK OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-black/65
              sm:bg-black/60
            "
          />


          {/* CONTENT */}
          <div
            className="
              relative
              z-10
              ml-auto
              flex
              min-h-[460px]
              max-w-3xl
              flex-col
              justify-end
              p-6
              text-white
              sm:min-h-[480px]
              sm:p-8
              md:min-h-[500px]
              md:p-10
              lg:min-h-[430px]
              lg:p-12
            "
          >

            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.17em]
                text-blue-300
                sm:mb-4
                sm:text-sm
                sm:tracking-widest
              "
            >
              {
                platformDetails
                  .centralizedManagement
                  .eyebrow
              }
            </p>


            <h2
              className="
                text-[2.35rem]
                font-bold
                leading-[1.05]
                tracking-[-0.03em]
                sm:text-4xl
                md:text-5xl
                lg:text-5xl
              "
            >
              {
                platformDetails
                  .centralizedManagement
                  .title
              }
            </h2>


            <p
              className="
                mt-5
                text-base
                leading-7
                text-gray-200
                sm:mt-6
                sm:text-lg
                sm:leading-8
                md:text-xl
              "
            >
              {
                platformDetails
                  .centralizedManagement
                  .paragraph1
              }
            </p>


            <p
              className="
                mt-4
                text-sm
                leading-7
                text-gray-300
                sm:text-base
                sm:leading-8
                md:text-lg
              "
            >
              {
                platformDetails
                  .centralizedManagement
                  .paragraph2
              }
            </p>

          </div>

        </div>


        {/* =================================================
            SMARTER DISTRIBUTION
        ================================================= */}

        <div
          id="smarter-distribution"
          className="
            group
            relative
            min-h-[460px]
            scroll-mt-24
            overflow-hidden
            rounded-[1.75rem]
            bg-gray-900
            sm:min-h-[480px]
            sm:rounded-[2rem]
            md:min-h-[500px]
            lg:min-h-[430px]
            lg:rounded-[2.5rem]
          "
        >

          {/* BACKGROUND IMAGE */}
          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              transition
              duration-700
              lg:group-hover:scale-105
            "
            style={{
              backgroundImage:
                "url('/details/distribution.jpg')",
            }}
          />


          {/* DARK OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-black/65
              sm:bg-black/60
            "
          />


          {/* CONTENT */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[460px]
              max-w-3xl
              flex-col
              justify-end
              p-6
              text-white
              sm:min-h-[480px]
              sm:p-8
              md:min-h-[500px]
              md:p-10
              lg:min-h-[430px]
              lg:p-12
            "
          >

            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.17em]
                text-blue-300
                sm:mb-4
                sm:text-sm
                sm:tracking-widest
              "
            >
              {
                platformDetails
                  .smarterDistribution
                  .eyebrow
              }
            </p>


            <h2
              className="
                text-[2.35rem]
                font-bold
                leading-[1.05]
                tracking-[-0.03em]
                sm:text-4xl
                md:text-5xl
                lg:text-5xl
              "
            >
              {
                platformDetails
                  .smarterDistribution
                  .title
              }
            </h2>


            <p
              className="
                mt-5
                text-base
                leading-7
                text-gray-200
                sm:mt-6
                sm:text-lg
                sm:leading-8
                md:text-xl
              "
            >
              {
                platformDetails
                  .smarterDistribution
                  .paragraph1
              }
            </p>


            <p
              className="
                mt-4
                text-sm
                leading-7
                text-gray-300
                sm:text-base
                sm:leading-8
                md:text-lg
              "
            >
              {
                platformDetails
                  .smarterDistribution
                  .paragraph2
              }
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
