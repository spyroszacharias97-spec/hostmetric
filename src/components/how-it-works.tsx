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


  return (
    <section
      id="how-it-works"
      className="overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 px-8 py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">
            {howItWorks.eyebrow}
          </p>


          <h2 className="mt-5 text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
            {howItWorks.titleLine1}

            <br />

            {howItWorks.titleLine2}
          </h2>


          <p className="mx-auto mt-7 max-w-4xl text-xl leading-9 text-slate-600">
            {howItWorks.description}
          </p>

        </div>


        {/* =================================================
            SYSTEM VISUAL
        ================================================= */}

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">

          {/* =================================================
              ORBIT
          ================================================= */}

          <div className="relative mx-auto flex h-[520px] w-[520px] max-w-full items-center justify-center">

            <div className="absolute h-[430px] w-[430px] rounded-full border border-blue-200/80" />

            <div className="absolute h-[320px] w-[320px] rounded-full border border-blue-200/70" />


            {/* ===============================================
                CENTER
            =============================================== */}

            <div className="relative z-20 flex h-60 w-60 flex-col items-center justify-center rounded-full border border-white bg-white/90 text-center shadow-2xl shadow-blue-200/50 backdrop-blur">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">

                <Laptop size={34} />

              </div>


              <p className="mt-5 text-xs font-extrabold tracking-[0.22em] text-blue-600">
                HOSTMETRIC
              </p>


              <h3 className="mt-2 text-2xl font-bold leading-tight">
                {howItWorks.systemCenter.titleLine1}

                <br />

                {howItWorks.systemCenter.titleLine2}
              </h3>


              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">

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
                      className="absolute left-1/2 top-1/2 -ml-10 -mt-10 h-20 w-20"
                      style={{
                        transform: `rotate(${angle}deg) translateX(215px)`,
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
                          className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg"
                          style={{
                            animation:
                              "network-counter-rotation 36s linear infinite",
                          }}
                        >

                          <Icon
                            size={25}
                            className="text-blue-600"
                          />


                          <span className="mt-1 text-[10px] font-bold text-slate-600">

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

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              {howItWorks.cycle.eyebrow}
            </p>


            <h3 className="mt-5 text-4xl font-bold leading-tight">
              {howItWorks.cycle.title}
            </h3>


            <p className="mt-6 text-xl leading-9 text-slate-600">
              {howItWorks.cycle.paragraph1}
            </p>


            <p className="mt-5 text-xl leading-9 text-slate-600">
              {howItWorks.cycle.paragraph2}
            </p>


            <div className="mt-9 grid grid-cols-2 gap-4">

              {/* DATA → DECISIONS */}

              <div className="animate-float rounded-2xl bg-white p-5 shadow-sm">

                <BarChart3 className="text-blue-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.dataDecisions}
                </p>

              </div>


              {/* CONTINUOUS LOOP */}

              <div className="animate-float-delayed rounded-2xl bg-white p-5 shadow-sm">

                <RefreshCw className="text-green-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.continuousLoop}
                </p>

              </div>


              {/* HUMAN HOSPITALITY */}

              <div className="animate-float-delayed rounded-2xl bg-white p-5 shadow-sm">

                <Users className="text-purple-600" />

                <p className="mt-3 font-bold">
                  {howItWorks.cycle.humanHospitality}
                </p>

              </div>


              {/* REVENUE FOCUS */}

              <div className="animate-float rounded-2xl bg-white p-5 shadow-sm">

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

        <div className="mt-32">

          <div className="mx-auto mb-14 max-w-4xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              {howItWorks.stagesSection.eyebrow}
            </p>


            <h3 className="mt-5 text-4xl font-bold lg:text-5xl">
              {howItWorks.stagesSection.title}
            </h3>


            <p className="mt-6 text-xl leading-9 text-slate-600">
              {howItWorks.stagesSection.description}
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stageConfig.map(
              (stage, index) => {
                const Icon =
                  stage.icon;

                const stageText =
                  howItWorks.stages[index];

                return (
                  <div
                    key={stage.number}
                    className="rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-sm backdrop-blur"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                        <Icon size={27} />

                      </div>


                      <span className="text-3xl font-black text-blue-100">
                        {stage.number}
                      </span>

                    </div>


                    <h4 className="mt-6 text-xl font-bold leading-snug">
                      {stageText.title}
                    </h4>


                    <p className="mt-4 leading-7 text-slate-600">
                      {stageText.text}
                    </p>


                    <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">

                      {stageText.details.map(
                        (
                          detail: string,
                          detailIndex: number
                        ) => (
                          <div
                            key={
                              detailIndex
                            }
                            className="flex items-center gap-2 text-sm font-medium text-slate-500"
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

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

        <div className="mt-28 overflow-hidden rounded-[2.5rem] bg-slate-950 px-10 py-14 text-white lg:px-16">

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">

            {/* LEFT */}

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                {howItWorks.owner.eyebrow}
              </p>


              <h3 className="mt-5 text-4xl font-bold leading-tight lg:text-5xl">
                {howItWorks.owner.titleLine1}

                <br />

                {howItWorks.owner.titleLine2}
              </h3>


              <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-300">
                {howItWorks.owner.description}
              </p>

            </div>


            {/* RIGHT */}

            <div className="space-y-4">

              {/* STEP 1 */}

              <div className="flex items-center gap-5 rounded-2xl bg-white/10 p-5">

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
                  1
                </span>


                <div>

                  <strong className="text-lg">
                    {
                      howItWorks.owner.steps[0]
                        .title
                    }
                  </strong>


                  <p className="mt-1 text-sm text-slate-300">
                    {
                      howItWorks.owner.steps[0]
                        .description
                    }
                  </p>

                </div>

              </div>


              {/* STEP 2 */}

              <div className="flex items-center gap-5 rounded-2xl bg-white/10 p-5">

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
                  2
                </span>


                <div>

                  <strong className="text-lg">
                    {
                      howItWorks.owner.steps[1]
                        .title
                    }
                  </strong>


                  <p className="mt-1 text-sm text-slate-300">
                    {
                      howItWorks.owner.steps[1]
                        .description
                    }
                  </p>

                </div>

              </div>


              {/* STEP 3 */}

              <div className="flex items-center gap-5 rounded-2xl bg-white/10 p-5">

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
                  3
                </span>


                <div>

                  <strong className="text-lg">
                    {
                      howItWorks.owner.steps[2]
                        .title
                    }
                  </strong>


                  <p className="mt-1 text-sm text-slate-300">
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