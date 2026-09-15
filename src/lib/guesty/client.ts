import { guestyConfig } from "@/lib/guesty/config";
import {
  clearGuestyAccessTokenCache,
  getGuestyAccessToken,
} from "@/lib/guesty/auth";

type GuestyRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

async function executeGuestyRequest<T>(
  path: string,
  options: GuestyRequestOptions = {},
  retryOnUnauthorized = true
): Promise<T> {
  const accessToken =
    await getGuestyAccessToken();

  const response = await fetch(
    `${guestyConfig.apiBaseUrl}${path}`,
    {
      method: options.method ?? "GET",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(options.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),
        ...options.headers,
      },

      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,

      cache: "no-store",
    }
  );

  if (
    response.status === 401 &&
    retryOnUnauthorized
  ) {
    clearGuestyAccessTokenCache();

    return executeGuestyRequest<T>(
      path,
      options,
      false
    );
  }

  if (!response.ok) {
    const responseText =
      await response.text();

    console.error(
      "Guesty API request failed:",
      response.status,
      responseText
    );

    throw new Error(
      `Guesty API request failed with status ${response.status}.`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const guestyClient = {
  get<T>(path: string) {
    return executeGuestyRequest<T>(
      path
    );
  },

  post<T>(
    path: string,
    body?: unknown
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method: "POST",
        body,
      }
    );
  },

  put<T>(
    path: string,
    body?: unknown
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method: "PUT",
        body,
      }
    );
  },

  patch<T>(
    path: string,
    body?: unknown
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method: "PATCH",
        body,
      }
    );
  },

  delete<T>(path: string) {
    return executeGuestyRequest<T>(
      path,
      {
        method: "DELETE",
      }
    );
  },
};