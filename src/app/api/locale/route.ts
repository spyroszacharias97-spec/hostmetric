import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const locale = body.locale as string;

    if (!isSupportedLocale(locale)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported locale",
        },
        {
          status: 400,
        }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set(
      "hostmetric_locale",
      locale as Locale,
      {
        path: "/",

        // Remember language for 1 year
        maxAge: 60 * 60 * 24 * 365,

        sameSite: "lax",

        secure:
          process.env.NODE_ENV === "production",
      }
    );

    return NextResponse.json({
      success: true,
      locale,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }
}