import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import AnimatedWave from "@/components/animated-wave";

import FAQAccordion, {
  type FAQItem,
} from "@/components/faq-accordion";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


type FAQPageDictionary = {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
  };

  platformIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };

  propertySection: {
    eyebrow: string;
    title: string;
    description: string;
    questions: FAQItem[];
  };

  partnershipSection: {
    eyebrow: string;
    title: string;
    description: string;
    questions: FAQItem[];
  };

  cta: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    button: string;
  };
};


export default async function FAQPage() {

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
    isSupportedLocale(savedLocale)
  ) {
    currentLocale =
      savedLocale;
  }


  /* ==========================================
     LOAD CURRENT DICTIONARY
  ========================================== */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  let faq =
    (
      dictionary as {
        faqPage?: FAQPageDictionary;
      }
    ).faqPage;


  /* ==========================================
     FALLBACK TO DEFAULT LANGUAGE
  ========================================== */

  if (!faq) {

    const fallbackDictionary =
      await getDictionary(
        defaultLocale
      );


    faq =
      (
        fallbackDictionary as {
          faqPage?: FAQPageDictionary;
        }
      ).faqPage;

  }


  /* ==========================================
     FINAL SAFETY CHECK
  ========================================== */

  if (!faq) {
    throw new Error(
      "faqPage is missing from the default language dictionary."
    );
  }


  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#f5fbff]
        text-[#111827]
      "
    >

      {/* ========================================
          HERO
      ======================================== */}

      <section
        className="
          relative
          overflow-hidden
          px-4
          pb-14
          pt-16
          sm:px-6
          sm:pb-18
          sm:pt-20
          md:px-10
          md:pb-28
          md:pt-36
        "
      >

        <AnimatedWave />


        <div className="relative z-10 mx-auto max-w-7xl text-center">

          <p
            className="
              mb-4
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#2166f3]
              sm:mb-5
              sm:text-sm
              sm:tracking-[0.22em]
            "
          >
            {faq.hero.eyebrow}
          </p>


          <h1
            className="
              mx-auto
              max-w-5xl
              break-words
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              min-[390px]:text-[2.7rem]
              sm:text-5xl
              md:text-7xl
            "
          >

            {faq.hero.titleLine1}

            <br />

            {faq.hero.titleLine2}

          </h1>


          <p
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-base
              leading-7
              text-slate-600
              sm:mt-7
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-xl
            "
          >
            {faq.hero.description}
          </p>

        </div>

      </section>


      {/* ========================================
          PLATFORM INTRO
      ======================================== */}

      <section
        className="
          px-4
          pb-14
          sm:px-6
          sm:pb-20
          md:px-10
          md:pb-28
        "
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#2166f3]
                sm:text-sm
                sm:tracking-[0.22em]
              "
            >
              {faq.platformIntro.eyebrow}
            </p>


            <h2
              className="
                mt-4
                break-words
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                sm:text-4xl
                md:text-6xl
              "
            >
              {faq.platformIntro.title}
            </h2>


            <p
              className="
                mt-5
                max-w-3xl
                text-base
                leading-7
                text-slate-600
                sm:mt-6
                sm:text-lg
                sm:leading-8
                md:text-xl
              "
            >
              {faq.platformIntro.description}
            </p>

          </div>

        </div>

      </section>


      {/* ========================================
          FAQ CONTENT
      ======================================== */}

      <section
        className="
          px-4
          pb-20
          sm:px-6
          sm:pb-24
          md:px-10
          md:pb-36
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-8
            sm:gap-10
            md:gap-12
            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-16
          "
        >


          {/* ======================================
              LEFT — STICKY VISUAL
          ====================================== */}

          <div className="relative">

            <div className="lg:sticky lg:top-32">

              <div
                className="
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-emerald-100
                  bg-[#eef9f3]
                  p-3
                  shadow-[0_18px_45px_rgba(15,61,50,0.08)]
                  sm:rounded-[28px]
                  sm:p-4
                  md:rounded-[36px]
                  md:p-6
                  md:shadow-[0_24px_70px_rgba(15,61,50,0.10)]
                "
              >

                <div
                  className="
                    relative
                    aspect-[4/5]
                    overflow-hidden
                    rounded-[16px]
                    bg-white
                    sm:rounded-[22px]
                    md:rounded-[28px]
                  "
                >

                  <Image
                    src="/faq-dashboard.png"
                    alt="HostMetric property management dashboard"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ======================================
              RIGHT — ALL QUESTIONS
          ====================================== */}

          <div>


            {/* ====================================
                SECTION 1 — YOUR PROPERTY
            ==================================== */}

            <div>

              <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#2166f3]
                sm:text-sm
                sm:tracking-[0.22em]
              "
            >
                {faq.propertySection.eyebrow}
              </p>


              <h2
                className="
                  mt-4
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  tracking-tight
                  sm:text-3xl
                  md:text-5xl
                "
              >
                {faq.propertySection.title}
              </h2>


              <p
                className="
                  mt-4
                  max-w-3xl
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {faq.propertySection.description}
              </p>


              <div
                className="
                  mt-7
                  sm:mt-8
                  md:mt-10

                  [&_button]:!bg-[#2166f3]
                  [&_button]:!font-semibold
                  [&_button]:!tracking-[0.01em]
                  [&_button]:![font-family:'Trebuchet_MS',Arial,sans-serif]

                  [&_button>span:first-child]:!text-white

                  [&_button>span:last-child]:!h-9
                  [&_button>span:last-child]:!w-9
                  sm:[&_button>span:last-child]:!h-10
                  sm:[&_button>span:last-child]:!w-10
                  md:[&_button>span:last-child]:!h-12
                  md:[&_button>span:last-child]:!w-12
                  [&_button>span:last-child]:!bg-white
                  [&_button>span:last-child]:!text-[#2166f3]
                  [&_button>span:last-child]:!shadow-sm

                  [&_button>span:last-child>span]:!text-[24px]
                  sm:[&_button>span:last-child>span]:!text-[26px]
                  md:[&_button>span:last-child>span]:!text-[30px]
                  [&_button>span:last-child>span]:!font-black
                  [&_button>span:last-child>span]:!leading-none
                  [&_button>span:last-child>span]:!text-[#2166f3]

                  [&_button+div]:!bg-[#2166f3]
                  [&_button+div]:!text-white
                  [&_button+div_*]:!text-white
                  [&_button+div]:![font-family:'Trebuchet_MS',Arial,sans-serif]

                  [&_button~div]:!bg-[#2166f3]
                  [&_button~div]:!text-white
                  [&_button~div_*]:!text-white
                  [&_button~div]:![font-family:'Trebuchet_MS',Arial,sans-serif]
                "
              >

                <FAQAccordion
                  items={
                    faq.propertySection.questions
                  }
                />

              </div>

            </div>


            {/* ====================================
                SECTION 2 — THE PARTNERSHIP
            ==================================== */}

            <div
              className="
                mt-16
                sm:mt-20
                md:mt-32
              "
            >

              <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#2166f3]
                sm:text-sm
                sm:tracking-[0.22em]
              "
            >
                {faq.partnershipSection.eyebrow}
              </p>


              <h2
                className="
                  mt-4
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  tracking-tight
                  sm:text-3xl
                  md:text-5xl
                "
              >
                {faq.partnershipSection.title}
              </h2>


              <p
                className="
                  mt-4
                  max-w-3xl
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {faq.partnershipSection.description}
              </p>


              <div
                className="
                  mt-7
                  sm:mt-8
                  md:mt-10

                  [&_button]:!bg-[#2166f3]
                  [&_button]:!font-semibold
                  [&_button]:!tracking-[0.01em]
                  [&_button]:![font-family:'Trebuchet_MS',Arial,sans-serif]

                  [&_button>span:first-child]:!text-white

                  [&_button>span:last-child]:!h-9
                  [&_button>span:last-child]:!w-9
                  sm:[&_button>span:last-child]:!h-10
                  sm:[&_button>span:last-child]:!w-10
                  md:[&_button>span:last-child]:!h-12
                  md:[&_button>span:last-child]:!w-12
                  [&_button>span:last-child]:!bg-white
                  [&_button>span:last-child]:!text-[#2166f3]
                  [&_button>span:last-child]:!shadow-sm

                  [&_button>span:last-child>span]:!text-[24px]
                  sm:[&_button>span:last-child>span]:!text-[26px]
                  md:[&_button>span:last-child>span]:!text-[30px]
                  [&_button>span:last-child>span]:!font-black
                  [&_button>span:last-child>span]:!leading-none
                  [&_button>span:last-child>span]:!text-[#2166f3]

                  [&_button+div]:!bg-[#2166f3]
                  [&_button+div]:!text-white
                  [&_button+div_*]:!text-white
                  [&_button+div]:![font-family:'Trebuchet_MS',Arial,sans-serif]

                  [&_button~div]:!bg-[#2166f3]
                  [&_button~div]:!text-white
                  [&_button~div_*]:!text-white
                  [&_button~div]:![font-family:'Trebuchet_MS',Arial,sans-serif]
                "
              >

                <FAQAccordion
                  items={
                    faq.partnershipSection.questions
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          FINAL CTA
      ======================================== */}

      <section
        className="
          bg-[#10214a]
          px-4
          py-16
          text-white
          sm:px-6
          sm:py-20
          md:px-10
          md:py-28
        "
      >

        <div className="mx-auto max-w-5xl text-center">

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-300
              sm:text-sm
              sm:tracking-[0.22em]
            "
          >
            {faq.cta.eyebrow}
          </p>


          <h2
            className="
              mx-auto
              mt-4
              max-w-4xl
              break-words
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              sm:mt-5
              sm:text-4xl
              md:text-6xl
            "
          >

            {faq.cta.titleLine1}

            <br className="hidden md:block" />

            {" "}

            {faq.cta.titleLine2}

          </h2>


          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              leading-7
              text-white/70
              sm:mt-7
              sm:text-lg
              sm:leading-8
            "
          >
            {faq.cta.description}
          </p>


          <Link
            href="/get-started"
            className="
              mt-8
              inline-flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-[#2166f3]
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-white
              transition
              hover:-translate-y-1
              hover:bg-[#1857da]
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-9
              sm:py-4
              sm:text-lg
            "
          >
            {faq.cta.button} →
          </Link>

        </div>

      </section>

    </main>
  );
}