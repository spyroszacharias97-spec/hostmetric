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

import {
  getGuestyListing,
  type GuestyListing,
} from "@/lib/guesty/listings";


export const runtime =
  "nodejs";


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


function parseGuestyPropertyId(
  id: string
) {
  const propertyId =
    Number(id);

  if (
    !Number.isInteger(
      propertyId
    ) ||
    propertyId < 1
  ) {
    return null;
  }

  return propertyId;
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
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return value;
}


function getListingCurrency(
  listing: GuestyListing
) {
  return optionalString(
    listing.prices?.currency
  );
}


function getListingAddress(
  listing: GuestyListing
) {
  return {
    city:
      optionalString(
        listing.address?.city
      ),

    state:
      optionalString(
        listing.address?.state
      ),

    country:
      optionalString(
        listing.address?.country
      ),
  };
}


export async function POST(
  _request: Request,
  context: RouteContext
) {
  let propertyId:
    number | null = null;

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


    const {
      id,
    } =
      await context.params;

    propertyId =
      parseGuestyPropertyId(
        id
      );


    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Invalid Guesty property ID.",
        },
        {
          status: 400,
        }
      );
    }


    const sql =
      getSql();


    const propertyRows =
      await sql`
        SELECT
          id,
          guesty_listing_id
        FROM
          guesty_properties
        WHERE
          id =
            ${propertyId}
        LIMIT 1;
      `;


    const property =
      propertyRows[0];


    if (!property) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Guesty property not found.",
        },
        {
          status: 404,
        }
      );
    }


    const guestyListingId =
      String(
        property.guesty_listing_id
      ).trim();


    if (!guestyListingId) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Guesty Listing ID is missing.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * Mark the property as syncing before
     * contacting Guesty.
     *
     * Existing synced data is intentionally
     * preserved while the request is running.
     */
    await sql`
      UPDATE
        guesty_properties
      SET
        sync_status =
          'syncing',

        last_sync_error =
          NULL,

        updated_at =
          NOW()

      WHERE
        id =
          ${propertyId};
    `;


    /*
     * Guesty remains the source of truth.
     *
     * This calls:
     *
     * GET /listings/{listingId}
     */
    const listing =
      await getGuestyListing(
        guestyListingId
      );


    /*
     * Defensive validation:
     * make sure Guesty returned a listing
     * identifier before storing the response.
     */
    const returnedListingId =
      optionalString(
        listing._id
      );


    if (!returnedListingId) {
      throw new Error(
        "Guesty returned a listing without a valid listing ID."
      );
    }


    if (
      returnedListingId !==
      guestyListingId
    ) {
      throw new Error(
        "Guesty returned a different listing ID than the property being synchronized."
      );
    }


    const address =
      getListingAddress(
        listing
      );


    const title =
      optionalString(
        listing.title
      );


    const nickname =
      optionalString(
        listing.nickname
      );


    const listingType =
      optionalString(
        listing.type
      );


    const bedrooms =
      optionalNumber(
        listing.bedrooms
      );


    const bathrooms =
      optionalNumber(
        listing.bathrooms
      );


    const accommodates =
      optionalNumber(
        listing.accommodates
      );


    const currency =
      getListingCurrency(
        listing
      );


    /*
     * Keep the complete Guesty response as
     * JSONB as well as the fields needed by
     * the HostMetric admin interface.
     *
     * The JSON snapshot is NOT the source
     * of truth. Guesty remains the source
     * of truth.
     */
    const guestyData =
      JSON.stringify(
        listing
      );


    const updatedRows =
      await sql`
        UPDATE
          guesty_properties

        SET
          title =
            ${title},

          nickname =
            ${nickname},

          listing_type =
            ${listingType},

          bedrooms =
            ${bedrooms},

          bathrooms =
            ${bathrooms},

          accommodates =
            ${accommodates},

          city =
            ${address.city},

          state =
            ${address.state},

          country =
            ${address.country},

          currency =
            ${currency},

          sync_status =
            'synced',

          last_synced_at =
            NOW(),

          last_sync_error =
            NULL,

          guesty_data =
            ${guestyData}::jsonb,

          updated_at =
            NOW()

        WHERE
          id =
            ${propertyId}

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
          updated_at;
      `;


    const updatedProperty =
      updatedRows[0];


    if (!updatedProperty) {
      throw new Error(
        "Guesty property disappeared while synchronization was running."
      );
    }


    revalidatePath(
      "/admin/guesty-properties"
    );

    revalidatePath(
      "/book"
    );


    return NextResponse.json({
      success: true,

      property:
        updatedProperty,
    });
  } catch (error) {
    console.error(
      "[admin-guesty-properties] Guesty sync error:",
      error
    );


    /*
     * If we already resolved a valid local
     * property, record the failure without
     * deleting its previously synced data.
     */
    if (propertyId) {
      try {
        const sql =
          getSql();

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Guesty synchronization failed.";


        await sql`
          UPDATE
            guesty_properties

          SET
            sync_status =
              'error',

            last_sync_error =
              ${errorMessage},

            updated_at =
              NOW()

          WHERE
            id =
              ${propertyId};
        `;


        revalidatePath(
          "/admin/guesty-properties"
        );
      } catch (
        databaseError
      ) {
        console.error(
          "[admin-guesty-properties] Could not save Guesty sync error:",
          databaseError
        );
      }
    }


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not synchronize the Guesty property.",
      },
      {
        status: 500,
      }
    );
  }
}