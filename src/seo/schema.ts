import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routing";


/* =========================================================
   SITE / GLOBAL SCHEMA IDS
========================================================= */

export const siteUrl =
  "https://hostmetric.gr";

export const organizationSchemaId =
  `${siteUrl}/#organization`;

export const websiteSchemaId =
  `${siteUrl}/#website`;


/* =========================================================
   ABSOLUTE URL
========================================================= */

export function getAbsoluteUrl(
  pathname: string
): string {
  return new URL(
    pathname,
    `${siteUrl}/`
  ).toString();
}


/* =========================================================
   LOCALIZED ABSOLUTE URL
========================================================= */

export function getLocalizedAbsoluteUrl(
  pathname: string,
  locale: Locale
): string {
  const localizedPath =
    getLocalizedPath(
      pathname,
      locale
    );

  return getAbsoluteUrl(
    localizedPath
  );
}


/* =========================================================
   WEB PAGE SCHEMA
========================================================= */

export type WebPageSchemaType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage";

type WebPageSchemaParams = {
  type?: WebPageSchemaType;
  name: string;
  description: string;
  pathname: string;
  locale: Locale;
};

export function getWebPageSchema({
  type = "WebPage",
  name,
  description,
  pathname,
  locale,
}: WebPageSchemaParams) {
  const url =
    getLocalizedAbsoluteUrl(
      pathname,
      locale
    );

  return {
    "@context":
      "https://schema.org",

    "@type":
      type,

    "@id":
      `${url}#webpage`,

    url,

    name,

    description,

    inLanguage:
      locale,

    isPartOf: {
      "@id":
        websiteSchemaId,
    },
  };
}


/* =========================================================
   SERVICE SCHEMA
========================================================= */

type ServiceSchemaParams = {
  name: string;
  description: string;
  pathname: string;
  locale: Locale;
};

export function getServiceSchema({
  name,
  description,
  pathname,
  locale,
}: ServiceSchemaParams) {
  const url =
    getLocalizedAbsoluteUrl(
      pathname,
      locale
    );

  return {
    "@context":
      "https://schema.org",

    "@type":
      "Service",

    "@id":
      `${url}#service`,

    name,

    description,

    url,

    inLanguage:
      locale,

    provider: {
      "@id":
        organizationSchemaId,
    },

    areaServed: [
      {
        "@type":
          "Country",
        name:
          "Cyprus",
      },
      {
        "@type":
          "Country",
        name:
          "Greece",
      },
      {
        "@type":
          "Place",
        name:
          "Europe",
      },
    ],
  };
}


/* =========================================================
   FAQ PAGE SCHEMA
========================================================= */

export type FAQSchemaItem = {
  question: string;
  answer: string;
};

type FAQPageSchemaParams = {
  items: FAQSchemaItem[];
  pathname: string;
  locale: Locale;
};

export function getFAQPageSchema({
  items,
  pathname,
  locale,
}: FAQPageSchemaParams) {
  const url =
    getLocalizedAbsoluteUrl(
      pathname,
      locale
    );

  return {
    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    "@id":
      `${url}#webpage`,

    url,

    inLanguage:
      locale,

    isPartOf: {
      "@id":
        websiteSchemaId,
    },

    mainEntity:
      items.map(
        (item) => ({
          "@type":
            "Question",

          name:
            item.question,

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              item.answer,
          },
        })
      ),
  };
}


/* =========================================================
   BREADCRUMB SCHEMA
========================================================= */

export type BreadcrumbItem = {
  name: string;
  pathname: string;
};

type BreadcrumbSchemaParams = {
  items: [
    BreadcrumbItem,
    ...BreadcrumbItem[]
  ];
  locale: Locale;
};

export function getBreadcrumbSchema({
  items,
  locale,
}: BreadcrumbSchemaParams) {
  const localizedItems =
    items.map(
      (item) => ({
        ...item,

        url:
          getLocalizedAbsoluteUrl(
            item.pathname,
            locale
          ),
      })
    );

  const currentPageUrl =
    localizedItems[
      localizedItems.length - 1
    ].url;

  return {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    "@id":
      `${currentPageUrl}#breadcrumb`,

    itemListElement:
      localizedItems.map(
        (
          item,
          index
        ) => ({
          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            item.name,

          item:
            item.url,
        })
      ),
  };
}


/* =========================================================
   SAFE JSON-LD SERIALIZATION
========================================================= */

export function serializeJsonLd(
  schema: unknown
): string {
  return JSON.stringify(
    schema
  )
    .replace(
      /</g,
      "\\u003c"
    )
    .replace(
      /\u2028/g,
      "\\u2028"
    )
    .replace(
      /\u2029/g,
      "\\u2029"
    );
}