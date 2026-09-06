"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BrainCircuit,
  CalendarDays,
  MessageCircle,
  Minus,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default function PropertyGrowth() {
  const [openItem, setOpenItem] =
    useState<number | null>(null);

  const [propertyGrowth, setPropertyGrowth] =
    useState<any | null>(null);


  /* ==========================================
     LOAD CURRENT LANGUAGE + TRANSLATIONS
  ========================================== */

  useEffect(() => {
    async function loadTranslations() {
      const cookieLocale =
        document.cookie
          .split("; ")
          .find((item) =>
            item.startsWith(
              "hostmetric_locale="
            )
          )
          ?.split("=")[1];


      let currentLocale: Locale =
        defaultLocale;


      if (
        cookieLocale &&
        isSupportedLocale(cookieLocale)
      ) {
        currentLocale =
          cookieLocale;
      }


      const dictionary =
        await getDictionary(
          currentLocale
        );


      setPropertyGrowth(
        (dictionary as any)
          .propertyGrowth ?? null
      );
    }


    loadTranslations();

  }, []);


  /* ==========================================
     ACCORDION
  ========================================== */

  const toggleItem = (
    index: number
  ) => {
    setOpenItem(
      openItem === index
        ? null
        : index
    );
  };


  /*
    Until the final dictionaries contain
    dictionary.propertyGrowth, we simply
    do not render this section.

    Once the JSON files are completed,
    it will render normally.
  */

  if (!propertyGrowth) {
    return null;
  }


  return (
    <section className="overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">

      <div className="mx-auto grid max-w-7xl items-center gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-20">

        {/* =================================================
            LEFT — PERFORMANCE ENGINE
        ================================================= */}

        <div className="relative flex min-h-[460px] items-center justify-center sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px]">

          <div className="engine-line engine-line-one" />
          <div className="engine-line engine-line-two" />
          <div className="engine-line engine-line-three" />
          <div className="engine-line engine-line-four" />
          <div className="engine-line engine-line-five" />


          {/* CENTER */}

          <div className="engine-center scale-[0.68] sm:scale-[0.8] md:scale-[0.92] lg:scale-100">

            <div className="engine-glow" />


            <BrainCircuit
              size={54}
              className="engine-main-icon"
            />


            <p className="engine-label">
              HOSTMETRIC
            </p>


            <h3>
              {
                propertyGrowth.engine
                  .titleLine1
              }

              <br />

              {
                propertyGrowth.engine
                  .titleLine2
              }
            </h3>


            <span className="engine-status">
              {
                propertyGrowth.engine
                  .status
              }
            </span>

          </div>


          {/* SMART PRICING */}

          <div className="engine-card engine-card-one scale-[0.72] sm:scale-[0.84] md:scale-[0.94] lg:scale-100">

            <TrendingUp
              size={28}
              className="text-green-600"
            />

            <div>

              <p>
                {
                  propertyGrowth.engine
                    .smartPricing.label
                }
              </p>

              <strong>
                {
                  propertyGrowth.engine
                    .smartPricing.status
                }
              </strong>

            </div>

          </div>


          {/* BOOKINGS */}

          <div className="engine-card engine-card-two scale-[0.72] sm:scale-[0.84] md:scale-[0.94] lg:scale-100">

            <CalendarDays
              size={28}
              className="text-purple-600"
            />

            <div>

              <p>
                {
                  propertyGrowth.engine
                    .bookings.label
                }
              </p>

              <strong>
                {
                  propertyGrowth.engine
                    .bookings.status
                }
              </strong>

            </div>

          </div>


          {/* GUEST COMMUNICATION */}

          <div className="engine-card engine-card-three scale-[0.72] sm:scale-[0.84] md:scale-[0.94] lg:scale-100">

            <MessageCircle
              size={28}
              className="text-blue-600"
            />

            <div>

              <p>
                {
                  propertyGrowth.engine
                    .guestCommunication
                    .label
                }
              </p>

              <strong>
                {
                  propertyGrowth.engine
                    .guestCommunication
                    .status
                }
              </strong>

            </div>

          </div>


          {/* GUEST EXPERIENCE */}

          <div className="engine-card engine-card-four scale-[0.72] sm:scale-[0.84] md:scale-[0.94] lg:scale-100">

            <Star
              size={28}
              className="text-yellow-500"
            />

            <div>

              <p>
                {
                  propertyGrowth.engine
                    .guestExperience
                    .label
                }
              </p>

              <strong>
                {
                  propertyGrowth.engine
                    .guestExperience
                    .status
                }
              </strong>

            </div>

          </div>


          {/* REVENUE */}

          <div className="engine-card engine-card-five scale-[0.72] sm:scale-[0.84] md:scale-[0.94] lg:scale-100">

            <TrendingUp
              size={28}
              className="text-blue-600"
            />

            <div>

              <p>
                {
                  propertyGrowth.engine
                    .revenue.label
                }
              </p>

              <strong>
                {
                  propertyGrowth.engine
                    .revenue.status
                }
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 sm:mb-4 sm:text-sm sm:tracking-widest">
            {propertyGrowth.eyebrow}
          </p>


          <h2 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl md:leading-tight lg:text-5xl">
            {propertyGrowth.title}
          </h2>


          <p className="mt-5 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
            {propertyGrowth.description}
          </p>


          {/* ===============================================
              ACCORDIONS
          =============================================== */}

          <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">

            {/* BOOKING MANAGEMENT */}

            <div className="overflow-hidden rounded-3xl bg-blue-600 text-white">

              <h3>
                <button
                  id="property-growth-accordion-0-button"
                  type="button"
                  onClick={() =>
                    toggleItem(0)
                  }
                  aria-expanded={openItem === 0}
                  aria-controls="property-growth-accordion-0-panel"
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6 lg:px-8 lg:py-7"
                >

                <span className="min-w-0 text-lg font-bold leading-6 sm:text-xl md:text-2xl">
                  {
                    propertyGrowth.accordions[0]
                      .title
                  }
                </span>


                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 hover:scale-110 sm:h-11 sm:w-11 lg:h-12 lg:w-12">

                  {openItem === 0
                    ? <Minus />
                    : <Plus />
                  }

                </span>

                </button>
              </h3>


              {openItem === 0 && (
                <div
                  id="property-growth-accordion-0-panel"
                  role="region"
                  aria-labelledby="property-growth-accordion-0-button"
                  className="px-5 pb-5 text-base leading-7 text-blue-50 sm:px-6 sm:pb-6 sm:text-lg sm:leading-8 lg:px-8 lg:pb-8"
                >

                  {
                    propertyGrowth.accordions[0]
                      .description
                  }

                </div>
              )}

            </div>


            {/* REVENUE */}

            <div className="overflow-hidden rounded-3xl bg-blue-600 text-white">

              <h3>
                <button
                  id="property-growth-accordion-1-button"
                  type="button"
                  onClick={() =>
                    toggleItem(1)
                  }
                  aria-expanded={openItem === 1}
                  aria-controls="property-growth-accordion-1-panel"
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6 lg:px-8 lg:py-7"
                >

                <span className="min-w-0 text-lg font-bold leading-6 sm:text-xl md:text-2xl">
                  {
                    propertyGrowth.accordions[1]
                      .title
                  }
                </span>


                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 hover:scale-110 sm:h-11 sm:w-11 lg:h-12 lg:w-12">

                  {openItem === 1
                    ? <Minus />
                    : <Plus />
                  }

                </span>

                </button>
              </h3>


              {openItem === 1 && (
                <div
                  id="property-growth-accordion-1-panel"
                  role="region"
                  aria-labelledby="property-growth-accordion-1-button"
                  className="px-5 pb-5 text-base leading-7 text-blue-50 sm:px-6 sm:pb-6 sm:text-lg sm:leading-8 lg:px-8 lg:pb-8"
                >

                  {
                    propertyGrowth.accordions[1]
                      .description
                  }

                </div>
              )}

            </div>


            {/* GUEST EXPERIENCE */}

            <div className="overflow-hidden rounded-3xl bg-blue-600 text-white">

              <h3>
                <button
                  id="property-growth-accordion-2-button"
                  type="button"
                  onClick={() =>
                    toggleItem(2)
                  }
                  aria-expanded={openItem === 2}
                  aria-controls="property-growth-accordion-2-panel"
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6 lg:px-8 lg:py-7"
                >

                <span className="min-w-0 text-lg font-bold leading-6 sm:text-xl md:text-2xl">
                  {
                    propertyGrowth.accordions[2]
                      .title
                  }
                </span>


                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 hover:scale-110 sm:h-11 sm:w-11 lg:h-12 lg:w-12">

                  {openItem === 2
                    ? <Minus />
                    : <Plus />
                  }

                </span>

                </button>
              </h3>


              {openItem === 2 && (
                <div
                  id="property-growth-accordion-2-panel"
                  role="region"
                  aria-labelledby="property-growth-accordion-2-button"
                  className="px-5 pb-5 text-base leading-7 text-blue-50 sm:px-6 sm:pb-6 sm:text-lg sm:leading-8 lg:px-8 lg:pb-8"
                >

                  {
                    propertyGrowth.accordions[2]
                      .description
                  }

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}