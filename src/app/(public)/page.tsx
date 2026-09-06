import type { Metadata } from "next";
import { cookies } from "next/headers";

import Hero from "@/components/hero";
import Services from "@/components/services";
import Performance from "@/components/performance";
import HowItWorks from "@/components/how-it-works";
import PlatformOrbit from "@/components/platform-orbit";
import PropertyGrowth from "@/components/property-growth";
import FeaturedResults from "@/components/featured-results";

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
  getWebPageSchema,
  serializeJsonLd,
} from "@/seo/schema";


/* ==========================================
   FINAL SEO PASS — REVISED HOMEPAGE

   This homepage now targets the broad commercial
   authority cluster for HostMetric:

   - Property Management
   - Airbnb Management
   - Booking.com Management
   - Short-Term Rental Management
   - Smart / Dynamic Pricing
   - Guest Communication
   - Multi-platform Distribution
   - More Bookings
   - Higher Occupancy
   - Higher Rental Revenue

   Airbnb and Booking.com are intentionally given
   strong, co-equal visibility.

   Geographic strategy:
   - Cyprus is retained where commercially relevant.
   - English remains especially important for Cyprus.
   - Greek remains important for Greek-speaking users
     in both Cyprus and Greece.
   - We avoid stuffing Greece + Cyprus into every title.

   Still handled separately at project level:
   - sitemap.ts
   - robots.ts
   - Organization / WebSite schema
   - Core Web Vitals / performance audit
   - final indexability / internal-link audit
========================================== */


/* ==========================================
   HOMEPAGE SEO CONTENT
========================================== */

const homepageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Διαχείριση Ακινήτων, Airbnb & Booking.com στην Κύπρο | HostMetric",
    description:
      "Επαγγελματική διαχείριση ακινήτων, Airbnb, Booking.com και βραχυχρόνιων μισθώσεων με έξυπνη τιμολόγηση, περισσότερες κρατήσεις, υψηλότερη πληρότητα και μεγιστοποίηση εσόδων.",
  },

  en: {
    title:
      "Property, Airbnb & Booking.com Management Cyprus | HostMetric",
    description:
      "Professional property, Airbnb, Booking.com and short-term rental management in Cyprus with smart pricing, guest communication and multi-platform distribution to increase bookings, occupancy and rental revenue.",
  },

  de: {
    title:
      "Immobilien-, Airbnb- & Booking.com-Management in Zypern | HostMetric",
    description:
      "Professionelles Immobilien-, Airbnb-, Booking.com- und Kurzzeitvermietungsmanagement in Zypern mit intelligenter Preisgestaltung, Gästekommunikation und Multichannel-Distribution für mehr Buchungen, Auslastung und Einnahmen.",
  },

  fr: {
    title:
      "Gestion de Biens, Airbnb & Booking.com à Chypre | HostMetric",
    description:
      "Gestion professionnelle de biens, Airbnb, Booking.com et locations courte durée à Chypre avec tarification intelligente, communication voyageurs et diffusion multicanale pour augmenter réservations, occupation et revenus.",
  },

  it: {
    title:
      "Gestione Proprietà, Airbnb & Booking.com a Cipro | HostMetric",
    description:
      "Gestione professionale di proprietà, Airbnb, Booking.com e affitti brevi a Cipro con prezzi intelligenti, comunicazione con gli ospiti e distribuzione multicanale per aumentare prenotazioni, occupazione e ricavi.",
  },

  es: {
    title:
      "Gestión de Propiedades, Airbnb & Booking.com en Chipre | HostMetric",
    description:
      "Gestión profesional de propiedades, Airbnb, Booking.com y alquileres de corta estancia en Chipre con precios inteligentes, atención al huésped y distribución multicanal para aumentar reservas, ocupación e ingresos.",
  },

  pt: {
    title:
      "Gestão de Imóveis, Airbnb & Booking.com em Chipre | HostMetric",
    description:
      "Gestão profissional de imóveis, Airbnb, Booking.com e alojamento de curta duração em Chipre com preços inteligentes, comunicação com hóspedes e distribuição multicanal para aumentar reservas, ocupação e receitas.",
  },

  bg: {
    title:
      "Управление на имоти, Airbnb & Booking.com в Кипър | HostMetric",
    description:
      "Професионално управление на имоти, Airbnb, Booking.com и краткосрочни наеми в Кипър с интелигентно ценообразуване, комуникация с гости и многоканална дистрибуция за повече резервации, заетост и приходи.",
  },

  sr: {
    title:
      "Upravljanje nekretninama, Airbnb & Booking.com na Kipru | HostMetric",
    description:
      "Profesionalno upravljanje nekretninama, Airbnb-om, Booking.com-om i kratkoročnim najmom na Kipru uz pametno formiranje cena, komunikaciju sa gostima i distribuciju na više kanala za više rezervacija, popunjenosti i prihoda.",
  },

  tr: {
    title:
      "Kıbrıs Mülk, Airbnb & Booking.com Yönetimi | HostMetric",
    description:
      "Kıbrıs'ta profesyonel mülk, Airbnb, Booking.com ve kısa süreli kiralama yönetimi; akıllı fiyatlandırma, misafir iletişimi ve çok kanallı dağıtımla rezervasyon, doluluk ve geliri artırın.",
  },

  pl: {
    title:
      "Zarządzanie Nieruchomościami, Airbnb & Booking.com na Cyprze | HostMetric",
    description:
      "Profesjonalne zarządzanie nieruchomościami, Airbnb, Booking.com i najmem krótkoterminowym na Cyprze z inteligentnymi cenami, obsługą gości i dystrybucją wielokanałową dla większej liczby rezerwacji, obłożenia i przychodów.",
  },

  ru: {
    title:
      "Управление недвижимостью, Airbnb & Booking.com на Кипре | HostMetric",
    description:
      "Профессиональное управление недвижимостью, Airbnb, Booking.com и краткосрочной арендой на Кипре с умным ценообразованием, коммуникацией с гостями и мультиканальной дистрибуцией для роста бронирований, заполняемости и дохода.",
  },
};


/* ==========================================
   HOMEPAGE SEO METADATA
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
    homepageSeo[currentLocale];


  const localizedHomepagePath =
    getLocalizedPath(
      "/",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/",
        currentLocale
      ),

    openGraph: {
      type: "website",
      url:
        localizedHomepagePath,
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
   HOMEPAGE
========================================== */

export default async function Home() {
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
    homepageSeo[currentLocale];

  const webPageSchema =
    getWebPageSchema({
      name:
        seo.title,
      description:
        seo.description,
      pathname:
        "/",
      locale:
        currentLocale,
    });

  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              webPageSchema
            ),
        }}
      />

      <Hero />
      <Services />
      <Performance />
      <HowItWorks />
      <PlatformOrbit />
      <PropertyGrowth />
      <FeaturedResults />
    </main>
  );
}