import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

import OnboardingForm from "@/components/onboarding-form";
import AdminPhoneInput from "@/components/admin-phone-input";

import {
  getAdminDictionary,
} from "@/i18n/admin";

import {
  getDictionary,
} from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


type ContactRow = {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
};


type NewPropertyPageProps = {
  searchParams?: Promise<{
    contactId?: string;
    q?: string;
    propertyCountry?: string;
    propertyType?: string;
    propertyCityArea?: string;
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


async function getContacts(
  query: string
): Promise<ContactRow[]> {
  const sql = getSql();

  const normalizedQuery =
    query.trim();

  const rows =
    normalizedQuery
      ? await sql`
          SELECT
            id,
            full_name,
            email,
            phone
          FROM contacts
          WHERE
            COALESCE(full_name, '') ILIKE ${`%${normalizedQuery}%`}
            OR email ILIKE ${`%${normalizedQuery}%`}
            OR COALESCE(phone, '') ILIKE ${`%${normalizedQuery}%`}
          ORDER BY
            full_name ASC NULLS LAST,
            email ASC
          LIMIT 50;
        `
      : await sql`
          SELECT
            id,
            full_name,
            email,
            phone
          FROM contacts
          ORDER BY
            full_name ASC NULLS LAST,
            email ASC
          LIMIT 50;
        `;

  return rows.map(
    (row) => ({
      id: Number(row.id),
      full_name:
        row.full_name
          ? String(row.full_name)
          : null,
      email: String(
        row.email ?? ""
      ),
      phone:
        row.phone
          ? String(row.phone)
          : null,
    })
  );
}


async function getContact(
  contactId: number
): Promise<ContactRow | null> {
  const sql = getSql();

  const rows = await sql`
    SELECT
      id,
      full_name,
      email,
      phone
    FROM contacts
    WHERE id = ${contactId}
    LIMIT 1;
  `;

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    full_name:
      row.full_name
        ? String(row.full_name)
        : null,
    email: String(
      row.email ?? ""
    ),
    phone:
      row.phone
        ? String(row.phone)
        : null,
  };
}


async function createClient(
  formData: FormData
) {
  "use server";

  const sql = getSql();

  const fullName =
    String(
      formData.get("fullName") ?? ""
    ).trim();

  const email =
    String(
      formData.get("email") ?? ""
    )
      .trim()
      .toLowerCase();

  const phoneCountryCode =
    String(
      formData.get("phoneCountryCode") ?? ""
    ).trim();

  const phoneNumber =
    String(
      formData.get("phone") ?? ""
    ).trim();

  const phone =
    `${phoneCountryCode} ${phoneNumber}`.trim();

  const propertyCountry =
    String(
      formData.get("propertyCountry") ?? ""
    ).trim();

  const propertyType =
    String(
      formData.get("propertyType") ?? ""
    ).trim();

  const propertyCityArea =
    String(
      formData.get("propertyCityArea") ?? ""
    ).trim();

  if (
    !fullName ||
    !email ||
    !phoneCountryCode ||
    !phoneNumber ||
    !propertyCountry ||
    !propertyType ||
    !propertyCityArea
  ) {
    redirect(
      "/admin/properties/new"
    );
  }

  const existingRows =
    await sql`
      SELECT id
      FROM contacts
      WHERE LOWER(email) = ${email}
      ORDER BY id ASC
      LIMIT 1;
    `;

  let contactId:
    | number
    | null =
    existingRows[0]?.id
      ? Number(
          existingRows[0].id
        )
      : null;

  if (!contactId) {
    const insertedRows =
      await sql`
        INSERT INTO contacts (
          full_name,
          email,
          phone,
          created_at,
          updated_at
        )
        VALUES (
          ${fullName},
          ${email},
          ${phone || null},
          NOW(),
          NOW()
        )
        RETURNING id;
      `;

    contactId =
      insertedRows[0]?.id
        ? Number(
            insertedRows[0].id
          )
        : null;
  }

  if (!contactId) {
    throw new Error(
      "Unable to create client."
    );
  }

  const nextParams =
    new URLSearchParams({
      contactId:
        String(contactId),
      propertyCountry,
      propertyType,
      propertyCityArea,
    });

  redirect(
    `/admin/properties/new?${nextParams.toString()}`
  );
}


function mapContactPropertyTypeToOnboardingCategory(
  propertyType: string | undefined
) {
  switch (propertyType) {
    case "apartment":
    case "studio":
      return "apartment-building";

    case "house":
      return "house";

    case "villa":
      return "villa-complex";

    case "hotelAparthotel":
      return "hotel";

    case "other":
      return "mixed";

    default:
      return "";
  }
}


export default async function NewPropertyPage({
  searchParams,
}: NewPropertyPageProps) {
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

  const [
    adminDictionary,
    dictionary,
  ] = await Promise.all([
    getAdminDictionary(
      currentLocale
    ),
    getDictionary(
      currentLocale
    ),
  ]);

  const params =
    (await searchParams) ?? {};

  const parsedContactId =
    Number(
      params.contactId ?? ""
    );

  const selectedContact =
    Number.isInteger(
      parsedContactId
    ) &&
    parsedContactId > 0
      ? await getContact(
          parsedContactId
        )
      : null;

  const newPropertyDictionary =
    adminDictionary.properties
      .newProperty;


  /*
   * STEP 2
   * A client has been selected.
   * Reuse the existing Get Started form in admin mode.
   */
  if (selectedContact) {
    return (
      <div>
        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-blue-600
              "
            >
              {
                newPropertyDictionary
                  .eyebrow
              }
            </p>

            <h1
              className="
                mt-3
                text-3xl
                font-black
                tracking-tight
                text-slate-950
                sm:text-4xl
              "
            >
              {
                newPropertyDictionary
                  .title
              }
            </h1>
          </div>

          <Link
            href="/admin/properties/new"
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-700
              shadow-sm
              transition
              hover:border-blue-200
              hover:text-blue-600
            "
          >
            <ArrowLeft
              size={16}
            />

            {
              newPropertyDictionary
                .back
            }
          </Link>
        </div>


        <div
          className="
            mb-8
            rounded-2xl
            border
            border-blue-200
            bg-blue-50
            p-5
          "
        >
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.16em]
              text-blue-600
            "
          >
            {
              newPropertyDictionary
                .selectClient
            }
          </p>

          <div
            className="
              mt-3
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:gap-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                font-black
                text-slate-950
              "
            >
              <UserRound
                size={17}
              />

              <span>
                {
                  selectedContact
                    .full_name ||
                  selectedContact
                    .email
                }
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-600
              "
            >
              <Mail
                size={15}
              />

              {
                selectedContact
                  .email
              }
            </div>
          </div>
        </div>


        <OnboardingForm
          dictionary={
            dictionary.onboardingForm
          }
          adminMode
          adminContactId={
            selectedContact.id
          }
          initialContact={{
            contactId:
              selectedContact.id,
            fullName:
              selectedContact
                .full_name,
            email:
              selectedContact.email,
            phone:
              selectedContact.phone,
          }}
          initialProperty={{
            country:
              params.propertyCountry ??
              "",
            city:
              params.propertyCityArea ??
              "",
            category:
              mapContactPropertyTypeToOnboardingCategory(
                params.propertyType
              ),
          }}
          returnTo="/admin/properties"
        />
      </div>
    );
  }


  /*
   * STEP 1
   * No property can be created before a client is selected or created.
   */
  const contacts =
    await getContacts(
      params.q ?? ""
    );

  return (
    <div>
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.2em]
              text-blue-600
            "
          >
            {
              newPropertyDictionary
                .eyebrow
            }
          </p>

          <h1
            className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              text-slate-950
              sm:text-4xl
            "
          >
            {
              newPropertyDictionary
                .title
            }
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-base
              leading-7
              text-slate-500
            "
          >
            {
              newPropertyDictionary
                .description
            }
          </p>
        </div>

        <Link
          href="/admin/properties"
          className="
            inline-flex
            items-center
            gap-2
            self-start
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-bold
            text-slate-700
            shadow-sm
            transition
            hover:border-blue-200
            hover:text-blue-600
          "
        >
          <ArrowLeft
            size={16}
          />

          {
            newPropertyDictionary
              .back
          }
        </Link>
      </div>


      <div
        className="
          mt-8
          rounded-2xl
          border
          border-amber-200
          bg-amber-50
          px-5
          py-4
          text-sm
          font-semibold
          text-amber-800
        "
      >
        {
          newPropertyDictionary
            .requiredClient
        }
      </div>


      <div
        className="
          mt-8
          grid
          gap-6
          xl:grid-cols-2
        "
      >
        {/* EXISTING CLIENT */}
        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
            "
          >
            <UserRound
              size={21}
            />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-slate-950
            "
          >
            {
              newPropertyDictionary
                .existingClient
            }
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {
              newPropertyDictionary
                .existingClientDescription
            }
          </p>


          <form
            method="get"
            className="mt-6"
          >
            <div
              className="
                flex
                gap-2
              "
            >
              <div
                className="
                  relative
                  min-w-0
                  flex-1
                "
              >
                <Search
                  size={16}
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="search"
                  name="q"
                  defaultValue={
                    params.q ?? ""
                  }
                  placeholder={
                    newPropertyDictionary
                      .searchClientPlaceholder
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    font-semibold
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-3
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:bg-slate-700
                "
              >
                <Search
                  size={17}
                />

                {
                  newPropertyDictionary
                    .search
                }
              </button>
            </div>
          </form>


          <div
            className="
              mt-5
              max-h-[420px]
              space-y-2
              overflow-y-auto
              pr-1
            "
          >
            {contacts.length === 0 ? (
              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  px-4
                  py-8
                  text-center
                  text-sm
                  font-semibold
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .noClientsFound
                }
              </div>
            ) : contacts.map(
              (contact) => (
                <Link
                  key={contact.id}
                  href={`/admin/properties/new?contactId=${contact.id}`}
                  className="
                    group
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    px-4
                    py-3.5
                    transition
                    hover:border-blue-300
                    hover:bg-blue-50/60
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        truncate
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      {
                        contact.full_name ||
                        contact.email
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      {
                        contact.email
                      }
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="
                      shrink-0
                      text-slate-400
                      transition
                      group-hover:translate-x-0.5
                      group-hover:text-blue-600
                    "
                  />
                </Link>
              )
            )}
          </div>
        </section>


        {/* NEW CLIENT */}
        <section
          id="new-client"
          className="
            scroll-mt-8
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-600
            "
          >
            <Plus
              size={22}
            />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-slate-950
            "
          >
            {
              newPropertyDictionary
                .newClient
            }
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {
              newPropertyDictionary
                .newClientDescription
            }
          </p>


          <form
            action={createClient}
            className="
              mt-6
              space-y-4
            "
          >
            <div>
              <label
                htmlFor="fullName"
                className="
                  text-xs
                  font-black
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .fullName
                }
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              />
            </div>


            <div>
              <label
                htmlFor="email"
                className="
                  text-xs
                  font-black
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .email
                }
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              />
            </div>


            <div>
              <label
                htmlFor="phone"
                className="
                  text-xs
                  font-black
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .phoneOptional.replace(
                      /\s*\(optional\)\s*/i,
                      ""
                    )
                }
              </label>

              <AdminPhoneInput />
            </div>



            <div>
              <label
                htmlFor="propertyCountry"
                className="
                  text-xs
                  font-black
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .propertyCountry
                }
              </label>

              <select
                id="propertyCountry"
                name="propertyCountry"
                required
                defaultValue=""
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              >
                <option value="" disabled>
                  {
                    newPropertyDictionary
                      .selectPropertyCountry
                  }
                </option>

                <option value="Greece">
                  {
                    dictionary.contactPage
                      .form.options.greece
                  }
                </option>

                <option value="Cyprus">
                  {
                    dictionary.contactPage
                      .form.options.cyprus
                  }
                </option>

                <option value="Other European Country">
                  {
                    dictionary.contactPage
                      .form.options.otherEuropeanCountry
                  }
                </option>
              </select>
            </div>


            <div>
              <label
                htmlFor="propertyType"
                className="
                  text-xs
                  font-black
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .propertyType
                }
              </label>

              <select
                id="propertyType"
                name="propertyType"
                required
                defaultValue=""
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              >
                <option value="" disabled>
                  {
                    newPropertyDictionary
                      .selectPropertyType
                  }
                </option>

                <option value="apartment">
                  {
                    dictionary.contactPage
                      .form.options.apartment
                  }
                </option>

                <option value="studio">
                  {
                    dictionary.contactPage
                      .form.options.studio
                  }
                </option>

                <option value="house">
                  {
                    dictionary.contactPage
                      .form.options.house
                  }
                </option>

                <option value="villa">
                  {
                    dictionary.contactPage
                      .form.options.villa
                  }
                </option>

                <option value="hotelAparthotel">
                  {
                    dictionary.contactPage
                      .form.options.hotelAparthotel
                  }
                </option>

                <option value="other">
                  {
                    dictionary.contactPage
                      .form.options.other
                  }
                </option>
              </select>
            </div>


            <div>
              <label
                htmlFor="propertyCityArea"
                className="
                  text-xs
                  font-black
                  text-slate-500
                "
              >
                {
                  newPropertyDictionary
                    .propertyCityArea
                }
              </label>

              <input
                id="propertyCityArea"
                name="propertyCityArea"
                type="text"
                required
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              />
            </div>


            <button
              type="submit"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-sm
                font-black
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                hover:shadow-md
              "
            >
              {
                newPropertyDictionary
                  .createClientAndContinue
              }

              <ArrowRight
                size={17}
              />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
