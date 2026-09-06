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

import {
  Cookie,
  Settings2,
  ShieldCheck,
  BarChart3,
  Megaphone,
} from "lucide-react";


/* ==========================================
   FINAL SEO PASS NOTES

   This Cookie Policy page has now completed:
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

   Legal-policy intent is kept primary here.
   Commercial Airbnb / Booking.com keywords are
   intentionally NOT stuffed into this legal page.

   Do NOT repeat these items in a later pass.

   Still handled separately at project level:
   - sitemap.ts
   - robots.ts
   - Organization / WebSite schema
   - Core Web Vitals / performance audit
========================================== */


/* ==========================================
   COOKIE POLICY SEO CONTENT
========================================== */

const cookiePolicySeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Πολιτική Cookies | HostMetric",
    description:
      "Διαβάστε την Πολιτική Cookies της HostMetric και μάθετε ποια cookies και παρόμοιες τεχνολογίες μπορεί να χρησιμοποιούνται, για ποιους σκοπούς και ποιες επιλογές έχετε.",
  },

  en: {
    title:
      "Cookie Policy | HostMetric",
    description:
      "Read the HostMetric Cookie Policy to learn which cookies and similar technologies may be used, why they are used and what choices you have regarding cookies.",
  },

  de: {
    title:
      "Cookie-Richtlinie | HostMetric",
    description:
      "Lesen Sie die Cookie-Richtlinie von HostMetric und erfahren Sie, welche Cookies und ähnlichen Technologien verwendet werden können, zu welchen Zwecken und welche Wahlmöglichkeiten Sie haben.",
  },

  fr: {
    title:
      "Politique relative aux cookies | HostMetric",
    description:
      "Consultez la politique relative aux cookies de HostMetric pour savoir quels cookies et technologies similaires peuvent être utilisés, à quelles fins et quels choix sont à votre disposition.",
  },

  it: {
    title:
      "Informativa sui Cookie | HostMetric",
    description:
      "Consulta l'informativa sui cookie di HostMetric per sapere quali cookie e tecnologie simili possono essere utilizzati, per quali finalità e quali opzioni sono disponibili.",
  },

  es: {
    title:
      "Política de Cookies | HostMetric",
    description:
      "Consulta la Política de Cookies de HostMetric para saber qué cookies y tecnologías similares pueden utilizarse, con qué finalidad y qué opciones tienes a tu disposición.",
  },

  pt: {
    title:
      "Política de Cookies | HostMetric",
    description:
      "Consulte a Política de Cookies da HostMetric para saber que cookies e tecnologias semelhantes podem ser utilizados, para que fins e que opções estão disponíveis.",
  },

  bg: {
    title:
      "Политика за бисквитките | HostMetric",
    description:
      "Прочетете Политиката за бисквитките на HostMetric, за да научите какви бисквитки и подобни технологии могат да се използват, с каква цел и какви възможности за избор имате.",
  },

  sr: {
    title:
      "Politika kolačića | HostMetric",
    description:
      "Pročitajte HostMetric Politiku kolačića i saznajte koji kolačići i slične tehnologije mogu da se koriste, u koje svrhe i koje opcije imate na raspolaganju.",
  },

  tr: {
    title:
      "Çerez Politikası | HostMetric",
    description:
      "HostMetric Çerez Politikası'nı okuyarak hangi çerezlerin ve benzer teknolojilerin kullanılabileceğini, kullanım amaçlarını ve sahip olduğunuz seçenekleri öğrenin.",
  },

  pl: {
    title:
      "Polityka plików cookie | HostMetric",
    description:
      "Przeczytaj Politykę plików cookie HostMetric i dowiedz się, jakie pliki cookie oraz podobne technologie mogą być używane, w jakim celu i jakie masz możliwości wyboru.",
  },

  ru: {
    title:
      "Политика использования файлов cookie | HostMetric",
    description:
      "Ознакомьтесь с Политикой использования файлов cookie HostMetric, чтобы узнать, какие файлы cookie и аналогичные технологии могут использоваться, для каких целей и какие возможности выбора у вас есть.",
  },
};


/* ==========================================
   COOKIE POLICY SEO METADATA
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
    cookiePolicySeo[currentLocale];


  const localizedCookiePolicyPath =
    getLocalizedPath(
      "/cookies",
      currentLocale
    );


  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/cookies",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedCookiePolicyPath,
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


export default async function CookiePolicyPage() {

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

  const cookiePolicy =
    dictionary.cookiePolicyPage;


  /* ==========================================
     LOCALIZED ROUTES
  ========================================== */

  const privacyPath =
    `${getLocalizedPath(
      "/privacy",
      currentLocale
    )}#top`;


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const webPageSchema =
    getWebPageSchema({
      name:
        cookiePolicy.hero.title,
      description:
        cookiePolicy.hero.description,
      pathname:
        "/cookies",
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
            cookiePolicy.hero.title,
          pathname:
            "/cookies",
        },
      ],
      locale:
        currentLocale,
    });


  /* ==========================================
     PAGE
  ========================================== */

  return (
    <main
      id="top"
      className="
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-b
        from-sky-50
        via-white
        to-slate-50
        text-slate-900
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


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          border-b
          border-slate-200/80
        "
      >

        <div
          className="
            mx-auto
            max-w-5xl
            px-4
            py-12
            sm:px-6
            sm:py-14
            md:px-8
            md:py-20
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              text-white
              shadow-lg
              shadow-blue-600/20
              sm:h-12
              sm:w-12
              sm:rounded-2xl
            "
          >
            <Cookie
              size={25}
              className="
                h-6
                w-6
                sm:h-[25px]
                sm:w-[25px]
              "
            />
          </div>


          <p
            className="
              mt-6
              text-[11px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:mt-7
              sm:text-xs
              sm:tracking-[0.22em]
            "
          >
            {cookiePolicy.hero.eyebrow}
          </p>


          <h1
            className="
              mt-3
              max-w-3xl
              break-words
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              sm:text-4xl
            "
          >
            {cookiePolicy.hero.title}
          </h1>


          <p
            className="
              mt-4
              max-w-3xl
              text-sm
              leading-6
              text-slate-600
              sm:mt-5
              sm:text-base
              sm:leading-7
            "
          >
            {cookiePolicy.hero.description}
          </p>


          <p
            className="
              mt-4
              text-xs
              leading-5
              text-slate-400
              sm:text-sm
            "
          >
            {cookiePolicy.hero.lastUpdated}
          </p>

        </div>

      </section>


      {/* =================================================
          POLICY CONTENT
      ================================================= */}

      <section
        className="
          mx-auto
          max-w-5xl
          px-4
          py-10
          sm:px-6
          sm:py-12
          md:px-8
          md:py-14
        "
      >

        <div
          className="
            rounded-[22px]
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:rounded-[26px]
            sm:p-7
            md:rounded-[32px]
            md:p-10
          "
        >

          <div
            className="
              space-y-9
              text-sm
              leading-7
              text-slate-600
              sm:space-y-10
              sm:text-[15px]
              md:space-y-11
            "
          >

            {/* ============================================
                WHAT ARE COOKIES
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.whatAreCookies.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.whatAreCookies.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.whatAreCookies.paragraph2}
              </p>

            </section>


            {/* ============================================
                SIMILAR TECHNOLOGIES
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.similarTechnologies.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.similarTechnologies.paragraph1}
              </p>

            </section>


            {/* ============================================
                NECESSARY COOKIES
            ============================================ */}

            <section>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >

                <ShieldCheck
                  size={21}
                  className="
                    mt-0.5
                    h-5
                    w-5
                    shrink-0
                    text-blue-600
                    sm:mt-0
                    sm:h-[21px]
                    sm:w-[21px]
                  "
                />


                <h2
                  className="
                    min-w-0
                    text-lg
                    font-bold
                    leading-snug
                    text-slate-950
                    sm:text-xl
                  "
                >
                  {cookiePolicy.sections.necessaryCookies.title}
                </h2>

              </div>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.necessaryCookies.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.necessaryCookies.paragraph2}
              </p>


              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-green-100
                  bg-green-50
                  p-4
                  sm:mt-5
                  sm:rounded-2xl
                  sm:p-5
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    leading-6
                    text-green-900
                    sm:text-[15px]
                    sm:leading-7
                  "
                >
                  {cookiePolicy.sections.necessaryCookies.notice}
                </p>

              </div>

            </section>


            {/* ============================================
                PREFERENCE COOKIES
            ============================================ */}

            <section>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >

                <Settings2
                  size={21}
                  className="
                    mt-0.5
                    h-5
                    w-5
                    shrink-0
                    text-blue-600
                    sm:mt-0
                    sm:h-[21px]
                    sm:w-[21px]
                  "
                />


                <h2
                  className="
                    min-w-0
                    text-lg
                    font-bold
                    leading-snug
                    text-slate-950
                    sm:text-xl
                  "
                >
                  {cookiePolicy.sections.preferenceCookies.title}
                </h2>

              </div>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.preferenceCookies.paragraph1}
              </p>

            </section>


            {/* ============================================
                ANALYTICS COOKIES
            ============================================ */}

            <section>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >

                <BarChart3
                  size={21}
                  className="
                    mt-0.5
                    h-5
                    w-5
                    shrink-0
                    text-blue-600
                    sm:mt-0
                    sm:h-[21px]
                    sm:w-[21px]
                  "
                />


                <h2
                  className="
                    min-w-0
                    text-lg
                    font-bold
                    leading-snug
                    text-slate-950
                    sm:text-xl
                  "
                >
                  {cookiePolicy.sections.analyticsCookies.title}
                </h2>

              </div>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.analyticsCookies.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.analyticsCookies.paragraph2}
              </p>

            </section>


            {/* ============================================
                MARKETING COOKIES
            ============================================ */}

            <section>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >

                <Megaphone
                  size={21}
                  className="
                    mt-0.5
                    h-5
                    w-5
                    shrink-0
                    text-blue-600
                    sm:mt-0
                    sm:h-[21px]
                    sm:w-[21px]
                  "
                />


                <h2
                  className="
                    min-w-0
                    text-lg
                    font-bold
                    leading-snug
                    text-slate-950
                    sm:text-xl
                  "
                >
                  {cookiePolicy.sections.marketingCookies.title}
                </h2>

              </div>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.marketingCookies.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.marketingCookies.paragraph2}
              </p>

            </section>


            {/* ============================================
                SESSION & PERSISTENT COOKIES
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.sessionPersistentCookies.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.sessionPersistentCookies.paragraph1}
              </p>


              <ul
                className="
                  mt-4
                  list-disc
                  space-y-3
                  pl-5
                  marker:text-blue-500
                "
              >

                <li className="pl-1">

                  <strong className="text-slate-800">
                    {
                      cookiePolicy.sections
                        .sessionPersistentCookies
                        .sessionTitle
                    }
                  </strong>{" "}

                  {
                    cookiePolicy.sections
                      .sessionPersistentCookies
                      .sessionText
                  }

                </li>


                <li className="pl-1">

                  <strong className="text-slate-800">
                    {
                      cookiePolicy.sections
                        .sessionPersistentCookies
                        .persistentTitle
                    }
                  </strong>{" "}

                  {
                    cookiePolicy.sections
                      .sessionPersistentCookies
                      .persistentText
                  }

                </li>

              </ul>

            </section>


            {/* ============================================
                THIRD-PARTY SERVICES
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.thirdPartyServices.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.thirdPartyServices.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.thirdPartyServices.paragraph2}
              </p>

            </section>


            {/* ============================================
                COOKIE CHOICES
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.cookieChoices.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.cookieChoices.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.cookieChoices.paragraph2}
              </p>

            </section>


            {/* ============================================
                CONSENT
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.consent.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.consent.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.consent.paragraph2}
              </p>

            </section>


            {/* ============================================
                UPDATES
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.updates.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.updates.paragraph1}
              </p>


              <p className="mt-3">
                {cookiePolicy.sections.updates.paragraph2}
              </p>

            </section>


            {/* ============================================
                PRIVACY POLICY
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.privacy.title}
              </h2>


              <p className="mt-3 sm:mt-4">

                {cookiePolicy.sections.privacy.paragraphBeforeLink}{" "}

                <Link
                  href={privacyPath}
                  className="
                    font-semibold
                    text-blue-600
                    transition
                    hover:text-blue-800
                  "
                >
                  {cookiePolicy.sections.privacy.link}
                </Link>

                .

              </p>

            </section>


            {/* ============================================
                CONTACT
            ============================================ */}

            <section>

              <h2
                className="
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {cookiePolicy.sections.contact.title}
              </h2>


              <p className="mt-3 sm:mt-4">
                {cookiePolicy.sections.contact.description}
              </p>


              <a
                href="mailto:info@hostmetric.gr"
                className="
                  mt-3
                  inline-block
                  break-all
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-800
                  sm:break-normal
                "
              >
                {cookiePolicy.sections.contact.email}
              </a>

            </section>

          </div>

        </div>

      </section>

    </main>
  );
}
