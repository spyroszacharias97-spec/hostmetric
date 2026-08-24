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

function getOnboardingParentFolderId() {
  const parentFolderId =
    process.env.GOOGLE_ONBOARDING_DRIVE_FOLDER_ID;

  if (!parentFolderId) {
    throw new Error(
      "GOOGLE_ONBOARDING_DRIVE_FOLDER_ID is missing."
    );
  }

  return parentFolderId;
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

function getFileGroupLabel(fileGroup: string) {
  if (PROPERTY_GROUPS[fileGroup]) return PROPERTY_GROUPS[fileGroup];
  if (UNIT_GROUPS[fileGroup]) return UNIT_GROUPS[fileGroup];
  if (ACCESSIBILITY_GROUPS[fileGroup]) return ACCESSIBILITY_GROUPS[fileGroup];
  if (CHECKIN_GROUPS[fileGroup]) return CHECKIN_GROUPS[fileGroup];
  if (fileGroup === "floor_plan") return "Floor Plan";
  return humanizeKey(fileGroup);
}

function getFileScope(
  fileGroup: string,
  unitClientId: number | null
) {
  if (fileGroup === "floor_plan") return "floor_plan";
  if (PROPERTY_GROUPS[fileGroup]) return "property";
  if (UNIT_GROUPS[fileGroup]) return "unit";
  if (CHECKIN_GROUPS[fileGroup]) return "check_in";
  if (ACCESSIBILITY_GROUPS[fileGroup]) {
    return unitClientId
      ? "unit_accessibility"
      : "property_accessibility";
  }

  return "other";
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
    if (Number.isInteger(file.unitClientId) && file.unitClientId) {
      const unitLabel = `Unit-${file.unitClientId} - ${safeFolderName(
        file.unitName || `Unit ${file.unitClientId}`
      )}`;

      return [
        "03 Accessibility Evidence",
        unitLabel,
        ACCESSIBILITY_GROUPS[file.fileGroup],
      ];
    }

    return [
      "03 Accessibility Evidence",
      "Property - Shared Access",
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

function escapeDriveQueryValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

async function verifyOnboardingParentFolder() {
  const parentFolderId = getOnboardingParentFolderId();

  if (!isValidDriveId(parentFolderId)) {
    throw new Error(
      "GOOGLE_ONBOARDING_DRIVE_FOLDER_ID is not a valid Google Drive folder ID."
    );
  }

  const drive = getDriveClient();

  try {
    const response = await drive.files.get({
      fileId: parentFolderId,
      fields: "id,name,mimeType,trashed",
      supportsAllDrives: true,
    });

    if (
      response.data.mimeType !== "application/vnd.google-apps.folder" ||
      response.data.trashed
    ) {
      throw new Error(
        "GOOGLE_ONBOARDING_DRIVE_FOLDER_ID does not point to an active Google Drive folder."
      );
    }
  } catch (error) {
    console.error(
      "[onboarding] Could not access configured Get Started parent folder:",
      parentFolderId,
      error
    );

    throw new Error(
      `The HostMetric Get Started uploads folder cannot be accessed (${parentFolderId}). Check GOOGLE_ONBOARDING_DRIVE_FOLDER_ID and make sure the Google service account has access to that exact folder.`
    );
  }

  return {
    drive,
    parentFolderId,
  };
}

async function findOrCreateOwnerFolder(
  drive: ReturnType<typeof getDriveClient>,
  parentFolderId: string,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Owner email is required before uploading files.");
  }

  const folderName = safeFolderName(normalizedEmail);
  const escapedName = escapeDriveQueryValue(folderName);

  const existing = await drive.files.list({
    q: `'${parentFolderId}' in parents and name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    pageSize: 10,
    fields: "files(id,name,webViewLink,parents)",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const existingFolder = existing.data.files?.find(
    (item) => item.id && item.name === folderName
  );

  if (existingFolder?.id) {
    return existingFolder.id;
  }

  return createFolder(
    drive,
    parentFolderId,
    folderName
  );
}

async function createUploadBatch(
  fullName: string,
  email: string,
  propertyName: string,
  files: UploadFileMetadata[]
) {
  if (!fullName.trim() || !email.trim() || !propertyName.trim()) {
    throw new Error(
      "Name, email and property name are required before uploading files."
    );
  }

  validateUploadMetadata(files);

  const { drive, parentFolderId } =
    await verifyOnboardingParentFolder();

  const ownerFolderId =
    await findOrCreateOwnerFolder(
      drive,
      parentFolderId,
      email
    );

  const auth = getGoogleAuth();

  const accessTokenResponse =
    await auth.getAccessToken();

  const accessToken =
    accessTokenResponse.token;

  if (!accessToken) {
    throw new Error(
      "Could not obtain a Google access token."
    );
  }

  /*
   * Every onboarding photo/file goes directly inside:
   *
   * Get Started Uploads
   *   └── owner@email.com
   *       ├── <batch>-001-photo.jpg
   *       ├── <batch>-002-photo.jpg
   *       └── ...
   *
   * The exact meaning of every file is kept in Neon through
   * file_group + unit_id + the Drive file URL/ID.
   */
  const batchPrefix =
    new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

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

  for (
    let index = 0;
    index < files.length;
    index += 1
  ) {
    const file = files[index];

    const originalName =
      safeFileName(file.name) ||
      `file-${index + 1}`;

    const storedName =
      `${batchPrefix}-${String(
        index + 1
      ).padStart(3, "0")}-${originalName}`;

    const initiationUrl =
      new URL(
        "https://www.googleapis.com/upload/drive/v3/files"
      );

    initiationUrl.searchParams.set(
      "uploadType",
      "resumable"
    );

    initiationUrl.searchParams.set(
      "supportsAllDrives",
      "true"
    );

    initiationUrl.searchParams.set(
      "fields",
      "id,name,mimeType,webViewLink,parents,size"
    );

    const initiationResponse =
      await fetch(
        initiationUrl.toString(),
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            "Content-Type":
              "application/json; charset=UTF-8",
            "X-Upload-Content-Type":
              file.type,
            "X-Upload-Content-Length":
              String(file.size),
          },
          body: JSON.stringify({
            name: storedName,
            parents: [
              ownerFolderId,
            ],
          }),
        }
      );

    if (!initiationResponse.ok) {
      const details =
        await initiationResponse.text();

      throw new Error(
        `Google Drive could not create an upload session (${initiationResponse.status}): ${details}`
      );
    }

    const uploadUrl =
      initiationResponse.headers.get(
        "location"
      );

    if (!uploadUrl) {
      throw new Error(
        "Google Drive did not return a resumable upload URL."
      );
    }

    uploads.push({
      index,
      uploadUrl,
      folderId: ownerFolderId,
      fileGroup: file.fileGroup,
      unitClientId:
        file.unitClientId ?? null,
      storedName,
      originalName: file.name,
      type: file.type,
      size: file.size,
    });
  }

  return {
    folderId: ownerFolderId,
    driveFolderLink:
      `https://drive.google.com/drive/folders/${ownerFolderId}`,
    uploads,
  };
}

async function verifyOwnerFolder(
  ownerFolderId: string
) {
  const expectedParentId =
    getOnboardingParentFolderId();

  if (!isValidDriveId(ownerFolderId)) {
    throw new Error(
      "Invalid onboarding Google Drive owner folder ID."
    );
  }

  const drive =
    getDriveClient();

  const response =
    await drive.files.get({
      fileId: ownerFolderId,
      fields:
        "id,name,mimeType,parents,trashed",
      supportsAllDrives: true,
    });

  if (
    response.data.mimeType !==
      "application/vnd.google-apps.folder" ||
    response.data.trashed ||
    !response.data.parents?.includes(
      expectedParentId
    )
  ) {
    throw new Error(
      "The upload folder is not a valid HostMetric onboarding owner folder."
    );
  }

  return drive;
}

async function verifyUploadedFiles(
  ownerFolderId: string,
  manifest: UploadManifestItem[],
  expectedFileCount: number
) {
  if (
    manifest.length !==
    expectedFileCount
  ) {
    throw new Error(
      "The upload manifest does not match the expected number of files."
    );
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

  const drive =
    await verifyOwnerFolder(
      ownerFolderId
    );

  for (const item of manifest) {
    if (
      item.folderId !==
      ownerFolderId
    ) {
      throw new Error(
        "An uploaded file points to the wrong onboarding owner folder."
      );
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

  /*
   * Drive may need a short moment before newly uploaded files appear
   * in a list query, so verify a few times before failing.
   */
  for (
    let attempt = 0;
    attempt < 6;
    attempt += 1
  ) {
    const response =
      await drive.files.list({
        q: `'${ownerFolderId}' in parents and trashed = false`,
        pageSize: 1000,
        orderBy: "name",
        fields:
          "files(id,name,mimeType,webViewLink,size,parents)",
        includeItemsFromAllDrives:
          true,
        supportsAllDrives: true,
      });

    const filesByName =
      new Map<
        string,
        {
          id: string;
          name: string;
          mimeType: string;
          webViewLink: string;
          size: number;
        }
      >();

    for (
      const file of
      response.data.files ?? []
    ) {
      if (
        !file.id ||
        !file.name ||
        !file.mimeType
      ) {
        continue;
      }

      filesByName.set(
        file.name,
        {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          webViewLink:
            file.webViewLink ??
            `https://drive.google.com/file/d/${file.id}/view`,
          size:
            Number(
              file.size ?? 0
            ),
        }
      );
    }

    lastVerified =
      manifest
        .map(
          (
            item,
            sortOrder
          ) => {
            const found =
              filesByName.get(
                item.storedName
              );

            if (!found) {
              return null;
            }

            return {
              ...found,
              folderId:
                ownerFolderId,
              fileGroup:
                item.fileGroup,
              unitClientId:
                item.unitClientId,
              originalName:
                item.originalName,
              size:
                found.size ||
                item.size,
              sortOrder,
            };
          }
        )
        .filter(
          (
            item
          ): item is NonNullable<
            typeof item
          > =>
            item !== null
        );

    if (
      lastVerified.length ===
      expectedFileCount
    ) {
      return lastVerified;
    }

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          800
        )
    );
  }

  throw new Error(
    `Ανέβηκαν ${lastVerified.length} από ${expectedFileCount} αρχεία. Παρακαλώ δοκιμάστε ξανά.`
  );
}

/*
 * IMPORTANT:
 * The email folder is persistent and may already contain successful files
 * from older submissions. Never delete the whole owner folder when one
 * upload attempt fails.
 */
async function cleanupUploadBatch(
  ownerFolderId: string
) {
  await verifyOwnerFolder(
    ownerFolderId
  );

  console.warn(
    "[onboarding] cleanup-upload-batch requested. Owner folder preserved:",
    ownerFolderId
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
  const selectedPropertyAccessibility = Array.isArray(
    body.selectedPropertyAccessibility
  )
    ? body.selectedPropertyAccessibility.map(String)
    : Array.isArray(body.selectedAccessibility)
      ? body.selectedAccessibility.map(String)
      : [];

  const unitAccessibility =
    body.unitAccessibility && typeof body.unitAccessibility === "object"
      ? (body.unitAccessibility as Record<string, string[]>)
      : {};

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
    selectedPropertyAccessibility,
    unitAccessibility,
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
      phone_country_code,
      phone_number,
      country_of_residence,
      birth_date,

      business_name,
      business_registration_number,
      vat_number,
      tax_id,
      business_address,
      business_city,
      business_postal_code,

      home_address,
      home_city,
      home_postal_code,

      property_name,
      property_type,
      property_country,
      property_city,
      property_region,
      property_address,
      property_postal_code,
      ownership_status,
      accommodation_structure,
      registration_status,
      registration_number,
      land_registration_number,
      additional_legal_number,

      listing_status,
      booking_url,
      booking_id,
      airbnb_url,
      airbnb_id,
      vrbo_url,
      vrbo_id,
      expedia_url,
      expedia_id,
      agoda_url,
      agoda_id,
      tripcom_url,
      tripcom_id,
      other_platform_name,
      other_platform_url,
      selected_platforms,

      channel_manager_status,
      channel_manager_name,
      pms_status,
      pms_name,
      website_status,
      website_url,
      direct_bookings_status,

      check_in_from,
      check_in_until,
      check_out_from,
      check_out_until,
      check_in_method,
      reception_status,
      guest_languages,
      children_policy,
      minimum_guest_age,
      pets_policy,
      parties_policy,
      smoking_property_policy,
      quiet_hours,
      parking_details,
      breakfast_details,
      internet_details,
      accessibility_notes,

      property_facilities,
      property_accessibility,

      currency,
      cleaning_fee,
      cleaning_fee_type,
      security_deposit,
      local_tax_known,
      local_tax_details,
      minimum_stay,
      maximum_stay,
      advance_notice,
      booking_window,
      same_day_booking,
      cancellation_preference,
      no_show_policy,
      breakfast_pricing,
      breakfast_price,
      current_average_occupancy,
      current_average_daily_rate,
      annual_revenue_estimate,
      revenue_target,
      weekly_discount,
      monthly_discount,
      non_refundable_rate,
      mobile_rate,
      last_minute_discount,
      early_booker_discount,
      owner_blocked_dates,
      pricing_notes,

      existing_listing_title,
      property_summary,
      unique_selling_points,
      neighbourhood_description,
      getting_around,
      nearby_attractions,
      guest_arrival_notes,
      other_listing_notes,
      photo_rights_confirmed,

      primary_goal,
      preferred_start_timeline,
      preferred_contact_method,
      best_contact_time,
      final_notes,
      information_accuracy_confirmed,
      authorization_confirmed,
      listing_setup_authorization,

      drive_folder_id,
      drive_folder_url,

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
      ${String(formData.phoneCountryCode ?? "") || null},
      ${String(formData.phone ?? "") || null},
      ${String(formData.residenceCountry ?? "") || null},
      ${String(formData.dateOfBirth ?? "") || null},

      ${String(formData.businessName ?? "") || null},
      ${String(formData.businessRegistrationNumber ?? "") || null},
      ${String(formData.vatNumber ?? "") || null},
      ${String(formData.taxId ?? "") || null},
      ${String(formData.businessAddress ?? "") || null},
      ${String(formData.businessCity ?? "") || null},
      ${String(formData.businessPostalCode ?? "") || null},

      ${String(formData.residentialAddress ?? "") || null},
      ${String(formData.residentialCity ?? "") || null},
      ${String(formData.residentialPostalCode ?? "") || null},

      ${String(formData.propertyName ?? "") || null},
      ${String(formData.propertyCategory ?? "") || null},
      ${String(formData.propertyCountry ?? "") || null},
      ${String(formData.propertyCity ?? "") || null},
      ${String(formData.propertyRegion ?? "") || null},
      ${String(formData.propertyAddress ?? "") || null},
      ${String(formData.propertyPostalCode ?? "") || null},
      ${String(formData.ownershipStatus ?? "") || null},
      ${String(formData.accommodationStructure ?? "") || null},
      ${String(formData.registrationStatus ?? "") || null},
      ${String(formData.registrationNumber ?? "") || null},
      ${String(formData.landRegistrationNumber ?? "") || null},
      ${String(formData.additionalLegalNumber ?? "") || null},

      ${String(formData.listingStatus ?? "") || null},
      ${String(formData.bookingUrl ?? "") || null},
      ${String(formData.bookingId ?? "") || null},
      ${String(formData.airbnbUrl ?? "") || null},
      ${String(formData.airbnbId ?? "") || null},
      ${String(formData.vrboUrl ?? "") || null},
      ${String(formData.vrboId ?? "") || null},
      ${String(formData.expediaUrl ?? "") || null},
      ${String(formData.expediaId ?? "") || null},
      ${String(formData.agodaUrl ?? "") || null},
      ${String(formData.agodaId ?? "") || null},
      ${String(formData.tripcomUrl ?? "") || null},
      ${String(formData.tripcomId ?? "") || null},
      ${String(formData.otherPlatformName ?? "") || null},
      ${String(formData.otherPlatformUrl ?? "") || null},
      ${JSON.stringify(selectedPlatforms)}::jsonb,

      ${String(formData.channelManagerStatus ?? "") || null},
      ${String(formData.channelManagerName ?? "") || null},
      ${String(formData.pmsStatus ?? "") || null},
      ${String(formData.pmsName ?? "") || null},
      ${String(formData.websiteStatus ?? "") || null},
      ${String(formData.websiteUrl ?? "") || null},
      ${String(formData.directBookingsStatus ?? "") || null},

      ${String(formData.checkInFrom ?? "") || null},
      ${String(formData.checkInUntil ?? "") || null},
      ${String(formData.checkOutFrom ?? "") || null},
      ${String(formData.checkOutUntil ?? "") || null},
      ${String(formData.checkInMethod ?? "") || null},
      ${String(formData.receptionStatus ?? "") || null},
      ${String(formData.guestLanguages ?? "") || null},
      ${String(formData.childrenPolicy ?? "") || null},
      ${parseInteger(formData.minimumGuestAge)},
      ${String(formData.petsPolicy ?? "") || null},
      ${String(formData.partiesPolicy ?? "") || null},
      ${String(formData.smokingPropertyPolicy ?? "") || null},
      ${String(formData.quietHours ?? "") || null},
      ${String(formData.parkingDetails ?? "") || null},
      ${String(formData.breakfastDetails ?? "") || null},
      ${String(formData.internetDetails ?? "") || null},
      ${String(formData.accessibilityNotes ?? "") || null},

      ${JSON.stringify(selectedPropertyFacilities)}::jsonb,
      ${JSON.stringify(selectedPropertyAccessibility)}::jsonb,

      ${String(formData.currency ?? "") || null},
      ${parseDecimal(formData.cleaningFee)},
      ${String(formData.cleaningFeeType ?? "") || null},
      ${parseDecimal(formData.securityDeposit)},
      ${String(formData.localTaxKnown ?? "") || null},
      ${String(formData.localTaxDetails ?? "") || null},
      ${parseInteger(formData.minimumStay)},
      ${parseInteger(formData.maximumStay)},
      ${String(formData.advanceNotice ?? "") || null},
      ${String(formData.bookingWindow ?? "") || null},
      ${String(formData.sameDayBooking ?? "") || null},
      ${String(formData.cancellationPreference ?? "") || null},
      ${String(formData.noShowPolicy ?? "") || null},
      ${String(formData.breakfastPricing ?? "") || null},
      ${parseDecimal(formData.breakfastPrice)},
      ${parseDecimal(formData.currentAverageOccupancy)},
      ${parseDecimal(formData.currentAverageDailyRate)},
      ${parseDecimal(formData.annualRevenueEstimate)},
      ${parseDecimal(formData.revenueTarget)},
      ${parseDecimal(formData.weeklyDiscount)},
      ${parseDecimal(formData.monthlyDiscount)},
      ${parseDecimal(formData.nonRefundableRate)},
      ${parseDecimal(formData.mobileRate)},
      ${parseDecimal(formData.lastMinuteDiscount)},
      ${parseDecimal(formData.earlyBookerDiscount)},
      ${String(formData.ownerBlockedDates ?? "") || null},
      ${String(formData.pricingNotes ?? "") || null},

      ${String(formData.existingListingTitle ?? "") || null},
      ${String(formData.propertySummary ?? "") || null},
      ${String(formData.uniqueSellingPoints ?? "") || null},
      ${String(formData.neighbourhoodDescription ?? "") || null},
      ${String(formData.gettingAround ?? "") || null},
      ${String(formData.nearbyAttractions ?? "") || null},
      ${String(formData.guestArrivalNotes ?? "") || null},
      ${String(formData.otherListingNotes ?? "") || null},
      ${String(formData.photoRightsConfirmed ?? "") || null},

      ${String(formData.primaryGoal ?? "") || null},
      ${String(formData.preferredStartTimeline ?? "") || null},
      ${String(formData.preferredContactMethod ?? "") || null},
      ${String(formData.bestContactTime ?? "") || null},
      ${String(formData.finalNotes ?? "") || null},
      ${String(formData.informationAccuracyConfirmed ?? "") || null},
      ${String(formData.authorizationConfirmed ?? "") || null},
      ${String(formData.listingSetupAuthorization ?? "") || null},

      ${driveFolderId},
      ${driveFolderId ? `https://drive.google.com/drive/folders/${driveFolderId}` : null},

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
      accessibility: unitAccessibility[String(clientUnitId)] ?? [],
      pricing: unitPricing[String(clientUnitId)] ?? {},
    };

    const unitPricingValues =
      unitPricing[String(clientUnitId)] ?? {};

    const unitRows = await sql`
      INSERT INTO onboarding_units (
        submission_id,
        unit_index,
        unit_name,
        unit_type,
        quantity,
        bedrooms,
        bathrooms,
        size_sqm,
        max_guests,
        max_adults,
        max_children,
        king_beds,
        queen_beds,
        double_beds,
        single_beds,
        sofa_beds,
        bunk_beds,
        kitchen,
        smoking_policy,
        amenities,
        accessibility,
        current_base_rate,
        weekend_rate,
        minimum_nightly_rate,
        extra_guest_fee,
        child_fee,
        pricing,
        unit_data
      )
      VALUES (
        ${submissionId},
        ${clientUnitId},
        ${unit.name || null},
        ${unit.type || null},
        ${parseInteger(unit.quantity) ?? 1},
        ${parseInteger(unit.bedrooms)},
        ${parseInteger(unit.bathrooms)},
        ${parseDecimal(unit.size)},
        ${parseInteger(unit.maxGuests)},
        ${parseInteger(unit.maxAdults)},
        ${parseInteger(unit.maxChildren)},
        ${parseInteger(unit.kingBeds)},
        ${parseInteger(unit.queenBeds)},
        ${parseInteger(unit.doubleBeds)},
        ${parseInteger(unit.singleBeds)},
        ${parseInteger(unit.sofaBeds)},
        ${parseInteger(unit.bunkBeds)},
        ${unit.kitchen || null},
        ${unit.smokingPolicy || null},
        ${JSON.stringify(unitAmenities[String(clientUnitId)] ?? [])}::jsonb,
        ${JSON.stringify(unitAccessibility[String(clientUnitId)] ?? [])}::jsonb,
        ${parseDecimal(unitPricingValues.currentBaseRate)},
        ${parseDecimal(unitPricingValues.weekendRate)},
        ${parseDecimal(unitPricingValues.minimumNightlyRate)},
        ${parseDecimal(unitPricingValues.extraGuestFee)},
        ${parseDecimal(unitPricingValues.childFee)},
        ${JSON.stringify(unitPricingValues)}::jsonb,
        ${JSON.stringify(unitSnapshot)}::jsonb
      )
      RETURNING id;
    `;

    databaseUnitIds.set(clientUnitId, Number(unitRows[0].id));
  }

  const unitNamesByClientId = new Map<number, string>(
    units.map((unit) => [Number(unit.id), String(unit.name ?? "")])
  );

  for (const file of uploadedFiles) {
    const databaseUnitId = file.unitClientId
      ? databaseUnitIds.get(file.unitClientId) ?? null
      : null;

    const fileGroupLabel = getFileGroupLabel(file.fileGroup);
    const fileScope = getFileScope(
      file.fileGroup,
      file.unitClientId
    );
    const fileUnitName = file.unitClientId
      ? unitNamesByClientId.get(file.unitClientId) || null
      : null;

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
        ${submissionId},
        ${databaseUnitId},
        ${file.unitClientId},
        ${fileUnitName},
        ${fileScope},
        ${file.fileGroup},
        ${fileGroupLabel},
        ${file.originalName},
        ${file.name},
        ${file.id},
        ${file.folderId},
        ${`https://drive.google.com/drive/folders/${file.folderId}`},
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
  if (selectedPropertyAccessibility.length > 0) {
    filledFields.push("Property / shared accessibility");
  }

  const unitsWithAccessibility = Object.values(unitAccessibility).filter(
    (features) => Array.isArray(features) && features.length > 0
  ).length;

  if (unitsWithAccessibility > 0) {
    filledFields.push(`Unit accessibility (${unitsWithAccessibility} unit type${unitsWithAccessibility === 1 ? "" : "s"})`);
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
    subject: `Νέο Get Started #${submissionId} από ${fullName}`,
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
      console.log("[onboarding] create-upload-batch started");

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

      console.log("[onboarding] upload batch prepared", {
        folderId: result.folderId,
        uploadCount: result.uploads.length,
      });

      return NextResponse.json(
        {
          success: true,
          ...result,
        },
        { status: 201 }
      );
    }

    if (action === "cleanup-upload-batch") {
      const folderId = String(body.folderId ?? "").trim();

      if (!folderId) {
        return NextResponse.json(
          { success: false, error: "Missing onboarding upload folder ID." },
          { status: 400 }
        );
      }

      await cleanupUploadBatch(folderId);

      return NextResponse.json({ success: true });
    }

    if (action === "submit-onboarding") {
      console.log("[onboarding] submit-onboarding started");

      const result = await submitOnboarding(body);

      console.log("[onboarding] submit-onboarding completed", {
        submissionId: result.submissionId,
        uploadedFiles: result.uploadedFiles,
        emailNotificationSent: result.emailNotificationSent,
      });

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