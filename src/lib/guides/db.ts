import { neon } from "@neondatabase/serverless";

import type {
  GuideDraftInput,
  GuideLocaleContent,
  GuideRecord,
  GuideStatus,
} from "@/content/guides/types";
import type { Locale } from "@/i18n/config";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

type GuideRow = {
  id: number;
  slug: string;
  category: string;
  author: string;
  status: GuideStatus;
  source_locale: Locale;
  featured_image: unknown;
  related_guide_slugs: unknown;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type TranslationRow = {
  locale: Locale;
  content: unknown;
};

function parseJsonObject<T>(
  value: unknown,
  fallback: T
): T {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    return value as T;
  }

  try {
    return JSON.parse(
      String(value)
    ) as T;
  } catch {
    return fallback;
  }
}

export async function listGuides(): Promise<
  GuideRecord[]
> {
  const sql = getSql();

  const guides = (await sql`
    SELECT
      id,
      slug,
      category,
      author,
      status,
      source_locale,
      featured_image,
      related_guide_slugs,
      created_at,
      updated_at,
      published_at
    FROM guides
    ORDER BY updated_at DESC, id DESC;
  `) as unknown as GuideRow[];

  if (guides.length === 0) {
    return [];
  }

  const guideIds = guides.map(
    (guide) => guide.id
  );

  const translations = (await sql`
    SELECT
      guide_id,
      locale,
      content
    FROM guide_translations
    WHERE guide_id = ANY(${guideIds});
  `) as unknown as Array<
    TranslationRow & {
      guide_id: number;
    }
  >;

  return guides.map((guide) => {
    const guideTranslations =
      translations
        .filter(
          (translation) =>
            translation.guide_id ===
            guide.id
        )
        .reduce<
          Partial<
            Record<
              Locale,
              GuideLocaleContent
            >
          >
        >((acc, translation) => {
          acc[translation.locale] =
            parseJsonObject<GuideLocaleContent>(
              translation.content,
              {} as GuideLocaleContent
            );

          return acc;
        }, {});

    return {
      id: guide.id,
      slug: guide.slug,
      category: guide.category,
      author: guide.author,
      status: guide.status,
      sourceLocale:
        guide.source_locale,
      featuredImage:
        parseJsonObject(
          guide.featured_image,
          {
            src: "",
            alt: "",
            caption: "",
          }
        ),
      relatedGuideSlugs:
        parseJsonObject<string[]>(
          guide.related_guide_slugs,
          []
        ),
      createdAt: guide.created_at,
      updatedAt: guide.updated_at,
      publishedAt:
        guide.published_at,
      translations:
        guideTranslations,
    };
  });
}

export async function getGuideById(
  id: number
): Promise<GuideRecord | null> {
  const sql = getSql();

  const rows = (await sql`
    SELECT
      id,
      slug,
      category,
      author,
      status,
      source_locale,
      featured_image,
      related_guide_slugs,
      created_at,
      updated_at,
      published_at
    FROM guides
    WHERE id = ${id}
    LIMIT 1;
  `) as unknown as GuideRow[];

  const guide = rows[0];

  if (!guide) {
    return null;
  }

  const translationRows =
    (await sql`
      SELECT
        locale,
        content
      FROM guide_translations
      WHERE guide_id = ${id};
    `) as unknown as TranslationRow[];

  const translations =
    translationRows.reduce<
      Partial<
        Record<
          Locale,
          GuideLocaleContent
        >
      >
    >((acc, translation) => {
      acc[translation.locale] =
        parseJsonObject<GuideLocaleContent>(
          translation.content,
          {} as GuideLocaleContent
        );

      return acc;
    }, {});

  return {
    id: guide.id,
    slug: guide.slug,
    category: guide.category,
    author: guide.author,
    status: guide.status,
    sourceLocale:
      guide.source_locale,
    featuredImage:
      parseJsonObject(
        guide.featured_image,
        {
          src: "",
          alt: "",
          caption: "",
        }
      ),
    relatedGuideSlugs:
      parseJsonObject<string[]>(
        guide.related_guide_slugs,
        []
      ),
    createdAt: guide.created_at,
    updatedAt: guide.updated_at,
    publishedAt:
      guide.published_at,
    translations,
  };
}

export async function getGuideBySlug(
  slug: string
): Promise<GuideRecord | null> {
  const sql = getSql();

  const rows = (await sql`
    SELECT
      id,
      slug,
      category,
      author,
      status,
      source_locale,
      featured_image,
      related_guide_slugs,
      created_at,
      updated_at,
      published_at
    FROM guides
    WHERE slug = ${slug}
    LIMIT 1;
  `) as unknown as GuideRow[];

  const guide = rows[0];

  if (!guide) {
    return null;
  }

  const translationRows =
    (await sql`
      SELECT
        locale,
        content
      FROM guide_translations
      WHERE guide_id = ${guide.id};
    `) as unknown as TranslationRow[];

  const translations =
    translationRows.reduce<
      Partial<
        Record<
          Locale,
          GuideLocaleContent
        >
      >
    >((acc, translation) => {
      acc[translation.locale] =
        parseJsonObject<GuideLocaleContent>(
          translation.content,
          {} as GuideLocaleContent
        );

      return acc;
    }, {});

  return {
    id: guide.id,
    slug: guide.slug,
    category: guide.category,
    author: guide.author,
    status: guide.status,
    sourceLocale:
      guide.source_locale,
    featuredImage:
      parseJsonObject(
        guide.featured_image,
        {
          src: "",
          alt: "",
          caption: "",
        }
      ),
    relatedGuideSlugs:
      parseJsonObject<string[]>(
        guide.related_guide_slugs,
        []
      ),
    createdAt: guide.created_at,
    updatedAt: guide.updated_at,
    publishedAt:
      guide.published_at,
    translations,
  };
}


export async function createGuideDraft(
  input: GuideDraftInput
): Promise<number> {
  const sql = getSql();

  const rows = await sql`
    INSERT INTO guides (
      slug,
      category,
      author,
      status,
      source_locale,
      featured_image,
      related_guide_slugs
    )
    VALUES (
      ${input.slug},
      ${input.category},
      ${input.author},
      'draft',
      ${input.sourceLocale},
      ${JSON.stringify(
        input.featuredImage
      )}::jsonb,
      ${JSON.stringify(
        input.relatedGuideSlugs
      )}::jsonb
    )
    RETURNING id;
  `;

  const id = Number(
    (rows[0] as {
      id: number;
    }).id
  );

  await sql`
    INSERT INTO guide_translations (
      guide_id,
      locale,
      translation_status,
      content
    )
    VALUES (
      ${id},
      ${input.sourceLocale},
      ${input.sourceContent.translationStatus},
      ${JSON.stringify(
        input.sourceContent
      )}::jsonb
    );
  `;

  return id;
}

export async function updateGuideDraft(
  id: number,
  input: GuideDraftInput
): Promise<void> {
  const sql = getSql();

  await sql`
    UPDATE guides
    SET
      slug = ${input.slug},
      category = ${input.category},
      author = ${input.author},
      source_locale = ${input.sourceLocale},
      featured_image = ${JSON.stringify(
        input.featuredImage
      )}::jsonb,
      related_guide_slugs = ${JSON.stringify(
        input.relatedGuideSlugs
      )}::jsonb,
      updated_at = NOW()
    WHERE id = ${id};
  `;

  await sql`
    INSERT INTO guide_translations (
      guide_id,
      locale,
      translation_status,
      content,
      updated_at
    )
    VALUES (
      ${id},
      ${input.sourceLocale},
      ${input.sourceContent.translationStatus},
      ${JSON.stringify(
        input.sourceContent
      )}::jsonb,
      NOW()
    )
    ON CONFLICT (
      guide_id,
      locale
    )
    DO UPDATE SET
      translation_status =
        EXCLUDED.translation_status,
      content =
        EXCLUDED.content,
      updated_at =
        NOW();
  `;
}

export async function updateGuideStatus(
  id: number,
  status: GuideStatus
): Promise<void> {
  const sql = getSql();

  if (status === "published") {
    await sql`
      UPDATE guides
      SET
        status = ${status},
        published_at =
          COALESCE(
            published_at,
            NOW()
          ),
        updated_at = NOW()
      WHERE id = ${id};
    `;

    return;
  }

  await sql`
    UPDATE guides
    SET
      status = ${status},
      updated_at = NOW()
    WHERE id = ${id};
  `;
}

export async function upsertGuideTranslation(
  guideId: number,
  content: GuideLocaleContent
): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO guide_translations (
      guide_id,
      locale,
      translation_status,
      content,
      updated_at
    )
    VALUES (
      ${guideId},
      ${content.locale},
      ${content.translationStatus},
      ${JSON.stringify(
        content
      )}::jsonb,
      NOW()
    )
    ON CONFLICT (
      guide_id,
      locale
    )
    DO UPDATE SET
      translation_status =
        EXCLUDED.translation_status,
      content =
        EXCLUDED.content,
      updated_at =
        NOW();
  `;

  await sql`
    UPDATE guides
    SET updated_at = NOW()
    WHERE id = ${guideId};
  `;
}

/**
 * Οριστική διαγραφή άρθρου ανεξάρτητα από status.
 *
 * Σβήνει πρώτα όλες τις μεταφράσεις και μετά
 * το κύριο guide record, ώστε να δουλεύει ακόμη
 * και αν το foreign key δεν έχει ON DELETE CASCADE.
 *
 * Το όνομα παραμένει deleteGuideDraft για
 * συμβατότητα με τα υπάρχοντα API routes.
 */
export async function deleteGuideDraft(
  id: number
): Promise<void> {
  const sql = getSql();

  await sql`
    DELETE FROM guide_translations
    WHERE guide_id = ${id};
  `;

  const deletedRows = await sql`
    DELETE FROM guides
    WHERE id = ${id}
    RETURNING id;
  `;

  if (deletedRows.length === 0) {
    throw new Error(
      "Guide not found or could not be deleted."
    );
  }
}

export async function guideSlugExists(
  slug: string,
  excludeId?: number
): Promise<boolean> {
  const sql = getSql();

  const rows = excludeId
    ? await sql`
        SELECT id
        FROM guides
        WHERE slug = ${slug}
          AND id <> ${excludeId}
        LIMIT 1;
      `
    : await sql`
        SELECT id
        FROM guides
        WHERE slug = ${slug}
        LIMIT 1;
      `;

  return rows.length > 0;
}
