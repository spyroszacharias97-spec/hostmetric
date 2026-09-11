"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EyeOff,
  Loader2,
  Rocket,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import type { GuideStatus } from "@/content/guides/types";

type AdminGuideListActionsProps = {
  guideId: number;
  guideTitle: string;
  status: GuideStatus;
  openLabel: string;
  publishLabel: string;
};

type PendingAction =
  | "publish"
  | "unpublish"
  | "delete"
  | null;

const actionButtonClass =
  "inline-flex h-11 w-[126px] items-center justify-center gap-2 rounded-xl px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminGuideListActions({
  guideId,
  guideTitle,
  status,
  openLabel,
  publishLabel,
}: AdminGuideListActionsProps) {
  const router = useRouter();

  const [
    pendingAction,
    setPendingAction,
  ] = useState<PendingAction>(null);

  const [error, setError] =
    useState("");

  async function handlePublish() {
    const confirmed = window.confirm(
      `Είστε σίγουροι ότι θέλετε να δημοσιεύσετε το άρθρο «${guideTitle}»;\n\nΘα γίνει δημόσιο και θα μπορεί να εμφανιστεί στις μηχανές αναζήτησης σύμφωνα με τους κανόνες δημοσίευσης.`
    );

    if (!confirmed) {
      return;
    }

    setPendingAction("publish");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/list-actions`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "publish",
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Δεν ήταν δυνατή η δημοσίευση του άρθρου."
        );
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Δεν ήταν δυνατή η δημοσίευση του άρθρου."
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleUnpublish() {
    const confirmed = window.confirm(
      `Είστε σίγουροι ότι θέλετε να αποκρύψετε το άρθρο «${guideTitle}»;\n\nΘα γίνει μη δημοσιευμένο και δεν θα εμφανίζεται δημόσια.`
    );

    if (!confirmed) {
      return;
    }

    setPendingAction("unpublish");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/list-actions`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "unpublish",
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Δεν ήταν δυνατή η απόκρυψη του άρθρου."
        );
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Δεν ήταν δυνατή η απόκρυψη του άρθρου."
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά το άρθρο «${guideTitle}»;\n\nΘα διαγραφούν και όλες οι μεταφράσεις του. Η ενέργεια δεν αναιρείται.`
    );

    if (!confirmed) {
      return;
    }

    setPendingAction("delete");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/guides/${guideId}/list-actions`,
        {
          method: "DELETE",
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Δεν ήταν δυνατή η διαγραφή του άρθρου."
        );
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Δεν ήταν δυνατή η διαγραφή του άρθρου."
      );
    } finally {
      setPendingAction(null);
    }
  }

  const busy =
    pendingAction !== null;

  return (
    <div className="flex flex-col items-end gap-2">
      <Link
        href={`/admin/guides/${guideId}`}
        className={`${actionButtonClass} border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
      >
        {openLabel}
      </Link>

      {status !== "published" ? (
        <button
          type="button"
          onClick={handlePublish}
          disabled={busy}
          className={`${actionButtonClass} border border-blue-600 bg-blue-600 text-white hover:bg-blue-700`}
        >
          {pendingAction ===
          "publish" ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Rocket size={15} />
          )}

          {publishLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleUnpublish}
          disabled={busy}
          className={`${actionButtonClass} border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100`}
        >
          {pendingAction ===
          "unpublish" ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <EyeOff size={15} />
          )}

          Απόκρυψη
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className={`${actionButtonClass} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
      >
        {pendingAction ===
        "delete" ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}

        Διαγραφή
      </button>

      {error ? (
        <p className="max-w-[260px] text-right text-xs font-bold leading-5 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
