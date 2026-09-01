import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
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
                  href="/privacy#top"
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