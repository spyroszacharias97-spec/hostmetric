import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";

import { cookies } from "next/headers";

import { getAdminDictionary } from "@/i18n/admin";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


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


type ClientRow = {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};


type PropertyUnitRow = {
  id: number;
  property_id: number;
  unit_name: string | null;
  unit_type: string | null;
  quantity: number;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  max_guests: number | null;
  max_adults: number | null;
  max_children: number | null;
};


type PropertyRow = {
  id: number;
  property_name: string | null;
  property_type: string | null;
  property_address: string | null;
  property_city: string | null;
  property_region: string | null;
  property_country: string | null;
  property_postal_code: string | null;
  status: string | null;
  units: PropertyUnitRow[];
};


type ClientDetails = {
  client: ClientRow;
  contactRequests: number;
  onboardingSubmissions: number;
  properties: PropertyRow[];
  totalProperties: number;
};


function formatDate(
  value: string | Date | null,
  locale: string
) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(date);
}


async function getClientDetails(
  clientId: number
): Promise<ClientDetails | null> {
  const sql = getSql();


  const clientRows =
    await sql`
      SELECT
        id,
        full_name,
        email,
        phone,
        created_at,
        updated_at
      FROM contacts
      WHERE id = ${clientId}
      LIMIT 1;
    `;


  if (
    clientRows.length === 0
  ) {
    return null;
  }


  const clientRow =
    clientRows[0];


  const [
    contactRequestRows,
    onboardingRows,
    propertyRows,
    unitRows,
  ] = await Promise.all([

    sql`
      SELECT
        COUNT(*)::int AS count
      FROM contact_submissions
      WHERE contact_id = ${clientId};
    `,

    sql`
      SELECT
        COUNT(*)::int AS count
      FROM onboarding_submissions
      WHERE contact_id = ${clientId};
    `,

    sql`
      SELECT
        p.id,
        p.property_name,
        p.property_type,

        p.address
          AS property_address,

        p.city
          AS property_city,

        p.region
          AS property_region,

        p.country
          AS property_country,

        p.postal_code
          AS property_postal_code,

        p.status

      FROM properties p

      WHERE
        p.contact_id =
          ${clientId}

      ORDER BY
        p.id DESC;
    `,

    sql`
      SELECT
        pu.id,
        pu.property_id,
        pu.unit_name,
        pu.unit_type,
        pu.quantity,
        pu.bedrooms,
        pu.bathrooms,
        pu.size_sqm,
        pu.max_guests,
        pu.max_adults,
        pu.max_children

      FROM property_units pu

      INNER JOIN properties p
        ON p.id =
          pu.property_id

      WHERE
        p.contact_id =
          ${clientId}

      ORDER BY
        pu.property_id DESC,
        pu.id ASC;
    `,
  ]);


  const properties: PropertyRow[] =
    propertyRows.map(
      (property) => ({
        id: Number(
          property.id
        ),

        property_name:
          property.property_name
            ? String(
                property.property_name
              )
            : null,

        property_type:
          property.property_type
            ? String(
                property.property_type
              )
            : null,

        property_address:
          property.property_address
            ? String(
                property.property_address
              )
            : null,

        property_city:
          property.property_city
            ? String(
                property.property_city
              )
            : null,

        property_region:
          property.property_region
            ? String(
                property.property_region
              )
            : null,

        property_country:
          property.property_country
            ? String(
                property.property_country
              )
            : null,

        property_postal_code:
          property.property_postal_code
            ? String(
                property.property_postal_code
              )
            : null,

        status:
          property.status
            ? String(
                property.status
              )
            : null,

        units: [],
      })
    );


  const propertiesById =
    new Map(
      properties.map(
        (property) => [
          property.id,
          property,
        ]
      )
    );


  unitRows.forEach(
    (unit) => {
      const propertyId =
        Number(
          unit.property_id
        );


      const property =
        propertiesById.get(
          propertyId
        );


      if (!property) {
        return;
      }


      property.units.push({
        id: Number(
          unit.id
        ),

        property_id:
          propertyId,

        unit_name:
          unit.unit_name
            ? String(
                unit.unit_name
              )
            : null,

        unit_type:
          unit.unit_type
            ? String(
                unit.unit_type
              )
            : null,

        quantity:
          Math.max(
            1,
            Number(
              unit.quantity ?? 1
            )
          ),

        bedrooms:
          unit.bedrooms === null ||
          unit.bedrooms === undefined
            ? null
            : Number(
                unit.bedrooms
              ),

        bathrooms:
          unit.bathrooms === null ||
          unit.bathrooms === undefined
            ? null
            : Number(
                unit.bathrooms
              ),

        size_sqm:
          unit.size_sqm === null ||
          unit.size_sqm === undefined
            ? null
            : Number(
                unit.size_sqm
              ),

        max_guests:
          unit.max_guests === null ||
          unit.max_guests === undefined
            ? null
            : Number(
                unit.max_guests
              ),

        max_adults:
          unit.max_adults === null ||
          unit.max_adults === undefined
            ? null
            : Number(
                unit.max_adults
              ),

        max_children:
          unit.max_children === null ||
          unit.max_children === undefined
            ? null
            : Number(
                unit.max_children
              ),
      });
    }
  );


  const totalProperties =
    properties.reduce(
      (
        propertyTotal,
        property
      ) => {
        const propertyQuantity =
          property.units.reduce(
            (
              unitTotal,
              unit
            ) =>
              unitTotal +
              unit.quantity,
            0
          );


        return (
          propertyTotal +
          propertyQuantity
        );
      },
      0
    );


  return {
    client: {
      id: Number(
        clientRow.id
      ),

      full_name:
        clientRow.full_name
          ? String(
              clientRow.full_name
            )
          : null,

      email:
        String(
          clientRow.email
        ),

      phone:
        clientRow.phone
          ? String(
              clientRow.phone
            )
          : null,

      created_at:
        clientRow.created_at as
          | string
          | Date
          | null,

      updated_at:
        clientRow.updated_at as
          | string
          | Date
          | null,
    },

    contactRequests:
      Number(
        contactRequestRows[0]
          ?.count ?? 0
      ),

    onboardingSubmissions:
      Number(
        onboardingRows[0]
          ?.count ?? 0
      ),

    properties,

    totalProperties,
  };
}


export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } = await params;


  const clientId =
    Number(id);


  if (
    !Number.isInteger(
      clientId
    ) ||
    clientId < 1
  ) {
    notFound();
  }


  const details =
    await getClientDetails(
      clientId
    );


  if (!details) {
    notFound();
  }


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


  const adminDictionary =
    await getAdminDictionary(
      currentLocale
    );


  const dictionary =
    adminDictionary.leads;


  const dateLocale =
    adminDictionary.common
      .dateLocale;


  const client =
    details.client;


  const displayName =
    client.full_name ||
    dictionary.fallback
      .unnamedClient;


  const latestDate =
    formatDate(
      client.updated_at ??
        client.created_at,
      dateLocale
    );


  const hasOnboarding =
    details.onboardingSubmissions >
    0;


  return (
    <div>

      {/* BACK */}
      <Link
        href="/admin/leads"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-bold
          text-slate-500
          transition
          hover:text-blue-600
        "
      >
        <ArrowLeft
          size={17}
        />

        {
          dictionary.actions
            .backToClients
        }
      </Link>


      {/* HEADER */}
      <div
        className="
          mt-6
          flex
          flex-col
          gap-5
          xl:flex-row
          xl:items-start
          xl:justify-between
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
              dictionary.eyebrow
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
            {displayName}
          </h1>


          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-x-6
              gap-y-3
              text-sm
              text-slate-500
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Mail
                size={16}
              />

              <span>
                {client.email}
              </span>
            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Phone
                size={16}
              />

              <span>
                {client.phone ||
                  dictionary
                    .fallback
                    .noPhone}
              </span>
            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <CalendarDays
                size={16}
              />

              <span>
                {latestDate ||
                  dictionary
                    .fallback
                    .noDate}
              </span>
            </div>

          </div>

        </div>


        <div
          className={`
            inline-flex
            items-center
            gap-2
            self-start
            rounded-full
            px-4
            py-2
            text-sm
            font-bold

            ${
              hasOnboarding
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {hasOnboarding ? (
            <CheckCircle2
              size={17}
            />
          ) : (
            <Clock3
              size={17}
            />
          )}

          {hasOnboarding
            ? dictionary.status
                .completed
            : dictionary.status
                .pending}
        </div>

      </div>


      {/* PENDING ONBOARDING */}
      {!hasOnboarding && (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            p-5
            sm:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                {
                  dictionary.client
                    .pendingTitle
                }
              </h2>


              <p
                className="
                  mt-2
                  max-w-3xl
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                {
                  dictionary.client
                    .pendingDescription
                }
              </p>

            </div>


            <Link
              href={`/get-started?contactId=${client.id}&admin=1`}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-950
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-blue-600
              "
            >
              {
                dictionary.actions
                  .completeGetStarted
              }
            </Link>

          </div>

        </div>
      )}


      {/* COMPLETED ONBOARDING */}
      {hasOnboarding && (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-emerald-100
            bg-emerald-50/60
            p-5
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <CheckCircle2
              size={20}
              className="
                mt-0.5
                shrink-0
                text-emerald-600
              "
            />

            <p
              className="
                text-sm
                leading-6
                text-emerald-800
              "
            >
              {
                dictionary.client
                  .completedDescription
              }
            </p>
          </div>
        </div>
      )}


      {/* STATISTICS */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        {/* REQUESTS */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <MessagesSquare
                size={19}
              />
            </div>


            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-500
                "
              >
                {
                  dictionary.fields
                    .requests
                }
              </p>


              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-slate-950
                "
              >
                {
                  details
                    .contactRequests
                }
              </p>

            </div>

          </div>

        </div>


        {/* GET STARTED */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <CheckCircle2
                size={19}
              />
            </div>


            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-500
                "
              >
                {
                  dictionary.fields
                    .getStarted
                }
              </p>


              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-slate-950
                "
              >
                {
                  details
                    .onboardingSubmissions
                }
              </p>

            </div>

          </div>

        </div>


        {/* PROPERTIES */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-violet-50
                text-violet-600
              "
            >
              <Building2
                size={19}
              />
            </div>


            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-500
                "
              >
                {
                  dictionary.fields
                    .properties
                }
              </p>


              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-slate-950
                "
              >
                {
                  details
                    .totalProperties
                }
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* PROPERTIES */}
      <section
        className="mt-10"
      >

        <div>

          <h2
            className="
              text-xl
              font-black
              text-slate-950
            "
          >
            {
              dictionary.client
                .propertiesTitle
            }
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            {
              dictionary.client
                .propertiesDescription
            }
          </p>

        </div>


        {details.properties.length >
        0 ? (

          <div
            className="
              mt-5
              space-y-4
            "
          >

            {details.properties.map(
              (property) => {

                const propertyQuantity =
                  property.units.reduce(
                    (
                      total,
                      unit
                    ) =>
                      total +
                      unit.quantity,
                    0
                  );


                const address =
                  [
                    property
                      .property_address,

                    property
                      .property_city,

                    property
                      .property_region,

                    property
                      .property_postal_code,

                    property
                      .property_country,
                  ]
                    .filter(Boolean)
                    .join(", ");


                return (
                  <div
                    key={
                      property.id
                    }
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                    "
                  >

                    {/* PROPERTY HEADER */}
                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        border-b
                        border-slate-100
                        p-5
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >

                      <div>

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >

                          <Building2
                            size={18}
                            className="
                              text-blue-600
                            "
                          />


                          <h3
                            className="
                              text-lg
                              font-black
                              text-slate-950
                            "
                          >
                            {property
                              .property_name ||
                              dictionary
                                .fallback
                                .unnamedProperty}
                          </h3>


                          {propertyQuantity >
                            0 && (
                            <span
                              className="
                                rounded-full
                                bg-blue-50
                                px-2.5
                                py-1
                                text-xs
                                font-black
                                text-blue-700
                              "
                            >
                              {
                                propertyQuantity
                              }
                            </span>
                          )}

                        </div>


                        {property.property_type && (
                          <p
                            className="
                              mt-2
                              text-sm
                              font-semibold
                              text-slate-600
                            "
                          >
                            {
                              property
                                .property_type
                            }
                          </p>
                        )}


                        <div
                          className="
                            mt-2
                            flex
                            items-start
                            gap-2
                            text-sm
                            text-slate-500
                          "
                        >
                          <MapPin
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                            "
                          />

                          <span>
                            {address ||
                              dictionary
                                .fallback
                                .noAddress}
                          </span>
                        </div>

                      </div>


                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          self-start
                          rounded-xl
                          bg-blue-50
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-blue-700
                          transition
                          hover:bg-blue-100
                        "
                      >
                        {
                          dictionary.actions
                            .openProperty
                        }

                        <ExternalLink
                          size={15}
                        />
                      </Link>

                    </div>


                    {/* UNITS */}
                    <div
                      className="p-5"
                    >

                      {property.units.length >
                      0 ? (

                        <div
                          className="
                            grid
                            gap-3
                            lg:grid-cols-2
                          "
                        >

                          {property.units.map(
                            (unit) => (

                              <div
                                key={
                                  unit.id
                                }
                                className="
                                  rounded-xl
                                  border
                                  border-slate-100
                                  bg-slate-50
                                  p-4
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                  "
                                >

                                  <div>

                                    <p
                                      className="
                                        font-bold
                                        text-slate-950
                                      "
                                    >
                                      {unit.unit_name ||
                                        unit.unit_type ||
                                        dictionary
                                          .fallback
                                          .unnamedUnit}
                                    </p>


                                    {unit.unit_type &&
                                      unit.unit_name && (
                                        <p
                                          className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                          "
                                        >
                                          {
                                            unit
                                              .unit_type
                                          }
                                        </p>
                                      )}

                                  </div>


                                  <div
                                    className="
                                      shrink-0
                                      rounded-full
                                      bg-blue-100
                                      px-3
                                      py-1
                                      text-sm
                                      font-black
                                      text-blue-700
                                    "
                                  >
                                    ×
                                    {
                                      unit.quantity
                                    }
                                  </div>

                                </div>


                                <div
                                  className="
                                    mt-4
                                    flex
                                    flex-wrap
                                    gap-2
                                  "
                                >

                                  {unit.bedrooms !==
                                    null && (
                                    <span
                                      className="
                                        rounded-lg
                                        bg-white
                                        px-2.5
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                      "
                                    >
                                      {
                                        dictionary.client
                                          .bedrooms
                                      }
                                      :{" "}
                                      {
                                        unit
                                          .bedrooms
                                      }
                                    </span>
                                  )}


                                  {unit.bathrooms !==
                                    null && (
                                    <span
                                      className="
                                        rounded-lg
                                        bg-white
                                        px-2.5
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                      "
                                    >
                                      {
                                        dictionary.client
                                          .bathrooms
                                      }
                                      :{" "}
                                      {
                                        unit
                                          .bathrooms
                                      }
                                    </span>
                                  )}


                                  {unit.max_guests !==
                                    null && (
                                    <span
                                      className="
                                        rounded-lg
                                        bg-white
                                        px-2.5
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                      "
                                    >
                                      {
                                        dictionary.client
                                          .maxGuests
                                      }
                                      :{" "}
                                      {
                                        unit
                                          .max_guests
                                      }
                                    </span>
                                  )}

                                </div>

                              </div>
                            )
                          )}

                        </div>

                      ) : (

                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          {
                            dictionary.client
                              .noUnits
                          }
                        </p>

                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-8
              text-center
              text-sm
              text-slate-500
            "
          >
            {
              dictionary.client
                .noProperties
            }
          </div>

        )}

      </section>

    </div>
  );
}