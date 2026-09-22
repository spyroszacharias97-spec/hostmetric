import {
  getGuestyCredentials,
  guestyConfig,
} from "@/lib/guesty/config";

type GuestyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

type CachedGuestyToken = {
  accessToken: string;
  expiresAt: number;
  credentialsKey: string;
};

let cachedToken:
  CachedGuestyToken | null =
  null;

const TOKEN_EXPIRY_BUFFER_MS =
  5 * 60 * 1000;

function getCredentialsKey(
  clientId: string,
  clientSecret: string
) {
  return `${clientId}:${clientSecret}`;
}

export async function getGuestyAccessToken():
  Promise<string> {
  const credentials =
    await getGuestyCredentials();

  if (!credentials) {
    throw new Error(
      "Guesty is not configured."
    );
  }

  const now =
    Date.now();

  const credentialsKey =
    getCredentialsKey(
      credentials.clientId,
      credentials.clientSecret
    );

  if (
    cachedToken &&
    cachedToken.credentialsKey ===
      credentialsKey &&
    cachedToken.expiresAt -
      TOKEN_EXPIRY_BUFFER_MS >
      now
  ) {
    return cachedToken.accessToken;
  }

  const body =
    new URLSearchParams({
      grant_type:
        "client_credentials",

      scope:
        "booking_engine:api",

      client_id:
        credentials.clientId,

      client_secret:
        credentials.clientSecret,
    });

  const response =
    await fetch(
      guestyConfig.authUrl,
      {
        method:
          "POST",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/x-www-form-urlencoded",

          "Cache-Control":
            "no-cache",
        },

        body,

        cache:
          "no-store",
      }
    );

  if (!response.ok) {
    const responseText =
      await response.text();

    console.error(
      "Guesty authentication failed:",
      response.status,
      responseText
    );

    throw new Error(
      `Guesty authentication failed with status ${response.status}.`
    );
  }

  const data =
    (await response.json()) as
      GuestyTokenResponse;

  if (
    !data.access_token ||
    !data.expires_in
  ) {
    throw new Error(
      "Guesty authentication returned an invalid token response."
    );
  }

  cachedToken = {
    accessToken:
      data.access_token,

    expiresAt:
      now +
      data.expires_in *
        1000,

    credentialsKey,
  };

  return cachedToken.accessToken;
}

export function clearGuestyAccessTokenCache() {
  cachedToken =
    null;
}
