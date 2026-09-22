import {
  neon,
} from "@neondatabase/serverless";

export const guestyConfig = {
  authUrl:
    "https://booking.guesty.com/oauth2/token",

  apiBaseUrl:
    "https://booking.guesty.com/api",
} as const;

export type GuestyCredentials = {
  clientId: string;
  clientSecret: string;
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

export async function getGuestyCredentials():
  Promise<GuestyCredentials | null> {
  const sql =
    getSql();

  const rows =
    await sql`
      SELECT
        client_id,
        client_secret
      FROM guesty_connection
      WHERE id = 1
      LIMIT 1;
    `;

  const row =
    rows[0];

  if (!row) {
    return null;
  }

  const clientId =
    String(
      row.client_id ?? ""
    ).trim();

  const clientSecret =
    String(
      row.client_secret ?? ""
    ).trim();

  if (
    !clientId ||
    !clientSecret
  ) {
    return null;
  }

  return {
    clientId,
    clientSecret,
  };
}

export async function isGuestyConfigured():
  Promise<boolean> {
  const credentials =
    await getGuestyCredentials();

  return Boolean(
    credentials?.clientId &&
    credentials?.clientSecret
  );
}
