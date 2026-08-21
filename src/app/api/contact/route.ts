import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);

const resend = new Resend(process.env.RESEND_API_KEY!);

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

    // Validate required fields
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

    // Save submission to Neon
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

    // Send notification email to HostMetric
    const { error: emailError } = await resend.emails.send({
      from: "HostMetric Website <notifications@hostmetric.gr>",

      to: ["info@hostmetric.gr"],

      replyTo: email,

      subject: `Νέο αίτημα από ${fullName}`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
          
          <h2>Νέο αίτημα μέσω HostMetric</h2>

          <p>
            Υποβλήθηκε νέο αίτημα μέσω της φόρμας επικοινωνίας του hostmetric.gr.
          </p>

          <hr />

          <p><strong>Ονοματεπώνυμο:</strong> ${fullName}</p>

          <p><strong>Χώρα ακινήτου:</strong> ${country}</p>

          <p>
            <strong>Τύπος ακινήτου:</strong>
            ${propertyType || "Δεν δηλώθηκε"}
          </p>

          <p><strong>Email:</strong> ${email}</p>

          <p>
            <strong>Τηλέφωνο:</strong>
            ${phone || "Δεν δηλώθηκε"}
          </p>

          <p>
            <strong>Πόλη / Περιοχή:</strong>
            ${cityArea || "Δεν δηλώθηκε"}
          </p>

          <hr />

          <p><strong>Μήνυμα:</strong></p>

          <p style="white-space: pre-wrap;">
            ${message}
          </p>

          <hr />

          <p style="font-size: 12px; color: #777;">
            Submission ID: ${result[0].id}
          </p>

        </div>
      `,
    });

    if (emailError) {
      console.error("Resend notification error:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        submission: result[0],
        emailNotificationSent: !emailError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while processing the submission.",
      },
      { status: 500 }
    );
  }
}