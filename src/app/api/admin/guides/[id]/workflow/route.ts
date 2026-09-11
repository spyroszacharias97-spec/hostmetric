import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  getGuideById,
  updateGuideStatus,
} from "@/lib/guides/db";

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

export async function POST(
  request: Request,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      {
        error: "Unauthorized",
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

  const body =
    (await request.json()) as {
      action?: "publish";
    };

  if (
    body.action === "publish"
  ) {
    if (
      guide.status === "published"
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

    await updateGuideStatus(
      id,
      "published"
    );

    return NextResponse.json({
      id,
      status: "published",
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
}
