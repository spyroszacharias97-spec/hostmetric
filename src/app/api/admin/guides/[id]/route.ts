import { NextResponse } from "next/server";

import { auth } from "@/auth";

import type { GuideDraftInput } from "@/content/guides/types";

import {
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

  return Boolean(
    session?.user?.email
  );
}

function parseGuideId(
  value: string
): number | null {
  const id = Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return id;
}

function internalServerError(
  error: unknown
) {
  console.error(
    "Admin guide route error:",
    error
  );

  return NextResponse.json(
    {
      error:
        "Something went wrong while processing the guide. Please try again.",
    },
    {
      status: 500,
    }
  );
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
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
        {
          status: 400,
        }
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
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      guide,
    });
  } catch (error) {
    return internalServerError(
      error
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
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
        {
          status: 400,
        }
      );
    }

    const existingGuide =
      await getGuideById(id);

    if (!existingGuide) {
      return NextResponse.json(
        {
          error:
            "Guide not found.",
        },
        {
          status: 404,
        }
      );
    }

    let input: GuideDraftInput;

    try {
      input =
        (await request.json()) as GuideDraftInput;
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid JSON body.",
        },
        {
          status: 400,
        }
      );
    }

    const validation =
      validateGuideDraft(input);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error:
            "Validation failed",
          validation,
        },
        {
          status: 400,
        }
      );
    }

    const slugAlreadyExists =
      await guideSlugExists(
        input.slug,
        id
      );

    if (slugAlreadyExists) {
      return NextResponse.json(
        {
          error:
            "A guide with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    await updateGuideDraft(
      id,
      input
    );

    const updatedGuide =
      await getGuideById(id);

    return NextResponse.json({
      id,
      status:
        updatedGuide?.status ??
        existingGuide.status,
      warnings:
        validation.warnings,
      guide:
        updatedGuide,
    });
  } catch (error) {
    return internalServerError(
      error
    );
  }
}
