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
  getServiceSchema,
  serializeJsonLd,
} from "@/seo/schema";


/* ==========================================
   FINAL SEO PASS NOTES

   This Booking Management page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / conversion review

   Primary intent:
   - Booking.com management
   - Airbnb booking management
   - Reservation management
   - Multi-channel booking coordination

   Supporting concepts already represented by
   the visible page:
   - Calendar synchronization
   - Availability management
   - Length-of-stay controls
   - Gap-night management
   - Booking pace
   - Multi-channel coordination

   Booking.com receives intentionally strong
   visibility on this page. Airbnb remains a
   co-important platform term, while broader
   Property Management is reserved primarily
   for broader commercial pages.

   Remaining long-tail booking / owner questions
   will be assigned to Guides / Blog in the final
   keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   BOOKING MANAGEMENT PAGE SEO CONTENT
========================================== */

const bookingManagementPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Διαχείριση Κρατήσεων Booking.com & Airbnb | HostMetric",
    description:
      "Επαγγελματική διαχείριση κρατήσεων Booking.com και Airbnb με συγχρονισμό ημερολογίων, διαθεσιμότητας και πολλαπλών καναλιών για περισσότερες κρατήσεις και καλύτερη πληρότητα.",
  },

  en: {
    title:
      "Booking.com & Airbnb Booking Management | HostMetric",
    description:
      "Professional Booking.com and Airbnb booking management with synchronized calendars, availability and multi-channel coordination to increase bookings and improve occupancy.",
  },

  de: {
    title:
      "Booking.com & Airbnb Buchungsmanagement | HostMetric",
    description:
      "Professionelles Buchungsmanagement für Booking.com und Airbnb mit synchronisierten Kalendern, Verfügbarkeiten und mehreren Kanälen für mehr Buchungen und bessere Auslastung.",
  },

  fr: {
    title:
      "Gestion des Réservations Booking.com & Airbnb | HostMetric",
    description:
      "Gestion professionnelle des réservations Booking.com et Airbnb avec synchronisation des calendriers, disponibilités et canaux pour augmenter les réservations et le taux d’occupation.",
  },

  it: {
    title:
      "Gestione Prenotazioni Booking.com & Airbnb | HostMetric",
    description:
      "Gestione professionale delle prenotazioni Booking.com e Airbnb con calendari, disponibilità e canali sincronizzati per aumentare le prenotazioni e migliorare l’occupazione.",
  },

  es: {
    title:
      "Gestión de Reservas Booking.com & Airbnb | HostMetric",
    description:
      "Gestión profesional de reservas de Booking.com y Airbnb con calendarios, disponibilidad y canales sincronizados para aumentar las reservas y mejorar la ocupación.",
  },

  pt: {
    title:
      "Gestão de Reservas Booking.com & Airbnb | HostMetric",
    description:
      "Gestão profissional de reservas Booking.com e Airbnb com calendários, disponibilidade e canais sincronizados para aumentar as reservas e melhorar a ocupação.",
  },

  bg: {
    title:
      "Управление на резервации Booking.com & Airbnb | HostMetric",
    description:
      "Професионално управление на резервации в Booking.com и Airbnb със синхронизирани календари, наличности и канали за повече резервации и по-добра заетост.",
  },

  sr: {
    title:
      "Upravljanje rezervacijama Booking.com & Airbnb | HostMetric",
    description:
      "Profesionalno upravljanje rezervacijama na Booking.com-u i Airbnb-u uz sinhronizovane kalendare, raspoloživost i kanale za više rezervacija i bolju popunjenost.",
  },

  tr: {
    title:
      "Booking.com & Airbnb Rezervasyon Yönetimi | HostMetric",
    description:
      "Booking.com ve Airbnb için senkronize takvimler, müsaitlik ve çok kanallı koordinasyonla profesyonel rezervasyon yönetimi; daha fazla rezervasyon ve daha yüksek doluluk.",
  },

  pl: {
    title:
      "Zarządzanie Rezerwacjami Booking.com & Airbnb | HostMetric",
    description:
      "Profesjonalne zarządzanie rezerwacjami Booking.com i Airbnb z synchronizacją kalendarzy, dostępności i kanałów, aby zwiększać liczbę rezerwacji i obłożenie.",
  },

  ru: {
    title:
      "Управление бронированиями Booking.com и Airbnb | HostMetric",
    description:
      "Профессиональное управление бронированиями Booking.com и Airbnb с синхронизацией календарей, доступности и каналов для увеличения числа бронирований и заполняемости.",
  },
};


/* ==========================================
   BOOKING MANAGEMENT PAGE SEO METADATA
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
    bookingManagementPageSeo[currentLocale];

  const localizedBookingManagementPath =
    getLocalizedPath(
      "/services/booking-management",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/services/booking-management",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedBookingManagementPath,
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


export default async function BookingManagementPage() {

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


  const bookingManagement =
    dictionary.bookingManagementPage;


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
    `${bookingManagement.titleLine1} ${bookingManagement.titleLine2}`;

  const serviceSchema =
    getServiceSchema({
      name:
        schemaPageName,
      description:
        bookingManagement.description,
      pathname:
        "/services/booking-management",
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
            "/services/booking-management",
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
          "linear-gradient(rgba(3, 37, 65, 0.58), rgba(3, 37, 65, 0.68)), url('/services/booking-management.jpg')",
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
            text-white
            transition
            duration-300
            hover:text-sky-200
            sm:text-base
            md:text-lg
          "
        >
          ← {bookingManagement.back}
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
              text-sky-200
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {bookingManagement.eyebrow}
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

            {bookingManagement.titleLine1}

            <br />

            {bookingManagement.titleLine2}

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
              text-white/90
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {bookingManagement.description}
          </p>


          {/* =================================================
              BOOKING MANAGEMENT CARDS
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
                CALENDAR SYNCHRONIZATION
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .calendarSynchronization
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .calendarSynchronization
                    .description
                }
              </p>

            </div>


            {/* =============================================
                AVAILABILITY MANAGEMENT
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .availabilityManagement
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .availabilityManagement
                    .description
                }
              </p>

            </div>


            {/* =============================================
                LENGTH OF STAY CONTROLS
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .lengthOfStayControls
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .lengthOfStayControls
                    .description
                }
              </p>

            </div>


            {/* =============================================
                GAP NIGHT MANAGEMENT
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .gapNightManagement
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .gapNightManagement
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
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .bookingPace
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .bookingPace
                    .description
                }
              </p>

            </div>


            {/* =============================================
                MULTI-CHANNEL COORDINATION
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/20
                bg-white/15
                p-5
                backdrop-blur-md
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:bg-white/20
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
                  md:text-3xl
                "
              >
                {
                  bookingManagement.cards
                    .multiChannelCoordination
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-white/85
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  bookingManagement.cards
                    .multiChannelCoordination
                    .description
                }
              </p>

            </div>

          </div>


          {/* =================================================
              CONNECTED STRATEGY
          ================================================== */}

          <div
            className="
              mt-6
              min-w-0
              rounded-2xl
              border
              border-white/20
              bg-white/15
              p-5
              backdrop-blur-md
              sm:mt-8
              sm:p-6
              md:mt-10
              md:rounded-3xl
              md:p-8
              lg:p-10
            "
          >

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                text-sky-200
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {
                bookingManagement
                  .connectedStrategy
                  .eyebrow
              }
            </p>


            <h2
              className="
                mt-3
                break-words
                text-xl
                font-bold
                leading-tight
                sm:mt-4
                sm:text-2xl
                md:text-3xl
              "
            >
              {
                bookingManagement
                  .connectedStrategy
                  .title
              }
            </h2>


            <p
              className="
                mt-4
                text-base
                leading-7
                text-white/85
                sm:mt-5
                sm:text-lg
                sm:leading-8
              "
            >
              {
                bookingManagement
                  .connectedStrategy
                  .description
              }
            </p>

          </div>


          {/* =================================================
              FINAL CTA
          ================================================== */}

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
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-8
              sm:py-4
              sm:text-lg
              md:mt-12
              lg:hover:scale-105
            "
          >
            {bookingManagement.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
