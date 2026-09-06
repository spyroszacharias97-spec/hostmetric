import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  getLocalizedPath,
} from "@/i18n/routing";

import {
  getLocalizedAlternates,
} from "@/seo/metadata";

import {
  getBreadcrumbSchema,
  getWebPageSchema,
  serializeJsonLd,
} from "@/seo/schema";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


/* ==========================================
   FINAL SEO PASS NOTES

   This Smarter Distribution service page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / crawlability review

   Primary commercial intent:
   - Multi-platform distribution
   - Airbnb & Booking.com distribution
   - Short-term rental channel strategy
   - Smarter distribution management

   Supporting visible concepts:
   - ADR
   - Revenue per available night
   - Price elasticity
   - Competitive positioning

   This page focuses on distribution strategy
   and the commercial performance of channel
   exposure. Platform Network remains focused on
   the broader network of booking platforms, while
   Greater Visibility focuses on visibility and
   booking opportunities.

   Remaining long-tail distribution/channel
   questions are reserved for Guides / Blog in
   the final keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   SMARTER DISTRIBUTION PAGE SEO CONTENT
========================================== */

const smarterDistributionPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Έξυπνη Διανομή σε Airbnb, Booking.com & Πολλαπλά Κανάλια | HostMetric",
    description:
      "Έξυπνη στρατηγική διανομής για Airbnb, Booking.com και βραχυχρόνιες μισθώσεις, με ανάλυση απόδοσης, εσόδων, ελαστικότητας τιμών και ανταγωνιστικής θέσης.",
  },

  en: {
    title:
      "Smart Airbnb, Booking.com & Multi-Channel Distribution | HostMetric",
    description:
      "Smarter distribution across Airbnb, Booking.com and short-term rental channels using revenue performance, price elasticity and competitive positioning to strengthen channel strategy.",
  },

  de: {
    title:
      "Smarte Airbnb-, Booking.com- & Multi-Channel-Distribution | HostMetric",
    description:
      "Intelligente Distribution über Airbnb, Booking.com und Kurzzeitmietkanäle mit Umsatzperformance, Preiselastizität und Wettbewerbspositionierung für eine stärkere Kanalstrategie.",
  },

  fr: {
    title:
      "Distribution Intelligente Airbnb, Booking.com & Multicanal | HostMetric",
    description:
      "Distribution optimisée sur Airbnb, Booking.com et les canaux de location courte durée grâce à l’analyse des revenus, de l’élasticité des prix et du positionnement concurrentiel.",
  },

  it: {
    title:
      "Distribuzione Intelligente Airbnb, Booking.com & Multicanale | HostMetric",
    description:
      "Distribuzione più intelligente su Airbnb, Booking.com e canali di affitto breve con analisi dei ricavi, elasticità dei prezzi e posizionamento competitivo.",
  },

  es: {
    title:
      "Distribución Inteligente Airbnb, Booking.com & Multicanal | HostMetric",
    description:
      "Distribución inteligente en Airbnb, Booking.com y canales de alquiler de corta estancia mediante análisis de ingresos, elasticidad de precios y posicionamiento competitivo.",
  },

  pt: {
    title:
      "Distribuição Inteligente Airbnb, Booking.com & Multicanal | HostMetric",
    description:
      "Distribuição inteligente no Airbnb, Booking.com e canais de alojamento de curta duração com análise de receitas, elasticidade de preços e posicionamento competitivo.",
  },

  bg: {
    title:
      "Интелигентна дистрибуция Airbnb, Booking.com & много канали | HostMetric",
    description:
      "Интелигентна дистрибуция в Airbnb, Booking.com и канали за краткосрочни наеми чрез анализ на приходите, ценовата еластичност и конкурентното позициониране.",
  },

  sr: {
    title:
      "Pametna distribucija Airbnb, Booking.com & više kanala | HostMetric",
    description:
      "Pametna distribucija na Airbnb-u, Booking.com-u i kanalima kratkoročnog najma uz analizu prihoda, elastičnosti cena i konkurentskog pozicioniranja.",
  },

  tr: {
    title:
      "Akıllı Airbnb, Booking.com & Çok Kanallı Dağıtım | HostMetric",
    description:
      "Gelir performansı, fiyat esnekliği ve rekabetçi konumlandırma analizleriyle Airbnb, Booking.com ve kısa süreli kiralama kanallarında daha akıllı dağıtım stratejisi.",
  },

  pl: {
    title:
      "Inteligentna Dystrybucja Airbnb, Booking.com & Wielokanałowa | HostMetric",
    description:
      "Inteligentna dystrybucja w Airbnb, Booking.com i kanałach najmu krótkoterminowego z analizą przychodów, elastyczności cenowej i pozycji konkurencyjnej.",
  },

  ru: {
    title:
      "Умная дистрибуция Airbnb, Booking.com и по нескольким каналам | HostMetric",
    description:
      "Умная дистрибуция на Airbnb, Booking.com и каналах краткосрочной аренды с анализом доходности, ценовой эластичности и конкурентного позиционирования.",
  },
};


/* ==========================================
   SMARTER DISTRIBUTION PAGE SEO METADATA
========================================== */

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale =
      savedLocale;
  }

  const seo =
    smarterDistributionPageSeo[currentLocale];

  const localizedSmarterDistributionPath =
    getLocalizedPath(
      "/solutions/smarter-distribution",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/solutions/smarter-distribution",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedSmarterDistributionPath,
      siteName:
        "HostMetric",
      title:
        seo.title,
      description:
        seo.description,
    },

    twitter: {
      card:
        "summary_large_image",
      title:
        seo.title,
      description:
        seo.description,
    },

    robots: {
      index:
        true,
      follow:
        true,
    },
  };
}


export default async function SmarterDistributionPage() {

  /* =========================================================
     CURRENT LANGUAGE
  ========================================================= */

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


  /* =========================================================
     LOAD TRANSLATIONS
  ========================================================= */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  const smarterDistribution =
    dictionary.smarterDistributionPage;


  /* =========================================================
     LOCALE-AWARE PUBLIC ROUTES
  ========================================================= */

  const homePath =
    getLocalizedPath(
      "/",
      currentLocale
    );


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const webPageSchema =
    getWebPageSchema({
      name:
        smarterDistribution.title,
      description:
        smarterDistribution.description,
      pathname:
        "/solutions/smarter-distribution",
      locale:
        currentLocale,
    });

  const breadcrumbSchema =
    getBreadcrumbSchema({
      items: [
        {
          name:
            "HostMetric",
          pathname:
            "/",
        },
        {
          name:
            smarterDistribution.title,
          pathname:
            "/solutions/smarter-distribution",
        },
      ],
      locale:
        currentLocale,
    });


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
      "
    >

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              webPageSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              breadcrumbSchema
            ),
        }}
      />


      {/* =====================================================
          SMARTER DISTRIBUTION HERO / CONTENT SECTION
      ====================================================== */}

      <section
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/details/distribution.jpg')",
        }}
      >

        {/* ===================================================
            DARK BACKGROUND OVERLAY

            Mobile receives a slightly stronger overlay so
            long translated text stays easy to read against
            the background image.
        ==================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-black/75
            sm:bg-black/70
          "
        />


        {/* ===================================================
            PAGE CONTAINER
        ==================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-6xl
            px-4
            py-10
            text-white
            sm:px-6
            sm:py-12
            md:px-8
            md:py-16
            lg:py-24
          "
        >

          {/* ===============================================
              BACK LINK
          ================================================ */}

          <Link
            href={homePath}
            className="
              inline-flex
              items-center
              text-sm
              font-medium
              text-white
              transition
              duration-300
              hover:text-blue-300
              sm:text-base
              md:text-lg
            "
          >
            ← {smarterDistribution.back}
          </Link>


          {/* ===============================================
              MAIN CONTENT
          ================================================ */}

          <div
            className="
              mt-14
              max-w-4xl
              sm:mt-16
              md:mt-20
              lg:mt-28
            "
          >

            {/* =============================================
                EYEBROW
            ============================================== */}

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-300
                sm:text-sm
                sm:tracking-[0.22em]
                md:tracking-[0.25em]
              "
            >
              {smarterDistribution.eyebrow}
            </p>


            {/* =============================================
                MAIN TITLE
            ============================================== */}

            <h1
              className="
                mt-4
                max-w-4xl
                break-words
                text-4xl
                font-bold
                leading-[1.05]
                tracking-tight
                min-[390px]:text-[2.7rem]
                sm:mt-5
                sm:text-5xl
                md:mt-6
                md:text-6xl
              "
            >
              {smarterDistribution.title}
            </h1>


            {/* =============================================
                DESCRIPTION
            ============================================== */}

            <p
              className="
                mt-5
                max-w-4xl
                text-base
                leading-7
                text-gray-200
                sm:mt-6
                sm:text-lg
                sm:leading-8
                md:mt-8
                md:text-2xl
                md:leading-10
              "
            >
              {smarterDistribution.description}
            </p>


            {/* =================================================
                SMARTER DISTRIBUTION CARDS
            ================================================== */}

            <div
              className="
                mt-10
                grid
                grid-cols-1
                gap-4
                sm:mt-12
                sm:gap-5
                md:mt-14
                md:grid-cols-2
                md:gap-6
              "
            >

              {/* ===========================================
                  ADR
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .adr
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .adr
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  REVPAN
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .revpan
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .revpan
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  PRICE ELASTICITY
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .priceElasticity
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .priceElasticity
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  COMPETITIVE POSITIONING
              ============================================ */}

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-5
                  backdrop-blur
                  transition
                  duration-300
                  sm:p-6
                  md:rounded-3xl
                  md:p-8
                  lg:hover:-translate-y-1
                  lg:hover:bg-white/[0.14]
                  lg:hover:shadow-xl
                "
              >

                <h2
                  className="
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    smarterDistribution.cards
                      .competitivePositioning
                      .title
                  }
                </h2>


                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-200
                    sm:text-lg
                    sm:leading-8
                  "
                >
                  {
                    smarterDistribution.cards
                      .competitivePositioning
                      .description
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
