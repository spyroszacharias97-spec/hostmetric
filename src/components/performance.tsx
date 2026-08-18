import Link from "next/link";
import { cookies } from "next/headers";

import {
  MessagesSquare,
  Network,
  BrainCircuit,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function Performance() {
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

  const performance =
    dictionary.performance;

  return (
    <section className="overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-28 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mx-auto mb-16 max-w-5xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
            {performance.eyebrow}
          </p>

          <h2 className="text-5xl font-bold tracking-tight">
            {performance.titleLine1}

            <br />

            {performance.titleLine2}
          </h2>

        </div>


        {/* PERFORMANCE CARDS */}
        <div className="grid gap-8 md:grid-cols-3">

          {/* GUEST RESPONSE */}
          <Link
            href="/performance/guest-response"
            className="group cursor-pointer rounded-[2.5rem] bg-white/15 p-10 text-center backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
          >

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 transition duration-300 group-hover:scale-110 group-hover:rotate-3">

              <MessagesSquare
                size={48}
              />

            </div>

            <p className="mt-8 text-4xl font-bold">
              &lt; 1h
            </p>

            <p className="mt-3 text-lg font-medium text-blue-100">
              {
                performance.guestResponse
                  .label
              }
            </p>

            <p className="mt-6 text-sm font-semibold text-white/70 transition group-hover:text-white">
              {
                performance.guestResponse
                  .explore
              }{" "}
              →
            </p>

          </Link>


          {/* PLATFORM NETWORK */}
          <Link
            href="/performance/platform-network"
            className="group cursor-pointer rounded-[2.5rem] bg-white/15 p-10 text-center backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
          >

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 transition duration-300 group-hover:scale-110 group-hover:-rotate-3">

              <Network
                size={48}
              />

            </div>

            <p className="mt-8 text-4xl font-bold">
              10+
            </p>

            <p className="mt-3 text-lg font-medium text-blue-100">
              {
                performance.platformNetwork
                  .label
              }
            </p>

            <p className="mt-6 text-sm font-semibold text-white/70 transition group-hover:text-white">
              {
                performance.platformNetwork
                  .explore
              }{" "}
              →
            </p>

          </Link>


          {/* PRICING ENGINE */}
          <Link
            href="/performance/pricing-engine"
            className="group cursor-pointer rounded-[2.5rem] bg-white/15 p-10 text-center backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
          >

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 transition duration-300 group-hover:scale-110 group-hover:rotate-3">

              <BrainCircuit
                size={48}
              />

            </div>

            <p className="mt-8 text-4xl font-bold">
              AI
            </p>

            <p className="mt-3 text-lg font-medium text-blue-100">
              {
                performance.pricingEngine
                  .label
              }
            </p>

            <p className="mt-6 text-sm font-semibold text-white/70 transition group-hover:text-white">
              {
                performance.pricingEngine
                  .explore
              }{" "}
              →
            </p>

          </Link>

        </div>

      </div>

    </section>
  );
}