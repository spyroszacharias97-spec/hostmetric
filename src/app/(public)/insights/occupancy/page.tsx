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

   This Occupancy page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading and internal-link review

   Primary intent:
   - Increase occupancy
   - Increase bookings
   - Short-term rental occupancy optimization
   - Booking-window / length-of-stay / calendar optimization

   Airbnb and Booking.com are supporting platform
   terms. Property management is intentionally not
   the primary keyword so this page does not compete
   with broader commercial pages.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   OCCUPANCY PAGE SEO CONTENT
========================================== */

const occupancyPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Αύξηση Πληρότητας & Κρατήσεων για Airbnb & Booking.com | HostMetric",
    description:
      "Αυξήστε την πληρότητα και τις κρατήσεις σε Airbnb, Booking.com και βραχυχρόνιες μισθώσεις με βελτιστοποίηση booking window, διάρκειας διαμονής και ημερολογίου.",
  },

  en: {
    title:
      "Increase Occupancy & Bookings on Airbnb & Booking.com | HostMetric",
    description:
      "Increase occupancy and bookings across Airbnb, Booking.com and short-term rentals through booking-window, length-of-stay and calendar optimization.",
  },

  de: {
    title:
      "Auslastung & Buchungen auf Airbnb und Booking.com steigern | HostMetric",
    description:
      "Steigern Sie Auslastung und Buchungen bei Airbnb, Booking.com und Kurzzeitvermietungen durch Optimierung von Buchungsfenster, Aufenthaltsdauer und Kalender.",
  },

  fr: {
    title:
      "Augmenter l’Occupation & les Réservations Airbnb et Booking.com | HostMetric",
    description:
      "Augmentez le taux d’occupation et les réservations sur Airbnb, Booking.com et en location courte durée grâce à l’optimisation des fenêtres de réservation, des séjours et du calendrier.",
  },

  it: {
    title:
      "Aumentare Occupazione & Prenotazioni Airbnb e Booking.com | HostMetric",
    description:
      "Aumenta occupazione e prenotazioni su Airbnb, Booking.com e negli affitti brevi ottimizzando finestra di prenotazione, durata del soggiorno e calendario.",
  },

  es: {
    title:
      "Aumentar Ocupación & Reservas en Airbnb y Booking.com | HostMetric",
    description:
      "Aumenta la ocupación y las reservas en Airbnb, Booking.com y alquileres de corta estancia optimizando la ventana de reserva, la duración de la estancia y el calendario.",
  },

  pt: {
    title:
      "Aumentar Ocupação & Reservas no Airbnb e Booking.com | HostMetric",
    description:
      "Aumente a ocupação e as reservas no Airbnb, Booking.com e alojamento de curta duração através da otimização da janela de reserva, duração da estadia e calendário.",
  },

  bg: {
    title:
      "Повече заетост & резервации в Airbnb и Booking.com | HostMetric",
    description:
      "Увеличете заетостта и резервациите в Airbnb, Booking.com и краткосрочните наеми чрез оптимизация на периода за резервация, продължителността на престоя и календара.",
  },

  sr: {
    title:
      "Veća popunjenost & više rezervacija na Airbnb-u i Booking.com-u | HostMetric",
    description:
      "Povećajte popunjenost i rezervacije na Airbnb-u, Booking.com-u i u kratkoročnom najmu optimizacijom perioda rezervacije, dužine boravka i kalendara.",
  },

  tr: {
    title:
      "Airbnb & Booking.com Doluluk ve Rezervasyonlarını Artırın | HostMetric",
    description:
      "Rezervasyon penceresi, konaklama süresi ve takvim optimizasyonuyla Airbnb, Booking.com ve kısa süreli kiralamalarda doluluğu ve rezervasyonları artırın.",
  },

  pl: {
    title:
      "Zwiększ Obłożenie & Rezerwacje na Airbnb i Booking.com | HostMetric",
    description:
      "Zwiększ obłożenie i liczbę rezerwacji na Airbnb, Booking.com oraz w najmie krótkoterminowym dzięki optymalizacji okna rezerwacji, długości pobytu i kalendarza.",
  },

  ru: {
    title:
      "Увеличьте заполняемость и бронирования на Airbnb и Booking.com | HostMetric",
    description:
      "Увеличьте заполняемость и количество бронирований на Airbnb, Booking.com и в краткосрочной аренде благодаря оптимизации окна бронирования, продолжительности проживания и календаря.",
  },
};


/* ==========================================
   OCCUPANCY PAGE SEO METADATA
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
    occupancyPageSeo[currentLocale];


  const localizedOccupancyPath =
    getLocalizedPath(
      "/insights/occupancy",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/insights/occupancy",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedOccupancyPath,
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


export default async function OccupancyPage() {

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


  const occupancy =
    dictionary.occupancyPage;


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

  const schemaPageName =
    `${occupancy.titleLine1} ${occupancy.titleLine2}`;

  const webPageSchema =
    getWebPageSchema({
      name:
        schemaPageName,
      description:
        occupancy.description,
      pathname:
        "/insights/occupancy",
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
            "/insights/occupancy",
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
      id="top"
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
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.82)), url('/insights/occupancy.jpg')",
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
          ← {occupancy.back}
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
            {occupancy.eyebrow}
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

            {occupancy.titleLine1}

            <br />

            {occupancy.titleLine2}

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
            {occupancy.description}
          </p>


          {/* =================================================
              OCCUPANCY INSIGHT CARDS
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
                OCCUPANCY RATE
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
                  occupancy.cards
                    .occupancyRate
                    .title
                }
              </h2>


              {/* Formula intentionally preserved.
                  It is made mobile-safe instead of changing
                  any translated content or business meaning. */}

              <div
                className="
                  mt-4
                  max-w-full
                  overflow-x-auto
                  rounded-xl
                  bg-black/30
                  p-4
                  font-mono
                  text-xs
                  leading-6
                  text-white/95
                  sm:mt-5
                  sm:p-5
                  sm:text-sm
                  md:mt-6
                  md:text-base
                "
              >
                {
                  occupancy.cards
                    .occupancyRate
                    .formula
                }
              </div>


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
                  occupancy.cards
                    .occupancyRate
                    .description
                }
              </p>

            </div>


            {/* =============================================
                BOOKING WINDOW
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
                  occupancy.cards
                    .bookingWindow
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
                  occupancy.cards
                    .bookingWindow
                    .description
                }
              </p>

            </div>


            {/* =============================================
                LENGTH OF STAY
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
                  occupancy.cards
                    .lengthOfStay
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
                  occupancy.cards
                    .lengthOfStay
                    .description
                }
              </p>

            </div>


            {/* =============================================
                CALENDAR OPTIMIZATION
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
                  occupancy.cards
                    .calendarOptimization
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
                  occupancy.cards
                    .calendarOptimization
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
