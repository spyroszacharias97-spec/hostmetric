"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import * as CountryFlags from "country-flag-icons/react/3x2";

const phoneCountryCodes = [
  { country: "Afghanistan", flag: "🇦🇫", code: "+93" },
  { country: "Albania", flag: "🇦🇱", code: "+355" },
  { country: "Algeria", flag: "🇩🇿", code: "+213" },
  { country: "Andorra", flag: "🇦🇩", code: "+376" },
  { country: "Angola", flag: "🇦🇴", code: "+244" },
  { country: "Argentina", flag: "🇦🇷", code: "+54" },
  { country: "Armenia", flag: "🇦🇲", code: "+374" },
  { country: "Australia", flag: "🇦🇺", code: "+61" },
  { country: "Austria", flag: "🇦🇹", code: "+43" },
  { country: "Azerbaijan", flag: "🇦🇿", code: "+994" },
  { country: "Bahamas", flag: "🇧🇸", code: "+1-242" },
  { country: "Bahrain", flag: "🇧🇭", code: "+973" },
  { country: "Bangladesh", flag: "🇧🇩", code: "+880" },
  { country: "Barbados", flag: "🇧🇧", code: "+1-246" },
  { country: "Belarus", flag: "🇧🇾", code: "+375" },
  { country: "Belgium", flag: "🇧🇪", code: "+32" },
  { country: "Belize", flag: "🇧🇿", code: "+501" },
  { country: "Benin", flag: "🇧🇯", code: "+229" },
  { country: "Bhutan", flag: "🇧🇹", code: "+975" },
  { country: "Bolivia", flag: "🇧🇴", code: "+591" },
  { country: "Bosnia and Herzegovina", flag: "🇧🇦", code: "+387" },
  { country: "Botswana", flag: "🇧🇼", code: "+267" },
  { country: "Brazil", flag: "🇧🇷", code: "+55" },
  { country: "Brunei", flag: "🇧🇳", code: "+673" },
  { country: "Bulgaria", flag: "🇧🇬", code: "+359" },
  { country: "Burkina Faso", flag: "🇧🇫", code: "+226" },
  { country: "Burundi", flag: "🇧🇮", code: "+257" },
  { country: "Cambodia", flag: "🇰🇭", code: "+855" },
  { country: "Cameroon", flag: "🇨🇲", code: "+237" },
  { country: "Canada", flag: "🇨🇦", code: "+1" },
  { country: "Cape Verde", flag: "🇨🇻", code: "+238" },
  { country: "Central African Republic", flag: "🇨🇫", code: "+236" },
  { country: "Chad", flag: "🇹🇩", code: "+235" },
  { country: "Chile", flag: "🇨🇱", code: "+56" },
  { country: "China", flag: "🇨🇳", code: "+86" },
  { country: "Colombia", flag: "🇨🇴", code: "+57" },
  { country: "Comoros", flag: "🇰🇲", code: "+269" },
  { country: "Congo", flag: "🇨🇬", code: "+242" },
  { country: "Costa Rica", flag: "🇨🇷", code: "+506" },
  { country: "Croatia", flag: "🇭🇷", code: "+385" },
  { country: "Cuba", flag: "🇨🇺", code: "+53" },
  { country: "Cyprus", flag: "🇨🇾", code: "+357" },
  { country: "Czechia", flag: "🇨🇿", code: "+420" },
  { country: "Democratic Republic of the Congo", flag: "🇨🇩", code: "+243" },
  { country: "Denmark", flag: "🇩🇰", code: "+45" },
  { country: "Djibouti", flag: "🇩🇯", code: "+253" },
  { country: "Dominica", flag: "🇩🇲", code: "+1-767" },
  { country: "Dominican Republic", flag: "🇩🇴", code: "+1-809" },
  { country: "Ecuador", flag: "🇪🇨", code: "+593" },
  { country: "Egypt", flag: "🇪🇬", code: "+20" },
  { country: "El Salvador", flag: "🇸🇻", code: "+503" },
  { country: "Equatorial Guinea", flag: "🇬🇶", code: "+240" },
  { country: "Eritrea", flag: "🇪🇷", code: "+291" },
  { country: "Estonia", flag: "🇪🇪", code: "+372" },
  { country: "Eswatini", flag: "🇸🇿", code: "+268" },
  { country: "Ethiopia", flag: "🇪🇹", code: "+251" },
  { country: "Fiji", flag: "🇫🇯", code: "+679" },
  { country: "Finland", flag: "🇫🇮", code: "+358" },
  { country: "France", flag: "🇫🇷", code: "+33" },
  { country: "Gabon", flag: "🇬🇦", code: "+241" },
  { country: "Gambia", flag: "🇬🇲", code: "+220" },
  { country: "Georgia", flag: "🇬🇪", code: "+995" },
  { country: "Germany", flag: "🇩🇪", code: "+49" },
  { country: "Ghana", flag: "🇬🇭", code: "+233" },
  { country: "Greece", flag: "🇬🇷", code: "+30" },
  { country: "Grenada", flag: "🇬🇩", code: "+1-473" },
  { country: "Guatemala", flag: "🇬🇹", code: "+502" },
  { country: "Guinea", flag: "🇬🇳", code: "+224" },
  { country: "Guinea-Bissau", flag: "🇬🇼", code: "+245" },
  { country: "Guyana", flag: "🇬🇾", code: "+592" },
  { country: "Haiti", flag: "🇭🇹", code: "+509" },
  { country: "Honduras", flag: "🇭🇳", code: "+504" },
  { country: "Hong Kong", flag: "🇭🇰", code: "+852" },
  { country: "Hungary", flag: "🇭🇺", code: "+36" },
  { country: "Iceland", flag: "🇮🇸", code: "+354" },
  { country: "India", flag: "🇮🇳", code: "+91" },
  { country: "Indonesia", flag: "🇮🇩", code: "+62" },
  { country: "Iran", flag: "🇮🇷", code: "+98" },
  { country: "Iraq", flag: "🇮🇶", code: "+964" },
  { country: "Ireland", flag: "🇮🇪", code: "+353" },
  { country: "Israel", flag: "🇮🇱", code: "+972" },
  { country: "Italy", flag: "🇮🇹", code: "+39" },
  { country: "Ivory Coast", flag: "🇨🇮", code: "+225" },
  { country: "Jamaica", flag: "🇯🇲", code: "+1-876" },
  { country: "Japan", flag: "🇯🇵", code: "+81" },
  { country: "Jordan", flag: "🇯🇴", code: "+962" },
  { country: "Kazakhstan", flag: "🇰🇿", code: "+7" },
  { country: "Kenya", flag: "🇰🇪", code: "+254" },
  { country: "Kiribati", flag: "🇰🇮", code: "+686" },
  { country: "Kosovo", flag: "🇽🇰", code: "+383" },
  { country: "Kuwait", flag: "🇰🇼", code: "+965" },
  { country: "Kyrgyzstan", flag: "🇰🇬", code: "+996" },
  { country: "Laos", flag: "🇱🇦", code: "+856" },
  { country: "Latvia", flag: "🇱🇻", code: "+371" },
  { country: "Lebanon", flag: "🇱🇧", code: "+961" },
  { country: "Lesotho", flag: "🇱🇸", code: "+266" },
  { country: "Liberia", flag: "🇱🇷", code: "+231" },
  { country: "Libya", flag: "🇱🇾", code: "+218" },
  { country: "Liechtenstein", flag: "🇱🇮", code: "+423" },
  { country: "Lithuania", flag: "🇱🇹", code: "+370" },
  { country: "Luxembourg", flag: "🇱🇺", code: "+352" },
  { country: "Macao", flag: "🇲🇴", code: "+853" },
  { country: "Madagascar", flag: "🇲🇬", code: "+261" },
  { country: "Malawi", flag: "🇲🇼", code: "+265" },
  { country: "Malaysia", flag: "🇲🇾", code: "+60" },
  { country: "Maldives", flag: "🇲🇻", code: "+960" },
  { country: "Mali", flag: "🇲🇱", code: "+223" },
  { country: "Malta", flag: "🇲🇹", code: "+356" },
  { country: "Marshall Islands", flag: "🇲🇭", code: "+692" },
  { country: "Mauritania", flag: "🇲🇷", code: "+222" },
  { country: "Mauritius", flag: "🇲🇺", code: "+230" },
  { country: "Mexico", flag: "🇲🇽", code: "+52" },
  { country: "Micronesia", flag: "🇫🇲", code: "+691" },
  { country: "Moldova", flag: "🇲🇩", code: "+373" },
  { country: "Monaco", flag: "🇲🇨", code: "+377" },
  { country: "Mongolia", flag: "🇲🇳", code: "+976" },
  { country: "Montenegro", flag: "🇲🇪", code: "+382" },
  { country: "Morocco", flag: "🇲🇦", code: "+212" },
  { country: "Mozambique", flag: "🇲🇿", code: "+258" },
  { country: "Myanmar", flag: "🇲🇲", code: "+95" },
  { country: "Namibia", flag: "🇳🇦", code: "+264" },
  { country: "Nauru", flag: "🇳🇷", code: "+674" },
  { country: "Nepal", flag: "🇳🇵", code: "+977" },
  { country: "Netherlands", flag: "🇳🇱", code: "+31" },
  { country: "New Zealand", flag: "🇳🇿", code: "+64" },
  { country: "Nicaragua", flag: "🇳🇮", code: "+505" },
  { country: "Niger", flag: "🇳🇪", code: "+227" },
  { country: "Nigeria", flag: "🇳🇬", code: "+234" },
  { country: "North Korea", flag: "🇰🇵", code: "+850" },
  { country: "North Macedonia", flag: "🇲🇰", code: "+389" },
  { country: "Norway", flag: "🇳🇴", code: "+47" },
  { country: "Oman", flag: "🇴🇲", code: "+968" },
  { country: "Pakistan", flag: "🇵🇰", code: "+92" },
  { country: "Palau", flag: "🇵🇼", code: "+680" },
  { country: "Palestine", flag: "🇵🇸", code: "+970" },
  { country: "Panama", flag: "🇵🇦", code: "+507" },
  { country: "Papua New Guinea", flag: "🇵🇬", code: "+675" },
  { country: "Paraguay", flag: "🇵🇾", code: "+595" },
  { country: "Peru", flag: "🇵🇪", code: "+51" },
  { country: "Philippines", flag: "🇵🇭", code: "+63" },
  { country: "Poland", flag: "🇵🇱", code: "+48" },
  { country: "Portugal", flag: "🇵🇹", code: "+351" },
  { country: "Qatar", flag: "🇶🇦", code: "+974" },
  { country: "Romania", flag: "🇷🇴", code: "+40" },
  { country: "Russia", flag: "🇷🇺", code: "+7" },
  { country: "Rwanda", flag: "🇷🇼", code: "+250" },
  { country: "Saint Kitts and Nevis", flag: "🇰🇳", code: "+1-869" },
  { country: "Saint Lucia", flag: "🇱🇨", code: "+1-758" },
  { country: "Saint Vincent and the Grenadines", flag: "🇻🇨", code: "+1-784" },
  { country: "Samoa", flag: "🇼🇸", code: "+685" },
  { country: "San Marino", flag: "🇸🇲", code: "+378" },
  { country: "Sao Tome and Principe", flag: "🇸🇹", code: "+239" },
  { country: "Saudi Arabia", flag: "🇸🇦", code: "+966" },
  { country: "Senegal", flag: "🇸🇳", code: "+221" },
  { country: "Serbia", flag: "🇷🇸", code: "+381" },
  { country: "Seychelles", flag: "🇸🇨", code: "+248" },
  { country: "Sierra Leone", flag: "🇸🇱", code: "+232" },
  { country: "Singapore", flag: "🇸🇬", code: "+65" },
  { country: "Slovakia", flag: "🇸🇰", code: "+421" },
  { country: "Slovenia", flag: "🇸🇮", code: "+386" },
  { country: "Solomon Islands", flag: "🇸🇧", code: "+677" },
  { country: "Somalia", flag: "🇸🇴", code: "+252" },
  { country: "South Africa", flag: "🇿🇦", code: "+27" },
  { country: "South Korea", flag: "🇰🇷", code: "+82" },
  { country: "South Sudan", flag: "🇸🇸", code: "+211" },
  { country: "Spain", flag: "🇪🇸", code: "+34" },
  { country: "Sri Lanka", flag: "🇱🇰", code: "+94" },
  { country: "Sudan", flag: "🇸🇩", code: "+249" },
  { country: "Suriname", flag: "🇸🇷", code: "+597" },
  { country: "Sweden", flag: "🇸🇪", code: "+46" },
  { country: "Switzerland", flag: "🇨🇭", code: "+41" },
  { country: "Syria", flag: "🇸🇾", code: "+963" },
  { country: "Taiwan", flag: "🇹🇼", code: "+886" },
  { country: "Tajikistan", flag: "🇹🇯", code: "+992" },
  { country: "Tanzania", flag: "🇹🇿", code: "+255" },
  { country: "Thailand", flag: "🇹🇭", code: "+66" },
  { country: "Timor-Leste", flag: "🇹🇱", code: "+670" },
  { country: "Togo", flag: "🇹🇬", code: "+228" },
  { country: "Tonga", flag: "🇹🇴", code: "+676" },
  { country: "Trinidad and Tobago", flag: "🇹🇹", code: "+1-868" },
  { country: "Tunisia", flag: "🇹🇳", code: "+216" },
  { country: "Turkey", flag: "🇹🇷", code: "+90" },
  { country: "Turkmenistan", flag: "🇹🇲", code: "+993" },
  { country: "Tuvalu", flag: "🇹🇻", code: "+688" },
  { country: "Uganda", flag: "🇺🇬", code: "+256" },
  { country: "Ukraine", flag: "🇺🇦", code: "+380" },
  { country: "United Arab Emirates", flag: "🇦🇪", code: "+971" },
  { country: "United Kingdom", flag: "🇬🇧", code: "+44" },
  { country: "United States", flag: "🇺🇸", code: "+1" },
  { country: "Uruguay", flag: "🇺🇾", code: "+598" },
  { country: "Uzbekistan", flag: "🇺🇿", code: "+998" },
  { country: "Vanuatu", flag: "🇻🇺", code: "+678" },
  { country: "Vatican City", flag: "🇻🇦", code: "+39" },
  { country: "Venezuela", flag: "🇻🇪", code: "+58" },
  { country: "Vietnam", flag: "🇻🇳", code: "+84" },
  { country: "Yemen", flag: "🇾🇪", code: "+967" },
  { country: "Zambia", flag: "🇿🇲", code: "+260" },
  { country: "Zimbabwe", flag: "🇿🇼", code: "+263" },
];

function getIsoCodeFromFlagEmoji(flag: string) {
  return Array.from(flag)
    .map((character) =>
      String.fromCharCode(
        (character.codePointAt(0) ?? 127397) - 127397
      )
    )
    .join("");
}

function PhoneCountryFlag({
  flag,
  className = "h-4 w-6",
}: {
  flag: string;
  className?: string;
}) {
  const countryCode = getIsoCodeFromFlagEmoji(flag);
  const FlagComponent = (CountryFlags as any)[countryCode];

  if (!FlagComponent) {
    return (
      <span aria-hidden="true" className="text-base leading-none">
        {flag}
      </span>
    );
  }

  return (
    <FlagComponent
      aria-hidden="true"
      className={`${className} shrink-0 rounded-[2px] object-cover shadow-sm`}
    />
  );
}

export default function AdminPhoneInput() {
  const [selectedCountryName, setSelectedCountryName] =
    useState("Greece");

  const selectedCountry =
    phoneCountryCodes.find(
      (item) => item.country === selectedCountryName
    ) ??
    phoneCountryCodes.find(
      (item) => item.country === "Greece"
    )!;

  return (
    <div className="mt-2">
      <input
        type="hidden"
        name="phoneCountryCode"
        value={selectedCountry.code}
      />

      <div className="relative flex min-w-0 rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
        <details className="group relative w-[180px] shrink-0 border-r border-slate-200 bg-slate-50 rounded-l-xl">
          <summary
            aria-label="Phone country code"
            className="flex h-[46px] cursor-pointer list-none items-center justify-between gap-2 px-3 text-sm font-semibold text-slate-900 outline-none [&::-webkit-details-marker]:hidden"
          >
            <span className="flex min-w-0 items-center gap-2">
              <PhoneCountryFlag
                flag={selectedCountry.flag}
                className="h-[18px] w-7"
              />
              <span className="shrink-0">{selectedCountry.code}</span>
              <span className="truncate">{selectedCountry.country}</span>
            </span>

            <ChevronDown
              size={15}
              className="shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="absolute left-0 top-full z-[80] mt-2 max-h-80 w-[340px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">
            {phoneCountryCodes.map((item) => (
              <button
                key={`${item.country}-${item.code}`}
                type="button"
                onClick={(event) => {
                  setSelectedCountryName(item.country);
                  event.currentTarget
                    .closest("details")
                    ?.removeAttribute("open");
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${
                  selectedCountry.country === item.country
                    ? "bg-blue-50 font-bold text-blue-700"
                    : "text-slate-800"
                }`}
              >
                <PhoneCountryFlag
                  flag={item.flag}
                  className="h-[18px] w-7"
                />
                <span className="w-[58px] shrink-0 font-semibold">
                  {item.code}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {item.country}
                </span>
              </button>
            ))}
          </div>
        </details>

        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          placeholder="Phone number"
          className="min-w-0 flex-1 rounded-r-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
