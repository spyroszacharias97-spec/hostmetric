import { neon } from "@neondatabase/serverless";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const PROPERTY_GROUPS: Record<string, string> = {
  property_exterior: "Exterior",
  property_entrance: "Entrance",
  property_parking: "Parking",
  property_reception: "Reception - Lobby",
  property_common_areas: "Common Areas",
  property_pool: "Pool",
  property_garden_terrace: "Garden - Terrace - Outdoor Areas",
  property_restaurant_bar: "Restaurant - Bar",
  property_gym_spa: "Gym - Spa - Wellness",
  property_views: "Views",
};

const UNIT_GROUPS: Record<string, string> = {
  unit_bedroom_sleeping: "Bedroom - Sleeping Area",
  unit_bathroom: "Bathroom",
  unit_kitchen: "Kitchen - Kitchenette",
  unit_living_dining: "Living - Dining Area",
  unit_balcony_terrace: "Balcony - Terrace - Patio",
  unit_private_pool: "Private Pool - Hot Tub",
  unit_views: "Views",
};

const ACCESSIBILITY_GROUPS: Record<string, string> = {
  accessibility_step_free_entrance: "Step-Free Guest Entrance",
  accessibility_parking: "Accessible Parking",
  accessibility_entrance_door_width: "Entrance Door Width",
  accessibility_lit_path: "Lit Path to Entrance",
  accessibility_lift: "Lift - Elevator Access",
  accessibility_bedroom_step_free: "Step-Free Bedroom Access",
  accessibility_bathroom_step_free: "Step-Free Bathroom Access",
  accessibility_room_door_width: "Bedroom - Room Door Width",
  accessibility_bathroom_door_width: "Bathroom Door Width",
  accessibility_grab_rails: "Bathroom Grab Rails",
  accessibility_roll_in_shower: "Roll-In - Step-Free Shower",
};

const CHECKIN_GROUPS: Record<string, string> = {
  checkin_building_entrance: "Building - Property Entrance",
  checkin_lockbox_keypad: "Lockbox - Keypad - Key Collection",
  checkin_route_to_unit: "Route from Entrance to Unit",
};

const SUPPORTING_GROUPS: Record<string, string> = {
  floor_plans: "Floor Plans",
};

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

type DbRow = Record<string, unknown>;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function getGoogleCredentials(): ServiceAccountCredentials {
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing."
    );
  }

  let parsed: ServiceAccountCredentials;

  try {
    parsed =
      JSON.parse(raw) as ServiceAccountCredentials;
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON."
    );
  }

  if (
    !parsed.client_email ||
    !parsed.private_key
  ) {
    throw new Error(
      "Google service account credentials are incomplete."
    );
  }

  return {
    client_email:
      parsed.client_email,

    private_key:
      parsed.private_key.replace(
        /\\n/g,
        "\n"
      ),
  };
}


function getGoogleAuth() {
  const credentials = getGoogleCredentials();

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

function getDriveClient() {
  return google.drive({
    version: "v3",
    auth: getGoogleAuth(),
  });
}


function safeFileName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function categoryInfo(category: string, hasUnit: boolean) {
  if (PROPERTY_GROUPS[category]) {
    return {
      label: PROPERTY_GROUPS[category],
      scope: "property",
      unitRequired: false,
    };
  }

  if (UNIT_GROUPS[category]) {
    return {
      label: UNIT_GROUPS[category],
      scope: "unit",
      unitRequired: true,
    };
  }

  if (ACCESSIBILITY_GROUPS[category]) {
    return {
      label: ACCESSIBILITY_GROUPS[category],
      scope: hasUnit ? "unit_accessibility" : "property_accessibility",
      unitRequired: false,
    };
  }

  if (CHECKIN_GROUPS[category]) {
    return {
      label: CHECKIN_GROUPS[category],
      scope: "checkin",
      unitRequired: false,
    };
  }

  if (SUPPORTING_GROUPS[category]) {
    return {
      label: SUPPORTING_GROUPS[category],
      scope: "supporting",
      unitRequired: false,
    };
  }

  throw new Error("Unsupported photo category.");
}

async function resolveProperty(propertyId: number) {
  const sql = getSql();

  const rows = await sql`
    SELECT
      p.id,
      p.contact_id,
      p.property_name,
      p.source_onboarding_submission_id,
      c.email
    FROM properties p
    JOIN contacts c
      ON c.id = p.contact_id
    WHERE p.id = ${propertyId}
    LIMIT 1;
  `;

  const property = rows[0] as DbRow | undefined;

  if (!property) {
    throw new Error("Property was not found.");
  }

  const contactId = Number(property.contact_id);
  const email = String(property.email ?? "").trim().toLowerCase();
  const propertyName = property.property_name
    ? String(property.property_name)
    : "";

  const sourceSubmissionId =
    property.source_onboarding_submission_id === null ||
    property.source_onboarding_submission_id === undefined
      ? null
      : Number(property.source_onboarding_submission_id);

  let photoSubmissionId: number | null = sourceSubmissionId;

  /*
   * Same fallback logic as the property page:
   * 1. Prefer the property's exact onboarding submission.
   * 2. If it has no files, use the best submission of this client that
   *    already has files, preferring the same property name.
   * 3. If there are no files anywhere yet, use the exact source submission
   *    or the client's latest onboarding submission.
   */
  if (photoSubmissionId) {
    const countRows = await sql`
      SELECT COUNT(*)::int AS count
      FROM onboarding_files
      WHERE submission_id = ${photoSubmissionId};
    `;

    const photoCount = Number(
      (countRows[0] as DbRow | undefined)?.count ?? 0
    );

    if (photoCount === 0) {
      const fallbackRows = await sql`
        SELECT os.id
        FROM onboarding_submissions os
        WHERE os.contact_id = ${contactId}
          AND EXISTS (
            SELECT 1
            FROM onboarding_files f
            WHERE f.submission_id = os.id
          )
        ORDER BY
          CASE
            WHEN LOWER(TRIM(COALESCE(os.property_name, ''))) =
                 LOWER(TRIM(${propertyName}))
            THEN 0
            ELSE 1
          END,
          os.created_at DESC NULLS LAST,
          os.id DESC
        LIMIT 1;
      `;

      const fallback = fallbackRows[0] as DbRow | undefined;

      if (fallback?.id) {
        photoSubmissionId = Number(fallback.id);
      }
    }
  }

  if (!photoSubmissionId) {
    const fallbackRows = await sql`
      SELECT os.id
      FROM onboarding_submissions os
      WHERE os.contact_id = ${contactId}
        AND EXISTS (
          SELECT 1
          FROM onboarding_files f
          WHERE f.submission_id = os.id
        )
      ORDER BY
        CASE
          WHEN LOWER(TRIM(COALESCE(os.property_name, ''))) =
               LOWER(TRIM(${propertyName}))
          THEN 0
          ELSE 1
        END,
        os.created_at DESC NULLS LAST,
        os.id DESC
      LIMIT 1;
    `;

    const fallback = fallbackRows[0] as DbRow | undefined;

    if (fallback?.id) {
      photoSubmissionId = Number(fallback.id);
    }
  }

  if (!photoSubmissionId) {
    const latestRows = await sql`
      SELECT id
      FROM onboarding_submissions
      WHERE contact_id = ${contactId}
      ORDER BY created_at DESC NULLS LAST, id DESC
      LIMIT 1;
    `;

    const latest = latestRows[0] as DbRow | undefined;

    photoSubmissionId = latest?.id
      ? Number(latest.id)
      : null;
  }

  if (!photoSubmissionId) {
    throw new Error("This client has no onboarding submission.");
  }

  return {
    propertyId,
    contactId,
    email,
    propertyName,
    sourceSubmissionId,
    photoSubmissionId,
  };
}

async function resolveClientDriveFolder(
  contactId: number
) {
  const sql = getSql();

  /*
   * IMPORTANT:
   * The onboarding flow creates ONE Google Drive folder per client.
   * We reuse that exact folder here instead of trying to recreate a folder from a parent-folder environment variable.
   */

  const submissionRows = await sql`
    SELECT
      drive_folder_id,
      drive_folder_url
    FROM onboarding_submissions
    WHERE contact_id = ${contactId}
      AND drive_folder_id IS NOT NULL
      AND TRIM(drive_folder_id) <> ''
    ORDER BY created_at DESC NULLS LAST, id DESC
    LIMIT 1;
  `;

  const submissionFolder =
    submissionRows[0] as DbRow | undefined;

  if (submissionFolder?.drive_folder_id) {
    return {
      folderId:
        String(
          submissionFolder.drive_folder_id
        ),
      folderUrl:
        submissionFolder.drive_folder_url
          ? String(
              submissionFolder.drive_folder_url
            )
          : `https://drive.google.com/drive/folders/${String(
              submissionFolder.drive_folder_id
            )}`,
    };
  }

  /*
   * Older submissions may only have the client folder stored
   * on onboarding_files. Search across ALL submissions of this client.
   */
  const fileRows = await sql`
    SELECT
      f.drive_folder_id,
      f.drive_folder_url
    FROM onboarding_files f
    JOIN onboarding_submissions os
      ON os.id = f.submission_id
    WHERE os.contact_id = ${contactId}
      AND f.drive_folder_id IS NOT NULL
      AND TRIM(f.drive_folder_id) <> ''
    ORDER BY f.created_at DESC NULLS LAST, f.id DESC
    LIMIT 1;
  `;

  const fileFolder =
    fileRows[0] as DbRow | undefined;

  if (fileFolder?.drive_folder_id) {
    return {
      folderId:
        String(
          fileFolder.drive_folder_id
        ),
      folderUrl:
        fileFolder.drive_folder_url
          ? String(
              fileFolder.drive_folder_url
            )
          : `https://drive.google.com/drive/folders/${String(
              fileFolder.drive_folder_id
            )}`,
    };
  }

  throw new Error(
    "No Google Drive client folder was found in Neon for this client. Open the client's original Get Started submission first."
  );
}


async function resolveUnitForContact(
  contactId: number,
  unitId: number | null
) {
  if (!unitId) {
    return {
      unitId: null,
      unitClientId: null,
      unitName: null,
      submissionId: null,
    };
  }

  const sql = getSql();

  const rows = await sql`
    SELECT
      ou.id,
      ou.submission_id,
      ou.unit_index,
      ou.unit_name
    FROM onboarding_units ou
    JOIN onboarding_submissions os
      ON os.id = ou.submission_id
    WHERE ou.id = ${unitId}
      AND os.contact_id = ${contactId}
    LIMIT 1;
  `;

  const unit = rows[0] as DbRow | undefined;

  if (!unit) {
    throw new Error("The selected unit does not belong to this client.");
  }

  return {
    unitId: Number(unit.id),
    submissionId: Number(unit.submission_id),
    unitClientId:
      unit.unit_index === null || unit.unit_index === undefined
        ? null
        : Number(unit.unit_index),
    unitName: unit.unit_name ? String(unit.unit_name) : null,
  };
}

async function getOwnedFile(
  propertyId: number,
  fileId: number
) {
  const sql = getSql();
  const property = await resolveProperty(propertyId);

  const rows = await sql`
    SELECT
      f.*,
      os.contact_id
    FROM onboarding_files f
    JOIN onboarding_submissions os
      ON os.id = f.submission_id
    WHERE f.id = ${fileId}
      AND os.contact_id = ${property.contactId}
    LIMIT 1;
  `;

  const file = rows[0] as DbRow | undefined;

  if (!file) {
    throw new Error("Photo/file not found.");
  }

  return {
    property,
    file,
  };
}

async function uploadFile({
  propertyId,
  category,
  unitId,
  file,
}: {
  propertyId: number;
  category: string;
  unitId: number | null;
  file: File;
}) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP and PDF files are allowed.");
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    throw new Error("Each file must be smaller than 10 MB.");
  }

  const sql = getSql();
  const property = await resolveProperty(propertyId);
  const categoryData = categoryInfo(category, Boolean(unitId));

  if (categoryData.unitRequired && !unitId) {
    throw new Error("This category requires a unit.");
  }

  const unit = await resolveUnitForContact(
    property.contactId,
    unitId
  );

  /*
   * For unit photos, the selected unit's own submission is authoritative.
   * For property-level photos, use the same photo submission currently
   * displayed by the property page.
   */
  const targetSubmissionId =
    unit.submissionId ??
    property.photoSubmissionId;

  /*
   * SAME FOLDER AS ONBOARDING:
   * The Get Started flow already created the client's Drive folder.
   * Reuse its ID from Neon. Do not create another property folder.
   */
  const clientFolder =
    await resolveClientDriveFolder(
      property.contactId
    );

  const ownerFolderId =
    clientFolder.folderId;

  const auth = getGoogleAuth();
  const accessTokenResponse = await auth.getAccessToken();
  const accessToken = accessTokenResponse.token;

  if (!accessToken) {
    throw new Error("Could not obtain a Google access token.");
  }

  const originalName = file.name || "upload";
  const storedName = `${new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14)}-admin-${safeFileName(originalName) || "upload"}`;

  /*
   * Same Google Drive upload mechanism as the working onboarding form:
   * create resumable session -> upload bytes -> store returned Drive IDs.
   */
  const initiationUrl = new URL(
    "https://www.googleapis.com/upload/drive/v3/files"
  );

  initiationUrl.searchParams.set("uploadType", "resumable");
  initiationUrl.searchParams.set("supportsAllDrives", "true");
  initiationUrl.searchParams.set(
    "fields",
    "id,name,mimeType,webViewLink,parents,size"
  );

  const initiationResponse = await fetch(
    initiationUrl.toString(),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": file.type,
        "X-Upload-Content-Length": String(file.size),
      },
      body: JSON.stringify({
        name: storedName,
        parents: [ownerFolderId],
      }),
    }
  );

  if (!initiationResponse.ok) {
    const details = await initiationResponse.text();

    throw new Error(
      `Google Drive could not create an upload session (${initiationResponse.status}): ${details}`
    );
  }

  const uploadUrl =
    initiationResponse.headers.get("location");

  if (!uploadUrl) {
    throw new Error(
      "Google Drive did not return a resumable upload URL."
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.size),
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text();

    throw new Error(
      `Google Drive upload failed (${uploadResponse.status}): ${details}`
    );
  }

  const uploaded = (await uploadResponse.json()) as {
    id?: string;
    webViewLink?: string;
  };

  if (!uploaded.id) {
    throw new Error("Google Drive did not return a file ID.");
  }

  const driveUrl =
    uploaded.webViewLink ||
    `https://drive.google.com/file/d/${uploaded.id}/view`;

  const sortRows = await sql`
    SELECT COALESCE(MAX(sort_order), 0)::int AS max_sort
    FROM onboarding_files
    WHERE submission_id = ${targetSubmissionId}
      AND file_group = ${category};
  `;

  const nextSort =
    Number(
      (sortRows[0] as DbRow | undefined)?.max_sort ?? 0
    ) + 1;

  await sql`
    INSERT INTO onboarding_files (
      submission_id,
      unit_id,
      unit_client_id,
      unit_name,
      file_scope,
      file_group,
      file_group_label,
      original_name,
      stored_name,
      drive_file_id,
      drive_folder_id,
      drive_folder_url,
      drive_url,
      mime_type,
      file_size,
      sort_order
    )
    VALUES (
      ${targetSubmissionId},
      ${unit.unitId},
      ${unit.unitClientId},
      ${unit.unitName},
      ${categoryData.scope},
      ${category},
      ${categoryData.label},
      ${originalName},
      ${storedName},
      ${uploaded.id},
      ${ownerFolderId},
      ${clientFolder.folderUrl},
      ${driveUrl},
      ${file.type},
      ${file.size},
      ${nextSort}
    );
  `;

  return {
    success: true,
  };
}

async function moveFile({
  propertyId,
  fileId,
  category,
  unitId,
}: {
  propertyId: number;
  fileId: number;
  category: string;
  unitId: number | null;
}) {
  const sql = getSql();
  const { property, file } =
    await getOwnedFile(propertyId, fileId);

  const categoryData =
    categoryInfo(category, Boolean(unitId));

  if (categoryData.unitRequired && !unitId) {
    throw new Error("This category requires a unit.");
  }

  const unit = await resolveUnitForContact(
    property.contactId,
    unitId
  );

  const currentSubmissionId =
    Number(file.submission_id);

  /*
   * If the admin moves a photo into a unit, attach it to that unit's
   * submission. Otherwise keep the file on its current submission.
   * This is important for old/test records whose photos are displayed
   * through the page's fallback submission.
   */
  const targetSubmissionId =
    unit.submissionId ??
    currentSubmissionId;

  await sql`
    UPDATE onboarding_files
    SET
      submission_id = ${targetSubmissionId},
      unit_id = ${unit.unitId},
      unit_client_id = ${unit.unitClientId},
      unit_name = ${unit.unitName},
      file_scope = ${categoryData.scope},
      file_group = ${category},
      file_group_label = ${categoryData.label}
    WHERE id = ${fileId};
  `;

  return {
    success: true,
  };
}

async function deleteFile({
  propertyId,
  fileId,
}: {
  propertyId: number;
  fileId: number;
}) {
  const sql = getSql();

  const { file } =
    await getOwnedFile(
      propertyId,
      fileId
    );

  const driveFileId =
    file.drive_file_id
      ? String(
          file.drive_file_id
        )
      : null;

  /*
   * Move the Google Drive file to trash first.
   * Remove the Neon record only after Drive succeeds.
   */
  if (driveFileId) {
    const drive =
      getDriveClient();

    try {
      await drive.files.update({
        fileId:
          driveFileId,

        requestBody: {
          trashed: true,
        },

        supportsAllDrives:
          true,

        fields:
          "id,trashed",
      });
    } catch (driveError) {
      console.error(
        "[admin/photos] Could not move Drive file to trash:",
        {
          driveFileId,
          driveError,
        }
      );

      throw new Error(
        "The file could not be moved to the Google Drive trash."
      );
    }
  }

  await sql`
    DELETE FROM onboarding_files
    WHERE id = ${fileId};
  `;

  return {
    success: true,
  };
}

export async function POST(request: Request) {
  try {

    const formData = await request.formData();
    const action = String(formData.get("action") ?? "");
    const propertyId = Number(formData.get("propertyId"));

    if (!Number.isInteger(propertyId) || propertyId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid property ID." },
        { status: 400 }
      );
    }

    if (action === "upload") {
      const category = String(formData.get("category") ?? "");
      const unitIdValue = String(formData.get("unitId") ?? "").trim();
      const unitId = unitIdValue ? Number(unitIdValue) : null;
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, error: "Missing file." },
          { status: 400 }
        );
      }

      const result = await uploadFile({
        propertyId,
        category,
        unitId,
        file,
      });

      return NextResponse.json(result);
    }

    if (action === "move") {
      const fileId = Number(formData.get("fileId"));
      const category = String(formData.get("category") ?? "");
      const unitIdValue = String(formData.get("unitId") ?? "").trim();
      const unitId = unitIdValue ? Number(unitIdValue) : null;

      if (!Number.isInteger(fileId) || fileId < 1) {
        return NextResponse.json(
          { success: false, error: "Invalid file ID." },
          { status: 400 }
        );
      }

      const result = await moveFile({
        propertyId,
        fileId,
        category,
        unitId,
      });

      return NextResponse.json(result);
    }

    if (action === "delete") {
      const fileId = Number(formData.get("fileId"));

      if (!Number.isInteger(fileId) || fileId < 1) {
        return NextResponse.json(
          { success: false, error: "Invalid file ID." },
          { status: 400 }
        );
      }

      const result = await deleteFile({
        propertyId,
        fileId,
      });

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: "Unsupported action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[admin/photos] request failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
