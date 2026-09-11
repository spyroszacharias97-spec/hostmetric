"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

type AdminPropertyStatusButtonProps = {
  propertyId: number;
  currentStatus: string | null;
  activateLabel: string;
  deactivateLabel?: string;
};

export default function AdminPropertyStatusButton({
  propertyId,
  currentStatus,
  activateLabel,
  deactivateLabel = "Απενεργοποίηση ακινήτου",
}: AdminPropertyStatusButtonProps) {
  const router = useRouter();

  const [saving, setSaving] =
    useState(false);

  const isActive =
    currentStatus === "active";

  const nextStatus =
    isActive ? "inactive" : "active";

  const buttonLabel =
    isActive
      ? deactivateLabel
      : activateLabel;

  async function updatePropertyStatus() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          `/api/admin/properties/${propertyId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              status: nextStatus,
            }),
          }
        );

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
            "Η αλλαγή κατάστασης απέτυχε."
        );
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Η αλλαγή κατάστασης απέτυχε."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={updatePropertyStatus}
      disabled={saving}
      className={[
        "pointer-events-auto relative z-30 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-black transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        isActive
          ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
      ].join(" ")}
    >
      {isActive ? (
        <ShieldCheck size={16} />
      ) : (
        <CheckCircle2 size={16} />
      )}

      {saving
        ? "..."
        : buttonLabel}
    </button>
  );
}
