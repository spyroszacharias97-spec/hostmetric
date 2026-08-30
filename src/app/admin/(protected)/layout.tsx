import type { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminShell from "@/components/admin-shell";

import { getAdminDictionary } from "@/i18n/admin";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const adminDictionary = await getAdminDictionary(currentLocale);

  return (
    <AdminShell dictionary={adminDictionary}>
      {children}
    </AdminShell>
  );
}
