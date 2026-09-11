"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  GR,
  GB,
  DE,
  FR,
  IT,
  ES,
  PT,
  BG,
  PL,
  RS,
  TR,
  RU,
} from "country-flag-icons/react/3x2";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Languages,
  Menu,
  X,
} from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";
import elDictionary from "@/i18n/dictionaries/el.json";

import {
  getLocaleFromPathname,
  getLocalizedPath,
  switchPathLocale,
} from "@/i18n/routing";

import {
  defaultLocale,
  isSupportedLocale,
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
  blog?: string;
};


const fallbackNavigation: NavigationDictionary =
  elDictionary.navigation as NavigationDictionary;


/* ==========================================
   COUNTRY CODE SHOWN TO THE USER

   IMPORTANT:
   These are only visual country codes.

   The real locale codes remain:
   el, en, de, fr, it, es, pt, bg, pl, sr, tr, ru
========================================== */

const localeCountryCodes: Record<Locale, string> = {
  el: "GR",
  en: "GB",
  de: "DE",
  fr: "FR",
  it: "IT",
  es: "ES",
  pt: "PT",
  bg: "BG",
  pl: "PL",
  sr: "RS",
  tr: "TR",
  ru: "RU",
};


/* ==========================================
   SVG FLAG COMPONENTS SHOWN TO THE USER

   These are real SVG flags, so rendering does not
   depend on the operating system's emoji support.
========================================== */

const localeFlagComponents = {
  el: GR,
  en: GB,
  de: DE,
  fr: FR,
  it: IT,
  es: ES,
  pt: PT,
  bg: BG,
  pl: PL,
  sr: RS,
  tr: TR,
  ru: RU,
} satisfies Record<Locale, typeof GR>;


export default function Navbar() {
  const pathname = usePathname();

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [currentLocale, setCurrentLocale] =
    useState<Locale>(defaultLocale);

  const [navigation, setNavigation] =
    useState<NavigationDictionary>(
      fallbackNavigation
    );

  const languageMenuRef =
    useRef<HTMLDivElement>(null);

  const CurrentFlag =
    localeFlagComponents[currentLocale];


  /* ==========================================
     LOAD LANGUAGE + NAVIGATION DICTIONARY
  ========================================== */

  useEffect(() => {
    async function loadInitialLanguage() {
      const pathnameLocale =
        getLocaleFromPathname(
          window.location.pathname
        );


      const locale: Locale =
        pathnameLocale;


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
     MOBILE MENU BODY SCROLL
  ========================================== */

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileMenuOpen]);


  /* ==========================================
     SECTION NAVIGATION
  ========================================== */

  function navigateToSection(
    sectionId: string
  ) {
    setLanguageOpen(false);
    setMobileMenuOpen(false);

    const localizedHomePath =
      getLocalizedPath(
        "/",
        currentLocale
      );

    const scrollToTarget = () => {
      const target =
        document.getElementById(
          sectionId
        );

      if (!target) {
        return false;
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.replaceState(
        null,
        "",
        `${localizedHomePath}#${sectionId}`
      );

      return true;
    };


    const currentPathname =
      pathname ||
      window.location.pathname;

    const isHomePage =
      currentPathname ===
      localizedHomePath;


    if (isHomePage) {
      window.requestAnimationFrame(
        () => {
          window.requestAnimationFrame(
            () => {
              scrollToTarget();
            }
          );
        }
      );

      return;
    }


    window.location.href =
      `${localizedHomePath}#${sectionId}`;
  }


  /* ==========================================
     CHANGE LANGUAGE
  ========================================== */

  async function changeLanguage(
    locale: Locale
  ) {
    setLanguageOpen(false);
    setMobileMenuOpen(false);


    try {
      /* SAVE COOKIE */

      const response =
        await fetch(
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
      }


      /* BUILD SAME PAGE IN SELECTED LANGUAGE */

      const localizedPath =
        switchPathLocale(
          window.location.pathname,
          locale
        );

      const currentSearch =
        window.location.search;

      const currentHash =
        window.location.hash;


      /*
        Full navigation is intentional.

        The URL now becomes the primary
        language signal for SEO and routing.
      */

      window.location.href =
        `${localizedPath}${currentSearch}${currentHash}`;

    } catch (error) {
      console.error(
        "Language preference error:",
        error
      );
    }
  }


  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">

      <nav className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-4 sm:h-[84px] sm:px-6 lg:h-[105px] lg:px-10">

        {/* ==========================================
            LOGO
        ========================================== */}

        <Link
          href={getLocalizedPath("/", currentLocale)}
          className="group flex min-w-0 cursor-pointer items-center"
          aria-label={
            navigation.homeAriaLabel
          }
          onClick={() =>
            setMobileMenuOpen(false)
          }
        >

          <Image
            src="/hostmetric-logo.png"
            alt={navigation.logoAlt}
            width={185}
            height={90}
            priority
            className="h-[56px] w-auto max-w-[138px] object-contain transition duration-300 group-hover:scale-[1.04] sm:h-[62px] sm:max-w-[150px] lg:h-[84px] lg:max-w-none"
          />

        </Link>


        {/* ==========================================
            CENTER NAVIGATION
        ========================================== */}

        <div className="hidden items-center gap-7 xl:gap-9 lg:flex">

          <button
            type="button"
            onClick={() =>
              navigateToSection(
                "services"
              )
            }
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.services}
          </button>


          <button
            type="button"
            onClick={() =>
              navigateToSection(
                "how-it-works"
              )
            }
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.howItWorks}
          </button>


          <Link
            href={getLocalizedPath("/faq", currentLocale)}
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.pricing}
          </Link>


          <Link
            href={getLocalizedPath("/blog", currentLocale)}
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.blog ?? "Blog"}
          </Link>


          <Link
            href={getLocalizedPath("/about", currentLocale)}
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.about}
          </Link>


          <Link
            href={getLocalizedPath("/contact", currentLocale)}
            className="cursor-pointer text-[17px] font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:text-blue-600"
          >
            {navigation.contact}
          </Link>

        </div>


        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">

          {/* ========================================
              LANGUAGE SELECTOR
          ======================================== */}

          <div
            ref={languageMenuRef}
            className="relative"
          >

            {/* SELECTED LANGUAGE BUTTON */}

            <button
              type="button"
              onClick={() => {
                setLanguageOpen(
                  (open) => !open
                );
              }}
              className="flex h-[44px] min-w-[58px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 font-semibold text-slate-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md sm:h-[50px] sm:min-w-0 sm:justify-start sm:gap-2 sm:px-3 lg:h-[56px] lg:gap-2.5 lg:rounded-2xl lg:px-4"
              aria-label={
                navigation.selectLanguage
              }
              aria-expanded={
                languageOpen
              }
            >

              {/* COUNTRY CODE */}

              <span className="text-[13px] font-bold leading-none sm:text-[14px] lg:text-[15px]">
                {
                  localeCountryCodes[
                    currentLocale
                  ]
                }
              </span>


              {/* FLAG */}

              <span className="hidden h-[17px] w-[25px] shrink-0 items-center justify-center overflow-hidden rounded-[3px] shadow-sm sm:flex lg:h-[18px] lg:w-[27px]">
                <CurrentFlag
                  title={localeNames[currentLocale]}
                  className="block h-full w-full"
                />
              </span>


              {/* ARROW */}

              <ChevronDown
                size={15}
                className={`ml-0 transition duration-300 sm:ml-0.5 lg:text-[17px] ${
                  languageOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>


            {/* ========================================
                DROPDOWN
            ======================================== */}

            {languageOpen && (
              <div className="fixed left-4 right-4 top-[84px] z-[200] max-h-[calc(100vh-100px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-[60px] sm:w-[300px] lg:top-[68px]">

                {/* DROPDOWN TITLE */}

                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3">

                  <Languages
                    size={18}
                    className="text-blue-600"
                  />


                  <p className="text-sm font-bold text-slate-900">
                    {navigation.language}
                  </p>

                </div>


                {/* LANGUAGE LIST */}

                <div className="mt-2 max-h-[min(420px,calc(100vh-180px))] overflow-y-auto">

                  {locales.map(
                    (locale) => {
                      const active =
                        locale ===
                        currentLocale;

                      const Flag =
                        localeFlagComponents[locale];


                      return (
                        <button
                          key={locale}
                          type="button"
                          onClick={() =>
                            changeLanguage(
                              locale
                            )
                          }
                          className={`grid w-full cursor-pointer grid-cols-[34px_34px_1fr_22px] items-center gap-2 rounded-xl px-3 py-3 text-left transition ${
                            active
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                          }`}
                        >

                          {/* COUNTRY CODE */}

                          <span className="text-sm font-semibold leading-none">
                            {
                              localeCountryCodes[
                                locale
                              ]
                            }
                          </span>


                          {/* FLAG */}

                          <span className="flex h-[18px] w-[27px] items-center justify-center overflow-hidden rounded-[3px] shadow-sm">
                            <Flag
                              title={localeNames[locale]}
                              className="block h-full w-full"
                            />
                          </span>


                          {/* LANGUAGE NAME */}

                          <span className="text-sm font-semibold leading-none">
                            {
                              localeNames[
                                locale
                              ]
                            }
                          </span>


                          {/* ACTIVE CHECK */}

                          <span className="flex items-center justify-end">

                            {active && (
                              <Check
                                size={17}
                                className="text-blue-600"
                              />
                            )}

                          </span>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

          </div>


          {/* ========================================
              DESKTOP CTA
          ======================================== */}

          <Link
            href={getLocalizedPath("/get-started", currentLocale)}
            className="hidden cursor-pointer rounded-2xl bg-black px-8 py-4 text-[17px] font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl lg:inline-flex"
          >
            {navigation.getStarted} →
          </Link>


          {/* ========================================
              MOBILE MENU BUTTON
          ======================================== */}

          <button
            type="button"
            onClick={() => {
              setLanguageOpen(false);
              setMobileMenuOpen(
                (open) => !open
              );
            }}
            className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-600 hover:shadow-md sm:h-[50px] sm:w-[50px] lg:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

      </nav>


      {/* ==========================================
          MOBILE NAVIGATION PANEL
      ========================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[76px] z-[190] h-[calc(100dvh-76px)] overflow-y-auto border-t border-slate-200 bg-white/98 px-4 py-5 shadow-2xl backdrop-blur-xl sm:top-[84px] sm:h-[calc(100dvh-84px)] sm:px-6 lg:hidden">

          <div className="mx-auto flex w-full max-w-xl flex-col">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <button
                type="button"
                onClick={() =>
                  navigateToSection(
                    "services"
                  )
                }
                className="flex min-h-[58px] w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left text-[17px] font-bold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {navigation.services}
                <span aria-hidden="true">→</span>
              </button>


              <button
                type="button"
                onClick={() =>
                  navigateToSection(
                    "how-it-works"
                  )
                }
                className="flex min-h-[58px] w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left text-[17px] font-bold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {navigation.howItWorks}
                <span aria-hidden="true">→</span>
              </button>


              <Link
                href={getLocalizedPath("/faq", currentLocale)}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex min-h-[58px] items-center justify-between border-b border-slate-100 px-5 py-4 text-[17px] font-bold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {navigation.pricing}
                <span aria-hidden="true">→</span>
              </Link>


              <Link
                href={getLocalizedPath("/blog", currentLocale)}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex min-h-[58px] items-center justify-between border-b border-slate-100 px-5 py-4 text-[17px] font-bold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {navigation.blog ?? "Blog"}
                <span aria-hidden="true">→</span>
              </Link>


              <Link
                href={getLocalizedPath("/about", currentLocale)}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex min-h-[58px] items-center justify-between border-b border-slate-100 px-5 py-4 text-[17px] font-bold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {navigation.about}
                <span aria-hidden="true">→</span>
              </Link>


              <Link
                href={getLocalizedPath("/contact", currentLocale)}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex min-h-[58px] items-center justify-between px-5 py-4 text-[17px] font-bold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {navigation.contact}
                <span aria-hidden="true">→</span>
              </Link>

            </div>


            <Link
              href={getLocalizedPath("/get-started", currentLocale)}
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="mt-4 flex min-h-[58px] items-center justify-center rounded-2xl bg-black px-6 py-4 text-center text-[17px] font-bold text-white shadow-lg transition hover:bg-blue-600"
            >
              {navigation.getStarted} →
            </Link>


            <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              HostMetric Property Management
            </p>

          </div>

        </div>
      )}

    </header>
  );
}
