import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

import { auth } from "@/auth";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getSql() {
  const databaseUrl =
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing."
    );
  }

  return neon(databaseUrl);
}

function parseId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) &&
    id > 0
    ? id
    : null;
}

function revalidateAdminPages() {
  revalidatePath(
    "/admin/get-started"
  );
  revalidatePath(
    "/admin/properties"
  );
  revalidatePath(
    "/admin/leads"
  );
  revalidatePath(
    "/admin"
  );
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const session =
    await auth();

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

  const { id: rawId } =
    await context.params;

  const submissionId =
    parseId(rawId);

  if (!submissionId) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid Get Started ID.",
      },
      {
        status: 400,
      }
    );
  }

  const sql = getSql();

  const submissionRows =
    await sql`
      SELECT
        id,
        contact_id
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

  const propertyRows =
    await sql`
      SELECT id
      FROM properties
      WHERE source_onboarding_submission_id =
        ${submissionId};
    `;

  /*
   * A client/contact can have other properties and other submissions,
   * so the contact is never deleted here.
   *
   * The Google Drive owner folder is also preserved.
   */

  await sql`
    DELETE FROM onboarding_files
    WHERE submission_id =
      ${submissionId};
  `;

  for (
    const propertyRow of propertyRows
  ) {
    const propertyId =
      Number(propertyRow.id);

    if (
      Number.isInteger(propertyId) &&
      propertyId > 0
    ) {
      await sql`
        DELETE FROM property_units
        WHERE property_id =
          ${propertyId};
      `;
    }
  }

  await sql`
    DELETE FROM properties
    WHERE source_onboarding_submission_id =
      ${submissionId};
  `;

  await sql`
    DELETE FROM onboarding_units
    WHERE submission_id =
      ${submissionId};
  `;

  await sql`
    DELETE FROM onboarding_submissions
    WHERE id =
      ${submissionId};
  `;

  revalidateAdminPages();

  return NextResponse.json({
    success: true,
    submissionId,
    deletedPropertyIds:
      propertyRows
        .map((row) =>
          Number(row.id)
        )
        .filter(
          (id) =>
            Number.isInteger(id) &&
            id > 0
        ),
  });
}
