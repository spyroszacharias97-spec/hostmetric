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
     LOAD CURRENT DICTIONARY
  ========================================== */

  const dictionary =
    await getDictionary(currentLocale);


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
      await getDictionary(defaultLocale);


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
    <main className="min-h-screen bg-[#f5fbff] text-[#111827]">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="relative overflow-hidden px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">

        <AnimatedWave />


        <div className="relative z-10 mx-auto max-w-7xl text-center">

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
            {faq.hero.eyebrow}
          </p>


          <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">

            {faq.hero.titleLine1}

            <br />

            {faq.hero.titleLine2}

          </h1>


          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            {faq.hero.description}
          </p>

        </div>

      </section>


      {/* ========================================
          PLATFORM INTRO
      ======================================== */}

      <section className="px-6 pb-20 md:px-10 md:pb-28">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
              {faq.platformIntro.eyebrow}
            </p>


            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              {faq.platformIntro.title}
            </h2>


            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
              {faq.platformIntro.description}
            </p>

          </div>

        </div>

      </section>


      {/* ========================================
          FAQ CONTENT
      ======================================== */}

      <section className="px-6 pb-28 md:px-10 md:pb-36">

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">


          {/* ======================================
              LEFT — STICKY VISUAL
          ====================================== */}

          <div className="relative">

            <div className="lg:sticky lg:top-32">

              <div className="overflow-hidden rounded-[36px] border border-emerald-100 bg-[#eef9f3] p-4 shadow-[0_24px_70px_rgba(15,61,50,0.10)] md:p-6">

                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white">

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

              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
                {faq.propertySection.eyebrow}
              </p>


              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                {faq.propertySection.title}
              </h2>


              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {faq.propertySection.description}
              </p>


              <div className="mt-10">

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

            <div className="mt-24 md:mt-32">

              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
                {faq.partnershipSection.eyebrow}
              </p>


              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                {faq.partnershipSection.title}
              </h2>


              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {faq.partnershipSection.description}
              </p>


              <div className="mt-10">

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

      <section className="bg-[#10214a] px-6 py-24 text-white md:px-10 md:py-28">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
            {faq.cta.eyebrow}
          </p>


          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">

            {faq.cta.titleLine1}

            <br className="hidden md:block" />

            {" "}

            {faq.cta.titleLine2}

          </h2>


          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70">
            {faq.cta.description}
          </p>


          <Link
            href="/get-started"
            className="mt-10 inline-flex rounded-2xl bg-[#2166f3] px-9 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#1857da] hover:shadow-xl"
          >
            {faq.cta.button} →
          </Link>

        </div>

      </section>

    </main>
  );
}