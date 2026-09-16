import { guestyConfig } from "@/lib/guesty/config";
import {
  clearGuestyAccessTokenCache,
  getGuestyAccessToken,
} from "@/lib/guesty/auth";

type GuestyRequestOptions = {
  method?:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  body?: unknown;

  headers?: Record<
    string,
    string
  >;
};

const MAX_RATE_LIMIT_RETRIES =
  3;

const BASE_RETRY_DELAY_MS =
  1000;

const MAX_RETRY_DELAY_MS =
  10000;


function sleep(
  milliseconds:
    number
) {
  return new Promise<void>(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}


function getRetryAfterMilliseconds(
  response:
    Response
) {
  const retryAfter =
    response.headers.get(
      "retry-after"
    );

  if (!retryAfter) {
    return null;
  }

  const seconds =
    Number(retryAfter);

  if (
    Number.isFinite(seconds) &&
    seconds >= 0
  ) {
    return Math.min(
      seconds * 1000,
      MAX_RETRY_DELAY_MS
    );
  }

  const retryDate =
    Date.parse(
      retryAfter
    );

  if (
    Number.isNaN(
      retryDate
    )
  ) {
    return null;
  }

  return Math.min(
    Math.max(
      retryDate -
        Date.now(),
      0
    ),
    MAX_RETRY_DELAY_MS
  );
}


function getBackoffDelay(
  retryAttempt:
    number
) {
  const exponentialDelay =
    BASE_RETRY_DELAY_MS *
    2 ** retryAttempt;

  const jitter =
    Math.random() *
    BASE_RETRY_DELAY_MS;

  return Math.min(
    exponentialDelay +
      jitter,
    MAX_RETRY_DELAY_MS
  );
}


async function executeGuestyRequest<T>(
  path:
    string,

  options:
    GuestyRequestOptions = {},

  retryOnUnauthorized =
    true,

  rateLimitRetryAttempt =
    0
): Promise<T> {
  const accessToken =
    await getGuestyAccessToken();

  const response =
    await fetch(
      `${guestyConfig.apiBaseUrl}${path}`,
      {
        method:
          options.method ??
          "GET",

        headers: {
          Accept:
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,

          ...(options.body !==
          undefined
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),

          ...options.headers,
        },

        body:
          options.body !==
          undefined
            ? JSON.stringify(
                options.body
              )
            : undefined,

        cache:
          "no-store",
      }
    );


  if (
    response.status ===
      401 &&
    retryOnUnauthorized
  ) {
    clearGuestyAccessTokenCache();

    return executeGuestyRequest<T>(
      path,
      options,
      false,
      rateLimitRetryAttempt
    );
  }


  if (
    response.status ===
      429 &&
    rateLimitRetryAttempt <
      MAX_RATE_LIMIT_RETRIES
  ) {
    const retryAfterDelay =
      getRetryAfterMilliseconds(
        response
      );

    const delay =
      retryAfterDelay ??
      getBackoffDelay(
        rateLimitRetryAttempt
      );

    console.warn(
      "Guesty API rate limit reached.",
      {
        status:
          response.status,

        retryAttempt:
          rateLimitRetryAttempt +
          1,

        retryInMs:
          Math.round(
            delay
          ),
      }
    );

    await sleep(delay);

    return executeGuestyRequest<T>(
      path,
      options,
      retryOnUnauthorized,
      rateLimitRetryAttempt +
        1
    );
  }


  if (!response.ok) {
    console.error(
      "Guesty API request failed.",
      {
        status:
          response.status,

        statusText:
          response.statusText,
      }
    );

    throw new Error(
      `Guesty API request failed with status ${response.status}.`
    );
  }


  if (
    response.status ===
    204
  ) {
    return undefined as T;
  }


  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    !contentType
      ?.toLowerCase()
      .includes(
        "application/json"
      )
  ) {
    const responseText =
      await response.text();

    if (
      !responseText.trim()
    ) {
      return undefined as T;
    }

    throw new Error(
      "Guesty API returned an unexpected non-JSON response."
    );
  }


  return (
    await response.json()
  ) as T;
}


export const guestyClient = {
  get<T>(
    path:
      string
  ) {
    return executeGuestyRequest<T>(
      path
    );
  },


  post<T>(
    path:
      string,

    body?:
      unknown
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method:
          "POST",

        body,
      }
    );
  },


  put<T>(
    path:
      string,

    body?:
      unknown
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method:
          "PUT",

        body,
      }
    );
  },


  patch<T>(
    path:
      string,

    body?:
      unknown
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method:
          "PATCH",

        body,
      }
    );
  },


  delete<T>(
    path:
      string
  ) {
    return executeGuestyRequest<T>(
      path,
      {
        method:
          "DELETE",
      }
    );
  },
};