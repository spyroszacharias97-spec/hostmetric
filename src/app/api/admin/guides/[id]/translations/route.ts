import { NextResponse } from "next/server";

import { auth } from "@/auth";

import type {
  GuideBlock,
  GuideLocaleContent,
} from "@/content/guides/types";

import {
  getGuideById,
  upsertGuideTranslation,
} from "@/lib/guides/db";

import {
  locales,
  type Locale,
} from "@/i18n/config";

export const runtime = "nodejs";
export const maxDuration = 60;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type TranslatedBlockPayload = {
  id: string;
  text: string | null;
  title: string | null;
  items: string[];
  label: string | null;
  description: string | null;
};

type TranslationPayload = {
  title: string;
  excerpt: string;
  blocks: TranslatedBlockPayload[];
  seo: {
    title: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    imageAlt: string;
    ogTitle: string;
    ogDescription: string;
  };
};

const localeNames: Record<Locale, string> = {
  el: "Greek",
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
  es: "Spanish",
  pt: "Portuguese",
  bg: "Bulgarian",
  sr: "Serbian",
  tr: "Turkish",
  pl: "Polish",
  ru: "Russian",
};

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.email);
}

function parseGuideId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function getOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    throw new Error(
      "OPENAI_API_KEY is missing."
    );
  }

  return key;
}

function getTranslationModel() {
  return (
    process.env.OPENAI_TRANSLATION_MODEL ||
    "gpt-5.6-terra"
  );
}

function sourceForTranslation(
  content: GuideLocaleContent
) {
  return {
    title: content.title,
    excerpt: content.excerpt,
    blocks: content.blocks.map(
      (block) => {
        if (
          block.type === "heading" ||
          block.type === "paragraph"
        ) {
          return {
            id: block.id,
            type: block.type,
            level:
              block.type === "heading"
                ? block.level
                : null,
            text: block.text,
          };
        }

        if (block.type === "bulletList") {
          return {
            id: block.id,
            type: block.type,
            items: block.items,
          };
        }

        if (block.type === "callout") {
          return {
            id: block.id,
            type: block.type,
            title: block.title ?? null,
            text: block.text,
          };
        }

        return {
          id: block.id,
          type: block.type,
          label: block.label,
          href: block.href,
          description:
            block.description ?? null,
        };
      }
    ),
    seo: {
      title: content.seo.title,
      metaDescription:
        content.seo.metaDescription,
      focusKeyword:
        content.seo.focusKeyword,
      secondaryKeywords:
        content.seo.secondaryKeywords,
      imageAlt: content.seo.imageAlt,
      ogTitle: content.seo.ogTitle,
      ogDescription:
        content.seo.ogDescription,
    },
  };
}

const translationSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "excerpt",
    "blocks",
    "seo",
  ],
  properties: {
    title: {
      type: "string",
    },
    excerpt: {
      type: "string",
    },
    blocks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "text",
          "title",
          "items",
          "label",
          "description",
        ],
        properties: {
          id: {
            type: "string",
          },
          text: {
            type: [
              "string",
              "null",
            ],
          },
          title: {
            type: [
              "string",
              "null",
            ],
          },
          items: {
            type: "array",
            items: {
              type: "string",
            },
          },
          label: {
            type: [
              "string",
              "null",
            ],
          },
          description: {
            type: [
              "string",
              "null",
            ],
          },
        },
      },
    },
    seo: {
      type: "object",
      additionalProperties: false,
      required: [
        "title",
        "metaDescription",
        "focusKeyword",
        "secondaryKeywords",
        "imageAlt",
        "ogTitle",
        "ogDescription",
      ],
      properties: {
        title: {
          type: "string",
        },
        metaDescription: {
          type: "string",
        },
        focusKeyword: {
          type: "string",
        },
        secondaryKeywords: {
          type: "array",
          items: {
            type: "string",
          },
        },
        imageAlt: {
          type: "string",
        },
        ogTitle: {
          type: "string",
        },
        ogDescription: {
          type: "string",
        },
      },
    },
  },
} as const;

function extractOutputText(
  response: unknown
): string {
  const value =
    response as {
      output_text?: string;
      output?: Array<{
        content?: Array<{
          type?: string;
          text?: string;
        }>;
      }>;
    };

  if (
    typeof value.output_text ===
      "string" &&
    value.output_text.trim()
  ) {
    return value.output_text;
  }

  for (const item of value.output ?? []) {
    for (const content of item.content ?? []) {
      if (
        content.type === "output_text" &&
        typeof content.text === "string"
      ) {
        return content.text;
      }
    }
  }

  throw new Error(
    "OpenAI returned no translation output."
  );
}

async function translateLocale(
  sourceContent: GuideLocaleContent,
  targetLocale: Locale
): Promise<GuideLocaleContent> {
  const source =
    sourceForTranslation(sourceContent);

  const response =
    await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${getOpenAIKey()}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          model: getTranslationModel(),
          reasoning: {
            effort: "low",
          },
          input: [
            {
              role: "system",
              content:
                `You are the multilingual SEO translation engine for HostMetric, a professional short-term rental management company. Translate the supplied guide from ${localeNames[sourceContent.locale]} into natural, native-level ${localeNames[targetLocale]}. Preserve meaning and factual claims exactly. Do not add new facts. Keep the tone professional, clear and useful to property owners. Localize SEO title, meta description, focus keyword and secondary keyword phrases naturally for how a native speaker would search, without keyword stuffing. Preserve every block id exactly. Preserve block order and block type semantics. Never translate, alter or invent URLs. The server will preserve hrefs, search intent, commercial target page and image URL separately. Return only the requested structured data.`,
            },
            {
              role: "user",
              content:
                JSON.stringify(source),
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name:
                "hostmetric_guide_translation",
              strict: true,
              schema:
                translationSchema,
            },
          },
        }),
      }
    );

  if (!response.ok) {
    const details =
      await response.text();

    throw new Error(
      `OpenAI translation failed (${response.status}): ${details}`
    );
  }

  const raw =
    await response.json();

  const translated =
    JSON.parse(
      extractOutputText(raw)
    ) as TranslationPayload;

  const translatedById =
    new Map(
      translated.blocks.map(
        (block) => [
          block.id,
          block,
        ]
      )
    );

  const blocks: GuideBlock[] =
    sourceContent.blocks.map(
      (sourceBlock) => {
        const target =
          translatedById.get(
            sourceBlock.id
          );

        if (!target) {
          throw new Error(
            `Missing translated block: ${sourceBlock.id}`
          );
        }

        if (
          sourceBlock.type ===
          "heading"
        ) {
          return {
            ...sourceBlock,
            text:
              target.text ??
              sourceBlock.text,
          };
        }

        if (
          sourceBlock.type ===
          "paragraph"
        ) {
          return {
            ...sourceBlock,
            text:
              target.text ??
              sourceBlock.text,
          };
        }

        if (
          sourceBlock.type ===
          "bulletList"
        ) {
          return {
            ...sourceBlock,
            items:
              target.items.length > 0
                ? target.items
                : sourceBlock.items,
          };
        }

        if (
          sourceBlock.type ===
          "callout"
        ) {
          return {
            ...sourceBlock,
            title:
              sourceBlock.title
                ? target.title ??
                  sourceBlock.title
                : undefined,
            text:
              target.text ??
              sourceBlock.text,
          };
        }

        return {
          ...sourceBlock,
          label:
            target.label ??
            sourceBlock.label,
          description:
            sourceBlock.description
              ? target.description ??
                sourceBlock.description
              : undefined,
          href:
            sourceBlock.href,
        };
      }
    );

  return {
    locale: targetLocale,
    translationStatus: "draft",
    title: translated.title,
    excerpt: translated.excerpt,
    blocks,
    seo: {
      title: translated.seo.title,
      metaDescription:
        translated.seo.metaDescription,
      focusKeyword:
        translated.seo.focusKeyword,
      secondaryKeywords:
        translated.seo.secondaryKeywords,
      searchIntent:
        sourceContent.seo.searchIntent,
      targetCommercialPage:
        sourceContent.seo
          .targetCommercialPage,
      imageAlt:
        translated.seo.imageAlt,
      ogTitle:
        translated.seo.ogTitle,
      ogDescription:
        translated.seo.ogDescription,
      ogImage:
        sourceContent.seo.ogImage,
      notes:
        sourceContent.seo.notes,
    },
  };
}

export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: rawId } =
      await context.params;

    const id =
      parseGuideId(rawId);

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Invalid guide id.",
        },
        { status: 400 }
      );
    }

    const guide =
      await getGuideById(id);

    if (!guide) {
      return NextResponse.json(
        {
          error:
            "Guide not found.",
        },
        { status: 404 }
      );
    }

    const sourceContent =
      guide.translations[
        guide.sourceLocale
      ];

    if (!sourceContent) {
      return NextResponse.json(
        {
          error:
            "Source guide content is missing.",
        },
        { status: 409 }
      );
    }

    const targetLocales =
      locales.filter(
        (locale) =>
          locale !==
          guide.sourceLocale
      );

    const results =
      await Promise.allSettled(
        targetLocales.map(
          async (locale) => {
            const translated =
              await translateLocale(
                sourceContent,
                locale
              );

            await upsertGuideTranslation(
              id,
              translated
            );

            return locale;
          }
        )
      );

    const generated: Locale[] = [];
    const failed: Array<{
      locale: Locale;
      error: string;
    }> = [];

    results.forEach(
      (result, index) => {
        const locale =
          targetLocales[index];

        if (
          result.status ===
          "fulfilled"
        ) {
          generated.push(locale);
          return;
        }

        failed.push({
          locale,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : "Unknown translation error.",
        });
      }
    );

    if (
      generated.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No translations were generated.",
          failed,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      generated,
      failed,
    });
  } catch (error) {
    console.error(
      "[admin/guides/translations] failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Translation generation failed.",
      },
      { status: 500 }
    );
  }
}
