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

  return (
    <main
      id="top"
      className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-900"
    >

      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <FileText size={24} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            {terms.hero.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            {terms.hero.description}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            {terms.hero.lastUpdated}
          </p>

        </div>
      </section>


      <section className="mx-auto max-w-5xl px-6 py-14 md:px-8">

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-10">

          <div className="space-y-11 text-[15px] leading-7 text-slate-600">

            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.acceptance.title}
              </h2>

              <p className="mt-4">
                {terms.sections.acceptance.paragraph1}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.about.title}
              </h2>

              <p className="mt-4">
                {terms.sections.about.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.about.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.websiteInformation.title}
              </h2>

              <p className="mt-4">
                {terms.sections.websiteInformation.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.websiteInformation.paragraph2}
              </p>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <BarChart3 size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {terms.sections.caseStudies.title}
                </h2>
              </div>

              <p className="mt-4">
                {terms.sections.caseStudies.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.caseStudies.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.pricingRevenue.title}
              </h2>

              <p className="mt-4">
                {terms.sections.pricingRevenue.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.pricingRevenue.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.onboarding.title}
              </h2>

              <p className="mt-4">
                {terms.sections.onboarding.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.onboarding.paragraph2}
              </p>

              <p className="mt-3">
                {terms.sections.onboarding.paragraph3}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.userInformation.title}
              </h2>

              <p className="mt-4">
                {terms.sections.userInformation.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.userInformation.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.materials.title}
              </h2>

              <p className="mt-4">
                {terms.sections.materials.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.materials.paragraph2}
              </p>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <Globe2 size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {terms.sections.thirdPartyPlatforms.title}
                </h2>
              </div>

              <p className="mt-4">
                {terms.sections.thirdPartyPlatforms.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.thirdPartyPlatforms.paragraph2}
              </p>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <Copyright size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {terms.sections.intellectualProperty.title}
                </h2>
              </div>

              <p className="mt-4">
                {terms.sections.intellectualProperty.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.intellectualProperty.paragraph2}
              </p>

              <p className="mt-3">
                {terms.sections.intellectualProperty.paragraph3}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.acceptableUse.title}
              </h2>

              <p className="mt-4">
                {terms.sections.acceptableUse.description}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>{terms.sections.acceptableUse.items[0]}</li>
                <li>{terms.sections.acceptableUse.items[1]}</li>
                <li>{terms.sections.acceptableUse.items[2]}</li>
                <li>{terms.sections.acceptableUse.items[3]}</li>
                <li>{terms.sections.acceptableUse.items[4]}</li>
              </ul>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <ShieldAlert size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {terms.sections.availabilityLiability.title}
                </h2>
              </div>

              <p className="mt-4">
                {terms.sections.availabilityLiability.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.availabilityLiability.paragraph2}
              </p>

              <p className="mt-3">
                {terms.sections.availabilityLiability.paragraph3}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.externalLinks.title}
              </h2>

              <p className="mt-4">
                {terms.sections.externalLinks.paragraph1}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.privacy.title}
              </h2>

              <p className="mt-4">
                {terms.sections.privacy.paragraphBeforeLink}{" "}
                <Link
                  href="/privacy#top"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  {terms.sections.privacy.link}
                </Link>
                .
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.changes.title}
              </h2>

              <p className="mt-4">
                {terms.sections.changes.paragraph1}
              </p>

              <p className="mt-3">
                {terms.sections.changes.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {terms.sections.contact.title}
              </h2>

              <p className="mt-4">
                {terms.sections.contact.description}
              </p>

              <a
                href="mailto:info@hostmetric.gr"
                className="mt-3 inline-block font-semibold text-blue-600 hover:text-blue-800"
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