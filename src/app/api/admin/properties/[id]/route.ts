import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

import { auth } from "@/auth";

export const runtime = "nodejs";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parsePropertyId(id: string) {
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId < 1) {
    return null;
  }

  return propertyId;
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;
    const propertyId = parsePropertyId(id);

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid property ID.",
        },
        {
          status: 400,
        }
      );
    }

    const payload = (await request.json().catch(() => null)) as
      | {
          status?: string;
        }
      | null;

    const status = payload?.status?.trim();

    if (
      status !== "pending" &&
      status !== "active" &&
      status !== "inactive"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid property status.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    const updatedRows = await sql`
      UPDATE properties
      SET
        status = ${status},
        updated_at = NOW()
      WHERE id = ${propertyId}
      RETURNING
        id,
        status;
    `;

    if (!updatedRows[0]) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found.",
        },
        {
          status: 404,
        }
      );
    }

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath("/admin/get-started");
    revalidatePath("/admin/leads");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      propertyId,
      status: String(updatedRows[0].status),
    });
  } catch (error) {
    console.error(
      "[admin-properties] Update property status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not update the property.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;
    const propertyId = parsePropertyId(id);

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid property ID.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    const propertyRows = await sql`
      SELECT
        id,
        contact_id,
        source_onboarding_submission_id
      FROM properties
      WHERE id = ${propertyId}
      LIMIT 1;
    `;

    if (!propertyRows[0]) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found.",
        },
        {
          status: 404,
        }
      );
    }

    const sourceSubmissionId =
      propertyRows[0].source_onboarding_submission_id === null ||
      propertyRows[0].source_onboarding_submission_id === undefined
        ? null
        : Number(
            propertyRows[0].source_onboarding_submission_id
          );

    /*
     * IMPORTANT:
     * The contact/client is intentionally preserved.
     *
     * If this property came from Get Started, we remove only the
     * database records belonging to that exact onboarding submission.
     *
     * We do NOT delete the owner's Google Drive folder because the same
     * folder can contain files from other submissions/properties.
     */

    if (sourceSubmissionId) {
      await sql`
        DELETE FROM onboarding_files
        WHERE submission_id = ${sourceSubmissionId};
      `;
    }

    await sql`
      DELETE FROM property_units
      WHERE property_id = ${propertyId};
    `;

    await sql`
      DELETE FROM properties
      WHERE id = ${propertyId};
    `;

    if (sourceSubmissionId) {
      await sql`
        DELETE FROM onboarding_units
        WHERE submission_id = ${sourceSubmissionId};
      `;

      await sql`
        DELETE FROM onboarding_submissions
        WHERE id = ${sourceSubmissionId};
      `;
    }

    revalidatePath("/admin/properties");
    revalidatePath("/admin/get-started");
    revalidatePath("/admin/leads");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      propertyId,
      submissionId: sourceSubmissionId,
    });
  } catch (error) {
    console.error(
      "[admin-properties] Delete property error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not delete the property.",
      },
      {
        status: 500,
      }
    );
  }
}
