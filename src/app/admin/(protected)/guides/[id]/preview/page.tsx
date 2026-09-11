import Link from "next/link";
import { notFound } from "next/navigation";

import GuidePreview from "@/components/guide-preview";
import { getGuideById } from "@/lib/guides/db";
import {
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

type GuidePreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    locale?: string;
  }>;
};

export default async function GuidePreviewPage({
  params,
  searchParams,
}: GuidePreviewPageProps) {
  const { id: rawId } =
    await params;

  const {
    locale: requestedLocale,
  } = await searchParams;

  const id =
    Number(rawId);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    notFound();
  }

  const guide =
    await getGuideById(id);

  if (!guide) {
    notFound();
  }

  /*
   * Preview language selection is automatic.
   *
   * - If a valid locale is explicitly supplied
   *   (for example from a translation editor),
   *   preview that translation when it exists.
   *
   * - Otherwise preview the source language.
   *
   * No separate language selector is rendered
   * here because the public article uses the
   * normal HostMetric locale routing/navbar.
   */
  let selectedLocale: Locale =
    guide.sourceLocale;

  if (
    requestedLocale &&
    isSupportedLocale(
      requestedLocale
    ) &&
    guide.translations[
      requestedLocale
    ]
  ) {
    selectedLocale =
      requestedLocale;
  }

  const content =
    guide.translations[
      selectedLocale
    ];

  if (!content) {
    notFound();
  }

  return (
    <div className="relative pb-24">
      <GuidePreview
        guide={guide}
        content={content}
      />

      <Link
        href={`/admin/guides/${guide.id}`}
        className="fixed bottom-6 right-3 z-50 inline-flex items-center justify-center whitespace-nowrap rounded-2xl border-2 border-blue-200 bg-white px-6 py-3.5 text-sm font-black text-blue-700 shadow-xl transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 hover:shadow-2xl sm:right-4 xl:right-2"
      >
        ← Επιστροφή στον editor
      </Link>
    </div>
  );
}
