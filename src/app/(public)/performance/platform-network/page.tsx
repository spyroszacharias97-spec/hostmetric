import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import AnimatedWave from "@/components/animated-wave";

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

import {
  Laptop,
  RefreshCw,
  CalendarSync,
  Globe2,
  Layers3,
} from "lucide-react";


const platforms = [
  {
    name: "Airbnb",
    logo: "/platforms/airbnb.png",
  },
  {
    name: "Booking.com",
    logo: "/platforms/booking.png",
  },
  {
    name: "Vrbo",
    logo: "/platforms/vrbo.png",
  },
  {
    name: "Expedia",
    logo: "/platforms/expedia.png",
  },
  {
    name: "Agoda",
    logo: "/platforms/agoda.png",
  },
  {
    name: "Trip.com",
    logo: "/platforms/tripcom.png",
  },
  {
    name: "Tripadvisor",
    logo: "/platforms/tripadvisor.png",
  },
  {
    name: "Trivago",
    logo: "/platforms/trivago.png",
  },
  {
    name: "Google",
    logo: "/platforms/google.png",
  },
  {
    name: "Skyscanner",
    logo: "/platforms/skyscanner.png",
  },
  {
    name: "Marriott",
    logo: "/platforms/marriott.png",
  },
  {
    name: "OneTwoTrip",
    logo: "/platforms/onetwotrip.png",
  },
];


/* ==========================================
   FINAL SEO PASS NOTES

   This Platform Network page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / platform-content review

   Primary intent:
   - Multi-platform distribution
   - Airbnb & Booking.com distribution
   - Channel / calendar synchronization
   - Wider property visibility

   Supporting concepts:
   - Coordinated platform strategy
   - More booking opportunities
   - Short-term rental distribution

   Lower-priority and long-tail platform phrases
   are reserved for Guides / Blog and the final
   keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   PLATFORM NETWORK PAGE SEO CONTENT
========================================== */

const platformNetworkPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Airbnb, Booking.com & Multi-Platform Διανομή Ακινήτων | HostMetric",
    description:
      "Προβάλετε το ακίνητό σας σε Airbnb, Booking.com και πολλαπλά κανάλια με συγχρονισμένα ημερολόγια και συντονισμένη στρατηγική για μεγαλύτερη προβολή και περισσότερες ευκαιρίες κρατήσεων.",
  },

  en: {
    title:
      "Airbnb, Booking.com & Multi-Platform Distribution | HostMetric",
    description:
      "Distribute your property across Airbnb, Booking.com and multiple booking channels with synchronized calendars and coordinated strategy for wider visibility and more booking opportunities.",
  },

  de: {
    title:
      "Airbnb, Booking.com & Multi-Plattform-Vertrieb | HostMetric",
    description:
      "Präsentieren Sie Ihre Immobilie auf Airbnb, Booking.com und mehreren Buchungskanälen mit synchronisierten Kalendern und koordinierter Strategie für mehr Sichtbarkeit und Buchungschancen.",
  },

  fr: {
    title:
      "Airbnb, Booking.com & Distribution Multiplateforme | HostMetric",
    description:
      "Diffusez votre bien sur Airbnb, Booking.com et plusieurs canaux de réservation avec des calendriers synchronisés et une stratégie coordonnée pour gagner en visibilité et en opportunités de réservation.",
  },

  it: {
    title:
      "Airbnb, Booking.com & Distribuzione Multicanale | HostMetric",
    description:
      "Distribuisci il tuo immobile su Airbnb, Booking.com e più canali di prenotazione con calendari sincronizzati e una strategia coordinata per maggiore visibilità e più opportunità di prenotazione.",
  },

  es: {
    title:
      "Airbnb, Booking.com & Distribución Multiplataforma | HostMetric",
    description:
      "Distribuye tu propiedad en Airbnb, Booking.com y múltiples canales de reserva con calendarios sincronizados y una estrategia coordinada para lograr mayor visibilidad y más oportunidades de reserva.",
  },

  pt: {
    title:
      "Airbnb, Booking.com & Distribuição Multiplataforma | HostMetric",
    description:
      "Distribua o seu imóvel no Airbnb, Booking.com e vários canais de reserva com calendários sincronizados e estratégia coordenada para maior visibilidade e mais oportunidades de reserva.",
  },

  bg: {
    title:
      "Airbnb, Booking.com & Мултиплатформена дистрибуция | HostMetric",
    description:
      "Разпространявайте имота си в Airbnb, Booking.com и множество канали за резервации със синхронизирани календари и координирана стратегия за по-голяма видимост и повече възможности за резервации.",
  },

  sr: {
    title:
      "Airbnb, Booking.com & Distribucija na više platformi | HostMetric",
    description:
      "Predstavite nekretninu na Airbnb-u, Booking.com-u i više kanala za rezervacije uz sinhronizovane kalendare i koordinisanu strategiju za veću vidljivost i više prilika za rezervacije.",
  },

  tr: {
    title:
      "Airbnb, Booking.com & Çok Platformlu Dağıtım | HostMetric",
    description:
      "Mülkünüzü Airbnb, Booking.com ve birden fazla rezervasyon kanalında senkronize takvimler ve koordineli stratejiyle yayınlayarak görünürlüğü ve rezervasyon fırsatlarını artırın.",
  },

  pl: {
    title:
      "Airbnb, Booking.com & Dystrybucja Wielokanałowa | HostMetric",
    description:
      "Publikuj nieruchomość na Airbnb, Booking.com i wielu kanałach rezerwacyjnych z synchronizacją kalendarzy i skoordynowaną strategią, aby zwiększać widoczność i możliwości rezerwacji.",
  },

  ru: {
    title:
      "Airbnb, Booking.com и мультиплатформенная дистрибуция | HostMetric",
    description:
      "Размещайте объект на Airbnb, Booking.com и других каналах бронирования с синхронизацией календарей и единой стратегией для большей видимости и новых возможностей бронирования.",
  },
};


/* ==========================================
   PLATFORM NETWORK PAGE SEO METADATA
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
    platformNetworkPageSeo[currentLocale];

  const localizedPlatformNetworkPath =
    getLocalizedPath(
      "/performance/platform-network",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/performance/platform-network",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedPlatformNetworkPath,
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


export default async function PlatformNetworkPage() {

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


  const platformNetwork =
    dictionary.platformNetworkPage;


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
    `${platformNetwork.titleLine1} ${platformNetwork.titleLine2} ${platformNetwork.titleLine3}`;

  const webPageSchema =
    getWebPageSchema({
      name:
        schemaPageName,
      description:
        platformNetwork.description,
      pathname:
        "/performance/platform-network",
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
            "/performance/platform-network",
        },
      ],
      locale:
        currentLocale,
    });


  /* =========================================================
     RESPONSIVE PLATFORM NETWORK PAGE
     Mobile-first presentation. Content, routes, platform data,
     locale handling and animations remain unchanged.
  ========================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-sky-50
        via-white
        to-cyan-50
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


      {/* ==========================================
          ANIMATED WAVE
      ========================================== */}

      <AnimatedWave />


      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
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
            text-blue-600
            transition
            hover:text-blue-800
            sm:text-base
            md:text-lg
          "
        >
          ← {platformNetwork.back}
        </Link>


        <div
          className="
            mt-10
            grid
            min-w-0
            items-center
            gap-12
            sm:mt-14
            sm:gap-14
            md:mt-16
            lg:mt-20
            lg:grid-cols-2
            lg:gap-16
            xl:gap-20
          "
        >

          {/* =================================================
              LEFT - ROTATING NETWORK
          ================================================= */}

          <div
            className="
              platform-network-orbit
              !mx-auto
              !h-[320px]
              !w-[320px]
              !max-w-full
              [--network-orbit-radius:128px]
              min-[390px]:!h-[350px]
              min-[390px]:!w-[350px]
              min-[390px]:[--network-orbit-radius:142px]
              sm:!h-[430px]
              sm:!w-[430px]
              sm:[--network-orbit-radius:180px]
              md:!h-[500px]
              md:!w-[500px]
              md:[--network-orbit-radius:215px]
              lg:!h-[540px]
              lg:!w-[540px]
              lg:[--network-orbit-radius:235px]
              xl:!h-[580px]
              xl:!w-[580px]
              xl:[--network-orbit-radius:260px]
            "
          >

            <div
              className="
                platform-network-center
                !h-[158px]
                !w-[158px]
                !p-4
                min-[390px]:!h-[170px]
                min-[390px]:!w-[170px]
                sm:!h-[205px]
                sm:!w-[205px]
                sm:!p-5
                md:!h-[230px]
                md:!w-[230px]
                lg:!h-[240px]
                lg:!w-[240px]
              "
            >

              <Laptop
                className="
                  !h-10
                  !w-10
                  sm:!h-12
                  sm:!w-12
                  md:!h-14
                  md:!w-14
                  lg:!h-[72px]
                  lg:!w-[72px]
                "
              />


              <p
                className="
                  !mt-2
                  !text-[10px]
                  sm:!text-xs
                "
              >
                HOSTMETRIC
              </p>


              <strong
                className="
                  !mt-1
                  !text-base
                  !leading-[1.05]
                  min-[390px]:!text-lg
                  sm:!text-xl
                  md:!text-2xl
                "
              >
                {
                  platformNetwork
                    .center
                    .titleLine1
                }

                <br />

                {
                  platformNetwork
                    .center
                    .titleLine2
                }
              </strong>


              <span
                className="
                  !mt-2
                  !gap-1
                  !text-[9px]
                  sm:!text-[10px]
                  md:!text-xs
                "
              >

                <RefreshCw
                  className="
                    !h-3
                    !w-3
                    md:!h-3.5
                    md:!w-3.5
                  "
                />

                {
                  platformNetwork
                    .center
                    .status
                }

              </span>

            </div>


            <div className="platform-network-spinner">

              {
                platforms.map(
                  (
                    platform,
                    index
                  ) => {

                    const angle =
                      index *
                      (
                        360 /
                        platforms.length
                      );


                    return (
                      <div
                        key={
                          platform.name
                        }
                        className="
                          network-orbit-position
                        "
                        style={{
                          transform:
                            `rotate(${angle}deg) translateX(var(--network-orbit-radius))`,
                        }}
                      >

                        {/* Keeps initial position upright */}
                        <div
                          style={{
                            transform:
                              `rotate(-${angle}deg)`,
                          }}
                        >

                          {/* Keeps logo upright during orbit */}
                          <div
                            className="
                              network-logo
                              !h-12
                              !w-12
                              sm:!h-14
                              sm:!w-14
                              md:!h-16
                              md:!w-16
                              lg:!h-[72px]
                              lg:!w-[72px]
                            "
                            style={{
                              cursor:
                                "default",

                              animation:
                                "network-counter-rotation 45s linear infinite",
                            }}
                          >

                            <img
                              src={
                                platform.logo
                              }
                              alt={
                                `${platform.name} logo`
                              }
                              className="
                                !max-h-[60%]
                                !max-w-[72%]
                                object-contain
                              "
                            />

                          </div>

                        </div>

                      </div>
                    );
                  }
                )
              }

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="min-w-0">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-blue-600
                sm:text-sm
                sm:tracking-[0.22em]
                md:tracking-[0.25em]
              "
            >
              {platformNetwork.eyebrow}
            </p>


            <h1
              className="
                mt-4
                break-words
                text-4xl
                font-bold
                leading-[1.04]
                tracking-tight
                text-slate-950
                sm:mt-5
                sm:text-5xl
                md:mt-6
                md:text-6xl
              "
            >
              {platformNetwork.titleLine1}

              <br />

              {platformNetwork.titleLine2}

              <br />

              {platformNetwork.titleLine3}
            </h1>


            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-slate-600
                sm:text-lg
                sm:leading-8
                md:mt-8
                md:text-2xl
                md:leading-10
              "
            >
              {platformNetwork.description}
            </p>


            {/* ==========================================
                PLATFORM LIST
            ========================================== */}

            <div
              className="
                mt-8
                grid
                grid-cols-1
                gap-2.5
                min-[390px]:grid-cols-2
                sm:gap-3
                md:mt-10
              "
            >

              {
                platforms.map(
                  (platform) => (
                    <div
                      key={
                        platform.name
                      }
                      className="
                        min-w-0
                        rounded-xl
                        border
                        border-slate-200
                        bg-white/90
                        px-3
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-700
                        backdrop-blur-sm
                        sm:px-4
                        sm:py-3
                        sm:text-base
                      "
                    >
                      ✓ {platform.name}
                    </div>
                  )
                )
              }

            </div>


            {/* ==========================================
                CALENDAR SYNC
            ========================================== */}

            <div
              className="
                mt-8
                rounded-2xl
                bg-blue-600
                p-5
                text-white
                sm:p-6
                md:mt-10
                md:rounded-3xl
                md:p-8
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                  sm:gap-4
                "
              >

                <CalendarSync
                  className="
                    h-7
                    w-7
                    shrink-0
                    sm:h-8
                    sm:w-8
                    md:h-[34px]
                    md:w-[34px]
                  "
                />


                <h2
                  className="
                    text-xl
                    font-bold
                    leading-tight
                    sm:text-2xl
                  "
                >
                  {
                    platformNetwork
                      .calendarSync
                      .title
                  }
                </h2>

              </div>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-blue-50
                  md:text-lg
                  md:leading-8
                "
              >
                {
                  platformNetwork
                    .calendarSync
                    .description
                }
              </p>

            </div>


            {/* ==========================================
                EXTRA INFORMATION
            ========================================== */}

            <div
              className="
                mt-5
                grid
                gap-4
                sm:mt-6
                md:grid-cols-2
              "
            >

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/90
                  p-5
                  backdrop-blur-sm
                  sm:p-6
                "
              >

                <Globe2
                  size={28}
                  className="text-blue-600"
                />


                <h3
                  className="
                    mt-4
                    text-lg
                    font-bold
                  "
                >
                  {
                    platformNetwork
                      .widerDistribution
                      .title
                  }
                </h3>


                <p
                  className="
                    mt-2
                    leading-7
                    text-slate-600
                  "
                >
                  {
                    platformNetwork
                      .widerDistribution
                      .description
                  }
                </p>

              </div>


              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/90
                  p-5
                  backdrop-blur-sm
                  sm:p-6
                "
              >

                <Layers3
                  size={28}
                  className="text-blue-600"
                />


                <h3
                  className="
                    mt-4
                    text-lg
                    font-bold
                  "
                >
                  {
                    platformNetwork
                      .coordinatedStrategy
                      .title
                  }
                </h3>


                <p
                  className="
                    mt-2
                    leading-7
                    text-slate-600
                  "
                >
                  {
                    platformNetwork
                      .coordinatedStrategy
                      .description
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
