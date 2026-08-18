import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "HostMetric | Smarter Hosting. Better Results.",

  description:
    "Professional short-term rental management with smart pricing, guest communication, multi-platform distribution and performance optimization.",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  /* ==========================================
     READ SAVED LANGUAGE COOKIE
  ========================================== */

  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get(
      "hostmetric_locale"
    )?.value;


  let currentLocale: Locale =
    defaultLocale;


  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }


  return (
    <html
      lang={currentLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        <Navbar />


        <div className="flex-1">

          {children}

        </div>


        <Footer />

      </body>

    </html>
  );
}