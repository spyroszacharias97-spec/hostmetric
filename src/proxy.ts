import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


/* ==========================================
   PUBLIC FILE / INTERNAL PATH CHECK

   These paths must never participate in
   HostMetric language routing.
========================================== */

function shouldIgnorePath(
  pathname: string
): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.includes(".")
  );
}


/* ==========================================
   READ FIRST URL SEGMENT

   Examples:

   /en/about
   -> en

   /de/contact
   -> de

   /about
   -> about
========================================== */

function getFirstSegment(
  pathname: string
): string | undefined {
  return pathname
    .split("/")
    .filter(Boolean)[0];
}


/* ==========================================
   REMOVE LANGUAGE PREFIX

   Examples:

   /en
   -> /

   /en/about
   -> /about

   /de/contact
   -> /contact
========================================== */

function removeLanguagePrefix(
  pathname: string
): string {
  const segments =
    pathname
      .split("/")
      .filter(Boolean);

  const remainingSegments =
    segments.slice(1);

  if (
    remainingSegments.length === 0
  ) {
    return "/";
  }

  return `/${remainingSegments.join("/")}`;
}


/* ==========================================
   BUILD REQUEST COOKIE HEADER

   The public URL is authoritative for the
   language used by the rendered page.

   Existing HostMetric pages currently read:

   hostmetric_locale

   through next/headers cookies().

   Therefore the proxy injects the locale
   derived from the URL into the request
   before the page is rendered.
========================================== */

function buildLocalizedRequestHeaders(
  request: NextRequest,
  locale: Locale
): Headers {
  const requestHeaders =
    new Headers(
      request.headers
    );

  const existingCookieHeader =
    requestHeaders.get(
      "cookie"
    );

  const localeCookie =
    `hostmetric_locale=${locale}`;

  if (
    existingCookieHeader
  ) {
    const cookiesWithoutLocale =
      existingCookieHeader
        .split(";")
        .map(
          (cookie) =>
            cookie.trim()
        )
        .filter(
          (cookie) =>
            !cookie.startsWith(
              "hostmetric_locale="
            )
        );

    cookiesWithoutLocale.push(
      localeCookie
    );

    requestHeaders.set(
      "cookie",
      cookiesWithoutLocale.join("; ")
    );
  } else {
    requestHeaders.set(
      "cookie",
      localeCookie
    );
  }

  return requestHeaders;
}


/* ==========================================
   REMEMBER LANGUAGE IN BROWSER

   This preserves the existing HostMetric
   language preference system while keeping
   the URL authoritative for rendering.
========================================== */

function rememberLocale(
  response: NextResponse,
  locale: Locale
): NextResponse {
  response.cookies.set(
    "hostmetric_locale",
    locale,
    {
      path: "/",

      maxAge:
        60 * 60 * 24 * 365,

      sameSite: "lax",

      secure:
        process.env.NODE_ENV ===
        "production",
    }
  );

  return response;
}


/* ==========================================
   CREATE LOCALIZED REWRITE

   Public URL:

   /en/about

   Internal route:

   /about

   Request locale:

   en
========================================== */

function createLocalizedRewrite(
  request: NextRequest,
  locale: Locale,
  destinationPath: string
) {
  const rewriteUrl =
    request.nextUrl.clone();

  rewriteUrl.pathname =
    destinationPath;

  const requestHeaders =
    buildLocalizedRequestHeaders(
      request,
      locale
    );

  const response =
    NextResponse.rewrite(
      rewriteUrl,
      {
        request: {
          headers:
            requestHeaders,
        },
      }
    );

  return rememberLocale(
    response,
    locale
  );
}


/* ==========================================
   CREATE LOCALIZED PASS-THROUGH

   Used for canonical Greek URLs which do
   not have a locale prefix.

   Examples:

   /
   /about
   /contact

   These URLs must always render Greek,
   regardless of any older language cookie.
========================================== */

function createLocalizedNext(
  request: NextRequest,
  locale: Locale
) {
  const requestHeaders =
    buildLocalizedRequestHeaders(
      request,
      locale
    );

  const response =
    NextResponse.next(
      {
        request: {
          headers:
            requestHeaders,
        },
      }
    );

  return rememberLocale(
    response,
    locale
  );
}


/* ==========================================
   HOSTMETRIC LANGUAGE ROUTING
========================================== */

export function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;


  /* ========================================
     IGNORE ADMIN / API / NEXT / FILES
  ======================================== */

  if (
    shouldIgnorePath(pathname)
  ) {
    return NextResponse.next();
  }


  /* ========================================
     DETECT FIRST URL SEGMENT
  ======================================== */

  const firstSegment =
    getFirstSegment(
      pathname
    );


  /* ========================================
     /el IS NOT OUR CANONICAL GREEK URL

     Greek is the default language.

     Therefore:

     /el
     -> /

     /el/about
     -> /about

     /el/contact
     -> /contact
  ======================================== */

  if (
    firstSegment ===
    defaultLocale
  ) {
    const redirectUrl =
      request.nextUrl.clone();

    redirectUrl.pathname =
      removeLanguagePrefix(
        pathname
      );

    return NextResponse.redirect(
      redirectUrl,
      308
    );
  }


  /* ========================================
     OTHER SUPPORTED LANGUAGES

     Public URL:

     /en/about

     Internal page:

     /about

     Locale used by page:

     en
  ======================================== */

  if (
    firstSegment &&
    isSupportedLocale(
      firstSegment
    ) &&
    firstSegment !==
      defaultLocale
  ) {
    const locale =
      firstSegment as Locale;

    const destinationPath =
      removeLanguagePrefix(
        pathname
      );

    return createLocalizedRewrite(
      request,
      locale,
      destinationPath
    );
  }


  /* ========================================
     CANONICAL NON-PREFIXED GREEK ROUTES

     The URL is authoritative.

     Therefore every public URL without a
     supported non-default locale prefix is
     rendered explicitly in Greek.

     Examples:

     /
     -> el

     /about
     -> el

     /contact
     -> el

     This prevents an old browser cookie such
     as "en" or "de" from causing English or
     German content to render on a canonical
     Greek URL.
  ======================================== */

  return createLocalizedNext(
    request,
    defaultLocale
  );
}


/* ==========================================
   MATCHER

   We intentionally exclude:

   - Next.js internals
   - API
   - Admin
   - static files
   - images
========================================== */

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|icon.png|.*\\..*).*)",
  ],
};
