import type { Metadata } from "next";
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

   This Contact route has now completed:
   - SEO title
   - Meta description
   - Canonical
   - Hreflang
   - X-default
   - Open Graph
   - Twitter metadata
   - Robots index/follow
   - Search-intent / heading structure review
   - Contact-form / internal-link review
   - ContactPage schema
   - BreadcrumbList schema

   FINAL commercial positioning:
   - Property management is the broad authority term.
   - Airbnb and Booking.com are both prominent platform terms.
   - Short-term rental management supports the service intent.
   - Bookings, performance, revenue and profit are supporting benefits.
   - The Contact page remains primarily a conversion / lead-generation page.

   The client page.tsx remains unchanged.

   Do NOT repeat these items in a later pass.

   Still handled separately at project level:
   - sitemap.ts
   - robots.ts
   - Core Web Vitals / performance audit
========================================== */


/* ==========================================
   CONTACT PAGE SEO CONTENT
========================================== */

const contactPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Επικοινωνία | Διαχείριση Ακινήτων, Airbnb & Booking.com | HostMetric",
    description:
      "Επικοινωνήστε με τη HostMetric για επαγγελματική διαχείριση ακινήτων, Airbnb, Booking.com και βραχυχρόνιων μισθώσεων. Συζητήστε πώς μπορούμε να αυξήσουμε κρατήσεις, απόδοση, έσοδα και κέρδη του ακινήτου σας.",
  },

  en: {
    title:
      "Contact HostMetric | Property, Airbnb & Booking.com Management",
    description:
      "Contact HostMetric about professional property, Airbnb, Booking.com and short-term rental management. Tell us about your property and explore ways to increase bookings, improve performance and maximize rental revenue and profits.",
  },

  de: {
    title:
      "Kontakt | Immobilien-, Airbnb- & Booking.com-Management | HostMetric",
    description:
      "Kontaktieren Sie HostMetric für professionelles Immobilien-, Airbnb-, Booking.com- und Kurzzeitvermietungsmanagement. Erfahren Sie, wie sich Buchungen, Performance, Mieteinnahmen und Rentabilität Ihrer Immobilie steigern lassen.",
  },

  fr: {
    title:
      "Contact | Gestion de Biens, Airbnb & Booking.com | HostMetric",
    description:
      "Contactez HostMetric pour une gestion professionnelle de biens, Airbnb, Booking.com et locations courte durée. Découvrez comment augmenter les réservations, les performances, les revenus et la rentabilité de votre bien.",
  },

  it: {
    title:
      "Contatti | Gestione Immobili, Airbnb & Booking.com | HostMetric",
    description:
      "Contatta HostMetric per la gestione professionale di immobili, Airbnb, Booking.com e affitti brevi. Scopri come aumentare prenotazioni, performance, ricavi e redditività del tuo immobile.",
  },

  es: {
    title:
      "Contacto | Gestión de Propiedades, Airbnb y Booking.com | HostMetric",
    description:
      "Contacta con HostMetric para la gestión profesional de propiedades, Airbnb, Booking.com y alquileres de corta estancia. Descubre cómo aumentar reservas, rendimiento, ingresos y rentabilidad.",
  },

  pt: {
    title:
      "Contacto | Gestão de Imóveis, Airbnb e Booking.com | HostMetric",
    description:
      "Contacte a HostMetric para gestão profissional de imóveis, Airbnb, Booking.com e alojamento de curta duração. Descubra como aumentar reservas, desempenho, receitas e rentabilidade do seu imóvel.",
  },

  bg: {
    title:
      "Контакти | Управление на имоти, Airbnb и Booking.com | HostMetric",
    description:
      "Свържете се с HostMetric за професионално управление на имоти, Airbnb, Booking.com и краткосрочни наеми. Разберете как да увеличите резервациите, ефективността, приходите и рентабилността на имота си.",
  },

  sr: {
    title:
      "Kontakt | Upravljanje nekretninama, Airbnb i Booking.com | HostMetric",
    description:
      "Kontaktirajte HostMetric za profesionalno upravljanje nekretninama, Airbnb-om, Booking.com-om i kratkoročnim najmom. Saznajte kako da povećate rezervacije, učinak, prihode i profitabilnost svoje nekretnine.",
  },

  tr: {
    title:
      "İletişim | Mülk, Airbnb ve Booking.com Yönetimi | HostMetric",
    description:
      "Profesyonel mülk, Airbnb, Booking.com ve kısa süreli kiralama yönetimi için HostMetric ile iletişime geçin. Rezervasyonları, performansı, kira gelirini ve kârlılığı artırma fırsatlarını değerlendirelim.",
  },

  pl: {
    title:
      "Kontakt | Zarządzanie Nieruchomościami, Airbnb i Booking.com | HostMetric",
    description:
      "Skontaktuj się z HostMetric w sprawie profesjonalnego zarządzania nieruchomościami, Airbnb, Booking.com i najmem krótkoterminowym. Sprawdź, jak zwiększyć rezerwacje, wyniki, przychody i rentowność.",
  },

  ru: {
    title:
      "Контакты | Управление недвижимостью, Airbnb и Booking.com | HostMetric",
    description:
      "Свяжитесь с HostMetric по вопросам профессионального управления недвижимостью, Airbnb, Booking.com и краткосрочной арендой. Обсудим, как увеличить бронирования, улучшить эффективность, повысить доход и прибыльность вашего объекта.",
  },
};


/* ==========================================
   CONTACT PAGE SEO METADATA
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
    contactPageSeo[currentLocale];


  const localizedContactPath =
    getLocalizedPath(
      "/contact",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/contact",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedContactPath,
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


/* ==========================================
   CONTACT ROUTE LAYOUT
========================================== */

export default async function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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


  const dictionary =
    await getDictionary(
      currentLocale
    );

  const contactPage =
    (dictionary as any)
      .contactPage;


  const webPageSchema =
    getWebPageSchema({
      type:
        "ContactPage",
      name:
        contactPage.hero.title,
      description:
        contactPage.hero.description,
      pathname:
        "/contact",
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
            contactPage.hero.title,
          pathname:
            "/contact",
        },
      ],
      locale:
        currentLocale,
    });


  return (
    <>
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

      {children}
    </>
  );
}