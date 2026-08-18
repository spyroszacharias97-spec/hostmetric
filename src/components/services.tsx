import Link from "next/link";
import { cookies } from "next/headers";

import {
  MessageCircle,
  TrendingUp,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function Services() {
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

  const services =
    dictionary.services;

  return (
    <section
      id="services"
      className="px-8 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            {services.eyebrow}
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            {services.title}
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            {services.description}
          </p>

        </div>


        {/* SERVICE CARDS */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* GUEST COMMUNICATION */}
          <Link
            href="/services/guest-communication"
            className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl"
          >

            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
              <MessageCircle
                size={38}
                strokeWidth={2}
              />
            </div>

            <h3 className="text-2xl font-bold">
              {
                services.guestCommunication
                  .title
              }
            </h3>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {
                services.guestCommunication
                  .description
              }
            </p>

            <ArrowRight
              size={25}
              className="mx-auto mt-7 transition duration-300 group-hover:translate-x-2"
            />

          </Link>


          {/* SMART PRICING */}
          <Link
            href="/services/smart-pricing"
            className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl"
          >

            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600 transition duration-300 group-hover:scale-110 group-hover:-rotate-3">
              <TrendingUp
                size={38}
                strokeWidth={2}
              />
            </div>

            <h3 className="text-2xl font-bold">
              {services.smartPricing.title}
            </h3>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {
                services.smartPricing
                  .description
              }
            </p>

            <ArrowRight
              size={25}
              className="mx-auto mt-7 transition duration-300 group-hover:translate-x-2"
            />

          </Link>


          {/* BOOKING MANAGEMENT */}
          <Link
            href="/services/booking-management"
            className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl"
          >

            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-50 text-purple-600 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
              <CalendarDays
                size={38}
                strokeWidth={2}
              />
            </div>

            <h3 className="text-2xl font-bold">
              {
                services.bookingManagement
                  .title
              }
            </h3>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {
                services.bookingManagement
                  .description
              }
            </p>

            <ArrowRight
              size={25}
              className="mx-auto mt-7 transition duration-300 group-hover:translate-x-2"
            />

          </Link>

        </div>

      </div>
    </section>
  );
}