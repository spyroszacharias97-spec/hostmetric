import type { Metadata } from "next";

import AnimatedWave from "@/components/animated-wave";
import OnboardingForm from "@/components/onboarding-form";

import { auth } from "@/auth";
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

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";


/* =========================================================
   FINAL SEO PASS NOTES

   This Get Started page has now completed:
   - SEO title
   - Meta description
   - Canonical
   - Hreflang
   - X-default
   - Open Graph
   - Twitter metadata
   - Robots index/follow
   - Search-intent / heading structure review
   - Conversion / onboarding-flow review

   FINAL commercial positioning:
   - Conversion / owner-intent page.
   - Property management is the broad authority term.
   - Airbnb and Booking.com are both prominent platform terms.
   - Short-term rental management supports the service intent.
   - Bookings, occupancy, revenue and profitability are supporting benefits.
   - Admin authentication, database lookup and onboarding logic remain untouched.

   Do NOT repeat these items in a later pass.

   Still handled separately at project level:
   - sitemap.ts
   - robots.ts
   - Organization / WebSite schema
   - Core Web Vitals / performance audit
========================================================= */


/* =========================================================
   GET STARTED PAGE SEO CONTENT
========================================================= */

const getStartedPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Ξεκινήστε | Διαχείριση Ακινήτων, Airbnb & Booking.com | HostMetric",
    description:
      "Ξεκινήστε με τη HostMetric για επαγγελματική διαχείριση ακινήτων, Airbnb, Booking.com και βραχυχρόνιων μισθώσεων. Μοιραστείτε τα στοιχεία του ακινήτου σας και δείτε πώς μπορούμε να αυξήσουμε κρατήσεις, πληρότητα, έσοδα και κερδοφορία.",
  },

  en: {
    title:
      "Get Started | Property, Airbnb & Booking.com Management | HostMetric",
    description:
      "Get started with HostMetric for professional property, Airbnb, Booking.com and short-term rental management. Tell us about your property and explore ways to increase bookings, occupancy, revenue and profitability.",
  },

  de: {
    title:
      "Jetzt starten | Immobilien-, Airbnb- & Booking.com-Management | HostMetric",
    description:
      "Starten Sie mit HostMetric für professionelles Immobilien-, Airbnb-, Booking.com- und Kurzzeitvermietungsmanagement. Teilen Sie uns Ihre Immobiliendaten mit und entdecken Sie Möglichkeiten für mehr Buchungen, Auslastung, Umsatz und Rentabilität.",
  },

  fr: {
    title:
      "Commencer | Gestion de Biens, Airbnb & Booking.com | HostMetric",
    description:
      "Commencez avec HostMetric pour la gestion professionnelle de biens, Airbnb, Booking.com et locations courte durée. Présentez votre bien et découvrez comment augmenter les réservations, le taux d’occupation, les revenus et la rentabilité.",
  },

  it: {
    title:
      "Inizia | Gestione Immobili, Airbnb & Booking.com | HostMetric",
    description:
      "Inizia con HostMetric per la gestione professionale di immobili, Airbnb, Booking.com e affitti brevi. Parlaci del tuo immobile e scopri come aumentare prenotazioni, occupazione, ricavi e redditività.",
  },

  es: {
    title:
      "Empieza | Gestión de Propiedades, Airbnb y Booking.com | HostMetric",
    description:
      "Empieza con HostMetric para la gestión profesional de propiedades, Airbnb, Booking.com y alquileres de corta estancia. Cuéntanos sobre tu propiedad y descubre cómo aumentar reservas, ocupación, ingresos y rentabilidad.",
  },

  pt: {
    title:
      "Começar | Gestão de Imóveis, Airbnb e Booking.com | HostMetric",
    description:
      "Comece com a HostMetric para gestão profissional de imóveis, Airbnb, Booking.com e alojamento de curta duração. Fale-nos do seu imóvel e descubra como aumentar reservas, ocupação, receitas e rentabilidade.",
  },

  bg: {
    title:
      "Започнете | Управление на имоти, Airbnb и Booking.com | HostMetric",
    description:
      "Започнете с HostMetric за професионално управление на имоти, Airbnb, Booking.com и краткосрочни наеми. Разкажете ни за имота си и вижте как можем да увеличим резервациите, заетостта, приходите и рентабилността.",
  },

  sr: {
    title:
      "Započnite | Upravljanje nekretninama, Airbnb i Booking.com | HostMetric",
    description:
      "Započnite sa HostMetric-om za profesionalno upravljanje nekretninama, Airbnb-om, Booking.com-om i kratkoročnim najmom. Predstavite nam svoju nekretninu i saznajte kako da povećate rezervacije, popunjenost, prihode i profitabilnost.",
  },

  tr: {
    title:
      "Başlayın | Mülk, Airbnb ve Booking.com Yönetimi | HostMetric",
    description:
      "Profesyonel mülk, Airbnb, Booking.com ve kısa süreli kiralama yönetimi için HostMetric ile başlayın. Mülkünüzü anlatın; rezervasyon, doluluk, gelir ve kârlılığı artırma fırsatlarını değerlendirelim.",
  },

  pl: {
    title:
      "Zacznij | Zarządzanie Nieruchomościami, Airbnb i Booking.com | HostMetric",
    description:
      "Zacznij z HostMetric w zakresie profesjonalnego zarządzania nieruchomościami, Airbnb, Booking.com i najmem krótkoterminowym. Opowiedz nam o swojej nieruchomości i sprawdź, jak zwiększyć rezerwacje, obłożenie, przychody i rentowność.",
  },

  ru: {
    title:
      "Начать | Управление недвижимостью, Airbnb и Booking.com | HostMetric",
    description:
      "Начните работу с HostMetric для профессионального управления недвижимостью, Airbnb, Booking.com и краткосрочной арендой. Расскажите нам о своём объекте и узнайте, как увеличить бронирования, заполняемость, доход и прибыльность.",
  },
};


/* =========================================================
   GET STARTED PAGE SEO METADATA
========================================================= */

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
    getStartedPageSeo[currentLocale];


  const localizedGetStartedPath =
    getLocalizedPath(
      "/get-started",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/get-started",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedGetStartedPath,
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


/* =========================================================
   TYPES
========================================================= */

type PageSearchParams = {
  admin?: string | string[];
  contactId?: string | string[];
};


type InitialContact = {
  contactId: number;
  fullName: string | null;
  email: string;
  phone: string | null;
};


/* =========================================================
   DATABASE
========================================================= */

function getSql() {

  const databaseUrl =
    process.env.DATABASE_URL;


  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing."
    );
  }


  return neon(
    databaseUrl
  );
}


/* =========================================================
   SEARCH PARAM HELPERS
========================================================= */

function getSingleSearchParam(
  value:
    | string
    | string[]
    | undefined
) {

  if (
    Array.isArray(value)
  ) {
    return value[0] ?? "";
  }


  return value ?? "";
}


/* =========================================================
   ADMIN CONTACT LOOKUP
========================================================= */

async function getAdminInitialContact(
  contactId: number
): Promise<InitialContact | null> {

  const sql =
    getSql();


  const rows =
    await sql`
      SELECT
        id,
        full_name,
        email,
        phone
      FROM contacts
      WHERE id = ${contactId}
      LIMIT 1;
    `;


  if (
    rows.length === 0
  ) {
    return null;
  }


  const row =
    rows[0];


  return {
    contactId:
      Number(
        row.id
      ),

    fullName:
      row.full_name
        ? String(
            row.full_name
          )
        : null,

    email:
      String(
        row.email
      ),

    phone:
      row.phone
        ? String(
            row.phone
          )
        : null,
  };
}


/* =========================================================
   GET STARTED PAGE
========================================================= */

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams:
    Promise<PageSearchParams>;
}) {

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
     PAGE SEARCH PARAMETERS
  ========================================== */

  const params =
    await searchParams;


  const adminMode =
    getSingleSearchParam(
      params.admin
    ) === "1";


  const contactIdValue =
    getSingleSearchParam(
      params.contactId
    );


  let initialContact:
    | InitialContact
    | null =
      null;


  let adminContactId:
    | number
    | null =
      null;


  /* ==========================================
     ADMIN MODE
  ========================================== */

  if (
    adminMode
  ) {

    const session =
      await auth();


    if (
      !session?.user?.email
    ) {

      redirect(
        `/admin/login?callbackUrl=${encodeURIComponent(
          `/get-started?admin=1&contactId=${contactIdValue}`
        )}`
      );

    }


    adminContactId =
      Number(
        contactIdValue
      );


    if (
      !Number.isInteger(
        adminContactId
      ) ||
      adminContactId < 1
    ) {
      notFound();
    }


    initialContact =
      await getAdminInitialContact(
        adminContactId
      );


    if (
      !initialContact
    ) {
      notFound();
    }

  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  const getStarted =
    dictionary.getStartedPage;


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const webPageSchema =
    getWebPageSchema({
      name:
        getStarted.hero.title,
      description:
        getStarted.hero.description,
      pathname:
        "/get-started",
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
            getStarted.hero.title,
          pathname:
            "/get-started",
        },
      ],
      locale:
        currentLocale,
    });


  /* =========================================================
     RESPONSIVE PAGE

     The OnboardingForm component keeps its own internal
     responsive layout. This page controls the outer shell,
     hero spacing, typography and safe mobile width.
  ========================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-b
        from-sky-50
        via-white
        to-white
        px-4
        py-14
        sm:px-6
        sm:py-16
        md:px-8
        md:py-20
        lg:px-10
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
          BACKGROUND WAVE
      ========================================== */}

      <AnimatedWave />


      {/* ==========================================
          PAGE CONTENT
      ========================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          min-w-0
          max-w-7xl
        "
      >

        {/* ========================================
            HERO
        ======================================== */}

        <div
          className="
            mx-auto
            mb-9
            max-w-4xl
            px-0
            text-center
            sm:mb-11
            sm:px-2
            md:mb-14
          "
        >

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.2em]
              md:tracking-[0.25em]
            "
          >
            {getStarted.hero.eyebrow}
          </p>


          <h1
            className="
              mt-4
              break-words
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              min-[390px]:text-[2.7rem]
              sm:mt-5
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            {getStarted.hero.title}
          </h1>


          <p
            className="
              mx-auto
              mt-5
              max-w-3xl
              text-base
              leading-7
              text-slate-600
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-7
              md:text-xl
              md:leading-9
            "
          >
            {getStarted.hero.description}
          </p>

        </div>


        {/* ========================================
            ONBOARDING FORM

            Public mode:
            - standard onboarding flow

            Admin mode:
            - authenticated admin flow
            - existing contact can be prefilled
            - return path remains unchanged
        ======================================== */}

        <div
          className="
            w-full
            min-w-0
          "
        >

          <OnboardingForm
            dictionary={
              dictionary.onboardingForm
            }

            adminMode={
              adminMode
            }

            adminContactId={
              adminContactId
            }

            initialContact={
              initialContact
            }

            returnTo={
              adminContactId
                ? `/admin/leads/${adminContactId}`
                : undefined
            }
          />

        </div>

      </div>

    </main>
  );
}
