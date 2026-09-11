import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  deleteGuideDraft,
  getGuideById,
  updateGuideStatus,
} from "@/lib/guides/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseGuideId(
  rawId: string
): number | null {
  const guideId = Number(rawId);

  if (
    !Number.isInteger(guideId) ||
    guideId <= 0
  ) {
    return null;
  }

  return guideId;
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: rawId } =
    await params;

  const guideId =
    parseGuideId(rawId);

  if (!guideId) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  const guide =
    await getGuideById(guideId);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  const body =
    (await request.json()) as {
      action?: "publish" | "unpublish";
    };

  if (
    body.action !== "publish" &&
    body.action !== "unpublish"
  ) {
    return NextResponse.json(
      { error: "Unknown action." },
      { status: 400 }
    );
  }

  if (body.action === "publish") {
    if (guide.status === "published") {
      return NextResponse.json(
        {
          error:
            "Το άρθρο είναι ήδη δημοσιευμένο.",
        },
        { status: 400 }
      );
    }

    await updateGuideStatus(
      guideId,
      "published"
    );

    return NextResponse.json({
      success: true,
      status: "published",
    });
  }

  if (
    guide.status !== "published"
  ) {
    return NextResponse.json(
      {
        error:
          "Το άρθρο δεν είναι δημοσιευμένο.",
      },
      { status: 400 }
    );
  }

  await updateGuideStatus(
    guideId,
    "unpublished"
  );

  return NextResponse.json({
    success: true,
    status: "unpublished",
  });
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: rawId } =
    await params;

  const guideId =
    parseGuideId(rawId);

  if (!guideId) {
    return NextResponse.json(
      { error: "Invalid guide id." },
      { status: 400 }
    );
  }

  const guide =
    await getGuideById(guideId);

  if (!guide) {
    return NextResponse.json(
      { error: "Guide not found." },
      { status: 404 }
    );
  }

  /*
   * Σκόπιμα ΔΕΝ ελέγχουμε status εδώ.
   * Με ρητή επιβεβαίωση από τον διαχειριστή
   * επιτρέπεται οριστική διαγραφή σε:
   * draft / review / published / unpublished.
   */
  await deleteGuideDraft(guideId);

  return NextResponse.json({
    success: true,
    deletedId: guideId,
  });
}
