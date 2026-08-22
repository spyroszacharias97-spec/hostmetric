"use client";

import { useEffect, useState } from "react";
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

        phone: String(
          formData.get("phone") ?? ""
        ).trim(),

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

    <main className="min-h-screen bg-white">


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
            gap-16
            px-6
            pb-28
            pt-36
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
                text-5xl
                font-black
                tracking-tight
                sm:text-6xl
                lg:text-7xl
              "
            >
              {contactPage.hero.title}
            </h1>


            <p
              className="
                mt-7
                max-w-lg
                text-lg
                leading-8
                text-blue-50/90
              "
            >
              {contactPage.hero.description}
            </p>


            {/* CONTACT DETAILS */}

            <div className="mt-12 space-y-8">


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
                    href="tel:+35799807870"
                    className="
                      mt-1
                      block
                      text-lg
                      font-bold
                      transition
                      hover:text-blue-100
                    "
                  >
                    +357 99 80 78 70
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
              rounded-[36px]
              border
              border-white/25
              bg-white/15
              p-5
              shadow-2xl
              backdrop-blur-md
              sm:p-8
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
                  min-h-[500px]
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
                      h-16
                      w-full
                      rounded-2xl
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
                        h-16
                        w-full
                        appearance-none
                        rounded-2xl
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
                        h-16
                        w-full
                        appearance-none
                        rounded-2xl
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


                {/* EMAIL / PHONE */}

                <div className="grid gap-5 sm:grid-cols-2">


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
                        h-16
                        w-full
                        rounded-2xl
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


                  <div className="relative">

                    <Phone
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
                      type="tel"
                      name="phone"
                      required
                      placeholder={
                        contactPage.form.fields.phone
                      }
                      className="
                        h-16
                        w-full
                        rounded-2xl
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
                    h-16
                    w-full
                    rounded-2xl
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
                    resize-none
                    rounded-2xl
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
                      items-center
                      justify-between
                      gap-4
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


                      <div className="mt-3 flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">

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
                                  h-16
                                  w-16
                                  overflow-hidden
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
                                      opacity-0
                                      shadow
                                      transition
                                      hover:bg-red-600
                                      group-hover/photo:opacity-100
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
                    ? "Αποστολή..."
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

      <section className="bg-white px-6 py-24">

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
              mt-5
              max-w-3xl
              text-4xl
              font-black
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