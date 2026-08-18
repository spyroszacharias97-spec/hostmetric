import Link from "next/link";
import { cookies } from "next/headers";

import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";


const platforms = [
  {
    name: "Airbnb",
    logo: "/platforms/airbnb.png",
    className: "platform-1",
  },
  {
    name: "Booking.com",
    logo: "/platforms/booking.png",
    className: "platform-2",
  },
  {
    name: "Vrbo",
    logo: "/platforms/vrbo.png",
    className: "platform-3",
  },
  {
    name: "Expedia",
    logo: "/platforms/expedia.png",
    className: "platform-4",
  },
  {
    name: "Agoda",
    logo: "/platforms/agoda.png",
    className: "platform-5",
  },
  {
    name: "Trip.com",
    logo: "/platforms/tripcom.png",
    className: "platform-6",
  },
  {
    name: "Tripadvisor",
    logo: "/platforms/tripadvisor.png",
    className: "platform-7",
  },
  {
    name: "Trivago",
    logo: "/platforms/trivago.png",
    className: "platform-8",
  },
  {
    name: "Google",
    logo: "/platforms/google.png",
    className: "platform-9",
  },
  {
    name: "Skyscanner",
    logo: "/platforms/skyscanner.png",
    className: "platform-10",
  },
  {
    name: "Marriott",
    logo: "/platforms/marriott.png",
    className: "platform-11",
  },
  {
    name: "OneTwoTrip",
    logo: "/platforms/onetwotrip.png",
    className: "platform-12",
  },
];


export default async function PlatformOrbit() {
  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

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


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  const dictionary =
    await getDictionary(currentLocale);

  const platformOrbit =
    dictionary.platformOrbit;


  return (
    <section className="platform-section">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="platform-orbit-area">

        <div className="orbit-ring orbit-ring-one" />
        <div className="orbit-ring orbit-ring-two" />
        <div className="orbit-ring orbit-ring-three" />


        {/* CLICKABLE PHONE */}
        <Link
          href="/performance/platform-network"
          className="platform-phone"
          aria-label={platformOrbit.phoneAriaLabel}
        >

          <div className="platform-phone-notch" />


          <p className="platform-phone-brand">
            HOSTMETRIC
          </p>


          <h3>
            {platformOrbit.phone.titleLine1}

            <br />

            {platformOrbit.phone.titleLine2}
          </h3>


          <div className="platform-phone-card platform-phone-blue">

            <span>
              {platformOrbit.phone.smartPricing}
            </span>

            <strong>
              {platformOrbit.phone.optimizing}
            </strong>

          </div>


          <div className="platform-phone-card platform-phone-green">

            <span>
              {platformOrbit.phone.guestCommunication}
            </span>

            <strong>
              {platformOrbit.phone.active}
            </strong>

          </div>


          <div className="platform-phone-card platform-phone-purple">

            <span>
              {platformOrbit.phone.reservations}
            </span>

            <strong>
              {platformOrbit.phone.synced}
            </strong>

          </div>


          <div className="platform-phone-status">

            <span className="status-dot" />

            {platformOrbit.phone.channelsConnected}

          </div>

        </Link>


        {/* NON-CLICKABLE PLATFORM LOGOS */}
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className={`platform-logo-card ${platform.className}`}
            style={{
              cursor: "default",
            }}
          >

            <img
              src={platform.logo}
              alt={`${platform.name} logo`}
            />


            <span>
              {platform.name}
            </span>

          </div>
        ))}

      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="platform-content">

        <span className="section-label">
          {platformOrbit.eyebrow}
        </span>


        <h2>
          {platformOrbit.titleLine1}

          <br />

          {platformOrbit.titleLine2}
        </h2>


        <p className="platform-description">
          {platformOrbit.description}
        </p>


        <div className="platform-benefits">

          {/* GREATER VISIBILITY */}
          <Link
            href="/solutions/greater-visibility"
            className="platform-benefit"
          >

            <div>

              <h3>
                {
                  platformOrbit.benefits
                    .greaterVisibility.title
                }
              </h3>


              <p>
                {
                  platformOrbit.benefits
                    .greaterVisibility.description
                }
              </p>

            </div>


            <span className="benefit-arrow">
              →
            </span>

          </Link>


          {/* CENTRALIZED MANAGEMENT */}
          <Link
            href="/solutions/centralized-management"
            className="platform-benefit"
          >

            <div>

              <h3>
                {
                  platformOrbit.benefits
                    .centralizedManagement.title
                }
              </h3>


              <p>
                {
                  platformOrbit.benefits
                    .centralizedManagement.description
                }
              </p>

            </div>


            <span className="benefit-arrow">
              →
            </span>

          </Link>


          {/* SMARTER DISTRIBUTION */}
          <Link
            href="/solutions/smarter-distribution"
            className="platform-benefit"
          >

            <div>

              <h3>
                {
                  platformOrbit.benefits
                    .smarterDistribution.title
                }
              </h3>


              <p>
                {
                  platformOrbit.benefits
                    .smarterDistribution.description
                }
              </p>

            </div>


            <span className="benefit-arrow">
              →
            </span>

          </Link>

        </div>

      </div>

    </section>
  );
}