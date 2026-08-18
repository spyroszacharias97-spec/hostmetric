import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function SmarterDistributionPage() {
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

  const dictionary =
    await getDictionary(currentLocale);

  const smarterDistribution =
    dictionary.smarterDistributionPage;

  return (
    <main>

      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/details/distribution.jpg')",
        }}
      >

        <div className="absolute inset-0 bg-black/70" />


        <div className="relative z-10 mx-auto max-w-6xl px-8 py-24 text-white">

          <Link
            href="/"
            className="inline-block text-lg font-medium transition hover:text-blue-300"
          >
            ← {smarterDistribution.back}
          </Link>


          <div className="mt-28 max-w-4xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              {smarterDistribution.eyebrow}
            </p>


            <h1 className="mt-6 text-6xl font-bold leading-tight">
              {smarterDistribution.title}
            </h1>


            <p className="mt-8 text-2xl leading-10 text-gray-200">
              {smarterDistribution.description}
            </p>


            <div className="mt-14 grid gap-6 md:grid-cols-2">

              <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                <h2 className="text-2xl font-bold">
                  {smarterDistribution.cards.adr.title}
                </h2>

                <p className="mt-4 text-lg leading-8 text-gray-200">
                  {smarterDistribution.cards.adr.description}
                </p>

              </div>


              <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                <h2 className="text-2xl font-bold">
                  {smarterDistribution.cards.revpan.title}
                </h2>

                <p className="mt-4 text-lg leading-8 text-gray-200">
                  {smarterDistribution.cards.revpan.description}
                </p>

              </div>


              <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                <h2 className="text-2xl font-bold">
                  {
                    smarterDistribution.cards
                      .priceElasticity.title
                  }
                </h2>

                <p className="mt-4 text-lg leading-8 text-gray-200">
                  {
                    smarterDistribution.cards
                      .priceElasticity.description
                  }
                </p>

              </div>


              <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                <h2 className="text-2xl font-bold">
                  {
                    smarterDistribution.cards
                      .competitivePositioning.title
                  }
                </h2>

                <p className="mt-4 text-lg leading-8 text-gray-200">
                  {
                    smarterDistribution.cards
                      .competitivePositioning.description
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}