import Link from "next/link";
import { cookies } from "next/headers";

import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function Footer() {
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

  const footer =
    dictionary.footer;


  return (
    <footer className="bg-slate-950 text-white">

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-8 py-20">

        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-5">

          {/* =================================================
              BRAND
          ================================================= */}
          <div className="lg:col-span-2">

            <Link
              href="/#top"
              className="inline-block text-3xl font-black tracking-tight transition hover:text-blue-400"
            >
              HostMetric
            </Link>


            <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
              {footer.brandDescription}
            </p>


            <Link
              href="/get-started"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-lg"
            >
              {footer.getStarted}

              <ArrowUpRight size={18} />
            </Link>

          </div>


          {/* =================================================
              SERVICES
          ================================================= */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              {footer.services.title}
            </h3>


            <div className="mt-6 flex flex-col gap-4 text-slate-300">

              <Link
                href="/insights/occupancy"
                className="transition hover:text-blue-400"
              >
                {footer.services.propertyManagement}
              </Link>


              <Link
                href="/services/smart-pricing"
                className="transition hover:text-blue-400"
              >
                {footer.services.smartPricing}
              </Link>


              <Link
                href="/services/guest-communication"
                className="transition hover:text-blue-400"
              >
                {footer.services.guestCommunication}
              </Link>


              <Link
                href="/services/booking-management"
                className="transition hover:text-blue-400"
              >
                {footer.services.bookingManagement}
              </Link>

            </div>

          </div>


          {/* =================================================
              COMPANY
          ================================================= */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              {footer.company.title}
            </h3>


            <div className="mt-6 flex flex-col gap-4 text-slate-300">

              <Link
                href="/about"
                className="transition hover:text-blue-400"
              >
                {footer.company.about}
              </Link>


              <Link
                href="/#how-it-works"
                className="transition hover:text-blue-400"
              >
                {footer.company.howItWorks}
              </Link>


              <Link
                href="/pricing"
                className="transition hover:text-blue-400"
              >
                {footer.company.pricing}
              </Link>


              <Link
                href="/contact"
                className="font-semibold text-white transition hover:text-blue-400"
              >
                {footer.company.contact}
              </Link>

            </div>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              {footer.contact.title}
            </h3>


            <div className="mt-6 space-y-6">

              {/* GREECE */}
              <div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />

                  {footer.contact.greece}
                </div>


                <a
                  href="tel:+306943404641"
                  className="mt-2 flex items-center gap-2 font-semibold text-slate-200 transition hover:text-blue-400"
                >
                  <Phone size={17} />

                  +30 694 340 4641
                </a>

              </div>


              {/* CYPRUS */}
              <div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />

                  {footer.contact.cyprus}
                </div>


                <a
                  href="tel:+35799807870"
                  className="mt-2 flex items-center gap-2 font-semibold text-slate-200 transition hover:text-blue-400"
                >
                  <Phone size={17} />

                  +357 99 80 78 70
                </a>

              </div>


              {/* EMAIL */}
              <a
                href="mailto:info@hostmetric.gr"
                className="flex items-center gap-2 text-slate-300 transition hover:text-blue-400"
              >
                <Mail size={17} />

                info@hostmetric.gr
              </a>

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM FOOTER
        ================================================= */}
        <div className="mt-16 border-t border-white/10 pt-8">

          <div className="flex flex-col gap-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

            <p>
              © {new Date().getFullYear()} HostMetric.{" "}
              {footer.copyright}
            </p>


            <div className="flex flex-wrap gap-6">

              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
                {footer.legal.privacy}
              </Link>


              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                {footer.legal.terms}
              </Link>


              <Link
                href="/cookies"
                className="transition hover:text-white"
              >
                {footer.legal.cookies}
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}