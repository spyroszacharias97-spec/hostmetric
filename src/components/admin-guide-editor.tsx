"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  Languages,
  Loader2,
  Plus,
  Rocket,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type {
  GuideBlock,
  GuideDraftInput,
  GuideRecord,
  GuideSearchIntent,
  GuideStatus,
} from "@/content/guides/types";
import type { AdminDictionary } from "@/i18n/admin";
import type { Locale } from "@/i18n/config";
import { createGuideSlug } from "@/lib/guides/slug";

type GuideDictionary = AdminDictionary["guides"];

type SectionDraft = {
  id: string;
  h2: string;
  paragraph: string;
  h3: string;
  internalLink: string;
  bullets: string;
  callout: string;
};

type AdminGuideEditorProps = {
  dictionary: GuideDictionary;
  initialGuide?: GuideRecord;
};

function emptySection(index = 0): SectionDraft {
  return {
    id: `section-${Date.now()}-${index}`,
    h2: "",
    paragraph: "",
    h3: "",
    internalLink: "",
    bullets: "",
    callout: "",
  };
}

function blocksToSections(blocks: GuideBlock[]): SectionDraft[] {
  if (blocks.length === 0) {
    return [emptySection()];
  }

  const sections: SectionDraft[] = [];
  let current = emptySection(0);

  const pushCurrent = () => {
    const hasContent =
      current.h2 ||
      current.paragraph ||
      current.h3 ||
      current.internalLink ||
      current.bullets ||
      current.callout;

    if (hasContent) {
      sections.push(current);
    }
  };

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) {
      pushCurrent();
      current = emptySection(sections.length);
      current.h2 = block.text;
      continue;
    }

    if (block.type === "heading" && block.level === 3) {
      current.h3 = block.text;
      continue;
    }

    if (block.type === "paragraph") {
      current.paragraph = current.paragraph
        ? `${current.paragraph}\n\n${block.text}`
        : block.text;
      continue;
    }

    if (block.type === "bulletList") {
      current.bullets = block.items.join("\n");
      continue;
    }

    if (block.type === "callout") {
      current.callout = block.text;
      continue;
    }

    if (block.type === "internalLink") {
      current.internalLink = block.href;
    }
  }

  pushCurrent();

  return sections.length > 0
    ? sections
    : [emptySection()];
}

function sectionsToBlocks(
  sections: SectionDraft[]
): GuideBlock[] {
  const blocks: GuideBlock[] = [];

  sections.forEach((section, sectionIndex) => {
    if (section.h2.trim()) {
      blocks.push({
        id: `s${sectionIndex + 1}-h2`,
        type: "heading",
        level: 2,
        text: section.h2.trim(),
      });
    }

    if (section.paragraph.trim()) {
      blocks.push({
        id: `s${sectionIndex + 1}-paragraph`,
        type: "paragraph",
        text: section.paragraph.trim(),
      });
    }

    if (section.h3.trim()) {
      blocks.push({
        id: `s${sectionIndex + 1}-h3`,
        type: "heading",
        level: 3,
        text: section.h3.trim(),
      });
    }

    const bulletItems = section.bullets
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (bulletItems.length > 0) {
      blocks.push({
        id: `s${sectionIndex + 1}-bullets`,
        type: "bulletList",
        items: bulletItems,
      });
    }

    if (section.callout.trim()) {
      blocks.push({
        id: `s${sectionIndex + 1}-callout`,
        type: "callout",
        text: section.callout.trim(),
      });
    }

    if (section.internalLink.trim()) {
      blocks.push({
        id: `s${sectionIndex + 1}-internal-link`,
        type: "internalLink",
        label: section.internalLink.trim(),
        href: section.internalLink.trim(),
      });
    }
  });

  return blocks;
}

export default function AdminGuideEditor({
  dictionary: d,
  initialGuide,
}: AdminGuideEditorProps) {
  const router = useRouter();

  const sourceContent =
    initialGuide?.translations[
      initialGuide.sourceLocale
    ];

  const [guideId, setGuideId] =
    useState<number | null>(
      initialGuide?.id ?? null
    );

  const [title, setTitle] =
    useState(sourceContent?.title ?? "");

  const [slug, setSlug] =
    useState(initialGuide?.slug ?? "");

  const [slugTouched, setSlugTouched] =
    useState(Boolean(initialGuide));

  const [excerpt, setExcerpt] =
    useState(sourceContent?.excerpt ?? "");

  const [category, setCategory] =
    useState(initialGuide?.category ?? "");

  const [author, setAuthor] =
    useState(initialGuide?.author ?? "HostMetric");

  const [featuredImage, setFeaturedImage] =
    useState(initialGuide?.featuredImage.src ?? "");

  const imageInputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [imageUploadError, setImageUploadError] =
    useState("");

  const [isDraggingImage, setIsDraggingImage] =
    useState(false);

  const [sourceLocale, setSourceLocale] =
    useState<Locale>(
      initialGuide?.sourceLocale ?? "el"
    );

  const [sections, setSections] =
    useState<SectionDraft[]>(
      sourceContent
        ? blocksToSections(sourceContent.blocks)
        : [emptySection()]
    );

  const [seoTitle, setSeoTitle] =
    useState(sourceContent?.seo.title ?? "");

  const [metaDescription, setMetaDescription] =
    useState(
      sourceContent?.seo.metaDescription ?? ""
    );

  const [focusKeyword, setFocusKeyword] =
    useState(
      sourceContent?.seo.focusKeyword ?? ""
    );

  const [
    secondaryKeywords,
    setSecondaryKeywords,
  ] = useState(
    sourceContent?.seo.secondaryKeywords.join(", ") ??
      ""
  );

  const [searchIntent, setSearchIntent] =
    useState<GuideSearchIntent>(
      sourceContent?.seo.searchIntent ??
        "informational"
    );

  const [
    targetCommercialPage,
    setTargetCommercialPage,
  ] = useState(
    sourceContent?.seo.targetCommercialPage ??
      "/services/smart-pricing"
  );

  const [imageAlt, setImageAlt] =
    useState(sourceContent?.seo.imageAlt ?? "");

  const [ogTitle, setOgTitle] =
    useState(sourceContent?.seo.ogTitle ?? "");

  const [ogDescription, setOgDescription] =
    useState(
      sourceContent?.seo.ogDescription ?? ""
    );

  const [ogImage, setOgImage] =
    useState(sourceContent?.seo.ogImage ?? "");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] =
    useState("");
  const [saveSuccess, setSaveSuccess] =
    useState("");

  const [guideStatus, setGuideStatus] =
    useState<GuideStatus>(
      initialGuide?.status ?? "draft"
    );

  const [publishingGuide, setPublishingGuide] =
    useState(false);

  const [unpublishingGuide, setUnpublishingGuide] =
    useState(false);

  const [deletingGuide, setDeletingGuide] =
    useState(false);

  const [bulkTranslationAction, setBulkTranslationAction] =
    useState<"copy" | "approve" | null>(null);
  const [bulkTranslationError, setBulkTranslationError] =
    useState("");
  const [bulkTranslationSuccess, setBulkTranslationSuccess] =
    useState("");

  const inputClass =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

  const labelClass =
    "text-sm font-black text-slate-700";

  const sectionClass =
    "rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7";

  const translationLanguages = [
    ["en", d.translationLanguages.en],
    ["de", d.translationLanguages.de],
    ["fr", d.translationLanguages.fr],
    ["it", d.translationLanguages.it],
    ["es", d.translationLanguages.es],
    ["pt", d.translationLanguages.pt],
    ["bg", d.translationLanguages.bg],
    ["sr", d.translationLanguages.sr],
    ["tr", d.translationLanguages.tr],
    ["pl", d.translationLanguages.pl],
    ["ru", d.translationLanguages.ru],
  ] as const;

  const englishTranslation =
    initialGuide?.translations.en;

  const englishIsComplete = Boolean(
    englishTranslation?.title.trim() &&
      englishTranslation.excerpt.trim() &&
      englishTranslation.blocks.length > 0 &&
      englishTranslation.seo.title.trim() &&
      englishTranslation.seo.metaDescription.trim()
  );

  const blocks = useMemo(
    () => sectionsToBlocks(sections),
    [sections]
  );

  const seoState = useMemo(() => {
    const hasH2 = blocks.some(
      (block) =>
        block.type === "heading" &&
        block.level === 2
    );

    const hasInternalLink = blocks.some(
      (block) =>
        block.type === "internalLink"
    );

    return {
      title: seoTitle.trim().length > 0,
      focusKeyword:
        focusKeyword.trim().length > 0,
      metaDescription:
        metaDescription.trim().length >= 110 &&
        metaDescription.trim().length <= 165,
      headings: hasH2,
      internalLinks: hasInternalLink,
      imageAlt: imageAlt.trim().length > 0,
      canonical: slug.trim().length > 0,
    };
  }, [
    blocks,
    seoTitle,
    focusKeyword,
    metaDescription,
    imageAlt,
    slug,
  ]);

  const seoChecks = [
    [d.seoChecks.title, seoState.title],
    [
      d.seoChecks.focusKeyword,
      seoState.focusKeyword,
    ],
    [
      d.seoChecks.metaDescription,
      seoState.metaDescription,
    ],
    [d.seoChecks.headings, seoState.headings],
    [
      d.seoChecks.internalLinks,
      seoState.internalLinks,
    ],
    [d.seoChecks.imageAlt, seoState.imageAlt],
    [d.seoChecks.canonical, seoState.canonical],
  ] as const;

  const completedSeoChecks =
    seoChecks.filter(([, complete]) => complete)
      .length;

  const seoScore = Math.round(
    (completedSeoChecks / seoChecks.length) *
      100
  );

  const updateSection = (
    id: string,
    field: keyof Omit<SectionDraft, "id">,
    value: string
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    );
  };

  const addSection = () => {
    setSections((current) => [
      ...current,
      emptySection(current.length),
    ]);
  };

  const removeSection = (id: string) => {
    setSections((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter(
        (section) => section.id !== id
      );
    });
  };

  const handleTitleChange = (
    value: string
  ) => {
    setTitle(value);

    if (!slugTouched) {
      setSlug(createGuideSlug(value));
    }
  };

  const handleFeaturedImageUpload =
    async (
      file: File | null
    ) => {
      if (!file) return;

      setUploadingImage(true);
      setImageUploadError("");

      try {
        const body =
          new FormData();

        body.set(
          "file",
          file
        );

        body.set(
          "slug",
          slug || title || "guide"
        );

        const response =
          await fetch(
            "/api/admin/guides/images",
            {
              method: "POST",
              body,
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.url
        ) {
          throw new Error(
            result?.error ||
              d.messages.imageUploadFailed
          );
        }

        const imageUrl =
          String(result.url);

        setFeaturedImage(
          imageUrl
        );

        setOgImage(
          imageUrl
        );
      } catch (error) {
        setImageUploadError(
          error instanceof Error
            ? error.message
            : d.messages.imageUploadFailed
        );
      } finally {
        setUploadingImage(false);

        if (
          imageInputRef.current
        ) {
          imageInputRef.current.value =
            "";
        }
      }
    };

  const removeFeaturedImage = () => {
    setFeaturedImage("");
    setOgImage("");
    setImageUploadError("");

    if (
      imageInputRef.current
    ) {
      imageInputRef.current.value =
        "";
    }
  };

  const buildDraftInput =
    (): GuideDraftInput => ({
      slug: slug.trim(),
      category: category.trim(),
      author: author.trim(),
      sourceLocale,
      featuredImage: {
        src: featuredImage.trim(),
        alt: imageAlt.trim(),
        caption: "",
      },
      relatedGuideSlugs: [],
      sourceContent: {
        locale: sourceLocale,
        translationStatus: "draft",
        title: title.trim(),
        excerpt: excerpt.trim(),
        blocks,
        seo: {
          title: seoTitle.trim(),
          metaDescription:
            metaDescription.trim(),
          focusKeyword:
            focusKeyword.trim(),
          secondaryKeywords:
            secondaryKeywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean),
          searchIntent,
          targetCommercialPage,
          imageAlt: imageAlt.trim(),
          ogTitle: ogTitle.trim(),
          ogDescription:
            ogDescription.trim(),
          ogImage: ogImage.trim(),
          notes: "",
        },
      },
    });

  const handleSaveDraft = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const input = buildDraftInput();

      const endpoint = guideId
        ? `/api/admin/guides/${guideId}`
        : "/api/admin/guides";

      const response = await fetch(endpoint, {
        method: guideId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationErrors =
          result?.validation?.errors;

        if (
          Array.isArray(validationErrors) &&
          validationErrors.length > 0
        ) {
          throw new Error(
            validationErrors.join(" ")
          );
        }

        throw new Error(
          result?.error ||
            d.messages.saveFailed
        );
      }

      const savedId = Number(result.id);

      if (!guideId && savedId) {
        setGuideId(savedId);
        setSaveSuccess(
          d.messages.draftCreated
        );

        router.replace(
          `/admin/guides/${savedId}`
        );
        router.refresh();
        return;
      }

      setSaveSuccess(
        d.messages.draftUpdated
      );
      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : d.messages.saveFailed
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!guideId) {
      setSaveError(
        d.messages.previewRequiresSave
      );
      return;
    }

    if (guideStatus === "published") {
      return;
    }

    const confirmed = window.confirm(
      "Είστε σίγουροι ότι θέλετε να δημοσιεύσετε το άρθρο; Θα γίνει δημόσιο και θα μπορεί να εμφανιστεί στις μηχανές αναζήτησης σύμφωνα με τους κανόνες δημοσίευσης."
    );

    if (!confirmed) {
      return;
    }

    setPublishingGuide(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/workflow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "publish",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Η δημοσίευση απέτυχε."
        );
      }

      setGuideStatus("published");
      setSaveSuccess(
        "Το άρθρο δημοσιεύτηκε επιτυχώς."
      );

      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Η δημοσίευση απέτυχε."
      );
    } finally {
      setPublishingGuide(false);
    }
  };


  const handleUnpublish = async () => {
    if (!guideId || guideStatus !== "published") {
      return;
    }

    const confirmed = window.confirm(
      `Είστε σίγουροι ότι θέλετε να αποκρύψετε το άρθρο «${title || slug}»;\n\nΘα γίνει μη δημοσιευμένο και δεν θα εμφανίζεται δημόσια.`
    );

    if (!confirmed) {
      return;
    }

    setUnpublishingGuide(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/list-actions`,
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

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Δεν ήταν δυνατή η απόκρυψη του άρθρου."
        );
      }

      setGuideStatus("unpublished");
      setSaveSuccess(
        "Το άρθρο αποκρύφτηκε επιτυχώς. Μπορείτε τώρα να το επεξεργαστείτε, να αποθηκεύσετε τις αλλαγές και να το δημοσιεύσετε ξανά."
      );

      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Δεν ήταν δυνατή η απόκρυψη του άρθρου."
      );
    } finally {
      setUnpublishingGuide(false);
    }
  };


  const handleCopyEnglishToAll = async () => {
    if (!guideId) {
      setBulkTranslationError(
        "Αποθηκεύστε πρώτα το άρθρο."
      );
      return;
    }

    if (!englishIsComplete) {
      setBulkTranslationError(
        "Η αγγλική μετάφραση δεν είναι ακόμη πλήρης."
      );
      return;
    }

    const confirmed = window.confirm(
      "Θα αντικατασταθεί το περιεχόμενο των DE, FR, IT, ES, PT, BG, SR, TR, PL και RU με το αγγλικό κείμενο και θα αποθηκευτεί ως Πρόχειρο. Τα Ελληνικά δεν θα αλλάξουν. Συνέχεια;"
    );

    if (!confirmed) return;

    setBulkTranslationAction("copy");
    setBulkTranslationError("");
    setBulkTranslationSuccess("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/translations/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "copyEnglishToAll",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Η αντιγραφή των Αγγλικών απέτυχε."
        );
      }

      setBulkTranslationSuccess(
        "Τα Αγγλικά αντιγράφηκαν σε όλες τις άλλες γλώσσες εκτός των Ελληνικών και αποθηκεύτηκαν ως Πρόχειρο."
      );
      router.refresh();
    } catch (error) {
      setBulkTranslationError(
        error instanceof Error
          ? error.message
          : "Η αντιγραφή των Αγγλικών απέτυχε."
      );
    } finally {
      setBulkTranslationAction(null);
    }
  };

  const handleApproveAllTranslations = async () => {
    if (!guideId) {
      setBulkTranslationError(
        "Αποθηκεύστε πρώτα το άρθρο."
      );
      return;
    }

    const confirmed = window.confirm(
      "Θέλετε να ορίσετε όλες τις υπάρχουσες μη ελληνικές μεταφράσεις ως Εγκεκριμένες;"
    );

    if (!confirmed) return;

    setBulkTranslationAction("approve");
    setBulkTranslationError("");
    setBulkTranslationSuccess("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/translations/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "approveAll",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Η μαζική έγκριση απέτυχε."
        );
      }

      setBulkTranslationSuccess(
        `Εγκρίθηκαν ${result.approvedCount ?? 0} μεταφράσεις.`
      );
      router.refresh();
    } catch (error) {
      setBulkTranslationError(
        error instanceof Error
          ? error.message
          : "Η μαζική έγκριση απέτυχε."
      );
    } finally {
      setBulkTranslationAction(null);
    }
  };


  const handleDeleteGuide = async () => {
    if (!guideId) {
      return;
    }

    const confirmed = window.confirm(
      `Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά το άρθρο «${title || slug}»;\n\nΘα διαγραφούν και όλες οι μεταφράσεις του. Η ενέργεια δεν αναιρείται.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingGuide(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/list-actions`,
        {
          method: "DELETE",
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Δεν ήταν δυνατή η διαγραφή του άρθρου."
        );
      }

      router.push("/admin/guides");
      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Δεν ήταν δυνατή η διαγραφή του άρθρου."
      );
    } finally {
      setDeletingGuide(false);
    }
  };

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

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/guides"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <FileText size={17} />
            {d.allArticles}
          </Link>

          {guideId ? (
            <button
              type="button"
              onClick={handleDeleteGuide}
              disabled={deletingGuide}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingGuide ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={17} />
              )}
              Διαγραφή
            </button>
          ) : null}

          <Link
            href="/admin/guides/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            {d.newArticle}
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className={sectionClass}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={21} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {d.sections.content}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {d.sections.contentDescription}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5">
              <label>
                <span className={labelClass}>
                  {d.fields.title}
                </span>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    handleTitleChange(
                      event.target.value
                    )
                  }
                  placeholder={d.placeholders.title}
                  className={inputClass}
                />
              </label>

              <div className="grid gap-5 lg:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    {d.fields.slug}
                  </span>

                  <input
                    type="text"
                    value={slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(
                        createGuideSlug(
                          event.target.value
                        )
                      );
                    }}
                    placeholder={
                      d.placeholders.slug
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className={labelClass}>
                    {d.fields.category}
                  </span>

                  <input
                    type="text"
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value
                      )
                    }
                    placeholder={
                      d.placeholders.category
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <label>
                <span className={labelClass}>
                  {d.fields.excerpt}
                </span>

                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(event) =>
                    setExcerpt(
                      event.target.value
                    )
                  }
                  placeholder={
                    d.placeholders.excerpt
                  }
                  className={inputClass}
                />
              </label>

              <div className="grid gap-5 lg:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    {d.fields.author}
                  </span>

                  <input
                    type="text"
                    value={author}
                    onChange={(event) =>
                      setAuthor(
                        event.target.value
                      )
                    }
                    placeholder={
                      d.placeholders.author
                    }
                    className={inputClass}
                  />
                </label>

                <div>
                  <span className={labelClass}>
                    {d.fields.featuredImage}
                  </span>

                  <div
                    onDragEnter={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsDraggingImage(true);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      const currentTarget =
                        event.currentTarget;

                      const relatedTarget =
                        event.relatedTarget as Node | null;

                      if (
                        !relatedTarget ||
                        !currentTarget.contains(
                          relatedTarget
                        )
                      ) {
                        setIsDraggingImage(false);
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      setIsDraggingImage(false);

                      const file =
                        event.dataTransfer.files?.[0] ??
                        null;

                      void handleFeaturedImageUpload(
                        file
                      );
                    }}
                    className={`mt-2 rounded-2xl border p-4 transition ${
                      isDraggingImage
                        ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                        : "border-slate-200 bg-slate-50/70"
                    }`}
                  >
                    {featuredImage ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featuredImage}
                          alt={imageAlt || title}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-white px-6 text-center transition ${
                          isDraggingImage
                            ? "border-blue-500 text-blue-600"
                            : "border-slate-300 text-slate-400"
                        }`}
                      >
                        <ImageIcon size={28} />
                        <p className="text-sm font-black">
                          Σύρετε και αφήστε εικόνα εδώ
                        </p>
                        <p className="text-xs font-semibold">
                          JPG, PNG ή WEBP έως 10 MB
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-black text-white transition hover:bg-blue-700">
                        {uploadingImage ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Upload size={16} />
                        )}

                        {uploadingImage
                          ? d.actions.uploadingImage
                          : d.actions.uploadImage}

                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(event) =>
                            handleFeaturedImageUpload(
                              event.currentTarget
                                .files?.[0] ?? null
                            )
                          }
                        />
                      </label>

                      {featuredImage ? (
                        <button
                          type="button"
                          onClick={removeFeaturedImage}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-50"
                        >
                          <X size={16} />
                          {d.actions.removeImage}
                        </button>
                      ) : null}
                    </div>

                    {imageUploadError ? (
                      <p className="mt-3 text-sm font-bold text-red-600">
                        {imageUploadError}
                      </p>
                    ) : null}

                    {featuredImage ? (
                      <p className="mt-3 break-all text-xs font-semibold text-slate-400">
                        {featuredImage}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {sections.map(
                (section, index) => (
                  <div
                    key={section.id}
                    className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                          Structured Content
                        </p>

                        <h3 className="mt-1 text-lg font-black text-slate-950">
                          Section {index + 1}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {sections.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              removeSection(
                                section.id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-black text-red-700 transition hover:bg-red-50"
                          >
                            <Trash2
                              size={15}
                            />
                            {
                              d.actions
                                .removeSection
                            }
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={addSection}
                          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-50"
                        >
                          <Plus size={15} />
                          {d.actions.addSection}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5">
                      <label>
                        <span
                          className={
                            labelClass
                          }
                        >
                          {d.fields.h2}
                        </span>

                        <input
                          type="text"
                          value={section.h2}
                          onChange={(event) =>
                            updateSection(
                              section.id,
                              "h2",
                              event.target
                                .value
                            )
                          }
                          placeholder={
                            d.placeholders.h2
                          }
                          className={
                            inputClass
                          }
                        />
                      </label>

                      <label>
                        <span
                          className={
                            labelClass
                          }
                        >
                          {
                            d.fields
                              .paragraph
                          }
                        </span>

                        <textarea
                          rows={7}
                          value={
                            section.paragraph
                          }
                          onChange={(event) =>
                            updateSection(
                              section.id,
                              "paragraph",
                              event.target
                                .value
                            )
                          }
                          placeholder={
                            d.placeholders
                              .paragraph
                          }
                          className={
                            inputClass
                          }
                        />
                      </label>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <label>
                          <span
                            className={
                              labelClass
                            }
                          >
                            {d.fields.h3}
                          </span>

                          <input
                            type="text"
                            value={
                              section.h3
                            }
                            onChange={(
                              event
                            ) =>
                              updateSection(
                                section.id,
                                "h3",
                                event.target
                                  .value
                              )
                            }
                            placeholder={
                              d.placeholders
                                .h3
                            }
                            className={
                              inputClass
                            }
                          />
                        </label>

                        <label>
                          <span
                            className={
                              labelClass
                            }
                          >
                            {
                              d.fields
                                .internalLink
                            }
                          </span>

                          <input
                            type="text"
                            value={
                              section.internalLink
                            }
                            onChange={(
                              event
                            ) =>
                              updateSection(
                                section.id,
                                "internalLink",
                                event.target
                                  .value
                              )
                            }
                            placeholder={
                              d.placeholders
                                .internalLink
                            }
                            className={
                              inputClass
                            }
                          />
                        </label>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <label>
                          <span
                            className={
                              labelClass
                            }
                          >
                            {
                              d.fields
                                .bullets
                            }
                          </span>

                          <textarea
                            rows={4}
                            value={
                              section.bullets
                            }
                            onChange={(
                              event
                            ) =>
                              updateSection(
                                section.id,
                                "bullets",
                                event.target
                                  .value
                              )
                            }
                            placeholder={
                              d.placeholders
                                .bullets
                            }
                            className={
                              inputClass
                            }
                          />
                        </label>

                        <label>
                          <span
                            className={
                              labelClass
                            }
                          >
                            {
                              d.fields
                                .callout
                            }
                          </span>

                          <textarea
                            rows={4}
                            value={
                              section.callout
                            }
                            onChange={(
                              event
                            ) =>
                              updateSection(
                                section.id,
                                "callout",
                                event.target
                                  .value
                              )
                            }
                            placeholder={
                              d.placeholders
                                .callout
                            }
                            className={
                              inputClass
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Search size={21} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {d.sections.seo}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {d.sections.seoDescription}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5">
              <label>
                <span className={labelClass}>
                  {d.fields.seoTitle}
                </span>

                <input
                  type="text"
                  value={seoTitle}
                  onChange={(event) =>
                    setSeoTitle(
                      event.target.value
                    )
                  }
                  placeholder={
                    d.placeholders.seoTitle
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  {d.fields.metaDescription}
                </span>

                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(event) =>
                    setMetaDescription(
                      event.target.value
                    )
                  }
                  placeholder={
                    d.placeholders
                      .metaDescription
                  }
                  className={inputClass}
                />
              </label>

              <div className="grid gap-5 lg:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    {d.fields.focusKeyword}
                  </span>

                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(event) =>
                      setFocusKeyword(
                        event.target.value
                      )
                    }
                    placeholder={
                      d.placeholders
                        .focusKeyword
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className={labelClass}>
                    {
                      d.fields
                        .secondaryKeywords
                    }
                  </span>

                  <input
                    type="text"
                    value={secondaryKeywords}
                    onChange={(event) =>
                      setSecondaryKeywords(
                        event.target.value
                      )
                    }
                    placeholder={
                      d.placeholders
                        .secondaryKeywords
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    {d.fields.searchIntent}
                  </span>

                  <select
                    value={searchIntent}
                    onChange={(event) =>
                      setSearchIntent(
                        event.target
                          .value as GuideSearchIntent
                      )
                    }
                    className={inputClass}
                  >
                    <option value="informational">
                      {d.options.informational}
                    </option>
                    <option value="commercial">
                      {d.options.commercial}
                    </option>
                    <option value="transactional">
                      {d.options.transactional}
                    </option>
                    <option value="navigational">
                      {d.options.navigational}
                    </option>
                  </select>
                </label>

                <label>
                  <span className={labelClass}>
                    {
                      d.fields
                        .targetCommercialPage
                    }
                  </span>

                  <select
                    value={
                      targetCommercialPage
                    }
                    onChange={(event) =>
                      setTargetCommercialPage(
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="/services/smart-pricing">
                      /services/smart-pricing
                    </option>
                    <option value="/services/booking-management">
                      /services/booking-management
                    </option>
                    <option value="/services/guest-communication">
                      /services/guest-communication
                    </option>

                    <option value="/solutions/centralized-management">
                      /solutions/centralized-management
                    </option>
                    <option value="/solutions/greater-visibility">
                      /solutions/greater-visibility
                    </option>
                    <option value="/solutions/smarter-distribution">
                      /solutions/smarter-distribution
                    </option>

                    <option value="/insights/ai-pricing">
                      /insights/ai-pricing
                    </option>
                    <option value="/insights/guest-rating">
                      /insights/guest-rating
                    </option>
                    <option value="/insights/occupancy">
                      /insights/occupancy
                    </option>
                    <option value="/insights/revenue">
                      /insights/revenue
                    </option>

                    <option value="/performance/guest-response">
                      /performance/guest-response
                    </option>
                    <option value="/performance/platform-network">
                      /performance/platform-network
                    </option>
                    <option value="/performance/pricing-engine">
                      /performance/pricing-engine
                    </option>

                    <option value="/about">
                      /about
                    </option>
                    <option value="/contact">
                      /contact
                    </option>
                    <option value="/get-started">
                      /get-started
                    </option>
                  </select>
                </label>
              </div>

              <label>
                <span className={labelClass}>
                  {d.fields.imageAlt}
                </span>

                <input
                  type="text"
                  value={imageAlt}
                  onChange={(event) =>
                    setImageAlt(
                      event.target.value
                    )
                  }
                  placeholder={
                    d.placeholders.imageAlt
                  }
                  className={inputClass}
                />
              </label>

              <div className="grid gap-5 lg:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    {d.fields.ogTitle}
                  </span>

                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(event) =>
                      setOgTitle(
                        event.target.value
                      )
                    }
                    placeholder={
                      d.placeholders.ogTitle
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className={labelClass}>
                    {d.fields.ogImage}
                  </span>

                  <input
                    type="text"
                    value={ogImage}
                    onChange={(event) =>
                      setOgImage(
                        event.target.value
                      )
                    }
                    placeholder={
                      d.placeholders.ogImage
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <label>
                <span className={labelClass}>
                  {d.fields.ogDescription}
                </span>

                <textarea
                  rows={3}
                  value={ogDescription}
                  onChange={(event) =>
                    setOgDescription(
                      event.target.value
                    )
                  }
                  placeholder={
                    d.placeholders
                      .ogDescription
                  }
                  className={inputClass}
                />
              </label>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Languages size={21} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {d.sections.translations}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {
                    d.sections
                      .translationsDescription
                  }
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4">
              <p className="text-sm font-black text-emerald-900">
                Χειροκίνητες μεταφράσεις
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Ανοίξτε κάθε γλώσσα, περάστε τη μετάφραση και αποθηκεύστε την ως Πρόχειρο, Ελεγμένη ή Εγκεκριμένη.
              </p>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <button
                type="button"
                onClick={handleCopyEnglishToAll}
                disabled={
                  !guideId ||
                  !englishIsComplete ||
                  bulkTranslationAction !== null
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bulkTranslationAction === "copy" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Languages size={17} />
                )}
                Αντιγραφή Αγγλικών σε όλες
              </button>

              <button
                type="button"
                onClick={handleApproveAllTranslations}
                disabled={
                  !guideId ||
                  bulkTranslationAction !== null
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bulkTranslationAction === "approve" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={17} />
                )}
                Έγκριση όλων
              </button>
            </div>

            {!englishIsComplete ? (
              <p className="mt-3 text-xs font-bold text-amber-700">
                Η αντιγραφή ενεργοποιείται όταν η αγγλική μετάφραση έχει τίτλο, excerpt, περιεχόμενο, SEO title και meta description.
              </p>
            ) : null}

            {bulkTranslationError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {bulkTranslationError}
              </div>
            ) : null}

            {bulkTranslationSuccess ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {bulkTranslationSuccess}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {translationLanguages.map(
                ([code, label]) => {
                  const translation =
                    initialGuide?.translations[
                      code as Locale
                    ];

                  const status =
                    translation?.translationStatus ??
                    "missing";

                  const statusLabel =
                    status === "approved"
                      ? "Εγκεκριμένη"
                      : status === "reviewed"
                        ? "Ελεγμένη"
                        : status === "draft"
                          ? "Πρόχειρο"
                          : d.options.notGenerated;

                  const statusClass =
                    status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : status === "reviewed"
                        ? "bg-blue-100 text-blue-700"
                        : status === "draft"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-200 text-slate-600";

                  return (
                    <div
                      key={code}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {label}
                          </p>

                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                            {code}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      {guideId ? (
                        <Link
                          href={`/admin/guides/${guideId}/translations/${code}`}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-50"
                        >
                          Επεξεργασία →
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-black text-slate-400 opacity-60"
                        >
                          Αποθηκεύστε πρώτα το άρθρο
                        </button>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section
            className={sectionClass}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Rocket size={21} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {d.sections.publishing}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {
                    d.sections
                      .publishingDescription
                  }
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className={labelClass}>
                {d.fields.publicationStatus}
              </p>

              <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-black text-amber-800">
                  {d.list.status[guideStatus]}
                </p>
              </div>
            </div>

            {saveError ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
                {saveError}
              </div>
            ) : null}

            {saveSuccess ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700">
                {saveSuccess}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || guideStatus === "published"}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving
                  ? d.actions.savingDraft
                  : d.actions.saveDraft}
              </button>

              {guideId ? (
                <Link
                  href={`/admin/guides/${guideId}/preview`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  <Eye size={17} />
                  {d.actions.preview}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  title={d.messages.previewRequiresSave}
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-500 opacity-60"
                >
                  <Eye size={17} />
                  {d.actions.preview}
                </button>
              )}

              {guideStatus === "published" ? (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  disabled={unpublishingGuide || publishingGuide}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {unpublishingGuide ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <EyeOff size={17} />
                  )}

                  {unpublishingGuide
                    ? "Απόκρυψη..."
                    : "Απόκρυψη"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={handlePublish}
                disabled={
                  !guideId ||
                  guideStatus === "published" ||
                  publishingGuide ||
                  unpublishingGuide
                }
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  guideStatus !== "published"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl"
                    : "cursor-not-allowed bg-emerald-100 text-emerald-700"
                } disabled:cursor-not-allowed`}
              >
                {publishingGuide ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : guideStatus === "published" ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Rocket size={17} />
                )}

                {publishingGuide
                  ? "Δημοσίευση..."
                  : guideStatus === "published"
                    ? "Δημοσιευμένο"
                    : d.actions.publish}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-slate-900">
                  {d.seoChecks.scoreLabel}
                </p>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-500">
                  {seoScore} / 100
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {seoChecks.map(
                  ([check, complete]) => (
                    <div
                      key={check}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          complete
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <CheckCircle2
                          size={13}
                        />
                      </div>

                      <p
                        className={`text-sm font-semibold leading-5 ${
                          complete
                            ? "text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        {check}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
