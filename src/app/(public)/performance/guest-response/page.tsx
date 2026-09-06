import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import AnimatedWave from "@/components/animated-wave";

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

import {
  Clock3,
  MessagesSquare,
  HeartHandshake,
  Star,
} from "lucide-react";


/* ==========================================
   FINAL SEO PASS NOTES

   This Guest Response page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading and internal-link review
   - Conversion CTA review

   Primary intent:
   - Guest communication
   - Fast guest response
   - Guest experience
   - Better guest reviews

   Supporting platform terms:
   - Airbnb
   - Booking.com

   Related long-tail phrases that do not belong
   naturally on this commercial insight page will
   be assigned to Guides / Blog in the final
   keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   GUEST RESPONSE PAGE SEO CONTENT
========================================== */

const guestResponsePageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Επικοινωνία Επισκεπτών Airbnb & Booking.com | HostMetric",
    description:
      "Γρήγορη και φυσική επικοινωνία επισκεπτών για Airbnb, Booking.com και βραχυχρόνιες μισθώσεις. Καλύτερη εξυπηρέτηση, άμεση ανταπόκριση και ισχυρότερες αξιολογήσεις.",
  },

  en: {
    title:
      "Airbnb & Booking.com Guest Communication | HostMetric",
    description:
      "Fast, natural guest communication for Airbnb, Booking.com and short-term rentals. Improve response times, guest experience, issue handling and guest reviews.",
  },

  de: {
    title:
      "Gästekommunikation für Airbnb & Booking.com | HostMetric",
    description:
      "Schnelle, natürliche Gästekommunikation für Airbnb, Booking.com und Kurzzeitvermietungen. Verbessern Sie Reaktionszeiten, Gästeerlebnis, Problemlösung und Bewertungen.",
  },

  fr: {
    title:
      "Communication Voyageurs Airbnb & Booking.com | HostMetric",
    description:
      "Communication rapide et naturelle avec les voyageurs sur Airbnb, Booking.com et en location courte durée pour améliorer les délais de réponse, l’expérience client et les avis.",
  },

  it: {
    title:
      "Comunicazione Ospiti Airbnb & Booking.com | HostMetric",
    description:
      "Comunicazione rapida e naturale con gli ospiti su Airbnb, Booking.com e negli affitti brevi per migliorare tempi di risposta, esperienza, gestione dei problemi e recensioni.",
  },

  es: {
    title:
      "Comunicación con Huéspedes Airbnb y Booking.com | HostMetric",
    description:
      "Comunicación rápida y natural con huéspedes de Airbnb, Booking.com y alquileres de corta estancia para mejorar tiempos de respuesta, experiencia, incidencias y reseñas.",
  },

  pt: {
    title:
      "Comunicação com Hóspedes Airbnb e Booking.com | HostMetric",
    description:
      "Comunicação rápida e natural com hóspedes no Airbnb, Booking.com e alojamento de curta duração para melhorar tempos de resposta, experiência, resolução de problemas e avaliações.",
  },

  bg: {
    title:
      "Комуникация с гости в Airbnb и Booking.com | HostMetric",
    description:
      "Бърза и естествена комуникация с гости в Airbnb, Booking.com и краткосрочни наеми за по-добро време за отговор, обслужване, решаване на проблеми и оценки.",
  },

  sr: {
    title:
      "Komunikacija sa gostima na Airbnb-u i Booking.com-u | HostMetric",
    description:
      "Brza i prirodna komunikacija sa gostima na Airbnb-u, Booking.com-u i u kratkoročnom najmu za bolje vreme odgovora, iskustvo gostiju, rešavanje problema i recenzije.",
  },

  tr: {
    title:
      "Airbnb & Booking.com Misafir İletişimi | HostMetric",
    description:
      "Airbnb, Booking.com ve kısa süreli kiralamalarda hızlı ve doğal misafir iletişimiyle yanıt süresini, misafir deneyimini, sorun çözümünü ve değerlendirmeleri geliştirin.",
  },

  pl: {
    title:
      "Komunikacja z Gośćmi Airbnb i Booking.com | HostMetric",
    description:
      "Szybka i naturalna komunikacja z gośćmi Airbnb, Booking.com oraz najmu krótkoterminowego poprawia czas odpowiedzi, doświadczenie gości, obsługę problemów i opinie.",
  },

  ru: {
    title:
      "Общение с гостями Airbnb и Booking.com | HostMetric",
    description:
      "Быстрое и естественное общение с гостями Airbnb, Booking.com и краткосрочной аренды. Улучшайте скорость ответов, впечатления гостей, решение проблем и отзывы.",
  },
};


/* ==========================================
   GUEST RESPONSE PAGE SEO METADATA
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
    guestResponsePageSeo[currentLocale];


  const localizedGuestResponsePath =
    getLocalizedPath(
      "/performance/guest-response",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/performance/guest-response",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedGuestResponsePath,
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


export default async function GuestResponsePage() {

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


  const guestResponse =
    dictionary.guestResponsePage;


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
    `${guestResponse.titleLine1} ${guestResponse.titleLine2}`;

  const webPageSchema =
    getWebPageSchema({
      name:
        schemaPageName,
      description:
        guestResponse.description,
      pathname:
        "/performance/guest-response",
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
            "/performance/guest-response",
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
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-sky-50
        via-white
        to-blue-100
        text-slate-950
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
          ANIMATED BACKGROUND WAVE
      ====================================================== */}

      <AnimatedWave />


      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
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
            text-blue-600
            transition
            hover:text-blue-800
            sm:text-base
            md:text-lg
          "
        >
          ← {guestResponse.back}
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
              text-blue-600
              sm:text-sm
              sm:tracking-[0.22em]
              md:tracking-[0.25em]
            "
          >
            {guestResponse.eyebrow}
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

            {guestResponse.titleLine1}

            <br />

            {guestResponse.titleLine2}

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
              text-slate-600
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-10
            "
          >
            {guestResponse.description}
          </p>


          {/* =================================================
              GUEST RESPONSE CARDS
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
                CONTINUOUS COVERAGE
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <Clock3
                className="
                  h-8
                  w-8
                  text-blue-600
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .continuousCoverage
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .continuousCoverage
                    .description
                }
              </p>

            </div>


            {/* =============================================
                NATURAL COMMUNICATION
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <MessagesSquare
                className="
                  h-8
                  w-8
                  text-blue-600
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .naturalCommunication
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .naturalCommunication
                    .description
                }
              </p>

            </div>


            {/* =============================================
                HOSPITALITY TRAINING
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <HeartHandshake
                className="
                  h-8
                  w-8
                  text-blue-600
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .hospitalityTraining
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .hospitalityTraining
                    .description
                }
              </p>

            </div>


            {/* =============================================
                BETTER REVIEWS
            ============================================== */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/80
                bg-white/90
                p-5
                shadow-sm
                backdrop-blur-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                lg:p-9
                lg:hover:-translate-y-1
                lg:hover:shadow-lg
              "
            >

              <Star
                className="
                  h-8
                  w-8
                  text-yellow-500
                  sm:h-9
                  sm:w-9
                  md:h-10
                  md:w-10
                "
              />


              <h2
                className="
                  mt-5
                  break-words
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  md:mt-6
                  md:text-3xl
                "
              >
                {
                  guestResponse.cards
                    .betterReviews
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                  sm:mt-5
                  sm:text-lg
                  sm:leading-8
                "
              >
                {
                  guestResponse.cards
                    .betterReviews
                    .description
                }
              </p>

            </div>

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
              bg-blue-600
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-white
              transition
              hover:-translate-y-1
              hover:bg-blue-700
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-8
              sm:py-4
              sm:text-lg
              md:mt-12
            "
          >
            {guestResponse.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
