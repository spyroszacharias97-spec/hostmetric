import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      country,
      propertyType,
      email,
      phone,
      cityArea,
      message,
      consent,
    } = body;

    if (
      !fullName ||
      !country ||
      !email ||
      !message ||
      consent !== true
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO contact_submissions (
        full_name,
        country,
        property_type,
        email,
        phone,
        city_area,
        message,
        consent
      )
      VALUES (
        ${fullName},
        ${country},
        ${propertyType || null},
        ${email},
        ${phone || null},
        ${cityArea || null},
        ${message},
        ${consent}
      )
      RETURNING id, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        submission: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while saving the submission.",
      },
      { status: 500 }
    );
  }
}