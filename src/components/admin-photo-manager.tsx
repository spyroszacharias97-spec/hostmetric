"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ExternalLink,
  FileImage,
  ImageIcon,
  Loader2,
  MoveRight,
  Trash2,
  Upload,
} from "lucide-react";


export type AdminPhotoFile = {
  id: number;
  originalName: string | null;
  storedName: string | null;
  driveUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  sortOrder: number | null;
  createdAt: string | null;
  fileScope: string | null;
  fileGroup: string | null;
  fileGroupLabel: string | null;
  unitId: number | null;
  unitClientId: number | null;
  unitName: string | null;
};


export type AdminPhotoUnit = {
  onboardingUnitId: number;
  unitName: string;
};


export type AdminPhotoCategory = {
  key: string;
  label: string;
  scope:
    | "property"
    | "unit"
    | "accessibility"
    | "checkin"
    | "supporting";
  unitOnly?: boolean;
};


type Dictionary = {
  propertyFiles: string;
  unitFiles: string;
  category: string;
  scope: string;
  unit: string;
  uploaded: string;
  fileSize: string;
  openFile: string;
  addPhotos: string;
  deleteFile: string;
  moveFile: string;
  moveToCategory: string;
  chooseCategory: string;
  chooseUnit: string;
  propertyLevel: string;
  noFiles: string;
  uploadFiles: string;
  uploading: string;
  deleteConfirm: string;
  move: string;
  cancel: string;
  fileName: string;
  fileType: string;
};


function formatBytes(
  value: number | null
) {
  if (!value || value <= 0) {
    return "—";
  }

  const mb =
    value / 1024 / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }

  return `${Math.max(
    1,
    Math.round(value / 1024)
  )} KB`;
}


function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "el-GR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


function fileLabel(
  file: AdminPhotoFile
) {
  return (
    file.originalName ||
    file.storedName ||
    file.fileGroupLabel ||
    file.fileGroup ||
    `File ${file.id}`
  );
}


function categoryLabel(
  file: AdminPhotoFile
) {
  return (
    file.fileGroupLabel ||
    file.fileGroup ||
    file.fileScope ||
    "—"
  );
}


function PhotoCategoryGroup({
  title,
  files,
  dictionary,
  busyId,
  onMove,
  onDelete,
}: {
  title: string;
  files: AdminPhotoFile[];
  dictionary: Dictionary;
  busyId: number | null;
  onMove: (
    file: AdminPhotoFile
  ) => void;
  onDelete: (
    file: AdminPhotoFile
  ) => void;
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
        sm:rounded-2xl
      "
    >

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-b
          border-slate-100
          bg-slate-50/80
          px-4
          py-3.5
          sm:px-5
          sm:py-4
        "
      >

        <div className="min-w-0">

          <p
            className="
              break-words
              text-sm
              font-black
              text-slate-950
              sm:text-base
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              text-xs
              font-semibold
              text-slate-500
            "
          >
            {files.length}{" "}
            {files.length === 1
              ? "file"
              : "files"}
          </p>

        </div>

      </div>


      <div
        className="
          grid
          gap-3
          p-3
          sm:p-4
          lg:grid-cols-2
          2xl:grid-cols-3
        "
      >

        {files.map(
          (file) => (
            <article
              key={file.id}
              className="
                min-w-0
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3.5
                sm:p-4
              "
            >

              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  {
                    file.mimeType?.startsWith(
                      "image/"
                    )
                      ? (
                        <ImageIcon
                          size={18}
                        />
                      )
                      : (
                        <FileImage
                          size={18}
                        />
                      )
                  }
                </div>


                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >

                  <p
                    className="
                      truncate
                      text-sm
                      font-black
                      text-slate-950
                    "
                  >
                    {fileLabel(file)}
                  </p>


                  <div
                    className="
                      mt-2
                      grid
                      gap-1
                      break-words
                      text-xs
                      text-slate-500
                    "
                  >

                    <p>
                      <span className="font-bold">
                        {dictionary.category}:
                      </span>{" "}
                      {categoryLabel(file)}
                    </p>


                    {file.unitName ? (
                      <p>
                        <span className="font-bold">
                          {dictionary.unit}:
                        </span>{" "}
                        {file.unitName}
                      </p>
                    ) : null}


                    <p>
                      <span className="font-bold">
                        {dictionary.fileSize}:
                      </span>{" "}
                      {formatBytes(
                        file.fileSize
                      )}
                    </p>


                    <p>
                      <span className="font-bold">
                        {dictionary.uploaded}:
                      </span>{" "}
                      {formatDate(
                        file.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </div>


              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-2
                  min-[390px]:grid-cols-3
                "
              >

                {file.driveUrl ? (
                  <a
                    href={file.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      min-w-0
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-blue-200
                      bg-blue-50
                      px-3
                      py-2
                      text-center
                      text-xs
                      font-black
                      text-blue-700
                      transition
                      hover:bg-blue-100
                    "
                  >
                    <ExternalLink
                      size={14}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {dictionary.openFile}
                    </span>
                  </a>
                ) : (
                  <div />
                )}


                <button
                  type="button"
                  onClick={() =>
                    onMove(file)
                  }
                  className="
                    inline-flex
                    min-w-0
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    text-xs
                    font-black
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  <MoveRight
                    size={14}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {dictionary.moveFile}
                  </span>
                </button>


                <button
                  type="button"
                  disabled={
                    busyId === file.id
                  }
                  onClick={() =>
                    onDelete(file)
                  }
                  className="
                    inline-flex
                    min-w-0
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-3
                    py-2
                    text-xs
                    font-black
                    text-red-700
                    transition
                    hover:bg-red-100
                    disabled:opacity-50
                  "
                >
                  {
                    busyId === file.id
                      ? (
                        <Loader2
                          size={14}
                          className="
                            shrink-0
                            animate-spin
                          "
                        />
                      )
                      : (
                        <Trash2
                          size={14}
                          className="shrink-0"
                        />
                      )
                  }

                  <span className="truncate">
                    {dictionary.deleteFile}
                  </span>
                </button>

              </div>

            </article>
          )
        )}

      </div>

    </div>
  );
}


export default function AdminPhotoManager({
  propertyId,
  files,
  units,
  categories,
  dictionary,
}: {
  propertyId: number;
  files: AdminPhotoFile[];
  units: AdminPhotoUnit[];
  categories: AdminPhotoCategory[];
  dictionary: Dictionary;
}) {

  const uploadInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const [
    busyId,
    setBusyId,
  ] =
    useState<number | null>(
      null
    );

  const [
    isUploading,
    setIsUploading,
  ] =
    useState(false);

  const [
    uploadCategory,
    setUploadCategory,
  ] =
    useState(
      categories.find(
        (category) =>
          !category.unitOnly
      )?.key ??
        categories[0]?.key ??
        ""
    );

  const [
    uploadUnitId,
    setUploadUnitId,
  ] =
    useState<string>("");

  const [
    moveTarget,
    setMoveTarget,
  ] =
    useState<AdminPhotoFile | null>(
      null
    );

  const [
    moveCategory,
    setMoveCategory,
  ] =
    useState("");

  const [
    moveUnitId,
    setMoveUnitId,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");


  const selectedUploadCategory =
    useMemo(
      () =>
        categories.find(
          (category) =>
            category.key ===
            uploadCategory
        ) ?? null,
      [
        categories,
        uploadCategory,
      ]
    );


  const visibleFiles =
    useMemo(
      () => {

        if (!uploadCategory) {
          return [];
        }


        return files.filter(
          (file) => {

            if (
              file.fileGroup !==
              uploadCategory
            ) {
              return false;
            }


            if (
              selectedUploadCategory
                ?.unitOnly
            ) {

              if (!uploadUnitId) {
                return false;
              }

              return (
                file.unitId ===
                Number(
                  uploadUnitId
                )
              );
            }


            return true;
          }
        );

      },
      [
        files,
        uploadCategory,
        uploadUnitId,
        selectedUploadCategory,
      ]
    );


  const groupedFiles =
    useMemo(
      () => {

        function groupByCategory(
          items: AdminPhotoFile[]
        ) {

          const categoryMap =
            new Map<
              string,
              AdminPhotoFile[]
            >();


          for (
            const file of items
          ) {

            const categoryKey =
              file.fileGroup ||
              file.fileGroupLabel ||
              file.fileScope ||
              "uncategorized";


            const current =
              categoryMap.get(
                categoryKey
              ) ?? [];


            current.push(file);

            categoryMap.set(
              categoryKey,
              current
            );
          }


          return Array.from(
            categoryMap.entries()
          )
            .map(
              ([
                key,
                categoryFiles,
              ]) => ({
                key,
                label:
                  categoryLabel(
                    categoryFiles[0]
                  ),
                files: [
                  ...categoryFiles,
                ].sort(
                  (a, b) =>
                    (
                      a.sortOrder ??
                      9999
                    ) -
                      (
                        b.sortOrder ??
                        9999
                      ) ||
                    fileLabel(
                      a
                    ).localeCompare(
                      fileLabel(b)
                    )
                ),
              })
            )
            .sort(
              (a, b) =>
                a.label.localeCompare(
                  b.label
                )
            );
        }


        const propertyFiles:
          AdminPhotoFile[] = [];


        const unitMap =
          new Map<
            string,
            {
              unitName: string;
              files:
                AdminPhotoFile[];
            }
          >();


        for (
          const file of visibleFiles
        ) {

          const belongsToUnit =
            file.unitId !== null ||
            file.unitClientId !==
              null ||
            Boolean(
              file.unitName
            ) ||
            file.fileScope?.startsWith(
              "unit"
            ) === true;


          if (!belongsToUnit) {
            propertyFiles.push(
              file
            );
            continue;
          }


          const unitKey =
            String(
              file.unitId ??
                file.unitClientId ??
                file.unitName ??
                "unknown-unit"
            );


          const current =
            unitMap.get(
              unitKey
            ) ?? {
              unitName:
                file.unitName ||
                dictionary.unit,
              files: [],
            };


          current.files.push(
            file
          );

          unitMap.set(
            unitKey,
            current
          );
        }


        return {
          propertyCategories:
            groupByCategory(
              propertyFiles
            ),

          unitGroups:
            Array.from(
              unitMap.entries()
            )
              .map(
                ([
                  key,
                  unit,
                ]) => ({
                  key,
                  unitName:
                    unit.unitName,
                  categories:
                    groupByCategory(
                      unit.files
                    ),
                })
              )
              .sort(
                (a, b) =>
                  a.unitName.localeCompare(
                    b.unitName
                  )
              ),
        };

      },
      [
        visibleFiles,
        dictionary.unit,
      ]
    );


  async function uploadSelectedFiles(
    selected: FileList | null
  ) {

    if (
      !selected ||
      selected.length === 0
    ) {
      return;
    }


    if (!uploadCategory) {
      setError(
        dictionary.chooseCategory
      );
      return;
    }


    if (
      selectedUploadCategory
        ?.unitOnly &&
      !uploadUnitId
    ) {
      setError(
        dictionary.chooseUnit
      );
      return;
    }


    setIsUploading(true);
    setError("");


    try {

      for (
        const file of Array.from(
          selected
        )
      ) {

        const body =
          new FormData();


        body.set(
          "action",
          "upload"
        );

        body.set(
          "propertyId",
          String(propertyId)
        );

        body.set(
          "category",
          uploadCategory
        );

        body.set(
          "unitId",
          uploadUnitId
        );

        body.set(
          "file",
          file
        );


        const response =
          await fetch(
            "/api/admin/photos",
            {
              method: "POST",
              body,
            }
          );


        const result =
          await response.json();


        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              "Upload failed."
          );
        }
      }


      window.location.reload();

    } catch (uploadError) {

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed."
      );

    } finally {

      setIsUploading(false);


      if (
        uploadInputRef.current
      ) {
        uploadInputRef.current.value =
          "";
      }
    }
  }


  async function deleteFile(
    file: AdminPhotoFile
  ) {

    if (
      !window.confirm(
        dictionary.deleteConfirm
      )
    ) {
      return;
    }


    setBusyId(file.id);
    setError("");


    try {

      const body =
        new FormData();


      body.set(
        "action",
        "delete"
      );

      body.set(
        "propertyId",
        String(propertyId)
      );

      body.set(
        "fileId",
        String(file.id)
      );


      const response =
        await fetch(
          "/api/admin/photos",
          {
            method: "POST",
            body,
          }
        );


      const result =
        await response.json();


      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Delete failed."
        );
      }


      window.location.reload();

    } catch (deleteError) {

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Delete failed."
      );

    } finally {

      setBusyId(null);
    }
  }


  async function moveFile() {

    if (
      !moveTarget ||
      !moveCategory
    ) {
      return;
    }


    const category =
      categories.find(
        (item) =>
          item.key ===
          moveCategory
      ) ?? null;


    if (
      category?.unitOnly &&
      !moveUnitId
    ) {
      setError(
        dictionary.chooseUnit
      );
      return;
    }


    setBusyId(
      moveTarget.id
    );

    setError("");


    try {

      const body =
        new FormData();


      body.set(
        "action",
        "move"
      );

      body.set(
        "propertyId",
        String(propertyId)
      );

      body.set(
        "fileId",
        String(
          moveTarget.id
        )
      );

      body.set(
        "category",
        moveCategory
      );

      body.set(
        "unitId",
        moveUnitId
      );


      const response =
        await fetch(
          "/api/admin/photos",
          {
            method: "POST",
            body,
          }
        );


      const result =
        await response.json();


      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Move failed."
        );
      }


      window.location.reload();

    } catch (moveError) {

      setError(
        moveError instanceof Error
          ? moveError.message
          : "Move failed."
      );

    } finally {

      setBusyId(null);
      setMoveTarget(null);
      setMoveCategory("");
      setMoveUnitId("");
    }
  }


  /* =========================================================
     RESPONSIVE ADMIN PHOTO MANAGER
     Mobile-first layout only. Upload, move and delete behavior
     remains unchanged.
  ========================================================= */

  return (
    <div
      className="
        min-w-0
        space-y-5
        sm:space-y-7
      "
    >

      {/* ==========================================
          UPLOAD CONTROLS
      ========================================== */}

      <div
        className="
          rounded-2xl
          border
          border-blue-100
          bg-gradient-to-br
          from-blue-50
          via-white
          to-sky-50
          p-4
          shadow-sm
          sm:rounded-3xl
          sm:p-6
        "
      >

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-4
            xl:flex-row
            xl:items-end
          "
        >

          <label
            className="
              min-w-0
              flex-1
            "
          >

            <span
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.06em]
                text-slate-500
                sm:tracking-[0.08em]
              "
            >
              {dictionary.chooseCategory}
            </span>


            <select
              value={uploadCategory}
              onChange={(event) => {

                setError("");

                setUploadCategory(
                  event.target.value
                );


                const nextCategory =
                  categories.find(
                    (category) =>
                      category.key ===
                      event.target.value
                  );


                if (
                  nextCategory?.unitOnly
                ) {
                  setUploadUnitId(
                    units[0]
                      ?.onboardingUnitId
                      ? String(
                          units[0]
                            .onboardingUnitId
                        )
                      : ""
                  );
                } else {
                  setUploadUnitId(
                    ""
                  );
                }
              }}
              className="
                mt-2
                w-full
                min-w-0
                rounded-xl
                border
                border-blue-200
                bg-white
                px-3
                py-3
                text-sm
                font-black
                text-slate-900
                shadow-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                sm:rounded-2xl
                sm:px-4
                sm:py-3.5
              "
            >

              <optgroup label="🏢 ΑΚΙΝΗΤΟ / ΚΟΙΝΟΧΡΗΣΤΟΙ ΧΩΡΟΙ">

                {categories
                  .filter(
                    (category) =>
                      category.scope ===
                        "property" ||
                      category.scope ===
                        "checkin" ||
                      category.scope ===
                        "supporting"
                  )
                  .map(
                    (category) => (
                      <option
                        key={
                          category.key
                        }
                        value={
                          category.key
                        }
                        className="text-blue-700"
                      >
                        {
                          category.label
                        }
                      </option>
                    )
                  )}

              </optgroup>


              <optgroup label="🛏️ ΜΟΝΑΔΑ / ΔΩΜΑΤΙΟ">

                {categories
                  .filter(
                    (category) =>
                      category.scope ===
                      "unit"
                  )
                  .map(
                    (category) => (
                      <option
                        key={
                          category.key
                        }
                        value={
                          category.key
                        }
                        className="text-emerald-700"
                      >
                        {
                          category.label
                        }
                      </option>
                    )
                  )}

              </optgroup>


              <optgroup label="♿ ΠΡΟΣΒΑΣΙΜΟΤΗΤΑ">

                {categories
                  .filter(
                    (category) =>
                      category.scope ===
                      "accessibility"
                  )
                  .map(
                    (category) => (
                      <option
                        key={
                          category.key
                        }
                        value={
                          category.key
                        }
                        className="text-violet-700"
                      >
                        {
                          category.label
                        }
                      </option>
                    )
                  )}

              </optgroup>

            </select>

          </label>


          {selectedUploadCategory
            ?.unitOnly ? (

            <label
              className="
                min-w-0
                flex-1
              "
            >

              <span
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.06em]
                  text-slate-500
                  sm:tracking-[0.08em]
                "
              >
                {dictionary.chooseUnit}
              </span>


              <select
                value={
                  uploadUnitId
                }
                onChange={(
                  event
                ) => {
                  setError("");

                  setUploadUnitId(
                    event.target.value
                  );
                }}
                className="
                  mt-2
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50/70
                  px-3
                  py-3
                  text-sm
                  font-black
                  text-slate-900
                  shadow-sm
                  outline-none
                  transition
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-100
                  sm:rounded-2xl
                  sm:px-4
                  sm:py-3.5
                "
              >

                {units.map(
                  (unit) => (
                    <option
                      key={
                        unit.onboardingUnitId
                      }
                      value={
                        unit.onboardingUnitId
                      }
                    >
                      {unit.unitName}
                    </option>
                  )
                )}

              </select>

            </label>

          ) : null}


          <label
            className="
              inline-flex
              w-full
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-black
              text-white
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:bg-blue-700
              hover:shadow-md
              sm:rounded-2xl
              sm:px-6
              sm:py-3.5
              xl:w-auto
            "
          >

            {
              isUploading
                ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )
                : (
                  <Upload
                    size={17}
                  />
                )
            }

            {
              isUploading
                ? dictionary.uploading
                : dictionary.uploadFiles
            }


            <input
              ref={
                uploadInputRef
              }
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              disabled={
                isUploading
              }
              onChange={(
                event
              ) =>
                uploadSelectedFiles(
                  event.currentTarget
                    .files
                )
              }
            />

          </label>

        </div>


        {error ? (
          <p
            className="
              mt-4
              break-words
              text-sm
              font-bold
              text-red-600
            "
          >
            {error}
          </p>
        ) : null}

      </div>


      {/* ==========================================
          EMPTY / FILTER STATES
      ========================================== */}

      {!uploadCategory ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-6
            text-center
            text-sm
            font-semibold
            text-slate-500
            sm:rounded-3xl
            sm:p-10
          "
        >
          {dictionary.chooseCategory}
        </div>

      ) : selectedUploadCategory
          ?.unitOnly &&
        !uploadUnitId ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-emerald-200
            bg-emerald-50/40
            p-6
            text-center
            text-sm
            font-semibold
            text-slate-600
            sm:rounded-3xl
            sm:p-10
          "
        >
          {dictionary.chooseUnit}
        </div>

      ) : visibleFiles.length ===
        0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-6
            text-center
            sm:rounded-3xl
            sm:p-10
          "
        >

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-slate-400
            "
          >
            <ImageIcon
              size={22}
            />
          </div>


          <p
            className="
              mt-4
              text-sm
              font-black
              text-slate-700
            "
          >
            {dictionary.noFiles}
          </p>


          <p
            className="
              mt-1
              break-words
              text-xs
              font-semibold
              text-slate-400
            "
          >
            {
              selectedUploadCategory
                ?.label
            }

            {
              selectedUploadCategory
                ?.unitOnly &&
              uploadUnitId
                ? ` · ${
                    units.find(
                      (unit) =>
                        String(
                          unit.onboardingUnitId
                        ) ===
                        uploadUnitId
                    )?.unitName ??
                    ""
                  }`
                : ""
            }
          </p>

        </div>

      ) : (

        <div
          className="
            min-w-0
            space-y-5
          "
        >

          <div
            className="
              flex
              min-w-0
              flex-col
              gap-3
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:justify-between
            "
          >

            <div className="min-w-0">

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.1em]
                  text-blue-600
                  sm:tracking-[0.12em]
                "
              >
                {
                  selectedUploadCategory
                    ?.unitOnly
                    ? dictionary.unitFiles
                    : dictionary.propertyFiles
                }
              </p>


              <h3
                className="
                  mt-1
                  break-words
                  text-lg
                  font-black
                  leading-tight
                  text-slate-950
                  sm:text-xl
                "
              >
                {
                  selectedUploadCategory
                    ?.label
                }

                {
                  selectedUploadCategory
                    ?.unitOnly &&
                  uploadUnitId
                    ? ` · ${
                        units.find(
                          (unit) =>
                            String(
                              unit.onboardingUnitId
                            ) ===
                            uploadUnitId
                        )?.unitName ??
                        ""
                      }`
                    : ""
                }
              </h3>

            </div>


            <span
              className="
                w-fit
                rounded-full
                border
                border-blue-100
                bg-blue-50
                px-3
                py-1.5
                text-xs
                font-black
                text-blue-700
              "
            >
              {visibleFiles.length}{" "}
              {
                visibleFiles.length ===
                1
                  ? "file"
                  : "files"
              }
            </span>

          </div>


          {
            groupedFiles
              .propertyCategories
              .map(
                (category) => (
                  <PhotoCategoryGroup
                    key={`property-${category.key}`}
                    title={
                      category.label
                    }
                    files={
                      category.files
                    }
                    dictionary={
                      dictionary
                    }
                    busyId={
                      busyId
                    }
                    onMove={(
                      file
                    ) => {
                      setMoveTarget(
                        file
                      );

                      setMoveCategory(
                        file.fileGroup ||
                          ""
                      );

                      setMoveUnitId(
                        file.unitId
                          ? String(
                              file.unitId
                            )
                          : ""
                      );
                    }}
                    onDelete={
                      deleteFile
                    }
                  />
                )
              )
          }


          {
            groupedFiles
              .unitGroups
              .map(
                (unitGroup) =>
                  unitGroup.categories.map(
                    (category) => (
                      <PhotoCategoryGroup
                        key={`${unitGroup.key}-${category.key}`}
                        title={
                          category.label
                        }
                        files={
                          category.files
                        }
                        dictionary={
                          dictionary
                        }
                        busyId={
                          busyId
                        }
                        onMove={(
                          file
                        ) => {
                          setMoveTarget(
                            file
                          );

                          setMoveCategory(
                            file.fileGroup ||
                              ""
                          );

                          setMoveUnitId(
                            file.unitId
                              ? String(
                                  file.unitId
                                )
                              : ""
                          );
                        }}
                        onDelete={
                          deleteFile
                        }
                      />
                    )
                  )
              )
          }

        </div>
      )}


      {/* ==========================================
          MOVE FILE MODAL
      ========================================== */}

      {moveTarget ? (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            overflow-y-auto
            bg-slate-950/40
            p-3
            sm:items-center
            sm:p-4
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-t-2xl
              bg-white
              p-4
              shadow-2xl
              sm:rounded-3xl
              sm:p-6
            "
          >

            <div
              className="
                flex
                min-w-0
                items-start
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <MoveRight
                  size={18}
                />
              </div>


              <div className="min-w-0">

                <h3
                  className="
                    break-words
                    text-base
                    font-black
                    text-slate-950
                    sm:text-lg
                  "
                >
                  {
                    dictionary
                      .moveToCategory
                  }
                </h3>


                <p
                  className="
                    mt-1
                    max-w-sm
                    truncate
                    text-sm
                    text-slate-500
                  "
                >
                  {fileLabel(
                    moveTarget
                  )}
                </p>

              </div>

            </div>


            <label
              className="
                mt-5
                block
                sm:mt-6
              "
            >

              <span
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.06em]
                  text-slate-500
                  sm:tracking-[0.08em]
                "
              >
                {
                  dictionary
                    .chooseCategory
                }
              </span>


              <select
                value={
                  moveCategory
                }
                onChange={(
                  event
                ) => {

                  setError("");

                  setMoveCategory(
                    event.target.value
                  );


                  const nextCategory =
                    categories.find(
                      (category) =>
                        category.key ===
                        event.target.value
                    );


                  if (
                    nextCategory
                      ?.unitOnly
                  ) {

                    setMoveUnitId(
                      (current) =>
                        current ||
                        (
                          units[0]
                            ?.onboardingUnitId
                            ? String(
                                units[0]
                                  .onboardingUnitId
                              )
                            : ""
                        )
                    );

                  } else {

                    setMoveUnitId(
                      ""
                    );
                  }
                }}
                className="
                  mt-2
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-3
                  text-sm
                  font-bold
                  text-slate-800
                "
              >

                <optgroup label="🏢 ΑΚΙΝΗΤΟ / ΚΟΙΝΟΧΡΗΣΤΟΙ ΧΩΡΟΙ">

                  {
                    categories
                      .filter(
                        (category) =>
                          category.scope ===
                            "property" ||
                          category.scope ===
                            "checkin" ||
                          category.scope ===
                            "supporting"
                      )
                      .map(
                        (category) => (
                          <option
                            key={
                              category.key
                            }
                            value={
                              category.key
                            }
                            className="text-blue-700"
                          >
                            {
                              category.label
                            }
                          </option>
                        )
                      )
                  }

                </optgroup>


                <optgroup label="🛏️ ΜΟΝΑΔΑ / ΔΩΜΑΤΙΟ">

                  {
                    categories
                      .filter(
                        (category) =>
                          category.scope ===
                          "unit"
                      )
                      .map(
                        (category) => (
                          <option
                            key={
                              category.key
                            }
                            value={
                              category.key
                            }
                            className="text-emerald-700"
                          >
                            {
                              category.label
                            }
                          </option>
                        )
                      )
                  }

                </optgroup>


                <optgroup label="♿ ΠΡΟΣΒΑΣΙΜΟΤΗΤΑ">

                  {
                    categories
                      .filter(
                        (category) =>
                          category.scope ===
                          "accessibility"
                      )
                      .map(
                        (category) => (
                          <option
                            key={
                              category.key
                            }
                            value={
                              category.key
                            }
                            className="text-violet-700"
                          >
                            {
                              category.label
                            }
                          </option>
                        )
                      )
                  }

                </optgroup>

              </select>

            </label>


            {
              categories.find(
                (category) =>
                  category.key ===
                  moveCategory
              )?.unitOnly
                ? (

                  <label
                    className="
                      mt-4
                      block
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.06em]
                        text-slate-500
                        sm:tracking-[0.08em]
                      "
                    >
                      {
                        dictionary
                          .chooseUnit
                      }
                    </span>


                    <select
                      value={
                        moveUnitId
                      }
                      onChange={(
                        event
                      ) => {
                        setError("");

                        setMoveUnitId(
                          event.target
                            .value
                        );
                      }}
                      className="
                        mt-2
                        w-full
                        min-w-0
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-3
                        text-sm
                        font-bold
                        text-slate-800
                      "
                    >

                      {
                        units.map(
                          (unit) => (
                            <option
                              key={
                                unit.onboardingUnitId
                              }
                              value={
                                unit.onboardingUnitId
                              }
                            >
                              {
                                unit.unitName
                              }
                            </option>
                          )
                        )
                      }

                    </select>

                  </label>

                )
                : null
            }


            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-end
                sm:gap-3
              "
            >

              <button
                type="button"
                onClick={() => {

                  setMoveTarget(
                    null
                  );

                  setMoveCategory(
                    ""
                  );

                  setMoveUnitId(
                    ""
                  );
                }}
                className="
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-black
                  text-slate-700
                  sm:w-auto
                "
              >
                {dictionary.cancel}
              </button>


              <button
                type="button"
                disabled={
                  !moveCategory ||
                  busyId ===
                    moveTarget.id
                }
                onClick={
                  moveFile
                }
                className="
                  inline-flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  py-2.5
                  text-sm
                  font-black
                  text-white
                  disabled:opacity-50
                  sm:w-auto
                "
              >

                {
                  busyId ===
                  moveTarget.id
                    ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    )
                    : (
                      <MoveRight
                        size={16}
                      />
                    )
                }

                {dictionary.move}

              </button>

            </div>

          </div>

        </div>

      ) : null}

    </div>
  );
}
