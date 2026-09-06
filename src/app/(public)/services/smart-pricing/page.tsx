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
  getServiceSchema,
  serializeJsonLd,
} from "@/seo/schema";


/* ==========================================
   FINAL SEO PASS NOTES

   This Smart Pricing service page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / conversion review

   Primary commercial intent:
   - Smart pricing
   - Dynamic pricing
   - Short-term rental pricing optimization
   - Airbnb & Booking.com pricing management

   Supporting concepts already represented by
   the visible page:
   - ADR
   - RevPAR
   - Booking pace
   - Lead time
   - Price elasticity
   - Competitive positioning
   - Dynamic revenue management

   This SERVICE page targets commercial pricing
   management intent. Pricing Engine remains the
   data / optimization-engine insight, while AI
   Pricing remains focused on AI-driven pricing
   technology, reducing keyword cannibalization.

   Remaining long-tail pricing and owner questions
   will be assigned to Guides / Blog in the final
   keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   SMART PRICING PAGE SEO CONTENT
========================================== */

const smartPricingPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Έξυπνη & Δυναμική Τιμολόγηση Airbnb και Booking.com | HostMetric",
    description:
      "Έξυπνη και δυναμική τιμολόγηση για Airbnb, Booking.com και βραχυχρόνιες μισθώσεις με ADR, RevPAR, ρυθμό κρατήσεων και δεδομένα αγοράς για καλύτερες τιμές, πληρότητα και έσοδα.",
  },

  en: {
    title:
      "Smart & Dynamic Pricing for Airbnb and Booking.com | HostMetric",
    description:
      "Smart and dynamic pricing for Airbnb, Booking.com and short-term rentals using ADR, RevPAR, booking pace and market data to optimize rates, occupancy and rental revenue.",
  },

  de: {
    title:
      "Smart & Dynamic Pricing für Airbnb und Booking.com | HostMetric",
    description:
      "Intelligente und dynamische Preisgestaltung für Airbnb, Booking.com und Kurzzeitvermietungen mit ADR, RevPAR, Buchungstempo und Marktdaten zur Optimierung von Preisen, Auslastung und Einnahmen.",
  },

  fr: {
    title:
      "Tarification Intelligente & Dynamique Airbnb et Booking.com | HostMetric",
    description:
      "Tarification intelligente et dynamique pour Airbnb, Booking.com et la location courte durée avec ADR, RevPAR, rythme des réservations et données de marché pour optimiser tarifs, occupation et revenus.",
  },

  it: {
    title:
      "Prezzi Intelligenti & Dinamici Airbnb e Booking.com | HostMetric",
    description:
      "Prezzi intelligenti e dinamici per Airbnb, Booking.com e affitti brevi con ADR, RevPAR, ritmo delle prenotazioni e dati di mercato per ottimizzare tariffe, occupazione e ricavi.",
  },

  es: {
    title:
      "Precios Inteligentes & Dinámicos Airbnb y Booking.com | HostMetric",
    description:
      "Precios inteligentes y dinámicos para Airbnb, Booking.com y alquileres de corta estancia con ADR, RevPAR, ritmo de reservas y datos de mercado para optimizar tarifas, ocupación e ingresos.",
  },

  pt: {
    title:
      "Preços Inteligentes & Dinâmicos Airbnb e Booking.com | HostMetric",
    description:
      "Preços inteligentes e dinâmicos para Airbnb, Booking.com e alojamento de curta duração com ADR, RevPAR, ritmo de reservas e dados de mercado para otimizar tarifas, ocupação e receitas.",
  },

  bg: {
    title:
      "Интелигентно & динамично ценообразуване Airbnb и Booking.com | HostMetric",
    description:
      "Интелигентно и динамично ценообразуване за Airbnb, Booking.com и краткосрочни наеми чрез ADR, RevPAR, темп на резервациите и пазарни данни за по-добри цени, заетост и приходи.",
  },

  sr: {
    title:
      "Pametno & dinamičko formiranje cena Airbnb i Booking.com | HostMetric",
    description:
      "Pametno i dinamičko formiranje cena za Airbnb, Booking.com i kratkoročni najam uz ADR, RevPAR, tempo rezervacija i tržišne podatke za bolje cene, popunjenost i prihode.",
  },

  tr: {
    title:
      "Airbnb ve Booking.com Akıllı & Dinamik Fiyatlandırma | HostMetric",
    description:
      "Airbnb, Booking.com ve kısa süreli kiralamalar için ADR, RevPAR, rezervasyon hızı ve pazar verileriyle akıllı ve dinamik fiyatlandırma; fiyatları, doluluğu ve geliri optimize edin.",
  },

  pl: {
    title:
      "Inteligentne & Dynamiczne Ceny Airbnb i Booking.com | HostMetric",
    description:
      "Inteligentne i dynamiczne ceny dla Airbnb, Booking.com i najmu krótkoterminowego z wykorzystaniem ADR, RevPAR, tempa rezerwacji i danych rynkowych dla lepszych stawek, obłożenia i przychodów.",
  },

  ru: {
    title:
      "Умное и динамическое ценообразование Airbnb и Booking.com | HostMetric",
    description:
      "Умное и динамическое ценообразование для Airbnb, Booking.com и краткосрочной аренды с использованием ADR, RevPAR, темпа бронирований и рыночных данных для оптимизации цен, заполняемости и дохода.",
  },
};


/* ==========================================
   SMART PRICING PAGE SEO METADATA
========================================== */

export async function generateMetadata(): Promise<Metadata> {
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

  const seo =
    smartPricingPageSeo[currentLocale];

  const localizedSmartPricingPath =
    getLocalizedPath(
      "/services/smart-pricing",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/services/smart-pricing",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedSmartPricingPath,
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


export default async function SmartPricingPage() {

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


  const smartPricing =
    dictionary.smartPricingPage;


  /* =========================================================
     LOCALIZED ROUTES
  ========================================================= */

  const homePath =
    getLocalizedPath(
      "/",
      currentLocale
    );


  const getStartedPath =
    getLocalizedPath(
      "/get-started",
      currentLocale
    );


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const schemaPageName =
    `${smartPricing.titleLine1} ${smartPricing.titleLine2}`;

  const serviceSchema =
    getServiceSchema({
      name:
        schemaPageName,
      description:
        smartPricing.description,
      pathname:
        "/services/smart-pricing",
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
            schemaPageName,
          pathname:
            "/services/smart-pricing",
        },
      ],
      locale:
        currentLocale,
    });


  /* =========================================================
     RESPONSIVE SMART PRICING PAGE

     Mobile-first presentation:
     - keeps the existing content and translations
     - keeps all existing routes
     - removes the ADR formula
     - removes the RevPAR formula
     - preserves ADR and RevPAR explanation cards
     - avoids fixed background behavior on small mobile screens
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
          "linear-gradient(rgba(3, 37, 65, 0.58), rgba(3, 37, 65, 0.70)), url('/services/smart-pricing.jpg')",
      }}
    >

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              serviceSchema
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

        {/* ==========================================
            BACK LINK
        ========================================== */}

        <Link
          href={homePath}
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            transition
            duration-300
            hover:text-sky-200
            sm:text-base
            md:text-lg
          "
        >
          ← {smartPricing.back}
        </Link>


        {/* ==========================================
            PAGE INTRODUCTION
        ========================================== */}

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
              text-sky-200
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {smartPricing.eyebrow}
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
            {smartPricing.titleLine1}

            <br />

            {smartPricing.titleLine2}
          </h1>


          <p
            className="
              mt-6
              max-w-4xl
              text-base
              leading-7
              text-white/90
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {smartPricing.description}
          </p>


          {/* ==========================================
              PRICING INFORMATION CARDS
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
                ADR
                Formula intentionally removed.
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-sky-200
                  sm:text-base
                "
              >
                {smartPricing.cards.adr.label}
              </p>


              <h2
                className="
                  mt-2
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.adr.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.adr.description}
              </p>

            </div>


            {/* ==========================================
                REVPAR
                Formula intentionally removed.
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-sky-200
                  sm:text-base
                "
              >
                {smartPricing.cards.revpar.label}
              </p>


              <h2
                className="
                  mt-2
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.revpar.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.revpar.description}
              </p>

            </div>


            {/* ==========================================
                BOOKING PACE
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.bookingPace.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.bookingPace.description}
              </p>

            </div>


            {/* ==========================================
                LEAD TIME
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.leadTime.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.leadTime.description}
              </p>

            </div>


            {/* ==========================================
                PRICE ELASTICITY
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {smartPricing.cards.priceElasticity.title}
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {smartPricing.cards.priceElasticity.description}
              </p>

            </div>


            {/* ==========================================
                COMPETITIVE POSITIONING
            ========================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
              "
            >

              <h2
                className="
                  break-words
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-[1.7rem]
                  md:text-3xl
                "
              >
                {
                  smartPricing
                    .cards
                    .competitivePositioning
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  break-words
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  smartPricing
                    .cards
                    .competitivePositioning
                    .description
                }
              </p>

            </div>

          </div>


          {/* ==========================================
              DYNAMIC REVENUE MANAGEMENT
          ========================================== */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-white/20
              bg-white/15
              p-5
              backdrop-blur-md
              sm:mt-10
              sm:p-7
              md:rounded-3xl
              md:p-10
            "
          >

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-sky-200
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {
                smartPricing
                  .dynamicRevenueManagement
                  .eyebrow
              }
            </p>


            <h2
              className="
                mt-3
                break-words
                text-2xl
                font-bold
                leading-tight
                sm:mt-4
                sm:text-3xl
              "
            >
              {
                smartPricing
                  .dynamicRevenueManagement
                  .title
              }
            </h2>


            <p
              className="
                mt-4
                break-words
                text-base
                leading-7
                text-white/85
                sm:mt-5
                sm:text-lg
                sm:leading-8
              "
            >
              {
                smartPricing
                  .dynamicRevenueManagement
                  .description
              }
            </p>

          </div>


          {/* ==========================================
              CALL TO ACTION
          ========================================== */}

          <Link
            href={getStartedPath}
            className="
              mt-8
              inline-flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-white
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-slate-950
              transition
              duration-300
              hover:-translate-y-1
              hover:scale-[1.02]
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-8
              sm:py-4
              sm:text-lg
              md:mt-12
              md:hover:scale-105
            "
          >
            {smartPricing.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
