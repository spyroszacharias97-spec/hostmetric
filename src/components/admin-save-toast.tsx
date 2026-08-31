"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type AdminSaveToastProps = {
  show: boolean;
};

export default function AdminSaveToast({
  show,
}: AdminSaveToastProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);

      const url = new URL(window.location.href);
      url.searchParams.delete("saved");

      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`
      );
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [show]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed
        right-4
        top-4
        z-[100]
        w-[calc(100%-2rem)]
        max-w-sm
        rounded-2xl
        border
        border-emerald-200
        bg-emerald-50
        px-4
        py-3
        text-emerald-900
        shadow-xl
        sm:right-6
        sm:top-6
      "
    >
      <div className="flex items-start gap-3">
        <CheckCircle2
          size={20}
          className="mt-0.5 shrink-0 text-emerald-600"
        />

        <div>
          <p className="font-black">
            Οι αλλαγές αποθηκεύτηκαν επιτυχώς
          </p>

          <p className="mt-0.5 text-sm font-semibold text-emerald-700">
            Τα ενημερωμένα στοιχεία έχουν αποθηκευτεί.
          </p>
        </div>
      </div>
    </div>
  );
}
