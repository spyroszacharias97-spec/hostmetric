import AnimatedWave from "@/components/animated-wave";
import OnboardingForm from "@/components/onboarding-form";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

export default async function GetStartedPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("hostmetric_locale")?.value;

  let currentLocale: Locale = defaultLocale;

  if (savedLocale && isSupportedLocale(savedLocale)) {
    currentLocale = savedLocale;
  }

  const dictionary = await getDictionary(currentLocale);
  const getStarted = dictionary.getStartedPage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-6 py-20 md:px-10">

      <AnimatedWave />

      <div className="relative z-10 mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            {getStarted.hero.eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-7xl">
            {getStarted.hero.title}
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-slate-600">
            {getStarted.hero.description}
          </p>
        </div>

        <OnboardingForm dictionary={dictionary.onboardingForm} />

      </div>
    </main>
  );
}