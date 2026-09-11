import type { MetadataRoute } from "next";

import {
  locales,
  type Locale,
} from "@/i18n/config";

import { getLocalizedPath } from "@/i18n/routing";

import { listGuides } from "@/lib/guides/db";

import { siteUrl } from "@/seo/metadata";


/* ==========================================
   HOSTMETRIC PUBLIC INDEXABLE ROUTES

   Keep only real public routes here.

   Do not add admin, API, private or
   non-existent routes.
========================================== */

const publicRoutes = [
  "/",
  "/about",
  "/blog",
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
   CHECK IF ARTICLE LOCALE IS PUBLIC

   Source locale:
   public when article is published.

   Other locales:
   public only when translation is approved.
========================================== */

function isArticleLocalePublic(
  guide: Awaited<
    ReturnType<typeof listGuides>
  >[number],
  locale: Locale
): boolean {
  const content =
    guide.translations[locale];

  if (!content) {
    return false;
  }

  if (
    locale ===
    guide.sourceLocale
  ) {
    return true;
  }

  return (
    content.translationStatus ===
    "approved"
  );
}


/* ==========================================
   HOSTMETRIC SITEMAP

   Base public pages:
   /blog
   /en/blog
   /de/blog
   etc.

   Published articles:
   /blog/article-slug
   /en/blog/article-slug
   /de/blog/article-slug
   etc.

   Only public/approved locale versions
   of articles are included.
========================================== */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries:
    MetadataRoute.Sitemap =
    publicRoutes.flatMap(
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

  const guides =
    await listGuides();

  const articleEntries:
    MetadataRoute.Sitemap =
    guides.flatMap((guide) => {
      if (
        guide.status !==
        "published"
      ) {
        return [];
      }

      return locales
        .filter((locale) =>
          isArticleLocalePublic(
            guide,
            locale
          )
        )
        .map((locale) => ({
          url: getAbsoluteUrl(
            getLocalizedPath(
              `/blog/${guide.slug}`,
              locale
            )
          ),
          lastModified:
            guide.updatedAt
              ? new Date(
                  guide.updatedAt
                )
              : undefined,
        }));
    });

  return [
    ...staticEntries,
    ...articleEntries,
  ];
}
