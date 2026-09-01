import { cookies } from "next/headers";

import {
  BarChart3,
  CalendarCheck,
  CalendarSync,
  Camera,
  ChartNoAxesCombined,
  CircleDollarSign,
  Globe2,
  House,
  Laptop,
  LineChart,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


/* =========================================================
   WORKFLOW ICON CONFIGURATION

   Text/labels come from:
   dictionary.howItWorks.workflowLabels
========================================================= */

const workflowIcons = [
  Search,
  BarChart3,
  Camera,
  Globe2,
  CalendarSync,
  TrendingUp,
  MessageCircle,
  Star,
];


/* =========================================================
   STAGE CONFIGURATION

   Numbers and icons stay in the component.
   All visible text comes from:
   dictionary.howItWorks.stages
========================================================= */

const stageConfig = [
  {
    number: "01",
    icon: House,
  },
  {
    number: "02",
    icon: BarChart3,
  },
  {
    number: "03",
    icon: Search,
  },
  {
    number: "04",
    icon: Camera,
  },
  {
    number: "05",
    icon: Sparkles,
  },
  {
    number: "06",
    icon: Globe2,
  },
  {
    number: "07",
    icon: CalendarSync,
  },
  {
    number: "08",
    icon: ChartNoAxesCombined,
  },
  {
    number: "09",
    icon: CircleDollarSign,
  },
  {
    number: "10",
    icon: LineChart,
  },
  {
    number: "11",
    icon: CalendarCheck,
  },
  {
    number: "12",
    icon: Users,
  },
  {
    number: "13",
    icon: Star,
  },
  {
    number: "14",
    icon: Laptop,
  },
  {
    number: "15",
    icon: TrendingUp,
  },
  {
    number: "16",
    icon: RefreshCw,
  },
];


export default async function HowItWorks() {
  /* =========================================================
     CURRENT LANGUAGE
  ========================================================= */

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


  /* =========================================================
     LOAD TRANSLATIONS
  ========================================================= */

  const dictionary =
    await getDictionary(currentLocale);

  const howItWorks =
    dictionary.howItWorks;


  /* =========================================================
     RESPONSIVE PRESENTATION
     Layout scales from small phones to desktop while the
     workflow, translations, routes and animations stay intact.
  ========================================================= */

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
            {howItWorks.eyebrow}
          </p>


          <h2 className="mt-4 text-[2.35rem] font-bold leading-[1.08] tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
            {howItWorks.titleLine1}

            <br />

            {howItWorks.titleLine2}
          </h2>


          <p className="mx-auto mt-5 max-w-4xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 md:mt-7 md:text-xl md:leading-9">
            {howItWorks.description}
          </p>

        </div>


        {/* =================================================
            SYSTEM VISUAL
        ================================================= */}

        <div className="mt-12 grid items-center gap-12 sm:mt-16 md:gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-16">

          {/* =================================================
              ORBIT
          ================================================= */}

          <div className="relative mx-auto flex h-[330px] w-[330px] max-w-full items-center justify-center min-[390px]:h-[360px] min-[390px]:w-[360px] sm:h-[430px] sm:w-[430px] md:h-[520px] md:w-[520px]">

            <div className="absolute h-[274px] w-[274px] rounded-full border border-blue-200/80 min-[390px]:h-[298px] min-[390px]:w-[298px] sm:h-[356px] sm:w-[356px] md:h-[430px] md:w-[430px]" />

            <div className="absolute h-[204px] w-[204px] rounded-full border border-blue-200/70 min-[390px]:h-[222px] min-[390px]:w-[222px] sm:h-[265px] sm:w-[265px] md:h-[320px] md:w-[320px]" />


            {/* ===============================================
                CENTER
            =============================================== */}

            <div className="relative z-20 flex h-[154px] w-[154px] flex-col items-center justify-center rounded-full border border-white bg-white/90 px-3 text-center shadow-2xl shadow-blue-200/50 backdrop-blur min-[390px]:h-[166px] min-[390px]:w-[166px] sm:h-[198px] sm:w-[198px] md:h-60 md:w-60 md:px-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16">

                <Laptop className="h-6 w-6 sm:h-8 sm:w-8 md:h-[34px] md:w-[34px]" />

              </div>


              <p className="mt-3 text-[9px] font-extrabold tracking-[0.16em] text-blue-600 sm:mt-4 sm:text-[10px] md:mt-5 md:text-xs md:tracking-[0.22em]">
                HOSTMETRIC
              </p>


              <h3 className="mt-1.5 text-base font-bold leading-tight min-[390px]:text-[17px] sm:mt-2 sm:text-xl md:text-2xl">
                {howItWorks.systemCenter.titleLine1}

                <br />

                {howItWorks.systemCenter.titleLine2}
              </h3>


              <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-500 sm:mt-3 md:mt-4 md:text-xs">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

              </div>

            </div>


            {/* ===============================================
                ROTATING ORBIT
            =============================================== */}

            <div
              className="absolute inset-0"
              style={{
                animation:
                  "network-full-rotation 36s linear infinite",
              }}
            >

              {workflowIcons.map(
                (Icon, index) => {
                  const angle =
                    index *
                    (360 /
                      workflowIcons.length);

                  return (
                    <div
                      key={index}
                      className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 sm:-ml-8 sm:-mt-8 sm:h-16 sm:w-16 md:-ml-10 md:-mt-10 md:h-20 md:w-20"
                      style={{
                        transform: `rotate(${angle}deg) translateX(min(41.35vw, 215px))`,
                      }}
                    >

                      {/* Cancel the initial positioning angle */}

                      <div
                        style={{
                          transform: `rotate(-${angle}deg)`,
                        }}
                      >

                        {/* Cancel the continuous orbit rotation */}

                        <div
                          className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg sm:h-16 sm:w-16 sm:rounded-2xl md:h-20 md:w-20"
                          style={{
                            animation:
                              "network-counter-rotation 36s linear infinite",
                          }}
                        >

                          <Icon
                            className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5 md:h-[25px] md:w-[25px]"
                          />


                          <span className="mt-0.5 max-w-[46px] truncate text-[7px] font-bold text-slate-600 sm:mt-1 sm:max-w-[60px] sm:text-[8px] md:max-w-[76px] md:text-[10px]">

                            {
                              howItWorks
                                .workflowLabels[
                                index
                              ]
                            }

                          </span>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.25em]">
              {howItWorks.cycle.eyebrow}
            </p>


            <h3 className="mt-4 text-3xl font-bold leading-tight sm:mt-5 sm:text-4xl">
              {howItWorks.cycle.title}
            </h3>


            <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
              {howItWorks.cycle.paragraph1}
            </p>


            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
              {howItWorks.cycle.paragraph2}
            </p>


            <div className="mt-7 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:mt-9 sm:gap-4">

              {/* DATA → DECISIONS */}

              <div className="animate-float rounded-2xl bg-white p-4 shadow-sm sm:p-5">

                <BarChart3 className="text-blue-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.dataDecisions}
                </p>

              </div>


              {/* CONTINUOUS LOOP */}

              <div className="animate-float-delayed rounded-2xl bg-white p-4 shadow-sm sm:p-5">

                <RefreshCw className="text-green-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.continuousLoop}
                </p>

              </div>


              {/* HUMAN HOSPITALITY */}

              <div className="animate-float-delayed rounded-2xl bg-white p-4 shadow-sm sm:p-5">

                <Users className="text-purple-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.humanHospitality}
                </p>

              </div>


              {/* REVENUE FOCUS */}

              <div className="animate-float rounded-2xl bg-white p-4 shadow-sm sm:p-5">

                <TrendingUp className="text-blue-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.revenueFocus}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            16 STAGES
        ================================================= */}

        <div className="mt-20 sm:mt-24 lg:mt-32">

          <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-12 lg:mb-14">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.25em]">
              {howItWorks.stagesSection.eyebrow}
            </p>


            <h3 className="mt-4 text-3xl font-bold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              {howItWorks.stagesSection.title}
            </h3>


            <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
              {howItWorks.stagesSection.description}
            </p>

          </div>


          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">

            {stageConfig.map(
              (stage, index) => {
                const Icon =
                  stage.icon;

                const stageText =
                  howItWorks.stages[index];

                return (
                  <div
                    key={stage.number}
                    className="rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur sm:rounded-[1.75rem] sm:p-6 lg:rounded-[2rem] lg:p-7"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-14 sm:w-14 sm:rounded-2xl">

                        <Icon className="h-6 w-6 sm:h-[27px] sm:w-[27px]" />

                      </div>


                      <span className="text-2xl font-black text-blue-100 sm:text-3xl">
                        {stage.number}
                      </span>

                    </div>


                    <h4 className="mt-5 text-lg font-bold leading-snug sm:mt-6 sm:text-xl">
                      {stageText.title}
                    </h4>


                    <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
                      {stageText.text}
                    </p>


                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5">

                      {stageText.details.map(
                        (
                          detail: string,
                          detailIndex: number
                        ) => (
                          <div
                            key={
                              detailIndex
                            }
                            className="flex items-start gap-2 text-sm font-medium leading-5 text-slate-500"
                          >

                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

                            {detail}

                          </div>
                        )
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* =================================================
            SIMPLE FOR OWNER
        ================================================= */}

        <div className="mt-20 overflow-hidden rounded-[1.75rem] bg-slate-950 px-5 py-8 text-white sm:mt-24 sm:rounded-[2rem] sm:px-7 sm:py-10 md:px-10 md:py-12 lg:mt-28 lg:rounded-[2.5rem] lg:px-16 lg:py-14">

          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">

            {/* LEFT */}

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 sm:text-sm sm:tracking-[0.25em]">
                {howItWorks.owner.eyebrow}
              </p>


              <h3 className="mt-4 text-3xl font-bold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
                {howItWorks.owner.titleLine1}

                <br />

                {howItWorks.owner.titleLine2}
              </h3>


              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
                {howItWorks.owner.description}
              </p>

            </div>


            {/* RIGHT */}

            <div className="space-y-4">

              {/* STEP 1 */}

              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 sm:items-center sm:gap-5 sm:p-5">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold sm:h-11 sm:w-11">
                  1
                </span>


                <div>

                  <strong className="text-base sm:text-lg">
                    {
                      howItWorks.owner.steps[0]
                        .title
                    }
                  </strong>


                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {
                      howItWorks.owner.steps[0]
                        .description
                    }
                  </p>

                </div>

              </div>


              {/* STEP 2 */}

              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 sm:items-center sm:gap-5 sm:p-5">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold sm:h-11 sm:w-11">
                  2
                </span>


                <div>

                  <strong className="text-base sm:text-lg">
                    {
                      howItWorks.owner.steps[1]
                        .title
                    }
                  </strong>


                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {
                      howItWorks.owner.steps[1]
                        .description
                    }
                  </p>

                </div>

              </div>


              {/* STEP 3 */}

              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 sm:items-center sm:gap-5 sm:p-5">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold sm:h-11 sm:w-11">
                  3
                </span>


                <div>

                  <strong className="text-base sm:text-lg">
                    {
                      howItWorks.owner.steps[2]
                        .title
                    }
                  </strong>


                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {
                      howItWorks.owner.steps[2]
                        .description
                    }
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}