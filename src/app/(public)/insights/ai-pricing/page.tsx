import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import {
  getDictionary,
} from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

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


/* ==========================================
   FINAL SEO PASS NOTES

   This AI Pricing page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading and internal-link review

   Primary intent:
   AI pricing, dynamic pricing and rental revenue
   optimization. Airbnb and Booking.com support the
   topic without replacing its specialized intent.

   Do NOT repeat these items in a later pass.
========================================== */

const aiPricingPageSeo: Record<
  Locale,
  { title: string; description: string }
> = {
  el: {
    title: "AI & Δυναμική Τιμολόγηση Βραχυχρόνιων Μισθώσεων | HostMetric",
    description: "AI και δυναμική τιμολόγηση για Airbnb, Booking.com και βραχυχρόνιες μισθώσεις. Ανάλυση ζήτησης, αγοράς και ελαστικότητας τιμών για καλύτερες τιμές, πληρότητα και έσοδα.",
  },
  en: {
    title: "AI & Dynamic Pricing for Short-Term Rentals | HostMetric",
    description: "AI and dynamic pricing for Airbnb, Booking.com and short-term rentals. HostMetric analyzes demand, market positioning and price elasticity to optimize rates, occupancy and rental revenue.",
  },
  de: {
    title: "KI & dynamische Preise für Kurzzeitvermietungen | HostMetric",
    description: "KI-gestützte dynamische Preisgestaltung für Airbnb, Booking.com und Kurzzeitvermietungen zur Optimierung von Preisen, Auslastung und Mieteinnahmen.",
  },
  fr: {
    title: "Tarification IA & Dynamique pour Locations Courte Durée | HostMetric",
    description: "Tarification dynamique par IA pour Airbnb, Booking.com et locations courte durée afin d’optimiser les tarifs, l’occupation et les revenus locatifs.",
  },
  it: {
    title: "Prezzi AI & Dinamici per Affitti Brevi | HostMetric",
    description: "Prezzi dinamici basati sull’AI per Airbnb, Booking.com e affitti brevi per ottimizzare tariffe, occupazione e ricavi da locazione.",
  },
  es: {
    title: "Precios con IA & Dinámicos para Alquileres Cortos | HostMetric",
    description: "Precios dinámicos con IA para Airbnb, Booking.com y alquileres de corta estancia para optimizar tarifas, ocupación e ingresos.",
  },
  pt: {
    title: "Preços com IA & Dinâmicos para Alojamento de Curta Duração | HostMetric",
    description: "Preços dinâmicos com IA para Airbnb, Booking.com e alojamento de curta duração para otimizar tarifas, ocupação e receitas.",
  },
  bg: {
    title: "AI & Динамично ценообразуване за краткосрочни наеми | HostMetric",
    description: "AI и динамично ценообразуване за Airbnb, Booking.com и краткосрочни наеми за оптимизиране на цените, заетостта и приходите.",
  },
  sr: {
    title: "AI & Dinamičko formiranje cena za kratkoročni najam | HostMetric",
    description: "AI i dinamičko formiranje cena za Airbnb, Booking.com i kratkoročni najam radi optimizacije cena, popunjenosti i prihoda.",
  },
  tr: {
    title: "Yapay Zekâ & Dinamik Fiyatlandırma | Kısa Süreli Kiralama | HostMetric",
    description: "Airbnb, Booking.com ve kısa süreli kiralamalar için yapay zekâ destekli dinamik fiyatlandırma ile fiyatları, doluluğu ve geliri optimize edin.",
  },
  pl: {
    title: "AI & Dynamiczne Ceny Najmu Krótkoterminowego | HostMetric",
    description: "Dynamiczne ceny oparte na AI dla Airbnb, Booking.com i najmu krótkoterminowego w celu optymalizacji stawek, obłożenia i przychodów.",
  },
  ru: {
    title: "AI и динамическое ценообразование для краткосрочной аренды | HostMetric",
    description: "AI и динамическое ценообразование для Airbnb, Booking.com и краткосрочной аренды: анализ спроса, рынка и ценовой эластичности для оптимизации тарифов, заполняемости и дохода от аренды.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }

  const seo = aiPricingPageSeo[currentLocale];

  const localizedAiPricingPath =
    getLocalizedPath(
      "/insights/ai-pricing",
      currentLocale
    );

  return {
    title: seo.title,
    description: seo.description,

    alternates:
      getLocalizedAlternates(
        "/insights/ai-pricing",
        currentLocale
      ),

    openGraph: {
      type: "website",
      url: localizedAiPricingPath,
      siteName: "HostMetric",
      title: seo.title,
      description: seo.description,
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}


export default async function AiPricingPage() {

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


  const aiPricing =
    dictionary.aiPricingPage;


  /* ==========================================
     LOCALIZED ROUTES
  ========================================== */

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
        aiPricing.title,
      description:
        aiPricing.description,
      pathname:
        "/insights/ai-pricing",
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
            aiPricing.title,
          pathname:
            "/insights/ai-pricing",
        },
      ],
      locale:
        currentLocale,
    });


  /* =========================================================
     RESPONSIVE AI PRICING PAGE
     Mobile-first presentation. Content, routes, translations
     and locale handling remain unchanged.
  ========================================================= */

  return (
    <main
      id="top"
      className="
        min-h-screen
        overflow-x-hidden
        bg-cover
        bg-center
        text-white
        md:bg-fixed
      "
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.82)), url('/insights/ai-pricing.jpg')",
      }}
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


      <div
        className="
          mx-auto
          max-w-6xl
          px-4
          py-10
          sm:px-6
          sm:py-14
          md:px-8
          md:py-20
        "
      >

        <Link
          href={homePath}
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            text-blue-300
            transition
            hover:text-white
            sm:text-base
            md:text-lg
          "
        >
          ← {aiPricing.back}
        </Link>


        <div
          className="
            mt-12
            max-w-5xl
            sm:mt-16
            md:mt-20
            lg:mt-24
          "
        >

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-blue-400
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {aiPricing.eyebrow}
          </p>


          <h1
            className="
              mt-4
              break-words
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              sm:mt-5
              sm:text-5xl
              md:mt-6
              md:text-6xl
            "
          >
            {aiPricing.title}
          </h1>


          <p
            className="
              mt-6
              max-w-4xl
              text-base
              leading-7
              text-gray-300
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {aiPricing.description}
          </p>


          {/* ==========================================
              AI PRICING CARDS
          ========================================== */}

          <div
            className="
              mt-10
              grid
              gap-4
              sm:mt-12
              sm:gap-5
              md:mt-16
              md:grid-cols-2
              md:gap-6
            "
          >

            {/* ==========================================
                PRICE ELASTICITY
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .priceElasticity
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .priceElasticity
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                DEMAND CURVES
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .demandCurves
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .demandCurves
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                MARKET POSITIONING
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .marketPositioning
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .marketPositioning
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                CONTINUOUS RECALCULATION
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  aiPricing
                    .cards
                    .continuousRecalculation
                    .title
                }
              </h2>


              <p
                className="
                  mt-3
                  break-words
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-4
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  aiPricing
                    .cards
                    .continuousRecalculation
                    .description
                }
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
