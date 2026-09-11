import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import PublicGuideArticle from "@/components/public-guide-article";
import {
  defaultLocale,
  isSupportedLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routing";
import { getGuideBySlug } from "@/lib/guides/db";
import { serializeJsonLd } from "@/seo/schema";

const siteUrl = "https://hostmetric.gr";

type GuideArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const blogBackLabels: Record<Locale, string> = {
  el: "Όλα τα άρθρα",
  en: "All articles",
  de: "Alle Artikel",
  fr: "Tous les articles",
  it: "Tutti gli articoli",
  es: "Todos los artículos",
  pt: "Todos os artigos",
  bg: "Всички статии",
  sr: "Svi članci",
  tr: "Tüm makaleler",
  pl: "Wszystkie artykuły",
  ru: "Все статьи",
};

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  return savedLocale &&
    isSupportedLocale(savedLocale)
    ? savedLocale
    : defaultLocale;
}

function isLocalePublic(
  guide: NonNullable<
    Awaited<
      ReturnType<typeof getGuideBySlug>
    >
  >,
  locale: Locale
) {
  const content =
    guide.translations[locale];

  if (!content) {
    return false;
  }

  if (locale === guide.sourceLocale) {
    return true;
  }

  return (
    content.translationStatus ===
    "approved"
  );
}

function getPublicContentLocale(
  guide: NonNullable<
    Awaited<
      ReturnType<typeof getGuideBySlug>
    >
  >,
  requestedLocale: Locale
): Locale | null {
  if (
    isLocalePublic(
      guide,
      requestedLocale
    )
  ) {
    return requestedLocale;
  }

  if (
    isLocalePublic(
      guide,
      "en"
    )
  ) {
    return "en";
  }

  if (
    isLocalePublic(
      guide,
      guide.sourceLocale
    )
  ) {
    return guide.sourceLocale;
  }

  return null;
}

function absoluteUrl(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${siteUrl}${
    path.startsWith("/")
      ? path
      : `/${path}`
  }`;
}

export async function generateMetadata({
  params,
}: GuideArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const requestedLocale =
    await getCurrentLocale();

  const guide =
    await getGuideBySlug(slug);

  if (
    !guide ||
    guide.status !== "published"
  ) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const contentLocale =
    getPublicContentLocale(
      guide,
      requestedLocale
    );

  if (!contentLocale) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const content =
    guide.translations[
      contentLocale
    ]!;

  const pathname =
    getLocalizedPath(
      `/blog/${guide.slug}`,
      contentLocale
    );

  const languages =
    Object.fromEntries(
      locales
        .filter((candidate) =>
          isLocalePublic(
            guide,
            candidate
          )
        )
        .map((candidate) => [
          candidate,
          `${siteUrl}${getLocalizedPath(
            `/blog/${guide.slug}`,
            candidate
          )}`,
        ])
    );

  return {
    title:
      content.seo.title ||
      content.title,

    description:
      content.seo.metaDescription ||
      content.excerpt,

    alternates: {
      canonical:
        `${siteUrl}${pathname}`,

      languages: {
        ...languages,

        "x-default":
          `${siteUrl}${getLocalizedPath(
            `/blog/${guide.slug}`,
            guide.sourceLocale
          )}`,
      },
    },

    openGraph: {
      type: "article",
      url:
        `${siteUrl}${pathname}`,
      siteName: "HostMetric",

      title:
        content.seo.ogTitle ||
        content.seo.title ||
        content.title,

      description:
        content.seo.ogDescription ||
        content.seo.metaDescription ||
        content.excerpt,

      images:
        content.seo.ogImage ||
        guide.featuredImage.src
          ? [
              {
                url: absoluteUrl(
                  content.seo.ogImage ||
                    guide.featuredImage.src
                ),
                alt:
                  content.seo.imageAlt ||
                  guide.featuredImage.alt,
              },
            ]
          : undefined,

      publishedTime:
        guide.publishedAt ||
        undefined,

      modifiedTime:
        guide.updatedAt,
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        content.seo.ogTitle ||
        content.seo.title ||
        content.title,

      description:
        content.seo.ogDescription ||
        content.seo.metaDescription ||
        content.excerpt,

      images:
        content.seo.ogImage ||
        guide.featuredImage.src
          ? [
              absoluteUrl(
                content.seo.ogImage ||
                  guide.featuredImage.src
              ),
            ]
          : undefined,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: GuideArticlePageProps) {
  const { slug } = await params;
  const requestedLocale =
    await getCurrentLocale();

  const guide =
    await getGuideBySlug(slug);

  if (
    !guide ||
    guide.status !== "published"
  ) {
    notFound();
  }

  const contentLocale =
    getPublicContentLocale(
      guide,
      requestedLocale
    );

  if (!contentLocale) {
    notFound();
  }

  const content =
    guide.translations[
      contentLocale
    ]!;

  const backToAllLabel =
    blogBackLabels[contentLocale];

  const articleUrl =
    `${siteUrl}${getLocalizedPath(
      `/blog/${guide.slug}`,
      contentLocale
    )}`;

  const articleSchema = {
    "@context":
      "https://schema.org",
    "@type": "Article",
    "@id":
      `${articleUrl}#article`,

    headline:
      content.title,

    description:
      content.excerpt,

    inLanguage:
      contentLocale,

    datePublished:
      guide.publishedAt,

    dateModified:
      guide.updatedAt,

    mainEntityOfPage:
      articleUrl,

    author: {
      "@type":
        "Organization",
      name:
        guide.author ||
        "HostMetric",
    },

    publisher: {
      "@id":
        `${siteUrl}/#organization`,
    },

    image:
      guide.featuredImage.src
        ? absoluteUrl(
            guide.featuredImage.src
          )
        : undefined,
  };

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",
    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",
        position: 1,
        name: "HostMetric",
        item:
          `${siteUrl}${getLocalizedPath(
            "/",
            contentLocale
          )}`,
      },

      {
        "@type":
          "ListItem",
        position: 2,
        name: "Blog",
        item:
          `${siteUrl}${getLocalizedPath(
            "/blog",
            contentLocale
          )}`,
      },

      {
        "@type":
          "ListItem",
        position: 3,
        name:
          content.title,
        item:
          articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              articleSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              breadcrumbSchema
            ),
        }}
      />

      <PublicGuideArticle
        guide={guide}
        content={content}
        locale={contentLocale}
        backToAllLabel={
          backToAllLabel
        }
      />
    </>
  );
}
