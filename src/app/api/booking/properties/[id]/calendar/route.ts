import { neon } from "@neondatabase/serverless";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { features } from "@/config/features";
import { getGuestyListingCalendar } from "@/lib/guesty/calendar";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type DirectBookingSettingRow = {
  setting_value: unknown;
};

type GuestyPropertyRow = {
  id: number;
  guesty_listing_id: string;
};

const DAY_MS =
  24 * 60 * 60 * 1000;

const MAX_CALENDAR_AHEAD_YEARS =
  2;

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

function parseBooleanSetting(
  value: unknown
) {
  if (value === true) {
    return true;
  }

  if (value === false) {
    return false;
  }

  if (
    typeof value === "string"
  ) {
    const normalized =
      value
        .trim()
        .toLowerCase();

    return (
      normalized === "true" ||
      normalized === '"true"'
    );
  }

  return false;
}

function isValidDate(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const date =
    new Date(
      `${value}T00:00:00Z`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  return (
    date
      .toISOString()
      .slice(0, 10) ===
    value
  );
}

function parseUtcDate(
  value: string
) {
  return new Date(
    `${value}T00:00:00Z`
  );
}

function getTodayUtc() {
  const now =
    new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  );
}

function addUtcYears(
  date: Date,
  years: number
) {
  const result =
    new Date(
      date.getTime()
    );

  result.setUTCFullYear(
    result.getUTCFullYear() +
      years
  );

  return result;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  if (!features.directBooking) {
    return NextResponse.json(
      {
        error:
          "Direct booking is not available.",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const { id } =
      await context.params;

    const propertyId =
      Number(id);

    if (
      !Number.isInteger(
        propertyId
      ) ||
      propertyId < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid property ID.",
        },
        {
          status: 400,
        }
      );
    }

    const from =
      request.nextUrl.searchParams.get(
        "from"
      );

    const to =
      request.nextUrl.searchParams.get(
        "to"
      );

    if (
      !from ||
      !to ||
      !isValidDate(from) ||
      !isValidDate(to)
    ) {
      return NextResponse.json(
        {
          error:
            "Valid from and to dates are required in YYYY-MM-DD format.",
        },
        {
          status: 400,
        }
      );
    }

    if (to < from) {
      return NextResponse.json(
        {
          error:
            "The to date must be on or after the from date.",
        },
        {
          status: 400,
        }
      );
    }

    const today =
      getTodayUtc();

    const fromDate =
      parseUtcDate(from);

    const toDate =
      parseUtcDate(to);

    if (
      fromDate.getTime() <
      today.getTime()
    ) {
      return NextResponse.json(
        {
          error:
            "The calendar cannot be requested for past dates.",
        },
        {
          status: 400,
        }
      );
    }

    const maximumDate =
      addUtcYears(
        today,
        MAX_CALENDAR_AHEAD_YEARS
      );

    if (
      fromDate.getTime() >
        maximumDate.getTime() ||
      toDate.getTime() >
        maximumDate.getTime()
    ) {
      return NextResponse.json(
        {
          error:
            "The calendar can only be requested up to 2 years ahead.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Defensive sanity check so a malformed or
     * unexpectedly huge range never reaches Guesty.
     */
    const requestedDays =
      Math.floor(
        (
          toDate.getTime() -
          fromDate.getTime()
        ) /
          DAY_MS
      );

    if (
      requestedDays < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid calendar date range.",
        },
        {
          status: 400,
        }
      );
    }

    const sql = getSql();

    const settingRows =
      (await sql`
        SELECT setting_value
        FROM guesty_settings
        WHERE setting_key =
          'direct_booking_enabled'
        LIMIT 1;
      `) as unknown as DirectBookingSettingRow[];

    const globalDirectBookingEnabled =
      parseBooleanSetting(
        settingRows[0]
          ?.setting_value
      );

    if (
      !globalDirectBookingEnabled
    ) {
      return NextResponse.json(
        {
          error:
            "Direct booking is currently disabled.",
        },
        {
          status: 404,
        }
      );
    }

    const propertyRows =
      (await sql`
        SELECT
          id,
          guesty_listing_id
        FROM guesty_properties
        WHERE
          id = ${propertyId}
          AND direct_booking_enabled = TRUE
          AND sync_status = 'synced'
        LIMIT 1;
      `) as unknown as GuestyPropertyRow[];

    const property =
      propertyRows[0];

    if (!property) {
      return NextResponse.json(
        {
          error:
            "Booking property not found.",
        },
        {
          status: 404,
        }
      );
    }

    const calendar =
      await getGuestyListingCalendar(
        property.guesty_listing_id,
        {
          from,
          to,
        }
      );

    return NextResponse.json({
      propertyId:
        property.id,

      from,
      to,

      calendar,
    });
  } catch (error) {
    console.error(
      "Failed to load Guesty booking calendar.",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load property availability.",
      },
      {
        status: 500,
      }
    );
  }
}
