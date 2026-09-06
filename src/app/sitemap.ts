import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routing";
import { siteUrl } from "@/seo/metadata";


/* ==========================================
   HOSTMETRIC PUBLIC INDEXABLE ROUTES

   Keep only real public routes here.
   Do not add admin, API, private or
   non-existent hub routes.
========================================== */

const publicRoutes = [
  "/",

  "/about",
  "/contact",
  "/cookies",
  "/faq",
  "/get-started",
  "/privacy",
  "/terms",

  "/insights/ai-pricing",
  "/insights/guest-rating",
  "/insights/occupancy",
  "/insights/revenue",

  "/performance/guest-response",
  "/performance/platform-network",
  "/performance/pricing-engine",

  "/services/booking-management",
  "/services/guest-communication",
  "/services/smart-pricing",

  "/solutions/centralized-management",
  "/solutions/greater-visibility",
  "/solutions/smarter-distribution",
] as const;


/* ==========================================
   BUILD ABSOLUTE URL
========================================== */

function getAbsoluteUrl(
  pathname: string
): string {
  return new URL(
    pathname,
    siteUrl
  ).toString();
}


/* ==========================================
   HOSTMETRIC SITEMAP

   Greek (default):
   /about

   Other locales:
   /en/about
   /de/about
   /ru/about
   etc.

   The sitemap automatically expands every
   real public route across every supported
   locale from src/i18n/config.ts.
========================================== */

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.flatMap(
    (pathname) =>
      locales.map(
        (locale) => ({
          url: getAbsoluteUrl(
            getLocalizedPath(
              pathname,
              locale
            )
          ),
        })
      )
  );
}
