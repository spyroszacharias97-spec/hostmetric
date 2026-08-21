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
      className="
        relative
        scroll-mt-28
        overflow-hidden
        bg-gradient-to-b
        from-[#f7fbff]
        via-white
        to-[#f7fbff]
        px-6
        py-28
        md:px-8
        md:py-32
      "
    >

      {/* ========================================
          BACKGROUND DECORATION
      ======================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* BLUE SOFT GLOW */}
        <div
          className="
            absolute
            -left-40
            top-20
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-100/40
            blur-3xl
          "
        />

        {/* GREEN SOFT GLOW */}
        <div
          className="
            absolute
            -right-40
            bottom-10
            h-[420px]
            w-[420px]
            rounded-full
            bg-emerald-100/40
            blur-3xl
          "
        />

        {/* TOP CURVED LINES */}
        <div
          className="
            absolute
            left-[-10%]
            top-20
            h-64
            w-[120%]
            rounded-[50%]
            border
            border-blue-200/40
          "
        />

        <div
          className="
            absolute
            left-[-8%]
            top-28
            h-64
            w-[116%]
            rounded-[50%]
            border
            border-blue-200/30
          "
        />

        <div
          className="
            absolute
            left-[-6%]
            top-36
            h-64
            w-[112%]
            rounded-[50%]
            border
            border-emerald-200/25
          "
        />

      </div>


      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mx-auto mb-16 max-w-4xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            {services.eyebrow}
          </p>

          <h2
            className="
              text-4xl
              font-bold
              tracking-tight
              text-slate-950
              sm:text-5xl
              lg:text-6xl
            "
          >
            {services.title}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {services.description}
          </p>

        </div>


        {/* SERVICE CARDS */}
        <div className="grid gap-7 md:grid-cols-3">

          {/* GUEST COMMUNICATION */}
          <Link
            href="/services/guest-communication"
            className="
              group
              cursor-pointer
              rounded-[32px]
              border
              border-blue-100
              bg-white/90
              p-10
              text-center
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-3
              hover:scale-[1.03]
              hover:border-blue-200
              hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                mb-7
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-blue-50
                text-blue-600
                transition
                duration-300
                group-hover:scale-110
                group-hover:rotate-3
              "
            >
              <MessageCircle
                size={38}
                strokeWidth={2}
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-950">
              {
                services.guestCommunication
                  .title
              }
            </h3>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {
                services.guestCommunication
                  .description
              }
            </p>

            <ArrowRight
              size={25}
              className="
                mx-auto
                mt-7
                text-blue-600
                transition
                duration-300
                group-hover:translate-x-2
              "
            />

          </Link>


          {/* SMART PRICING */}
          <Link
            href="/services/smart-pricing"
            className="
              group
              cursor-pointer
              rounded-[32px]
              border
              border-emerald-100
              bg-white/90
              p-10
              text-center
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-3
              hover:scale-[1.03]
              hover:border-emerald-200
              hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                mb-7
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-emerald-50
                text-emerald-600
                transition
                duration-300
                group-hover:scale-110
                group-hover:-rotate-3
              "
            >
              <TrendingUp
                size={38}
                strokeWidth={2}
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-950">
              {services.smartPricing.title}
            </h3>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {
                services.smartPricing
                  .description
              }
            </p>

            <ArrowRight
              size={25}
              className="
                mx-auto
                mt-7
                text-emerald-600
                transition
                duration-300
                group-hover:translate-x-2
              "
            />

          </Link>


          {/* BOOKING MANAGEMENT */}
          <Link
            href="/services/booking-management"
            className="
              group
              cursor-pointer
              rounded-[32px]
              border
              border-purple-100
              bg-white/90
              p-10
              text-center
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-3
              hover:scale-[1.03]
              hover:border-purple-200
              hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                mb-7
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-purple-50
                text-purple-600
                transition
                duration-300
                group-hover:scale-110
                group-hover:rotate-3
              "
            >
              <CalendarDays
                size={38}
                strokeWidth={2}
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-950">
              {
                services.bookingManagement
                  .title
              }
            </h3>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {
                services.bookingManagement
                  .description
              }
            </p>

            <ArrowRight
              size={25}
              className="
                mx-auto
                mt-7
                text-purple-600
                transition
                duration-300
                group-hover:translate-x-2
              "
            />

          </Link>

        </div>

      </div>

    </section>
  );
}