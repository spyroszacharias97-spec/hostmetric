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
    <section className="px-8 py-32">

      <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">

        {/* =================================================
            LEFT — PERFORMANCE ENGINE
        ================================================= */}

        <div className="relative flex min-h-[620px] items-center justify-center">

          <div className="engine-line engine-line-one" />
          <div className="engine-line engine-line-two" />
          <div className="engine-line engine-line-three" />
          <div className="engine-line engine-line-four" />
          <div className="engine-line engine-line-five" />


          {/* CENTER */}

          <div className="engine-center">

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

          <div className="engine-card engine-card-one">

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

          <div className="engine-card engine-card-two">

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

          <div className="engine-card engine-card-three">

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

          <div className="engine-card engine-card-four">

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

          <div className="engine-card engine-card-five">

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

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
            {propertyGrowth.eyebrow}
          </p>


          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            {propertyGrowth.title}
          </h2>


          <p className="mt-6 text-xl leading-8 text-gray-600">
            {propertyGrowth.description}
          </p>


          {/* ===============================================
              ACCORDIONS
          =============================================== */}

          <div className="mt-10 space-y-5">

            {/* BOOKING MANAGEMENT */}

            <div className="overflow-hidden rounded-3xl bg-blue-600 text-white">

              <button
                type="button"
                onClick={() =>
                  toggleItem(0)
                }
                className="flex w-full cursor-pointer items-center justify-between px-8 py-7 text-left"
              >

                <span className="text-2xl font-bold">
                  {
                    propertyGrowth.accordions[0]
                      .title
                  }
                </span>


                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 hover:scale-110">

                  {openItem === 0
                    ? <Minus />
                    : <Plus />
                  }

                </span>

              </button>


              {openItem === 0 && (
                <div className="px-8 pb-8 text-lg leading-8 text-blue-50">

                  {
                    propertyGrowth.accordions[0]
                      .description
                  }

                </div>
              )}

            </div>


            {/* REVENUE */}

            <div className="overflow-hidden rounded-3xl bg-blue-600 text-white">

              <button
                type="button"
                onClick={() =>
                  toggleItem(1)
                }
                className="flex w-full cursor-pointer items-center justify-between px-8 py-7 text-left"
              >

                <span className="text-2xl font-bold">
                  {
                    propertyGrowth.accordions[1]
                      .title
                  }
                </span>


                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 hover:scale-110">

                  {openItem === 1
                    ? <Minus />
                    : <Plus />
                  }

                </span>

              </button>


              {openItem === 1 && (
                <div className="px-8 pb-8 text-lg leading-8 text-blue-50">

                  {
                    propertyGrowth.accordions[1]
                      .description
                  }

                </div>
              )}

            </div>


            {/* GUEST EXPERIENCE */}

            <div className="overflow-hidden rounded-3xl bg-blue-600 text-white">

              <button
                type="button"
                onClick={() =>
                  toggleItem(2)
                }
                className="flex w-full cursor-pointer items-center justify-between px-8 py-7 text-left"
              >

                <span className="text-2xl font-bold">
                  {
                    propertyGrowth.accordions[2]
                      .title
                  }
                </span>


                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 hover:scale-110">

                  {openItem === 2
                    ? <Minus />
                    : <Plus />
                  }

                </span>

              </button>


              {openItem === 2 && (
                <div className="px-8 pb-8 text-lg leading-8 text-blue-50">

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