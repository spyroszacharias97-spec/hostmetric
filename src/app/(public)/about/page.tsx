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
  BrainCircuit,
  BarChart3,
  HeartHandshake,
  Users,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  LineChart,
} from "lucide-react";


export default async function AboutPage() {
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

  const about =
    dictionary.aboutPage;


  return (
    <main className="
        min-h-screen
        overflow-x-hidden
        bg-white
        text-slate-950
      ">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="
          relative
          overflow-hidden
          bg-gradient-to-b
          from-sky-50
          via-white
          to-white
          px-4
          pb-16
          pt-16
          sm:px-6
          sm:pb-20
          sm:pt-20
          md:px-8
          md:pb-28
          md:pt-28
        ">

        <AnimatedWave />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="max-w-5xl">

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.25em]
            ">
              {about.hero.eyebrow}
            </p>

            <h1 className="
              mt-4
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              sm:mt-5
              sm:text-5xl
              md:mt-6
              md:text-7xl
            ">
              {about.hero.titleLine1}
              <br />
              {about.hero.titleLine2}
            </h1>

            <p className="
              mt-6
              max-w-4xl
              text-base
              leading-7
              text-slate-600
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-9
            ">
              {about.hero.description}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          OUR PHILOSOPHY
      ================================================= */}

      <section className="
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-24
        ">

        <div className="
          mx-auto
          grid
          max-w-7xl
          gap-8
          sm:gap-10
          md:gap-12
          lg:grid-cols-2
          lg:items-center
          lg:gap-16
        ">

          <div>

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.22em]
            ">
              {about.philosophy.eyebrow}
            </p>

            <h2 className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
              md:mt-5
              md:text-5xl
            ">
              {about.philosophy.titleLine1}
              <br />
              {about.philosophy.titleLine2}
            </h2>

          </div>


          <div className="
            space-y-5
            text-base
            leading-7
            text-slate-600
            sm:space-y-6
            sm:text-lg
            sm:leading-8
          ">

            <p>
              {about.philosophy.paragraph1}
            </p>

            <p>
              {about.philosophy.paragraph2}
            </p>

            <p>
              {about.philosophy.paragraph3}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          SCIENCE + HUMAN
      ================================================= */}

      <section className="
          bg-slate-50
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-28
        ">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.22em]
            ">
              {about.approach.eyebrow}
            </p>

            <h2 className="
            mt-4
            text-3xl
            font-bold
            tracking-tight
            sm:text-4xl
            md:mt-5
            md:text-6xl
          ">
              {about.approach.title}
            </h2>

            <p className="
              mt-5
              text-base
              leading-7
              text-slate-600
              sm:text-lg
              sm:leading-8
              md:mt-7
              md:text-xl
              md:leading-9
            ">
              {about.approach.description}
            </p>

          </div>


          <div className="
            mt-10
            grid
            gap-4
            sm:mt-12
            sm:gap-5
            md:mt-16
            md:grid-cols-2
            md:gap-6
            lg:grid-cols-4
          ">

            {/* PERFORMANCE METRICS */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <BarChart3
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.performanceMetrics.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.performanceMetrics.description}
              </p>

            </div>


            {/* MARKET INTELLIGENCE */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <BrainCircuit
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.marketIntelligence.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.marketIntelligence.description}
              </p>

            </div>


            {/* CONTINUOUS OPTIMIZATION */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <LineChart
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.continuousOptimization.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.continuousOptimization.description}
              </p>

            </div>


            {/* HUMAN COMMUNICATION */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <MessageCircle
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.humanCommunication.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.humanCommunication.description}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FAMILY STYLE
      ================================================= */}

      <section className="
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-28
        ">

        <div className="mx-auto max-w-7xl">

          <div className="
            overflow-hidden
            rounded-[24px]
            bg-[#10214a]
            text-white
            sm:rounded-[32px]
            md:rounded-[40px]
          ">

            <div className="grid lg:grid-cols-2">

              <div className="
                p-6
                sm:p-8
                md:p-12
                lg:p-16
              ">

                <div className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-500/20
                  sm:h-16
                  sm:w-16
                ">

                  <Users
                    size={34}
                    className="text-blue-300"
                  />

                </div>

                <p className="
                  mt-6
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-blue-300
                  sm:mt-8
                  sm:text-sm
                  sm:tracking-[0.22em]
                ">
                  {about.familyBusiness.eyebrow}
                </p>

                <h2 className="
                  mt-4
                  text-3xl
                  font-bold
                  leading-tight
                  sm:text-4xl
                  md:mt-5
                  md:text-5xl
                ">
                  {about.familyBusiness.title}
                </h2>

              </div>


              <div className="
                border-t
                border-white/10
                p-6
                sm:p-8
                md:p-12
                lg:border-l
                lg:border-t-0
                lg:p-16
              ">

                <p className="
                  text-base
                  leading-7
                  text-white/75
                  sm:text-lg
                  sm:leading-8
                  md:text-xl
                  md:leading-9
                ">
                  {about.familyBusiness.paragraph1}
                </p>

                <p className="
                  mt-5
                  text-base
                  leading-7
                  text-white/75
                  sm:mt-7
                  sm:text-lg
                  sm:leading-8
                  md:text-xl
                  md:leading-9
                ">
                  {about.familyBusiness.paragraph2}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          ALIGNMENT
      ================================================= */}

      <section className="
          bg-blue-50
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-28
        ">

        <div className="mx-auto max-w-7xl">

          <div className="
            grid
            gap-8
            sm:gap-10
            lg:grid-cols-[0.8fr_1.2fr]
            lg:items-center
            lg:gap-12
          ">

            <div>

              <TrendingUp
                size={52}
                className="h-11 w-11 text-blue-600 sm:h-[52px] sm:w-[52px]"
              />

              <p className="
                mt-5
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-600
                sm:mt-7
                sm:text-sm
                sm:tracking-[0.22em]
              ">
                {about.sharedSuccess.eyebrow}
              </p>

              <h2 className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
              md:mt-5
              md:text-5xl
            ">
                {about.sharedSuccess.title}
              </h2>

            </div>


            <div className="
              rounded-[24px]
              bg-white
              p-5
              shadow-sm
              sm:p-7
              md:rounded-[32px]
              md:p-12
            ">

              <p className="
                text-base
                leading-7
                text-slate-600
                sm:text-lg
                sm:leading-8
                md:text-xl
                md:leading-9
              ">
                {about.sharedSuccess.description}
              </p>

              <div className="
                mt-6
                flex
                items-start
                gap-3
                sm:mt-9
                sm:gap-4
              ">

                <ShieldCheck
                  size={30}
                  className="mt-1 shrink-0 text-blue-600"
                />

                <p className="
                  text-base
                  leading-7
                  text-slate-600
                  sm:text-lg
                  sm:leading-8
                ">
                  {about.sharedSuccess.principle}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="
          bg-[#2166f3]
          px-4
          py-16
          text-white
          sm:px-6
          sm:py-20
          md:px-8
          md:py-24
        ">

        <div className="mx-auto max-w-5xl text-center">

          <HeartHandshake
            size={50}
            className="mx-auto h-11 w-11 text-blue-100 sm:h-[50px] sm:w-[50px]"
          />

          <p className="
            mt-5
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-blue-100
            sm:mt-7
            sm:text-sm
            sm:tracking-[0.22em]
          ">
            {about.cta.eyebrow}
          </p>

          <h2 className="
            mt-4
            text-3xl
            font-bold
            tracking-tight
            sm:text-4xl
            md:mt-5
            md:text-6xl
          ">
            {about.cta.titleLine1}
            <br />
            {about.cta.titleLine2}
          </h2>

          <p className="
            mx-auto
            mt-5
            max-w-2xl
            text-base
            leading-7
            text-blue-100
            sm:text-lg
            sm:leading-8
            md:mt-7
            md:text-xl
            md:leading-9
          ">
            {about.cta.description}
          </p>

          <Link
            href="/get-started"
            className="
              mt-8
              inline-flex
              w-full
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              bg-white
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-blue-600
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-9
              sm:py-4
              sm:text-lg
              md:hover:scale-105
            "
          >
            {about.cta.button} →
          </Link>

        </div>

      </section>

    </main>
  );
}