"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import type {
  BookingSearchDictionary,
} from "@/components/book-search";

export type BookingMapProperty = {
  id: number;

  title: string | null;
  nickname: string | null;

  type?: string | null;

  bedrooms?: number | null;
  bathrooms?: number | null;
  accommodates?: number | null;

  currency?: string | null;
  totalPrice?: number | null;

  pictures?: Array<{
    original: string | null;
    thumbnail: string | null;
    caption: string | null;
  }>;

  address: {
    city: string | null;
    state: string | null;
    country: string | null;

    lat: number | null;
    lng: number | null;
  };
};

type BookingMapProps = {
  properties: BookingMapProperty[];
  dictionary: BookingSearchDictionary;

  activePropertyId?: number | null;

  onPropertySelect?: (
    propertyId: number
  ) => void;
};

function getPropertyName(
  property: BookingMapProperty,
  dictionary: BookingSearchDictionary
) {
  return (
    property.title ||
    property.nickname ||
    dictionary.property.defaultTitle
  );
}

function getPropertyLocation(
  property: BookingMapProperty
) {
  return [
    property.address.city,
    property.address.state,
    property.address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getPropertyImage(
  property: BookingMapProperty
) {
  const picture =
    property.pictures?.find(
      (item) =>
        item.thumbnail ||
        item.original
    );

  return (
    picture?.thumbnail ||
    picture?.original ||
    null
  );
}

function hasCoordinates(
  property: BookingMapProperty
): property is BookingMapProperty & {
  address: BookingMapProperty["address"] & {
    lat: number;
    lng: number;
  };
} {
  return (
    typeof property.address.lat ===
      "number" &&
    Number.isFinite(
      property.address.lat
    ) &&
    typeof property.address.lng ===
      "number" &&
    Number.isFinite(
      property.address.lng
    ) &&
    property.address.lat >= -90 &&
    property.address.lat <= 90 &&
    property.address.lng >= -180 &&
    property.address.lng <= 180
  );
}


function formatCurrencyAmount(
  amount: number,
  currency: string | null | undefined
) {
  if (!Number.isFinite(amount)) {
    return null;
  }

  const normalizedCurrency =
    currency
      ?.trim()
      .toUpperCase();

  if (
    normalizedCurrency &&
    /^[A-Z]{3}$/.test(
      normalizedCurrency
    )
  ) {
    try {
      return new Intl.NumberFormat(
        undefined,
        {
          style: "currency",
          currency:
            normalizedCurrency,
          maximumFractionDigits: 0,
        }
      ).format(amount);
    } catch {
      // Fall through to a safe
      // currency-code representation.
    }
  }

  if (normalizedCurrency) {
    return `${normalizedCurrency} ${amount.toLocaleString()}`;
  }

  return amount.toLocaleString();
}

function getPropertyPrice(
  property: BookingMapProperty
) {
  if (
    typeof property.totalPrice !==
      "number" ||
    !Number.isFinite(
      property.totalPrice
    )
  ) {
    return null;
  }

  return formatCurrencyAmount(
    property.totalPrice,
    property.currency
  );
}

function createPopupContent(
  property: BookingMapProperty,
  dictionary: BookingSearchDictionary
) {
  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.style.width =
    "220px";

  wrapper.style.fontFamily =
    "inherit";

  const image =
    getPropertyImage(
      property
    );

  if (image) {
    const imageElement =
      document.createElement(
        "img"
      );

    imageElement.src =
      image;

    imageElement.alt =
      getPropertyName(
        property,
        dictionary
      );

    imageElement.style.width =
      "100%";

    imageElement.style.height =
      "120px";

    imageElement.style.objectFit =
      "cover";

    imageElement.style.borderRadius =
      "12px";

    imageElement.style.marginBottom =
      "10px";

    wrapper.appendChild(
      imageElement
    );
  }

  const title =
    document.createElement(
      "div"
    );

  title.textContent =
    getPropertyName(
        property,
        dictionary
      );

  title.style.fontSize =
    "14px";

  title.style.fontWeight =
    "700";

  title.style.color =
    "#0f172a";

  wrapper.appendChild(
    title
  );

  const location =
    getPropertyLocation(
      property
    );

  if (location) {
    const locationElement =
      document.createElement(
        "div"
      );

    locationElement.textContent =
      location;

    locationElement.style.marginTop =
      "4px";

    locationElement.style.fontSize =
      "12px";

    locationElement.style.color =
      "#64748b";

    wrapper.appendChild(
      locationElement
    );
  }

  const details = [
    property.bedrooms !==
    null &&
    property.bedrooms !==
    undefined
      ? `${property.bedrooms} ${dictionary.property.bedroomsShort}`
      : null,

    property.bathrooms !==
    null &&
    property.bathrooms !==
    undefined
      ? `${property.bathrooms} ${dictionary.property.bathroomsShort}`
      : null,

    property.accommodates !==
    null &&
    property.accommodates !==
    undefined
      ? dictionary.property.upToGuests.replace(
          "{count}",
          String(property.accommodates)
        )
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  if (details) {
    const detailsElement =
      document.createElement(
        "div"
      );

    detailsElement.textContent =
      details;

    detailsElement.style.marginTop =
      "8px";

    detailsElement.style.fontSize =
      "12px";

    detailsElement.style.color =
      "#475569";

    wrapper.appendChild(
      detailsElement
    );
  }

  const price =
    getPropertyPrice(
      property
    );

  if (price) {
    const priceElement =
      document.createElement(
        "div"
      );

    priceElement.textContent =
      `${price} ${dictionary.property.total}`;

    priceElement.style.marginTop =
      "10px";

    priceElement.style.fontSize =
      "14px";

    priceElement.style.fontWeight =
      "700";

    priceElement.style.color =
      "#0f172a";

    wrapper.appendChild(
      priceElement
    );
  }

  const button =
    document.createElement(
      "button"
    );

  button.type =
    "button";

  button.textContent =
    dictionary.actions.viewStay;

  button.dataset.propertyId =
    String(property.id);

  button.style.width =
    "100%";

  button.style.height =
    "38px";

  button.style.marginTop =
    "12px";

  button.style.border =
    "0";

  button.style.borderRadius =
    "10px";

  button.style.background =
    "#0f172a";

  button.style.color =
    "#ffffff";

  button.style.fontSize =
    "12px";

  button.style.fontWeight =
    "700";

  button.style.cursor =
    "pointer";

  wrapper.appendChild(
    button
  );

  return {
    wrapper,
    button,
  };
}

export default function BookingMap({
  properties,
  dictionary,
  activePropertyId = null,
  onPropertySelect,
}: BookingMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const mapRef =
    useRef<MapLibreMap | null>(
      null
    );

  const markersRef =
    useRef<
      Map<number, Marker>
    >(new Map());

  const popupsRef =
    useRef<
      Map<number, Popup>
    >(new Map());

  const selectHandlerRef =
    useRef(
      onPropertySelect
    );

  useEffect(() => {
    selectHandlerRef.current =
      onPropertySelect;
  }, [onPropertySelect]);

  useEffect(() => {
    if (
      !containerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map =
      new MapLibreMap({
        container:
          containerRef.current,

        style:
          "https://tiles.openfreemap.org/styles/liberty",

        center: [
          33.4299,
          35.1264,
        ],

        zoom: 7,

      });

    map.addControl(
      new NavigationControl({
        showCompass: false,
      }),
      "top-right"
    );

    mapRef.current =
      map;

    return () => {
      markersRef.current.forEach(
        (marker) => {
          marker.remove();
        }
      );

      markersRef.current.clear();

      popupsRef.current.forEach(
        (popup) => {
          popup.remove();
        }
      );

      popupsRef.current.clear();

      map.remove();

      mapRef.current =
        null;
    };
  }, []);

  useEffect(() => {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach(
      (marker) => {
        marker.remove();
      }
    );

    markersRef.current.clear();

    popupsRef.current.forEach(
      (popup) => {
        popup.remove();
      }
    );

    popupsRef.current.clear();

    const validProperties =
      properties.filter(
        hasCoordinates
      );

    if (
      validProperties.length ===
      0
    ) {
      return;
    }

    const bounds =
      new LngLatBounds();

    validProperties.forEach(
      (property) => {
        const element =
          document.createElement(
            "button"
          );

        element.type =
          "button";

        element.setAttribute(
          "aria-label",
          dictionary.map.viewPropertyAria.replace(
            "{property}",
            getPropertyName(
              property,
              dictionary
            )
          )
        );

        element.dataset.propertyId =
          String(property.id);

        const markerPrice =
          getPropertyPrice(
            property
          );

        element.textContent =
          markerPrice ?? "";

        element.style.minWidth =
          markerPrice
            ? "58px"
            : "40px";

        element.style.height =
          "40px";

        element.style.padding =
          markerPrice
            ? "0 12px"
            : "0";

        element.style.borderRadius =
          "9999px";

        element.style.border =
          "3px solid white";

        element.style.background =
          "#0f172a";

        element.style.color =
          "#ffffff";

        element.style.fontSize =
          "12px";

        element.style.fontWeight =
          "700";

        element.style.whiteSpace =
          "nowrap";

        element.style.boxShadow =
          "0 5px 18px rgba(15, 23, 42, 0.30)";

        element.style.cursor =
          "pointer";

        element.style.transition =
          "transform 150ms ease, box-shadow 150ms ease, background 150ms ease";

        const {
          wrapper,
          button,
        } =
          createPopupContent(
            property,
            dictionary
          );

        const popup =
          new Popup({
            offset: 24,
            closeButton: false,
            closeOnClick: true,
            maxWidth: "260px",
          }).setDOMContent(
            wrapper
          );

        button.addEventListener(
          "click",
          () => {
            selectHandlerRef.current?.(
              property.id
            );
          }
        );

        element.addEventListener(
          "mouseenter",
          () => {
            element.style.transform =
              "scale(1.12)";
          }
        );

        element.addEventListener(
          "mouseleave",
          () => {
            if (
              activePropertyId !==
              property.id
            ) {
              element.style.transform =
                "scale(1)";
            }
          }
        );

        element.addEventListener(
          "click",
          () => {
            selectHandlerRef.current?.(
              property.id
            );

            popupsRef.current.forEach(
              (
                otherPopup,
                propertyId
              ) => {
                if (
                  propertyId !==
                  property.id
                ) {
                  otherPopup.remove();
                }
              }
            );

            popup
              .setLngLat([
                property.address.lng,
                property.address.lat,
              ])
              .addTo(map);
          }
        );

        const marker =
          new Marker({
            element,
            anchor: "center",
          })
            .setLngLat([
              property.address.lng,
              property.address.lat,
            ])
            .addTo(map);

        markersRef.current.set(
          property.id,
          marker
        );

        popupsRef.current.set(
          property.id,
          popup
        );

        bounds.extend([
          property.address.lng,
          property.address.lat,
        ]);
      }
    );

    if (
      validProperties.length ===
      1
    ) {
      const property =
        validProperties[0];

      map.easeTo({
        center: [
          property.address.lng,
          property.address.lat,
        ],

        zoom: 13,

        duration: 700,
      });

      return;
    }

    map.fitBounds(
      bounds,
      {
        padding: 70,
        maxZoom: 13,
        duration: 700,
      }
    );
  }, [
    properties,
    activePropertyId,
    dictionary,
  ]);

  useEffect(() => {
    markersRef.current.forEach(
      (
        marker,
        propertyId
      ) => {
        const element =
          marker.getElement();

        const isActive =
          propertyId ===
          activePropertyId;

        element.style.background =
          isActive
            ? "#334155"
            : "#0f172a";

        element.style.transform =
          isActive
            ? "scale(1.18)"
            : "scale(1)";

        element.style.boxShadow =
          isActive
            ? "0 7px 22px rgba(15, 23, 42, 0.40)"
            : "0 5px 18px rgba(15, 23, 42, 0.30)";

        element.style.zIndex =
          isActive
            ? "10"
            : "1";
      }
    );

    if (
      activePropertyId ===
      null
    ) {
      return;
    }

    const property =
      properties.find(
        (item) =>
          item.id ===
          activePropertyId
      );

    if (
      !property ||
      !hasCoordinates(
        property
      )
    ) {
      return;
    }

    mapRef.current?.easeTo({
      center: [
        property.address.lng,
        property.address.lat,
      ],

      duration: 450,
    });
  }, [
    activePropertyId,
    properties,
  ]);

  return (
    <div className="relative h-full min-h-[420px] w-full">
      <div
        ref={containerRef}
        className="h-full min-h-[420px] w-full"
        aria-label={dictionary.map.ariaLabel}
      />

      {properties.filter(
        hasCoordinates
      ).length === 0 ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-100/90 px-6 text-center">
          <div>
            <MapFallbackIcon />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              {dictionary.map.noLocationsTitle}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {dictionary.map.noLocationsDescription}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MapFallbackIcon() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6 text-slate-500"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
        />

        <circle
          cx="12"
          cy="10"
          r="2.2"
        />
      </svg>
    </div>
  );
}