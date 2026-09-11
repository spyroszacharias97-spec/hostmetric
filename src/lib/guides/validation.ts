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
      "Το slug λείπει ή δεν είναι έγκυρο."
    );
  }

  if (!input.author.trim()) {
    errors.push(
      "Ο συγγραφέας είναι υποχρεωτικός."
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
      "Ο τίτλος άρθρου / H1 είναι υποχρεωτικός."
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
      "Το άρθρο πρέπει να περιέχει τουλάχιστον ένα block περιεχομένου."
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
      "Λείπει το περιεχόμενο της βασικής γλώσσας."
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
      "Το slug λείπει ή δεν είναι έγκυρο."
    );
  }

  if (!guide.author.trim()) {
    errors.push(
      "Ο συγγραφέας είναι υποχρεωτικός."
    );
  }

  if (!guide.category.trim()) {
    errors.push(
      "Η κατηγορία είναι υποχρεωτική πριν τη δημοσίευση."
    );
  }

  if (!content.title.trim()) {
    errors.push(
      "Ο τίτλος άρθρου / H1 είναι υποχρεωτικός."
    );
  }

  if (!content.excerpt.trim()) {
    errors.push(
      "Η σύντομη περιγραφή είναι υποχρεωτική πριν τη δημοσίευση."
    );
  }

  if (
    content.blocks.length === 0
  ) {
    errors.push(
      "Το άρθρο πρέπει να περιέχει τουλάχιστον ένα block περιεχομένου."
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
      "Απαιτείται τουλάχιστον μία επικεφαλίδα H2 πριν τη δημοσίευση."
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
      "Το URL εσωτερικού link πρέπει να αρχίζει με / ή με http:// / https://."
    );
  }

  if (!content.seo.title.trim()) {
    errors.push(
      "Το SEO title είναι υποχρεωτικό πριν τη δημοσίευση."
    );
  }

  if (
    content.seo.title.trim().length >
    65
  ) {
    warnings.push(
      "Το SEO title είναι μεγαλύτερο από το προτεινόμενο όριο των 65 χαρακτήρων."
    );
  }

  const metaLength =
    content.seo.metaDescription
      .trim()
      .length;

  if (metaLength === 0) {
    errors.push(
      "Το Meta Description είναι υποχρεωτικό πριν τη δημοσίευση."
    );
  } else if (
    metaLength < 110 ||
    metaLength > 165
  ) {
    warnings.push(
      "Το Meta Description είναι εκτός του προτεινόμενου εύρους 110–165 χαρακτήρων."
    );
  }

  if (
    !content.seo.focusKeyword.trim()
  ) {
    errors.push(
      "Το Focus Keyword είναι υποχρεωτικό πριν τη δημοσίευση."
    );
  }

  if (
    guide.featuredImage.src &&
    !content.seo.imageAlt.trim()
  ) {
    errors.push(
      "Το Alt Text είναι υποχρεωτικό όταν υπάρχει Featured Image."
    );
  }

  if (
    !content.seo.ogTitle.trim()
  ) {
    warnings.push(
      "Το OG Title είναι κενό και θα χρησιμοποιηθεί αυτόματα το SEO Title."
    );
  }

  if (
    !content.seo.ogDescription.trim()
  ) {
    warnings.push(
      "Το OG Description είναι κενό και θα χρησιμοποιηθεί αυτόματα το Meta Description."
    );
  }

  if (
    !content.seo.ogImage.trim() &&
    !guide.featuredImage.src
  ) {
    warnings.push(
      "Δεν έχει οριστεί Open Graph Image ή Featured Image."
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
    warnings,
  };
}
