import Link from "next/link";
import { cookies } from "next/headers";

import FooterGetStartedCta from "@/components/footer-get-started-cta";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  getDictionary,
} from "@/i18n/get-dictionary";

import {
  getLocalizedPath,
} from "@/i18n/routing";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


export default async function Footer() {

  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

  const cookieStore =
    await cookies();


  const savedLocale =
    cookieStore.get(
      "hostmetric_locale"
    )?.value;


  let currentLocale: Locale =
    defaultLocale;


  if (
    savedLocale &&
    isSupportedLocale(
      savedLocale
    )
  ) {
    currentLocale =
      savedLocale;
  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  const footer =
    dictionary.footer;


  /* =========================================================
     RESPONSIVE FOOTER
     Mobile-first presentation. Routes, contact details,
     translations and server-side locale logic remain unchanged.
  ========================================================= */

  return (
    <footer
      className="
        overflow-hidden
        bg-slate-950
        text-white
      "
    >

      {/* ==========================================
          MAIN FOOTER
      ========================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-14
          sm:px-6
          sm:py-16
          md:px-8
          md:py-20
        "
      >

        <div
          className="
            grid
            gap-10
            sm:gap-12
            md:grid-cols-2
            md:gap-14
            lg:grid-cols-5
          "
        >

          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="
              min-w-0
              md:col-span-2
              lg:col-span-2
            "
          >

            <Link
              href={`${getLocalizedPath("/", currentLocale)}#top`}
              className="
                inline-block
                text-3xl
                font-black
                tracking-tight
                transition
                hover:text-blue-400
                sm:text-[2rem]
              "
            >
              HostMetric
            </Link>


            <p
              className="
                mt-5
                max-w-md
                text-base
                leading-7
                text-slate-400
                sm:mt-6
                sm:text-lg
                sm:leading-8
              "
            >
              {footer.brandDescription}
            </p>


            <FooterGetStartedCta
              label={
                footer.getStarted
              }
            />

          </div>


          {/* =================================================
              SERVICES
          ================================================= */}

          <div className="min-w-0">

            <h3
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-400
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {footer.services.title}
            </h3>


            <div
              className="
                mt-5
                flex
                flex-col
                gap-3.5
                text-sm
                text-slate-300
                sm:mt-6
                sm:gap-4
                sm:text-base
              "
            >

              <Link
                href={getLocalizedPath("/insights/occupancy", currentLocale)}
                className="
                  w-fit
                  max-w-full
                  break-words
                  transition
                  hover:text-blue-400
                "
              >
                {
                  footer.services
                    .propertyManagement
                }
              </Link>


              <Link
                href={getLocalizedPath("/services/smart-pricing", currentLocale)}
                className="
                  w-fit
                  max-w-full
                  break-words
                  transition
                  hover:text-blue-400
                "
              >
                {
                  footer.services
                    .smartPricing
                }
              </Link>


              <Link
                href={getLocalizedPath("/services/guest-communication", currentLocale)}
                className="
                  w-fit
                  max-w-full
                  break-words
                  transition
                  hover:text-blue-400
                "
              >
                {
                  footer.services
                    .guestCommunication
                }
              </Link>


              <Link
                href={getLocalizedPath("/services/booking-management", currentLocale)}
                className="
                  w-fit
                  max-w-full
                  break-words
                  transition
                  hover:text-blue-400
                "
              >
                {
                  footer.services
                    .bookingManagement
                }
              </Link>

            </div>

          </div>


          {/* =================================================
              COMPANY
          ================================================= */}

          <div className="min-w-0">

            <h3
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-400
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {footer.company.title}
            </h3>


            <div
              className="
                mt-5
                flex
                flex-col
                gap-3.5
                text-sm
                text-slate-300
                sm:mt-6
                sm:gap-4
                sm:text-base
              "
            >

              <Link
                href={getLocalizedPath("/about", currentLocale)}
                className="
                  w-fit
                  transition
                  hover:text-blue-400
                "
              >
                {footer.company.about}
              </Link>


              <Link
                href={`${getLocalizedPath("/", currentLocale)}#how-it-works`}
                className="
                  w-fit
                  transition
                  hover:text-blue-400
                "
              >
                {
                  footer.company
                    .howItWorks
                }
              </Link>


              <Link
                href={getLocalizedPath("/pricing", currentLocale)}
                className="
                  w-fit
                  transition
                  hover:text-blue-400
                "
              >
                {footer.company.pricing}
              </Link>


              <Link
                href={getLocalizedPath("/contact", currentLocale)}
                className="
                  w-fit
                  font-semibold
                  text-white
                  transition
                  hover:text-blue-400
                "
              >
                {footer.company.contact}
              </Link>

            </div>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <div
            className="
              min-w-0
              md:col-span-2
              lg:col-span-1
            "
          >

            <h3
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-blue-400
                sm:text-sm
                sm:tracking-[0.2em]
              "
            >
              {footer.contact.title}
            </h3>


            <div
              className="
                mt-5
                grid
                gap-5
                sm:mt-6
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-1
                lg:space-y-1
              "
            >

              {/* ==========================================
                  GREECE
              ========================================== */}

              <div className="min-w-0">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-500
                  "
                >
                  <MapPin
                    size={16}
                    className="shrink-0"
                  />

                  <span className="break-words">
                    {footer.contact.greece}
                  </span>
                </div>


                <a
                  href="tel:+306943404641"
                  className="
                    mt-2
                    flex
                    w-fit
                    max-w-full
                    items-center
                    gap-2
                    font-semibold
                    text-slate-200
                    transition
                    hover:text-blue-400
                  "
                >
                  <Phone
                    size={17}
                    className="shrink-0"
                  />

                  <span className="whitespace-nowrap">
                    +30 694 340 4641
                  </span>
                </a>

              </div>


              {/* ==========================================
                  CYPRUS
              ========================================== */}

              <div className="min-w-0">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-500
                  "
                >
                  <MapPin
                    size={16}
                    className="shrink-0"
                  />

                  <span className="break-words">
                    {footer.contact.cyprus}
                  </span>
                </div>


                <a
                  href="tel:+35799807870"
                  className="
                    mt-2
                    flex
                    w-fit
                    max-w-full
                    items-center
                    gap-2
                    font-semibold
                    text-slate-200
                    transition
                    hover:text-blue-400
                  "
                >
                  <Phone
                    size={17}
                    className="shrink-0"
                  />

                  <span className="whitespace-nowrap">
                    +357 99 80 78 70
                  </span>
                </a>

              </div>


              {/* ==========================================
                  EMAIL
              ========================================== */}

              <div className="min-w-0">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-500
                  "
                >
                  <Mail
                    size={16}
                    className="shrink-0"
                  />

                  <span>
                    Email
                  </span>
                </div>


                <a
                  href="mailto:info@hostmetric.gr"
                  className="
                    mt-2
                    flex
                    w-fit
                    max-w-full
                    items-center
                    gap-2
                    break-all
                    font-semibold
                    text-slate-300
                    transition
                    hover:text-blue-400
                    sm:break-normal
                  "
                >
                  <Mail
                    size={17}
                    className="shrink-0"
                  />

                  info@hostmetric.gr
                </a>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM FOOTER
        ================================================= */}

        <div
          className="
            mt-12
            border-t
            border-white/10
            pt-6
            sm:mt-14
            sm:pt-7
            md:mt-16
            md:pt-8
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              text-sm
              leading-6
              text-slate-500
              md:flex-row
              md:items-center
              md:justify-between
              md:gap-6
            "
          >

            <p
              className="
                max-w-xl
                break-words
              "
            >
              ©{" "}
              {new Date().getFullYear()}{" "}
              HostMetric.{" "}
              {footer.copyright}
            </p>


            <div
              className="
                flex
                flex-wrap
                gap-x-5
                gap-y-3
                sm:gap-x-6
              "
            >

              <Link
                href={getLocalizedPath("/privacy-policy", currentLocale)}
                className="
                  transition
                  hover:text-white
                "
              >
                {footer.legal.privacy}
              </Link>


              <Link
                href={getLocalizedPath("/terms", currentLocale)}
                className="
                  transition
                  hover:text-white
                "
              >
                {footer.legal.terms}
              </Link>


              <Link
                href={getLocalizedPath("/cookies", currentLocale)}
                className="
                  transition
                  hover:text-white
                "
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
