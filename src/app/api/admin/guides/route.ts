import { NextResponse } from "next/server";

import { auth } from "@/auth";
import type { GuideDraftInput } from "@/content/guides/types";
import {
  createGuideDraft,
  guideSlugExists,
  listGuides,
} from "@/lib/guides/db";
import { validateGuideDraft } from "@/lib/guides/validation";

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.email);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const guides = await listGuides();
  return NextResponse.json({ guides });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
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

  if (await guideSlugExists(input.slug)) {
    return NextResponse.json(
      { error: "A guide with this slug already exists." },
      { status: 409 }
    );
  }

  const id = await createGuideDraft(input);

  return NextResponse.json(
    {
      id,
      status: "draft",
      warnings: validation.warnings,
    },
    { status: 201 }
  );
}
