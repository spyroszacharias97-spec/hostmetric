import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  deleteGuideDraft,
  getGuideById,
  updateGuideStatus,
} from "@/lib/guides/db";
import { validateGuideForPublish } from "@/lib/guides/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseGuideId(
  rawId: string
): number | null {
  const guideId =
    Number(rawId);

  if (
    !Number.isInteger(guideId) ||
    guideId <= 0
  ) {
    return null;
  }

  return guideId;
}

function internalServerError(
  error: unknown
) {
  console.error(
    "Admin guide list-actions route error:",
    error
  );

  return NextResponse.json(
    {
      error:
        "Something went wrong while processing the guide action. Please try again.",
    },
    {
      status: 500,
    }
  );
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session =
      await auth();

    if (!session?.user?.email) {
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
      await params;

    const guideId =
      parseGuideId(rawId);

    if (!guideId) {
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
      await getGuideById(
        guideId
      );

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
      action?:
        | "publish"
        | "unpublish";
    };

    try {
      body =
        (await request.json()) as {
          action?:
            | "publish"
            | "unpublish";
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
      body.action !== "publish" &&
      body.action !== "unpublish"
    ) {
      return NextResponse.json(
        {
          error:
            "Unknown action.",
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
              "The article is already published.",
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

      if (!validation.valid) {
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
        guideId,
        "published"
      );

      return NextResponse.json({
        success: true,
        status:
          "published",
        warnings:
          validation.warnings,
      });
    }

    if (
      guide.status !==
      "published"
    ) {
      return NextResponse.json(
        {
          error:
            "The article is not published.",
        },
        {
          status: 409,
        }
      );
    }

    await updateGuideStatus(
      guideId,
      "unpublished"
    );

    return NextResponse.json({
      success: true,
      status:
        "unpublished",
    });
  } catch (error) {
    return internalServerError(
      error
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const session =
      await auth();

    if (!session?.user?.email) {
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
      await params;

    const guideId =
      parseGuideId(rawId);

    if (!guideId) {
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
      await getGuideById(
        guideId
      );

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

    /*
     * Deliberately do not restrict deletion by status.
     * With explicit admin confirmation, permanent deletion
     * is allowed for draft / review / published / unpublished.
     */
    await deleteGuideDraft(
      guideId
    );

    return NextResponse.json({
      success: true,
      deletedId:
        guideId,
    });
  } catch (error) {
    return internalServerError(
      error
    );
  }
}
