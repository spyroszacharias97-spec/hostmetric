"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

import type {
  GuideBlock,
  GuideLocaleContent,
  GuideTranslationStatus,
} from "@/content/guides/types";
import type { Locale } from "@/i18n/config";

type TranslationEditorProps = {
  guideId: number;
  locale: Locale;
};

type TranslationResponse = {
  guideId: number;
  sourceLocale: Locale;
  content: GuideLocaleContent;
  sourceContent: GuideLocaleContent;
  isSource: boolean;
};

const localeNames: Record<Locale, string> = {
  el: "Ελληνικά",
  en: "Αγγλικά",
  de: "Γερμανικά",
  fr: "Γαλλικά",
  it: "Ιταλικά",
  es: "Ισπανικά",
  pt: "Πορτογαλικά",
  bg: "Βουλγαρικά",
  sr: "Σερβικά",
  tr: "Τουρκικά",
  pl: "Πολωνικά",
  ru: "Ρωσικά",
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

const lockedClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500";

const labelClass =
  "text-sm font-black text-slate-700";

function updateBlock(
  content: GuideLocaleContent,
  index: number,
  updater: (block: GuideBlock) => GuideBlock
): GuideLocaleContent {
  return {
    ...content,
    blocks: content.blocks.map((block, blockIndex) =>
      blockIndex === index ? updater(block) : block
    ),
  };
}

function SourceValue({
  value,
}: {
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
      {value || "—"}
    </div>
  );
}

export default function AdminGuideTranslationEditor({
  guideId,
  locale,
}: TranslationEditorProps) {
  const [source, setSource] =
    useState<GuideLocaleContent | null>(null);

  const [content, setContent] =
    useState<GuideLocaleContent | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/admin/guides/${guideId}/translations/${locale}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as TranslationResponse & {
            error?: string;
          };

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Αποτυχία φόρτωσης μετάφρασης."
          );
        }

        if (!cancelled) {
          setSource(result.sourceContent);
          setContent(result.content);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Αποτυχία φόρτωσης μετάφρασης."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [guideId, locale]);

  const completion = useMemo(() => {
    if (!content) return 0;

    const fields = [
      content.title,
      content.excerpt,
      content.seo.title,
      content.seo.metaDescription,
      content.seo.focusKeyword,
      content.seo.imageAlt,
      content.seo.ogTitle,
      content.seo.ogDescription,
      ...content.blocks.flatMap((block) => {
        if (
          block.type === "heading" ||
          block.type === "paragraph"
        ) {
          return [block.text];
        }

        if (block.type === "bulletList") {
          return block.items;
        }

        if (block.type === "callout") {
          return [
            block.title ?? "filled",
            block.text,
          ];
        }

        return [
          block.label,
          block.description ?? "filled",
        ];
      }),
    ];

    if (fields.length === 0) return 0;

    const completed =
      fields.filter(
        (value) => value.trim().length > 0
      ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [content]);

  const save = async (
    status?: GuideTranslationStatus
  ) => {
    if (!content) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const nextContent: GuideLocaleContent = {
      ...content,
      translationStatus:
        status ?? content.translationStatus,
    };

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/translations/${locale}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: nextContent,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Αποτυχία αποθήκευσης μετάφρασης."
        );
      }

      setContent(result.content);
      setSuccess(
        status === "approved"
          ? "Η μετάφραση εγκρίθηκε."
          : status === "reviewed"
            ? "Η μετάφραση σημειώθηκε ως ελεγμένη."
            : "Η μετάφραση αποθηκεύτηκε."
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Αποτυχία αποθήκευσης μετάφρασης."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600"
          size={30}
        />
      </div>
    );
  }

  if (!source || !content) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-700">
        {error ||
          "Δεν ήταν δυνατή η φόρτωση της μετάφρασης."}
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-4 pb-16 sm:px-6 xl:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link
            href={`/admin/guides/${guideId}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-base font-black text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800"
          >
            <ArrowLeft size={16} />
            Επιστροφή στο άρθρο
          </Link>

          <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-emerald-600">
            Translation Editor
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {localeNames[locale]}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
            Αριστερά βλέπετε το ελληνικό πρωτότυπο και δεξιά γράφετε τη μετάφραση. Τα τεχνικά URLs παραμένουν κλειδωμένα.
          </p>
        </div>

        <div
          className={`min-w-[190px] rounded-3xl border px-5 py-4 shadow-sm ${
            completion === 100
              ? "border-emerald-200 bg-emerald-50"
              : completion >= 70
                ? "border-blue-200 bg-blue-50"
                : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <p
              className={`text-xs font-black uppercase tracking-[0.14em] ${
                completion === 100
                  ? "text-emerald-700"
                  : completion >= 70
                    ? "text-blue-700"
                    : "text-amber-700"
              }`}
            >
              Ολοκλήρωση
            </p>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-black ${
                completion === 100
                  ? "bg-emerald-600 text-white"
                  : completion >= 70
                    ? "bg-blue-600 text-white"
                    : "bg-amber-500 text-white"
              }`}
            >
              {completion}%
            </span>
          </div>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/80">
            <div
              className={`h-full rounded-full transition-all ${
                completion === 100
                  ? "bg-emerald-600"
                  : completion >= 70
                    ? "bg-blue-600"
                    : "bg-amber-500"
              }`}
              style={{ width: `${completion}%` }}
            />
          </div>

          <p
            className={`mt-2 text-sm font-bold ${
              completion === 100
                ? "text-emerald-800"
                : completion >= 70
                  ? "text-blue-800"
                  : "text-amber-800"
            }`}
          >
            {completion === 100
              ? "Η μετάφραση είναι πλήρης"
              : "Υπάρχουν ακόμη κενά πεδία"}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-2xl font-black text-slate-950">
              Βασικά στοιχεία
            </h2>

            <div className="mt-6 space-y-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <span className={labelClass}>
                    Πρωτότυπος Τίτλος
                  </span>
                  <SourceValue value={source.title} />
                </div>

                <label>
                  <span className={labelClass}>
                    Μεταφρασμένος Τίτλος
                  </span>
                  <input
                    className={inputClass}
                    value={content.title}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        title: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <span className={labelClass}>
                    Πρωτότυπο Excerpt
                  </span>
                  <SourceValue value={source.excerpt} />
                </div>

                <label>
                  <span className={labelClass}>
                    Μεταφρασμένο Excerpt
                  </span>
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={content.excerpt}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        excerpt: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-2xl font-black text-slate-950">
              Περιεχόμενο
            </h2>

            <div className="mt-6 space-y-5">
              {source.blocks.map(
                (sourceBlock, index) => {
                  const block =
                    content.blocks[index];

                  if (!block) return null;

                  return (
                    <div
                      key={sourceBlock.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                        {sourceBlock.type} · {sourceBlock.id}
                      </p>

                      {sourceBlock.type === "heading" &&
                      block.type === "heading" ? (
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <SourceValue
                            value={sourceBlock.text}
                          />
                          <input
                            className={inputClass}
                            value={block.text}
                            onChange={(event) =>
                              setContent(
                                updateBlock(
                                  content,
                                  index,
                                  () => ({
                                    ...block,
                                    text: event.target.value,
                                  })
                                )
                              )
                            }
                          />
                        </div>
                      ) : null}

                      {sourceBlock.type === "paragraph" &&
                      block.type === "paragraph" ? (
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <SourceValue
                            value={sourceBlock.text}
                          />
                          <textarea
                            rows={8}
                            className={inputClass}
                            value={block.text}
                            onChange={(event) =>
                              setContent(
                                updateBlock(
                                  content,
                                  index,
                                  () => ({
                                    ...block,
                                    text: event.target.value,
                                  })
                                )
                              )
                            }
                          />
                        </div>
                      ) : null}

                      {sourceBlock.type === "bulletList" &&
                      block.type === "bulletList" ? (
                        <div className="mt-4 space-y-3">
                          {sourceBlock.items.map(
                            (sourceItem, itemIndex) => (
                              <div
                                key={`${sourceBlock.id}-${itemIndex}`}
                                className="grid gap-4 lg:grid-cols-2"
                              >
                                <SourceValue
                                  value={sourceItem}
                                />
                                <input
                                  className={inputClass}
                                  value={
                                    block.items[
                                      itemIndex
                                    ] ?? ""
                                  }
                                  onChange={(event) =>
                                    setContent(
                                      updateBlock(
                                        content,
                                        index,
                                        () => ({
                                          ...block,
                                          items:
                                            block.items.map(
                                              (
                                                item,
                                                currentIndex
                                              ) =>
                                                currentIndex ===
                                                itemIndex
                                                  ? event.target
                                                      .value
                                                  : item
                                            ),
                                        })
                                      )
                                    )
                                  }
                                />
                              </div>
                            )
                          )}
                        </div>
                      ) : null}

                      {sourceBlock.type === "callout" &&
                      block.type === "callout" ? (
                        <div className="mt-4 space-y-4">
                          {sourceBlock.title ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                              <SourceValue
                                value={sourceBlock.title}
                              />
                              <input
                                className={inputClass}
                                value={block.title ?? ""}
                                onChange={(event) =>
                                  setContent(
                                    updateBlock(
                                      content,
                                      index,
                                      () => ({
                                        ...block,
                                        title:
                                          event.target.value,
                                      })
                                    )
                                  )
                                }
                              />
                            </div>
                          ) : null}

                          <div className="grid gap-4 lg:grid-cols-2">
                            <SourceValue
                              value={sourceBlock.text}
                            />
                            <textarea
                              rows={5}
                              className={inputClass}
                              value={block.text}
                              onChange={(event) =>
                                setContent(
                                  updateBlock(
                                    content,
                                    index,
                                    () => ({
                                      ...block,
                                      text: event.target.value,
                                    })
                                  )
                                )
                              }
                            />
                          </div>
                        </div>
                      ) : null}

                      {sourceBlock.type === "internalLink" &&
                      block.type === "internalLink" ? (
                        <div className="mt-4 space-y-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            <SourceValue
                              value={sourceBlock.label}
                            />
                            <input
                              className={inputClass}
                              value={block.label}
                              onChange={(event) =>
                                setContent(
                                  updateBlock(
                                    content,
                                    index,
                                    () => ({
                                      ...block,
                                      label:
                                        event.target.value,
                                    })
                                  )
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className={labelClass}>
                              Κλειδωμένο URL
                            </span>
                            <input
                              disabled
                              className={lockedClass}
                              value={sourceBlock.href}
                            />
                          </div>

                          {sourceBlock.description !==
                          undefined ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                              <SourceValue
                                value={
                                  sourceBlock.description ??
                                  ""
                                }
                              />
                              <textarea
                                rows={3}
                                className={inputClass}
                                value={
                                  block.description ?? ""
                                }
                                onChange={(event) =>
                                  setContent(
                                    updateBlock(
                                      content,
                                      index,
                                      () => ({
                                        ...block,
                                        description:
                                          event.target.value,
                                      })
                                    )
                                  )
                                }
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                }
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-2xl font-black text-slate-950">
              SEO Μετάφρασης
            </h2>

            <div className="mt-6 space-y-5">
              {[
                ["SEO Title", "title"],
                ["Meta Description", "metaDescription"],
                ["Focus Keyword", "focusKeyword"],
                ["Image Alt", "imageAlt"],
                ["Open Graph Title", "ogTitle"],
                ["Open Graph Description", "ogDescription"],
              ].map(([label, key]) => {
                const seoKey =
                  key as keyof Pick<
                    GuideLocaleContent["seo"],
                    | "title"
                    | "metaDescription"
                    | "focusKeyword"
                    | "imageAlt"
                    | "ogTitle"
                    | "ogDescription"
                  >;

                return (
                  <div
                    key={key}
                    className="grid gap-4 lg:grid-cols-2"
                  >
                    <div>
                      <span className={labelClass}>
                        {label} · Πρωτότυπο
                      </span>
                      <SourceValue
                        value={source.seo[seoKey]}
                      />
                    </div>

                    <label>
                      <span className={labelClass}>
                        {label} · Μετάφραση
                      </span>
                      {key === "metaDescription" ||
                      key === "ogDescription" ? (
                        <textarea
                          rows={3}
                          className={inputClass}
                          value={
                            content.seo[seoKey]
                          }
                          onChange={(event) =>
                            setContent({
                              ...content,
                              seo: {
                                ...content.seo,
                                [seoKey]:
                                  event.target.value,
                              },
                            })
                          }
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={
                            content.seo[seoKey]
                          }
                          onChange={(event) =>
                            setContent({
                              ...content,
                              seo: {
                                ...content.seo,
                                [seoKey]:
                                  event.target.value,
                              },
                            })
                          }
                        />
                      )}
                    </label>
                  </div>
                );
              })}

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <span className={labelClass}>
                    Secondary Keywords · Πρωτότυπο
                  </span>
                  <SourceValue
                    value={source.seo.secondaryKeywords.join(
                      ", "
                    )}
                  />
                </div>

                <label>
                  <span className={labelClass}>
                    Secondary Keywords · Μετάφραση
                  </span>
                  <input
                    className={inputClass}
                    value={content.seo.secondaryKeywords.join(
                      ", "
                    )}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        seo: {
                          ...content.seo,
                          secondaryKeywords:
                            event.target.value
                              .split(",")
                              .map((item) =>
                                item.trim()
                              )
                              .filter(Boolean),
                        },
                      })
                    }
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <span className={labelClass}>
                    Search Intent
                  </span>
                  <input
                    disabled
                    className={lockedClass}
                    value={content.seo.searchIntent}
                  />
                </div>

                <div>
                  <span className={labelClass}>
                    Target Commercial Page
                  </span>
                  <input
                    disabled
                    className={lockedClass}
                    value={
                      content.seo.targetCommercialPage
                    }
                  />
                </div>
              </div>

              <div>
                <span className={labelClass}>
                  Open Graph Image
                </span>
                <input
                  disabled
                  className={lockedClass}
                  value={content.seo.ogImage}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Κατάσταση Μετάφρασης
            </p>

            <div className="mt-3">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-black ${
                  content.translationStatus === "approved"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : content.translationStatus === "reviewed"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {content.translationStatus === "approved"
                  ? "✓ Εγκεκριμένη"
                  : content.translationStatus === "reviewed"
                    ? "✓ Ελεγμένη"
                    : "● Πρόχειρο"}
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => void save("draft")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}
                Αποθήκευση Προχείρου
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void save("reviewed")
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm font-black text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                Σημείωση ως Ελεγμένη
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void save("approved")
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                Έγκριση Μετάφρασης
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
