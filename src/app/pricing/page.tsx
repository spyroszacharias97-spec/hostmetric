import Link from "next/link";
import { cookies } from "next/headers";
import AnimatedWave from "@/components/animated-wave";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function PricingPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const dictionary = await getDictionary(currentLocale);
  const pricing = dictionary.pricingPage;

  return (
    <main className="min-h-screen bg-[#f5fbff] text-[#111827]">

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">

        <AnimatedWave />

        <div className="relative z-10 mx-auto max-w-7xl text-center">

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
            {pricing.hero.eyebrow}
          </p>

          <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
            {pricing.hero.titleLine1}
            <br />
            {pricing.hero.titleLine2}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            {pricing.hero.description}
          </p>

        </div>

      </section>


      {/* MAIN PRICING CARD */}
      <section className="px-6 pb-24 md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-[36px] bg-[#10214a] text-white shadow-2xl">

            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

              {/* PRICE */}
              <div className="flex flex-col justify-between border-b border-white/10 p-8 md:p-12 lg:border-b-0 lg:border-r">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                    {pricing.pricingCard.eyebrow}
                  </p>

                  <div className="mt-7 flex items-end gap-3">
                    <span className="text-7xl font-bold tracking-tight md:text-8xl">
                      11%
                    </span>
                  </div>

                  <p className="mt-3 text-lg text-white/70">
                    {pricing.pricingCard.revenueLabel}
                  </p>

                  <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    {pricing.pricingCard.zeroRegistrationFee}
                  </div>

                  <p className="mt-8 max-w-md text-lg leading-8 text-white/70">
                    {pricing.pricingCard.description}
                  </p>

                </div>

                <Link
                  href="/get-started"
                  className="mt-10 inline-flex w-fit items-center justify-center rounded-2xl bg-[#2166f3] px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#1857da]"
                >
                  {pricing.pricingCard.button} →
                </Link>

              </div>


              {/* SUMMARY */}
              <div className="p-8 md:p-12">

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                  {pricing.pricingCard.summaryEyebrow}
                </p>

                <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
                  {pricing.pricingCard.summaryTitle}
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                  {pricing.pricingCard.summaryDescription}
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">

                  {pricing.pricingCard.summaryItems.map((item: string) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2166f3] text-xs font-bold">
                        ✓
                      </span>

                      <span className="font-medium">
                        {item}
                      </span>
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* SERVICES */}
      <section className="bg-white px-6 py-24 md:px-10 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
              {pricing.includedSection.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
              {pricing.includedSection.title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {pricing.includedSection.description}
            </p>

          </div>


          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {pricing.includedServices.map(
              (
                service: {
                  title: string;
                  text: string;
                },
                index: number
              ) => (
                <div
                  key={service.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="mb-8 flex items-center justify-between">

                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-[#2166f3]">
                      ✓
                    </span>

                    <span className="text-sm font-bold text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                  <h3 className="text-xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {service.text}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </section>


      {/* PARTNERS */}
      <section className="px-6 py-24 md:px-10 md:py-32">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-[36px] border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-8 md:p-14">

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2166f3]">
              {pricing.partners.eyebrow}
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              {pricing.partners.title}
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {pricing.partners.description}
            </p>


            <div className="mt-10 grid gap-5 md:grid-cols-2">

              <div className="rounded-[26px] bg-white p-7 shadow-sm">

                <div className="text-3xl">
                  📸
                </div>

                <h3 className="mt-5 text-2xl font-bold">
                  {pricing.partners.photography.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {pricing.partners.photography.description}
                </p>

              </div>


              <div className="rounded-[26px] bg-white p-7 shadow-sm">

                <div className="text-3xl">
                  🌐
                </div>

                <h3 className="mt-5 text-2xl font-bold">
                  {pricing.partners.website.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {pricing.partners.website.description}
                </p>

              </div>

            </div>


            <p className="mt-7 text-sm leading-6 text-slate-500">
              {pricing.partners.disclaimer}
            </p>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="bg-[#2166f3] px-6 py-24 text-white md:px-10 md:py-28">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
            {pricing.cta.eyebrow}
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {pricing.cta.titleLine1}
            <br />
            {pricing.cta.titleLine2}
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-blue-100">
            {pricing.cta.description}
          </p>

          <Link
            href="/get-started"
            className="mt-10 inline-flex rounded-2xl bg-white px-9 py-4 text-lg font-bold text-[#2166f3] transition hover:-translate-y-1 hover:shadow-xl"
          >
            {pricing.cta.button} →
          </Link>

        </div>

      </section>

    </main>
  );
}