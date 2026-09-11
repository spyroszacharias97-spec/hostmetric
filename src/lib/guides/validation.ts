import type {
  GuideDraftInput,
  GuideValidationResult,
} from "@/content/guides/types";
import { isSupportedLocale } from "@/i18n/config";
import { isValidGuideSlug } from "@/lib/guides/slug";

export function validateGuideDraft(
  input: GuideDraftInput
): GuideValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.slug || !isValidGuideSlug(input.slug)) {
    errors.push("The guide slug is missing or invalid.");
  }

  if (!input.author.trim()) {
    errors.push("The guide author is required.");
  }

  if (!isSupportedLocale(input.sourceLocale)) {
    errors.push("The source locale is not supported.");
  }

  const content = input.sourceContent;

  if (content.locale !== input.sourceLocale) {
    errors.push("The source content locale does not match the source locale.");
  }

  if (!content.title.trim()) {
    errors.push("The article title / H1 is required.");
  }

  if (!content.excerpt.trim()) {
    warnings.push("The article excerpt is empty.");
  }

  if (content.blocks.length === 0) {
    errors.push("The article must contain at least one content block.");
  }

  if (!content.seo.title.trim()) {
    errors.push("SEO title is required.");
  }

  if (!content.seo.metaDescription.trim()) {
    errors.push("Meta description is required.");
  }

  if (!content.seo.focusKeyword.trim()) {
    warnings.push("Focus keyword is empty.");
  }

  if (!content.seo.imageAlt.trim()) {
    warnings.push("Image alt text is empty.");
  }

  if (content.seo.title.length > 65) {
    warnings.push("SEO title is longer than 65 characters.");
  }

  if (
    content.seo.metaDescription.length > 165 ||
    content.seo.metaDescription.length < 110
  ) {
    warnings.push(
      "Meta description is outside the recommended editorial range of 110–165 characters."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
