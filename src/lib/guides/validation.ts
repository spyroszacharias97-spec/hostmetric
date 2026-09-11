import type {
  GuideDraftInput,
  GuideRecord,
  GuideValidationResult,
} from "@/content/guides/types";

import { isSupportedLocale } from "@/i18n/config";
import { isValidGuideSlug } from "@/lib/guides/slug";

export function validateGuideDraft(
  input: GuideDraftInput
): GuideValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (
    !input.slug ||
    !isValidGuideSlug(input.slug)
  ) {
    errors.push(
      "The guide slug is missing or invalid."
    );
  }

  if (!input.author.trim()) {
    errors.push(
      "The guide author is required."
    );
  }

  if (!input.category.trim()) {
    warnings.push(
      "The guide category is empty."
    );
  }

  if (
    !isSupportedLocale(
      input.sourceLocale
    )
  ) {
    errors.push(
      "The source locale is not supported."
    );
  }

  const content =
    input.sourceContent;

  if (
    content.locale !==
    input.sourceLocale
  ) {
    errors.push(
      "The source content locale does not match the source locale."
    );
  }

  if (!content.title.trim()) {
    errors.push(
      "The article title / H1 is required."
    );
  }

  if (!content.excerpt.trim()) {
    warnings.push(
      "The article excerpt is empty."
    );
  }

  if (
    content.blocks.length === 0
  ) {
    errors.push(
      "The article must contain at least one content block."
    );
  }

  if (!content.seo.title.trim()) {
    errors.push(
      "SEO title is required."
    );
  }

  if (
    !content.seo.metaDescription.trim()
  ) {
    errors.push(
      "Meta description is required."
    );
  }

  if (
    !content.seo.focusKeyword.trim()
  ) {
    warnings.push(
      "Focus keyword is empty."
    );
  }

  if (
    !content.seo.imageAlt.trim()
  ) {
    warnings.push(
      "Image alt text is empty."
    );
  }

  if (
    content.seo.title.length > 65
  ) {
    warnings.push(
      "SEO title is longer than 65 characters."
    );
  }

  if (
    content.seo.metaDescription.length >
      165 ||
    content.seo.metaDescription.length <
      110
  ) {
    warnings.push(
      "Meta description is outside the recommended editorial range of 110–165 characters."
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
    warnings,
  };
}

export function validateGuideForPublish(
  guide: GuideRecord
): GuideValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const content =
    guide.translations[
      guide.sourceLocale
    ];

  if (!content) {
    errors.push(
      "The source-language content is missing."
    );

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  if (
    !guide.slug ||
    !isValidGuideSlug(
      guide.slug
    )
  ) {
    errors.push(
      "The guide slug is missing or invalid."
    );
  }

  if (!guide.author.trim()) {
    errors.push(
      "The guide author is required."
    );
  }

  if (!guide.category.trim()) {
    errors.push(
      "The guide category is required before publishing."
    );
  }

  if (!content.title.trim()) {
    errors.push(
      "The article title / H1 is required."
    );
  }

  if (!content.excerpt.trim()) {
    errors.push(
      "The article excerpt is required before publishing."
    );
  }

  if (
    content.blocks.length === 0
  ) {
    errors.push(
      "The article must contain at least one content block."
    );
  }

  const hasH2 =
    content.blocks.some(
      (block) =>
        block.type === "heading" &&
        block.level === 2
    );

  if (!hasH2) {
    errors.push(
      "At least one H2 heading is required before publishing."
    );
  }

  const invalidInternalLink =
    content.blocks.find(
      (block) =>
        block.type ===
          "internalLink" &&
        !(
          block.href.startsWith("/") ||
          block.href.startsWith(
            "https://"
          ) ||
          block.href.startsWith(
            "http://"
          )
        )
    );

  if (invalidInternalLink) {
    errors.push(
      "Internal links must use an absolute URL or a path beginning with /."
    );
  }

  if (!content.seo.title.trim()) {
    errors.push(
      "SEO title is required before publishing."
    );
  }

  if (
    content.seo.title.trim().length >
    65
  ) {
    errors.push(
      "SEO title must be 65 characters or fewer before publishing."
    );
  }

  const metaLength =
    content.seo.metaDescription
      .trim()
      .length;

  if (
    metaLength < 110 ||
    metaLength > 165
  ) {
    errors.push(
      "Meta description must be between 110 and 165 characters before publishing."
    );
  }

  if (
    !content.seo.focusKeyword.trim()
  ) {
    errors.push(
      "Focus keyword is required before publishing."
    );
  }

  if (
    guide.featuredImage.src &&
    !content.seo.imageAlt.trim()
  ) {
    errors.push(
      "Image alt text is required when a featured image is used."
    );
  }

  if (
    !content.seo.ogTitle.trim()
  ) {
    warnings.push(
      "OG title is empty; the public page will fall back to the SEO title."
    );
  }

  if (
    !content.seo.ogDescription.trim()
  ) {
    warnings.push(
      "OG description is empty; the public page will fall back to the meta description."
    );
  }

  if (
    !content.seo.ogImage.trim() &&
    !guide.featuredImage.src
  ) {
    warnings.push(
      "No Open Graph or featured image is configured."
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
    warnings,
  };
}
