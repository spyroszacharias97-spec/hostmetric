import type { Metadata } from "next";

import {
  defaultLocale,
  locales,
  type Locale,
} from "@/i18n/config";

import {
  getLocalizedPath,
  removeLocaleFromPathname,
} from "@/i18n/routing";


/* ==========================================
   HOSTMETRIC SEO BASE URL
========================================== */

export const siteUrl =
  "https://hostmetric.gr";


/* ==========================================
   BUILD LOCALE-AWARE SEO ALTERNATES

   Example base path:

   /about

   Canonical for English:

   /en/about

   Hreflang URLs:

   el -> /about
   en -> /en/about
   de -> /de/about
   ...

   x-default points to the default Greek URL.
========================================== */

export function getLocalizedAlternates(
  pathname: string,
  currentLocale: Locale
): NonNullable<Metadata["alternates"]> {
  const basePath =
    removeLocaleFromPathname(
      pathname
    );

  const languages =
    Object.fromEntries(
      locales.map(
        (locale) => [
          locale,
          getLocalizedPath(
            basePath,
            locale
          ),
        ]
      )
    ) as Record<string, string>;

  languages["x-default"] =
    getLocalizedPath(
      basePath,
      defaultLocale
    );

  return {
    canonical:
      getLocalizedPath(
        basePath,
        currentLocale
      ),

    languages,
  };
}
