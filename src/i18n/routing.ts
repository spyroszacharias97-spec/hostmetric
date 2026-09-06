import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

/* ==========================================
   NORMALIZE PATH
========================================== */

export function normalizePathname(
  pathname: string
): string {
  if (!pathname) {
    return "/";
  }

  let normalizedPath =
    pathname.startsWith("/")
      ? pathname
      : `/${pathname}`;

  if (
    normalizedPath.length > 1 &&
    normalizedPath.endsWith("/")
  ) {
    normalizedPath =
      normalizedPath.slice(0, -1);
  }

  return normalizedPath;
}


/* ==========================================
   GET LOCALE FROM PATHNAME

   Examples:

   /               -> el
   /about          -> el
   /en             -> en
   /en/about       -> en
   /de/contact     -> de
========================================== */

export function getLocaleFromPathname(
  pathname: string
): Locale {
  const normalizedPath =
    normalizePathname(pathname);

  const segments =
    normalizedPath
      .split("/")
      .filter(Boolean);

  const firstSegment =
    segments[0];

  if (
    firstSegment &&
    isSupportedLocale(firstSegment) &&
    firstSegment !== defaultLocale
  ) {
    return firstSegment;
  }

  return defaultLocale;
}


/* ==========================================
   REMOVE LOCALE PREFIX

   Examples:

   /               -> /
   /about          -> /about
   /en             -> /
   /en/about       -> /about
   /de/contact     -> /contact
========================================== */

export function removeLocaleFromPathname(
  pathname: string
): string {
  const normalizedPath =
    normalizePathname(pathname);

  const segments =
    normalizedPath
      .split("/")
      .filter(Boolean);

  const firstSegment =
    segments[0];

  if (
    firstSegment &&
    isSupportedLocale(firstSegment) &&
    firstSegment !== defaultLocale
  ) {
    const remainingSegments =
      segments.slice(1);

    if (
      remainingSegments.length === 0
    ) {
      return "/";
    }

    return `/${remainingSegments.join("/")}`;
  }

  return normalizedPath;
}


/* ==========================================
   BUILD LOCALIZED PATH

   Greek is the default locale and therefore
   does not receive a locale prefix.

   Examples:

   el + /           -> /
   el + /about      -> /about

   en + /           -> /en
   en + /about      -> /en/about

   de + /contact    -> /de/contact
========================================== */

export function getLocalizedPath(
  pathname: string,
  locale: Locale
): string {
  const basePath =
    removeLocaleFromPathname(
      pathname
    );

  if (
    locale === defaultLocale
  ) {
    return basePath;
  }

  if (
    basePath === "/"
  ) {
    return `/${locale}`;
  }

  return `/${locale}${basePath}`;
}


/* ==========================================
   CHANGE CURRENT PATH TO ANOTHER LOCALE

   Examples:

   /about + en
   -> /en/about

   /de/contact + en
   -> /en/contact

   /en/about + el
   -> /about
========================================== */

export function switchPathLocale(
  pathname: string,
  locale: Locale
): string {
  const basePath =
    removeLocaleFromPathname(
      pathname
    );

  return getLocalizedPath(
    basePath,
    locale
  );
}


/* ==========================================
   CHECK IF PATH HAS A LOCALE PREFIX
========================================== */

export function hasLocalePrefix(
  pathname: string
): boolean {
  const normalizedPath =
    normalizePathname(pathname);

  const segments =
    normalizedPath
      .split("/")
      .filter(Boolean);

  const firstSegment =
    segments[0];

  return Boolean(
    firstSegment &&
    isSupportedLocale(firstSegment) &&
    firstSegment !== defaultLocale
  );
}