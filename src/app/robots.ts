import type { MetadataRoute } from "next";

import { siteUrl } from "@/seo/metadata";


/* ==========================================
   HOSTMETRIC ROBOTS

   Public website:
   crawlable

   Private / non-public application areas:
   blocked from crawling

   Important:
   Do NOT block /_next because search engines
   may need CSS / JS assets to render pages.
========================================== */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
      ],
    },

    sitemap: `${siteUrl}/sitemap.xml`,

    host: siteUrl,
  };
}
