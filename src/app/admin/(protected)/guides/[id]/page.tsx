import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import AdminGuideEditor from "@/components/admin-guide-editor";
import { getAdminDictionary } from "@/i18n/admin";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";
import { getGuideById } from "@/lib/guides/db";

type GuideEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GuideEditPage({
  params,
}: GuideEditPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const guide = await getGuideById(id);

  if (!guide) {
    notFound();
  }

  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const adminDictionary =
    await getAdminDictionary(currentLocale);

  return (
    <AdminGuideEditor
      dictionary={adminDictionary.guides}
      initialGuide={guide}
    />
  );
}
