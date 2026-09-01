"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
} from "lucide-react";


type AdminSaveToastProps = {
  show: boolean;
};


export default function AdminSaveToast({
  show,
}: AdminSaveToastProps) {

  const [
    visible,
    setVisible,
  ] =
    useState(show);


  useEffect(
    () => {

      if (!show) {
        setVisible(false);
        return;
      }


      setVisible(true);


      const timer =
        window.setTimeout(
          () => {

            setVisible(false);


            const url =
              new URL(
                window.location.href
              );


            url.searchParams.delete(
              "saved"
            );


            window.history.replaceState(
              {},
              "",
              `${url.pathname}${url.search}${url.hash}`
            );

          },
          1000
        );


      return () => {
        window.clearTimeout(
          timer
        );
      };

    },
    [show]
  );


  if (!visible) {
    return null;
  }


  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed
        left-3
        right-3
        top-3
        z-[100]
        mx-auto
        w-auto
        max-w-sm

        rounded-xl
        border
        border-emerald-200
        bg-emerald-50

        px-3.5
        py-3

        text-emerald-900
        shadow-xl

        sm:left-auto
        sm:right-6
        sm:top-6
        sm:mx-0
        sm:w-[calc(100%-3rem)]
        sm:rounded-2xl
        sm:px-4
      "
    >

      <div
        className="
          flex
          min-w-0
          items-start
          gap-2.5
          sm:gap-3
        "
      >

        <CheckCircle2
          className="
            mt-0.5
            h-5
            w-5
            shrink-0
            text-emerald-600
          "
        />


        <div className="min-w-0">

          <p
            className="
              break-words
              text-sm
              font-black
              leading-5
              sm:text-base
              sm:leading-6
            "
          >
            Οι αλλαγές αποθηκεύτηκαν επιτυχώς
          </p>


          <p
            className="
              mt-0.5
              break-words
              text-xs
              font-semibold
              leading-5
              text-emerald-700
              sm:text-sm
            "
          >
            Τα ενημερωμένα στοιχεία έχουν αποθηκευτεί.
          </p>

        </div>

      </div>

    </div>
  );
}
