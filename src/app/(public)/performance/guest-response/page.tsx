import Link from "next/link";
import { cookies } from "next/headers";
import AnimatedWave from "@/components/animated-wave";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";
import {
  Clock3,
  MessagesSquare,
  HeartHandshake,
  Star,
} from "lucide-react";

export default async function GuestResponsePage() {
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

  const guestResponse =
    dictionary.guestResponsePage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-950">

      {/* ANIMATED WAVE */}
      <AnimatedWave />

      <div className="relative z-10 mx-auto max-w-6xl px-8 py-20">

        <Link
          href="/"
          className="text-lg font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← {guestResponse.back}
        </Link>

        <div className="mt-24 max-w-5xl">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            {guestResponse.eyebrow}
          </p>

          <h1 className="mt-6 text-6xl font-bold leading-tight">
            {guestResponse.titleLine1}
            <br />
            {guestResponse.titleLine2}
          </h1>

          <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-600">
            {guestResponse.description}
          </p>


          <div className="mt-16 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl bg-white/90 p-9 shadow-sm backdrop-blur-sm">

              <Clock3
                size={40}
                className="text-blue-600"
              />

              <h2 className="mt-6 text-3xl font-bold">
                {
                  guestResponse.cards
                    .continuousCoverage.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {
                  guestResponse.cards
                    .continuousCoverage.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/90 p-9 shadow-sm backdrop-blur-sm">

              <MessagesSquare
                size={40}
                className="text-blue-600"
              />

              <h2 className="mt-6 text-3xl font-bold">
                {
                  guestResponse.cards
                    .naturalCommunication.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {
                  guestResponse.cards
                    .naturalCommunication.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/90 p-9 shadow-sm backdrop-blur-sm">

              <HeartHandshake
                size={40}
                className="text-blue-600"
              />

              <h2 className="mt-6 text-3xl font-bold">
                {
                  guestResponse.cards
                    .hospitalityTraining.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {
                  guestResponse.cards
                    .hospitalityTraining.description
                }
              </p>

            </div>


            <div className="rounded-3xl bg-white/90 p-9 shadow-sm backdrop-blur-sm">

              <Star
                size={40}
                className="text-yellow-500"
              />

              <h2 className="mt-6 text-3xl font-bold">
                {
                  guestResponse.cards
                    .betterReviews.title
                }
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {
                  guestResponse.cards
                    .betterReviews.description
                }
              </p>

            </div>

          </div>


          <Link
            href="/get-started"
            className="mt-12 inline-block rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
          >
            {guestResponse.cta} →
          </Link>

        </div>

      </div>

    </main>
  );
}