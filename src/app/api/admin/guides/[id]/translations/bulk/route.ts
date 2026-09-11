import { NextResponse } from "next/server";

import { auth } from "@/auth";
import type { GuideLocaleContent } from "@/content/guides/types";
import type { Locale } from "@/i18n/config";
import {
  getGuideById,
  upsertGuideTranslation,
} from "@/lib/guides/db";

type BulkTranslationAction =
  | "copyEnglishToAll"
  | "approveAll";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const targetLocales: Locale[] = [
  "en",
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "bg",
  "sr",
  "tr",
  "pl",
  "ru",
];

const englishCopyTargets: Locale[] = [
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "bg",
  "sr",
  "tr",
  "pl",
  "ru",
];

function englishIsComplete(
  content: GuideLocaleContent
) {
  return Boolean(
    content.title.trim() &&
      content.excerpt.trim() &&
      content.blocks.length > 0 &&
      content.seo.title.trim() &&
      content.seo.metaDescription.trim()
  );
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: rawId } = await params;
  const guideId = Number(rawId);

  if (!Number.isInteger(guideId) || guideId <= 0) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  const body = (await request.json()) as {
    action?: BulkTranslationAction;
  };

  const guide = await getGuideById(guideId);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  if (body.action === "copyEnglishToAll") {
    const english = guide.translations.en;

    if (!english) {
      return NextResponse.json(
        { error: "Δεν υπάρχει αγγλική μετάφραση." },
        { status: 400 }
      );
    }

    if (!englishIsComplete(english)) {
      return NextResponse.json(
        {
          error:
            "Η αγγλική μετάφραση δεν είναι ακόμη πλήρης.",
        },
        { status: 400 }
      );
    }

    for (const locale of englishCopyTargets) {
      const copiedContent: GuideLocaleContent = {
        ...english,
        locale,
        translationStatus: "draft",
        blocks: english.blocks.map((block) => ({
          ...block,
          ...(block.type === "bulletList"
            ? { items: [...block.items] }
            : {}),
        })),
        seo: {
          ...english.seo,
          secondaryKeywords: [
            ...english.seo.secondaryKeywords,
          ],
        },
      };

      await upsertGuideTranslation(
        guideId,
        copiedContent
      );
    }

    return NextResponse.json({
      success: true,
      copiedCount: englishCopyTargets.length,
    });
  }

  if (body.action === "approveAll") {
    let approvedCount = 0;

    for (const locale of targetLocales) {
      const translation =
        guide.translations[locale];

      if (!translation) continue;

      await upsertGuideTranslation(guideId, {
        ...translation,
        translationStatus: "approved",
      });

      approvedCount += 1;
    }

    return NextResponse.json({
      success: true,
      approvedCount,
    });
  }

  return NextResponse.json(
    { error: "Unknown bulk translation action." },
    { status: 400 }
  );
}
