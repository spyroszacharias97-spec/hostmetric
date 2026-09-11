import { locales, type Locale } from "@/i18n/config";
import type {
  GuideSearchIntent,
  GuideTranslationStatus,
} from "@/content/guides/types";

export const guideLocales = locales;

export const guideSearchIntents: GuideSearchIntent[] = [
  "informational",
  "commercial",
  "transactional",
  "navigational",
];

export const defaultGuideTranslationStatus: GuideTranslationStatus =
  "missing";

export const defaultGuideAuthor = "HostMetric";

export function getEmptyTranslationStatuses(): Record<
  Locale,
  GuideTranslationStatus
> {
  return Object.fromEntries(
    guideLocales.map((locale) => [locale, "missing"])
  ) as Record<Locale, GuideTranslationStatus>;
}
