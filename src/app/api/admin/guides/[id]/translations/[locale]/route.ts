import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  locales,
  type Locale,
} from "@/i18n/config";

import type {
  GuideBlock,
  GuideLocaleContent,
} from "@/content/guides/types";

import {
  getGuideById,
  upsertGuideTranslation,
} from "@/lib/guides/db";

type RouteContext = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

function parseGuideId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
}

function isLocale(
  value: string
): value is Locale {
  return locales.includes(
    value as Locale
  );
}

async function requireAdmin() {
  const session = await auth();

  return Boolean(
    session?.user?.email
  );
}

function cloneBlock(
  block: GuideBlock
): GuideBlock {
  if (
    block.type === "heading" ||
    block.type === "paragraph"
  ) {
    return {
      ...block,
      text: "",
    };
  }

  if (block.type === "bulletList") {
    return {
      ...block,
      items: block.items.map(
        () => ""
      ),
    };
  }

  if (block.type === "callout") {
    return {
      ...block,
      title: block.title
        ? ""
        : undefined,
      text: "",
    };
  }

  return {
    ...block,
    label: "",
    description:
      block.description
        ? ""
        : undefined,
    href: block.href,
  };
}

function createBlankTranslation(
  source: GuideLocaleContent,
  locale: Locale
): GuideLocaleContent {
  return {
    locale,
    translationStatus: "draft",
    title: "",
    excerpt: "",
    blocks:
      source.blocks.map(cloneBlock),
    seo: {
      title: "",
      metaDescription: "",
      focusKeyword: "",
      secondaryKeywords: [],
      searchIntent:
        source.seo.searchIntent,
      targetCommercialPage:
        source.seo
          .targetCommercialPage,
      imageAlt: "",
      ogTitle: "",
      ogDescription: "",
      ogImage:
        source.seo.ogImage,
      notes: "",
    },
  };
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const params =
    await context.params;

  const id =
    parseGuideId(params.id);

  if (!id) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  if (!isLocale(params.locale)) {
    return NextResponse.json(
      { error: "Invalid locale." },
      { status: 400 }
    );
  }

  const guide =
    await getGuideById(id);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  if (
    params.locale ===
    guide.sourceLocale
  ) {
    return NextResponse.json({
      guideId: guide.id,
      sourceLocale:
        guide.sourceLocale,
      content:
        guide.translations[
          guide.sourceLocale
        ],
      sourceContent:
        guide.translations[
          guide.sourceLocale
        ],
      isSource: true,
    });
  }

  const source =
    guide.translations[
      guide.sourceLocale
    ];

  if (!source) {
    return NextResponse.json(
      {
        error:
          "Source content is missing.",
      },
      { status: 409 }
    );
  }

  const existing =
    guide.translations[
      params.locale
    ];

  if (existing) {
    return NextResponse.json({
      guideId: guide.id,
      sourceLocale:
        guide.sourceLocale,
      content: existing,
      sourceContent: source,
      isSource: false,
    });
  }

  if (!source) {
    return NextResponse.json(
      {
        error:
          "Source content is missing.",
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    guideId: guide.id,
    sourceLocale:
      guide.sourceLocale,
    content:
      createBlankTranslation(
        source,
        params.locale
      ),
    sourceContent: source,
    isSource: false,
  });
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const params =
    await context.params;

  const id =
    parseGuideId(params.id);

  if (!id) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  if (!isLocale(params.locale)) {
    return NextResponse.json(
      { error: "Invalid locale." },
      { status: 400 }
    );
  }

  const guide =
    await getGuideById(id);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  if (
    params.locale ===
    guide.sourceLocale
  ) {
    return NextResponse.json(
      {
        error:
          "The source locale must be edited from the main guide editor.",
      },
      { status: 409 }
    );
  }

  const source =
    guide.translations[
      guide.sourceLocale
    ];

  if (!source) {
    return NextResponse.json(
      {
        error:
          "Source content is missing.",
      },
      { status: 409 }
    );
  }

  const body =
    (await request.json()) as {
      content?: GuideLocaleContent;
    };

  if (!body.content) {
    return NextResponse.json(
      {
        error:
          "Translation content is required.",
      },
      { status: 400 }
    );
  }

  const incoming =
    body.content;

  if (
    incoming.locale !==
    params.locale
  ) {
    return NextResponse.json(
      {
        error:
          "Locale mismatch.",
      },
      { status: 400 }
    );
  }

  const sourceIds =
    source.blocks.map(
      (block) => block.id
    );

  const incomingIds =
    incoming.blocks.map(
      (block) => block.id
    );

  if (
    JSON.stringify(sourceIds) !==
    JSON.stringify(incomingIds)
  ) {
    return NextResponse.json(
      {
        error:
          "Translation block structure does not match the source article.",
      },
      { status: 409 }
    );
  }

  const safeBlocks: GuideBlock[] =
    incoming.blocks.map(
      (block, index) => {
        const sourceBlock =
          source.blocks[index];

        if (
          block.type !==
          sourceBlock.type
        ) {
          throw new Error(
            `Block type mismatch at ${sourceBlock.id}.`
          );
        }

        if (
          sourceBlock.type ===
          "internalLink" &&
          block.type ===
          "internalLink"
        ) {
          return {
            ...block,
            id: sourceBlock.id,
            href:
              sourceBlock.href,
          };
        }

        return {
          ...block,
          id: sourceBlock.id,
        };
      }
    );

  const safeContent:
    GuideLocaleContent = {
      ...incoming,
      locale: params.locale,
      translationStatus:
        incoming.translationStatus ===
          "approved" ||
        incoming.translationStatus ===
          "reviewed"
          ? incoming.translationStatus
          : "draft",
      blocks: safeBlocks,
      seo: {
        ...incoming.seo,
        searchIntent:
          source.seo.searchIntent,
        targetCommercialPage:
          source.seo
            .targetCommercialPage,
        ogImage:
          source.seo.ogImage,
      },
    };

  await upsertGuideTranslation(
    id,
    safeContent
  );

  return NextResponse.json({
    success: true,
    content: safeContent,
  });
}
