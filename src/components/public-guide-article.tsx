import Link from "next/link";

import type {
  GuideBlock,
  GuideLocaleContent,
  GuideRecord,
} from "@/content/guides/types";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routing";

type RelatedArticle = {
  guide: GuideRecord;
  content: GuideLocaleContent;
  locale: Locale;
};

type PublicGuideArticleProps = {
  guide: GuideRecord;
  content: GuideLocaleContent;
  locale: Locale;
  backToAllLabel: string;
  relatedArticles: RelatedArticle[];
  relatedArticlesLabel: string;
  readMoreLabel: string;
};

function getCategoryHref(
  category: string,
  locale: Locale
) {
  const normalizedCategory =
    category
      .trim()
      .toLocaleLowerCase("el-GR");

  const isBookingPlatformsCategory =
    (
      normalizedCategory.includes(
        "πλατφόρμες"
      ) &&
      normalizedCategory.includes(
        "κρατήσεων"
      )
    ) ||
    (
      normalizedCategory.includes(
        "booking"
      ) &&
      normalizedCategory.includes(
        "platform"
      )
    );

  if (
    isBookingPlatformsCategory
  ) {
    return getLocalizedPath(
      "/performance/platform-network",
      locale
    );
  }

  return getLocalizedPath(
    "/blog",
    locale
  );
}

function renderBlock(
  block: GuideBlock,
  locale: Locale
) {
  if (block.type === "heading") {
    if (block.level === 2) {
      return (
        <h2
          key={block.id}
          className="mt-10 scroll-mt-28 text-2xl font-black tracking-tight text-slate-950 sm:mt-12 sm:text-3xl lg:text-4xl"
        >
          {block.text}
        </h2>
      );
    }

    return (
      <h3
        key={block.id}
        className="mt-7 scroll-mt-28 text-xl font-black tracking-tight text-slate-900 sm:mt-8 sm:text-2xl lg:text-3xl"
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "paragraph") {
    return (
      <div
        key={block.id}
        className="mt-4 whitespace-pre-line text-base leading-7 text-slate-700 sm:mt-5 sm:text-[17px] sm:leading-8 lg:text-lg lg:leading-9"
      >
        {block.text}
      </div>
    );
  }

  if (block.type === "bulletList") {
    return (
      <ul
        key={block.id}
        className="mt-5 list-disc space-y-2.5 pl-5 text-base leading-7 text-slate-700 marker:text-blue-500 sm:mt-6 sm:space-y-3 sm:pl-6 sm:text-[17px] sm:leading-8 lg:text-lg"
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "callout") {
    return (
      <aside
        key={block.id}
        className="mt-6 rounded-[20px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 shadow-sm sm:mt-8 sm:rounded-[24px] sm:px-6 sm:py-5 sm:text-base sm:leading-7"
      >
        {block.title ? (
          <p className="mb-2 font-black text-slate-950">
            {block.title}
          </p>
        ) : null}

        {block.text}
      </aside>
    );
  }

  const href = block.href.startsWith("/")
    ? getLocalizedPath(block.href, locale)
    : block.href;

  return (
    <Link
      key={block.id}
      href={href}
      className="mt-6 inline-flex text-sm font-black text-blue-700 underline decoration-blue-200 decoration-2 underline-offset-4 transition hover:text-blue-800 sm:mt-7 sm:text-base"
    >
      {block.label}
    </Link>
  );
}

export default function PublicGuideArticle({
  guide,
  content,
  locale,
  backToAllLabel,
  relatedArticles,
  relatedArticlesLabel,
  readMoreLabel,
}: PublicGuideArticleProps) {
  const categoryHref =
    getCategoryHref(
      guide.category,
      locale
    );

  return (
    <main className="relative overflow-hidden bg-slate-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-gradient-to-br from-blue-50 via-white to-emerald-50 sm:h-[520px] lg:h-[560px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-32 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl sm:h-72 sm:w-72"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl sm:h-80 sm:w-80"
      />

      <article className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <header className="mx-auto max-w-4xl text-center">
          <Link
            href={categoryHref}
            className="inline-flex rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-blue-700 shadow-sm backdrop-blur transition hover:border-blue-300 hover:bg-blue-50 sm:px-4 sm:text-xs"
          >
            {guide.category}
          </Link>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:mt-6 sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
            {content.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-500 sm:mt-7 sm:gap-x-4 sm:text-sm">
            <span>{guide.author}</span>

            {guide.publishedAt ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-blue-400"
                />
                <time dateTime={guide.publishedAt}>
                  {new Intl.DateTimeFormat(
                    locale === "el"
                      ? "el-GR"
                      : locale === "en"
                        ? "en-GB"
                        : locale,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  ).format(
                    new Date(guide.publishedAt)
                  )}
                </time>
              </>
            ) : null}
          </div>
        </header>

        {guide.featuredImage.src ? (
          <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/70 sm:mt-10 sm:rounded-[30px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={guide.featuredImage.src}
              alt={
                content.seo.imageAlt ||
                guide.featuredImage.alt
              }
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-slate-200/80 bg-white/95 px-4 py-6 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)] sm:mt-10 sm:rounded-[30px] sm:px-9 sm:py-10">
          <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 sm:mb-8 sm:w-20" />

          {content.blocks.map((block) =>
            renderBlock(block, locale)
          )}
        </div>

        {relatedArticles.length > 0 ? (
          <section className="mx-auto mt-10 max-w-4xl sm:mt-12 lg:mt-14">
            <div className="mb-4 sm:mb-5">
              <div className="h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 sm:w-16" />
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:mt-4 sm:text-3xl">
                {relatedArticlesLabel}
              </h2>
            </div>

            <div
              className={`grid gap-4 sm:gap-5 ${
                relatedArticles.length === 1
                  ? "mx-auto max-w-2xl"
                  : relatedArticles.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {relatedArticles.map(
                ({
                  guide: relatedGuide,
                  content: relatedContent,
                  locale: relatedLocale,
                }) => {
                  const href =
                    getLocalizedPath(
                      `/blog/${relatedGuide.slug}`,
                      relatedLocale
                    );

                  const singleCard =
                    relatedArticles.length === 1;

                  return (
                    <Link
                      key={relatedGuide.id}
                      href={href}
                      className={`group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg ${
                        singleCard
                          ? "sm:grid sm:grid-cols-[180px_minmax(0,1fr)]"
                          : ""
                      }`}
                    >
                      {relatedGuide.featuredImage.src ? (
                        <div
                          className={`overflow-hidden bg-slate-100 ${
                            singleCard
                              ? "aspect-[16/9] sm:aspect-auto sm:min-h-[170px]"
                              : "aspect-[16/9]"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              relatedGuide
                                .featuredImage.src
                            }
                            alt={
                              relatedContent.seo
                                .imageAlt ||
                              relatedGuide
                                .featuredImage.alt ||
                              relatedContent.title
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                          />
                        </div>
                      ) : null}

                      <div className="p-4 sm:p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 sm:text-[11px]">
                          {
                            relatedGuide.category
                          }
                        </p>

                        <h3 className="mt-2 text-lg font-black leading-snug text-slate-950 transition group-hover:text-blue-700 sm:text-xl">
                          {
                            relatedContent.title
                          }
                        </h3>

                        {relatedContent.excerpt ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 sm:leading-6">
                            {
                              relatedContent.excerpt
                            }
                          </p>
                        ) : null}

                        <span className="mt-4 inline-flex text-sm font-black text-blue-700">
                          {readMoreLabel} →
                        </span>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </section>
        ) : null}

        <div className="mx-auto mt-8 flex max-w-3xl justify-center sm:mt-10">
          <Link
            href={getLocalizedPath("/blog", locale)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
          >
            ← {backToAllLabel}
          </Link>
        </div>
      </article>
    </main>
  );
}
