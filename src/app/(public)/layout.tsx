import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const siteUrl = "https://hostmetric.gr";
const logoUrl =
  "https://www.hostmetric.gr/hostmetric-email-logo.png";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "HostMetric",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: logoUrl,
  },
  email: "info@hostmetric.gr",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+35797729792",
      contactType: "customer service",
      areaServed: {
        "@type": "Country",
        name: "Cyprus",
      },
      availableLanguage: [
        "el",
        "en",
      ],
    },
    {
      "@type": "ContactPoint",
      telephone: "+306943404641",
      contactType: "customer service",
      areaServed: {
        "@type": "Country",
        name: "Greece",
      },
      availableLanguage: [
        "el",
        "en",
      ],
    },
  ],
  areaServed: [
    {
      "@type": "Country",
      name: "Cyprus",
    },
    {
      "@type": "Country",
      name: "Greece",
    },
    {
      "@type": "Place",
      name: "Europe",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "HostMetric",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: [
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
    "pl",
    "ru",
  ],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              organizationSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              websiteSchema
            ),
        }}
      />

      <Navbar />

      <div className="flex-1">
        {children}
      </div>

      <Footer />
    </>
  );
}