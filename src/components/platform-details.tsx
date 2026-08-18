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

  const platformDetails =
    dictionary.platformDetails;


  return (
    <section className="px-8 py-28">

      <div className="mx-auto max-w-7xl space-y-10">

        {/* =================================================
            GREATER VISIBILITY
        ================================================= */}

        <div
          id="greater-visibility"
          className="group relative min-h-[430px] overflow-hidden rounded-[2.5rem] bg-gray-900"
        >

          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('/details/visibility.jpg')",
            }}
          />


          <div className="absolute inset-0 bg-black/60" />


          <div className="relative z-10 flex min-h-[430px] max-w-3xl flex-col justify-end p-12 text-white">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-300">
              {
                platformDetails
                  .greaterVisibility
                  .eyebrow
              }
            </p>


            <h2 className="text-5xl font-bold">
              {
                platformDetails
                  .greaterVisibility
                  .title
              }
            </h2>


            <p className="mt-6 text-xl leading-8 text-gray-200">
              {
                platformDetails
                  .greaterVisibility
                  .paragraph1
              }
            </p>


            <p className="mt-4 text-lg leading-8 text-gray-300">
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
          className="group relative min-h-[430px] overflow-hidden rounded-[2.5rem] bg-gray-900"
        >

          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('/details/management.jpg')",
            }}
          />


          <div className="absolute inset-0 bg-black/60" />


          <div className="relative z-10 ml-auto flex min-h-[430px] max-w-3xl flex-col justify-end p-12 text-white">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-300">
              {
                platformDetails
                  .centralizedManagement
                  .eyebrow
              }
            </p>


            <h2 className="text-5xl font-bold">
              {
                platformDetails
                  .centralizedManagement
                  .title
              }
            </h2>


            <p className="mt-6 text-xl leading-8 text-gray-200">
              {
                platformDetails
                  .centralizedManagement
                  .paragraph1
              }
            </p>


            <p className="mt-4 text-lg leading-8 text-gray-300">
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
          className="group relative min-h-[430px] overflow-hidden rounded-[2.5rem] bg-gray-900"
        >

          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('/details/distribution.jpg')",
            }}
          />


          <div className="absolute inset-0 bg-black/60" />


          <div className="relative z-10 flex min-h-[430px] max-w-3xl flex-col justify-end p-12 text-white">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-300">
              {
                platformDetails
                  .smarterDistribution
                  .eyebrow
              }
            </p>


            <h2 className="text-5xl font-bold">
              {
                platformDetails
                  .smarterDistribution
                  .title
              }
            </h2>


            <p className="mt-6 text-xl leading-8 text-gray-200">
              {
                platformDetails
                  .smarterDistribution
                  .paragraph1
              }
            </p>


            <p className="mt-4 text-lg leading-8 text-gray-300">
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