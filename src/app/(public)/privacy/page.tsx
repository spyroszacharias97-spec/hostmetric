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
  ShieldCheck,
  Database,
  Camera,
  LockKeyhole,
  Cookie,
  UserCheck,
  Mail,
} from "lucide-react";


/* ==========================================
   FINAL SEO PASS NOTES

   This Privacy Policy page has now completed:
   - Localized SEO title + meta description
   - Canonical + hreflang + x-default
   - Open Graph + Twitter
   - Robots index/follow
   - Heading / legal internal-link review

   Search intent:
   - HostMetric privacy policy
   - Privacy / personal-data information
   - Legal trust and transparency

   Commercial Property Management, Airbnb,
   Booking.com and revenue keywords are deliberately
   NOT targeted here. This is a legal/trust page,
   so commercial keyword phrases remain assigned
   to the relevant service, insight and Guide pages.

   Do NOT repeat these items in a later pass.
========================================== */


/* ==========================================
   PRIVACY POLICY PAGE SEO CONTENT
========================================== */

const privacyPolicyPageSeo: Record<
  Locale,
  {
    title: string;
    description: string;
  }
> = {
  el: {
    title:
      "Πολιτική Απορρήτου | HostMetric",
    description:
      "Διαβάστε την Πολιτική Απορρήτου της HostMetric και μάθετε πώς συλλέγουμε, χρησιμοποιούμε, αποθηκεύουμε και προστατεύουμε προσωπικά δεδομένα και πληροφορίες.",
  },

  en: {
    title:
      "Privacy Policy | HostMetric",
    description:
      "Read the HostMetric Privacy Policy to learn how we collect, use, store and protect personal data and information when you use our website and services.",
  },

  de: {
    title:
      "Datenschutzerklärung | HostMetric",
    description:
      "Lesen Sie die Datenschutzerklärung von HostMetric und erfahren Sie, wie wir personenbezogene Daten und Informationen erheben, verwenden, speichern und schützen.",
  },

  fr: {
    title:
      "Politique de Confidentialité | HostMetric",
    description:
      "Consultez la Politique de Confidentialité de HostMetric pour savoir comment nous collectons, utilisons, stockons et protégeons les données et informations personnelles.",
  },

  it: {
    title:
      "Informativa sulla Privacy | HostMetric",
    description:
      "Consulta l'Informativa sulla Privacy di HostMetric per sapere come raccogliamo, utilizziamo, conserviamo e proteggiamo dati personali e informazioni.",
  },

  es: {
    title:
      "Política de Privacidad | HostMetric",
    description:
      "Consulta la Política de Privacidad de HostMetric para conocer cómo recopilamos, utilizamos, almacenamos y protegemos los datos personales y la información.",
  },

  pt: {
    title:
      "Política de Privacidade | HostMetric",
    description:
      "Consulte a Política de Privacidade da HostMetric para saber como recolhemos, utilizamos, armazenamos e protegemos dados pessoais e informações.",
  },

  bg: {
    title:
      "Политика за поверителност | HostMetric",
    description:
      "Прочетете Политиката за поверителност на HostMetric и научете как събираме, използваме, съхраняваме и защитаваме лични данни и информация.",
  },

  sr: {
    title:
      "Politika privatnosti | HostMetric",
    description:
      "Pročitajte Politiku privatnosti HostMetric-a i saznajte kako prikupljamo, koristimo, čuvamo i štitimo lične podatke i informacije.",
  },

  tr: {
    title:
      "Gizlilik Politikası | HostMetric",
    description:
      "HostMetric Gizlilik Politikası'nı okuyarak kişisel verileri ve bilgileri nasıl topladığımızı, kullandığımızı, sakladığımızı ve koruduğumuzu öğrenin.",
  },

  pl: {
    title:
      "Polityka Prywatności | HostMetric",
    description:
      "Przeczytaj Politykę Prywatności HostMetric i dowiedz się, jak zbieramy, wykorzystujemy, przechowujemy i chronimy dane osobowe oraz informacje.",
  },

  ru: {
    title:
      "Политика конфиденциальности | HostMetric",
    description:
      "Ознакомьтесь с Политикой конфиденциальности HostMetric и узнайте, как мы собираем, используем, храним и защищаем персональные данные и информацию.",
  },
};


/* ==========================================
   PRIVACY POLICY PAGE SEO METADATA
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
    privacyPolicyPageSeo[currentLocale];

  const localizedPrivacyPolicyPath =
    getLocalizedPath(
      "/privacy",
      currentLocale
    );

  return {
    title:
      seo.title,

    description:
      seo.description,

    alternates:
      getLocalizedAlternates(
        "/privacy",
        currentLocale
      ),

    openGraph: {
      type:
        "website",
      url:
        localizedPrivacyPolicyPath,
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


export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const dictionary = await getDictionary(currentLocale);
  const privacy = dictionary.privacyPolicyPage;


  /* =========================================================
     LOCALIZED ROUTES
  ========================================================= */

  const cookiesPath =
    `${getLocalizedPath(
      "/cookies",
      currentLocale
    )}#top`;


  /* ==========================================
     STRUCTURED DATA
  ========================================== */

  const webPageSchema =
    getWebPageSchema({
      name:
        privacy.hero.title,
      description:
        privacy.hero.description,
      pathname:
        "/privacy",
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
            privacy.hero.title,
          pathname:
            "/privacy",
        },
      ],
      locale:
        currentLocale,
    });


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


      {/* HERO */}
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
            <ShieldCheck size={25} />
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
            {privacy.hero.eyebrow}
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
            {privacy.hero.title}
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
            {privacy.hero.description}
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
            {privacy.hero.lastUpdated}
          </p>

        </div>
      </section>


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

            {/* 1 */}
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
                {privacy.sections.whoWeAre.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.whoWeAre.description}
              </p>

              <div
                className="
                  mt-4
                  min-w-0
                  rounded-xl
                  bg-slate-50
                  p-4
                  sm:mt-5
                  sm:rounded-2xl
                  sm:p-5
                "
              >
                <p className="font-semibold text-slate-900">
                  {privacy.sections.whoWeAre.brand}
                </p>

                <p className="mt-2">
                  {privacy.sections.whoWeAre.email}
                  <br />
                  {privacy.sections.whoWeAre.greece}
                  <br />
                  {privacy.sections.whoWeAre.cyprus}
                </p>
              </div>
            </section>


            {/* 2 */}
            <section>
              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <Database
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
                  {privacy.sections.informationCollected.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.informationCollected.description}
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
                <li>{privacy.sections.informationCollected.items[0]}</li>
                <li>{privacy.sections.informationCollected.items[1]}</li>
                <li>{privacy.sections.informationCollected.items[2]}</li>
                <li>
                  {privacy.sections.informationCollected.items[3]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[4]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[5]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[6]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[7]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[8]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[9]}
                </li>
                <li>
                  {privacy.sections.informationCollected.items[10]}
                </li>
                <li>{privacy.sections.informationCollected.items[11]}</li>
                <li>
                  {privacy.sections.informationCollected.items[12]}
                </li>
              </ul>
            </section>


            {/* 3 */}
            <section>
              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <Camera
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
                  {privacy.sections.propertyPhotos.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.propertyPhotos.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.propertyPhotos.paragraph2}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.propertyPhotos.paragraph3}
              </p>
            </section>


            {/* 4 */}
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
                {privacy.sections.collection.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.collection.description}
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
                <li>{privacy.sections.collection.items[0]}</li>
                <li>{privacy.sections.collection.items[1]}</li>
                <li>{privacy.sections.collection.items[2]}</li>
                <li>{privacy.sections.collection.items[3]}</li>
                <li>{privacy.sections.collection.items[4]}</li>
                <li>
                  {privacy.sections.collection.items[5]}
                </li>
              </ul>
            </section>


            {/* 5 */}
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
                {privacy.sections.processing.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.processing.description}
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
                <li>{privacy.sections.processing.items[0]}</li>
                <li>{privacy.sections.processing.items[1]}</li>
                <li>{privacy.sections.processing.items[2]}</li>
                <li>
                  {privacy.sections.processing.items[3]}
                </li>
                <li>
                  {privacy.sections.processing.items[4]}
                </li>
                <li>{privacy.sections.processing.items[5]}</li>
                <li>{privacy.sections.processing.items[6]}</li>
                <li>
                  {privacy.sections.processing.items[7]}
                </li>
                <li>
                  {privacy.sections.processing.items[8]}
                </li>
                <li>{privacy.sections.processing.items[9]}</li>
                <li>{privacy.sections.processing.items[10]}</li>
              </ul>
            </section>


            {/* 6 */}
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
                {privacy.sections.legalBases.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.legalBases.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.legalBases.paragraph2}
              </p>
            </section>


            {/* 7 */}
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
                {privacy.sections.platforms.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.platforms.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.platforms.paragraph2}
              </p>

              <p
                className="
                  mt-3
                  font-semibold
                  text-slate-800
                "
              >
                {privacy.sections.platforms.noSale}
              </p>
            </section>


            {/* 8 */}
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
                {privacy.sections.transfers.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.transfers.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.transfers.paragraph2}
              </p>
            </section>


            {/* 9 */}
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
                {privacy.sections.retention.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.retention.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.retention.paragraph2}
              </p>
            </section>


            {/* 10 */}
            <section>
              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <LockKeyhole
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
                  {privacy.sections.security.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.security.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.security.paragraph2}
              </p>
            </section>


            {/* 11 */}
            <section>
              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <UserCheck
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
                  {privacy.sections.rights.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.rights.description}
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
                <li>{privacy.sections.rights.items[0]}</li>
                <li>{privacy.sections.rights.items[1]}</li>
                <li>{privacy.sections.rights.items[2]}</li>
                <li>{privacy.sections.rights.items[3]}</li>
                <li>{privacy.sections.rights.items[4]}</li>
                <li>{privacy.sections.rights.items[5]}</li>
                <li>
                  {privacy.sections.rights.items[6]}
                </li>
                <li>
                  {privacy.sections.rights.items[7]}
                </li>
              </ul>
            </section>


            {/* 12 */}
            <section>
              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <Cookie
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
                  {privacy.sections.cookies.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.cookies.paragraph1}
              </p>

              <p
                className="
                  mt-3
                "
              >
                {privacy.sections.cookies.paragraph2BeforeLink}{" "}
                <Link
                  href={cookiesPath}
                  className="
                    font-semibold
                    text-blue-600
                    transition
                    hover:text-blue-800
                  "
                >
                  {privacy.sections.cookies.link}
                </Link>
                .
              </p>
            </section>


            {/* 13 */}
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
                {privacy.sections.externalWebsites.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.externalWebsites.description}
              </p>
            </section>


            {/* 14 */}
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
                {privacy.sections.changes.title}
              </h2>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.changes.description}
              </p>
            </section>


            {/* 15 */}
            <section>
              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:items-center
                "
              >
                <Mail
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
                  {privacy.sections.contact.title}
                </h2>
              </div>

              <p
                className="
                  mt-3
                  sm:mt-4
                "
              >
                {privacy.sections.contact.description}
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
                {privacy.sections.contact.email}
              </a>
            </section>

          </div>

        </div>

      </section>
    </main>
  );
}