import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";
import {
  ShieldCheck,
  Database,
  Camera,
  LockKeyhole,
  Cookie,
  UserCheck,
  Mail,
} from "lucide-react";

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const dictionary = await getDictionary(currentLocale);
  const privacy = dictionary.privacyPolicyPage;

  return (
    <main
      id="top"
      className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-900"
    >
      {/* HERO */}
      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <ShieldCheck size={25} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            {privacy.hero.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {privacy.hero.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            {privacy.hero.description}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            {privacy.hero.lastUpdated}
          </p>

        </div>
      </section>


      <section className="mx-auto max-w-5xl px-6 py-14 md:px-8">

        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-10">

          <div className="space-y-11 text-[15px] leading-7 text-slate-600">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.whoWeAre.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.whoWeAre.description}
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
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
              <div className="flex items-center gap-3">
                <Database size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {privacy.sections.informationCollected.title}
                </h2>
              </div>

              <p className="mt-4">
                {privacy.sections.informationCollected.description}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
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
              <div className="flex items-center gap-3">
                <Camera size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {privacy.sections.propertyPhotos.title}
                </h2>
              </div>

              <p className="mt-4">
                {privacy.sections.propertyPhotos.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.propertyPhotos.paragraph2}
              </p>

              <p className="mt-3">
                {privacy.sections.propertyPhotos.paragraph3}
              </p>
            </section>


            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.collection.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.collection.description}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
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
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.processing.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.processing.description}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
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
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.legalBases.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.legalBases.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.legalBases.paragraph2}
              </p>
            </section>


            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.platforms.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.platforms.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.platforms.paragraph2}
              </p>

              <p className="mt-3 font-semibold text-slate-800">
                {privacy.sections.platforms.noSale}
              </p>
            </section>


            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.transfers.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.transfers.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.transfers.paragraph2}
              </p>
            </section>


            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.retention.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.retention.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.retention.paragraph2}
              </p>
            </section>


            {/* 10 */}
            <section>
              <div className="flex items-center gap-3">
                <LockKeyhole size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {privacy.sections.security.title}
                </h2>
              </div>

              <p className="mt-4">
                {privacy.sections.security.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.security.paragraph2}
              </p>
            </section>


            {/* 11 */}
            <section>
              <div className="flex items-center gap-3">
                <UserCheck size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {privacy.sections.rights.title}
                </h2>
              </div>

              <p className="mt-4">
                {privacy.sections.rights.description}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
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
              <div className="flex items-center gap-3">
                <Cookie size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {privacy.sections.cookies.title}
                </h2>
              </div>

              <p className="mt-4">
                {privacy.sections.cookies.paragraph1}
              </p>

              <p className="mt-3">
                {privacy.sections.cookies.paragraph2BeforeLink}{" "}
                <Link
                  href="/cookies#top"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  {privacy.sections.cookies.link}
                </Link>
                .
              </p>
            </section>


            {/* 13 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.externalWebsites.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.externalWebsites.description}
              </p>
            </section>


            {/* 14 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950">
                {privacy.sections.changes.title}
              </h2>

              <p className="mt-4">
                {privacy.sections.changes.description}
              </p>
            </section>


            {/* 15 */}
            <section>
              <div className="flex items-center gap-3">
                <Mail size={21} className="text-blue-600" />

                <h2 className="text-xl font-bold text-slate-950">
                  {privacy.sections.contact.title}
                </h2>
              </div>

              <p className="mt-4">
                {privacy.sections.contact.description}
              </p>

              <a
                href="mailto:info@hostmetric.gr"
                className="mt-3 inline-block font-semibold text-blue-600 hover:text-blue-800"
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