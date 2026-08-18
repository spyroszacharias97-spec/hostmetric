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
  Laptop,
  RefreshCw,
  CalendarSync,
  Globe2,
  Layers3,
} from "lucide-react";

const platforms = [
  {
    name: "Airbnb",
    logo: "/platforms/airbnb.png",
  },
  {
    name: "Booking.com",
    logo: "/platforms/booking.png",
  },
  {
    name: "Vrbo",
    logo: "/platforms/vrbo.png",
  },
  {
    name: "Expedia",
    logo: "/platforms/expedia.png",
  },
  {
    name: "Agoda",
    logo: "/platforms/agoda.png",
  },
  {
    name: "Trip.com",
    logo: "/platforms/tripcom.png",
  },
  {
    name: "Tripadvisor",
    logo: "/platforms/tripadvisor.png",
  },
  {
    name: "Trivago",
    logo: "/platforms/trivago.png",
  },
  {
    name: "Google",
    logo: "/platforms/google.png",
  },
  {
    name: "Skyscanner",
    logo: "/platforms/skyscanner.png",
  },
  {
    name: "Marriott",
    logo: "/platforms/marriott.png",
  },
  {
    name: "OneTwoTrip",
    logo: "/platforms/onetwotrip.png",
  },
];

export default async function PlatformNetworkPage() {
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

  const platformNetwork =
    dictionary.platformNetworkPage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">

      {/* ANIMATED WAVE */}
      <AnimatedWave />

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-20">

        <Link
          href="/"
          className="text-lg font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← {platformNetwork.back}
        </Link>


        <div className="mt-20 grid items-center gap-20 lg:grid-cols-2">

          {/* LEFT - ROTATING NETWORK */}
          <div className="platform-network-orbit">

            <div className="platform-network-center">

              <Laptop size={72} />

              <p>
                HOSTMETRIC
              </p>

              <strong>
                {platformNetwork.center.titleLine1}
                <br />
                {platformNetwork.center.titleLine2}
              </strong>

              <span>
                <RefreshCw size={14} />
                {platformNetwork.center.status}
              </span>

            </div>


            <div className="platform-network-spinner">

              {platforms.map((platform, index) => {
                const angle =
                  index * (360 / platforms.length);

                return (
                  <div
                    key={platform.name}
                    className="network-orbit-position"
                    style={{
                      transform: `rotate(${angle}deg) translateX(260px)`,
                    }}
                  >

                    {/* Keeps initial position upright */}
                    <div
                      style={{
                        transform: `rotate(-${angle}deg)`,
                      }}
                    >

                      {/* Keeps logo upright during orbit */}
                      <div
                        className="network-logo"
                        style={{
                          cursor: "default",
                          animation:
                            "network-counter-rotation 45s linear infinite",
                        }}
                      >
                        <img
                          src={platform.logo}
                          alt={`${platform.name} logo`}
                        />
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              {platformNetwork.eyebrow}
            </p>

            <h1 className="mt-6 text-6xl font-bold leading-tight">
              {platformNetwork.titleLine1}
              <br />
              {platformNetwork.titleLine2}
              <br />
              {platformNetwork.titleLine3}
            </h1>

            <p className="mt-8 text-2xl leading-10 text-slate-600">
              {platformNetwork.description}
            </p>


            {/* PLATFORM LIST */}
            <div className="mt-10 grid grid-cols-2 gap-3">

              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 font-semibold text-slate-700 backdrop-blur-sm"
                >
                  ✓ {platform.name}
                </div>
              ))}

            </div>


            {/* CALENDAR SYNC */}
            <div className="mt-10 rounded-3xl bg-blue-600 p-8 text-white">

              <div className="flex items-center gap-4">

                <CalendarSync size={34} />

                <h2 className="text-2xl font-bold">
                  {platformNetwork.calendarSync.title}
                </h2>

              </div>

              <p className="mt-4 text-lg leading-8 text-blue-50">
                {platformNetwork.calendarSync.description}
              </p>

            </div>


            {/* EXTRA INFORMATION */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 backdrop-blur-sm">

                <Globe2
                  size={28}
                  className="text-blue-600"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {platformNetwork.widerDistribution.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {platformNetwork.widerDistribution.description}
                </p>

              </div>


              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 backdrop-blur-sm">

                <Layers3
                  size={28}
                  className="text-blue-600"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {platformNetwork.coordinatedStrategy.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {platformNetwork.coordinatedStrategy.description}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}