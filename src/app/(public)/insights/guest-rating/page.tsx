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

   This Guest Rating page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading and internal-link review

   Primary intent:
   Guest ratings, guest reviews and guest experience.
   Response time, issue resolution and review intelligence
   support the page intent. Airbnb and Booking.com are
   included naturally without competing with broader
   property-management pages.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   GUEST RATING PAGE SEO CONTENT
========================================== */

const guestRatingPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Καλύτερες Αξιολογήσεις Επισκεπτών για Airbnb & Booking.com | HostMetric",
    description:
      "Βελτιώστε τις αξιολογήσεις και την εμπειρία επισκεπτών σε Airbnb και Booking.com με γρήγορη επικοινωνία, επίλυση προβλημάτων, ανάλυση κριτικών και συνεχή βελτιστοποίηση.",
  },

  en: {
    title:
      "Better Guest Ratings for Airbnb & Booking.com | HostMetric",
    description:
      "Improve guest ratings and guest experience on Airbnb and Booking.com through faster communication, issue resolution, review intelligence and continuous optimization.",
  },

  de: {
    title:
      "Bessere Gästebewertungen auf Airbnb & Booking.com | HostMetric",
    description:
      "Verbessern Sie Gästebewertungen und das Gästeerlebnis auf Airbnb und Booking.com durch schnelle Kommunikation, Problemlösung, Bewertungsanalyse und kontinuierliche Optimierung.",
  },

  fr: {
    title:
      "Meilleures Notes Clients sur Airbnb & Booking.com | HostMetric",
    description:
      "Améliorez les notes et l’expérience client sur Airbnb et Booking.com grâce à une communication rapide, la résolution des problèmes, l’analyse des avis et l’optimisation continue.",
  },

  it: {
    title:
      "Migliori Recensioni Ospiti su Airbnb & Booking.com | HostMetric",
    description:
      "Migliora le valutazioni e l’esperienza degli ospiti su Airbnb e Booking.com con comunicazione rapida, risoluzione dei problemi, analisi delle recensioni e ottimizzazione continua.",
  },

  es: {
    title:
      "Mejores Valoraciones en Airbnb y Booking.com | HostMetric",
    description:
      "Mejora las valoraciones y la experiencia de los huéspedes en Airbnb y Booking.com mediante comunicación rápida, resolución de incidencias, análisis de reseñas y optimización continua.",
  },

  pt: {
    title:
      "Melhores Avaliações no Airbnb e Booking.com | HostMetric",
    description:
      "Melhore as avaliações e a experiência dos hóspedes no Airbnb e Booking.com com comunicação rápida, resolução de problemas, análise de comentários e otimização contínua.",
  },

  bg: {
    title:
      "По-добри оценки от гости в Airbnb и Booking.com | HostMetric",
    description:
      "Подобрете оценките и изживяването на гостите в Airbnb и Booking.com чрез бърза комуникация, решаване на проблеми, анализ на отзиви и постоянна оптимизация.",
  },

  sr: {
    title:
      "Bolje ocene gostiju na Airbnb-u i Booking.com-u | HostMetric",
    description:
      "Poboljšajte ocene i iskustvo gostiju na Airbnb-u i Booking.com-u kroz brzu komunikaciju, rešavanje problema, analizu recenzija i kontinuiranu optimizaciju.",
  },

  tr: {
    title:
      "Airbnb & Booking.com'da Daha İyi Misafir Puanları | HostMetric",
    description:
      "Hızlı iletişim, sorun çözümü, yorum analizi ve sürekli optimizasyon ile Airbnb ve Booking.com'daki misafir puanlarını ve misafir deneyimini geliştirin.",
  },

  pl: {
    title:
      "Lepsze Oceny Gości na Airbnb i Booking.com | HostMetric",
    description:
      "Popraw oceny i doświadczenia gości na Airbnb i Booking.com dzięki szybkiej komunikacji, rozwiązywaniu problemów, analizie opinii i ciągłej optymalizacji.",
  },

  ru: {
    title:
      "Лучшие оценки гостей на Airbnb и Booking.com | HostMetric",
    description:
      "Улучшайте оценки и впечатления гостей на Airbnb и Booking.com благодаря быстрой коммуникации, решению проблем, анализу отзывов и постоянной оптимизации.",
  },
};


/* ==========================================
   GUEST RATING PAGE SEO METADATA
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
    guestRatingPageSeo[currentLocale];


  const localizedGuestRatingPath =
    getLocalizedPath(
      "/insights/guest-rating",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/insights/guest-rating",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedGuestRatingPath,
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


export default async function GuestRatingPage() {

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


  const guestRating =
    dictionary.guestRatingPage;


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
    `${guestRating.titleLine1} ${guestRating.titleLine2}`;

  const webPageSchema =
    getWebPageSchema({
      name:
        schemaPageName,
      description:
        guestRating.description,
      pathname:
        "/insights/guest-rating",
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
            "/insights/guest-rating",
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
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.82)), url('/insights/guest-rating.jpg')",
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
          ← {guestRating.back}
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
            {guestRating.eyebrow}
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

            {guestRating.titleLine1}

            <br />

            {guestRating.titleLine2}

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
            {guestRating.description}
          </p>


          {/* =================================================
              INSIGHT CARDS
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
                RESPONSE TIME
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
                  guestRating.cards
                    .responseTime
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  guestRating.cards
                    .responseTime
                    .description
                }
              </p>

            </div>


            {/* =============================================
                ISSUE RESOLUTION
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
                  guestRating.cards
                    .issueResolution
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  guestRating.cards
                    .issueResolution
                    .description
                }
              </p>

            </div>


            {/* =============================================
                REVIEW INTELLIGENCE
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
                  guestRating.cards
                    .reviewIntelligence
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  guestRating.cards
                    .reviewIntelligence
                    .description
                }
              </p>

            </div>


            {/* =============================================
                CONTINUOUS IMPROVEMENT
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
                  guestRating.cards
                    .continuousImprovement
                    .title
                }
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-gray-300
                  sm:text-lg
                  sm:leading-8
                  md:mt-5
                "
              >
                {
                  guestRating.cards
                    .continuousImprovement
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
