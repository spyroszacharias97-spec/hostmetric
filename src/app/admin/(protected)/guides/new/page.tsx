import { cookies } from "next/headers";

import AdminGuideEditor from "@/components/admin-guide-editor";
import { getAdminDictionary } from "@/i18n/admin";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function NewGuidePage() {
  const cookieStore = await cookies();
  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }

  const adminDictionary =
    await getAdminDictionary(currentLocale);

  return (
    <AdminGuideEditor
      dictionary={
        adminDictionary.guides
      }
    />
  );
}
