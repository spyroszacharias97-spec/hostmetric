"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type AdminDeleteButtonProps = {
  endpoint: string;
  label?: string;
  confirmMessage: string;
  redirectTo?: string;
  compact?: boolean;
};

export default function AdminDeleteButton({
  endpoint,
  label = "Διαγραφή",
  confirmMessage,
  redirectTo,
  compact = false,
}: AdminDeleteButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  async function handleDelete() {
    if (deleting) {
      return;
    }

    const confirmed =
      window.confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response =
        await fetch(endpoint, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        });

      const payload =
        (await response.json().catch(
          () => null
        )) as
          | {
              success?: boolean;
              error?: string;
            }
          | null;

      if (!response.ok) {
        throw new Error(
          payload?.error ||
            "Η διαγραφή απέτυχε."
        );
      }

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Η διαγραφή απέτυχε."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className={[
        "pointer-events-auto relative z-30 inline-flex cursor-pointer items-center justify-center gap-2 font-black transition",
        "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700",
        "disabled:cursor-not-allowed disabled:opacity-60",
        compact
          ? "rounded-xl px-3 py-2 text-sm"
          : "rounded-xl px-4 py-3 text-sm",
      ].join(" ")}
    >
      <Trash2
        size={compact ? 16 : 17}
      />

      {deleting
        ? "Διαγραφή..."
        : label}
    </button>
  );
}
