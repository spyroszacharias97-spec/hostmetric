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

import {
  getLocalizedPath,
} from "@/i18n/routing";

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


  /* ==========================================
     LOCALIZED SERVICE ROUTES
  ========================================== */

  const guestCommunicationPath =
    getLocalizedPath(
      "/services/guest-communication",
      currentLocale
    );

  const smartPricingPath =
    getLocalizedPath(
      "/services/smart-pricing",
      currentLocale
    );

  const bookingManagementPath =
    getLocalizedPath(
      "/services/booking-management",
      currentLocale
    );

  return (
    <section
      id="services"
      className="
        relative
        scroll-mt-20
        overflow-hidden
        bg-gradient-to-b
        from-[#f7fbff]
        via-white
        to-[#f7fbff]
        px-4
        py-16
        sm:px-6
        sm:py-20
        md:px-8
        md:py-24
        lg:py-28
        xl:py-32
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
            -left-32
            top-12
            h-[280px]
            w-[280px]
            rounded-full
            bg-blue-100/35
            blur-3xl
            sm:-left-40
            sm:top-20
            sm:h-[360px]
            sm:w-[360px]
            lg:h-[420px]
            lg:w-[420px]
          "
        />

        {/* GREEN SOFT GLOW */}
        <div
          className="
            absolute
            -right-32
            bottom-6
            h-[280px]
            w-[280px]
            rounded-full
            bg-emerald-100/35
            blur-3xl
            sm:-right-40
            sm:bottom-10
            sm:h-[360px]
            sm:w-[360px]
            lg:h-[420px]
            lg:w-[420px]
          "
        />

        {/* TOP CURVED LINES */}
        <div
          className="
            absolute
            left-[-18%]
            top-20
            h-44
            w-[136%]
            rounded-[50%]
            border
            border-blue-200/35
            sm:left-[-12%]
            sm:h-56
            sm:w-[124%]
            lg:left-[-10%]
            lg:h-64
            lg:w-[120%]
          "
        />

        <div
          className="
            absolute
            left-[-15%]
            top-28
            h-44
            w-[130%]
            rounded-[50%]
            border
            border-blue-200/25
            sm:left-[-10%]
            sm:h-56
            sm:w-[120%]
            lg:left-[-8%]
            lg:h-64
            lg:w-[116%]
          "
        />

        <div
          className="
            absolute
            left-[-12%]
            top-36
            h-44
            w-[124%]
            rounded-[50%]
            border
            border-emerald-200/20
            sm:left-[-8%]
            sm:h-56
            sm:w-[116%]
            lg:left-[-6%]
            lg:h-64
            lg:w-[112%]
          "
        />

      </div>


      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-12 md:mb-14 lg:mb-16">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
            {services.eyebrow}
          </p>

          <h2
            className="
              text-[2.25rem]
              font-bold
              leading-[1.08]
              tracking-[-0.03em]
              text-slate-950
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            {services.title}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            {services.description}
          </p>

        </div>


        {/* SERVICE CARDS */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">

          {/* GUEST COMMUNICATION */}
          <Link
            href={guestCommunicationPath}
            className="
              group
              cursor-pointer
              rounded-[24px]
              border
              border-blue-100
              bg-white/90
              p-6
              text-center
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-200
              hover:shadow-xl
              sm:rounded-[28px]
              sm:p-8
              lg:rounded-[32px]
              lg:p-10
              lg:hover:-translate-y-3
              lg:hover:scale-[1.03]
              lg:hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
                transition
                duration-300
                group-hover:scale-105
                sm:mb-6
                sm:h-18
                sm:w-18
                sm:rounded-3xl
                lg:mb-7
                lg:h-20
                lg:w-20
                lg:group-hover:scale-110
                lg:group-hover:rotate-3
              "
            >
              <MessageCircle
                size={32}
                strokeWidth={2}
                className="sm:h-9 sm:w-9 lg:h-[38px] lg:w-[38px]"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">
              {
                services.guestCommunication
                  .title
              }
            </h3>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              {
                services.guestCommunication
                  .description
              }
            </p>

            <ArrowRight
              size={23}
              className="
                mx-auto
                mt-5
                text-blue-600
                transition
                duration-300
                group-hover:translate-x-1
                sm:mt-6
                lg:mt-7
                lg:group-hover:translate-x-2
              "
            />

          </Link>


          {/* SMART PRICING */}
          <Link
            href={smartPricingPath}
            className="
              group
              cursor-pointer
              rounded-[24px]
              border
              border-emerald-100
              bg-white/90
              p-6
              text-center
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-200
              hover:shadow-xl
              sm:rounded-[28px]
              sm:p-8
              lg:rounded-[32px]
              lg:p-10
              lg:hover:-translate-y-3
              lg:hover:scale-[1.03]
              lg:hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600
                transition
                duration-300
                group-hover:scale-105
                sm:mb-6
                sm:h-18
                sm:w-18
                sm:rounded-3xl
                lg:mb-7
                lg:h-20
                lg:w-20
                lg:group-hover:scale-110
                lg:group-hover:-rotate-3
              "
            >
              <TrendingUp
                size={32}
                strokeWidth={2}
                className="sm:h-9 sm:w-9 lg:h-[38px] lg:w-[38px]"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">
              {services.smartPricing.title}
            </h3>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              {
                services.smartPricing
                  .description
              }
            </p>

            <ArrowRight
              size={23}
              className="
                mx-auto
                mt-5
                text-emerald-600
                transition
                duration-300
                group-hover:translate-x-1
                sm:mt-6
                lg:mt-7
                lg:group-hover:translate-x-2
              "
            />

          </Link>


          {/* BOOKING MANAGEMENT */}
          <Link
            href={bookingManagementPath}
            className="
              group
              cursor-pointer
              rounded-[24px]
              border
              border-purple-100
              bg-white/90
              p-6
              text-center
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-purple-200
              hover:shadow-xl
              sm:rounded-[28px]
              sm:p-8
              md:col-span-2
              lg:col-span-1
              lg:rounded-[32px]
              lg:p-10
              lg:hover:-translate-y-3
              lg:hover:scale-[1.03]
              lg:hover:shadow-2xl
            "
          >

            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-purple-50
                text-purple-600
                transition
                duration-300
                group-hover:scale-105
                sm:mb-6
                sm:h-18
                sm:w-18
                sm:rounded-3xl
                lg:mb-7
                lg:h-20
                lg:w-20
                lg:group-hover:scale-110
                lg:group-hover:rotate-3
              "
            >
              <CalendarDays
                size={32}
                strokeWidth={2}
                className="sm:h-9 sm:w-9 lg:h-[38px] lg:w-[38px]"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">
              {
                services.bookingManagement
                  .title
              }
            </h3>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              {
                services.bookingManagement
                  .description
              }
            </p>

            <ArrowRight
              size={23}
              className="
                mx-auto
                mt-5
                text-purple-600
                transition
                duration-300
                group-hover:translate-x-1
                sm:mt-6
                lg:mt-7
                lg:group-hover:translate-x-2
              "
            />

          </Link>

        </div>

      </div>

    </section>
  );
}
