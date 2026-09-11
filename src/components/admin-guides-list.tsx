"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  EyeOff,
  Loader2,
  Plus,
  Rocket,
  Trash2,
} from "lucide-react";

import type {
  GuideRecord,
  GuideStatus,
} from "@/content/guides/types";

type Filter =
  | "all"
  | "draft"
  | "review"
  | "published"
  | "translation";

type AdminGuidesListProps = {
  guides: GuideRecord[];
};

const statusLabels: Record<GuideStatus, string> = {
  draft: "Πρόχειρο",
  review: "Σε Έλεγχο",
  published: "Δημοσιευμένο",
  unpublished: "Μη Δημοσιευμένο",
};

const statusClasses: Record<GuideStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  review: "bg-amber-50 text-amber-800",
  published: "bg-emerald-50 text-emerald-700",
  unpublished: "bg-violet-50 text-violet-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("el-CY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AdminGuidesList({
  guides,
}: AdminGuidesListProps) {
  const router = useRouter();
  const [filter, setFilter] =
    useState<Filter>("all");
  const [busyId, setBusyId] =
    useState<number | null>(null);
  const [error, setError] = useState("");

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const approvedCount = Object.values(
        guide.translations
      ).filter(
        (translation) =>
          translation?.translationStatus ===
          "approved"
      ).length;

      if (filter === "all") return true;
      if (filter === "translation") {
        return approvedCount < 12;
      }

      return guide.status === filter;
    });
  }, [filter, guides]);

  const handlePublish = async (
    guide: GuideRecord
  ) => {
    const sourceTitle =
      guide.translations[
        guide.sourceLocale
      ]?.title ?? guide.slug;

    const confirmed =
      window.confirm(
        `Να δημοσιευτεί το άρθρο «${sourceTitle}»;\n\nΘα γίνει πρώτα ο πλήρης έλεγχος περιεχομένου και SEO.`
      );

    if (!confirmed) return;

    setBusyId(guide.id);
    setError("");

    try {
      const response =
        await fetch(
          `/api/admin/guides/${guide.id}/workflow`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "publish",
            }),
          }
        );

      const result =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        const validationErrors =
          result?.validation?.errors;

        if (
          Array.isArray(
            validationErrors
          ) &&
          validationErrors.length > 0
        ) {
          throw new Error(
            validationErrors.join(
              " • "
            )
          );
        }

        throw new Error(
          result?.error ||
            "Η δημοσίευση απέτυχε."
        );
      }

      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Η δημοσίευση απέτυχε."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleUnpublish = async (
    guide: GuideRecord
  ) => {
    const confirmed = window.confirm(
      `Να αποκρυφτεί το άρθρο «${
        guide.translations[guide.sourceLocale]
          ?.title ?? guide.slug
      }» από τη δημόσια ιστοσελίδα;`
    );

    if (!confirmed) return;

    setBusyId(guide.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guide.id}/list-actions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "unpublish",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Η απόκρυψη απέτυχε."
        );
      }

      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Η απόκρυψη απέτυχε."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (
    guide: GuideRecord
  ) => {
    const sourceTitle =
      guide.translations[guide.sourceLocale]
        ?.title ?? guide.slug;

    const confirmed = window.confirm(
      `ΟΡΙΣΤΙΚΗ ΔΙΑΓΡΑΦΗ:\n\nΘέλετε να διαγράψετε το άρθρο «${sourceTitle}» και όλες τις μεταφράσεις του;\n\nΗ ενέργεια δεν αναιρείται.`
    );

    if (!confirmed) return;

    setBusyId(guide.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guide.id}/list-actions`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Η διαγραφή απέτυχε."
        );
      }

      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Η διαγραφή απέτυχε."
      );
    } finally {
      setBusyId(null);
    }
  };

  const filters: Array<{
    key: Filter;
    label: string;
  }> = [
    { key: "all", label: "Όλα" },
    { key: "draft", label: "Πρόχειρα" },
    { key: "review", label: "Σε Έλεγχο" },
    {
      key: "published",
      label: "Δημοσιευμένα",
    },
    {
      key: "translation",
      label: "Χρειάζονται Μετάφραση",
    },
  ];

  return (
    <div className="pb-14">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
            Content Studio
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Άρθρα & Οδηγοί
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
            Διαχειριστείτε τα πρόχειρα, τα άρθρα υπό έλεγχο, τις δημοσιεύσεις και την κατάσταση μεταφράσεων από ένα σημείο.
          </p>
        </div>

        <Link
          href="/admin/guides/new"
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Νέο Άρθρο
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
              filter === item.key
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-bold leading-6 text-red-700">
          <p className="font-black">
            Το άρθρο δεν μπορεί να δημοσιευτεί ακόμη:
          </p>
          <p className="mt-1">
            {error}
          </p>
        </div>
      ) : null}

      <div className="mt-7 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[minmax(0,2.5fr)_130px_130px_180px_210px] gap-6 border-b border-slate-200 bg-slate-50 px-7 py-5 text-xs font-black uppercase tracking-[0.12em] text-slate-500 lg:grid">
          <div>Άρθρο</div>
          <div>Κατάσταση</div>
          <div>Αρχική Γλώσσα</div>
          <div>Μεταφράσεις</div>
          <div className="text-right">Ενέργεια</div>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="px-7 py-12 text-center text-sm font-bold text-slate-500">
            Δεν υπάρχουν άρθρα σε αυτή την κατηγορία.
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const source =
              guide.translations[
                guide.sourceLocale
              ];

            const approvedCount = Object.values(
              guide.translations
            ).filter(
              (translation) =>
                translation?.translationStatus ===
                "approved"
            ).length;

            const busy = busyId === guide.id;

            return (
              <div
                key={guide.id}
                className="grid gap-5 border-b border-slate-100 px-7 py-6 last:border-b-0 lg:grid-cols-[minmax(0,2.5fr)_130px_130px_180px_210px] lg:items-center lg:gap-6"
              >
                <div>
                  <p className="font-black leading-6 text-slate-950">
                    {source?.title ?? guide.slug}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    /{guide.slug}
                  </p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-blue-600">
                    {guide.category}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-400 lg:hidden">
                    {formatDate(guide.updatedAt)}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${statusClasses[guide.status]}`}
                  >
                    {statusLabels[guide.status]}
                  </span>
                </div>

                <div className="font-black text-slate-700">
                  {guide.sourceLocale.toUpperCase()}
                </div>

                <div>
                  <p className="font-black text-slate-900">
                    {approvedCount} / 12 γλώσσες
                  </p>
                  {approvedCount < 12 ? (
                    <p className="mt-1 text-xs font-bold text-amber-600">
                      Χρειάζεται μετάφραση
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-bold text-emerald-600">
                      Ολοκληρωμένες
                    </p>
                  )}
                  <p className="mt-2 hidden text-xs font-semibold text-slate-400 lg:block">
                    {formatDate(guide.updatedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                  <Link
                    href={`/admin/guides/${guide.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-sm font-black text-blue-700 transition hover:bg-blue-100"
                  >
                    Άνοιγμα
                  </Link>

                  {guide.status !== "published" ? (
                    <button
                      type="button"
                      onClick={() =>
                        void handlePublish(guide)
                      }
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-600 bg-blue-600 px-3.5 py-2.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Rocket size={15} />
                      )}
                      Δημοσίευση
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        void handleUnpublish(guide)
                      }
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-black text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <EyeOff size={15} />
                      )}
                      Απόκρυψη
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(guide)
                    }
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    Διαγραφή
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
