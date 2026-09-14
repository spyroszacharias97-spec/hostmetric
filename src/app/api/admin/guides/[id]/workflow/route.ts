import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  getGuideById,
  updateGuideStatus,
} from "@/lib/guides/db";
import { validateGuideForPublish } from "@/lib/guides/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  const session =
    await auth();

  return Boolean(
    session?.user?.email
  );
}

function parseGuideId(
  value: string
): number | null {
  const id =
    Number(value);

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
    "Admin guide workflow route error:",
    error
  );

  return NextResponse.json(
    {
      error:
        "Something went wrong while processing the workflow action. Please try again.",
    },
    {
      status: 500,
    }
  );
}

export async function POST(
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
      parseGuideId(
        rawId
      );

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

    let body: {
      action?: "publish";
    };

    try {
      body =
        (await request.json()) as {
          action?: "publish";
        };
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

    if (
      body.action ===
      "publish"
    ) {
      if (
        guide.status ===
        "published"
      ) {
        return NextResponse.json(
          {
            error:
              "Guide is already published.",
          },
          {
            status: 409,
          }
        );
      }

      const validation =
        validateGuideForPublish(
          guide
        );

      if (
        !validation.valid
      ) {
        return NextResponse.json(
          {
            error:
              "The article is not ready to publish.",
            validation,
          },
          {
            status: 400,
          }
        );
      }

      await updateGuideStatus(
        id,
        "published"
      );

      return NextResponse.json({
        id,
        status:
          "published",
        warnings:
          validation.warnings,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unsupported workflow action.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    return internalServerError(
      error
    );
  }
}
