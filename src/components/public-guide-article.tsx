import Link from "next/link";

import type {
  GuideBlock,
  GuideLocaleContent,
  GuideRecord,
} from "@/content/guides/types";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routing";

type PublicGuideArticleProps = {
  guide: GuideRecord;
  content: GuideLocaleContent;
  locale: Locale;
  backToAllLabel: string;
};

function getCategoryHref(
  category: string,
  locale: Locale
) {
  const normalizedCategory =
    category
      .trim()
      .toLocaleLowerCase("el-GR");

  if (
    normalizedCategory ===
      "πλατφόρμες κρατήσεων" ||
    normalizedCategory ===
      "booking platforms"
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
          className="mt-12 scroll-mt-32 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
        >
          {block.text}
        </h2>
      );
    }

    return (
      <h3
        key={block.id}
        className="mt-8 scroll-mt-32 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "paragraph") {
    return (
      <div
        key={block.id}
        className="mt-5 whitespace-pre-line text-[17px] leading-8 text-slate-700 sm:text-lg sm:leading-9"
      >
        {block.text}
      </div>
    );
  }

  if (block.type === "bulletList") {
    return (
      <ul
        key={block.id}
        className="mt-6 list-disc space-y-3 pl-6 text-[17px] leading-8 text-slate-700 marker:text-blue-500 sm:text-lg"
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
        className="mt-8 rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-5 py-5 text-base font-semibold leading-7 text-slate-800 shadow-sm sm:px-6"
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
      className="mt-7 inline-flex font-black text-blue-700 underline decoration-blue-200 decoration-2 underline-offset-4 transition hover:text-blue-800"
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
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-br from-blue-50 via-white to-emerald-50"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
      />

      <article className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mx-auto max-w-4xl text-center">
          <Link
            href={categoryHref}
            className="inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur transition hover:border-blue-300 hover:bg-blue-50"
          >
            {guide.category}
          </Link>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            {content.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500">
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
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/70">
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

        <div className="mx-auto mt-10 max-w-3xl rounded-[30px] border border-slate-200/80 bg-white/95 px-6 py-8 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)] sm:px-9 sm:py-10">
          <div className="mb-8 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" />

          {content.blocks.map((block) =>
            renderBlock(block, locale)
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl justify-center">
          <Link
            href={getLocalizedPath("/blog", locale)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
          >
            ← {backToAllLabel}
          </Link>
        </div>
      </article>
    </main>
  );
}
