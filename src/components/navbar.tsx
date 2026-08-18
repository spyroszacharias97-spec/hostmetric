"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Languages,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  localeFlags,
  localeNames,
  locales,
  type Locale,
} from "@/i18n/config";


type NavigationDictionary = {
  services: string;
  howItWorks: string;
  pricing: string;
  about: string;
  contact: string;
  getStarted: string;
  language: string;
  selectLanguage: string;
  homeAriaLabel: string;
  logoAlt: string;
};


const fallbackNavigation: NavigationDictionary = {
  services: "Services",
  howItWorks: "How It Works",
  pricing: "Pricing",
  about: "About",
  contact: "Contact",
  getStarted: "Get Started",
  language: "Language",
  selectLanguage: "Select language",
  homeAriaLabel: "HostMetric homepage",
  logoAlt: "HostMetric Property Management",
};


export default function Navbar() {
  const [languageOpen, setLanguageOpen] =
    useState(false);

  const [currentLocale, setCurrentLocale] =
    useState<Locale>(defaultLocale);

  const [navigation, setNavigation] =
    useState<NavigationDictionary>(
      fallbackNavigation
    );

  const languageMenuRef =
    useRef<HTMLDivElement>(null);


  /* ==========================================
     LOAD LANGUAGE + NAVIGATION DICTIONARY
  ========================================== */

  useEffect(() => {
    async function loadInitialLanguage() {
      const cookieLocale =
        document.cookie
          .split("; ")
          .find((item) =>
            item.startsWith(
              "hostmetric_locale="
            )
          )
          ?.split("=")[1];


      let locale: Locale =
        defaultLocale;


      if (
        cookieLocale &&
        isSupportedLocale(cookieLocale)
      ) {
        locale = cookieLocale;
      }


      setCurrentLocale(locale);


      try {
        const dictionary =
          await getDictionary(locale);

        if (
          (dictionary as any)
            .navigation
        ) {
          setNavigation(
            (dictionary as any)
              .navigation
          );
        }
      } catch (error) {
        console.error(
          "Navigation translation error:",
          error
        );
      }
    }


    loadInitialLanguage();

  }, []);


  /* ==========================================
     CLOSE LANGUAGE MENU WHEN CLICKING OUTSIDE
  ========================================== */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setLanguageOpen(false);
      }
    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, []);


  /* ==========================================
     CHANGE LANGUAGE
  ========================================== */

  async function changeLanguage(
    locale: Locale
  ) {
    setLanguageOpen(false);


    try {
      /* SAVE COOKIE */

      const response = await fetch(
        "/api/locale",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            locale,
          }),
        }
      );


      if (!response.ok) {
        console.error(
          "Could not save language preference."
        );

        return;
      }


      /* LOAD NEW DICTIONARY */

      const dictionary =
        await getDictionary(locale);


      setCurrentLocale(locale);


      if (
        (dictionary as any)
          .navigation
      ) {
        setNavigation(
          (dictionary as any)
            .navigation
        );
      }


      /* RELOAD PAGE SO ALL SERVER COMPONENTS USE THE NEW LOCALE */
      window.location.reload();


      /*
        NEXT ROUTING STEP:

        Greek:
        /
        /pricing
        /contact

        Other languages:
        /en
        /en/pricing
        /de
        /de/pricing
        etc.

        We will connect URL routing after the
        translation migration is complete.
      */

    } catch (error) {
      console.error(
        "Language preference error:",
        error
      );
    }
  }


  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">

      <nav className="mx-auto flex h-[105px] max-w-[1600px] items-center justify-between px-10">

        {/* ==========================================
            LOGO
        ========================================== */}

        <Link
          href="/"
          className="group flex cursor-pointer items-center"
          aria-label={
            navigation.homeAriaLabel
          }
        >

          <Image
            src="/hostmetric-logo.png"
            alt={navigation.logoAlt}
            width={185}
            height={90}
            priority
            className="h-[84px] w-auto object-contain transition duration-300 group-hover:scale-[1.04]"
          />

        </Link>


        {/* ==========================================
            CENTER NAVIGATION
        ========================================== */}

        <div className="hidden items-center gap-11 lg:flex">

          <Link
            href="/#services"
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.services}
          </Link>


          <Link
            href="/#how-it-works"
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.howItWorks}
          </Link>


          <Link
            href="/pricing"
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.pricing}
          </Link>


          <Link
            href="/about"
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.about}
          </Link>


          <Link
            href="/contact"
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.contact}
          </Link>

        </div>


        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="flex items-center gap-4">

          {/* ========================================
              LANGUAGE SELECTOR
          ======================================== */}

          <div
            ref={languageMenuRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setLanguageOpen(
                  (open) => !open
                )
              }
              className="flex h-[56px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 font-semibold text-slate-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
              aria-label={
                navigation.selectLanguage
              }
              aria-expanded={
                languageOpen
              }
            >

              <span className="text-xl">
                {
                  localeFlags[
                    currentLocale
                  ]
                }
              </span>


              <span className="hidden xl:inline">
                {currentLocale.toUpperCase()}
              </span>


              <ChevronDown
                size={17}
                className={`transition duration-300 ${
                  languageOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>


            {/* DROPDOWN */}

            {languageOpen && (
              <div className="absolute right-0 top-[68px] z-[200] w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">

                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3">

                  <Languages
                    size={18}
                    className="text-blue-600"
                  />


                  <p className="text-sm font-bold text-slate-900">
                    {navigation.language}
                  </p>

                </div>


                <div className="mt-2 max-h-[420px] overflow-y-auto">

                  {locales.map(
                    (locale) => {
                      const active =
                        locale ===
                        currentLocale;


                      return (
                        <button
                          key={locale}
                          type="button"
                          onClick={() =>
                            changeLanguage(
                              locale
                            )
                          }
                          className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                            active
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <span className="text-xl">
                              {
                                localeFlags[
                                  locale
                                ]
                              }
                            </span>


                            <div>

                              <p className="text-sm font-semibold">
                                {
                                  localeNames[
                                    locale
                                  ]
                                }
                              </p>


                              <p className="mt-0.5 text-xs uppercase text-slate-400">
                                {locale}
                              </p>

                            </div>

                          </div>


                          {active && (
                            <Check
                              size={17}
                              className="text-blue-600"
                            />
                          )}

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

          </div>


          {/* ========================================
              CTA
          ======================================== */}

          <Link
            href="/get-started"
            className="cursor-pointer rounded-2xl bg-black px-8 py-4 text-[17px] font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl"
          >
            {navigation.getStarted} →
          </Link>

        </div>

      </nav>

    </header>
  );
}