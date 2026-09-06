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

   This Centralized Management service page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / crawlability review

   Primary commercial intent:
   - Centralized property management
   - Centralized short-term rental management
   - Airbnb & Booking.com management
   - Booking and calendar performance management

   Supporting concepts already represented by
   the visible page:
   - Occupancy rate
   - Booking window
   - Booking pace
   - Calendar efficiency

   This page focuses on centralized management
   and performance visibility. Booking Management
   remains focused on reservation operations and
   channel coordination, reducing cannibalization.

   Remaining long-tail centralized-management and
   owner questions will be assigned to Guides /
   Blog in the final keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   CENTRALIZED MANAGEMENT PAGE SEO CONTENT
========================================== */

const centralizedManagementPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Κεντρική Διαχείριση Ακινήτων, Airbnb & Booking.com | HostMetric",
    description:
      "Κεντρική διαχείριση Airbnb, Booking.com και βραχυχρόνιων μισθώσεων με παρακολούθηση πληρότητας, ρυθμού κρατήσεων, booking window και αποδοτικότητας ημερολογίου.",
  },

  en: {
    title:
      "Centralized Property, Airbnb & Booking.com Management | HostMetric",
    description:
      "Centralize Airbnb, Booking.com and short-term rental management with visibility into occupancy, booking pace, booking windows and calendar efficiency.",
  },

  de: {
    title:
      "Zentrale Verwaltung von Immobilien, Airbnb & Booking.com | HostMetric",
    description:
      "Zentralisieren Sie die Verwaltung von Airbnb, Booking.com und Kurzzeitvermietungen mit Einblicken in Auslastung, Buchungstempo, Buchungsfenster und Kalendereffizienz.",
  },

  fr: {
    title:
      "Gestion Centralisée des Biens, Airbnb & Booking.com | HostMetric",
    description:
      "Centralisez la gestion Airbnb, Booking.com et des locations courte durée avec une vision du taux d’occupation, du rythme des réservations, des fenêtres de réservation et de l’efficacité du calendrier.",
  },

  it: {
    title:
      "Gestione Centralizzata di Proprietà, Airbnb & Booking.com | HostMetric",
    description:
      "Centralizza la gestione di Airbnb, Booking.com e affitti brevi con dati su occupazione, ritmo delle prenotazioni, finestre di prenotazione ed efficienza del calendario.",
  },

  es: {
    title:
      "Gestión Centralizada de Propiedades, Airbnb & Booking.com | HostMetric",
    description:
      "Centraliza la gestión de Airbnb, Booking.com y alquileres de corta estancia con visibilidad sobre ocupación, ritmo y ventana de reservas y eficiencia del calendario.",
  },

  pt: {
    title:
      "Gestão Centralizada de Imóveis, Airbnb & Booking.com | HostMetric",
    description:
      "Centralize a gestão de Airbnb, Booking.com e alojamento de curta duração com dados sobre ocupação, ritmo e janela de reservas e eficiência do calendário.",
  },

  bg: {
    title:
      "Централизирано управление на имоти, Airbnb & Booking.com | HostMetric",
    description:
      "Централизирайте управлението на Airbnb, Booking.com и краткосрочни наеми с информация за заетостта, темпа и прозореца на резервациите и ефективността на календара.",
  },

  sr: {
    title:
      "Centralizovano upravljanje objektima, Airbnb & Booking.com | HostMetric",
    description:
      "Centralizujte upravljanje Airbnb-om, Booking.com-om i kratkoročnim najmom uz pregled popunjenosti, tempa i perioda rezervacija i efikasnosti kalendara.",
  },

  tr: {
    title:
      "Merkezi Mülk, Airbnb & Booking.com Yönetimi | HostMetric",
    description:
      "Airbnb, Booking.com ve kısa süreli kiralama yönetimini doluluk, rezervasyon hızı, rezervasyon penceresi ve takvim verimliliği görünürlüğüyle merkezileştirin.",
  },

  pl: {
    title:
      "Centralne Zarządzanie Nieruchomościami, Airbnb & Booking.com | HostMetric",
    description:
      "Scentralizuj zarządzanie Airbnb, Booking.com i najmem krótkoterminowym z wglądem w obłożenie, tempo i okno rezerwacji oraz efektywność kalendarza.",
  },

  ru: {
    title:
      "Централизованное управление недвижимостью, Airbnb и Booking.com | HostMetric",
    description:
      "Централизуйте управление Airbnb, Booking.com и краткосрочной арендой с контролем заполняемости, темпа и окна бронирований, а также эффективности календаря.",
  },
};


/* ==========================================
   CENTRALIZED MANAGEMENT PAGE SEO METADATA
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
    centralizedManagementPageSeo[currentLocale];

  const localizedCentralizedManagementPath =
    getLocalizedPath(
      "/solutions/centralized-management",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/solutions/centralized-management",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedCentralizedManagementPath,
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


export default async function CentralizedManagementPage() {

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


  const centralizedManagement =
    dictionary.centralizedManagementPage;


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
        centralizedManagement.title,
      description:
        centralizedManagement.description,
      pathname:
        "/solutions/centralized-management",
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
            centralizedManagement.title,
          pathname:
            "/solutions/centralized-management",
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
          CENTRALIZED MANAGEMENT HERO / CONTENT SECTION
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
            "url('/details/management.jpg')",
        }}
      >

        {/* ===================================================
            BACKGROUND OVERLAY
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
              hover:text-blue-300
              sm:text-base
              md:text-lg
            "
          >
            ← {centralizedManagement.back}
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
              {centralizedManagement.eyebrow}
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
              {centralizedManagement.title}
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
              {centralizedManagement.description}
            </p>


            {/* =================================================
                MANAGEMENT INSIGHT CARDS
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
                  OCCUPANCY RATE
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
                    centralizedManagement.cards
                      .occupancyRate
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
                    centralizedManagement.cards
                      .occupancyRate
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  BOOKING WINDOW
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
                    centralizedManagement.cards
                      .bookingWindow
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
                    centralizedManagement.cards
                      .bookingWindow
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  BOOKING PACE
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
                    centralizedManagement.cards
                      .bookingPace
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
                    centralizedManagement.cards
                      .bookingPace
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  CALENDAR EFFICIENCY
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
                    centralizedManagement.cards
                      .calendarEfficiency
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
                    centralizedManagement.cards
                      .calendarEfficiency
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
