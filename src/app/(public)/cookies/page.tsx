import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";
import {
  Cookie,
  Settings2,
  ShieldCheck,
  BarChart3,
  Megaphone,
} from "lucide-react";

export default async function CookiePolicyPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const dictionary = await getDictionary(currentLocale);
  const cookiePolicy = dictionary.cookiePolicyPage;

  return (
    <main
      id="top"
      className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-900"
    >

      <section className="border-b border-slate-200/80">

        <div className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Cookie size={25} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            {cookiePolicy.hero.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {cookiePolicy.hero.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            {cookiePolicy.hero.description}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            {cookiePolicy.hero.lastUpdated}
          </p>

        </div>

      </section>


      <section className="mx-auto max-w-5xl px-6 py-14 md:px-8">

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-10">

          <div className="space-y-11 text-[15px] leading-7 text-slate-600">

            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.whatAreCookies.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.whatAreCookies.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.whatAreCookies.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.similarTechnologies.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.similarTechnologies.paragraph1}
              </p>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <ShieldCheck size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {cookiePolicy.sections.necessaryCookies.title}
                </h2>
              </div>

              <p className="mt-4">
                {cookiePolicy.sections.necessaryCookies.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.necessaryCookies.paragraph2}
              </p>

              <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5">
                <p className="font-semibold text-green-900">
                  {cookiePolicy.sections.necessaryCookies.notice}
                </p>
              </div>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <Settings2 size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {cookiePolicy.sections.preferenceCookies.title}
                </h2>
              </div>

              <p className="mt-4">
                {cookiePolicy.sections.preferenceCookies.paragraph1}
              </p>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <BarChart3 size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {cookiePolicy.sections.analyticsCookies.title}
                </h2>
              </div>

              <p className="mt-4">
                {cookiePolicy.sections.analyticsCookies.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.analyticsCookies.paragraph2}
              </p>
            </section>


            <section>
              <div className="flex items-center gap-3">
                <Megaphone size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {cookiePolicy.sections.marketingCookies.title}
                </h2>
              </div>

              <p className="mt-4">
                {cookiePolicy.sections.marketingCookies.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.marketingCookies.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.sessionPersistentCookies.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.sessionPersistentCookies.paragraph1}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-slate-800">{cookiePolicy.sections.sessionPersistentCookies.sessionTitle}</strong>{" "}
                  {cookiePolicy.sections.sessionPersistentCookies.sessionText}
                </li>

                <li>
                  <strong className="text-slate-800">
                    {cookiePolicy.sections.sessionPersistentCookies.persistentTitle}
                  </strong>{" "}
                  {cookiePolicy.sections.sessionPersistentCookies.persistentText}
                </li>
              </ul>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.thirdPartyServices.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.thirdPartyServices.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.thirdPartyServices.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.cookieChoices.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.cookieChoices.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.cookieChoices.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.consent.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.consent.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.consent.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.updates.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.updates.paragraph1}
              </p>

              <p className="mt-3">
                {cookiePolicy.sections.updates.paragraph2}
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.privacy.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.privacy.paragraphBeforeLink}{" "}
                <Link
                  href="/privacy#top"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  {cookiePolicy.sections.privacy.link}
                </Link>
                .
              </p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {cookiePolicy.sections.contact.title}
              </h2>

              <p className="mt-4">
                {cookiePolicy.sections.contact.description}
              </p>

              <a
                href="mailto:info@hostmetric.gr"
                className="mt-3 inline-block font-semibold text-blue-600 hover:text-blue-800"
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