import Link from "next/link";
import { cookies } from "next/headers";

import {
  FilePenLine,
  Languages,
  Plus,
} from "lucide-react";

import { getAdminDictionary } from "@/i18n/admin";
import {
  defaultLocale,
  isSupportedLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { listGuides } from "@/lib/guides/db";
import AdminGuideListActions from "@/components/admin-guide-list-actions";

type GuidesListPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function GuidesListPage({
  searchParams,
}: GuidesListPageProps) {
  const cookieStore = await cookies();
  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }

  const adminDictionary =
    await getAdminDictionary(currentLocale);

  const d = adminDictionary.guides.list;
  const guides = await listGuides();

  const { filter = "all" } =
    await searchParams;

  const totalLocales = locales.length;

  const getCompletedLocaleCount = (
    guide: (typeof guides)[number]
  ) => {
    const sourceExists = Boolean(
      guide.translations[guide.sourceLocale]
    );

    const approvedTranslations =
      Object.entries(guide.translations).filter(
        ([locale, translation]) =>
          locale !== guide.sourceLocale &&
          translation?.translationStatus ===
            "approved"
      ).length;

    return (
      (sourceExists ? 1 : 0) +
      approvedTranslations
    );
  };

  const needsTranslation = (
    guide: (typeof guides)[number]
  ) => {
    const sourceExists = Boolean(
      guide.translations[guide.sourceLocale]
    );

    const targetLocales = locales.filter(
      (locale) =>
        locale !== guide.sourceLocale
    );

    const allTargetLocalesApproved =
      targetLocales.every((locale) => {
        const translation =
          guide.translations[locale];

        return (
          translation?.translationStatus ===
          "approved"
        );
      });

    return (
      !sourceExists ||
      !allTargetLocalesApproved
    );
  };

  const filteredGuides = guides.filter(
    (guide) => {
      if (filter === "drafts") {
        return (
          guide.status === "draft" ||
          guide.status === "unpublished"
        );
      }

      if (filter === "published") {
        return guide.status === "published";
      }

      if (filter === "needs-translation") {
        return needsTranslation(guide);
      }

      return true;
    }
  );

  const filters = [
    {
      key: "all",
      label: d.filters.all,
      href: "/admin/guides",
    },
    {
      key: "drafts",
      label: d.filters.drafts,
      href: "/admin/guides?filter=drafts",
    },
    {
      key: "published",
      label: d.filters.published,
      href:
        "/admin/guides?filter=published",
    },
    {
      key: "needs-translation",
      label:
        d.filters.needsTranslation,
      href:
        "/admin/guides?filter=needs-translation",
    },
  ] as const;

  const dateLocale =
    currentLocale === "el"
      ? "el-GR"
      : "en-GB";

  const dateFormatter =
    new Intl.DateTimeFormat(
      dateLocale,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return (
    <div className="pb-14">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
            {d.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            {d.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
            {d.description}
          </p>
        </div>

        <Link
          href="/admin/guides/new"
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          {d.newArticle}
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((item) => {
          const active =
            filter === item.key ||
            (
              item.key === "all" &&
              filter === "all"
            );

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-2xl border px-4 py-2.5 text-sm font-black transition ${
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        {filteredGuides.length === 0 ? (
          <div className="px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FilePenLine size={24} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              {d.emptyTitle}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {d.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {d.columns.article}
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {d.columns.status}
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {d.columns.locale}
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {d.columns.translations}
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {d.columns.updated}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {d.columns.action}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredGuides.map(
                  (guide) => {
                    const sourceContent =
                      guide.translations[
                        guide.sourceLocale
                      ];

                    const title =
                      sourceContent?.title ||
                      guide.slug;

                    const approvedCount =
                      getCompletedLocaleCount(
                        guide
                      );

                    const translationText =
                      d.translationSummary
                        .replace(
                          "{current}",
                          String(
                            approvedCount
                          )
                        )
                        .replace(
                          "{total}",
                          String(totalLocales)
                        );

                    const translationPending =
                      needsTranslation(guide);

                    return (
                      <tr
                        key={guide.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <p className="font-black text-slate-950">
                            {title}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-400">
                            /{guide.slug}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">
                            {
                              d.status[
                                guide.status
                              ]
                            }
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span className="text-sm font-black uppercase text-slate-700">
                            {
                              guide.sourceLocale
                            }
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-start gap-2">
                            <Languages
                              size={16}
                              className={
                                translationPending
                                  ? "mt-0.5 text-amber-500"
                                  : "mt-0.5 text-emerald-500"
                              }
                            />

                            <div>
                              <p className="text-sm font-black text-slate-800">
                                {
                                  translationText
                                }
                              </p>

                              <p
                                className={`mt-1 text-xs font-bold ${
                                  translationPending
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {translationPending
                                  ? d.needsTranslation
                                  : d.completeTranslations}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-500">
                          {dateFormatter.format(
                            new Date(
                              guide.updatedAt
                            )
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <AdminGuideListActions
                            guideId={guide.id}
                            guideTitle={title}
                            status={guide.status}
                            openLabel={d.open}
                            publishLabel={d.publish}
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
