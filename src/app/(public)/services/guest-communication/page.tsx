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

   This Guest Communication service page has now completed:
   - SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / internal-link / conversion review

   Primary commercial intent:
   - Guest communication management
   - Airbnb guest communication
   - Booking.com guest communication
   - Guest messaging and support

   Supporting concepts already represented by
   the visible page:
   - Fast response strategy
   - Pre-arrival communication
   - In-stay support
   - Review intelligence
   - Continuous improvement
   - Better guest experience

   This SERVICE page targets the commercial
   management intent. The Guest Response insight
   page remains focused on response speed,
   communication performance and guest experience,
   reducing keyword cannibalization.

   Remaining long-tail guest communication and
   owner questions will be assigned to Guides /
   Blog in the final keyword coverage map.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   GUEST COMMUNICATION PAGE SEO CONTENT
========================================== */

const guestCommunicationPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Διαχείριση Επικοινωνίας Επισκεπτών Airbnb & Booking.com | HostMetric",
    description:
      "Επαγγελματική διαχείριση επικοινωνίας επισκεπτών για Airbnb, Booking.com και βραχυχρόνιες μισθώσεις, με γρήγορες απαντήσεις, υποστήριξη διαμονής και καλύτερη εμπειρία επισκεπτών.",
  },

  en: {
    title:
      "Airbnb & Booking.com Guest Communication Management | HostMetric",
    description:
      "Professional guest communication management for Airbnb, Booking.com and short-term rentals, with fast responses, pre-arrival messaging, in-stay support and a better guest experience.",
  },

  de: {
    title:
      "Gästekommunikation für Airbnb & Booking.com verwalten | HostMetric",
    description:
      "Professionelles Management der Gästekommunikation für Airbnb, Booking.com und Kurzzeitvermietungen mit schnellen Antworten, Kommunikation vor der Anreise und Betreuung während des Aufenthalts.",
  },

  fr: {
    title:
      "Gestion de la Communication Voyageurs Airbnb & Booking.com | HostMetric",
    description:
      "Gestion professionnelle de la communication voyageurs sur Airbnb, Booking.com et en location courte durée avec réponses rapides, messages avant l’arrivée et assistance pendant le séjour.",
  },

  it: {
    title:
      "Gestione Comunicazione Ospiti Airbnb & Booking.com | HostMetric",
    description:
      "Gestione professionale della comunicazione con gli ospiti su Airbnb, Booking.com e negli affitti brevi, con risposte rapide, messaggi pre-arrivo e supporto durante il soggiorno.",
  },

  es: {
    title:
      "Gestión de Comunicación con Huéspedes Airbnb y Booking.com | HostMetric",
    description:
      "Gestión profesional de la comunicación con huéspedes en Airbnb, Booking.com y alquileres de corta estancia, con respuestas rápidas, mensajes previos a la llegada y asistencia durante la estancia.",
  },

  pt: {
    title:
      "Gestão da Comunicação com Hóspedes Airbnb e Booking.com | HostMetric",
    description:
      "Gestão profissional da comunicação com hóspedes no Airbnb, Booking.com e alojamento de curta duração, com respostas rápidas, mensagens pré-chegada e apoio durante a estadia.",
  },

  bg: {
    title:
      "Управление на комуникацията с гости Airbnb & Booking.com | HostMetric",
    description:
      "Професионално управление на комуникацията с гости в Airbnb, Booking.com и краткосрочни наеми с бързи отговори, съобщения преди пристигане и подкрепа по време на престоя.",
  },

  sr: {
    title:
      "Upravljanje komunikacijom sa gostima Airbnb & Booking.com | HostMetric",
    description:
      "Profesionalno upravljanje komunikacijom sa gostima na Airbnb-u, Booking.com-u i u kratkoročnom najmu uz brze odgovore, poruke pre dolaska i podršku tokom boravka.",
  },

  tr: {
    title:
      "Airbnb & Booking.com Misafir İletişimi Yönetimi | HostMetric",
    description:
      "Airbnb, Booking.com ve kısa süreli kiralamalar için hızlı yanıtlar, varış öncesi mesajlaşma ve konaklama desteğiyle profesyonel misafir iletişimi yönetimi.",
  },

  pl: {
    title:
      "Zarządzanie Komunikacją z Gośćmi Airbnb i Booking.com | HostMetric",
    description:
      "Profesjonalne zarządzanie komunikacją z gośćmi Airbnb, Booking.com i najmu krótkoterminowego: szybkie odpowiedzi, wiadomości przed przyjazdem i wsparcie podczas pobytu.",
  },

  ru: {
    title:
      "Управление общением с гостями Airbnb и Booking.com | HostMetric",
    description:
      "Профессиональное управление общением с гостями Airbnb, Booking.com и краткосрочной аренды: быстрые ответы, сообщения до прибытия, поддержка во время проживания и лучший опыт гостей.",
  },
};


/* ==========================================
   GUEST COMMUNICATION PAGE SEO METADATA
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
    guestCommunicationPageSeo[currentLocale];

  const localizedGuestCommunicationPath =
    getLocalizedPath(
      "/services/guest-communication",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/services/guest-communication",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedGuestCommunicationPath,
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


export default async function GuestCommunicationPage() {

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


  const guestCommunication =
    dictionary.guestCommunicationPage;


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
    `${guestCommunication.titleLine1} ${guestCommunication.titleLine2}`;

  const serviceSchema =
    getServiceSchema({
      name:
        schemaPageName,
      description:
        guestCommunication.description,
      pathname:
        "/services/guest-communication",
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
            "/services/guest-communication",
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
          "linear-gradient(rgba(3, 37, 65, 0.58), rgba(3, 37, 65, 0.68)), url('/services/guest-communication.jpg')",
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
          ← {guestCommunication.back}
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
            {guestCommunication.eyebrow}
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

            {guestCommunication.titleLine1}

            <br />

            {guestCommunication.titleLine2}

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
            {guestCommunication.description}
          </p>


          {/* =================================================
              GUEST COMMUNICATION CARDS
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
                FAST RESPONSE STRATEGY
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
                  guestCommunication.cards
                    .fastResponseStrategy
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
                  guestCommunication.cards
                    .fastResponseStrategy
                    .description
                }
              </p>

            </div>


            {/* =============================================
                PRE-ARRIVAL COMMUNICATION
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
                  guestCommunication.cards
                    .preArrivalCommunication
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
                  guestCommunication.cards
                    .preArrivalCommunication
                    .description
                }
              </p>

            </div>


            {/* =============================================
                IN-STAY SUPPORT
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
                  guestCommunication.cards
                    .inStaySupport
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
                  guestCommunication.cards
                    .inStaySupport
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
                  guestCommunication.cards
                    .reviewIntelligence
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
                  guestCommunication.cards
                    .reviewIntelligence
                    .description
                }
              </p>

            </div>

          </div>


          {/* =================================================
              CONTINUOUS IMPROVEMENT
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
                guestCommunication
                  .continuousImprovement
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
                guestCommunication
                  .continuousImprovement
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
                guestCommunication
                  .continuousImprovement
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
            {guestCommunication.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}
