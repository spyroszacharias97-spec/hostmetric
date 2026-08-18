export const locales = [
  "el",
  "en",
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "bg",
  "sr",
  "tr",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "el";

export const localeNames: Record<Locale, string> = {
  el: "Ελληνικά",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  pt: "Português",
  bg: "Български",
  sr: "Српски",
  tr: "Türkçe",
};

export const localeFlags: Record<Locale, string> = {
  el: "🇬🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
  es: "🇪🇸",
  pt: "🇵🇹",
  bg: "🇧🇬",
  sr: "🇷🇸",
  tr: "🇹🇷",
};

export function isSupportedLocale(
  locale: string
): locale is Locale {
  return locales.includes(locale as Locale);
}