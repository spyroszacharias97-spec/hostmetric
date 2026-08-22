import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { google } from "googleapis";

export const runtime = "nodejs";

const MAX_TOTAL_FILES = 300;
const MAX_FILES_PER_GROUP = 50;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_FLOOR_PLAN_TYPES = new Set([
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

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

type UploadFileMetadata = {
  name: string;
  type: string;
  size: number;
  fileGroup: string;
  unitClientId: number | null;
  unitName: string | null;
};

type UploadManifestItem = {
  folderId: string;
  fileGroup: string;
  unitClientId: number | null;
  storedName: string;
  originalName: string;
  type: string;
  size: number;
};

type UnitInput = {
  id: number;
  name: string;
  type: string;
  quantity: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  maxGuests: string;
  maxAdults: string;
  maxChildren: string;
  kingBeds: string;
  queenBeds: string;
  doubleBeds: string;
  singleBeds: string;
  sofaBeds: string;
  bunkBeds: string;
  kitchen: string;
  smokingPolicy: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return new Resend(apiKey);
}

function getGoogleCredentials(): ServiceAccountCredentials {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing.");
  }

  let parsed: ServiceAccountCredentials;

  try {
    parsed = JSON.parse(raw) as ServiceAccountCredentials;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("Google service account credentials are incomplete.");
  }

  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeFileName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function safeFolderName(value: string) {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  return cleaned || "Unnamed";
}

function isValidDriveId(value: string) {
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

function parseInteger(value: unknown) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDecimal(value: unknown) {
  const normalized = String(value ?? "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isFilled(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }

  return String(value ?? "").trim() !== "";
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function getGroupFolderPath(file: UploadFileMetadata) {
  if (PROPERTY_GROUPS[file.fileGroup]) {
    return ["01 Property Overview", PROPERTY_GROUPS[file.fileGroup]];
  }

  if (UNIT_GROUPS[file.fileGroup]) {
    if (!Number.isInteger(file.unitClientId) || !file.unitClientId) {
      throw new Error("Unit photos are missing their unit reference.");
    }

    const unitLabel = `Unit-${file.unitClientId} - ${safeFolderName(
      file.unitName || `Unit ${file.unitClientId}`
    )}`;

    return ["02 Units", unitLabel, UNIT_GROUPS[file.fileGroup]];
  }

  if (ACCESSIBILITY_GROUPS[file.fileGroup]) {
    return [
      "03 Accessibility Evidence",
      ACCESSIBILITY_GROUPS[file.fileGroup],
    ];
  }

  if (CHECKIN_GROUPS[file.fileGroup]) {
    return ["04 Check-in & Access", CHECKIN_GROUPS[file.fileGroup]];
  }

  if (file.fileGroup === "floor_plan") {
    return ["05 Floor Plans"];
  }

  throw new Error(`Unsupported upload group: ${file.fileGroup}`);
}

function validateUploadMetadata(files: UploadFileMetadata[]) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("No files were provided.");
  }

  if (files.length > MAX_TOTAL_FILES) {
    throw new Error(`You can upload up to ${MAX_TOTAL_FILES} files in one onboarding request.`);
  }

  const groupCounts = new Map<string, number>();

  files.forEach((file) => {
    if (
      !file ||
      typeof file.name !== "string" ||
      typeof file.type !== "string" ||
      typeof file.size !== "number" ||
      typeof file.fileGroup !== "string"
    ) {
      throw new Error("Invalid upload metadata.");
    }

    getGroupFolderPath(file);

    const allowedTypes =
      file.fileGroup === "floor_plan"
        ? ALLOWED_FLOOR_PLAN_TYPES
        : ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.has(file.type)) {
      throw new Error(
        file.fileGroup === "floor_plan"
          ? "Floor plans must be JPG, PNG, WEBP or PDF files."
          : "Photos must be JPG, PNG or WEBP files."
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      throw new Error(
        `Each file must be smaller than ${MAX_FILE_SIZE / 1024 / 1024} MB.`
      );
    }

    const countKey = `${file.unitClientId ?? "general"}:${file.fileGroup}`;
    const nextCount = (groupCounts.get(countKey) ?? 0) + 1;

    if (nextCount > MAX_FILES_PER_GROUP) {
      throw new Error(`Each upload category can contain up to ${MAX_FILES_PER_GROUP} files.`);
    }

    groupCounts.set(countKey, nextCount);
  });
}

async function createFolder(
  drive: ReturnType<typeof getDriveClient>,
  parentId: string,
  name: string
) {
  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id,name,webViewLink,parents",
    supportsAllDrives: true,
  });

  if (!response.data.id) {
    throw new Error(`Could not create Google Drive folder: ${name}`);
  }

  return response.data.id;
}

async function createUploadBatch(
  fullName: string,
  email: string,
  propertyName: string,
  files: UploadFileMetadata[]
) {
  if (!fullName.trim() || !email.trim() || !propertyName.trim()) {
    throw new Error("Name, email and property name are required before uploading files.");
  }

  validateUploadMetadata(files);

  const parentFolderId = process.env.GOOGLE_ONBOARDING_DRIVE_FOLDER_ID;

  if (!parentFolderId) {
    throw new Error("GOOGLE_ONBOARDING_DRIVE_FOLDER_ID is missing.");
  }

  const auth = getGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rootName = `${timestamp} - ${safeFolderName(fullName)} - ${safeFolderName(
    propertyName
  )} - ${safeFolderName(email)}`;

  const rootFolderId = await createFolder(drive, parentFolderId, rootName);
  const folderCache = new Map<string, string>();
  folderCache.set("", rootFolderId);

  const ensurePath = async (path: string[]) => {
    let parentId = rootFolderId;
    let accumulated = "";

    for (const segment of path) {
      accumulated = accumulated ? `${accumulated}/${segment}` : segment;

      const existing = folderCache.get(accumulated);
      if (existing) {
        parentId = existing;
        continue;
      }

      const folderId = await createFolder(drive, parentId, segment);
      folderCache.set(accumulated, folderId);
      parentId = folderId;
    }

    return parentId;
  };

  const accessTokenResponse = await auth.getAccessToken();
  const accessToken = accessTokenResponse.token;

  if (!accessToken) {
    throw new Error("Could not obtain a Google access token.");
  }

  const uploads: Array<{
    index: number;
    uploadUrl: string;
    folderId: string;
    fileGroup: string;
    unitClientId: number | null;
    storedName: string;
    originalName: string;
    type: string;
    size: number;
  }> = [];

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const folderId = await ensurePath(getGroupFolderPath(file));
      const originalName = safeFileName(file.name) || `file-${index + 1}`;
      const storedName = `${String(index + 1).padStart(3, "0")}-${originalName}`;

      const initiationUrl = new URL(
        "https://www.googleapis.com/upload/drive/v3/files"
      );
      initiationUrl.searchParams.set("uploadType", "resumable");
      initiationUrl.searchParams.set("supportsAllDrives", "true");
      initiationUrl.searchParams.set(
        "fields",
        "id,name,mimeType,webViewLink,parents,size"
      );

      const initiationResponse = await fetch(initiationUrl.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": file.type,
          "X-Upload-Content-Length": String(file.size),
        },
        body: JSON.stringify({
          name: storedName,
          parents: [folderId],
        }),
      });

      if (!initiationResponse.ok) {
        const details = await initiationResponse.text();
        throw new Error(
          `Google Drive could not create an upload session (${initiationResponse.status}): ${details}`
        );
      }

      const uploadUrl = initiationResponse.headers.get("location");

      if (!uploadUrl) {
        throw new Error("Google Drive did not return a resumable upload URL.");
      }

      uploads.push({
        index,
        uploadUrl,
        folderId,
        fileGroup: file.fileGroup,
        unitClientId: file.unitClientId ?? null,
        storedName,
        originalName: file.name,
        type: file.type,
        size: file.size,
      });
    }
  } catch (error) {
    try {
      await drive.files.delete({
        fileId: rootFolderId,
        supportsAllDrives: true,
      });
    } catch (cleanupError) {
      console.error("Could not clean up failed onboarding folder:", cleanupError);
    }

    throw error;
  }

  return {
    folderId: rootFolderId,
    driveFolderLink: `https://drive.google.com/drive/folders/${rootFolderId}`,
    uploads,
  };
}

async function verifyRootFolder(rootFolderId: string) {
  const expectedParentId = process.env.GOOGLE_ONBOARDING_DRIVE_FOLDER_ID;

  if (!expectedParentId) {
    throw new Error("GOOGLE_ONBOARDING_DRIVE_FOLDER_ID is missing.");
  }

  if (!isValidDriveId(rootFolderId)) {
    throw new Error("Invalid onboarding Google Drive folder ID.");
  }

  const drive = getDriveClient();
  const response = await drive.files.get({
    fileId: rootFolderId,
    fields: "id,name,mimeType,parents,trashed",
    supportsAllDrives: true,
  });

  if (
    response.data.mimeType !== "application/vnd.google-apps.folder" ||
    response.data.trashed ||
    !response.data.parents?.includes(expectedParentId)
  ) {
    throw new Error("The upload folder is not a valid HostMetric onboarding folder.");
  }

  return drive;
}

async function folderIsDescendantOf(
  drive: ReturnType<typeof getDriveClient>,
  folderId: string,
  rootFolderId: string
) {
  if (folderId === rootFolderId) {
    return true;
  }

  let currentId = folderId;

  for (let depth = 0; depth < 6; depth += 1) {
    const response = await drive.files.get({
      fileId: currentId,
      fields: "id,mimeType,parents,trashed",
      supportsAllDrives: true,
    });

    if (
      response.data.mimeType !== "application/vnd.google-apps.folder" ||
      response.data.trashed
    ) {
      return false;
    }

    const parents = response.data.parents ?? [];

    if (parents.includes(rootFolderId)) {
      return true;
    }

    if (parents.length === 0) {
      return false;
    }

    currentId = parents[0];
  }

  return false;
}

async function verifyUploadedFiles(
  rootFolderId: string,
  manifest: UploadManifestItem[],
  expectedFileCount: number
) {
  if (manifest.length !== expectedFileCount) {
    throw new Error("The upload manifest does not match the expected number of files.");
  }

  if (expectedFileCount === 0) {
    return [] as Array<{
      id: string;
      name: string;
      webViewLink: string;
      folderId: string;
      fileGroup: string;
      unitClientId: number | null;
      originalName: string;
      mimeType: string;
      size: number;
      sortOrder: number;
    }>;
  }

  const drive = await verifyRootFolder(rootFolderId);
  const folderIds = [...new Set(manifest.map((item) => item.folderId))];

  for (const folderId of folderIds) {
    if (!isValidDriveId(folderId)) {
      throw new Error("Invalid upload category folder ID.");
    }

    const valid = await folderIsDescendantOf(drive, folderId, rootFolderId);
    if (!valid) {
      throw new Error("An upload category folder does not belong to this onboarding request.");
    }
  }

  let lastVerified: Array<{
    id: string;
    name: string;
    webViewLink: string;
    folderId: string;
    fileGroup: string;
    unitClientId: number | null;
    originalName: string;
    mimeType: string;
    size: number;
    sortOrder: number;
  }> = [];

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const filesByFolder = new Map<
      string,
      Map<
        string,
        {
          id: string;
          name: string;
          mimeType: string;
          webViewLink: string;
          size: number;
        }
      >
    >();

    for (const folderId of folderIds) {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: 1000,
        orderBy: "name",
        fields: "files(id,name,mimeType,webViewLink,size,parents)",
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      const folderMap = new Map<
        string,
        {
          id: string;
          name: string;
          mimeType: string;
          webViewLink: string;
          size: number;
        }
      >();

      for (const file of response.data.files ?? []) {
        if (!file.id || !file.name || !file.mimeType) {
          continue;
        }

        folderMap.set(file.name, {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          webViewLink:
            file.webViewLink ??
            `https://drive.google.com/file/d/${file.id}/view`,
          size: Number(file.size ?? 0),
        });
      }

      filesByFolder.set(folderId, folderMap);
    }

    lastVerified = manifest
      .map((item, sortOrder) => {
        const found = filesByFolder.get(item.folderId)?.get(item.storedName);

        if (!found) {
          return null;
        }

        return {
          ...found,
          folderId: item.folderId,
          fileGroup: item.fileGroup,
          unitClientId: item.unitClientId,
          originalName: item.originalName,
          size: found.size || item.size,
          sortOrder,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (lastVerified.length === expectedFileCount) {
      return lastVerified;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  throw new Error(
    `Ανέβηκαν ${lastVerified.length} από ${expectedFileCount} αρχεία. Παρακαλώ δοκιμάστε ξανά.`
  );
}

function validateOnboardingPayload(
  formData: Record<string, unknown>,
  units: UnitInput[],
  selectedPlatforms: string[]
) {
  const requiredFields = [
    "propertyCountry",
    "firstName",
    "lastName",
    "email",
    "phone",
    "residenceCountry",
    "propertyName",
    "propertyAddress",
    "propertyCity",
    "propertyPostalCode",
    "propertyCategory",
    "ownershipStatus",
    "accommodationStructure",
    "listingStatus",
    "channelManagerStatus",
    "pmsStatus",
    "websiteStatus",
    "directBookingsStatus",
    "checkInFrom",
    "checkOutUntil",
    "checkInMethod",
    "guestLanguages",
    "childrenPolicy",
    "petsPolicy",
    "partiesPolicy",
    "smokingPropertyPolicy",
    "primaryGoal",
    "preferredContactMethod",
  ];

  for (const field of requiredFields) {
    if (!isFilled(formData[field])) {
      throw new Error(`Missing required onboarding field: ${field}`);
    }
  }

  if (
    formData.ownerType === "business" &&
    !isFilled(formData.businessName)
  ) {
    throw new Error("Business name is required for business owners.");
  }

  if (
    (formData.listingStatus === "yes" || formData.listingStatus === "partial") &&
    selectedPlatforms.length === 0
  ) {
    throw new Error("Please select at least one existing listing platform.");
  }

  if (
    formData.informationAccuracyConfirmed !== "yes" ||
    formData.authorizationConfirmed !== "yes" ||
    formData.listingSetupAuthorization !== "yes"
  ) {
    throw new Error("The final onboarding confirmations are required.");
  }

  if (!Array.isArray(units) || units.length === 0) {
    throw new Error("At least one room or unit type is required.");
  }

  for (const unit of units) {
    if (
      !String(unit.name ?? "").trim() ||
      !String(unit.type ?? "").trim() ||
      (parseInteger(unit.quantity) ?? 0) < 1 ||
      (parseInteger(unit.maxGuests) ?? 0) < 1
    ) {
      throw new Error("One or more unit types are missing required information.");
    }
  }
}

async function submitOnboarding(body: Record<string, unknown>) {
  const formData =
    body.formData && typeof body.formData === "object"
      ? (body.formData as Record<string, unknown>)
      : {};

  const units = Array.isArray(body.units) ? (body.units as UnitInput[]) : [];
  const selectedPlatforms = Array.isArray(body.selectedPlatforms)
    ? body.selectedPlatforms.map(String)
    : [];
  const selectedPropertyFacilities = Array.isArray(body.selectedPropertyFacilities)
    ? body.selectedPropertyFacilities.map(String)
    : [];
  const selectedAccessibility = Array.isArray(body.selectedAccessibility)
    ? body.selectedAccessibility.map(String)
    : [];

  const unitAmenities =
    body.unitAmenities && typeof body.unitAmenities === "object"
      ? (body.unitAmenities as Record<string, string[]>)
      : {};

  const unitPricing =
    body.unitPricing && typeof body.unitPricing === "object"
      ? (body.unitPricing as Record<string, Record<string, string>>)
      : {};

  validateOnboardingPayload(formData, units, selectedPlatforms);

  const driveFolderId =
    typeof body.driveFolderId === "string" && body.driveFolderId
      ? body.driveFolderId
      : null;

  const expectedFileCount =
    typeof body.expectedFileCount === "number" &&
    Number.isInteger(body.expectedFileCount) &&
    body.expectedFileCount >= 0
      ? Math.min(body.expectedFileCount, MAX_TOTAL_FILES)
      : 0;

  const uploadManifest = Array.isArray(body.uploadManifest)
    ? (body.uploadManifest as UploadManifestItem[])
    : [];

  if (expectedFileCount > 0 && !driveFolderId) {
    throw new Error("The Google Drive onboarding folder is missing.");
  }

  const uploadedFiles = driveFolderId
    ? await verifyUploadedFiles(
        driveFolderId,
        uploadManifest,
        expectedFileCount
      )
    : [];

  const fullName = `${String(formData.firstName ?? "").trim()} ${String(
    formData.lastName ?? ""
  ).trim()}`.trim();
  const email = String(formData.email ?? "").trim().toLowerCase();
  const phone = `${String(formData.phoneCountryCode ?? "").trim()} ${String(
    formData.phone ?? ""
  ).trim()}`.trim();
  const listingStatus = String(formData.listingStatus ?? "");
  const hasExistingListings = listingStatus === "yes" || listingStatus === "partial";

  const completeFormSnapshot = {
    ...formData,
    selectedPlatforms,
    selectedPropertyFacilities,
    selectedAccessibility,
    unitAmenities,
    unitPricing,
  };

  const sql = getSql();

  const submissionRows = await sql`
    INSERT INTO onboarding_submissions (
      owner_type,
      first_name,
      last_name,
      email,
      phone,
      country_of_residence,
      birth_date,
      business_name,
      business_registration_number,
      home_address,
      home_city,
      home_postal_code,
      property_name,
      property_type,
      property_country,
      property_city,
      property_address,
      property_postal_code,
      website_url,
      booking_url,
      airbnb_url,
      vrbo_url,
      expedia_url,
      tripadvisor_url,
      currently_operating,
      existing_listings,
      form_data,
      status
    )
    VALUES (
      ${String(formData.ownerType ?? "") || null},
      ${String(formData.firstName ?? "") || null},
      ${String(formData.lastName ?? "") || null},
      ${email},
      ${phone || null},
      ${String(formData.residenceCountry ?? "") || null},
      ${String(formData.dateOfBirth ?? "") || null},
      ${String(formData.businessName ?? "") || null},
      ${String(formData.businessRegistrationNumber ?? "") || null},
      ${String(formData.residentialAddress ?? "") || null},
      ${String(formData.residentialCity ?? "") || null},
      ${String(formData.residentialPostalCode ?? "") || null},
      ${String(formData.propertyName ?? "") || null},
      ${String(formData.propertyCategory ?? "") || null},
      ${String(formData.propertyCountry ?? "") || null},
      ${String(formData.propertyCity ?? "") || null},
      ${String(formData.propertyAddress ?? "") || null},
      ${String(formData.propertyPostalCode ?? "") || null},
      ${String(formData.websiteUrl ?? "") || null},
      ${String(formData.bookingUrl ?? "") || null},
      ${String(formData.airbnbUrl ?? "") || null},
      ${String(formData.vrboUrl ?? "") || null},
      ${String(formData.expediaUrl ?? "") || null},
      ${null},
      ${hasExistingListings},
      ${hasExistingListings},
      ${JSON.stringify(completeFormSnapshot)}::jsonb,
      ${"new"}
    )
    RETURNING id, contact_id, created_at;
  `;

  const submission = submissionRows[0];
  const submissionId = Number(submission.id);
  const databaseUnitIds = new Map<number, number>();

  for (const unit of units) {
    const clientUnitId = Number(unit.id);
    const unitSnapshot = {
      ...unit,
      amenities: unitAmenities[String(clientUnitId)] ?? [],
      pricing: unitPricing[String(clientUnitId)] ?? {},
    };

    const unitRows = await sql`
      INSERT INTO onboarding_units (
        submission_id,
        unit_index,
        unit_name,
        unit_type,
        bedrooms,
        bathrooms,
        max_guests,
        size_sqm,
        unit_data
      )
      VALUES (
        ${submissionId},
        ${clientUnitId},
        ${unit.name || null},
        ${unit.type || null},
        ${parseInteger(unit.bedrooms)},
        ${parseInteger(unit.bathrooms)},
        ${parseInteger(unit.maxGuests)},
        ${parseDecimal(unit.size)},
        ${JSON.stringify(unitSnapshot)}::jsonb
      )
      RETURNING id;
    `;

    databaseUnitIds.set(clientUnitId, Number(unitRows[0].id));
  }

  for (const file of uploadedFiles) {
    const databaseUnitId = file.unitClientId
      ? databaseUnitIds.get(file.unitClientId) ?? null
      : null;

    await sql`
      INSERT INTO onboarding_files (
        submission_id,
        unit_id,
        file_group,
        original_name,
        drive_file_id,
        drive_folder_id,
        drive_url,
        mime_type,
        file_size,
        sort_order
      )
      VALUES (
        ${submissionId},
        ${databaseUnitId},
        ${file.fileGroup},
        ${file.originalName},
        ${file.id},
        ${file.folderId},
        ${file.webViewLink},
        ${file.mimeType},
        ${file.size},
        ${file.sortOrder}
      );
    `;
  }

  const filledFields = Object.entries(formData)
    .filter(([, value]) => isFilled(value))
    .map(([key]) => humanizeKey(key));

  if (selectedPlatforms.length > 0) {
    filledFields.push("Selected listing platforms");
  }
  if (selectedPropertyFacilities.length > 0) {
    filledFields.push("Property facilities");
  }
  if (selectedAccessibility.length > 0) {
    filledFields.push("Accessibility features");
  }
  if (units.length > 0) {
    filledFields.push("Room / unit details");
  }

  const driveFolderLink = driveFolderId
    ? `https://drive.google.com/drive/folders/${driveFolderId}`
    : null;

  const resend = getResendClient();
  const { error: emailError } = await resend.emails.send({
    from: "HostMetric Website <notifications@hostmetric.gr>",
    to: ["info@hostmetric.gr"],
    replyTo: email,
    subject: `Νέο Get Started από ${fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;line-height:1.55;">
        <h2>Νέο Get Started αίτημα</h2>

        <p><strong>Όνομα:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Ακίνητο:</strong> ${escapeHtml(String(formData.propertyName ?? ""))}</p>
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Units:</strong> ${units.length}</p>
        <p><strong>Uploads:</strong> ${uploadedFiles.length}</p>

        ${
          driveFolderLink
            ? `<p><a href="${driveFolderLink}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;">Άνοιγμα Get Started φακέλου</a></p>`
            : ""
        }

        <hr />
        <p><strong>Πεδία που συμπληρώθηκαν:</strong></p>
        <ul>
          ${filledFields.map((field) => `<li>${escapeHtml(field)}</li>`).join("")}
        </ul>

        <p style="font-size:12px;color:#777;">Τα πλήρη στοιχεία της αίτησης βρίσκονται στη Neon.</p>
      </div>
    `,
  });

  if (emailError) {
    console.error("Onboarding Resend notification error:", emailError);
  }

  return {
    submissionId,
    contactId: submission.contact_id,
    uploadedFiles: uploadedFiles.length,
    driveFolderLink,
    emailNotificationSent: !emailError,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action ?? "");

    if (action === "create-upload-batch") {
      const fullName = String(body.fullName ?? "").trim();
      const email = String(body.email ?? "").trim();
      const propertyName = String(body.propertyName ?? "").trim();
      const files = Array.isArray(body.files)
        ? (body.files as UploadFileMetadata[])
        : [];

      const result = await createUploadBatch(
        fullName,
        email,
        propertyName,
        files
      );

      return NextResponse.json(
        {
          success: true,
          ...result,
        },
        { status: 201 }
      );
    }

    if (action === "submit-onboarding") {
      const result = await submitOnboarding(body);

      return NextResponse.json(
        {
          success: true,
          ...result,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid onboarding API action.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Onboarding API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while processing the onboarding submission.",
      },
      { status: 500 }
    );
  }
}