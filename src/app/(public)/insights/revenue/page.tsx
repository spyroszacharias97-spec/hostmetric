import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { getDictionary } from "@/i18n/get-dictionary";

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

   This Revenue page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading and internal-link review

   Primary intent:
   - Maximize short-term rental revenue
   - Increase rental profits
   - Revenue optimization
   - Better property performance

   Supporting concepts:
   - ADR
   - RevPAR
   - Booking pace
   - Demand forecasting

   Airbnb and Booking.com are supporting platform
   terms. Broader and lower-priority keyword phrases
   are intentionally reserved for Guides / Blog so
   the site can cover the full keyword universe
   without keyword stuffing or cannibalization.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   REVENUE PAGE SEO CONTENT
========================================== */

const revenuePageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Μεγιστοποίηση Εσόδων & Κερδών Βραχυχρόνιας Μίσθωσης | HostMetric",
    description:
      "Αυξήστε τα έσοδα και την κερδοφορία από Airbnb, Booking.com και βραχυχρόνιες μισθώσεις με ανάλυση ADR, RevPAR, ρυθμού κρατήσεων και πρόβλεψης ζήτησης.",
  },

  en: {
    title:
      "Maximize Short-Term Rental Revenue & Profits | HostMetric",
    description:
      "Maximize rental revenue and profitability across Airbnb, Booking.com and short-term rentals using ADR, RevPAR, booking pace and demand forecasting insights.",
  },

  de: {
    title:
      "Umsatz & Gewinn bei Kurzzeitvermietungen maximieren | HostMetric",
    description:
      "Maximieren Sie Mieteinnahmen und Rentabilität bei Airbnb, Booking.com und Kurzzeitvermietungen mit ADR, RevPAR, Buchungstempo und Nachfrageprognosen.",
  },

  fr: {
    title:
      "Maximiser les Revenus & Profits de Location Courte Durée | HostMetric",
    description:
      "Maximisez les revenus et la rentabilité sur Airbnb, Booking.com et en location courte durée grâce à l’ADR, au RevPAR, au rythme des réservations et aux prévisions de demande.",
  },

  it: {
    title:
      "Massimizzare Ricavi & Profitti degli Affitti Brevi | HostMetric",
    description:
      "Massimizza ricavi e redditività su Airbnb, Booking.com e affitti brevi attraverso ADR, RevPAR, ritmo delle prenotazioni e previsione della domanda.",
  },

  es: {
    title:
      "Maximizar Ingresos & Beneficios del Alquiler Vacacional | HostMetric",
    description:
      "Maximiza ingresos y rentabilidad en Airbnb, Booking.com y alquileres de corta estancia mediante ADR, RevPAR, ritmo de reservas y previsión de demanda.",
  },

  pt: {
    title:
      "Maximizar Receitas & Lucros do Alojamento de Curta Duração | HostMetric",
    description:
      "Maximize receitas e rentabilidade no Airbnb, Booking.com e alojamento de curta duração através de ADR, RevPAR, ritmo de reservas e previsão da procura.",
  },

  bg: {
    title:
      "Максимизиране на приходи & печалба от краткосрочни наеми | HostMetric",
    description:
      "Максимизирайте приходите и рентабилността от Airbnb, Booking.com и краткосрочни наеми чрез ADR, RevPAR, темп на резервациите и прогнозиране на търсенето.",
  },

  sr: {
    title:
      "Maksimizujte prihode & profit od kratkoročnog najma | HostMetric",
    description:
      "Maksimizujte prihode i profitabilnost na Airbnb-u, Booking.com-u i u kratkoročnom najmu uz ADR, RevPAR, tempo rezervacija i prognoziranje potražnje.",
  },

  tr: {
    title:
      "Kısa Süreli Kiralama Geliri & Kârını Maksimize Edin | HostMetric",
    description:
      "ADR, RevPAR, rezervasyon hızı ve talep tahminiyle Airbnb, Booking.com ve kısa süreli kiralamalarda geliri ve kârlılığı maksimize edin.",
  },

  pl: {
    title:
      "Maksymalizuj Przychody & Zyski z Najmu Krótkoterminowego | HostMetric",
    description:
      "Maksymalizuj przychody i rentowność na Airbnb, Booking.com oraz w najmie krótkoterminowym dzięki ADR, RevPAR, tempu rezerwacji i prognozowaniu popytu.",
  },

  ru: {
    title:
      "Максимизация дохода и прибыли от краткосрочной аренды | HostMetric",
    description:
      "Увеличивайте доход и прибыльность на Airbnb, Booking.com и в краткосрочной аренде с помощью анализа ADR, RevPAR, темпа бронирований и прогнозирования спроса.",
  },
};


/* ==========================================
   REVENUE PAGE SEO METADATA
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
    revenuePageSeo[currentLocale];


  const localizedRevenuePath =
    getLocalizedPath(
      "/insights/revenue",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/insights/revenue",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedRevenuePath,
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


export default async function RevenuePage() {

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


  const revenue =
    dictionary.revenuePage;


  /* =========================================================
     LOCALIZED ROUTES
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
        revenue.title,
      description:
        revenue.description,
      pathname:
        "/insights/revenue",
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
            revenue.title,
          pathname:
            "/insights/revenue",
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
        bg-cover
        bg-center
        bg-no-repeat
        text-white
        md:bg-fixed
      "
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.82)), url('/insights/revenue.jpg')",
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


      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-4
          py-10
          sm:px-6
          sm:py-12
          md:px-8
          md:py-16
          lg:py-20
        "
      >

        {/* ===================================================
            BACK LINK
        ==================================================== */}

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
          ← {revenue.back}
        </Link>


        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <div
          className="
            mt-14
            max-w-5xl
            sm:mt-16
            md:mt-20
            lg:mt-24
          "
        >

          {/* ===============================================
              EYEBROW
          ================================================ */}

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-400
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {revenue.eyebrow}
          </p>


          {/* ===============================================
              MAIN TITLE
          ================================================ */}

          <h1
            className="
              mt-4
              max-w-5xl
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
            {revenue.title}
          </h1>


          {/* ===============================================
              DESCRIPTION
          ================================================ */}

          <p
            className="
              mt-5
              max-w-4xl
              text-base
              leading-7
              text-gray-300
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {revenue.description}
          </p>


          {/* =================================================
              REVENUE INSIGHT CARDS
          ================================================== */}

          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-4
              sm:mt-12
              sm:gap-5
              md:mt-16
              md:grid-cols-2
              md:gap-6
            "
          >

            {/* =============================================
                ADR
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/[0.13]
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-blue-300
                  sm:text-base
                "
              >
                {
                  revenue.cards
                    .adr
                    .label
                }
              </p>


              <h2
                className="
                  mt-2
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:mt-3
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  revenue.cards
                    .adr
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  revenue.cards
                    .adr
                    .description
                }
              </p>

            </div>


            {/* =============================================
                REVPAR
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/[0.13]
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-blue-300
                  sm:text-base
                "
              >
                {
                  revenue.cards
                    .revpar
                    .label
                }
              </p>


              <h2
                className="
                  mt-2
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:mt-3
                  sm:text-2xl
                  md:text-3xl
                "
              >
                {
                  revenue.cards
                    .revpar
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  revenue.cards
                    .revpar
                    .description
                }
              </p>

            </div>


            {/* =============================================
                BOOKING PACE
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/[0.13]
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
                  revenue.cards
                    .bookingPace
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  revenue.cards
                    .bookingPace
                    .description
                }
              </p>

            </div>


            {/* =============================================
                DEMAND FORECASTING
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-5
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/[0.13]
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
                  revenue.cards
                    .demandForecasting
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  revenue.cards
                    .demandForecasting
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
