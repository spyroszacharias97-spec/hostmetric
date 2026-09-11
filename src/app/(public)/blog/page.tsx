import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routing";
import { listGuides } from "@/lib/guides/db";

const siteUrl = "https://hostmetric.gr";

type BlogPageCopy = {
  seo: {
    title: string;
    description: string;
  };
  eyebrow: string;
  title: string;
  description: string;
  readMore: string;
  empty: string;
};

const blogPageCopy: Record<Locale, BlogPageCopy> = {
  el: {
    seo: {
      title: "Blog για Βραχυχρόνιες Μισθώσεις | HostMetric",
      description:
        "Άρθρα και πρακτικές αναλύσεις για Airbnb, Booking.com, τιμολόγηση, πληρότητα, κρατήσεις και επαγγελματική διαχείριση καταλυμάτων",
    },
    eyebrow: "HOSTMETRIC BLOG",
    title: "Blog",
    description:
      "Άρθρα και πρακτικές αναλύσεις για ιδιοκτήτες καταλυμάτων που θέλουν καλύτερη προβολή, περισσότερες κρατήσεις και ισχυρότερη απόδοση.",
    readMore: "Διαβάστε το άρθρο",
    empty: "Δεν υπάρχουν ακόμη δημοσιευμένα άρθρα.",
  },

  en: {
    seo: {
      title: "Short-Term Rental Blog | HostMetric",
      description:
        "Articles and practical insights about Airbnb, Booking.com, pricing, occupancy, bookings and professional short-term rental management",
    },
    eyebrow: "HOSTMETRIC BLOG",
    title: "Blog",
    description:
      "Articles and practical insights for property owners who want stronger visibility, more bookings and better rental performance.",
    readMore: "Read article",
    empty: "No published articles are available yet.",
  },

  de: {
    seo: {
      title: "Blog für Kurzzeitvermietungen | HostMetric",
      description:
        "Artikel und praktische Einblicke zu Airbnb, Booking.com, Preisgestaltung, Auslastung, Buchungen und professionellem Management von Kurzzeitvermietungen",
    },
    eyebrow: "HOSTMETRIC BLOG",
    title: "Blog",
    description:
      "Artikel und praktische Einblicke für Eigentümer, die mehr Sichtbarkeit, mehr Buchungen und eine bessere Vermietungsperformance erreichen möchten.",
    readMore: "Artikel lesen",
    empty: "Noch keine Artikel veröffentlicht.",
  },

  fr: {
    seo: {
      title: "Blog sur la location courte durée | HostMetric",
      description:
        "Articles et analyses pratiques sur Airbnb, Booking.com, la tarification, l’occupation, les réservations et la gestion professionnelle des locations courte durée",
    },
    eyebrow: "BLOG HOSTMETRIC",
    title: "Blog",
    description:
      "Articles et analyses pratiques pour les propriétaires qui souhaitent améliorer leur visibilité, obtenir plus de réservations et renforcer les performances de leur hébergement.",
    readMore: "Lire l’article",
    empty: "Aucun article publié pour le moment.",
  },

  it: {
    seo: {
      title: "Blog sugli affitti brevi | HostMetric",
      description:
        "Articoli e analisi pratiche su Airbnb, Booking.com, prezzi, occupazione, prenotazioni e gestione professionale degli affitti brevi",
    },
    eyebrow: "BLOG HOSTMETRIC",
    title: "Blog",
    description:
      "Articoli e analisi pratiche per proprietari che desiderano maggiore visibilità, più prenotazioni e migliori performance della propria struttura.",
    readMore: "Leggi l’articolo",
    empty: "Non ci sono ancora articoli pubblicati.",
  },

  es: {
    seo: {
      title: "Blog de alquiler vacacional | HostMetric",
      description:
        "Artículos y análisis prácticos sobre Airbnb, Booking.com, precios, ocupación, reservas y gestión profesional de alquileres vacacionales",
    },
    eyebrow: "BLOG HOSTMETRIC",
    title: "Blog",
    description:
      "Artículos y análisis prácticos para propietarios que quieren conseguir más visibilidad, más reservas y un mejor rendimiento de su alojamiento.",
    readMore: "Leer artículo",
    empty: "Todavía no hay artículos publicados.",
  },

  pt: {
    seo: {
      title: "Blog de alojamento local | HostMetric",
      description:
        "Artigos e análises práticas sobre Airbnb, Booking.com, preços, ocupação, reservas e gestão profissional de alojamentos de curta duração",
    },
    eyebrow: "BLOG HOSTMETRIC",
    title: "Blog",
    description:
      "Artigos e análises práticas para proprietários que procuram mais visibilidade, mais reservas e melhor desempenho do alojamento.",
    readMore: "Ler artigo",
    empty: "Ainda não existem artigos publicados.",
  },

  bg: {
    seo: {
      title: "Блог за краткосрочни наеми | HostMetric",
      description:
        "Статии и практически анализи за Airbnb, Booking.com, ценообразуване, заетост, резервации и професионално управление на краткосрочни наеми",
    },
    eyebrow: "HOSTMETRIC БЛОГ",
    title: "Блог",
    description:
      "Статии и практически анализи за собственици, които искат по-добра видимост, повече резервации и по-силни резултати.",
    readMore: "Прочетете статията",
    empty: "Все още няма публикувани статии.",
  },

  sr: {
    seo: {
      title: "Blog o kratkoročnom izdavanju | HostMetric",
      description:
        "Članci i praktične analize o Airbnb-u, Booking.com-u, cenama, popunjenosti, rezervacijama i profesionalnom upravljanju kratkoročnim izdavanjem",
    },
    eyebrow: "HOSTMETRIC BLOG",
    title: "Blog",
    description:
      "Članci i praktične analize za vlasnike koji žele veću vidljivost, više rezervacija i bolje rezultate svog smeštaja.",
    readMore: "Pročitaj članak",
    empty: "Još nema objavljenih članaka.",
  },

  tr: {
    seo: {
      title: "Kısa Süreli Kiralama Blogu | HostMetric",
      description:
        "Airbnb, Booking.com, fiyatlandırma, doluluk, rezervasyonlar ve profesyonel kısa süreli kiralama yönetimi hakkında makaleler ve pratik analizler",
    },
    eyebrow: "HOSTMETRIC BLOG",
    title: "Blog",
    description:
      "Daha fazla görünürlük, daha çok rezervasyon ve daha güçlü performans isteyen mülk sahipleri için makaleler ve pratik analizler.",
    readMore: "Makaleyi oku",
    empty: "Henüz yayımlanmış makale yok.",
  },

  pl: {
    seo: {
      title: "Blog o najmie krótkoterminowym | HostMetric",
      description:
        "Artykuły i praktyczne analizy o Airbnb, Booking.com, cenach, obłożeniu, rezerwacjach i profesjonalnym zarządzaniu najmem krótkoterminowym",
    },
    eyebrow: "BLOG HOSTMETRIC",
    title: "Blog",
    description:
      "Artykuły i praktyczne analizy dla właścicieli, którzy chcą zwiększyć widoczność, liczbę rezerwacji i wyniki swojego obiektu.",
    readMore: "Przeczytaj artykuł",
    empty: "Nie ma jeszcze opublikowanych artykułów.",
  },

  ru: {
    seo: {
      title: "Блог о краткосрочной аренде | HostMetric",
      description:
        "Статьи и практические материалы об Airbnb, Booking.com, ценообразовании, загрузке, бронированиях и профессиональном управлении краткосрочной арендой",
    },
    eyebrow: "БЛОГ HOSTMETRIC",
    title: "Блог",
    description:
      "Статьи и практические материалы для владельцев, которые хотят повысить видимость объекта, получить больше бронирований и улучшить его результаты.",
    readMore: "Читать статью",
    empty: "Пока нет опубликованных статей.",
  },
};

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    return savedLocale;
  }

  return defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const currentLocale =
    await getCurrentLocale();

  const copy =
    blogPageCopy[currentLocale];

  const localizedBlogPath =
    getLocalizedPath(
      "/blog",
      currentLocale
    );

  return {
    title: copy.seo.title,
    description:
      copy.seo.description,

    alternates: {
      canonical:
        `${siteUrl}${localizedBlogPath}`,
    },

    openGraph: {
      type: "website",
      url:
        `${siteUrl}${localizedBlogPath}`,
      siteName: "HostMetric",
      title: copy.seo.title,
      description:
        copy.seo.description,
    },

    twitter: {
      card:
        "summary_large_image",
      title: copy.seo.title,
      description:
        copy.seo.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPage() {
  const currentLocale =
    await getCurrentLocale();

  const copy =
    blogPageCopy[currentLocale];

  const guides =
    await listGuides();

  const publicArticles =
    guides.filter((guide) => {
      if (
        guide.status !==
        "published"
      ) {
        return false;
      }

      const content =
        guide.translations[
          currentLocale
        ];

      if (!content) {
        return false;
      }

      if (
        currentLocale ===
        guide.sourceLocale
      ) {
        return true;
      }

      return (
        content.translationStatus ===
        "approved"
      );
    });

  return (
    <main className="relative min-h-[65vh] overflow-hidden bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-16 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            <span className="ml-1 h-px w-14 bg-gradient-to-r from-slate-300 to-transparent" />
          </div>

          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
            {copy.eyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-slate-950 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
              {copy.title}
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            {copy.description}
          </p>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <div className="relative h-40 w-64">
              <div className="absolute right-0 top-0 h-16 w-40 rotate-[-8deg] rounded-[28px] border border-blue-200/80 bg-white/70 shadow-sm backdrop-blur" />
              <div className="absolute right-14 top-12 h-16 w-40 rotate-[6deg] rounded-[28px] border border-emerald-200/80 bg-white/70 shadow-sm backdrop-blur" />
              <div className="absolute right-2 top-24 h-12 w-28 rotate-[-3deg] rounded-full border border-violet-200/80 bg-white/70 shadow-sm backdrop-blur" />
              <div className="absolute right-10 top-5 h-2.5 w-2.5 rounded-full bg-blue-500" />
              <div className="absolute right-28 top-20 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div className="absolute right-8 top-32 h-2.5 w-2.5 rounded-full bg-violet-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {publicArticles.length ===
        0 ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-12 text-center shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)]">
            <p className="text-lg font-bold text-slate-600">
              {copy.empty}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {publicArticles.map(
              (guide, index) => {
                const content =
                  guide.translations[
                    currentLocale
                  ]!;

                const href =
                  getLocalizedPath(
                    `/blog/${guide.slug}`,
                    currentLocale
                  );

                const cardTheme =
                  index % 3 === 0
                    ? {
                        shell:
                          "border-blue-200/80 bg-gradient-to-br from-white via-blue-50/40 to-white hover:border-blue-300",
                        glow:
                          "bg-blue-300/25",
                        accent:
                          "from-blue-600 to-cyan-400",
                        category:
                          "text-blue-700",
                        title:
                          "group-hover:text-blue-700",
                      }
                    : index % 3 === 1
                      ? {
                          shell:
                            "border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/45 to-white hover:border-emerald-300",
                          glow:
                            "bg-emerald-300/25",
                          accent:
                            "from-emerald-600 to-teal-400",
                          category:
                            "text-emerald-700",
                          title:
                            "group-hover:text-emerald-700",
                        }
                      : {
                          shell:
                            "border-violet-200/80 bg-gradient-to-br from-white via-violet-50/40 to-white hover:border-violet-300",
                          glow:
                            "bg-violet-300/20",
                          accent:
                            "from-violet-600 to-fuchsia-400",
                          category:
                            "text-violet-700",
                          title:
                            "group-hover:text-violet-700",
                        };

                return (
                  <article
                    key={guide.id}
                    className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[30px] border shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_75px_-34px_rgba(15,23,42,0.28)] ${cardTheme.shell}`}
                  >
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${cardTheme.glow}`}
                    />
                    {guide
                      .featuredImage
                      .src ? (
                      <Link
                        href={href}
                        className="relative block overflow-hidden bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            guide
                              .featuredImage
                              .src
                          }
                          alt={
                            content.seo
                              .imageAlt ||
                            guide
                              .featuredImage
                              .alt
                          }
                          className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      </Link>
                    ) : null}

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 group-hover:w-20" />
                      <p
                        className={`text-xs font-black uppercase tracking-[0.14em] ${cardTheme.category}`}
                      >
                        {
                          guide.category
                        }
                      </p>

                      <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950">
                        <Link
                          href={href}
                          className={`transition ${cardTheme.title}`}
                        >
                          {
                            content.title
                          }
                        </Link>
                      </h2>

                      <p className="mt-4 line-clamp-3 text-base leading-7 text-slate-600">
                        {
                          content.excerpt
                        }
                      </p>

                      <div className="mt-auto pt-6">
                        <Link
                          href={href}
                          className="inline-flex items-center font-black text-blue-700 transition group-hover:translate-x-1 hover:text-blue-900"
                        >
                          {copy.readMore} →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}
