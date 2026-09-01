import AnimatedWave from "@/components/animated-wave";
import OnboardingForm from "@/components/onboarding-form";

import { auth } from "@/auth";
import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";


/* =========================================================
   TYPES
========================================================= */

type PageSearchParams = {
  admin?: string | string[];
  contactId?: string | string[];
};


type InitialContact = {
  contactId: number;
  fullName: string | null;
  email: string;
  phone: string | null;
};


/* =========================================================
   DATABASE
========================================================= */

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


/* =========================================================
   SEARCH PARAM HELPERS
========================================================= */

function getSingleSearchParam(
  value:
    | string
    | string[]
    | undefined
) {

  if (
    Array.isArray(value)
  ) {
    return value[0] ?? "";
  }


  return value ?? "";
}


/* =========================================================
   ADMIN CONTACT LOOKUP
========================================================= */

async function getAdminInitialContact(
  contactId: number
): Promise<InitialContact | null> {

  const sql =
    getSql();


  const rows =
    await sql`
      SELECT
        id,
        full_name,
        email,
        phone
      FROM contacts
      WHERE id = ${contactId}
      LIMIT 1;
    `;


  if (
    rows.length === 0
  ) {
    return null;
  }


  const row =
    rows[0];


  return {
    contactId:
      Number(
        row.id
      ),

    fullName:
      row.full_name
        ? String(
            row.full_name
          )
        : null,

    email:
      String(
        row.email
      ),

    phone:
      row.phone
        ? String(
            row.phone
          )
        : null,
  };
}


/* =========================================================
   GET STARTED PAGE
========================================================= */

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams:
    Promise<PageSearchParams>;
}) {

  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

  const cookieStore =
    await cookies();


  const savedLocale =
    cookieStore.get(
      "hostmetric_locale"
    )?.value;


  let currentLocale: Locale =
    defaultLocale;


  if (
    savedLocale &&
    isSupportedLocale(
      savedLocale
    )
  ) {
    currentLocale =
      savedLocale;
  }


  /* ==========================================
     PAGE SEARCH PARAMETERS
  ========================================== */

  const params =
    await searchParams;


  const adminMode =
    getSingleSearchParam(
      params.admin
    ) === "1";


  const contactIdValue =
    getSingleSearchParam(
      params.contactId
    );


  let initialContact:
    | InitialContact
    | null =
      null;


  let adminContactId:
    | number
    | null =
      null;


  /* ==========================================
     ADMIN MODE
  ========================================== */

  if (
    adminMode
  ) {

    const session =
      await auth();


    if (
      !session?.user?.email
    ) {

      redirect(
        `/admin/login?callbackUrl=${encodeURIComponent(
          `/get-started?admin=1&contactId=${contactIdValue}`
        )}`
      );

    }


    adminContactId =
      Number(
        contactIdValue
      );


    if (
      !Number.isInteger(
        adminContactId
      ) ||
      adminContactId < 1
    ) {
      notFound();
    }


    initialContact =
      await getAdminInitialContact(
        adminContactId
      );


    if (
      !initialContact
    ) {
      notFound();
    }

  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(
      currentLocale
    );


  const getStarted =
    dictionary.getStartedPage;


  /* =========================================================
     RESPONSIVE PAGE

     The OnboardingForm component keeps its own internal
     responsive layout. This page controls the outer shell,
     hero spacing, typography and safe mobile width.
  ========================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-b
        from-sky-50
        via-white
        to-white
        px-4
        py-14
        sm:px-6
        sm:py-16
        md:px-8
        md:py-20
        lg:px-10
      "
    >

      {/* ==========================================
          BACKGROUND WAVE
      ========================================== */}

      <AnimatedWave />


      {/* ==========================================
          PAGE CONTENT
      ========================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          min-w-0
          max-w-7xl
        "
      >

        {/* ========================================
            HERO
        ======================================== */}

        <div
          className="
            mx-auto
            mb-9
            max-w-4xl
            px-0
            text-center
            sm:mb-11
            sm:px-2
            md:mb-14
          "
        >

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              sm:text-sm
              sm:tracking-[0.2em]
              md:tracking-[0.25em]
            "
          >
            {getStarted.hero.eyebrow}
          </p>


          <h1
            className="
              mt-4
              break-words
              text-4xl
              font-bold
              leading-[1.05]
              tracking-tight
              min-[390px]:text-[2.7rem]
              sm:mt-5
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            {getStarted.hero.title}
          </h1>


          <p
            className="
              mx-auto
              mt-5
              max-w-3xl
              text-base
              leading-7
              text-slate-600
              sm:mt-6
              sm:text-lg
              sm:leading-8
              md:mt-7
              md:text-xl
              md:leading-9
            "
          >
            {getStarted.hero.description}
          </p>

        </div>


        {/* ========================================
            ONBOARDING FORM

            Public mode:
            - standard onboarding flow

            Admin mode:
            - authenticated admin flow
            - existing contact can be prefilled
            - return path remains unchanged
        ======================================== */}

        <div
          className="
            w-full
            min-w-0
          "
        >

          <OnboardingForm
            dictionary={
              dictionary.onboardingForm
            }

            adminMode={
              adminMode
            }

            adminContactId={
              adminContactId
            }

            initialContact={
              initialContact
            }

            returnTo={
              adminContactId
                ? `/admin/leads/${adminContactId}`
                : undefined
            }
          />

        </div>

      </div>

    </main>
  );
}
