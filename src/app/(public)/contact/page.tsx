"use client";

import { useEffect, useState } from "react";
import * as CountryFlags from "country-flag-icons/react/3x2";
import { getDictionary } from "@/i18n/get-dictionary";

import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/config";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Send,
  Upload,
  UserRound,
  X,
} from "lucide-react";

const MAX_PHOTOS = 50;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);


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

type SelectedPhoto = {
  file: File;
  previewUrl: string;
};

type UploadProgress = {
  completed: number;
  total: number;
};


export default function ContactPage() {

  /* ==========================================
     STATES
  ========================================== */

  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const [contactPage, setContactPage] =
    useState<any | null>(null);

  const [selectedPhotos, setSelectedPhotos] =
    useState<SelectedPhoto[]>([]);

  const [uploadProgress, setUploadProgress] =
    useState<UploadProgress | null>(null);


  const [selectedPhoneCountryName, setSelectedPhoneCountryName] =
    useState("Greece");

  const selectedPhoneCountry =
    phoneCountryCodes.find(
      (item) => item.country === selectedPhoneCountryName
    ) ??
    phoneCountryCodes.find(
      (item) => item.country === "Greece"
    )!;


  /* ==========================================
     PHOTO SELECTION
  ========================================== */

  function clearSelectedPhotos() {
    setSelectedPhotos((current) => {
      current.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });

      return [];
    });

    setUploadProgress(null);
  }

  function removeSelectedPhoto(indexToRemove: number) {
    setSelectedPhotos((current) => {
      const removed = current[indexToRemove];

      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      return current.filter(
        (_, index) => index !== indexToRemove
      );
    });
  }

  function handlePhotoSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const remainingSlots =
      MAX_PHOTOS - selectedPhotos.length;

    if (remainingSlots <= 0) {
      setSubmitError(
        `Μπορείτε να ανεβάσετε μέχρι ${MAX_PHOTOS} φωτογραφίες.`
      );
      return;
    }

    const filesToAdd = files.slice(
      0,
      remainingSlots
    );

    for (const file of filesToAdd) {
      if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
        setSubmitError(
          "Επιτρέπονται μόνο φωτογραφίες JPG, PNG και WEBP."
        );
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setSubmitError(
          `Κάθε φωτογραφία πρέπει να είναι μικρότερη από ${
            MAX_PHOTO_SIZE / 1024 / 1024
          } MB.`
        );
        return;
      }
    }

    const newPhotos = filesToAdd.map(
      (file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })
    );

    setSelectedPhotos((current) => [
      ...current,
      ...newPhotos,
    ]);

    setSubmitError(null);

    if (files.length > remainingSlots) {
      setSubmitError(
        `Επιλέχθηκαν μόνο οι πρώτες ${remainingSlots} φωτογραφίες, επειδή το όριο είναι ${MAX_PHOTOS}.`
      );
    }
  }


  /* ==========================================
     LOAD TRANSLATIONS
  ========================================== */

  useEffect(() => {

    async function loadTranslations() {

      const cookieLocale = document.cookie
        .split("; ")
        .find((item) =>
          item.startsWith("hostmetric_locale=")
        )
        ?.split("=")[1];


      let currentLocale: Locale =
        defaultLocale;


      if (
        cookieLocale &&
        isSupportedLocale(cookieLocale)
      ) {
        currentLocale = cookieLocale;
      }


      const dictionary =
        await getDictionary(currentLocale);


      setContactPage(
        (dictionary as any).contactPage ?? null
      );
    }


    loadTranslations();

  }, []);


  /* ==========================================
     SUBMIT CONTACT FORM
  ========================================== */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSubmitError(null);
    setIsSubmitting(true);
    setUploadProgress(null);

    let uploadFolderId: string | null = null;
    let directUploadsCompleted = false;

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const payload = {
        fullName: String(
          formData.get("fullName") ?? ""
        ).trim(),

        country: String(
          formData.get("country") ?? ""
        ).trim(),

        propertyType: String(
          formData.get("propertyType") ?? ""
        ).trim(),

        email: String(
          formData.get("email") ?? ""
        ).trim(),

        phone: `${selectedPhoneCountry.code} ${String(
          formData.get("phone") ?? ""
        ).trim()}`.trim(),

        cityArea: String(
          formData.get("cityArea") ?? ""
        ).trim(),

        message: String(
          formData.get("message") ?? ""
        ).trim(),

        consent:
          formData.get("consent") === "on",
      };

      if (
        !payload.fullName ||
        !payload.country ||
        !payload.propertyType ||
        !payload.email ||
        !payload.phone ||
        !payload.cityArea ||
        !payload.message ||
        payload.consent !== true
      ) {
        throw new Error(
          "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία."
        );
      }

      if (selectedPhotos.length > MAX_PHOTOS) {
        throw new Error(
          `Μπορείτε να ανεβάσετε μέχρι ${MAX_PHOTOS} φωτογραφίες.`
        );
      }

      /*
       * STEP 1:
       * Ask our server for Google resumable upload URLs.
       *
       * Only metadata reaches Vercel here.
       * The actual image bytes will go directly
       * from the visitor's browser to Google Drive.
       */
      if (selectedPhotos.length > 0) {
        const sessionResponse = await fetch(
          "/api/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "create-upload-batch",
              fullName: payload.fullName,
              files: selectedPhotos.map(
                ({ file }) => ({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                })
              ),
            }),
          }
        );

        const sessionResult =
          await sessionResponse.json();

        if (
          !sessionResponse.ok ||
          !sessionResult.success
        ) {
          throw new Error(
            sessionResult.error ||
              "Δεν ήταν δυνατή η προετοιμασία των φωτογραφιών."
          );
        }

        uploadFolderId =
          sessionResult.folderId;

        const uploads = sessionResult.uploads as Array<{
          index: number;
          uploadUrl: string;
        }>;

        setUploadProgress({
          completed: 0,
          total: selectedPhotos.length,
        });

        let completed = 0;
        const concurrency = 4;

        /*
         * Upload four photos at a time directly
         * to the Google resumable session URLs.
         */
        for (
          let startIndex = 0;
          startIndex < uploads.length;
          startIndex += concurrency
        ) {
          const batch = uploads.slice(
            startIndex,
            startIndex + concurrency
          );

          await Promise.all(
            batch.map(async (upload) => {
              const selected =
                selectedPhotos[upload.index];

              if (!selected) {
                throw new Error(
                  "Δεν βρέθηκε μία από τις επιλεγμένες φωτογραφίες."
                );
              }

              try {
                const uploadResponse = await fetch(
                  upload.uploadUrl,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": selected.file.type,
                    },
                    body: selected.file,
                  }
                );

                if (!uploadResponse.ok) {
                  throw new Error(
                    `Απέτυχε το ανέβασμα της φωτογραφίας "${selected.file.name}".`
                  );
                }
              } catch (uploadError) {
                /*
                 * Google Drive can finish a resumable PUT successfully but
                 * the browser may still reject access to the response because
                 * the upload endpoint does not return a CORS header.
                 * We therefore continue and let our own API verify the files
                 * inside the Drive folder before saving the submission.
                 */
                console.warn(
                  "Drive upload response could not be read; server verification will confirm it:",
                  uploadError
                );
              }

              completed += 1;

              setUploadProgress({
                completed,
                total: selectedPhotos.length,
              });
            })
          );
        }

        directUploadsCompleted = true;
      }

      /*
       * STEP 2:
       * Submit only normal form data + the Drive folder ID.
       *
       * The server reads the uploaded files from Google Drive,
       * saves their URLs to Neon and sends the Resend email.
       */
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "submit-contact",
            ...payload,
            driveFolderId: uploadFolderId,
            expectedPhotoCount: selectedPhotos.length,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "The request could not be submitted."
        );
      }

      form.reset();
      clearSelectedPhotos();
      setSubmitted(true);

    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      );

      /*
       * If the direct upload itself failed,
       * ask the server to clean up the temporary folder.
       *
       * If all photos uploaded but final submission failed,
       * we keep the Drive folder so the uploaded photos are
       * not destroyed because of a temporary database/email issue.
       */
      if (
        uploadFolderId &&
        !directUploadsCompleted
      ) {
        try {
          await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action:
                "cleanup-upload-batch",
              folderId:
                uploadFolderId,
            }),
          });
        } catch (cleanupError) {
          console.error(
            "Could not clean up failed upload folder:",
            cleanupError
          );
        }
      }

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Η αποστολή δεν ολοκληρώθηκε. Παρακαλώ δοκιμάστε ξανά."
      );

    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  }


  /* ==========================================
     WAIT FOR TRANSLATIONS
  ========================================== */

  if (!contactPage) {
    return null;
  }


  /* ==========================================
     PAGE
  ========================================== */

  return (

    <main className="min-h-screen overflow-x-hidden bg-white">


      {/* =====================================================
          CONTACT HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#129fe3] text-white">


        {/* TOP CURVE */}

        <div
          className="
            absolute
            -top-24
            left-[-5%]
            h-40
            w-[110%]
            rounded-[50%]
            bg-white
          "
        />


        {/* DECORATIVE BACKGROUND */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div
            className="
              absolute
              -bottom-44
              -left-32
              h-[430px]
              w-[850px]
              rounded-[50%]
              border-[3px]
              border-cyan-300/30
            "
          />


          <div
            className="
              absolute
              -bottom-52
              left-20
              h-[390px]
              w-[900px]
              rounded-[50%]
              border-[2px]
              border-blue-300/30
            "
          />


          <div
            className="
              absolute
              -right-48
              top-32
              h-[600px]
              w-[600px]
              rounded-full
              bg-blue-600/10
              blur-3xl
            "
          />

        </div>


        <div
          className="
            relative
            z-10
            mx-auto
            grid
            max-w-7xl
            gap-10
            px-4
            pb-20
            pt-28
            sm:gap-12
            sm:px-6
            sm:pb-24
            sm:pt-32
            md:gap-14
            md:pb-28
            md:pt-36
            lg:grid-cols-[0.85fr_1.35fr]
            lg:px-8
            lg:pb-36
            lg:pt-44
          "
        >


          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="flex flex-col justify-center">


            <p
              className="
                mb-5
                text-sm
                font-bold
                uppercase
                tracking-[0.28em]
                text-blue-100
              "
            >
              {contactPage.hero.eyebrow}
            </p>


            <h1
              className="
                max-w-xl
                text-4xl
                font-black
                leading-[1.05]
                tracking-tight
                min-[390px]:text-[2.65rem]
                sm:text-6xl
                lg:text-7xl
              "
            >
              {contactPage.hero.title}
            </h1>


            <p
              className="
                mt-5
                max-w-lg
                text-base
                leading-7
                sm:mt-7
                sm:text-lg
                sm:leading-8
                text-blue-50/90
              "
            >
              {contactPage.hero.description}
            </p>


            {/* CONTACT DETAILS */}

            <div className="mt-9 space-y-6 sm:mt-12 sm:space-y-8">


              {/* GREECE */}

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/15
                    backdrop-blur
                  "
                >
                  <Phone size={21} />
                </div>


                <div>

                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <MapPin size={15} />

                    {contactPage.contactDetails.greece}
                  </div>


                  <a
                    href="tel:+306943404641"
                    className="
                      mt-1
                      block
                      text-lg
                      font-bold
                      transition
                      hover:text-blue-100
                    "
                  >
                    +30 694 340 4641
                  </a>

                </div>

              </div>


              {/* CYPRUS */}

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/15
                    backdrop-blur
                  "
                >
                  <Phone size={21} />
                </div>


                <div>

                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <MapPin size={15} />

                    {contactPage.contactDetails.cyprus}
                  </div>


                  <a
                    href="tel:+35797729792"
                    className="
                      mt-1
                      block
                      text-lg
                      font-bold
                      transition
                      hover:text-blue-100
                    "
                  >
                    +357 97 72 97 92
                  </a>

                </div>

              </div>


              {/* EMAIL */}

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/15
                    backdrop-blur
                  "
                >
                  <Mail size={21} />
                </div>


                <div>

                  <p className="text-sm text-blue-100">
                    {contactPage.contactDetails.emailLabel}
                  </p>


                  <a
                    href="mailto:info@hostmetric.gr"
                    className="
                      mt-1
                      block
                      text-lg
                      font-bold
                      transition
                      hover:text-blue-100
                    "
                  >
                    info@hostmetric.gr
                  </a>

                </div>

              </div>

            </div>


            {/* SMALL MESSAGE */}

            <div
              className="
                mt-12
                max-w-lg
                rounded-3xl
                border
                border-white/20
                bg-white/10
                p-6
                backdrop-blur-sm
              "
            >

              <p className="font-bold">
                {contactPage.helpBox.title}
              </p>


              <p className="mt-2 text-sm leading-6 text-blue-50/85">
                {contactPage.helpBox.description}
              </p>

            </div>

          </div>


          {/* =================================================
              CONTACT FORM
          ================================================== */}

          <div
            className="
              min-w-0
              rounded-[24px]
              border
              border-white/25
              bg-white/15
              p-4
              sm:rounded-[30px]
              sm:p-6
              shadow-2xl
              backdrop-blur-md
              md:p-8
              lg:rounded-[36px]
              lg:p-10
            "
          >


            <div className="mb-8">

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-blue-100
                "
              >
                {contactPage.form.eyebrow}
              </p>


              <h2 className="mt-3 text-3xl font-black">
                {contactPage.form.title}
              </h2>


              <p className="mt-3 text-blue-50/85">
                {contactPage.form.requiredNote}
              </p>

            </div>


            {submitted ? (


              /* =============================================
                  SUCCESS MESSAGE
              ============================================== */

              <div
                className="
                  flex
                  min-h-[390px]
                  sm:min-h-[450px]
                  lg:min-h-[500px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[28px]
                  bg-white
                  px-8
                  text-center
                  text-slate-900
                "
              >

                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-green-100
                    text-green-600
                  "
                >
                  <CheckCircle2 size={40} />
                </div>


                <h3 className="mt-7 text-3xl font-black">
                  {contactPage.success.title}
                </h3>


                <p
                  className="
                    mt-4
                    max-w-md
                    text-lg
                    leading-7
                    text-slate-600
                  "
                >
                  {contactPage.success.description}
                </p>


                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError(null);
                    clearSelectedPhotos();
                  }}
                  className="
                    mt-8
                    rounded-2xl
                    bg-blue-600
                    px-7
                    py-4
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  {contactPage.success.sendAnother}
                </button>

              </div>


            ) : (


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >


                {/* FULL NAME */}

                <div className="relative">

                  <UserRound
                    size={20}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />


                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={
                      contactPage.form.fields.fullName
                    }
                    className="
                      h-14
                      w-full
                      min-w-0
                      rounded-xl
                      sm:h-16
                      sm:rounded-2xl
                      border
                      border-white/30
                      bg-white
                      px-5
                      pr-14
                      font-medium
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-600
                      focus:ring-4
                      focus:ring-blue-600/10
                    "
                  />

                </div>


                {/* COUNTRY / PROPERTY TYPE */}

                <div className="grid gap-5 sm:grid-cols-2">


                  <div className="relative">

                    <MapPin
                      size={19}
                      className="
                        pointer-events-none
                        absolute
                        right-5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />


                    <select
                      name="country"
                      required
                      defaultValue=""
                      className="
                        h-14
                        w-full
                        min-w-0
                        appearance-none
                        rounded-xl
                        sm:h-16
                        sm:rounded-2xl
                        border
                        border-white/30
                        bg-white
                        px-5
                        pr-14
                        font-medium
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-600
                        focus:ring-4
                        focus:ring-blue-600/10
                      "
                    >

                      <option
                        value=""
                        disabled
                      >
                        {
                          contactPage.form.fields
                            .propertyCountry
                        }
                      </option>


                      <option value="greece">
                        {
                          contactPage.form.options
                            .greece
                        }
                      </option>


                      <option value="cyprus">
                        {
                          contactPage.form.options
                            .cyprus
                        }
                      </option>


                      <option value="other">
                        {
                          contactPage.form.options
                            .otherEuropeanCountry
                        }
                      </option>

                    </select>

                  </div>


                  <div className="relative">

                    <Building2
                      size={19}
                      className="
                        pointer-events-none
                        absolute
                        right-5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />


                    <select
                      name="propertyType"
                      required
                      defaultValue=""
                      className="
                        h-14
                        w-full
                        min-w-0
                        appearance-none
                        rounded-xl
                        sm:h-16
                        sm:rounded-2xl
                        border
                        border-white/30
                        bg-white
                        px-5
                        pr-14
                        font-medium
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-600
                        focus:ring-4
                        focus:ring-blue-600/10
                      "
                    >

                      <option
                        value=""
                        disabled
                      >
                        {
                          contactPage.form.fields
                            .propertyType
                        }
                      </option>


                      <option value="apartment">
                        {
                          contactPage.form.options
                            .apartment
                        }
                      </option>


                      <option value="studio">
                        {
                          contactPage.form.options
                            .studio
                        }
                      </option>


                      <option value="house">
                        {
                          contactPage.form.options
                            .house
                        }
                      </option>


                      <option value="villa">
                        {
                          contactPage.form.options
                            .villa
                        }
                      </option>


                      <option value="hotel">
                        {
                          contactPage.form.options
                            .hotelAparthotel
                        }
                      </option>


                      <option value="other">
                        {
                          contactPage.form.options
                            .other
                        }
                      </option>

                    </select>

                  </div>

                </div>


                {/* EMAIL */}

                <div className="relative">

                  <Mail
                    size={19}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />


                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={
                      contactPage.form.fields.email
                    }
                    className="
                      h-14
                      w-full
                      min-w-0
                      rounded-xl
                      sm:h-16
                      sm:rounded-2xl
                      border
                      border-white/30
                      bg-white
                      px-5
                      pr-14
                      font-medium
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-600
                      focus:ring-4
                      focus:ring-blue-600/10
                    "
                  />

                </div>


                {/* PHONE */}

                <div
                  className="
                    relative
                    flex
                    w-full
                    min-w-0
                    rounded-xl
                    sm:rounded-2xl
                    border
                    border-white/30
                    bg-white
                    transition
                    focus-within:border-blue-600
                    focus-within:ring-4
                    focus-within:ring-blue-600/10
                  "
                >

                  <details
                    className="
                      group
                      relative
                      w-[145px]
                      shrink-0
                      border-r
                      border-slate-200
                      bg-slate-50
                      rounded-l-xl
                      sm:w-[220px]
                      sm:rounded-l-2xl
                    "
                  >
                    <summary
                      aria-label={contactPage.form.fields.phone}
                      className="
                        flex
                        h-14
                        cursor-pointer
                        list-none
                        items-center
                        justify-between
                        gap-2
                        px-2.5
                        font-semibold
                        text-slate-900
                        outline-none
                        [&::-webkit-details-marker]:hidden
                        sm:h-16
                        sm:px-4
                      "
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <PhoneCountryFlag
                          flag={selectedPhoneCountry.flag}
                          className="h-4 w-6 sm:h-[18px] sm:w-7"
                        />

                        <span className="shrink-0 text-sm sm:text-base">
                          {selectedPhoneCountry.code}
                        </span>

                        <span className="hidden truncate text-sm sm:inline">
                          {selectedPhoneCountry.country}
                        </span>
                      </span>

                      <ChevronDown
                        size={15}
                        className="
                          shrink-0
                          transition-transform
                          group-open:rotate-180
                        "
                      />
                    </summary>

                    <div
                      className="
                        absolute
                        left-0
                        top-full
                        z-[80]
                        mt-2
                        max-h-80
                        w-[290px]
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-1.5
                        shadow-2xl
                        sm:w-[340px]
                      "
                    >
                      {phoneCountryCodes.map((item) => (
                        <button
                          key={`${item.country}-${item.code}`}
                          type="button"
                          onClick={(event) => {
                            setSelectedPhoneCountryName(
                              item.country
                            );

                            event.currentTarget
                              .closest("details")
                              ?.removeAttribute("open");
                          }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${
                            selectedPhoneCountry.country === item.country
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
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    name="phone"
                    required
                    placeholder={
                      contactPage.form.fields.phone
                    }
                    className="
                      h-14
                      min-w-0
                      flex-1
                      rounded-r-xl
                      sm:h-16
                      sm:rounded-r-2xl
                      bg-white
                      px-4
                      font-medium
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      sm:px-5
                    "
                  />

                </div>


                {/* LOCATION */}

                <input
                  type="text"
                  name="cityArea"
                  required
                  placeholder={
                    contactPage.form.fields
                      .propertyCityArea
                  }
                  className="
                    h-14
                    w-full
                    min-w-0
                    rounded-xl
                    sm:h-16
                    sm:rounded-2xl
                    border
                    border-white/30
                    bg-white
                    px-5
                    font-medium
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-600/10
                  "
                />


                {/* MESSAGE */}

                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder={
                    contactPage.form.fields.message
                  }
                  className="
                    w-full
                    min-w-0
                    resize-none
                    rounded-xl
                    sm:rounded-2xl
                    border
                    border-white/30
                    bg-white
                    px-5
                    py-5
                    font-medium
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-600/10
                  "
                />


                {/* FILE UPLOAD */}

                <div className="space-y-3">

                  <label
                    className="
                      flex
                      cursor-pointer
                      flex-col
                      items-stretch
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      rounded-2xl
                      border
                      border-dashed
                      border-white/50
                      bg-white/10
                      px-5
                      py-5
                      transition
                      hover:bg-white/20
                    "
                  >

                    <div>

                      <p className="font-bold">
                        {
                          contactPage.form.upload
                            .title
                        }
                      </p>

                      <p className="mt-1 text-sm text-blue-100">
                        {
                          contactPage.form.upload
                            .description
                        }
                      </p>

                      <p className="mt-2 text-xs font-semibold text-white/90">
                        {selectedPhotos.length} / {MAX_PHOTOS}
                      </p>

                    </div>

                    <Upload
                      size={23}
                      className="shrink-0"
                    />

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={
                        isSubmitting ||
                        selectedPhotos.length >= MAX_PHOTOS
                      }
                      onChange={handlePhotoSelection}
                      className="hidden"
                    />

                  </label>


                  {selectedPhotos.length > 0 && (

                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/20
                        bg-white/10
                        p-4
                        backdrop-blur-sm
                      "
                    >

                      <div className="flex items-center justify-between gap-4">

                        <p className="text-sm font-bold text-white">
                          {selectedPhotos.length} φωτογραφίες
                        </p>

                        {uploadProgress && (

                          <p className="text-xs font-semibold text-blue-100">
                            Ανέβασμα{" "}
                            {uploadProgress.completed}/
                            {uploadProgress.total}
                          </p>

                        )}

                      </div>


                      <div className="mt-3 grid max-h-64 grid-cols-4 gap-2 overflow-y-auto pr-1 min-[390px]:grid-cols-5 sm:flex sm:max-h-56 sm:flex-wrap">

                        {selectedPhotos
                          .map(
                            (
                              photo,
                              index
                            ) => (

                              <div
                                key={`${photo.file.name}-${photo.file.lastModified}-${index}`}
                                className="
                                  group/photo
                                  relative
                                  aspect-square
                                  h-auto
                                  w-full
                                  min-w-0
                                  overflow-hidden
                                  sm:h-16
                                  sm:w-16
                                  rounded-xl
                                  border
                                  border-white/30
                                  bg-white/15
                                  shadow-sm
                                "
                              >

                                <img
                                  src={photo.previewUrl}
                                  alt={`Selected photo ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />

                                {!isSubmitting && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSelectedPhoto(
                                        index
                                      )
                                    }
                                    aria-label="Remove photo"
                                    className="
                                      absolute
                                      right-1
                                      top-1
                                      flex
                                      h-6
                                      w-6
                                      items-center
                                      justify-center
                                      rounded-full
                                      bg-slate-950/80
                                      text-white
                                      opacity-100
                                      shadow
                                      transition
                                      hover:bg-red-600
                                      sm:opacity-0
                                      sm:group-hover/photo:opacity-100
                                    "
                                  >
                                    <X size={14} />
                                  </button>

                                )}

                              </div>

                            )
                          )}


                      </div>

                    </div>

                  )}

                </div>


                {/* PRIVACY */}

                <label
                  className="
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                    text-sm
                    leading-6
                    text-blue-50
                  "
                >

                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="
                      mt-1
                      h-4
                      w-4
                      shrink-0
                      accent-blue-700
                    "
                  />


                  <span>
                    {contactPage.form.privacy}
                  </span>

                </label>


                {/* ERROR MESSAGE */}

                {submitError && (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50
                      px-5
                      py-4
                      text-sm
                      font-semibold
                      text-red-700
                    "
                  >
                    {submitError}
                  </div>

                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-2xl
                    bg-slate-950
                    px-7
                    py-5
                    text-lg
                    font-black
                    text-white
                    shadow-xl
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                    disabled:hover:bg-slate-950
                  "
                >

                  {isSubmitting
                    ? (contactPage.form.submitting ?? "Submitting...")
                    : contactPage.form.submit
                  }


                  <Send
                    size={19}
                    className={`
                      transition
                      duration-300
                      ${
                        isSubmitting
                          ? ""
                          : "group-hover:translate-x-1"
                      }
                    `}
                  />

                </button>


                <p className="text-center text-xs text-blue-100">
                  {
                    contactPage.form
                      .noObligation
                  }
                </p>

              </form>

            )}

          </div>

        </div>


        {/* BOTTOM CURVE */}

        <div
          className="
            absolute
            -bottom-20
            left-[-5%]
            h-32
            w-[110%]
            rounded-[50%]
            bg-white
          "
        />

      </section>


      {/* =====================================================
          SECOND SMALL SECTION
      ====================================================== */}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24">

        <div className="mx-auto max-w-5xl text-center">


          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.25em]
              text-blue-600
            "
          >
            {contactPage.bottom.eyebrow}
          </p>


          <h2
            className="
              mx-auto
              mt-4
              max-w-3xl
              text-3xl
              font-black
              leading-tight
              sm:mt-5
              tracking-tight
              text-slate-950
              sm:text-5xl
            "
          >
            {contactPage.bottom.title}
          </h2>


          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-lg
              leading-8
              text-slate-600
            "
          >
            {contactPage.bottom.description}
          </p>


          <a
            href="mailto:info@hostmetric.gr"
            className="
              group
              mt-9
              inline-flex
              items-center
              gap-2
              font-bold
              text-blue-600
              transition
              hover:text-blue-800
            "
          >

            {contactPage.bottom.link}


            <ArrowRight
              size={18}
              className="
                transition
                group-hover:translate-x-1
              "
            />

          </a>

        </div>

      </section>

    </main>
  );
}