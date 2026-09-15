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


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


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


export async function PATCH(
  request: Request,
  context: RouteContext
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


    const {
      id,
    } =
      await context.params;

    const propertyId =
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


    const payload =
      (await request
        .json()
        .catch(() => null)) as
        | {
            directBookingEnabled?:
              unknown;
          }
        | null;


    if (
      typeof payload?.directBookingEnabled !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "directBookingEnabled must be a boolean.",
        },
        {
          status: 400,
        }
      );
    }


    const sql =
      getSql();


    const updatedRows =
      await sql`
        UPDATE guesty_properties
        SET
          direct_booking_enabled =
            ${payload.directBookingEnabled},

          updated_at =
            NOW()

        WHERE
          id =
            ${propertyId}

        RETURNING
          id,
          guesty_listing_id,
          direct_booking_enabled,
          sync_status,
          updated_at;
      `;


    const property =
      updatedRows[0];


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


    revalidatePath(
      "/admin/guesty-properties"
    );

    revalidatePath(
      "/book"
    );


    return NextResponse.json({
      success: true,

      property: {
        id:
          Number(
            property.id
          ),

        guestyListingId:
          String(
            property.guesty_listing_id
          ),

        directBookingEnabled:
          Boolean(
            property.direct_booking_enabled
          ),

        syncStatus:
          String(
            property.sync_status
          ),

        updatedAt:
          property.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "[admin-guesty-properties] Update property error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not update the Guesty property.",
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

    const propertyId =
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


    const deletedRows =
      await sql`
        DELETE FROM
          guesty_properties

        WHERE
          id =
            ${propertyId}

        RETURNING
          id,
          guesty_listing_id;
      `;


    const property =
      deletedRows[0];


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


    revalidatePath(
      "/admin/guesty-properties"
    );

    revalidatePath(
      "/book"
    );


    return NextResponse.json({
      success: true,

      propertyId:
        Number(
          property.id
        ),

      guestyListingId:
        String(
          property.guesty_listing_id
        ),
    });
  } catch (error) {
    console.error(
      "[admin-guesty-properties] Delete property error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not delete the Guesty property.",
      },
      {
        status: 500,
      }
    );
  }
}