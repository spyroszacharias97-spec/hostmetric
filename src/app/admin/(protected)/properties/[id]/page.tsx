import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import {
  ArrowLeft,
  Building2,
  Car,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe2,
  Home,
  ImageIcon,
  KeyRound,
  MapPin,
  ReceiptText,
  Save,
  ShieldCheck,
  Star,
  Target,
  WalletCards,
  Wifi,
} from "lucide-react";

import { auth } from "@/auth";
import { getAdminDictionary } from "@/i18n/admin";
import AdminPhotoManager from "@/components/admin-photo-manager";
import {
  defaultLocale,
  type Locale,
} from "@/i18n/config";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
  }>;
};

type DbRow = Record<string, unknown>;

type PropertyRow = {
  id: number;
  contact_id: number;
  source_onboarding_submission_id: number | null;
  property_name: string | null;
  property_type: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  address: string | null;
  postal_code: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};


type ContactRow = {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
};

type UnitRow = {
  id: number;
  property_id: number;
  source_onboarding_unit_id: number | null;
  unit_name: string | null;
  unit_type: string | null;
  quantity: number;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  max_guests: number | null;
  max_adults: number | null;
  max_children: number | null;
  king_beds: number | null;
  queen_beds: number | null;
  double_beds: number | null;
  single_beds: number | null;
  sofa_beds: number | null;
  bunk_beds: number | null;
  kitchen: string | null;
  smoking_policy: string | null;
  amenities: unknown;
  accessibility: unknown;
  current_base_rate: number | null;
  weekend_rate: number | null;
  minimum_nightly_rate: number | null;
  extra_guest_fee: number | null;
  child_fee: number | null;
  notes: string | null;
};


type OnboardingFileRow = {
  id: number;
  submission_id: number;
  unit_id: number | null;
  file_group: string | null;
  original_name: string | null;
  drive_file_id: string | null;
  drive_folder_id: string | null;
  drive_url: string | null;
  mime_type: string | null;
  file_size: number | null;
  sort_order: number | null;
  created_at: string | Date | null;
  stored_name: string | null;
  file_scope: string | null;
  file_group_label: string | null;
  unit_client_id: number | null;
  unit_name: string | null;
  drive_folder_url: string | null;
};


const ADMIN_PHOTO_CATEGORIES = [
  { key: "property_exterior", label: "Exterior", scope: "property" as const },
  { key: "property_entrance", label: "Entrance", scope: "property" as const },
  { key: "property_parking", label: "Parking", scope: "property" as const },
  { key: "property_reception", label: "Reception / Lobby", scope: "property" as const },
  { key: "property_common_areas", label: "Common Areas", scope: "property" as const },
  { key: "property_pool", label: "Pool", scope: "property" as const },
  { key: "property_garden_terrace", label: "Garden / Terrace / Outdoor Areas", scope: "property" as const },
  { key: "property_restaurant_bar", label: "Restaurant / Bar", scope: "property" as const },
  { key: "property_gym_spa", label: "Gym / Spa / Wellness", scope: "property" as const },
  { key: "property_views", label: "Property Views", scope: "property" as const },

  { key: "unit_bedroom_sleeping", label: "Bedroom / Sleeping Area", scope: "unit" as const, unitOnly: true },
  { key: "unit_bathroom", label: "Bathroom", scope: "unit" as const, unitOnly: true },
  { key: "unit_kitchen", label: "Kitchen / Kitchenette", scope: "unit" as const, unitOnly: true },
  { key: "unit_living_dining", label: "Living / Dining Area", scope: "unit" as const, unitOnly: true },
  { key: "unit_balcony_terrace", label: "Balcony / Terrace / Patio", scope: "unit" as const, unitOnly: true },
  { key: "unit_private_pool", label: "Private Pool / Hot Tub", scope: "unit" as const, unitOnly: true },
  { key: "unit_views", label: "Unit Views", scope: "unit" as const, unitOnly: true },

  { key: "accessibility_parking", label: "Accessible Parking", scope: "accessibility" as const },
  { key: "accessibility_lit_path", label: "Lit Common / Arrival Path", scope: "accessibility" as const },
  { key: "accessibility_lift", label: "Lift / Elevator Access", scope: "accessibility" as const },
  { key: "accessibility_step_free_entrance", label: "Step-Free Unit Entrance", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_entrance_door_width", label: "Unit Entrance Door Width", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_bedroom_step_free", label: "Step-Free Bedroom Access", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_bathroom_step_free", label: "Step-Free Bathroom Access", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_room_door_width", label: "Bedroom / Room Door Width", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_bathroom_door_width", label: "Bathroom Door Width", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_grab_rails", label: "Bathroom Grab Rails", scope: "accessibility" as const, unitOnly: true },
  { key: "accessibility_roll_in_shower", label: "Roll-In / Step-Free Shower", scope: "accessibility" as const, unitOnly: true },

  { key: "checkin_building_entrance", label: "Building / Property Entrance", scope: "checkin" as const },
  { key: "checkin_lockbox_keypad", label: "Lockbox / Keypad / Key Collection", scope: "checkin" as const },
  { key: "checkin_route_to_unit", label: "Route from Entrance to Unit", scope: "checkin" as const },

  { key: "floor_plans", label: "Floor Plans", scope: "supporting" as const },
] as const;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function asText(value: unknown) {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function asNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatDate(value: unknown, locale: string) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(String(value));

  if (Number.isNaN(date.getTime())) return asText(value);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function humanize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function jsonValues(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") return [item];

        if (item && typeof item === "object") {
          return Object.entries(item as Record<string, unknown>)
            .filter(([, enabled]) => enabled === true || enabled === "true")
            .map(([key]) => humanize(key));
        }

        return [];
      })
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, enabled]) => enabled === true || enabled === "true")
      .map(([key]) => humanize(key));
  }

  const text = asText(value);

  if (!text) return [];

  try {
    return jsonValues(JSON.parse(text));
  } catch {
    return [text];
  }
}

function safeUrl(value: unknown) {
  const text = asText(value);

  if (!text) return null;

  try {
    const url = new URL(text);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function compactAddress(
  property: Pick<
    PropertyRow,
    "address" | "city" | "region" | "postal_code" | "country"
  >
) {
  return [
    property.address,
    property.city,
    property.region,
    property.postal_code,
    property.country,
  ]
    .filter(Boolean)
    .join(", ");
}

async function updatePropertyStatus(
  propertyId: number,
  nextStatus: "pending" | "active" | "inactive"
) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized.");
  }

  if (!Number.isInteger(propertyId) || propertyId < 1) {
    throw new Error("Invalid property ID.");
  }

  const allowedStatuses = new Set(["pending", "active", "inactive"]);

  if (!allowedStatuses.has(nextStatus)) {
    throw new Error("Invalid property status.");
  }

  const sql = getSql();

  await sql`
    UPDATE properties
    SET
      status = ${nextStatus},
      updated_at = NOW()
    WHERE id = ${propertyId};
  `;

  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath("/admin/properties");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  redirect(`/admin/properties/${propertyId}?saved=1`);
}


async function updatePropertyCore(
  propertyId: number,
  formData: FormData
) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized.");
  }

  if (!Number.isInteger(propertyId) || propertyId < 1) {
    throw new Error("Invalid property ID.");
  }

  const sql = getSql();

  const propertyName = String(formData.get("property_name") ?? "").trim() || null;
  const propertyType = String(formData.get("property_type") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const postalCode = String(formData.get("postal_code") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  await sql`
    UPDATE properties
    SET
      property_name = ${propertyName},
      property_type = ${propertyType},
      country = ${country},
      region = ${region},
      city = ${city},
      address = ${address},
      postal_code = ${postalCode},
      notes = ${notes},
      updated_at = NOW()
    WHERE id = ${propertyId};
  `;

  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath("/admin/properties");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  redirect(`/admin/properties/${propertyId}?saved=1`);
}

function formNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) return null;

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}

function formList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function updatePropertyUnit(
  propertyId: number,
  unitId: number,
  formData: FormData
) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized.");
  }

  if (
    !Number.isInteger(propertyId) ||
    propertyId < 1 ||
    !Number.isInteger(unitId) ||
    unitId < 1
  ) {
    throw new Error("Invalid property or unit ID.");
  }

  const sql = getSql();

  const unitName = String(formData.get("unit_name") ?? "").trim() || null;
  const unitType = String(formData.get("unit_type") ?? "").trim() || null;
  const quantity = Math.max(1, formNumber(formData.get("quantity")) ?? 1);
  const bedrooms = formNumber(formData.get("bedrooms"));
  const bathrooms = formNumber(formData.get("bathrooms"));
  const sizeSqm = formNumber(formData.get("size_sqm"));
  const maxGuests = formNumber(formData.get("max_guests"));
  const maxAdults = formNumber(formData.get("max_adults"));
  const maxChildren = formNumber(formData.get("max_children"));
  const kingBeds = formNumber(formData.get("king_beds"));
  const queenBeds = formNumber(formData.get("queen_beds"));
  const doubleBeds = formNumber(formData.get("double_beds"));
  const singleBeds = formNumber(formData.get("single_beds"));
  const sofaBeds = formNumber(formData.get("sofa_beds"));
  const bunkBeds = formNumber(formData.get("bunk_beds"));
  const kitchen = String(formData.get("kitchen") ?? "").trim() || null;
  const smokingPolicy =
    String(formData.get("smoking_policy") ?? "").trim() || null;
  const currentBaseRate = formNumber(formData.get("current_base_rate"));
  const weekendRate = formNumber(formData.get("weekend_rate"));
  const minimumNightlyRate = formNumber(formData.get("minimum_nightly_rate"));
  const extraGuestFee = formNumber(formData.get("extra_guest_fee"));
  const childFee = formNumber(formData.get("child_fee"));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const amenities = JSON.stringify(formList(formData.get("amenities")));
  const accessibility = JSON.stringify(formList(formData.get("accessibility")));

  await sql`
    UPDATE property_units
    SET
      unit_name = ${unitName},
      unit_type = ${unitType},
      quantity = ${quantity},
      bedrooms = ${bedrooms},
      bathrooms = ${bathrooms},
      size_sqm = ${sizeSqm},
      max_guests = ${maxGuests},
      max_adults = ${maxAdults},
      max_children = ${maxChildren},
      king_beds = ${kingBeds},
      queen_beds = ${queenBeds},
      double_beds = ${doubleBeds},
      single_beds = ${singleBeds},
      sofa_beds = ${sofaBeds},
      bunk_beds = ${bunkBeds},
      kitchen = ${kitchen},
      smoking_policy = ${smokingPolicy},
      amenities = ${amenities}::jsonb,
      accessibility = ${accessibility}::jsonb,
      current_base_rate = ${currentBaseRate},
      weekend_rate = ${weekendRate},
      minimum_nightly_rate = ${minimumNightlyRate},
      extra_guest_fee = ${extraGuestFee},
      child_fee = ${childFee},
      notes = ${notes}
    WHERE id = ${unitId}
      AND property_id = ${propertyId};
  `;

  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath("/admin/properties");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  redirect(`/admin/properties/${propertyId}?saved=1`);
}


function formText(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw.length > 0 ? raw : null;
}

function formJsonList(value: FormDataEntryValue | null) {
  return JSON.stringify(formList(value));
}

type OnboardingSection =
  | "property"
  | "distribution"
  | "operations"
  | "policies"
  | "facilities"
  | "pricing"
  | "listingContent"
  | "goals"
  | "owner"
  | "confirmations";

async function updateOnboardingSection(
  propertyId: number,
  submissionId: number,
  section: OnboardingSection,
  formData: FormData
) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized.");
  }

  if (
    !Number.isInteger(propertyId) ||
    propertyId < 1 ||
    !Number.isInteger(submissionId) ||
    submissionId < 1
  ) {
    throw new Error("Invalid property or submission ID.");
  }

  const sql = getSql();

  const ownershipCheck = await sql`
    SELECT 1
    FROM onboarding_submissions os
    INNER JOIN properties p
      ON p.contact_id = os.contact_id
    WHERE os.id = ${submissionId}
      AND p.id = ${propertyId}
    LIMIT 1;
  `;

  if (!ownershipCheck[0]) {
    throw new Error("Submission does not belong to this property.");
  }

  if (section === "property") {
    await sql`
      UPDATE onboarding_submissions
      SET
        ownership_status = ${formText(formData.get("ownership_status"))},
        accommodation_structure = ${formText(formData.get("accommodation_structure"))},
        registration_status = ${formText(formData.get("registration_status"))},
        registration_number = ${formText(formData.get("registration_number"))},
        land_registration_number = ${formText(formData.get("land_registration_number"))},
        additional_legal_number = ${formText(formData.get("additional_legal_number"))},
        listing_status = ${formText(formData.get("listing_status"))},
        currently_operating = ${formText(formData.get("currently_operating"))},
        existing_listings = ${formText(formData.get("existing_listings"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "distribution") {
    await sql`
      UPDATE onboarding_submissions
      SET
        booking_id = ${formText(formData.get("booking_id"))},
        booking_url = ${formText(formData.get("booking_url"))},
        airbnb_id = ${formText(formData.get("airbnb_id"))},
        airbnb_url = ${formText(formData.get("airbnb_url"))},
        vrbo_id = ${formText(formData.get("vrbo_id"))},
        vrbo_url = ${formText(formData.get("vrbo_url"))},
        expedia_id = ${formText(formData.get("expedia_id"))},
        expedia_url = ${formText(formData.get("expedia_url"))},
        agoda_id = ${formText(formData.get("agoda_id"))},
        agoda_url = ${formText(formData.get("agoda_url"))},
        tripcom_id = ${formText(formData.get("tripcom_id"))},
        tripcom_url = ${formText(formData.get("tripcom_url"))},
        other_platform_name = ${formText(formData.get("other_platform_name"))},
        other_platform_url = ${formText(formData.get("other_platform_url"))},
        selected_platforms = ${formJsonList(formData.get("selected_platforms"))}::jsonb,
        channel_manager_status = ${formText(formData.get("channel_manager_status"))},
        channel_manager_name = ${formText(formData.get("channel_manager_name"))},
        pms_status = ${formText(formData.get("pms_status"))},
        pms_name = ${formText(formData.get("pms_name"))},
        website_status = ${formText(formData.get("website_status"))},
        website_url = ${formText(formData.get("website_url"))},
        direct_bookings_status = ${formText(formData.get("direct_bookings_status"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "operations") {
    await sql`
      UPDATE onboarding_submissions
      SET
        check_in_from = ${formText(formData.get("check_in_from"))},
        check_in_until = ${formText(formData.get("check_in_until"))},
        check_out_from = ${formText(formData.get("check_out_from"))},
        check_out_until = ${formText(formData.get("check_out_until"))},
        check_in_method = ${formText(formData.get("check_in_method"))},
        reception_status = ${formText(formData.get("reception_status"))},
        guest_languages = ${formText(formData.get("guest_languages"))},
        advance_notice = ${formText(formData.get("advance_notice"))},
        booking_window = ${formText(formData.get("booking_window"))},
        same_day_booking = ${formText(formData.get("same_day_booking"))},
        minimum_stay = ${formNumber(formData.get("minimum_stay"))},
        maximum_stay = ${formNumber(formData.get("maximum_stay"))},
        guest_arrival_notes = ${formText(formData.get("guest_arrival_notes"))},
        owner_blocked_dates = ${formText(formData.get("owner_blocked_dates"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "policies") {
    await sql`
      UPDATE onboarding_submissions
      SET
        children_policy = ${formText(formData.get("children_policy"))},
        minimum_guest_age = ${formNumber(formData.get("minimum_guest_age"))},
        pets_policy = ${formText(formData.get("pets_policy"))},
        parties_policy = ${formText(formData.get("parties_policy"))},
        smoking_property_policy = ${formText(formData.get("smoking_property_policy"))},
        quiet_hours = ${formText(formData.get("quiet_hours"))},
        cancellation_preference = ${formText(formData.get("cancellation_preference"))},
        no_show_policy = ${formText(formData.get("no_show_policy"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "facilities") {
    await sql`
      UPDATE onboarding_submissions
      SET
        parking_details = ${formText(formData.get("parking_details"))},
        breakfast_details = ${formText(formData.get("breakfast_details"))},
        internet_details = ${formText(formData.get("internet_details"))},
        accessibility_notes = ${formText(formData.get("accessibility_notes"))},
        property_facilities = ${formJsonList(formData.get("property_facilities"))}::jsonb,
        property_accessibility = ${formJsonList(formData.get("property_accessibility"))}::jsonb,
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "pricing") {
    await sql`
      UPDATE onboarding_submissions
      SET
        currency = ${formText(formData.get("currency"))},
        cleaning_fee = ${formNumber(formData.get("cleaning_fee"))},
        cleaning_fee_type = ${formText(formData.get("cleaning_fee_type"))},
        security_deposit = ${formNumber(formData.get("security_deposit"))},
        local_tax_known = ${formText(formData.get("local_tax_known"))},
        breakfast_pricing = ${formText(formData.get("breakfast_pricing"))},
        breakfast_price = ${formNumber(formData.get("breakfast_price"))},
        current_average_occupancy = ${formNumber(formData.get("current_average_occupancy"))},
        current_average_daily_rate = ${formNumber(formData.get("current_average_daily_rate"))},
        annual_revenue_estimate = ${formNumber(formData.get("annual_revenue_estimate"))},
        revenue_target = ${formNumber(formData.get("revenue_target"))},
        weekly_discount = ${formNumber(formData.get("weekly_discount"))},
        monthly_discount = ${formNumber(formData.get("monthly_discount"))},
        non_refundable_rate = ${formNumber(formData.get("non_refundable_rate"))},
        mobile_rate = ${formNumber(formData.get("mobile_rate"))},
        last_minute_discount = ${formNumber(formData.get("last_minute_discount"))},
        early_booker_discount = ${formNumber(formData.get("early_booker_discount"))},
        local_tax_details = ${formText(formData.get("local_tax_details"))},
        pricing_notes = ${formText(formData.get("pricing_notes"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "listingContent") {
    await sql`
      UPDATE onboarding_submissions
      SET
        existing_listing_title = ${formText(formData.get("existing_listing_title"))},
        property_summary = ${formText(formData.get("property_summary"))},
        unique_selling_points = ${formText(formData.get("unique_selling_points"))},
        neighbourhood_description = ${formText(formData.get("neighbourhood_description"))},
        getting_around = ${formText(formData.get("getting_around"))},
        nearby_attractions = ${formText(formData.get("nearby_attractions"))},
        other_listing_notes = ${formText(formData.get("other_listing_notes"))},
        photo_rights_confirmed = ${formText(formData.get("photo_rights_confirmed"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "goals") {
    await sql`
      UPDATE onboarding_submissions
      SET
        primary_goal = ${formText(formData.get("primary_goal"))},
        preferred_start_timeline = ${formText(formData.get("preferred_start_timeline"))},
        preferred_contact_method = ${formText(formData.get("preferred_contact_method"))},
        best_contact_time = ${formText(formData.get("best_contact_time"))},
        final_notes = ${formText(formData.get("final_notes"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "owner") {
    await sql`
      UPDATE onboarding_submissions
      SET
        owner_type = ${formText(formData.get("owner_type"))},
        first_name = ${formText(formData.get("first_name"))},
        last_name = ${formText(formData.get("last_name"))},
        email = ${formText(formData.get("email"))},
        phone = ${formText(formData.get("phone"))},
        country_of_residence = ${formText(formData.get("country_of_residence"))},
        birth_date = ${formText(formData.get("birth_date"))},
        home_address = ${formText(formData.get("home_address"))},
        home_city = ${formText(formData.get("home_city"))},
        home_postal_code = ${formText(formData.get("home_postal_code"))},
        business_name = ${formText(formData.get("business_name"))},
        business_registration_number = ${formText(formData.get("business_registration_number"))},
        vat_number = ${formText(formData.get("vat_number"))},
        tax_id = ${formText(formData.get("tax_id"))},
        business_address = ${formText(formData.get("business_address"))},
        business_city = ${formText(formData.get("business_city"))},
        business_postal_code = ${formText(formData.get("business_postal_code"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  if (section === "confirmations") {
    await sql`
      UPDATE onboarding_submissions
      SET
        information_accuracy_confirmed = ${formText(formData.get("information_accuracy_confirmed"))},
        authorization_confirmed = ${formText(formData.get("authorization_confirmed"))},
        listing_setup_authorization = ${formText(formData.get("listing_setup_authorization"))},
        status = ${formText(formData.get("status"))},
        updated_at = NOW()
      WHERE id = ${submissionId};
    `;
  }

  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath("/admin/properties");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  redirect(`/admin/properties/${propertyId}?saved=1`);
}

function AdminInput({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string | number | null | undefined;
  type?: "text" | "number";
}) {
  return (
    <label className="block rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>

      <input
        name={name}
        type={type}
        step={type === "number" ? "any" : undefined}
        defaultValue={defaultValue ?? ""}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function AdminTextarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string | null | undefined;
}) {
  return (
    <label className="block rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>

      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={3}
        className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

async function getProperty(id: number) {
  const sql = getSql();

  const propertyRows = await sql`
    SELECT
      id,
      contact_id,
      source_onboarding_submission_id,
      property_name,
      property_type,
      country,
      city,
      region,
      address,
      postal_code,
      status,
      notes,
      created_at,
      updated_at
    FROM properties
    WHERE id = ${id}
    LIMIT 1;
  `;

  if (!propertyRows[0]) {
    return null;
  }

  const row = propertyRows[0] as DbRow;

  const property: PropertyRow = {
    id: Number(row.id),
    contact_id: Number(row.contact_id),
    source_onboarding_submission_id:
      row.source_onboarding_submission_id === null ||
      row.source_onboarding_submission_id === undefined
        ? null
        : Number(row.source_onboarding_submission_id),
    property_name: asText(row.property_name),
    property_type: asText(row.property_type),
    country: asText(row.country),
    city: asText(row.city),
    region: asText(row.region),
    address: asText(row.address),
    postal_code: asText(row.postal_code),
    status: asText(row.status),
    notes: asText(row.notes),
    created_at: (row.created_at as string | Date | null) ?? null,
    updated_at: (row.updated_at as string | Date | null) ?? null,
  };

  const unitRows = await sql`
    SELECT
      id,
      property_id,
      source_onboarding_unit_id,
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
      notes
    FROM property_units
    WHERE property_id = ${id}
    ORDER BY id ASC;
  `;

  const units = unitRows.map((unitRow) => {
    const unit = unitRow as DbRow;

    return {
      id: Number(unit.id),
      property_id: Number(unit.property_id),
      source_onboarding_unit_id:
        unit.source_onboarding_unit_id === null ||
        unit.source_onboarding_unit_id === undefined
          ? null
          : Number(unit.source_onboarding_unit_id),
      unit_name: asText(unit.unit_name),
      unit_type: asText(unit.unit_type),
      quantity: Math.max(1, Number(unit.quantity ?? 1)),
      bedrooms: asNumber(unit.bedrooms),
      bathrooms: asNumber(unit.bathrooms),
      size_sqm: asNumber(unit.size_sqm),
      max_guests: asNumber(unit.max_guests),
      max_adults: asNumber(unit.max_adults),
      max_children: asNumber(unit.max_children),
      king_beds: asNumber(unit.king_beds),
      queen_beds: asNumber(unit.queen_beds),
      double_beds: asNumber(unit.double_beds),
      single_beds: asNumber(unit.single_beds),
      sofa_beds: asNumber(unit.sofa_beds),
      bunk_beds: asNumber(unit.bunk_beds),
      kitchen: asText(unit.kitchen),
      smoking_policy: asText(unit.smoking_policy),
      amenities: unit.amenities,
      accessibility: unit.accessibility,
      current_base_rate: asNumber(unit.current_base_rate),
      weekend_rate: asNumber(unit.weekend_rate),
      minimum_nightly_rate: asNumber(unit.minimum_nightly_rate),
      extra_guest_fee: asNumber(unit.extra_guest_fee),
      child_fee: asNumber(unit.child_fee),
      notes: asText(unit.notes),
    } satisfies UnitRow;
  });

  const contactRows = await sql`
    SELECT
      id,
      full_name,
      email,
      phone
    FROM contacts
    WHERE id = ${property.contact_id}
    LIMIT 1;
  `;

  const contactRow = contactRows[0] as DbRow | undefined;

  const contact: ContactRow | null = contactRow
    ? {
        id: Number(contactRow.id),
        full_name: asText(contactRow.full_name),
        email: String(contactRow.email),
        phone: asText(contactRow.phone),
      }
    : null;

  let onboarding: DbRow | null = null;

  if (property.source_onboarding_submission_id) {
    const onboardingRows = await sql`
      SELECT *
      FROM onboarding_submissions
      WHERE id = ${property.source_onboarding_submission_id}
      LIMIT 1;
    `;

    onboarding = (onboardingRows[0] as DbRow | undefined) ?? null;
  }

  if (!onboarding) {
    const onboardingRows = await sql`
      SELECT *
      FROM onboarding_submissions
      WHERE contact_id = ${property.contact_id}
      ORDER BY created_at DESC NULLS LAST, id DESC
      LIMIT 1;
    `;

    onboarding = (onboardingRows[0] as DbRow | undefined) ?? null;
  }


  let files: OnboardingFileRow[] = [];

  /*
   * PHOTO SOURCE RESOLUTION
   * -----------------------
   * Prefer the exact onboarding submission linked to the property.
   * If that submission has no files (common in old/test records), fall back
   * to the most recent submission for this client that actually HAS files.
   * This restores the photos that were visible before without reading the
   * Google Drive folder directly.
   */
  let photoSubmissionId =
    onboarding?.id
      ? Number(onboarding.id)
      : null;

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
        WHERE os.contact_id = ${property.contact_id}
          AND EXISTS (
            SELECT 1
            FROM onboarding_files f
            WHERE f.submission_id = os.id
          )
        ORDER BY
          CASE
            WHEN LOWER(TRIM(COALESCE(os.property_name, ''))) =
                 LOWER(TRIM(COALESCE(${property.property_name}, '')))
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
      WHERE os.contact_id = ${property.contact_id}
        AND EXISTS (
          SELECT 1
          FROM onboarding_files f
          WHERE f.submission_id = os.id
        )
      ORDER BY
        CASE
          WHEN LOWER(TRIM(COALESCE(os.property_name, ''))) =
               LOWER(TRIM(COALESCE(${property.property_name}, '')))
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

  if (photoSubmissionId) {
    const fileRows = await sql`
      SELECT
        id,
        submission_id,
        unit_id,
        file_group,
        original_name,
        drive_file_id,
        drive_folder_id,
        drive_url,
        mime_type,
        file_size,
        sort_order,
        created_at,
        stored_name,
        file_scope,
        file_group_label,
        unit_client_id,
        unit_name,
        drive_folder_url
      FROM onboarding_files
      WHERE submission_id = ${photoSubmissionId}
      ORDER BY
        file_scope ASC NULLS LAST,
        unit_client_id ASC NULLS LAST,
        sort_order ASC NULLS LAST,
        id ASC;
    `;

    files = fileRows.map((fileRow) => {
      const file = fileRow as DbRow;

      return {
        id: Number(file.id),
        submission_id: Number(file.submission_id),
        unit_id:
          file.unit_id === null || file.unit_id === undefined
            ? null
            : Number(file.unit_id),
        file_group: asText(file.file_group),
        original_name: asText(file.original_name),
        drive_file_id: asText(file.drive_file_id),
        drive_folder_id: asText(file.drive_folder_id),
        drive_url: asText(file.drive_url),
        mime_type: asText(file.mime_type),
        file_size: asNumber(file.file_size),
        sort_order: asNumber(file.sort_order),
        created_at: (file.created_at as string | Date | null) ?? null,
        stored_name: asText(file.stored_name),
        file_scope: asText(file.file_scope),
        file_group_label: asText(file.file_group_label),
        unit_client_id:
          file.unit_client_id === null || file.unit_client_id === undefined
            ? null
            : Number(file.unit_client_id),
        unit_name: asText(file.unit_name),
        drive_folder_url: asText(file.drive_folder_url),
      } satisfies OnboardingFileRow;
    });
  }

  return {
    property,
    units,
    onboarding,
    contact,
    files,
  };
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === false
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <div className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
        {value}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>

          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ExternalUrl({
  href,
  label,
}: {
  href: string | null;
  label: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
    >
      {label}
      <ExternalLink size={14} />
    </a>
  );
}


function FileLinkCard({
  file,
}: {
  file: OnboardingFileRow;
}) {
  const href = safeUrl(file.drive_url);

  if (!href) {
    return null;
  }

  const label =
    file.original_name ||
    file.stored_name ||
    file.file_group_label ||
    file.file_group ||
    `File ${file.id}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-900">
          {label}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-400">
          {file.file_group_label || file.file_group || file.file_scope || "File"}
        </p>
      </div>

      <ExternalLink
        size={15}
        className="shrink-0 text-blue-600 transition-transform group-hover:translate-x-0.5"
      />
    </a>
  );
}

export default async function PropertyDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const savedSuccessfully = resolvedSearchParams.saved === "1";
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId < 1) {
    notFound();
  }

  /*
   * Keep this page dictionary-driven.
   * Change this locale source later if the admin console gets its own
   * persisted language selector.
   */
  const locale: Locale = defaultLocale;
  const dictionary = await getAdminDictionary(locale);
  const d = dictionary.propertyDetails;

  const result = await getProperty(propertyId);

  if (!result) {
    notFound();
  }

  const { property, units, onboarding, contact, files } = result;

  const value = (key: string) => onboarding?.[key] ?? null;
  const text = (key: string) => asText(value(key));
  const number = (key: string) => asNumber(value(key));

  const currency = text("currency");

  const propertyName =
    property.property_name ||
    text("property_name") ||
    d.fallback.unnamedProperty;

  const propertyType =
    property.property_type ||
    text("property_type") ||
    d.fallback.noValue;

  const currentStatus =
    property.status === "active" ||
    property.status === "inactive" ||
    property.status === "pending"
      ? property.status
      : "pending";

  const statusLabel =
    currentStatus === "active"
      ? d.status.active
      : currentStatus === "inactive"
        ? d.status.inactive
        : d.status.pending;

  const statusClassName =
    currentStatus === "active"
      ? "bg-emerald-50 text-emerald-700"
      : currentStatus === "inactive"
        ? "bg-slate-100 text-slate-700"
        : "bg-amber-50 text-amber-700";

  const address = compactAddress(property);

  const physicalProperties = units.reduce(
    (sum, unit) => sum + Math.max(1, unit.quantity),
    0
  );

  const propertyAmenities = jsonValues(value("property_facilities"));
  const propertyAccessibility = jsonValues(value("property_accessibility"));
  const selectedPlatforms = jsonValues(value("selected_platforms"));

  const driveFolderUrl = safeUrl(value("drive_folder_url"));
  const onboardingId = onboarding?.id ? Number(onboarding.id) : null;

  const generalFiles = files.filter(
    (file) => file.unit_id === null
  );

  const links = [
    ["Website", safeUrl(value("website_url"))],
    ["Booking.com", safeUrl(value("booking_url"))],
    ["Airbnb", safeUrl(value("airbnb_url"))],
    ["Vrbo", safeUrl(value("vrbo_url"))],
    ["Expedia", safeUrl(value("expedia_url"))],
    ["Agoda", safeUrl(value("agoda_url"))],
    ["Trip.com", safeUrl(value("tripcom_url"))],
    ["Tripadvisor", safeUrl(value("tripadvisor_url"))],
    [text("other_platform_name") || d.labels.otherPlatform, safeUrl(value("other_platform_url"))],
  ] as const;

  const hasAnyExternalLink = links.some(([, href]) => Boolean(href));

  return (
    <div className="pb-12">

      {savedSuccessfully ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm">
          <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-black">Οι αλλαγές αποθηκεύτηκαν επιτυχώς</p>
            <p className="mt-0.5 text-sm font-semibold text-emerald-700">
              Τα ενημερωμένα στοιχεία έχουν αποθηκευτεί.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link
            href={`/admin/leads/${property.contact_id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            {d.actions.backToClient}
          </Link>

          <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-blue-600">
            {d.eyebrow}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {propertyName}
            </h1>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClassName}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Building2 size={16} />
              {propertyType}
            </span>

            {address ? (
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                {address}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentStatus !== "active" ? (
            <form
              action={updatePropertyStatus.bind(null, property.id, "active")}
            >
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={17} />
                {d.actions.activateProperty}
              </button>
            </form>
          ) : (
            <form
              action={updatePropertyStatus.bind(null, property.id, "inactive")}
            >
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ShieldCheck size={17} />
                {d.actions.deactivateProperty}
              </button>
            </form>
          )}
        </div>
      </div>

      {contact ? (
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-500">
                {d.client.ownerLabel}
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-950">
                {contact.full_name || contact.email}
              </h2>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                <span>{contact.email}</span>
                {contact.phone ? <span>{contact.phone}</span> : null}
              </div>
            </div>

            <Link
              href={`/admin/leads/${contact.id}`}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-black text-blue-700 transition hover:bg-blue-50"
            >
              {d.client.openClient}
              <ExternalLink size={14} />
            </Link>
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            label: d.stats.units,
            value: units.length,
            icon: <Home size={19} />,
          },
          {
            label: d.stats.totalUnits,
            value: physicalProperties,
            icon: <Building2 size={19} />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {stat.icon}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6">
        <Section
          icon={<Building2 size={19} />}
          title={d.sections.property.title}
          description={d.sections.property.description}
        >
          <form action={updatePropertyCore.bind(null, property.id)}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <AdminInput
                label={d.labels.propertyName}
                name="property_name"
                defaultValue={property.property_name}
              />
              <AdminInput
                label={d.labels.propertyType}
                name="property_type"
                defaultValue={property.property_type}
              />
              <AdminInput
                label={d.labels.country}
                name="country"
                defaultValue={property.country}
              />
              <AdminInput
                label={d.labels.region}
                name="region"
                defaultValue={property.region}
              />
              <AdminInput
                label={d.labels.city}
                name="city"
                defaultValue={property.city}
              />
              <AdminInput
                label={d.labels.address}
                name="address"
                defaultValue={property.address}
              />
              <AdminInput
                label={d.labels.postalCode}
                name="postal_code"
                defaultValue={property.postal_code}
              />
            </div>

            <div className="mt-4">
              <AdminTextarea
                label={d.labels.internalNotes}
                name="notes"
                defaultValue={property.notes}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
              >
                <Save size={16} />
                {d.actions.saveChanges}
              </button>
            </div>
          </form>

          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "property"
              )}
              className="mt-6 border-t border-slate-100 pt-6"
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.ownershipStatus} name="ownership_status" defaultValue={text("ownership_status")} />
                <AdminInput label={d.labels.accommodationStructure} name="accommodation_structure" defaultValue={text("accommodation_structure")} />
                <AdminInput label={d.labels.registrationStatus} name="registration_status" defaultValue={text("registration_status")} />
                <AdminInput label={d.labels.registrationNumber} name="registration_number" defaultValue={text("registration_number")} />
                <AdminInput label={d.labels.landRegistrationNumber} name="land_registration_number" defaultValue={text("land_registration_number")} />
                <AdminInput label={d.labels.additionalLegalNumber} name="additional_legal_number" defaultValue={text("additional_legal_number")} />
                <AdminInput label={d.labels.listingStatus} name="listing_status" defaultValue={text("listing_status")} />
                <AdminInput label={d.labels.currentlyOperating} name="currently_operating" defaultValue={text("currently_operating")} />
                <AdminInput label={d.labels.existingListings} name="existing_listings" defaultValue={text("existing_listings")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : null}
        </Section>

        <Section
          icon={<Home size={19} />}
          title={d.sections.units.title}
          description={d.sections.units.description}
        >
          {units.length === 0 ? (
            <p className="text-sm text-slate-500">{d.fallback.noUnits}</p>
          ) : (
            <div className="grid gap-4">
              {units.map((unit) => {
                const amenities = jsonValues(unit.amenities);
                const accessibility = jsonValues(unit.accessibility);

                return (
                  <form
                    key={unit.id}
                    action={updatePropertyUnit.bind(
                      null,
                      property.id,
                      unit.id
                    )}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                  >
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <AdminInput
                        label={d.labels.unitName}
                        name="unit_name"
                        defaultValue={unit.unit_name}
                      />
                      <AdminInput
                        label={d.labels.unitType}
                        name="unit_type"
                        defaultValue={unit.unit_type}
                      />
                      <AdminInput
                        label={d.labels.quantity}
                        name="quantity"
                        type="number"
                        defaultValue={unit.quantity}
                      />
                      <AdminInput
                        label={d.labels.sizeSqm}
                        name="size_sqm"
                        type="number"
                        defaultValue={unit.size_sqm}
                      />
                      <AdminInput
                        label={d.labels.bedrooms}
                        name="bedrooms"
                        type="number"
                        defaultValue={unit.bedrooms}
                      />
                      <AdminInput
                        label={d.labels.bathrooms}
                        name="bathrooms"
                        type="number"
                        defaultValue={unit.bathrooms}
                      />
                      <AdminInput
                        label={d.labels.maxGuests}
                        name="max_guests"
                        type="number"
                        defaultValue={unit.max_guests}
                      />
                      <AdminInput
                        label={d.labels.maxAdults}
                        name="max_adults"
                        type="number"
                        defaultValue={unit.max_adults}
                      />
                      <AdminInput
                        label={d.labels.maxChildren}
                        name="max_children"
                        type="number"
                        defaultValue={unit.max_children}
                      />
                      <AdminInput
                        label={d.labels.kingBeds}
                        name="king_beds"
                        type="number"
                        defaultValue={unit.king_beds}
                      />
                      <AdminInput
                        label={d.labels.queenBeds}
                        name="queen_beds"
                        type="number"
                        defaultValue={unit.queen_beds}
                      />
                      <AdminInput
                        label={d.labels.doubleBeds}
                        name="double_beds"
                        type="number"
                        defaultValue={unit.double_beds}
                      />
                      <AdminInput
                        label={d.labels.singleBeds}
                        name="single_beds"
                        type="number"
                        defaultValue={unit.single_beds}
                      />
                      <AdminInput
                        label={d.labels.sofaBeds}
                        name="sofa_beds"
                        type="number"
                        defaultValue={unit.sofa_beds}
                      />
                      <AdminInput
                        label={d.labels.bunkBeds}
                        name="bunk_beds"
                        type="number"
                        defaultValue={unit.bunk_beds}
                      />
                      <AdminInput
                        label={d.labels.kitchen}
                        name="kitchen"
                        defaultValue={unit.kitchen}
                      />
                      <AdminInput
                        label={d.labels.smokingPolicy}
                        name="smoking_policy"
                        defaultValue={unit.smoking_policy}
                      />
                      <AdminInput
                        label={d.labels.amenities}
                        name="amenities"
                        defaultValue={amenities.join(", ")}
                      />
                      <AdminInput
                        label={d.labels.accessibility}
                        name="accessibility"
                        defaultValue={accessibility.join(", ")}
                      />
                      <AdminInput
                        label={d.labels.currentBaseRate}
                        name="current_base_rate"
                        type="number"
                        defaultValue={unit.current_base_rate}
                      />
                      <AdminInput
                        label={d.labels.weekendRate}
                        name="weekend_rate"
                        type="number"
                        defaultValue={unit.weekend_rate}
                      />
                      <AdminInput
                        label={d.labels.minimumNightlyRate}
                        name="minimum_nightly_rate"
                        type="number"
                        defaultValue={unit.minimum_nightly_rate}
                      />
                      <AdminInput
                        label={d.labels.extraGuestFee}
                        name="extra_guest_fee"
                        type="number"
                        defaultValue={unit.extra_guest_fee}
                      />
                      <AdminInput
                        label={d.labels.childFee}
                        name="child_fee"
                        type="number"
                        defaultValue={unit.child_fee}
                      />
                    </div>

                    <div className="mt-4">
                      <AdminTextarea
                        label={d.labels.notes}
                        name="notes"
                        defaultValue={unit.notes}
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        <Save size={16} />
                        {d.actions.saveUnit}
                      </button>
                    </div>
                  </form>
                );
              })}
            </div>
          )}
        </Section>

        <Section
          icon={<Globe2 size={19} />}
          title={d.sections.distribution.title}
          description={d.sections.distribution.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "distribution"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.bookingId} name="booking_id" defaultValue={text("booking_id")} />
                <AdminInput label={d.labels.bookingUrl} name="booking_url" defaultValue={text("booking_url")} />
                <AdminInput label={d.labels.airbnbId} name="airbnb_id" defaultValue={text("airbnb_id")} />
                <AdminInput label={d.labels.airbnbUrl} name="airbnb_url" defaultValue={text("airbnb_url")} />
                <AdminInput label={d.labels.vrboId} name="vrbo_id" defaultValue={text("vrbo_id")} />
                <AdminInput label={d.labels.vrboUrl} name="vrbo_url" defaultValue={text("vrbo_url")} />
                <AdminInput label={d.labels.expediaId} name="expedia_id" defaultValue={text("expedia_id")} />
                <AdminInput label={d.labels.expediaUrl} name="expedia_url" defaultValue={text("expedia_url")} />
                <AdminInput label={d.labels.agodaId} name="agoda_id" defaultValue={text("agoda_id")} />
                <AdminInput label={d.labels.agodaUrl} name="agoda_url" defaultValue={text("agoda_url")} />
                <AdminInput label={d.labels.tripcomId} name="tripcom_id" defaultValue={text("tripcom_id")} />
                <AdminInput label={d.labels.tripcomUrl} name="tripcom_url" defaultValue={text("tripcom_url")} />
                <AdminInput label={d.labels.otherPlatform} name="other_platform_name" defaultValue={text("other_platform_name")} />
                <AdminInput label={d.labels.otherPlatformUrl} name="other_platform_url" defaultValue={text("other_platform_url")} />
                <AdminInput
                  label={d.labels.selectedPlatforms}
                  name="selected_platforms"
                  defaultValue={selectedPlatforms.join(", ")}
                />
                <AdminInput label={d.labels.channelManagerStatus} name="channel_manager_status" defaultValue={text("channel_manager_status")} />
                <AdminInput label={d.labels.channelManagerName} name="channel_manager_name" defaultValue={text("channel_manager_name")} />
                <AdminInput label={d.labels.pmsStatus} name="pms_status" defaultValue={text("pms_status")} />
                <AdminInput label={d.labels.pmsName} name="pms_name" defaultValue={text("pms_name")} />
                <AdminInput label={d.labels.websiteStatus} name="website_status" defaultValue={text("website_status")} />
                <AdminInput label={d.labels.websiteUrl} name="website_url" defaultValue={text("website_url")} />
                <AdminInput label={d.labels.directBookingsStatus} name="direct_bookings_status" defaultValue={text("direct_bookings_status")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}

          {hasAnyExternalLink ? (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
              {links.map(([label, href]) => (
                <ExternalUrl key={label} label={label} href={href} />
              ))}
            </div>
          ) : null}
        </Section>

        <Section
          icon={<KeyRound size={19} />}
          title={d.sections.operations.title}
          description={d.sections.operations.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "operations"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.checkInFrom} name="check_in_from" defaultValue={text("check_in_from")} />
                <AdminInput label={d.labels.checkInUntil} name="check_in_until" defaultValue={text("check_in_until")} />
                <AdminInput label={d.labels.checkOutFrom} name="check_out_from" defaultValue={text("check_out_from")} />
                <AdminInput label={d.labels.checkOutUntil} name="check_out_until" defaultValue={text("check_out_until")} />
                <AdminInput label={d.labels.checkInMethod} name="check_in_method" defaultValue={text("check_in_method")} />
                <AdminInput label={d.labels.receptionStatus} name="reception_status" defaultValue={text("reception_status")} />
                <AdminInput label={d.labels.guestLanguages} name="guest_languages" defaultValue={text("guest_languages")} />
                <AdminInput label={d.labels.advanceNotice} name="advance_notice" defaultValue={text("advance_notice")} />
                <AdminInput label={d.labels.bookingWindow} name="booking_window" defaultValue={text("booking_window")} />
                <AdminInput label={d.labels.sameDayBooking} name="same_day_booking" defaultValue={text("same_day_booking")} />
                <AdminInput label={d.labels.minimumStay} name="minimum_stay" type="number" defaultValue={number("minimum_stay")} />
                <AdminInput label={d.labels.maximumStay} name="maximum_stay" type="number" defaultValue={number("maximum_stay")} />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <AdminTextarea label={d.labels.guestArrivalNotes} name="guest_arrival_notes" defaultValue={text("guest_arrival_notes")} />
                <AdminTextarea label={d.labels.ownerBlockedDates} name="owner_blocked_dates" defaultValue={text("owner_blocked_dates")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<ShieldCheck size={19} />}
          title={d.sections.policies.title}
          description={d.sections.policies.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "policies"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.childrenPolicy} name="children_policy" defaultValue={text("children_policy")} />
                <AdminInput label={d.labels.minimumGuestAge} name="minimum_guest_age" type="number" defaultValue={number("minimum_guest_age")} />
                <AdminInput label={d.labels.petsPolicy} name="pets_policy" defaultValue={text("pets_policy")} />
                <AdminInput label={d.labels.partiesPolicy} name="parties_policy" defaultValue={text("parties_policy")} />
                <AdminInput label={d.labels.smokingPropertyPolicy} name="smoking_property_policy" defaultValue={text("smoking_property_policy")} />
                <AdminInput label={d.labels.quietHours} name="quiet_hours" defaultValue={text("quiet_hours")} />
                <AdminInput label={d.labels.cancellationPreference} name="cancellation_preference" defaultValue={text("cancellation_preference")} />
                <AdminInput label={d.labels.noShowPolicy} name="no_show_policy" defaultValue={text("no_show_policy")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<Wifi size={19} />}
          title={d.sections.facilities.title}
          description={d.sections.facilities.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "facilities"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <AdminTextarea label={d.labels.parkingDetails} name="parking_details" defaultValue={text("parking_details")} />
                <AdminTextarea label={d.labels.breakfastDetails} name="breakfast_details" defaultValue={text("breakfast_details")} />
                <AdminTextarea label={d.labels.internetDetails} name="internet_details" defaultValue={text("internet_details")} />
                <AdminTextarea label={d.labels.accessibilityNotes} name="accessibility_notes" defaultValue={text("accessibility_notes")} />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <AdminInput
                  label={d.labels.propertyFacilities}
                  name="property_facilities"
                  defaultValue={propertyAmenities.join(", ")}
                />
                <AdminInput
                  label={d.labels.propertyAccessibility}
                  name="property_accessibility"
                  defaultValue={propertyAccessibility.join(", ")}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<WalletCards size={19} />}
          title={d.sections.pricing.title}
          description={d.sections.pricing.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "pricing"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.currency} name="currency" defaultValue={currency} />
                <AdminInput label={d.labels.cleaningFee} name="cleaning_fee" type="number" defaultValue={number("cleaning_fee")} />
                <AdminInput label={d.labels.cleaningFeeType} name="cleaning_fee_type" defaultValue={text("cleaning_fee_type")} />
                <AdminInput label={d.labels.securityDeposit} name="security_deposit" type="number" defaultValue={number("security_deposit")} />
                <AdminInput label={d.labels.localTaxKnown} name="local_tax_known" defaultValue={text("local_tax_known")} />
                <AdminInput label={d.labels.breakfastPricing} name="breakfast_pricing" defaultValue={text("breakfast_pricing")} />
                <AdminInput label={d.labels.breakfastPrice} name="breakfast_price" type="number" defaultValue={number("breakfast_price")} />
                <AdminInput label={d.labels.currentAverageOccupancy} name="current_average_occupancy" type="number" defaultValue={number("current_average_occupancy")} />
                <AdminInput label={d.labels.currentAverageDailyRate} name="current_average_daily_rate" type="number" defaultValue={number("current_average_daily_rate")} />
                <AdminInput label={d.labels.annualRevenueEstimate} name="annual_revenue_estimate" type="number" defaultValue={number("annual_revenue_estimate")} />
                <AdminInput label={d.labels.revenueTarget} name="revenue_target" type="number" defaultValue={number("revenue_target")} />
                <AdminInput label={d.labels.weeklyDiscount} name="weekly_discount" type="number" defaultValue={number("weekly_discount")} />
                <AdminInput label={d.labels.monthlyDiscount} name="monthly_discount" type="number" defaultValue={number("monthly_discount")} />
                <AdminInput label={d.labels.nonRefundableRate} name="non_refundable_rate" type="number" defaultValue={number("non_refundable_rate")} />
                <AdminInput label={d.labels.mobileRate} name="mobile_rate" type="number" defaultValue={number("mobile_rate")} />
                <AdminInput label={d.labels.lastMinuteDiscount} name="last_minute_discount" type="number" defaultValue={number("last_minute_discount")} />
                <AdminInput label={d.labels.earlyBookerDiscount} name="early_booker_discount" type="number" defaultValue={number("early_booker_discount")} />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <AdminTextarea label={d.labels.localTaxDetails} name="local_tax_details" defaultValue={text("local_tax_details")} />
                <AdminTextarea label={d.labels.pricingNotes} name="pricing_notes" defaultValue={text("pricing_notes")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<Star size={19} />}
          title={d.sections.listingContent.title}
          description={d.sections.listingContent.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "listingContent"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <AdminInput label={d.labels.existingListingTitle} name="existing_listing_title" defaultValue={text("existing_listing_title")} />
                <AdminTextarea label={d.labels.propertySummary} name="property_summary" defaultValue={text("property_summary")} />
                <AdminTextarea label={d.labels.uniqueSellingPoints} name="unique_selling_points" defaultValue={text("unique_selling_points")} />
                <AdminTextarea label={d.labels.neighbourhoodDescription} name="neighbourhood_description" defaultValue={text("neighbourhood_description")} />
                <AdminTextarea label={d.labels.gettingAround} name="getting_around" defaultValue={text("getting_around")} />
                <AdminTextarea label={d.labels.nearbyAttractions} name="nearby_attractions" defaultValue={text("nearby_attractions")} />
                <AdminTextarea label={d.labels.otherListingNotes} name="other_listing_notes" defaultValue={text("other_listing_notes")} />
                <AdminInput label={d.labels.photoRightsConfirmed} name="photo_rights_confirmed" defaultValue={text("photo_rights_confirmed")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<Target size={19} />}
          title={d.sections.goals.title}
          description={d.sections.goals.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "goals"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.primaryGoal} name="primary_goal" defaultValue={text("primary_goal")} />
                <AdminInput label={d.labels.preferredStartTimeline} name="preferred_start_timeline" defaultValue={text("preferred_start_timeline")} />
                <AdminInput label={d.labels.preferredContactMethod} name="preferred_contact_method" defaultValue={text("preferred_contact_method")} />
                <AdminInput label={d.labels.bestContactTime} name="best_contact_time" defaultValue={text("best_contact_time")} />
              </div>

              <div className="mt-4">
                <AdminTextarea label={d.labels.finalNotes} name="final_notes" defaultValue={text("final_notes")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<ReceiptText size={19} />}
          title={d.sections.owner.title}
          description={d.sections.owner.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "owner"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.ownerType} name="owner_type" defaultValue={text("owner_type")} />
                <AdminInput label={d.labels.firstName} name="first_name" defaultValue={text("first_name")} />
                <AdminInput label={d.labels.lastName} name="last_name" defaultValue={text("last_name")} />
                <AdminInput label={d.labels.email} name="email" defaultValue={text("email")} />
                <AdminInput label={d.labels.phone} name="phone" defaultValue={text("phone")} />
                <AdminInput label={d.labels.countryOfResidence} name="country_of_residence" defaultValue={text("country_of_residence")} />
                <AdminInput label={d.labels.birthDate} name="birth_date" defaultValue={text("birth_date")} />
                <AdminInput label={d.labels.homeAddress} name="home_address" defaultValue={text("home_address")} />
                <AdminInput label={d.labels.homeCity} name="home_city" defaultValue={text("home_city")} />
                <AdminInput label={d.labels.homePostalCode} name="home_postal_code" defaultValue={text("home_postal_code")} />
                <AdminInput label={d.labels.businessName} name="business_name" defaultValue={text("business_name")} />
                <AdminInput label={d.labels.businessRegistrationNumber} name="business_registration_number" defaultValue={text("business_registration_number")} />
                <AdminInput label={d.labels.vatNumber} name="vat_number" defaultValue={text("vat_number")} />
                <AdminInput label={d.labels.taxId} name="tax_id" defaultValue={text("tax_id")} />
                <AdminInput label={d.labels.businessAddress} name="business_address" defaultValue={text("business_address")} />
                <AdminInput label={d.labels.businessCity} name="business_city" defaultValue={text("business_city")} />
                <AdminInput label={d.labels.businessPostalCode} name="business_postal_code" defaultValue={text("business_postal_code")} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<CheckCircle2 size={19} />}
          title={d.sections.confirmations.title}
          description={d.sections.confirmations.description}
        >
          {onboardingId ? (
            <form
              action={updateOnboardingSection.bind(
                null,
                property.id,
                onboardingId,
                "confirmations"
              )}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <AdminInput label={d.labels.informationAccuracyConfirmed} name="information_accuracy_confirmed" defaultValue={text("information_accuracy_confirmed")} />
                <AdminInput label={d.labels.authorizationConfirmed} name="authorization_confirmed" defaultValue={text("authorization_confirmed")} />
                <AdminInput label={d.labels.listingSetupAuthorization} name="listing_setup_authorization" defaultValue={text("listing_setup_authorization")} />
                <AdminInput label={d.labels.submissionStatus} name="status" defaultValue={text("status")} />
                <DetailItem label={d.labels.createdAt} value={formatDate(value("created_at"), dictionary.common.dateLocale)} />
                <DetailItem label={d.labels.updatedAt} value={formatDate(value("updated_at"), dictionary.common.dateLocale)} />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  {d.actions.saveChanges}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500">{d.fallback.noValue}</p>
          )}
        </Section>

        <Section
          icon={<ImageIcon size={19} />}
          title={d.sections.photos.title}
          description={d.sections.photos.description}
        >
          <AdminPhotoManager
            propertyId={property.id}
            files={files.map((file) => ({
              id: file.id,
              originalName: file.original_name,
              storedName: file.stored_name,
              driveUrl: file.drive_url,
              mimeType: file.mime_type,
              fileSize: file.file_size,
              sortOrder: file.sort_order,
              createdAt: file.created_at
                ? new Date(file.created_at).toISOString()
                : null,
              fileScope: file.file_scope,
              fileGroup: file.file_group,
              fileGroupLabel: file.file_group_label,
              unitId: file.unit_id,
              unitClientId: file.unit_client_id,
              unitName: file.unit_name,
            }))}
            units={units
              .filter(
                (unit) =>
                  unit.source_onboarding_unit_id !== null
              )
              .map((unit) => ({
                onboardingUnitId:
                  unit.source_onboarding_unit_id as number,
                unitName:
                  unit.unit_name ||
                  unit.unit_type ||
                  d.fallback.unnamedUnit,
              }))}
            categories={[...ADMIN_PHOTO_CATEGORIES]}
            dictionary={{
              propertyFiles: d.photos.propertyFiles,
              unitFiles: d.photos.unitFiles,
              category: d.photos.category,
              scope: d.photos.scope,
              unit: d.photos.unit,
              uploaded: d.photos.uploaded,
              fileSize: d.photos.fileSize,
              openFile: d.photos.openFile,
              addPhotos: d.photos.addPhotos,
              deleteFile: d.photos.deleteFile,
              moveFile: d.photos.moveFile,
              moveToCategory: d.photos.moveToCategory,
              chooseCategory: d.photos.chooseCategory,
              chooseUnit: d.photos.chooseUnit,
              propertyLevel: d.photos.propertyLevel,
              noFiles: d.photos.noFiles,
              uploadFiles: d.photos.uploadFiles,
              uploading: d.photos.uploading,
              deleteConfirm: d.photos.deleteConfirm,
              move: d.photos.move,
              cancel: d.photos.cancel,
              fileName: d.photos.fileName,
              fileType: d.photos.fileType,
            }}
          />
        </Section>

        <Section
          icon={<FileText size={19} />}
          title={d.sections.raw.title}
          description={d.sections.raw.description}
        >
          <details className="group">
            <summary className="cursor-pointer select-none text-sm font-black text-blue-600">
              {d.actions.showRawData}
            </summary>

            <pre className="mt-4 max-h-[520px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              {JSON.stringify(value("form_data"), null, 2)}
            </pre>
          </details>
        </Section>
      </div>
    </div>
  );
}