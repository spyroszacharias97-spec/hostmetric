import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function GuestRatingPage() {
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

  const guestRating =
    dictionary.guestRatingPage;

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.82)), url('/insights/guest-rating.jpg')",
      }}
    >

      <div className="mx-auto max-w-6xl px-8 py-20">

        <Link
          href="/"
          className="text-lg font-medium text-blue-300 transition hover:text-white"
        >
          ← {guestRating.back}
        </Link>

        <div className="mt-24 max-w-5xl">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
            {guestRating.eyebrow}
          </p>

          <h1 className="mt-6 text-6xl font-bold leading-tight">
            {guestRating.titleLine1}
            <br />
            {guestRating.titleLine2}
          </h1>

          <p className="mt-8 max-w-4xl text-2xl leading-10 text-gray-300">
            {guestRating.description}
          </p>


          <div className="mt-16 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl bg-white/10 p-9">

              <h2 className="text-3xl font-bold">
                {guestRating.cards.responseTime.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-300">
                {guestRating.cards.responseTime.description}
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-9">

              <h2 className="text-3xl font-bold">
                {guestRating.cards.issueResolution.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-300">
                {guestRating.cards.issueResolution.description}
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-9">

              <h2 className="text-3xl font-bold">
                {guestRating.cards.reviewIntelligence.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-300">
                {guestRating.cards.reviewIntelligence.description}
              </p>

            </div>


            <div className="rounded-3xl bg-white/10 p-9">

              <h2 className="text-3xl font-bold">
                {guestRating.cards.continuousImprovement.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-300">
                {guestRating.cards.continuousImprovement.description}
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}