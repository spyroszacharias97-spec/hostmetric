import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function BookingManagementPage() {
  const cookieStore = await cookies();

  const savedLocale =
    cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale =
    defaultLocale;

  if (
    savedLocale &&
    isSupportedLocale(savedLocale)
  ) {
    currentLocale = savedLocale;
  }

  const dictionary =
    await getDictionary(currentLocale);

  const bookingManagement =
    dictionary.bookingManagementPage;

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3, 37, 65, 0.58), rgba(3, 37, 65, 0.68)), url('/services/booking-management.jpg')",
      }}
    >

      <div className="mx-auto max-w-6xl px-8 py-20">

        <Link
          href="/"
          className="text-lg font-medium transition duration-300 hover:text-sky-200"
        >
          ← {bookingManagement.back}
        </Link>

        <div className="mt-24 max-w-5xl">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-200">
            {bookingManagement.eyebrow}
          </p>

          <h1 className="mt-6 text-6xl font-bold leading-tight">
            {bookingManagement.titleLine1}
            <br />
            {bookingManagement.titleLine2}
          </h1>

          <p className="mt-8 max-w-4xl text-2xl leading-10 text-white/90">
            {bookingManagement.description}
          </p>


          <div className="mt-16 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-white/20 bg-white/15 p-9 backdrop-blur-md">

              <h2 className="text-3xl font-bold">
                {
                  bookingManagement.cards
                    .calendarSynchronization.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/85">
                {
                  bookingManagement.cards
                    .calendarSynchronization.description
                }
              </p>

            </div>


            <div className="rounded-3xl border border-white/20 bg-white/15 p-9 backdrop-blur-md">

              <h2 className="text-3xl font-bold">
                {
                  bookingManagement.cards
                    .availabilityManagement.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/85">
                {
                  bookingManagement.cards
                    .availabilityManagement.description
                }
              </p>

            </div>


            <div className="rounded-3xl border border-white/20 bg-white/15 p-9 backdrop-blur-md">

              <h2 className="text-3xl font-bold">
                {
                  bookingManagement.cards
                    .lengthOfStayControls.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/85">
                {
                  bookingManagement.cards
                    .lengthOfStayControls.description
                }
              </p>

            </div>


            <div className="rounded-3xl border border-white/20 bg-white/15 p-9 backdrop-blur-md">

              <h2 className="text-3xl font-bold">
                {
                  bookingManagement.cards
                    .gapNightManagement.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/85">
                {
                  bookingManagement.cards
                    .gapNightManagement.description
                }
              </p>

            </div>


            <div className="rounded-3xl border border-white/20 bg-white/15 p-9 backdrop-blur-md">

              <h2 className="text-3xl font-bold">
                {
                  bookingManagement.cards
                    .bookingPace.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/85">
                {
                  bookingManagement.cards
                    .bookingPace.description
                }
              </p>

            </div>


            <div className="rounded-3xl border border-white/20 bg-white/15 p-9 backdrop-blur-md">

              <h2 className="text-3xl font-bold">
                {
                  bookingManagement.cards
                    .multiChannelCoordination.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/85">
                {
                  bookingManagement.cards
                    .multiChannelCoordination.description
                }
              </p>

            </div>

          </div>


          <div className="mt-10 rounded-3xl border border-white/20 bg-white/15 p-10 backdrop-blur-md">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-200">
              {bookingManagement.connectedStrategy.eyebrow}
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              {bookingManagement.connectedStrategy.title}
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/85">
              {bookingManagement.connectedStrategy.description}
            </p>

          </div>


          <Link
            href="/get-started"
            className="mt-12 inline-block rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:scale-105"
          >
            {bookingManagement.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}