"use client";

import {
  ArrowLeft,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Copy,
  Home,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type ReservationConfirmation = {
  id: string;
  status: string | null;
  confirmationCode: string | null;
  createdAt: string | null;
};

type ReservationResponse = {
  bookingSessionToken?: string;
  reservation?: ReservationConfirmation;
  error?: string;
};

function formatCreatedAt(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeStatus(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export default function BookingConfirmationPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const propertyId =
    typeof params?.id === "string"
      ? params.id
      : "";

  const bookingSessionToken =
    searchParams.get("bookingSessionToken")?.trim() ?? "";

  const [reservation, setReservation] =
    useState<ReservationConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadReservation = useCallback(
    async (isRefresh = false) => {
      if (!bookingSessionToken) {
        setError(
          "The booking confirmation link is incomplete."
        );
        setLoading(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(
          `/api/booking/reservation/${encodeURIComponent(
            bookingSessionToken
          )}`,
          {
            cache: "no-store",
          }
        );

        const data =
          (await response.json()) as ReservationResponse;

        if (!response.ok || !data.reservation) {
          throw new Error(
            data.error ||
              "Unable to load your reservation confirmation."
          );
        }

        setReservation(data.reservation);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your reservation confirmation."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [bookingSessionToken]
  );

  useEffect(() => {
    void loadReservation();
  }, [loadReservation]);

  const status = normalizeStatus(reservation?.status);
  const confirmed = status === "confirmed";

  const createdAt = useMemo(
    () => formatCreatedAt(reservation?.createdAt ?? null),
    [reservation?.createdAt]
  );

  async function copyConfirmationCode() {
    const code = reservation?.confirmationCode;

    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[72vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-sky-700" />
            <h1 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-slate-950">
              Loading your booking
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We are securely retrieving the latest reservation status from Guesty.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !reservation) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href={propertyId ? `/book/${propertyId}` : "/book"}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 transition hover:text-sky-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to stays
          </Link>

          <div className="mx-auto mt-12 max-w-2xl rounded-[32px] border border-amber-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Clock3 className="h-6 w-6" />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              We could not load the confirmation
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {error ||
                "The reservation confirmation is not available yet."}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void loadReservation(true)}
                disabled={refreshing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : null}
                Try again
              </button>

              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Browse stays
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 transition hover:text-sky-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to stays
        </Link>

        <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div
            className={
              confirmed
                ? "border-b border-emerald-100 bg-emerald-50/70 px-6 py-8 sm:px-10 sm:py-10"
                : "border-b border-amber-100 bg-amber-50/70 px-6 py-8 sm:px-10 sm:py-10"
            }
          >
            <div
              className={
                confirmed
                  ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"
                  : "flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"
              }
            >
              {confirmed ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <Clock3 className="h-7 w-7" />
              )}
            </div>

            <p
              className={
                confirmed
                  ? "mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700"
                  : "mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700"
              }
            >
              {confirmed
                ? "Booking confirmed"
                : "Reservation received"}
            </p>

            <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {confirmed
                ? "Your stay is confirmed."
                : "Your reservation is being finalized."}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {confirmed
                ? "Guesty has confirmed your reservation. Keep your confirmation code somewhere safe for reference."
                : "We received the reservation, but Guesty has not returned a confirmed status yet. You can refresh the status below."}
            </p>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <section>
              <h2 className="text-xl font-semibold text-slate-950">
                Reservation details
              </h2>

              <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                <div className="flex items-start justify-between gap-6 px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize text-slate-950">
                      {reservation.status || "Pending"}
                    </p>
                  </div>

                  <span
                    className={
                      confirmed
                        ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                        : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                    }
                  >
                    {confirmed ? "Confirmed" : "Processing"}
                  </span>
                </div>

                <div className="px-4 py-4 sm:px-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Confirmation code
                  </p>

                  {reservation.confirmationCode ? (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="break-all text-lg font-bold tracking-[0.04em] text-slate-950">
                        {reservation.confirmationCode}
                      </p>

                      <button
                        type="button"
                        onClick={copyConfirmationCode}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      Not available yet
                    </p>
                  )}
                </div>

                {createdAt ? (
                  <div className="px-4 py-4 sm:px-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Created
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">
                      {createdAt}
                    </p>
                  </div>
                ) : null}
              </div>

              {!confirmed ? (
                <button
                  type="button"
                  onClick={() => void loadReservation(true)}
                  disabled={refreshing}
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshing ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarCheck2 className="h-4 w-4" />
                  )}
                  Refresh reservation status
                </button>
              ) : null}
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <ShieldCheck className="h-6 w-6 text-sky-700" />
                <h2 className="mt-4 text-sm font-semibold text-slate-950">
                  Secure booking
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Reservation status and confirmation details are retrieved securely from Guesty.
                </p>
              </div>

              <Link
                href={propertyId ? `/book/${propertyId}` : "/book"}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                View stay
              </Link>

              <Link
                href="/book"
                className="flex min-h-12 items-center justify-center rounded-xl bg-sky-800 px-4 text-sm font-semibold text-white transition hover:bg-sky-900"
              >
                Browse more stays
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
