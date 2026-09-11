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

function parseSubmissionId(id: string) {
  const submissionId = Number(id);

  if (
    !Number.isInteger(submissionId) ||
    submissionId < 1
  ) {
    return null;
  }

  return submissionId;
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
    const submissionId =
      parseSubmissionId(id);

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Get Started submission ID.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    const submissionRows = await sql`
      SELECT
        id,
        contact_id,
        drive_folder_id
      FROM onboarding_submissions
      WHERE id = ${submissionId}
      LIMIT 1;
    `;

    if (!submissionRows[0]) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Get Started submission not found.",
        },
        {
          status: 404,
        }
      );
    }

    const contactId =
      Number(
        submissionRows[0].contact_id
      );

    /*
     * IMPORTANT:
     *
     * We delete ONLY data belonging to this exact onboarding submission.
     *
     * The client/contact is intentionally preserved because one client
     * may own multiple properties/submissions.
     *
     * We also do NOT delete the Google Drive owner folder. That folder is
     * persistent per owner/email and may contain files from other
     * submissions/properties.
     */

    await sql`
      DELETE FROM onboarding_files
      WHERE submission_id = ${submissionId};
    `;

    await sql`
      DELETE FROM property_units
      WHERE property_id IN (
        SELECT id
        FROM properties
        WHERE source_onboarding_submission_id =
          ${submissionId}
      );
    `;

    await sql`
      DELETE FROM properties
      WHERE source_onboarding_submission_id =
        ${submissionId};
    `;

    await sql`
      DELETE FROM onboarding_units
      WHERE submission_id = ${submissionId};
    `;

    await sql`
      DELETE FROM onboarding_submissions
      WHERE id = ${submissionId};
    `;

    revalidatePath(
      "/admin/get-started"
    );
    revalidatePath(
      "/admin/properties"
    );
    revalidatePath(
      "/admin/leads"
    );

    if (
      Number.isInteger(contactId) &&
      contactId > 0
    ) {
      revalidatePath(
        `/admin/leads/${contactId}`
      );
    }

    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      submissionId,
      contactId:
        Number.isInteger(contactId) &&
        contactId > 0
          ? contactId
          : null,
    });
  } catch (error) {
    console.error(
      "[admin-get-started] Delete submission error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not delete the Get Started submission.",
      },
      {
        status: 500,
      }
    );
  }
}
