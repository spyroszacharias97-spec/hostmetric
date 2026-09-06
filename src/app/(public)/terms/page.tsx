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
import {
  FileText,
  Copyright,
  BarChart3,
  Globe2,
  ShieldAlert,
} from "lucide-react";

/* ==========================================
   FINAL SEO PASS NOTES

   This Terms & Conditions page has now completed:
   - Localized SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - H1 / H2 semantic review
   - Internal-link review

   Search intent:
   - HostMetric Terms & Conditions
   - Website / service terms
   - Legal information and trust

   This is a legal page, so commercial Property
   Management, Airbnb, Booking.com and revenue
   keywords are intentionally NOT stuffed here.

   The Privacy Policy internal route uses the
   actual public route /privacy#top.

   Page-specific WebPage and BreadcrumbList schema
   are included in the structured-data pass.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   TERMS PAGE SEO CONTENT
========================================== */

const termsPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title: "Όροι & Προϋποθέσεις | HostMetric",
    description:
      "Διαβάστε τους Όρους και τις Προϋποθέσεις της HostMetric σχετικά με τη χρήση της ιστοσελίδας, των υπηρεσιών, του περιεχομένου και των πληροφοριών μας.",
  },
  en: {
    title: "Terms & Conditions | HostMetric",
    description:
      "Read the HostMetric Terms & Conditions covering use of our website, services, content, information, third-party platforms, responsibilities and related legal terms.",
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen | HostMetric",
    description:
      "Lesen Sie die Geschäftsbedingungen von HostMetric zur Nutzung unserer Website, Dienstleistungen, Inhalte und Informationen sowie zu Verantwortlichkeiten und rechtlichen Bedingungen.",
  },
  fr: {
    title: "Conditions Générales | HostMetric",
    description:
      "Consultez les Conditions Générales de HostMetric concernant l’utilisation de notre site, de nos services, contenus et informations, ainsi que les responsabilités applicables.",
  },
  it: {
    title: "Termini & Condizioni | HostMetric",
    description:
      "Leggi i Termini e le Condizioni di HostMetric relativi all’utilizzo del sito, dei servizi, dei contenuti e delle informazioni, incluse responsabilità e condizioni legali.",
  },
  es: {
    title: "Términos & Condiciones | HostMetric",
    description:
      "Consulta los Términos y Condiciones de HostMetric sobre el uso de nuestro sitio web, servicios, contenidos e información, incluidas responsabilidades y condiciones legales.",
  },
  pt: {
    title: "Termos & Condições | HostMetric",
    description:
      "Consulte os Termos e Condições da HostMetric sobre a utilização do nosso site, serviços, conteúdos e informações, incluindo responsabilidades e condições legais.",
  },
  bg: {
    title: "Общи условия | HostMetric",
    description:
      "Прочетете Общите условия на HostMetric относно използването на нашия уебсайт, услуги, съдържание и информация, включително отговорности и приложими правни условия.",
  },
  sr: {
    title: "Uslovi korišćenja | HostMetric",
    description:
      "Pročitajte uslove korišćenja HostMetric-a koji se odnose na naš sajt, usluge, sadržaj i informacije, uključujući odgovornosti i relevantne pravne uslove.",
  },
  tr: {
    title: "Şartlar & Koşullar | HostMetric",
    description:
      "Web sitemizin, hizmetlerimizin, içerik ve bilgilerimizin kullanımına ilişkin sorumluluklar ve ilgili yasal hükümler dahil HostMetric Şartlar ve Koşullarını okuyun.",
  },
  pl: {
    title: "Regulamin | HostMetric",
    description:
      "Zapoznaj się z Regulaminem HostMetric dotyczącym korzystania z naszej strony, usług, treści i informacji, w tym odpowiedzialności oraz odpowiednich warunków prawnych.",
  },

  ru: {
    title: "Условия использования | HostMetric",
    description:
      "Ознакомьтесь с Условиями использования HostMetric, регулирующими использование нашего сайта, услуг, контента и информации, включая ответственность и применимые юридические условия.",
  },
};


/* ==========================================
   TERMS PAGE SEO METADATA
========================================== */

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale =
      savedLocale;
  }

  const seo =
    termsPageSeo[currentLocale];

  const localizedTermsPath =
    getLocalizedPath(
      "/terms",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/terms",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedTermsPath,
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


export default async function TermsPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const dictionary = await getDictionary(currentLocale);
  const terms = dictionary.termsPage;

  /* =========================================================
     LOCALE-AWARE PUBLIC ROUTES
  ========================================================= */

  const privacyPath =
    getLocalizedPath(
      "/privacy#top",
      currentLocale
    );


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const webPageSchema =
    getWebPageSchema({
      name:
        "Terms & Conditions",
      description:
        terms.hero.description,
      pathname:
        "/terms",
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
            "Terms & Conditions",
          pathname:
            "/terms",
        },
      ],
      locale:
        currentLocale,
    });


  /* =========================================================
     RESPONSIVE TERMS & CONDITIONS

     Legal text, dictionary keys, routes and content remain
     unchanged. Only presentation and responsive behavior are
     adjusted for phones, tablets and desktop screens.
  ========================================================= */

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


      <section
        className="
          border-b
          border-slate-200/80
        "
      >
        <div
          className="
            mx-auto
            w-full
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
              shrink-0
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
            <FileText size={24} />
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
            {terms.hero.eyebrow}
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
            Terms & Conditions
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
            {terms.hero.description}
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
            {terms.hero.lastUpdated}
          </p>

        </div>
      </section>


      <section
        className="
          mx-auto
          w-full
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
            min-w-0
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
              min-w-0
              space-y-9
              text-sm
              leading-7
              text-slate-600
              sm:space-y-10
              sm:text-[15px]
              md:space-y-11
            "
          >

            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.acceptance.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.acceptance.paragraph1}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.about.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.about.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.about.paragraph2}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.websiteInformation.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.websiteInformation.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.websiteInformation.paragraph2}
              </p>
            </section>


            <section>
              <div
                className="
                  flex
                  min-w-0
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
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                  {terms.sections.caseStudies.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.caseStudies.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.caseStudies.paragraph2}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.pricingRevenue.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.pricingRevenue.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.pricingRevenue.paragraph2}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.onboarding.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.onboarding.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.onboarding.paragraph2}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.onboarding.paragraph3}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.userInformation.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.userInformation.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.userInformation.paragraph2}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.materials.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.materials.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.materials.paragraph2}
              </p>
            </section>


            <section>
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <Globe2
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
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                  {terms.sections.thirdPartyPlatforms.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.thirdPartyPlatforms.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.thirdPartyPlatforms.paragraph2}
              </p>
            </section>


            <section>
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <Copyright
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
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                  {terms.sections.intellectualProperty.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.intellectualProperty.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.intellectualProperty.paragraph2}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.intellectualProperty.paragraph3}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.acceptableUse.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.acceptableUse.description}
              </p>

              <ul
                className="
                  mt-4
                  list-disc
                  space-y-2.5
                  pl-5
                  marker:text-blue-500
                  sm:space-y-2
                "
              >
                <li>{terms.sections.acceptableUse.items[0]}</li>
                <li>{terms.sections.acceptableUse.items[1]}</li>
                <li>{terms.sections.acceptableUse.items[2]}</li>
                <li>{terms.sections.acceptableUse.items[3]}</li>
                <li>{terms.sections.acceptableUse.items[4]}</li>
              </ul>
            </section>


            <section>
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <ShieldAlert
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
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                  {terms.sections.availabilityLiability.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.availabilityLiability.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.availabilityLiability.paragraph2}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.availabilityLiability.paragraph3}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.externalLinks.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.externalLinks.paragraph1}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.privacy.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.privacy.paragraphBeforeLink}{" "}
                <Link
                  href={privacyPath}
                  className="
                    font-semibold
                    text-blue-600
                    transition
                    hover:text-blue-800
                  "
                >
                  {terms.sections.privacy.link}
                </Link>
                .
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.changes.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.changes.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {terms.sections.changes.paragraph2}
              </p>
            </section>


            <section>
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  leading-snug
                  text-slate-950
                  sm:text-xl
                "
              >
                {terms.sections.contact.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {terms.sections.contact.description}
              </p>

              <a
                href="mailto:info@hostmetric.gr"
                className="
                  mt-3
                  inline-block
                  max-w-full
                  break-all
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-800
                  sm:break-normal
                "
              >
                {terms.sections.contact.email}
              </a>
            </section>

          </div>

        </div>

      </section>
    </main>
  );
}