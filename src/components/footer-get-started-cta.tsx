"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  ArrowUpRight,
} from "lucide-react";

import {
  getLocaleFromPathname,
  getLocalizedPath,
} from "@/i18n/routing";


type FooterGetStartedCtaProps = {
  label: string;
};


export default function FooterGetStartedCta({
  label,
}: FooterGetStartedCtaProps) {

  const pathname =
    usePathname();


  /* ==========================================
     CURRENT LOCALE FROM URL
  ========================================== */

  const currentLocale =
    getLocaleFromPathname(
      pathname
    );


  /* ==========================================
     LOCALIZED URLS
  ========================================== */

  const homepagePath =
    getLocalizedPath(
      "/",
      currentLocale
    );


  const getStartedPath =
    getLocalizedPath(
      "/get-started",
      currentLocale
    );


  /* ==========================================
     HOMEPAGE DETECTION

     Greek:
     /

     English:
     /en

     German:
     /de

     etc.
  ========================================== */

  const isHomepage =
    pathname ===
    homepagePath;


  /* ==========================================
     FOOTER CTA
  ========================================== */

  return (
    <Link
      href={getStartedPath}
      className={`
        mt-6
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-blue-600
        px-5
        py-3.5
        font-bold
        text-white
        transition
        duration-300
        hover:-translate-y-1
        hover:bg-blue-500
        hover:shadow-lg

        sm:mt-8
        sm:w-auto
        sm:rounded-2xl
        sm:px-6
        sm:py-4

        ${
          isHomepage
            ? "hidden sm:inline-flex"
            : "inline-flex"
        }
      `}
    >

      {label}


      <ArrowUpRight
        size={18}
        className="shrink-0"
      />

    </Link>
  );
}
