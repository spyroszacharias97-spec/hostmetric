import Link from "next/link";
import { notFound } from "next/navigation";

import GuidePreview from "@/components/guide-preview";
import { getGuideById } from "@/lib/guides/db";
import type { Locale } from "@/i18n/config";

type GuidePreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    locale?: string;
  }>;
};

type LocaleOption = {
  locale: Locale;
  flagCode: string;
  label: string;
};

const localeOptions: LocaleOption[] = [
  {
    locale: "el",
    flagCode: "gr",
    label: "Ελληνικά",
  },
  {
    locale: "en",
    flagCode: "gb",
    label: "English",
  },
  {
    locale: "de",
    flagCode: "de",
    label: "Deutsch",
  },
  {
    locale: "fr",
    flagCode: "fr",
    label: "Français",
  },
  {
    locale: "it",
    flagCode: "it",
    label: "Italiano",
  },
  {
    locale: "es",
    flagCode: "es",
    label: "Español",
  },
  {
    locale: "pt",
    flagCode: "pt",
    label: "Português",
  },
  {
    locale: "bg",
    flagCode: "bg",
    label: "Български",
  },
  {
    locale: "sr",
    flagCode: "rs",
    label: "Srpski",
  },
  {
    locale: "tr",
    flagCode: "tr",
    label: "Türkçe",
  },
  {
    locale: "pl",
    flagCode: "pl",
    label: "Polski",
  },
  {
    locale: "ru",
    flagCode: "ru",
    label: "Русский",
  },
];

export default async function GuidePreviewPage({
  params,
  searchParams,
}: GuidePreviewPageProps) {
  const { id: rawId } = await params;

  const {
    locale: requestedLocale,
  } = await searchParams;

  const id = Number(rawId);

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

  const availableLocales =
    localeOptions.filter(
      ({ locale }) =>
        Boolean(
          guide.translations[locale]
        )
    );

  const requestedIsAvailable =
    requestedLocale &&
    availableLocales.some(
      ({ locale }) =>
        locale === requestedLocale
    );

  const selectedLocale: Locale =
    requestedIsAvailable
      ? (requestedLocale as Locale)
      : guide.sourceLocale;

  const content =
    guide.translations[
      selectedLocale
    ];

  if (!content) {
    notFound();
  }

  return (
    <div className="relative pb-24">
      <div className="mx-auto mb-7 max-w-6xl px-4 sm:px-6">
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <span className="mr-2 whitespace-nowrap text-sm font-black text-slate-500">
            Γλώσσα:
          </span>

          {availableLocales.map(
            ({
              locale,
              flagCode,
              label,
            }) => {
              const active =
                locale ===
                selectedLocale;

              return (
                <Link
                  key={locale}
                  href={`/admin/guides/${guide.id}/preview?locale=${locale}`}
                  title={label}
                  aria-label={`${label} (${locale.toUpperCase()})`}
                  className={`inline-flex h-11 min-w-[74px] items-center justify-center gap-2 rounded-xl border px-3 text-sm font-black transition ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w40/${flagCode}.png`}
                    alt=""
                    aria-hidden="true"
                    className="h-[14px] w-5 rounded-[2px] object-cover shadow-sm"
                  />

                  <span>
                    {locale.toUpperCase()}
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </div>

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