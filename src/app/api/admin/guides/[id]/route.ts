import { NextResponse } from "next/server";

import { auth } from "@/auth";
import type { GuideDraftInput } from "@/content/guides/types";
import {
  deleteGuideDraft,
  getGuideById,
  guideSlugExists,
  updateGuideDraft,
} from "@/lib/guides/db";
import { validateGuideDraft } from "@/lib/guides/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.email);
}

function parseGuideId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
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

  const { id: rawId } = await context.params;
  const id = parseGuideId(rawId);

  if (!id) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  const guide = await getGuideById(id);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ guide });
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: rawId } = await context.params;
  const id = parseGuideId(rawId);

  if (!id) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  const existing = await getGuideById(id);

  if (!existing) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  if (existing.status === "published") {
    return NextResponse.json(
      {
        error:
          "Published guides must use the publishing workflow instead of the draft endpoint.",
      },
      { status: 409 }
    );
  }

  const input = (await request.json()) as GuideDraftInput;
  const validation = validateGuideDraft(input);

  if (!validation.valid) {
    return NextResponse.json(
      {
        error: "Validation failed",
        validation,
      },
      { status: 400 }
    );
  }

  if (await guideSlugExists(input.slug, id)) {
    return NextResponse.json(
      { error: "A guide with this slug already exists." },
      { status: 409 }
    );
  }

  await updateGuideDraft(id, input);

  return NextResponse.json({
    id,
    status: existing.status,
    warnings: validation.warnings,
  });
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: rawId } = await context.params;
  const id = parseGuideId(rawId);

  if (!id) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  const guide = await getGuideById(id);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  if (guide.status !== "draft") {
    return NextResponse.json(
      {
        error:
          "Only draft guides can be deleted from this endpoint.",
      },
      { status: 409 }
    );
  }

  await deleteGuideDraft(id);

  return NextResponse.json({ deleted: true });
}
