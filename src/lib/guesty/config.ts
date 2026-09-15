export const guestyConfig = {
  clientId: process.env.GUESTY_CLIENT_ID ?? "",
  clientSecret: process.env.GUESTY_CLIENT_SECRET ?? "",

  authUrl:
    "https://booking.guesty.com/oauth2/token",

  apiBaseUrl:
    "https://booking.guesty.com/api",
} as const;

export const isGuestyConfigured =
  Boolean(
    guestyConfig.clientId &&
    guestyConfig.clientSecret
  );