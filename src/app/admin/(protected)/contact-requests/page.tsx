import Link from "next/link";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  UserRound,
} from "lucide-react";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  getAdminDictionary,
} from "@/i18n/admin";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


type ContactRequestRow = {
  id: number;
  contact_id: number | null;
  full_name: string;
  country: string | null;
  property_type: string | null;
  email: string;
  phone: string | null;
  city_area: string | null;
  message: string;
  photo_urls: string[];
  answered: boolean;
  created_at:
    | string
    | Date
    | null;
};


type ContactRequestsPageProps = {
  searchParams?: Promise<{
    q?: string;
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


function formatDateTime(
  value:
    | string
    | Date
    | null,
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
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


async function getContactRequests(
  query: string
): Promise<ContactRequestRow[]> {
  const sql = getSql();

  const normalizedQuery =
    query.trim();

  const rows =
    normalizedQuery
      ? await sql`
          SELECT
            cs.id,
            cs.contact_id,
            cs.full_name,
            cs.country,
            cs.property_type,
            cs.email,
            cs.phone,
            cs.city_area,
            cs.message,
            COALESCE(
              cs.photo_urls,
              ARRAY[]::text[]
            ) AS photo_urls,
            COALESCE(
              cs.answered,
              FALSE
            ) AS answered,
            cs.created_at
          FROM contact_submissions cs
          WHERE
            cs.full_name ILIKE ${`%${normalizedQuery}%`}
            OR cs.email ILIKE ${`%${normalizedQuery}%`}
            OR COALESCE(
              cs.phone,
              ''
            ) ILIKE ${`%${normalizedQuery}%`}
            OR COALESCE(
              cs.country,
              ''
            ) ILIKE ${`%${normalizedQuery}%`}
            OR COALESCE(
              cs.city_area,
              ''
            ) ILIKE ${`%${normalizedQuery}%`}
            OR COALESCE(
              cs.property_type,
              ''
            ) ILIKE ${`%${normalizedQuery}%`}
            OR cs.message ILIKE ${`%${normalizedQuery}%`}
          ORDER BY
            COALESCE(
              cs.answered,
              FALSE
            ) ASC,
            cs.created_at DESC NULLS LAST,
            cs.id DESC;
        `
      : await sql`
          SELECT
            cs.id,
            cs.contact_id,
            cs.full_name,
            cs.country,
            cs.property_type,
            cs.email,
            cs.phone,
            cs.city_area,
            cs.message,
            COALESCE(
              cs.photo_urls,
              ARRAY[]::text[]
            ) AS photo_urls,
            COALESCE(
              cs.answered,
              FALSE
            ) AS answered,
            cs.created_at
          FROM contact_submissions cs
          ORDER BY
            COALESCE(
              cs.answered,
              FALSE
            ) ASC,
            cs.created_at DESC NULLS LAST,
            cs.id DESC;
        `;

  return rows.map(
    (row) => ({
      id:
        Number(row.id),

      contact_id:
        row.contact_id === null ||
        row.contact_id === undefined
          ? null
          : Number(
              row.contact_id
            ),

      full_name:
        String(
          row.full_name ?? ""
        ),

      country:
        row.country
          ? String(
              row.country
            )
          : null,

      property_type:
        row.property_type
          ? String(
              row.property_type
            )
          : null,

      email:
        String(
          row.email ?? ""
        ),

      phone:
        row.phone
          ? String(
              row.phone
            )
          : null,

      city_area:
        row.city_area
          ? String(
              row.city_area
            )
          : null,

      message:
        String(
          row.message ?? ""
        ),

      photo_urls:
        Array.isArray(
          row.photo_urls
        )
          ? row.photo_urls.map(
              (url) =>
                String(url)
            )
          : [],

      answered:
        Boolean(
          row.answered
        ),

      created_at:
        row.created_at as
          | string
          | Date
          | null,
    })
  );
}


async function setAnswered(
  formData: FormData
) {
  "use server";

  const sql = getSql();

  const requestId =
    Number(
      formData.get(
        "requestId"
      )
    );

  const answered =
    String(
      formData.get(
        "answered"
      ) ?? ""
    ) === "true";

  if (
    !Number.isInteger(
      requestId
    ) ||
    requestId < 1
  ) {
    throw new Error(
      "Invalid contact request ID."
    );
  }

  await sql`
    UPDATE contact_submissions
    SET answered = ${answered}
    WHERE id = ${requestId};
  `;

  revalidatePath(
    "/admin/contact-requests"
  );

  revalidatePath(
    "/admin"
  );
}


export default async function ContactRequestsPage({
  searchParams,
}: ContactRequestsPageProps) {
  const params =
    (await searchParams) ?? {};

  const searchQuery =
    params.q?.trim() ?? "";

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

  const d =
    adminDictionary.contactRequests;

  const dateLocale =
    adminDictionary.common
      .dateLocale;

  const requests =
    await getContactRequests(
      searchQuery
    );

  const unanswered =
    requests.filter(
      (request) =>
        !request.answered
    );

  const answered =
    requests.filter(
      (request) =>
        request.answered
    );

  const groups = [
    {
      key: "unanswered",
      label:
        d.sections.unanswered.title,
      description:
        d.sections.unanswered
          .description,
      items:
        unanswered,
      countClassName:
        "bg-amber-100 text-amber-700",
      containerClassName:
        "border-amber-200",
      open:
        true,
    },
    {
      key: "answered",
      label:
        d.sections.answered.title,
      description:
        d.sections.answered
          .description,
      items:
        answered,
      countClassName:
        "bg-emerald-100 text-emerald-700",
      containerClassName:
        "border-emerald-200",
      open:
        false,
    },
  ] as const;

  return (
    <div className="pb-12">

      {/* HEADER */}
      <div>
        <p
          className="
            text-sm
            font-black
            uppercase
            tracking-[0.22em]
            text-blue-600
          "
        >
          {
            adminDictionary.dashboard
              .eyebrow
          }
        </p>

        <h1
          className="
            mt-3
            text-4xl
            font-black
            tracking-tight
            text-slate-950
          "
        >
          {d.title}
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
          {d.description}
        </p>
      </div>


      {/* SEARCH */}
      <form
        action="/admin/contact-requests"
        method="GET"
        className="
          mt-8
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
          "
        >
          <div
            className="
              relative
              flex-1
            "
          >
            <Search
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              name="q"
              defaultValue={
                searchQuery
              }
              placeholder={
                d.search.placeholder
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-4
                text-sm
                font-semibold
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-300
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>

          <button
            type="submit"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              text-sm
              font-black
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <Search
              size={16}
            />

            {
              d.search.button
            }
          </button>

          {searchQuery ? (
            <Link
              href="/admin/contact-requests"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                text-sm
                font-black
                text-slate-600
                transition
                hover:bg-slate-50
              "
            >
              {
                d.search.clear
              }
            </Link>
          ) : null}
        </div>
      </form>


      {/* SUMMARY */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-3
        "
      >
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
          <p
            className="
              text-sm
              font-semibold
              text-slate-500
            "
          >
            {
              d.stats.total
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
              requests.length
            }
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-amber-200
            bg-amber-50/60
            p-5
          "
        >
          <p
            className="
              text-sm
              font-semibold
              text-amber-700
            "
          >
            {
              d.stats.unanswered
            }
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-black
              text-amber-900
            "
          >
            {
              unanswered.length
            }
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50/60
            p-5
          "
        >
          <p
            className="
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            {
              d.stats.answered
            }
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-black
              text-emerald-900
            "
          >
            {
              answered.length
            }
          </p>
        </div>
      </div>


      {/* GROUPS */}
      <section
        className="
          mt-8
          space-y-5
        "
      >
        {groups.map(
          (group) => (
            <details
              key={
                group.key
              }
              open={
                group.open
              }
              className={`
                group/status
                overflow-hidden
                rounded-2xl
                border
                bg-white
                shadow-sm
                ${group.containerClassName}
              `}
            >
              <summary
                className="
                  flex
                  cursor-pointer
                  list-none
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-5
                  transition
                  hover:bg-slate-50
                  [&::-webkit-details-marker]:hidden
                "
              >
                <div
                  className="
                    min-w-0
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <h2
                      className="
                        text-xl
                        font-black
                        text-slate-950
                      "
                    >
                      {
                        group.label
                      }
                    </h2>

                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-black
                        ${group.countClassName}
                      `}
                    >
                      {
                        group.items
                          .length
                      }
                    </span>
                  </div>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {
                      group.description
                    }
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    text-slate-600
                  "
                >
                  <ChevronDown
                    size={19}
                    className="
                      transition-transform
                      duration-200
                      group-open/status:rotate-180
                    "
                  />
                </div>
              </summary>

              <div
                className="
                  border-t
                  border-slate-100
                  bg-slate-50/40
                  p-4
                  sm:p-5
                "
              >
                {group.items.length >
                0 ? (
                  <div
                    className="
                      space-y-4
                    "
                  >
                    {group.items.map(
                      (request) => {
                        const location =
                          [
                            request.city_area,
                            request.country,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(", ");

                        const createdAt =
                          formatDateTime(
                            request.created_at,
                            dateLocale
                          );

                        return (
                          <article
                            key={
                              request.id
                            }
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
                                flex-col
                                gap-5
                                lg:flex-row
                                lg:items-start
                                lg:justify-between
                              "
                            >
                              <div
                                className="
                                  min-w-0
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
                                      h-11
                                      w-11
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-xl
                                      bg-blue-50
                                      text-blue-600
                                    "
                                  >
                                    <MessageSquareText
                                      size={19}
                                    />
                                  </div>

                                  <div
                                    className="
                                      min-w-0
                                    "
                                  >
                                    <h3
                                      className="
                                        truncate
                                        text-lg
                                        font-black
                                        text-slate-950
                                      "
                                    >
                                      {
                                        request.full_name
                                      }
                                    </h3>

                                    <p
                                      className="
                                        mt-1
                                        text-xs
                                        font-semibold
                                        text-slate-400
                                      "
                                    >
                                      {
                                        d.fields.request
                                      }{" "}
                                      #
                                      {
                                        request.id
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <form
                                action={
                                  setAnswered
                                }
                              >
                                <input
                                  type="hidden"
                                  name="requestId"
                                  value={
                                    request.id
                                  }
                                />

                                <input
                                  type="hidden"
                                  name="answered"
                                  value={
                                    request.answered
                                      ? "false"
                                      : "true"
                                  }
                                />

                                <button
                                  type="submit"
                                  className={`
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-black
                                    transition
                                    ${
                                      request.answered
                                        ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                    }
                                  `}
                                >
                                  <CheckCircle2
                                    size={16}
                                  />

                                  {
                                    request.answered
                                      ? d.actions.markUnanswered
                                      : d.actions.markAnswered
                                  }
                                </button>
                              </form>
                            </div>


                            <div
                              className="
                                mt-5
                                grid
                                gap-4
                                border-t
                                border-slate-100
                                pt-4
                                sm:grid-cols-2
                                xl:grid-cols-4
                              "
                            >
                              <div>
                                <p
                                  className="
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                  "
                                >
                                  {
                                    d.fields.email
                                  }
                                </p>

                                <div
                                  className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-1.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >
                                  <Mail
                                    size={14}
                                  />

                                  <a
                                    href={`mailto:${request.email}`}
                                    className="
                                      truncate
                                      hover:text-blue-600
                                    "
                                  >
                                    {
                                      request.email
                                    }
                                  </a>
                                </div>
                              </div>

                              <div>
                                <p
                                  className="
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                  "
                                >
                                  {
                                    d.fields.phone
                                  }
                                </p>

                                <div
                                  className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-1.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >
                                  <Phone
                                    size={14}
                                  />

                                  <span>
                                    {
                                      request.phone ||
                                      d.fallback.noValue
                                    }
                                  </span>
                                </div>
                              </div>

                              <div>
                                <p
                                  className="
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                  "
                                >
                                  {
                                    d.fields.location
                                  }
                                </p>

                                <div
                                  className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-1.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >
                                  <MapPin
                                    size={14}
                                  />

                                  <span>
                                    {
                                      location ||
                                      d.fallback.noValue
                                    }
                                  </span>
                                </div>
                              </div>

                              <div>
                                <p
                                  className="
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                  "
                                >
                                  {
                                    d.fields.date
                                  }
                                </p>

                                <div
                                  className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-1.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >
                                  <CalendarDays
                                    size={14}
                                  />

                                  <span>
                                    {
                                      createdAt ||
                                      d.fallback.noValue
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>


                            <div
                              className="
                                mt-5
                                grid
                                gap-4
                                lg:grid-cols-2
                              "
                            >
                              <div
                                className="
                                  rounded-xl
                                  border
                                  border-slate-100
                                  bg-slate-50
                                  p-4
                                "
                              >
                                <p
                                  className="
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                  "
                                >
                                  {
                                    d.fields.propertyType
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >
                                  {
                                    request.property_type ||
                                    d.fallback.noValue
                                  }
                                </p>
                              </div>

                              <div
                                className="
                                  rounded-xl
                                  border
                                  border-slate-100
                                  bg-slate-50
                                  p-4
                                "
                              >
                                <p
                                  className="
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                  "
                                >
                                  {
                                    d.fields.client
                                  }
                                </p>

                                {request.contact_id ? (
                                  <Link
                                    href={`/admin/leads/${request.contact_id}`}
                                    className="
                                      mt-1
                                      inline-flex
                                      items-center
                                      gap-2
                                      text-sm
                                      font-black
                                      text-blue-600
                                      hover:text-blue-700
                                    "
                                  >
                                    <UserRound
                                      size={15}
                                    />

                                    {
                                      d.actions.openClient
                                    }
                                  </Link>
                                ) : (
                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      font-semibold
                                      text-slate-500
                                    "
                                  >
                                    {
                                      d.fallback.noClient
                                    }
                                  </p>
                                )}
                              </div>
                            </div>


                            <div
                              className="
                                mt-5
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-4
                              "
                            >
                              <p
                                className="
                                  text-xs
                                  font-semibold
                                  text-slate-400
                                "
                              >
                                {
                                  d.fields.message
                                }
                              </p>

                              <p
                                className="
                                  mt-2
                                  whitespace-pre-wrap
                                  text-sm
                                  leading-6
                                  text-slate-700
                                "
                              >
                                {
                                  request.message
                                }
                              </p>
                            </div>


                            {request.photo_urls.length >
                            0 ? (
                              <div
                                className="
                                  mt-5
                                  rounded-xl
                                  border
                                  border-blue-100
                                  bg-blue-50/50
                                  p-4
                                "
                              >
                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >
                                  <ImageIcon
                                    size={16}
                                    className="
                                      text-blue-600
                                    "
                                  />

                                  <p
                                    className="
                                      text-sm
                                      font-black
                                      text-slate-900
                                    "
                                  >
                                    {
                                      d.fields.photos
                                    }{" "}
                                    (
                                    {
                                      request.photo_urls
                                        .length
                                    }
                                    )
                                  </p>
                                </div>

                                <div
                                  className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    gap-2
                                  "
                                >
                                  {
                                    request.photo_urls.map(
                                      (
                                        url,
                                        index
                                      ) => (
                                        <a
                                          key={`${request.id}-${url}`}
                                          href={
                                            url
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-blue-200
                                            bg-white
                                            px-3
                                            py-2
                                            text-sm
                                            font-bold
                                            text-blue-700
                                            transition
                                            hover:border-blue-300
                                            hover:bg-blue-50
                                          "
                                        >
                                          {
                                            d.fields.photo
                                          }{" "}
                                          {
                                            index +
                                            1
                                          }

                                          <ExternalLink
                                            size={14}
                                          />
                                        </a>
                                      )
                                    )
                                  }
                                </div>
                              </div>
                            ) : null}
                          </article>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-slate-200
                      bg-white
                      p-8
                      text-center
                      text-sm
                      font-semibold
                      text-slate-400
                    "
                  >
                    {
                      group.key ===
                      "unanswered"
                        ? d.sections.unanswered
                            .empty
                        : d.sections.answered
                            .empty
                    }
                  </div>
                )}
              </div>
            </details>
          )
        )}
      </section>
    </div>
  );
}
