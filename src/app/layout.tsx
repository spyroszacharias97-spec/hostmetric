import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { cookies } from "next/headers";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

import "./globals.css";


/* ==========================================
   FONTS
========================================== */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


/* ==========================================
   GLOBAL VIEWPORT

   HostMetric uses a light-only design.
   This prevents supported browsers from
   treating the site as a dark color scheme.
========================================== */

export const viewport: Viewport = {
  colorScheme: "light",
};


/* ==========================================
   GLOBAL METADATA FOUNDATION

   metadataBase gives Next.js the canonical
   absolute origin for URL-based metadata.

   Page-specific canonical URLs, hreflang,
   Open Graph URLs and other alternates are
   handled by the page-level SEO metadata.
========================================== */

export const metadata: Metadata = {
  metadataBase:
    new URL(
      "https://hostmetric.gr"
    ),

  title:
    "HostMetric | Smarter Hosting. Better Results.",

  description:
    "Professional short-term rental management with smart pricing, guest communication, multi-platform distribution and performance optimization.",
};


/* ==========================================
   ROOT LAYOUT
========================================== */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore =
    await cookies();

  const savedLocale =
    cookieStore.get(
      "hostmetric_locale"
    )?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(
      savedLocale
    )
  ) {
    currentLocale =
      savedLocale;
  }

  return (
    <html
      lang={currentLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="
          min-h-full
        "
      >
        {children}
      </body>
    </html>
  );
}