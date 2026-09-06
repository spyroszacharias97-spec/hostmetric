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
  BrainCircuit,
  BarChart3,
  HeartHandshake,
  Users,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  LineChart,
} from "lucide-react";


/* ==========================================
   FINAL SEO PASS NOTES

   This About page has now completed:
   - SEO title
   - Meta description
   - Canonical
   - Hreflang
   - X-default
   - Open Graph
   - Twitter metadata
   - Robots index/follow
   - Search-intent / heading structure review
   - Internal-link review

   FINAL commercial positioning:
   - Property management is the broad authority term.
   - Airbnb and Booking.com are both prominent platform terms.
   - Short-term rental management supports the service intent.
   - Revenue, bookings and performance are supporting benefits.
   - The About page remains primarily a brand / trust page.

   Do NOT repeat these items in a later pass.

   Still handled separately at project level:
   - sitemap.ts
   - robots.ts
   - Organization / WebSite schema
   - Core Web Vitals / performance audit
========================================== */


/* ==========================================
   ABOUT PAGE SEO CONTENT
========================================== */

const aboutPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Σχετικά με τη HostMetric | Διαχείριση Ακινήτων, Airbnb & Booking.com",
    description:
      "Γνωρίστε τη HostMetric, εταιρεία διαχείρισης ακινήτων, Airbnb, Booking.com και βραχυχρόνιων μισθώσεων με έξυπνη στρατηγική, ανθρώπινη επικοινωνία και στόχο περισσότερες κρατήσεις, καλύτερη απόδοση και υψηλότερα έσοδα.",
  },

  en: {
    title:
      "About HostMetric | Property, Airbnb & Booking.com Management",
    description:
      "Meet HostMetric, a property, Airbnb, Booking.com and short-term rental management company combining smart strategy, human communication and continuous optimization to increase bookings, improve performance and maximize rental revenue.",
  },

  de: {
    title:
      "Über HostMetric | Immobilien-, Airbnb- & Booking.com-Management",
    description:
      "Lernen Sie HostMetric kennen: Immobilien-, Airbnb-, Booking.com- und Kurzzeitvermietungsmanagement mit intelligenter Strategie, persönlicher Kommunikation und kontinuierlicher Optimierung für mehr Buchungen, bessere Performance und höhere Mieteinnahmen.",
  },

  fr: {
    title:
      "À propos de HostMetric | Gestion de biens, Airbnb & Booking.com",
    description:
      "Découvrez HostMetric, société de gestion de biens, Airbnb, Booking.com et locations courte durée, alliant stratégie intelligente, communication humaine et optimisation continue pour plus de réservations, de performance et de revenus.",
  },

  it: {
    title:
      "Chi è HostMetric | Gestione Immobili, Airbnb & Booking.com",
    description:
      "Scopri HostMetric, società di gestione di immobili, Airbnb, Booking.com e affitti brevi che unisce strategia intelligente, comunicazione umana e ottimizzazione continua per più prenotazioni, migliori performance e maggiori ricavi.",
  },

  es: {
    title:
      "Sobre HostMetric | Gestión de Propiedades, Airbnb y Booking.com",
    description:
      "Conoce HostMetric, empresa de gestión de propiedades, Airbnb, Booking.com y alquileres de corta estancia que combina estrategia inteligente, atención humana y optimización continua para aumentar reservas, rendimiento e ingresos.",
  },

  pt: {
    title:
      "Sobre a HostMetric | Gestão de Imóveis, Airbnb e Booking.com",
    description:
      "Conheça a HostMetric, empresa de gestão de imóveis, Airbnb, Booking.com e alojamento de curta duração que combina estratégia inteligente, comunicação humana e otimização contínua para aumentar reservas, desempenho e receitas.",
  },

  bg: {
    title:
      "За HostMetric | Управление на имоти, Airbnb и Booking.com",
    description:
      "Научете повече за HostMetric – компания за управление на имоти, Airbnb, Booking.com и краткосрочни наеми, съчетаваща интелигентна стратегия, лично отношение и постоянна оптимизация за повече резервации, по-добри резултати и по-високи приходи.",
  },

  sr: {
    title:
      "O HostMetric-u | Upravljanje nekretninama, Airbnb i Booking.com",
    description:
      "Upoznajte HostMetric, kompaniju za upravljanje nekretninama, Airbnb-om, Booking.com-om i kratkoročnim najmom koja spaja pametnu strategiju, ljudsku komunikaciju i kontinuiranu optimizaciju za više rezervacija, bolji učinak i veće prihode.",
  },

  tr: {
    title:
      "HostMetric Hakkında | Mülk, Airbnb ve Booking.com Yönetimi",
    description:
      "Mülk, Airbnb, Booking.com ve kısa süreli kiralama yönetimi sunan HostMetric'i tanıyın. Akıllı strateji, güçlü iletişim ve sürekli optimizasyonla daha fazla rezervasyon, daha iyi performans ve daha yüksek gelir hedefliyoruz.",
  },

  pl: {
    title:
      "O HostMetric | Zarządzanie Nieruchomościami, Airbnb i Booking.com",
    description:
      "Poznaj HostMetric, firmę zarządzającą nieruchomościami, Airbnb, Booking.com i najmem krótkoterminowym, łączącą inteligentną strategię, ludzką komunikację i ciągłą optymalizację dla większej liczby rezerwacji, lepszych wyników i wyższych przychodów.",
  },

  ru: {
    title:
      "О HostMetric | Управление недвижимостью, Airbnb и Booking.com",
    description:
      "Познакомьтесь с HostMetric — компанией по управлению недвижимостью, Airbnb, Booking.com и краткосрочной арендой, которая сочетает умную стратегию, человеческую коммуникацию и непрерывную оптимизацию для увеличения бронирований, улучшения эффективности и роста дохода.",
  },
};


/* ==========================================
   ABOUT PAGE SEO METADATA
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
    aboutPageSeo[currentLocale];


  const localizedAboutPath =
    getLocalizedPath(
      "/about",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/about",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedAboutPath,
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


export default async function AboutPage() {
  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(currentLocale);

  const about =
    dictionary.aboutPage;


  /* ==========================================
     LOCALIZED ROUTES
  ========================================== */

  const getStartedPath =
    getLocalizedPath(
      "/get-started",
      currentLocale
    );


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const schemaPageName =
    `${about.hero.titleLine1} ${about.hero.titleLine2}`;

  const webPageSchema =
    getWebPageSchema({
      type:
        "AboutPage",
      name:
        schemaPageName,
      description:
        about.hero.description,
      pathname:
        "/about",
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
            "/about",
        },
      ],
      locale:
        currentLocale,
    });


  return (
    <main className="
        min-h-screen
        overflow-x-hidden
        bg-white
        text-slate-950
      ">

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


      {/* =================================================
          HERO
      ================================================= */}

      <section className="
          relative
          overflow-hidden
          bg-gradient-to-b
          from-sky-50
          via-white
          to-white
          px-4
          pb-16
          pt-16
          sm:px-6
          sm:pb-20
          sm:pt-20
          md:px-8
          md:pb-28
          md:pt-28
        ">

        <AnimatedWave />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="max-w-5xl">

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.25em]
            ">
              {about.hero.eyebrow}
            </p>

            <h1 className="
              mt-4
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              sm:mt-5
              sm:text-5xl
              md:mt-6
              md:text-7xl
            ">
              {about.hero.titleLine1}
              <br />
              {about.hero.titleLine2}
            </h1>

            <p className="
              mt-6
              max-w-4xl
              text-base
              leading-7
              text-slate-600
              sm:text-lg
              sm:leading-8
              md:mt-8
              md:text-2xl
              md:leading-9
            ">
              {about.hero.description}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          OUR PHILOSOPHY
      ================================================= */}

      <section className="
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-24
        ">

        <div className="
          mx-auto
          grid
          max-w-7xl
          gap-8
          sm:gap-10
          md:gap-12
          lg:grid-cols-2
          lg:items-center
          lg:gap-16
        ">

          <div>

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.22em]
            ">
              {about.philosophy.eyebrow}
            </p>

            <h2 className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
              md:mt-5
              md:text-5xl
            ">
              {about.philosophy.titleLine1}
              <br />
              {about.philosophy.titleLine2}
            </h2>

          </div>


          <div className="
            space-y-5
            text-base
            leading-7
            text-slate-600
            sm:space-y-6
            sm:text-lg
            sm:leading-8
          ">

            <p>
              {about.philosophy.paragraph1}
            </p>

            <p>
              {about.philosophy.paragraph2}
            </p>

            <p>
              {about.philosophy.paragraph3}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          SCIENCE + HUMAN
      ================================================= */}

      <section className="
          bg-slate-50
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-28
        ">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.22em]
            ">
              {about.approach.eyebrow}
            </p>

            <h2 className="
            mt-4
            text-3xl
            font-bold
            tracking-tight
            sm:text-4xl
            md:mt-5
            md:text-6xl
          ">
              {about.approach.title}
            </h2>

            <p className="
              mt-5
              text-base
              leading-7
              text-slate-600
              sm:text-lg
              sm:leading-8
              md:mt-7
              md:text-xl
              md:leading-9
            ">
              {about.approach.description}
            </p>

          </div>


          <div className="
            mt-10
            grid
            gap-4
            sm:mt-12
            sm:gap-5
            md:mt-16
            md:grid-cols-2
            md:gap-6
            lg:grid-cols-4
          ">

            {/* PERFORMANCE METRICS */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <BarChart3
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.performanceMetrics.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.performanceMetrics.description}
              </p>

            </div>


            {/* MARKET INTELLIGENCE */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <BrainCircuit
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.marketIntelligence.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.marketIntelligence.description}
              </p>

            </div>


            {/* CONTINUOUS OPTIMIZATION */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <LineChart
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.continuousOptimization.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.continuousOptimization.description}
              </p>

            </div>


            {/* HUMAN COMMUNICATION */}

            <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                duration-300
                sm:p-6
                md:rounded-3xl
                md:p-8
                md:hover:-translate-y-2
                md:hover:shadow-xl
              ">

              <MessageCircle
                size={40}
                className="h-9 w-9 text-blue-600 sm:h-10 sm:w-10"
              />

              <h3 className="
                mt-4
                text-xl
                font-bold
                sm:mt-5
                sm:text-2xl
                md:mt-6
              ">
                {about.approach.cards.humanCommunication.title}
              </h3>

              <p className="
                mt-3
                leading-7
                text-slate-600
                sm:mt-4
              ">
                {about.approach.cards.humanCommunication.description}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FAMILY STYLE
      ================================================= */}

      <section className="
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-28
        ">

        <div className="mx-auto max-w-7xl">

          <div className="
            overflow-hidden
            rounded-[24px]
            bg-[#10214a]
            text-white
            sm:rounded-[32px]
            md:rounded-[40px]
          ">

            <div className="grid lg:grid-cols-2">

              <div className="
                p-6
                sm:p-8
                md:p-12
                lg:p-16
              ">

                <div className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-500/20
                  sm:h-16
                  sm:w-16
                ">

                  <Users
                    size={34}
                    className="text-blue-300"
                  />

                </div>

                <p className="
                  mt-6
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-blue-300
                  sm:mt-8
                  sm:text-sm
                  sm:tracking-[0.22em]
                ">
                  {about.familyBusiness.eyebrow}
                </p>

                <h2 className="
                  mt-4
                  text-3xl
                  font-bold
                  leading-tight
                  sm:text-4xl
                  md:mt-5
                  md:text-5xl
                ">
                  {about.familyBusiness.title}
                </h2>

              </div>


              <div className="
                border-t
                border-white/10
                p-6
                sm:p-8
                md:p-12
                lg:border-l
                lg:border-t-0
                lg:p-16
              ">

                <p className="
                  text-base
                  leading-7
                  text-white/75
                  sm:text-lg
                  sm:leading-8
                  md:text-xl
                  md:leading-9
                ">
                  {about.familyBusiness.paragraph1}
                </p>

                <p className="
                  mt-5
                  text-base
                  leading-7
                  text-white/75
                  sm:mt-7
                  sm:text-lg
                  sm:leading-8
                  md:text-xl
                  md:leading-9
                ">
                  {about.familyBusiness.paragraph2}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          ALIGNMENT
      ================================================= */}

      <section className="
          bg-blue-50
          px-4
          py-16
          sm:px-6
          sm:py-20
          md:px-8
          md:py-28
        ">

        <div className="mx-auto max-w-7xl">

          <div className="
            grid
            gap-8
            sm:gap-10
            lg:grid-cols-[0.8fr_1.2fr]
            lg:items-center
            lg:gap-12
          ">

            <div>

              <TrendingUp
                size={52}
                className="h-11 w-11 text-blue-600 sm:h-[52px] sm:w-[52px]"
              />

              <p className="
                mt-5
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-600
                sm:mt-7
                sm:text-sm
                sm:tracking-[0.22em]
              ">
                {about.sharedSuccess.eyebrow}
              </p>

              <h2 className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
              md:mt-5
              md:text-5xl
            ">
                {about.sharedSuccess.title}
              </h2>

            </div>


            <div className="
              rounded-[24px]
              bg-white
              p-5
              shadow-sm
              sm:p-7
              md:rounded-[32px]
              md:p-12
            ">

              <p className="
                text-base
                leading-7
                text-slate-600
                sm:text-lg
                sm:leading-8
                md:text-xl
                md:leading-9
              ">
                {about.sharedSuccess.description}
              </p>

              <div className="
                mt-6
                flex
                items-start
                gap-3
                sm:mt-9
                sm:gap-4
              ">

                <ShieldCheck
                  size={30}
                  className="mt-1 shrink-0 text-blue-600"
                />

                <p className="
                  text-base
                  leading-7
                  text-slate-600
                  sm:text-lg
                  sm:leading-8
                ">
                  {about.sharedSuccess.principle}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="
          bg-[#2166f3]
          px-4
          py-16
          text-white
          sm:px-6
          sm:py-20
          md:px-8
          md:py-24
        ">

        <div className="mx-auto max-w-5xl text-center">

          <HeartHandshake
            size={50}
            className="mx-auto h-11 w-11 text-blue-100 sm:h-[50px] sm:w-[50px]"
          />

          <p className="
            mt-5
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-blue-100
            sm:mt-7
            sm:text-sm
            sm:tracking-[0.22em]
          ">
            {about.cta.eyebrow}
          </p>

          <h2 className="
            mt-4
            text-3xl
            font-bold
            tracking-tight
            sm:text-4xl
            md:mt-5
            md:text-6xl
          ">
            {about.cta.titleLine1}
            <br />
            {about.cta.titleLine2}
          </h2>

          <p className="
            mx-auto
            mt-5
            max-w-2xl
            text-base
            leading-7
            text-blue-100
            sm:text-lg
            sm:leading-8
            md:mt-7
            md:text-xl
            md:leading-9
          ">
            {about.cta.description}
          </p>

          <Link
            href={getStartedPath}
            className="
              mt-8
              inline-flex
              w-full
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              bg-white
              px-6
              py-3.5
              text-center
              text-base
              font-bold
              text-blue-600
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              sm:mt-10
              sm:w-auto
              sm:rounded-2xl
              sm:px-9
              sm:py-4
              sm:text-lg
              md:hover:scale-105
            "
          >
            {about.cta.button} →
          </Link>

        </div>

      </section>

    </main>
  );
}