import {
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  neon,
} from "@neondatabase/serverless";

import {
  auth,
} from "@/auth";


export const runtime =
  "nodejs";


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


function optionalString(
  value: unknown
) {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}


function optionalNumber(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return null;
  }

  return numberValue;
}


export async function GET() {
  try {
    const session =
      await auth();

    if (
      !session?.user?.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const sql =
      getSql();

    const properties =
      await sql`
        SELECT
          id,
          guesty_listing_id,
          title,
          nickname,
          listing_type,
          bedrooms,
          bathrooms,
          accommodates,
          city,
          state,
          country,
          currency,
          direct_booking_enabled,
          sync_status,
          last_synced_at,
          last_sync_error,
          created_at,
          updated_at
        FROM guesty_properties
        ORDER BY
          COALESCE(
            title,
            nickname,
            guesty_listing_id
          ) ASC;
      `;

    return NextResponse.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error(
      "[admin-guesty-properties] Get properties error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not load Guesty properties.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function POST(
  request: Request
) {
  try {
    const session =
      await auth();

    if (
      !session?.user?.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const payload =
      (await request
        .json()
        .catch(() => null)) as
        | {
            guestyListingId?: unknown;

            title?: unknown;
            nickname?: unknown;
            listingType?: unknown;

            bedrooms?: unknown;
            bathrooms?: unknown;
            accommodates?: unknown;

            city?: unknown;
            state?: unknown;
            country?: unknown;

            currency?: unknown;
          }
        | null;


    const guestyListingId =
      optionalString(
        payload?.guestyListingId
      );

    if (!guestyListingId) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Guesty Listing ID is required.",
        },
        {
          status: 400,
        }
      );
    }


    const title =
      optionalString(
        payload?.title
      );

    const nickname =
      optionalString(
        payload?.nickname
      );

    const listingType =
      optionalString(
        payload?.listingType
      );

    const bedrooms =
      optionalNumber(
        payload?.bedrooms
      );

    const bathrooms =
      optionalNumber(
        payload?.bathrooms
      );

    const accommodates =
      optionalNumber(
        payload?.accommodates
      );

    const city =
      optionalString(
        payload?.city
      );

    const state =
      optionalString(
        payload?.state
      );

    const country =
      optionalString(
        payload?.country
      );

    const currency =
      optionalString(
        payload?.currency
      );


    if (
      bedrooms !== null &&
      bedrooms < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Bedrooms cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      bathrooms !== null &&
      bathrooms < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Bathrooms cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      accommodates !== null &&
      (
        !Number.isInteger(
          accommodates
        ) ||
        accommodates < 1
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Guest capacity must be a positive whole number.",
        },
        {
          status: 400,
        }
      );
    }


    const sql =
      getSql();


    const existingRows =
      await sql`
        SELECT
          id
        FROM guesty_properties
        WHERE
          guesty_listing_id =
            ${guestyListingId}
        LIMIT 1;
      `;


    if (existingRows[0]) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This Guesty Listing ID has already been added.",
        },
        {
          status: 409,
        }
      );
    }


    const insertedRows =
      await sql`
        INSERT INTO guesty_properties (
          guesty_listing_id,

          title,
          nickname,
          listing_type,

          bedrooms,
          bathrooms,
          accommodates,

          city,
          state,
          country,

          currency,

          direct_booking_enabled,

          sync_status,

          last_synced_at,
          last_sync_error,

          guesty_data,

          created_at,
          updated_at
        )
        VALUES (
          ${guestyListingId},

          ${title},
          ${nickname},
          ${listingType},

          ${bedrooms},
          ${bathrooms},
          ${accommodates},

          ${city},
          ${state},
          ${country},

          ${currency},

          FALSE,

          'connected',

          NULL,
          NULL,

          NULL,

          NOW(),
          NOW()
        )
        RETURNING
          id,
          guesty_listing_id,
          title,
          nickname,
          listing_type,
          bedrooms,
          bathrooms,
          accommodates,
          city,
          state,
          country,
          currency,
          direct_booking_enabled,
          sync_status,
          last_synced_at,
          last_sync_error,
          created_at,
          updated_at;
      `;


    const property =
      insertedRows[0];

    if (!property) {
      throw new Error(
        "Guesty property could not be created."
      );
    }


    revalidatePath(
      "/admin/guesty-properties"
    );

    revalidatePath(
      "/book"
    );


    return NextResponse.json(
      {
        success: true,
        property,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[admin-guesty-properties] Add property error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not add the Guesty property.",
      },
      {
        status: 500,
      }
    );
  }
}