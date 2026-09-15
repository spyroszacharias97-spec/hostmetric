import { guestyConfig, isGuestyConfigured } from "@/lib/guesty/config";

type GuestyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

type CachedGuestyToken = {
  accessToken: string;
  expiresAt: number;
};

let cachedToken: CachedGuestyToken | null = null;

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

export async function getGuestyAccessToken(): Promise<string> {
  if (!isGuestyConfigured) {
    throw new Error(
      "Guesty is not configured. Add GUESTY_CLIENT_ID and GUESTY_CLIENT_SECRET."
    );
  }

  const now = Date.now();

  if (
    cachedToken &&
    cachedToken.expiresAt - TOKEN_EXPIRY_BUFFER_MS > now
  ) {
    return cachedToken.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "booking_engine:api",
    client_id: guestyConfig.clientId,
    client_secret: guestyConfig.clientSecret,
  });

  const response = await fetch(guestyConfig.authUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();

    console.error(
      "Guesty authentication failed:",
      response.status,
      responseText
    );

    throw new Error(
      `Guesty authentication failed with status ${response.status}.`
    );
  }

  const data = (await response.json()) as GuestyTokenResponse;

  if (
    !data.access_token ||
    !data.expires_in
  ) {
    throw new Error(
      "Guesty authentication returned an invalid token response."
    );
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt:
      now + data.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

export function clearGuestyAccessTokenCache() {
  cachedToken = null;
}
