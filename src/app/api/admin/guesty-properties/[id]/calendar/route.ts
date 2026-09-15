import {
  NextResponse,
} from "next/server";

import {
  neon,
} from "@neondatabase/serverless";

import {
  auth,
} from "@/auth";

import {
  getGuestyListingCalendar,
} from "@/lib/guesty/calendar";


export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";


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


function isValidDateString(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split("-")
      .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  return (
    date.getUTCFullYear() ===
      year &&
    date.getUTCMonth() ===
      month - 1 &&
    date.getUTCDate() ===
      day
  );
}


export async function GET(
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


    const url =
      new URL(
        request.url
      );


    const from =
      url.searchParams
        .get("from")
        ?.trim() ??
      "";


    const to =
      url.searchParams
        .get("to")
        ?.trim() ??
      "";


    if (
      !from ||
      !to
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Calendar from and to dates are required.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !isValidDateString(
        from
      ) ||
      !isValidDateString(
        to
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Calendar dates must use valid YYYY-MM-DD format.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      from >
      to
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Calendar from date cannot be after the to date.",
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
          guesty_listing_id,
          title,
          nickname,
          sync_status
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
     * Guesty remains the source of truth
     * for availability.
     *
     * This calls:
     *
     * GET
     * /listings/{listingId}/calendar
     * ?from=YYYY-MM-DD
     * &to=YYYY-MM-DD
     */
    const calendar =
      await getGuestyListingCalendar(
        guestyListingId,
        {
          from,
          to,
        }
      );


    return NextResponse.json(
      {
        success: true,

        property: {
          id:
            Number(
              property.id
            ),

          guestyListingId,

          title:
            property.title
              ? String(
                  property.title
                )
              : null,

          nickname:
            property.nickname
              ? String(
                  property.nickname
                )
              : null,

          syncStatus:
            property.sync_status
              ? String(
                  property.sync_status
                )
              : null,
        },

        range: {
          from,
          to,
        },

        calendar,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "[admin-guesty-properties] Guesty calendar error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not load the Guesty calendar.",
      },
      {
        status: 500,
      }
    );
  }
}