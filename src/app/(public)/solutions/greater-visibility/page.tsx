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

   This Greater Visibility service page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / crawlability review

   Primary commercial intent:
   - Greater property visibility
   - Increase Airbnb & Booking.com bookings
   - Short-term rental visibility
   - Channel performance

   Supporting visible concepts:
   - Channel performance
   - Net revenue analysis
   - Demand positioning
   - Professional revenue logic

   Smarter Distribution remains focused on
   distribution strategy, while Platform Network
   remains focused on the wider channel network.
   Long-tail visibility queries remain reserved
   for Guides / Blog in the keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */

const greaterVisibilityPageSeo: Record<
  Locale,
  { title: string; description: string }
> = {
  el: {
    title: "Μεγαλύτερη Προβολή & Περισσότερες Κρατήσεις | HostMetric",
    description: "Αυξήστε την προβολή και τις κρατήσεις του ακινήτου σας σε Airbnb, Booking.com και βραχυχρόνιες μισθώσεις με ανάλυση καναλιών, ζήτησης και καθαρών εσόδων.",
  },
  en: {
    title: "Greater Visibility & More Airbnb and Booking.com Bookings | HostMetric",
    description: "Increase property visibility and booking opportunities across Airbnb, Booking.com and short-term rental channels using channel performance, demand positioning and net revenue insights.",
  },
  de: {
    title: "Mehr Sichtbarkeit & Buchungen auf Airbnb und Booking.com | HostMetric",
    description: "Steigern Sie Sichtbarkeit und Buchungschancen Ihrer Unterkunft auf Airbnb, Booking.com und Kurzzeitmietkanälen durch Kanalperformance, Nachfragepositionierung und Nettoerlösanalysen.",
  },
  fr: {
    title: "Plus de Visibilité & Réservations Airbnb et Booking.com | HostMetric",
    description: "Augmentez la visibilité et les opportunités de réservation sur Airbnb, Booking.com et les canaux de location courte durée grâce à l’analyse des canaux, de la demande et des revenus nets.",
  },
  it: {
    title: "Più Visibilità & Prenotazioni su Airbnb e Booking.com | HostMetric",
    description: "Aumenta la visibilità e le opportunità di prenotazione su Airbnb, Booking.com e nei canali di affitto breve con analisi delle performance, della domanda e dei ricavi netti.",
  },
  es: {
    title: "Más Visibilidad & Reservas en Airbnb y Booking.com | HostMetric",
    description: "Aumenta la visibilidad y las oportunidades de reserva en Airbnb, Booking.com y canales de alquiler de corta estancia mediante análisis de canales, demanda e ingresos netos.",
  },
  pt: {
    title: "Mais Visibilidade & Reservas no Airbnb e Booking.com | HostMetric",
    description: "Aumente a visibilidade e as oportunidades de reserva no Airbnb, Booking.com e canais de alojamento de curta duração com análise de canais, procura e receitas líquidas.",
  },
  bg: {
    title: "Повече видимост & резервации в Airbnb и Booking.com | HostMetric",
    description: "Увеличете видимостта и възможностите за резервации в Airbnb, Booking.com и каналите за краткосрочни наеми чрез анализ на каналите, търсенето и нетните приходи.",
  },
  sr: {
    title: "Veća vidljivost & više rezervacija na Airbnb-u i Booking.com-u | HostMetric",
    description: "Povećajte vidljivost objekta i prilike za rezervacije na Airbnb-u, Booking.com-u i kanalima kratkoročnog najma analizom performansi kanala, potražnje i neto prihoda.",
  },
  tr: {
    title: "Airbnb ve Booking.com'da Daha Fazla Görünürlük & Rezervasyon | HostMetric",
    description: "Kanal performansı, talep konumlandırması ve net gelir analizleriyle Airbnb, Booking.com ve kısa süreli kiralama kanallarında görünürlüğü ve rezervasyon fırsatlarını artırın.",
  },
  pl: {
    title: "Większa Widoczność & Więcej Rezerwacji Airbnb i Booking.com | HostMetric",
    description: "Zwiększ widoczność obiektu i szanse na rezerwacje w Airbnb, Booking.com i kanałach najmu krótkoterminowego dzięki analizie kanałów, popytu i przychodów netto.",
  },
  ru: {
    title: "Больше видимости и бронирований на Airbnb и Booking.com | HostMetric",
    description: "Увеличьте видимость объекта и возможности бронирования на Airbnb, Booking.com и каналах краткосрочной аренды благодаря анализу эффективности каналов, спроса и чистого дохода.",
  },
};

/* ==========================================
   GREATER VISIBILITY PAGE SEO METADATA
========================================== */

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const seo = greaterVisibilityPageSeo[currentLocale];
  const localizedGreaterVisibilityPath = getLocalizedPath(
    "/solutions/greater-visibility",
    currentLocale
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: getLocalizedAlternates(
      "/solutions/greater-visibility",
      currentLocale
    ),
    openGraph: {
      type: "website",
      url: localizedGreaterVisibilityPath,
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


export default async function GreaterVisibilityPage() {

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


  const greaterVisibility =
    dictionary.greaterVisibilityPage;


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
        greaterVisibility.title,
      description:
        greaterVisibility.description,
      pathname:
        "/solutions/greater-visibility",
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
            greaterVisibility.title,
          pathname:
            "/solutions/greater-visibility",
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
          GREATER VISIBILITY HERO / CONTENT SECTION
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
            "url('/details/visibility.jpg')",
        }}
      >

        {/* ===================================================
            DARK BACKGROUND OVERLAY

            Slightly stronger on very small screens so text
            remains readable over the background photograph.
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
            ← {greaterVisibility.back}
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
              {greaterVisibility.eyebrow}
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
              {greaterVisibility.title}
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
              {greaterVisibility.description}
            </p>


            {/* =================================================
                VISIBILITY INSIGHT CARDS
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
                  CHANNEL PERFORMANCE
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
                    greaterVisibility.cards
                      .channelPerformance
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
                    greaterVisibility.cards
                      .channelPerformance
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  NET REVENUE ANALYSIS
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
                    greaterVisibility.cards
                      .netRevenueAnalysis
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
                    greaterVisibility.cards
                      .netRevenueAnalysis
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  DEMAND POSITIONING
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
                    greaterVisibility.cards
                      .demandPositioning
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
                    greaterVisibility.cards
                      .demandPositioning
                      .description
                  }
                </p>

              </div>


              {/* ===========================================
                  PROFESSIONAL REVENUE LOGIC
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
                    greaterVisibility.cards
                      .professionalRevenueLogic
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
                    greaterVisibility.cards
                      .professionalRevenueLogic
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
