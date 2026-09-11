BEGIN;

CREATE TABLE IF NOT EXISTS guides (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'HostMetric',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'unpublished')),
  source_locale TEXT NOT NULL,
  featured_image JSONB NOT NULL DEFAULT '{"src":"","alt":"","caption":""}'::jsonb,
  related_guide_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS guides_status_idx
  ON guides(status);

CREATE INDEX IF NOT EXISTS guides_updated_at_idx
  ON guides(updated_at DESC);

CREATE TABLE IF NOT EXISTS guide_translations (
  id BIGSERIAL PRIMARY KEY,
  guide_id BIGINT NOT NULL
    REFERENCES guides(id)
    ON DELETE CASCADE,
  locale TEXT NOT NULL,
  translation_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (
      translation_status IN (
        'missing',
        'draft',
        'reviewed',
        'approved'
      )
    ),
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (guide_id, locale)
);

CREATE INDEX IF NOT EXISTS guide_translations_guide_id_idx
  ON guide_translations(guide_id);

CREATE INDEX IF NOT EXISTS guide_translations_locale_idx
  ON guide_translations(locale);

COMMIT;
