import type {
  GuideBlock,
  GuideLocaleContent,
  GuideRecord,
} from "@/content/guides/types";

type GuidePreviewProps = {
  guide: GuideRecord;
  content: GuideLocaleContent;
};

function renderBlock(
  block: GuideBlock
) {
  if (block.type === "heading") {
    if (block.level === 2) {
      return (
        <h2
          key={block.id}
          className="mt-10 text-3xl font-black tracking-tight text-slate-950"
        >
          {block.text}
        </h2>
      );
    }

    return (
      <h3
        key={block.id}
        className="mt-7 text-2xl font-black tracking-tight text-slate-900"
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "paragraph") {
    return (
      <div
        key={block.id}
        className="mt-4 whitespace-pre-line text-[17px] leading-8 text-slate-700"
      >
        {block.text}
      </div>
    );
  }

  if (
    block.type ===
    "bulletList"
  ) {
    return (
      <ul
        key={block.id}
        className="mt-5 list-disc space-y-2 pl-6 text-[17px] leading-7 text-slate-700"
      >
        {block.items.map(
          (item) => (
            <li key={item}>
              {item}
            </li>
          )
        )}
      </ul>
    );
  }

  if (
    block.type === "callout"
  ) {
    return (
      <div
        key={block.id}
        className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-[16px] font-semibold leading-7 text-slate-800"
      >
        {block.title ? (
          <p className="mb-1 font-black text-slate-950">
            {block.title}
          </p>
        ) : null}

        {block.text}
      </div>
    );
  }

  return (
    <a
      key={block.id}
      href={block.href}
      className="mt-5 inline-flex font-black text-blue-700 underline underline-offset-4"
    >
      {block.label}
    </a>
  );
}

export default function GuidePreview({
  guide,
  content,
}: GuidePreviewProps) {
  return (
    <article className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
      <header className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
          {guide.category}
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {content.title}
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          {content.excerpt}
        </p>
      </header>

      {guide.featuredImage.src ? (
        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              guide.featuredImage.src
            }
            alt={
              content.seo.imageAlt ||
              guide.featuredImage.alt
            }
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}

      <div className="pt-2">
        {content.blocks.map(
          renderBlock
        )}
      </div>
    </article>
  );
}
