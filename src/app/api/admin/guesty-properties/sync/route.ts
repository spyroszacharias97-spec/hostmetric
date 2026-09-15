import {
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  auth,
} from "@/auth";

import {
  neon,
} from "@neondatabase/serverless";

import {
  getGuestyListings,
  type GuestyListing,
} from "@/lib/guesty/listings";

import {
  isGuestyConfigured,
} from "@/lib/guesty/config";


export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";


function getSql() {
  const databaseUrl =
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing."
    );
  }

  return neon(
    databaseUrl
  );
}


function optionalString(
  value:
    unknown
) {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed ||
    null;
}


function optionalNumber(
  value:
    unknown
) {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value
    )
  ) {
    return null;
  }

  return value;
}


async function getAllGuestyListings() {
  const listings:
    GuestyListing[] = [];

  let cursor:
    string | undefined;

  const seenCursors =
    new Set<string>();


  do {
    const response =
      await getGuestyListings({
        limit:
          100,

        ...(cursor
          ? {
              cursor,
            }
          : {}),
      });


    if (
      !response ||
      !Array.isArray(
        response.results
      )
    ) {
      throw new Error(
        "Guesty returned an invalid listings response."
      );
    }


    listings.push(
      ...response.results
    );


    const nextCursor =
      optionalString(
        response.pagination
          ?.cursor
          ?.next
      );


    if (
      !nextCursor
    ) {
      cursor =
        undefined;

      break;
    }


    if (
      seenCursors.has(
        nextCursor
      )
    ) {
      throw new Error(
        "Guesty returned a repeated pagination cursor."
      );
    }


    seenCursors.add(
      nextCursor
    );

    cursor =
      nextCursor;
  } while (cursor);


  return listings;
}


export async function POST() {
  const session =
    await auth();


  if (!session?.user) {
    return NextResponse.json(
      {
        success:
          false,

        error:
          "Unauthorized.",
      },
      {
        status:
          401,
      }
    );
  }


  if (
    !isGuestyConfigured
  ) {
    return NextResponse.json(
      {
        success:
          false,

        error:
          "Guesty API credentials are not configured.",
      },
      {
        status:
          503,
      }
    );
  }


  const sql =
    getSql();


  try {
    const listings =
      await getAllGuestyListings();


    let created =
      0;

    let updated =
      0;

    let skipped =
      0;


    for (
      const listing
      of listings
    ) {
      const guestyListingId =
        optionalString(
          listing._id
        );


      if (
        !guestyListingId
      ) {
        skipped +=
          1;

        continue;
      }


      const existing =
        await sql`
          SELECT
            id
          FROM guesty_properties
          WHERE guesty_listing_id =
            ${guestyListingId}
          LIMIT 1;
        `;


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

      const city =
        optionalString(
          listing.address
            ?.city
        );

      const state =
        optionalString(
          listing.address
            ?.state
        );

      const country =
        optionalString(
          listing.address
            ?.country
        );

      const currency =
        optionalString(
          listing.prices
            ?.currency
        );

      const guestyData =
        JSON.stringify(
          listing
        );


      if (
        existing.length >
        0
      ) {
        await sql`
          UPDATE guesty_properties
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
              ${city},

            state =
              ${state},

            country =
              ${country},

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
            guesty_listing_id =
              ${guestyListingId};
        `;


        updated +=
          1;
      } else {
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
            'synced',
            NOW(),
            NULL,
            ${guestyData}::jsonb,
            NOW(),
            NOW()
          );
        `;


        created +=
          1;
      }
    }


    revalidatePath(
      "/admin/guesty-properties"
    );

    revalidatePath(
      "/book"
    );


    return NextResponse.json({
      success:
        true,

      summary: {
        received:
          listings.length,

        created,

        updated,

        skipped,
      },
    });
  } catch (error) {
    console.error(
      "Guesty global property sync failed:",
      error
    );


    const message =
      error instanceof Error
        ? error.message
        : "Guesty property sync failed.";


    return NextResponse.json(
      {
        success:
          false,

        error:
          message,
      },
      {
        status:
          500,
      }
    );
  }
}