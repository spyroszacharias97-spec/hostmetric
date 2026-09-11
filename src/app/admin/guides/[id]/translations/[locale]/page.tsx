import { notFound } from "next/navigation";

import AdminGuideTranslationEditor from "@/components/admin-guide-translation-editor";
import {
  locales,
  type Locale,
} from "@/i18n/config";

type PageProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export default async function GuideTranslationPage({
  params,
}: PageProps) {
  const { id: rawId, locale: rawLocale } =
    await params;

  const guideId = Number(rawId);

  if (
    !Number.isInteger(guideId) ||
    guideId <= 0 ||
    !locales.includes(
      rawLocale as Locale
    ) ||
    rawLocale === "el"
  ) {
    notFound();
  }

  return (
    <AdminGuideTranslationEditor
      guideId={guideId}
      locale={rawLocale as Locale}
    />
  );
}
