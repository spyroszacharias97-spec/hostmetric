import type { Locale } from "@/i18n/config";

export type GuideStatus =
  | "draft"
  | "review"
  | "published"
  | "unpublished";

export type GuideTranslationStatus =
  | "missing"
  | "draft"
  | "reviewed"
  | "approved";

export type GuideSearchIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational";

export type GuideBlock =
  | {
      id: string;
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      id: string;
      type: "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "bulletList";
      items: string[];
    }
  | {
      id: string;
      type: "callout";
      title?: string;
      text: string;
    }
  | {
      id: string;
      type: "internalLink";
      label: string;
      href: string;
      description?: string;
    };

export type GuideSeo = {
  title: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  searchIntent: GuideSearchIntent;
  targetCommercialPage: string;
  imageAlt: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  notes: string;
};

export type GuideFeaturedImage = {
  src: string;
  alt: string;
  caption: string;
};

export type GuideLocaleContent = {
  locale: Locale;
  translationStatus: GuideTranslationStatus;
  title: string;
  excerpt: string;
  blocks: GuideBlock[];
  seo: GuideSeo;
};

export type GuideRecord = {
  id: number;
  slug: string;
  category: string;
  author: string;
  status: GuideStatus;
  sourceLocale: Locale;
  featuredImage: GuideFeaturedImage;
  relatedGuideSlugs: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  translations: Partial<Record<Locale, GuideLocaleContent>>;
};

export type GuideDraftInput = {
  slug: string;
  category: string;
  author: string;
  sourceLocale: Locale;
  featuredImage: GuideFeaturedImage;
  relatedGuideSlugs: string[];
  sourceContent: GuideLocaleContent;
};

export type GuideValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};
