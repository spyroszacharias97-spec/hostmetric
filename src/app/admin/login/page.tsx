import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <p className="text-2xl font-black tracking-tight text-slate-950">
            HostMetric
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
            Admin Console
          </p>

        </div>


        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            HostMetric Admin
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Σύνδεση
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Η πρόσβαση επιτρέπεται μόνο σε εξουσιοδοτημένους διαχειριστές της HostMetric.
          </p>


          <form
            className="mt-8"
            action={async () => {
              "use server";

              await signIn("google", {
                redirectTo: "/admin",
              });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg"
            >

              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M21.35 11.1H12v2.98h5.38c-.23 1.52-1.74 4.45-5.38 4.45-3.24 0-5.88-2.68-5.88-5.98S8.76 6.57 12 6.57c1.84 0 3.08.79 3.79 1.47l2.58-2.49C16.71 4 14.56 3 12 3a9.55 9.55 0 0 0 0 19.1c5.51 0 9.16-3.87 9.16-9.31 0-.63-.07-1.11-.15-1.69z"
                />
              </svg>

              Συνέχεια με Google

            </button>
          </form>


          <div className="mt-6 border-t border-slate-100 pt-6">

            <p className="text-center text-xs leading-5 text-slate-400">
              Προστατευμένη περιοχή διαχείρισης HostMetric
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}