"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Plus, Trash2, Upload, FileImage } from "lucide-react";

const euCountries = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
];

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

type OwnerType = "individual" | "business";

type UnitType = {
  id: number;
  name: string;
  type: string;
  quantity: string;

  bedrooms: string;
  bathrooms: string;
  size: string;

  maxGuests: string;
  maxAdults: string;
  maxChildren: string;

  kingBeds: string;
  queenBeds: string;
  doubleBeds: string;
  singleBeds: string;
  sofaBeds: string;
  bunkBeds: string;

  kitchen: string;
  smokingPolicy: string;
};

type FormData = {
  // STEP 1
  propertyCountry: string;
  ownerType: OwnerType;

  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phone: string;

  residenceCountry: string;
  dateOfBirth: string;

  residentialAddress: string;
  residentialCity: string;
  residentialPostalCode: string;

  businessName: string;
  businessRegistrationNumber: string;
  vatNumber: string;
  taxId: string;

  businessAddress: string;
  businessCity: string;
  businessPostalCode: string;

  // STEP 2
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  propertyRegion: string;
  propertyPostalCode: string;

  propertyCategory: string;
  ownershipStatus: string;

  accommodationStructure: string;

  registrationStatus: string;
  registrationNumber: string;
  landRegistrationNumber: string;
  additionalLegalNumber: string;

    // STEP 3
  listingStatus: string;

  bookingUrl: string;
  bookingId: string;

  airbnbUrl: string;
  airbnbId: string;

  vrboUrl: string;
  vrboId: string;

  expediaUrl: string;
  expediaId: string;

  agodaUrl: string;
  agodaId: string;

  tripcomUrl: string;
  tripcomId: string;

  otherPlatformName: string;
  otherPlatformUrl: string;

  channelManagerStatus: string;
  channelManagerName: string;

  pmsStatus: string;
  pmsName: string;

  websiteStatus: string;
  websiteUrl: string;

  directBookingsStatus: string;

  // STEP 4
  checkInFrom: string;
  checkInUntil: string;
  checkOutFrom: string;
  checkOutUntil: string;

  checkInMethod: string;
  receptionStatus: string;
  guestLanguages: string;

  childrenPolicy: string;
  minimumGuestAge: string;
  petsPolicy: string;
  partiesPolicy: string;
  smokingPropertyPolicy: string;
  quietHours: string;

  parkingDetails: string;
  breakfastDetails: string;
  internetDetails: string;
  accessibilityNotes: string;

  // STEP 5
  currency: string;
  minimumNightlyRate: string;
  cleaningFee: string;
  cleaningFeeType: string;
  securityDeposit: string;
  localTaxKnown: string;
  localTaxDetails: string;

  minimumStayDefault: string;
  maximumStay: string;
  advanceNotice: string;
  bookingWindow: string;
  sameDayBooking: string;

  cancellationPreference: string;
  prepaymentPreference: string;
  noShowPolicy: string;
  instantBookingPreference: string;

  breakfastPricing: string;
  breakfastPrice: string;

  currentAverageOccupancy: string;
  currentAverageDailyRate: string;
  annualRevenueEstimate: string;
  revenueTarget: string;

  weeklyDiscount: string;
  monthlyDiscount: string;
  nonRefundableRate: string;
  mobileRate: string;
  lastMinuteDiscount: string;
  earlyBookerDiscount: string;

  ownerBlockedDates: string;
  pricingNotes: string;

  // STEP 6
  existingListingTitle: string;
  propertySummary: string;
  uniqueSellingPoints: string;
  neighbourhoodDescription: string;
  gettingAround: string;
  nearbyAttractions: string;
  guestArrivalNotes: string;
  otherListingNotes: string;

  photoRightsConfirmed: string;

  // STEP 7
  primaryGoal: string;
  preferredStartTimeline: string;
  preferredContactMethod: string;
  bestContactTime: string;
  finalNotes: string;

  informationAccuracyConfirmed: string;
  authorizationConfirmed: string;
  listingSetupAuthorization: string;
};

type Errors = Record<string, string>;

const createEmptyUnit = (id: number): UnitType => ({
  id,
  name: "",
  type: "",
  quantity: "1",

  bedrooms: "",
  bathrooms: "",
  size: "",

  maxGuests: "",
  maxAdults: "",
  maxChildren: "",

  kingBeds: "",
  queenBeds: "",
  doubleBeds: "",
  singleBeds: "",
  sofaBeds: "",
  bunkBeds: "",

  kitchen: "",
  smokingPolicy: "",
});

export default function OnboardingForm({ dictionary }: { dictionary: any }) {
  const t = (key: string) => dictionary?.texts?.[key] ?? key;
  const tCountry = (country: string) => dictionary?.countries?.[country] ?? country;
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    propertyCountry: "",
    ownerType: "individual",

    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+30",
    phone: "",

    residenceCountry: "",
    dateOfBirth: "",

    residentialAddress: "",
    residentialCity: "",
    residentialPostalCode: "",

    businessName: "",
    businessRegistrationNumber: "",
    vatNumber: "",
    taxId: "",

    businessAddress: "",
    businessCity: "",
    businessPostalCode: "",

    propertyName: "",
    propertyAddress: "",
    propertyCity: "",
    propertyRegion: "",
    propertyPostalCode: "",

    propertyCategory: "",
    ownershipStatus: "",

    accommodationStructure: "",

    registrationStatus: "",
    registrationNumber: "",
    landRegistrationNumber: "",
    additionalLegalNumber: "",

        // STEP 3
    listingStatus: "",

    bookingUrl: "",
    bookingId: "",

    airbnbUrl: "",
    airbnbId: "",

    vrboUrl: "",
    vrboId: "",

    expediaUrl: "",
    expediaId: "",

    agodaUrl: "",
    agodaId: "",

    tripcomUrl: "",
    tripcomId: "",

    otherPlatformName: "",
    otherPlatformUrl: "",

    channelManagerStatus: "",
    channelManagerName: "",

    pmsStatus: "",
    pmsName: "",

    websiteStatus: "",
    websiteUrl: "",

    directBookingsStatus: "",

    // STEP 4
    checkInFrom: "",
    checkInUntil: "",
    checkOutFrom: "",
    checkOutUntil: "",

    checkInMethod: "",
    receptionStatus: "",
    guestLanguages: "",

    childrenPolicy: "",
    minimumGuestAge: "",
    petsPolicy: "",
    partiesPolicy: "",
    smokingPropertyPolicy: "",
    quietHours: "",

    parkingDetails: "",
    breakfastDetails: "",
    internetDetails: "",
    accessibilityNotes: "",

    // STEP 5
    currency: "EUR",
    minimumNightlyRate: "",
    cleaningFee: "",
    cleaningFeeType: "",
    securityDeposit: "",
    localTaxKnown: "",
    localTaxDetails: "",

    minimumStayDefault: "",
    maximumStay: "",
    advanceNotice: "",
    bookingWindow: "",
    sameDayBooking: "",

    cancellationPreference: "",
    prepaymentPreference: "",
    noShowPolicy: "",
    instantBookingPreference: "",

    breakfastPricing: "",
    breakfastPrice: "",

    currentAverageOccupancy: "",
    currentAverageDailyRate: "",
    annualRevenueEstimate: "",
    revenueTarget: "",

    weeklyDiscount: "",
    monthlyDiscount: "",
    nonRefundableRate: "",
    mobileRate: "",
    lastMinuteDiscount: "",
    earlyBookerDiscount: "",

    ownerBlockedDates: "",
    pricingNotes: "",

    // STEP 6
    existingListingTitle: "",
    propertySummary: "",
    uniqueSellingPoints: "",
    neighbourhoodDescription: "",
    gettingAround: "",
    nearbyAttractions: "",
    guestArrivalNotes: "",
    otherListingNotes: "",

    photoRightsConfirmed: "",

    // STEP 7
    primaryGoal: "",
    preferredStartTimeline: "",
    preferredContactMethod: "",
    bestContactTime: "",
    finalNotes: "",

    informationAccuracyConfirmed: "",
    authorizationConfirmed: "",
    listingSetupAuthorization: "",
  });

  const [units, setUnits] = useState<UnitType[]>([
    createEmptyUnit(1),
  ]);

  const [nextUnitId, setNextUnitId] = useState(2);

  const [errors, setErrors] = useState<Errors>({});

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const [selectedPropertyFacilities, setSelectedPropertyFacilities] = useState<string[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [unitAmenities, setUnitAmenities] = useState<Record<number, string[]>>({});

  const [unitPricing, setUnitPricing] = useState<
    Record<
      number,
      {
        currentBaseRate: string;
        weekendRate: string;
        minimumStay: string;
        extraGuestFee: string;
        childFee: string;
      }
    >
  >({});

  const [propertyPhotoGroups, setPropertyPhotoGroups] =
    useState<Record<string, File[]>>({});

  const [unitPhotoGroups, setUnitPhotoGroups] =
    useState<Record<number, Record<string, File[]>>>({});

  const [accessibilityPhotoGroups, setAccessibilityPhotoGroups] =
    useState<Record<string, File[]>>({});

  const [checkInPhotoGroups, setCheckInPhotoGroups] =
    useState<Record<string, File[]>>({});

  const [floorPlanFiles, setFloorPlanFiles] =
    useState<File[]>([]);

  const [frontEndSubmissionComplete, setFrontEndSubmissionComplete] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  const appendFiles = (
    current: File[],
    incoming: FileList | null
  ) => {
    if (!incoming) {
      return current;
    }

    const newFiles = Array.from(incoming);

    return [...current, ...newFiles];
  };

  const removeFileAtIndex = (
    files: File[],
    index: number
  ) => {
    return files.filter(
      (_, fileIndex) => fileIndex !== index
    );
  };


  const propertyUploadCategories = [
    { key: "property_exterior", label: "Exterior", description: "Building exterior and street-facing views." },
    { key: "property_entrance", label: "Entrance", description: "Main property entrance and arrival area." },
    { key: "property_parking", label: "Parking", description: "Parking areas, access and EV charging where available." },
    { key: "property_reception", label: "Reception / Lobby", description: "Reception, lobby or welcome area where available." },
    { key: "property_common_areas", label: "Common Areas", description: "Shared lounges, corridors and common guest spaces." },
    { key: "property_pool", label: "Pool", description: "Shared pool and poolside areas where available." },
    { key: "property_garden_terrace", label: "Garden / Terrace / Outdoor Areas", description: "Garden, terrace, patios and other outdoor guest spaces." },
    { key: "property_restaurant_bar", label: "Restaurant / Bar", description: "Breakfast, restaurant and bar areas where available." },
    { key: "property_gym_spa", label: "Gym / Spa / Wellness", description: "Gym, spa, sauna, hot tub or wellness areas where available." },
    { key: "property_views", label: "Property Views", description: "Sea, mountain, city, garden or other important views." },
  ];

  const unitUploadCategories = [
    { key: "unit_bedroom_sleeping", label: "Bedroom / Sleeping Area", description: "Beds and the complete sleeping area." },
    { key: "unit_bathroom", label: "Bathroom", description: "Bathroom, shower, bathtub and toilet area." },
    { key: "unit_kitchen", label: "Kitchen / Kitchenette", description: "Kitchen, kitchenette and important appliances." },
    { key: "unit_living_dining", label: "Living / Dining Area", description: "Living room, seating and dining area." },
    { key: "unit_balcony_terrace", label: "Balcony / Terrace / Patio", description: "Private balcony, terrace or patio belonging to this unit." },
    { key: "unit_private_pool", label: "Private Pool / Hot Tub", description: "Private pool, hot tub or other private outdoor feature." },
    { key: "unit_views", label: "Unit Views", description: "Views visible from this room or unit." },
  ];

  const accessibilityUploadCategories = [
    { key: "accessibility_step_free_entrance", feature: "Step-Free Guest Entrance", label: "Step-Free Guest Entrance", description: "Show the complete step-free route to the guest entrance." },
    { key: "accessibility_parking", feature: "Accessible Parking Space", label: "Accessible Parking", description: "Show the accessible parking space and route from parking." },
    { key: "accessibility_entrance_door_width", feature: "Wide Entrance Doorway", label: "Entrance Door Width", description: "Include clear doorway-width evidence; measurement photos are especially useful." },
    { key: "accessibility_lit_path", feature: "Well-Lit Path to Guest Entrance", label: "Lit Path to Entrance", description: "Show the lighting along the route to the guest entrance, ideally after dark." },
    { key: "accessibility_lift", feature: "Lift / Elevator Access", label: "Lift / Elevator Access", description: "Show the lift, doors and route to the accommodation." },
    { key: "accessibility_bedroom_step_free", feature: "Step-Free Bedroom Access", label: "Step-Free Bedroom Access", description: "Show the route and entrance into the bedroom/sleeping area." },
    { key: "accessibility_bathroom_step_free", feature: "Step-Free Bathroom Access", label: "Step-Free Bathroom Access", description: "Show the route and entrance into the bathroom." },
    { key: "accessibility_room_door_width", feature: "Wide Bedroom / Room Doorway", label: "Bedroom / Room Door Width", description: "Show doorway-width evidence for the accessible room or bedroom." },
    { key: "accessibility_bathroom_door_width", feature: "Wide Bathroom Doorway", label: "Bathroom Door Width", description: "Show doorway-width evidence for the accessible bathroom." },
    { key: "accessibility_grab_rails", feature: "Grab Rails in Bathroom", label: "Bathroom Grab Rails", description: "Show the position and type of grab rails clearly." },
    { key: "accessibility_roll_in_shower", feature: "Roll-In / Step-Free Shower", label: "Roll-In / Step-Free Shower", description: "Show the shower entrance, floor level and usable shower space." },
  ];

  const checkInUploadCategories = [
    { key: "checkin_building_entrance", label: "Building / Property Entrance", description: "Useful for arrival and check-in instructions." },
    { key: "checkin_lockbox_keypad", label: "Lockbox / Keypad / Key Collection", description: "Show the lockbox, keypad or key-collection point without exposing private codes." },
    { key: "checkin_route_to_unit", label: "Route from Entrance to Unit", description: "Show turns, stairs, lifts, corridors or landmarks a guest needs after entering." },
  ];

  const addFilesToGroup = (
    setter: Dispatch<SetStateAction<Record<string, File[]>>>,
    groupKey: string,
    incoming: FileList | null
  ) => {
    setter((previous) => ({
      ...previous,
      [groupKey]: appendFiles(previous[groupKey] || [], incoming).slice(0, 50),
    }));
  };

  const removeFileFromGroup = (
    setter: Dispatch<SetStateAction<Record<string, File[]>>>,
    groupKey: string,
    index: number
  ) => {
    setter((previous) => ({
      ...previous,
      [groupKey]: removeFileAtIndex(previous[groupKey] || [], index),
    }));
  };

  const renderUploadGroup = ({
    label,
    description,
    files,
    accept = "image/jpeg,image/png,image/webp",
    onAdd,
    onRemove,
  }: {
    label: string;
    description: string;
    files: File[];
    accept?: string;
    onAdd: (files: FileList | null) => void;
    onRemove: (index: number) => void;
  }) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900">{t(label)}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t(description)}</p>
          {files.length > 0 && (
            <p className="mt-2 text-sm font-bold text-blue-600">
              {files.length} / 50 {t("files selected")}
            </p>
          )}
        </div>

        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 font-bold text-blue-600 transition hover:border-blue-500 hover:shadow-sm">
          <Upload size={17} />
          {t("Add Files")}
          <input
            type="file"
            multiple
            accept={accept}
            className="hidden"
            onChange={(event) => {
              onAdd(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileImage size={17} className="shrink-0 text-blue-600" />
                <span className="truncate text-xs font-semibold text-slate-700">
                  {file.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                aria-label={t("Remove file")}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const totalSelectedUploadFiles =
    Object.values(propertyPhotoGroups).reduce(
      (total, files) => total + files.length,
      0
    ) +
    Object.values(accessibilityPhotoGroups).reduce(
      (total, files) => total + files.length,
      0
    ) +
    Object.values(checkInPhotoGroups).reduce(
      (total, files) => total + files.length,
      0
    ) +
    floorPlanFiles.length +
    Object.values(unitPhotoGroups).reduce(
      (grandTotal, groups) =>
        grandTotal +
        Object.values(groups).reduce(
          (total, files) => total + files.length,
          0
        ),
      0
    );


  const updateUnitPricing = (
    unitId: number,
    field:
      | "currentBaseRate"
      | "weekendRate"
      | "minimumStay"
      | "extraGuestFee"
      | "childFee",
    value: string
  ) => {
    setUnitPricing((previous) => ({
      ...previous,
      [unitId]: {
        currentBaseRate:
          previous[unitId]?.currentBaseRate || "",
        weekendRate:
          previous[unitId]?.weekendRate || "",
        minimumStay:
          previous[unitId]?.minimumStay || "",
        extraGuestFee:
          previous[unitId]?.extraGuestFee || "",
        childFee:
          previous[unitId]?.childFee || "",
        [field]: value,
      },
    }));
  };

  const propertyFacilities = [
    "Free WiFi",
    "Free Parking",
    "Paid Parking",
    "Swimming Pool",
    "Garden",
    "Terrace",
    "Balcony",
    "Lift / Elevator",
    "Air Conditioning",
    "Heating",
    "Restaurant",
    "Bar",
    "24-Hour Front Desk",
    "Luggage Storage",
    "Airport Shuttle",
    "Laundry Service",
    "EV Charging",
    "Gym / Fitness Centre",
    "Spa / Sauna",
    "Hot Tub / Jacuzzi",
    "BBQ Facilities",
    "Beach Access",
    "Private Beach Area",
    "Security Cameras Outside",
    "Smoke Alarms",
    "Fire Extinguishers",
  ];

  const accessibilityFeatures = [
    "Step-Free Guest Entrance",
    "Accessible Parking Space",
    "Wide Entrance Doorway",
    "Well-Lit Path to Guest Entrance",
    "Lift / Elevator Access",
    "Step-Free Bedroom Access",
    "Step-Free Bathroom Access",
    "Wide Bedroom / Room Doorway",
    "Wide Bathroom Doorway",
    "Grab Rails in Bathroom",
    "Roll-In / Step-Free Shower",
  ];

  const roomAmenities = [
    "Air Conditioning",
    "Heating",
    "TV",
    "Streaming Services",
    "WiFi",
    "Refrigerator",
    "Microwave",
    "Oven",
    "Stovetop",
    "Dishwasher",
    "Washing Machine",
    "Dryer",
    "Coffee Machine",
    "Kettle",
    "Toaster",
    "Dining Area",
    "Desk / Workspace",
    "Safe",
    "Hair Dryer",
    "Iron",
    "Free Toiletries",
    "Private Bathroom",
    "Bathtub",
    "Shower",
    "Balcony",
    "Terrace / Patio",
    "Private Entrance",
    "Soundproofing",
    "Sea View",
    "Pool View",
    "Garden View",
    "City View",
  ];

  const togglePropertyFacility = (facility: string) => {
    setSelectedPropertyFacilities((previous) =>
      previous.includes(facility)
        ? previous.filter((item) => item !== facility)
        : [...previous, facility]
    );
  };

  const toggleAccessibility = (feature: string) => {
    setSelectedAccessibility((previous) =>
      previous.includes(feature)
        ? previous.filter((item) => item !== feature)
        : [...previous, feature]
    );
  };

  const toggleUnitAmenity = (
    unitId: number,
    amenity: string
  ) => {
    setUnitAmenities((previous) => {
      const current = previous[unitId] || [];

      return {
        ...previous,
        [unitId]: current.includes(amenity)
          ? current.filter((item) => item !== amenity)
          : [...current, amenity],
      };
    });
  };

    const togglePlatform = (platform: string) => {
    setSelectedPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((item) => item !== platform)
        : [...previous, platform]
    );

    setErrors((previous) => ({
      ...previous,
      platforms: "",
    }));
  };



  // =========================================================
  // BASIC FIELD UPDATE
  // =========================================================

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  // =========================================================
  // UNIT UPDATE
  // =========================================================

  const updateUnit = (
    id: number,
    field: keyof UnitType,
    value: string
  ) => {
    setUnits((previous) =>
      previous.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              [field]: value,
            }
          : unit
      )
    );

    setErrors((previous) => ({
      ...previous,
      [`unit-${id}-${field}`]: "",
    }));
  };

  const addUnit = () => {
    setUnits((previous) => [
      ...previous,
      createEmptyUnit(nextUnitId),
    ]);

    setNextUnitId((previous) => previous + 1);
  };

  const removeUnit = (id: number) => {
    if (units.length === 1) {
      return;
    }

    setUnits((previous) =>
      previous.filter((unit) => unit.id !== id)
    );
  };

  // =========================================================
  // INPUT CLASSES
  // =========================================================

  const inputClass = (field: string) =>
    `w-full rounded-2xl border bg-white px-4 py-4 text-slate-900 outline-none transition ${
      errors[field]
        ? "border-red-500 ring-4 ring-red-50"
        : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    }`;

  const ErrorMessage = ({
    field,
  }: {
    field: string;
  }) => {
    if (!errors[field]) {
      return null;
    }

    return (
      <p className="mt-2 text-sm font-semibold text-red-600">
        {errors[field]}
      </p>
    );
  };

  // =========================================================
  // STEP 1 VALIDATION
  // =========================================================

  const validateStepOne = () => {
    const newErrors: Errors = {};

    if (!formData.propertyCountry) {
      newErrors.propertyCountry =
        t("Please select the country where the property is located.");
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        t("Please enter your legal first name.");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        t("Please enter your legal last name.");
    }

    if (!formData.email.trim()) {
      newErrors.email =
        t("Please enter your email address.");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        t("Please enter a valid email address.");
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        t("Please enter your phone or WhatsApp number.");
    }

    if (!formData.residenceCountry) {
      newErrors.residenceCountry =
        t("Please select your country of residence.");
    }

    if (
      formData.ownerType === "business" &&
      !formData.businessName.trim()
    ) {
      newErrors.businessName =
        t("Please enter the legal business name.");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // STEP 2 VALIDATION
  // =========================================================

  const validateStepTwo = () => {
    const newErrors: Errors = {};

    if (!formData.propertyName.trim()) {
      newErrors.propertyName =
        t("Please enter the property name.");
    }

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress =
        t("Please enter the property address.");
    }

    if (!formData.propertyCity.trim()) {
      newErrors.propertyCity =
        t("Please enter the city or locality.");
    }

    if (!formData.propertyPostalCode.trim()) {
      newErrors.propertyPostalCode =
        t("Please enter the property postal code.");
    }

    if (!formData.propertyCategory) {
      newErrors.propertyCategory =
        t("Please select the general property category.");
    }

    if (!formData.ownershipStatus) {
      newErrors.ownershipStatus =
        t("Please tell us your relationship to the property.");
    }

    if (!formData.accommodationStructure) {
      newErrors.accommodationStructure =
        t("Please tell us how the accommodation is sold.");
    }

    units.forEach((unit) => {
      if (!unit.name.trim()) {
        newErrors[`unit-${unit.id}-name`] =
          t("Please enter a name for this room or unit type.");
      }

      if (!unit.type) {
        newErrors[`unit-${unit.id}-type`] =
          t("Please select the room or unit type.");
      }

      if (
        !unit.quantity ||
        Number(unit.quantity) < 1
      ) {
        newErrors[`unit-${unit.id}-quantity`] =
          t("Please enter how many identical units exist.");
      }

      if (
        !unit.maxGuests ||
        Number(unit.maxGuests) < 1
      ) {
        newErrors[`unit-${unit.id}-maxGuests`] =
          t("Please enter the maximum guests for this unit type.");
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const continueFromStepOne = () => {
    if (!validateStepOne()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const continueFromStepTwo = () => {
    if (!validateStepTwo()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateStepThree = () => {
    const newErrors: Errors = {};

    if (!formData.listingStatus) {
      newErrors.listingStatus =
        t("Please tell us whether the property is currently listed online.");
    }

    if (
      (formData.listingStatus === "yes" ||
        formData.listingStatus === "partial") &&
      selectedPlatforms.length === 0
    ) {
      newErrors.platforms =
        t("Please select at least one platform where the property is currently listed.");
    }

    if (!formData.channelManagerStatus) {
      newErrors.channelManagerStatus =
        t("Please select an option.");
    }

    if (!formData.pmsStatus) {
      newErrors.pmsStatus =
        t("Please select an option.");
    }

    if (!formData.websiteStatus) {
      newErrors.websiteStatus =
        t("Please select an option.");
    }

    if (!formData.directBookingsStatus) {
      newErrors.directBookingsStatus =
        t("Please select an option.");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const continueFromStepThree = () => {
    if (!validateStepThree()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(4);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // STEP 4 VALIDATION
  // =========================================================

  const validateStepFour = () => {
    const newErrors: Errors = {};

    if (!formData.checkInFrom) {
      newErrors.checkInFrom =
        t("Please enter the earliest check-in time.");
    }

    if (!formData.checkOutUntil) {
      newErrors.checkOutUntil =
        t("Please enter the latest check-out time.");
    }

    if (!formData.checkInMethod) {
      newErrors.checkInMethod =
        t("Please select the main check-in method.");
    }

    if (!formData.guestLanguages.trim()) {
      newErrors.guestLanguages =
        t("Please enter at least one language used for guest communication.");
    }

    if (!formData.childrenPolicy) {
      newErrors.childrenPolicy =
        t("Please select the children policy.");
    }

    if (!formData.petsPolicy) {
      newErrors.petsPolicy =
        t("Please select the pets policy.");
    }

    if (!formData.partiesPolicy) {
      newErrors.partiesPolicy =
        t("Please select the parties / events policy.");
    }

    if (!formData.smokingPropertyPolicy) {
      newErrors.smokingPropertyPolicy =
        t("Please select the smoking policy.");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const continueFromStepFour = () => {
    if (!validateStepFour()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(5);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // STEP 5 VALIDATION
  // =========================================================

  const validateStepFive = () => {
    // Step 5 is intentionally optional.
    // Most owners do not know exact pricing, discount or booking-rule values,
    // and HostMetric will build the final commercial strategy after analysis.
    setErrors({});
    return true;
  };

  const continueFromStepFive = () => {
    if (!validateStepFive()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(6);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // STEP 6 VALIDATION
  // =========================================================

  const validateStepSix = () => {
    const newErrors: Errors = {};

    if (
      totalSelectedUploadFiles > 0 &&
      formData.photoRightsConfirmed !== "yes"
    ) {
      newErrors.photoRightsConfirmed =
        t("Please confirm that you own or have permission to use the uploaded files.");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const continueFromStepSix = () => {
    if (!validateStepSix()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(7);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // STEP 7 VALIDATION
  // =========================================================

  const validateStepSeven = () => {
    const newErrors: Errors = {};

    if (!formData.primaryGoal) {
      newErrors.primaryGoal =
        t("Please select the main goal for your property.");
    }

    if (!formData.preferredContactMethod) {
      newErrors.preferredContactMethod =
        t("Please select how you would prefer us to contact you.");
    }

    if (formData.informationAccuracyConfirmed !== "yes") {
      newErrors.informationAccuracyConfirmed =
        t("Please confirm that the information is accurate to the best of your knowledge.");
    }

    if (formData.authorizationConfirmed !== "yes") {
      newErrors.authorizationConfirmed =
        t("Please confirm that you are authorized to provide information for this property.");
    }

    if (formData.listingSetupAuthorization !== "yes") {
      newErrors.listingSetupAuthorization =
        t("Please confirm that HostMetric may review this information for onboarding and listing setup.");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitOnboarding = async () => {
    if (!validateStepSeven()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    if (isSubmitting) {
      return;
    }

    setErrors({});
    setSubmissionError("");
    setIsSubmitting(true);

    let driveFolderId: string | null = null;

    type PendingUpload = {
      file: File;
      fileGroup: string;
      unitClientId: number | null;
      unitName: string | null;
    };

    try {
      const pendingUploads: PendingUpload[] = [];

      Object.entries(propertyPhotoGroups).forEach(([fileGroup, files]) => {
        files.forEach((file) => {
          pendingUploads.push({
            file,
            fileGroup,
            unitClientId: null,
            unitName: null,
          });
        });
      });

      Object.entries(unitPhotoGroups).forEach(([unitIdText, groups]) => {
        const unitClientId = Number(unitIdText);
        const unit = units.find((item) => item.id === unitClientId);

        Object.entries(groups).forEach(([fileGroup, files]) => {
          files.forEach((file) => {
            pendingUploads.push({
              file,
              fileGroup,
              unitClientId,
              unitName: unit?.name || `Unit ${unitClientId}`,
            });
          });
        });
      });

      Object.entries(accessibilityPhotoGroups).forEach(([fileGroup, files]) => {
        files.forEach((file) => {
          pendingUploads.push({
            file,
            fileGroup,
            unitClientId: null,
            unitName: null,
          });
        });
      });

      Object.entries(checkInPhotoGroups).forEach(([fileGroup, files]) => {
        files.forEach((file) => {
          pendingUploads.push({
            file,
            fileGroup,
            unitClientId: null,
            unitName: null,
          });
        });
      });

      floorPlanFiles.forEach((file) => {
        pendingUploads.push({
          file,
          fileGroup: "floor_plan",
          unitClientId: null,
          unitName: null,
        });
      });

      let uploadManifest: Array<{
        folderId: string;
        fileGroup: string;
        unitClientId: number | null;
        storedName: string;
        originalName: string;
        type: string;
        size: number;
      }> = [];

      if (pendingUploads.length > 0) {
        setUploadProgress({ completed: 0, total: pendingUploads.length });

        const sessionResponse = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create-upload-batch",
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            propertyName: formData.propertyName,
            files: pendingUploads.map((item) => ({
              name: item.file.name,
              type: item.file.type,
              size: item.file.size,
              fileGroup: item.fileGroup,
              unitClientId: item.unitClientId,
              unitName: item.unitName,
            })),
          }),
        });

        const sessionResult = await sessionResponse.json();

        if (!sessionResponse.ok || !sessionResult.success) {
          throw new Error(sessionResult.error || "Could not prepare Google Drive uploads.");
        }

        driveFolderId = String(sessionResult.folderId || "");

        const uploads = sessionResult.uploads as Array<{
          index: number;
          uploadUrl: string;
          folderId: string;
          fileGroup: string;
          unitClientId: number | null;
          storedName: string;
          originalName: string;
          type: string;
          size: number;
        }>;

        uploadManifest = uploads.map((upload) => ({
          folderId: upload.folderId,
          fileGroup: upload.fileGroup,
          unitClientId: upload.unitClientId,
          storedName: upload.storedName,
          originalName: upload.originalName,
          type: upload.type,
          size: upload.size,
        }));

        let completed = 0;
        const concurrency = 3;

        for (let startIndex = 0; startIndex < uploads.length; startIndex += concurrency) {
          const batch = uploads.slice(startIndex, startIndex + concurrency);

          await Promise.all(
            batch.map(async (upload) => {
              const file = pendingUploads[upload.index]?.file;

              if (!file) {
                throw new Error("Could not match a selected file to its upload session.");
              }

              try {
                const uploadResponse = await fetch(upload.uploadUrl, {
                  method: "PUT",
                  headers: {
                    "Content-Type": file.type || "application/octet-stream",
                  },
                  body: file,
                });

                if (!uploadResponse.ok) {
                  throw new Error(`Google Drive upload failed with status ${uploadResponse.status}.`);
                }
              } catch (uploadError) {
                // Google Drive may successfully accept a resumable PUT while the
                // browser cannot read the response because of CORS. The server
                // verifies every expected file before the database is written.
                console.warn(
                  "Drive upload response could not be read; server verification will confirm it:",
                  uploadError
                );
              }

              completed += 1;
              setUploadProgress({ completed, total: uploads.length });
            })
          );
        }
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "submit-onboarding",
          formData,
          units,
          selectedPlatforms,
          selectedPropertyFacilities,
          selectedAccessibility,
          unitAmenities,
          unitPricing,
          driveFolderId,
          expectedFileCount: pendingUploads.length,
          uploadManifest,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "The onboarding submission could not be completed.");
      }

      setUploadProgress(null);
      setFrontEndSubmissionComplete(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Onboarding submission error:", error);
      setUploadProgress(null);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : t("Something went wrong while submitting the onboarding form. Please try again.")
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setErrors({});

    setStep((current) =>
      Math.max(1, current - 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (frontEndSubmissionComplete) {
    return (
      <div className="mx-auto w-full max-w-4xl">

        <div className="rounded-[32px] border border-green-100 bg-white p-10 text-center shadow-xl md:p-14">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-green-600">
            {t("Onboarding Complete")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Your property information is ready for review")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t("Your onboarding information has been saved securely and sent to the HostMetric team for review. We will contact you if we need any clarification or additional material.")}
          

</p>

          <div className="mt-8 rounded-2xl bg-blue-50 px-6 py-5 text-left">

            <p className="font-bold text-blue-950">
              {t("Need to speak with us?")}
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              {t("You can contact our team for help, corrections or questions about your property.")}
            </p>

            <a
              href="/contact"
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {t("Contact Us →")}
            </a>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="mb-10">

        <div className="flex items-center justify-between">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Property Onboarding")}
          </p>

          <p className="text-sm font-semibold text-slate-500">
            {t("Step")} {step} {t("of 7")}
          </p>

        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${(step / 7) * 100}%`,
            }}
          />

        </div>

      </div>


      {/* =====================================================
          GENERAL NOTICE
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/90 px-6 py-5">

        <p className="font-semibold text-blue-950">
          {t("Only fields marked with * are required.")}
        </p>

        <p className="mt-1 text-sm leading-6 text-blue-800">
          {t("If you do not know an answer, leave the optional field blank. We can help you complete missing information later.")}
        

</p>

      </div>


      {/* =====================================================
          HELP / CONTACT — VISIBLE ON EVERY STEP
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="font-bold text-slate-900">
            {t("Having trouble with any question?")}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {t("Leave optional fields blank or contact us and we&apos;ll help you complete the onboarding.")}
          </p>

        </div>


        <a
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg"
        >
          {t("Contact Us →")}
        </a>

      </div>


      {/* =====================================================
          STEP 1
      ===================================================== */}

      {step === 1 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 01")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Owner & Business Details")}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {t("Tell us who owns or operates the property. Your answers help us determine which legal and property questions apply later.")}
          

</p>


          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* PROPERTY COUNTRY */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Property Country *")}
              </label>

              <select
                value={formData.propertyCountry}
                onChange={(event) =>
                  updateField(
                    "propertyCountry",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyCountry"
                )}
              >

                <option value="">
                  {t("Select property country")}
                </option>

                {euCountries.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {tCountry(country)}
                  </option>
                ))}

              </select>

              <ErrorMessage field="propertyCountry" />

            </div>


            {/* OWNER TYPE */}
            <div className="md:col-span-2">

              <label className="mb-3 block text-sm font-bold text-slate-700">
                {t("Owner Type *")}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "ownerType",
                      "individual"
                    )
                  }
                  className={`cursor-pointer rounded-2xl border px-6 py-5 text-left transition ${
                    formData.ownerType ===
                    "individual"
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-300 bg-white hover:border-blue-300"
                  }`}
                >

                  <p className="font-bold text-slate-900">
                    {t("Individual")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("The accommodation is owned or operated by a private individual.")}
                  
</p>

                </button>


                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "ownerType",
                      "business"
                    )
                  }
                  className={`cursor-pointer rounded-2xl border px-6 py-5 text-left transition ${
                    formData.ownerType ===
                    "business"
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-300 bg-white hover:border-blue-300"
                  }`}
                >

                  <p className="font-bold text-slate-900">
                    {t("Business")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("The accommodation is operated through a company or legal entity.")}
                  
</p>

                </button>

              </div>

            </div>


            {/* NAMES */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Legal First Name *")}
              </label>

              <input
                value={formData.firstName}
                onChange={(event) =>
                  updateField(
                    "firstName",
                    event.target.value
                  )
                }
                className={inputClass("firstName")}
              />

              <ErrorMessage field="firstName" />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Legal Last Name *")}
              </label>

              <input
                value={formData.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value
                  )
                }
                className={inputClass("lastName")}
              />

              <ErrorMessage field="lastName" />

            </div>


            {/* EMAIL PHONE */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Email *")}
              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                className={inputClass("email")}
              />

              <ErrorMessage field="email" />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Phone / WhatsApp *")}
              </label>

              <div
                className={`flex overflow-hidden rounded-2xl border bg-white transition ${
                  errors.phone
                    ? "border-red-500 ring-4 ring-red-50"
                    : "border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
                }`}
              >

                <select
                  aria-label={t("Phone country code")}
                  value={formData.phoneCountryCode}
                  onChange={(event) =>
                    updateField(
                      "phoneCountryCode",
                      event.target.value
                    )
                  }
                  className="w-[145px] shrink-0 cursor-pointer border-r border-slate-300 bg-slate-50 px-3 py-4 font-semibold text-slate-900 outline-none sm:w-[175px]"
                >

                  {phoneCountryCodes.map((item) => (
                    <option
                      key={`${item.country}-${item.code}`}
                      value={item.code}
                    >
                      {item.flag} {item.code} {tCountry(item.country)}
                    </option>
                  ))}

                </select>


                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={formData.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder={t("Phone number")}
                  className="min-w-0 flex-1 bg-white px-4 py-4 text-slate-900 outline-none"
                />

              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {t("Select your country flag and international calling code, then enter your phone or WhatsApp number.")}
              </p>

              <ErrorMessage field="phone" />

            </div>


            {/* RESIDENCE */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Country of Residence *")}
              </label>

              <select
                value={formData.residenceCountry}
                onChange={(event) =>
                  updateField(
                    "residenceCountry",
                    event.target.value
                  )
                }
                className={inputClass(
                  "residenceCountry"
                )}
              >

                <option value="">
                  {t("Select country")}
                </option>

                {euCountries.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {tCountry(country)}
                  </option>
                ))}

              </select>

              <ErrorMessage field="residenceCountry" />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Date of Birth")}
              </label>

              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) =>
                  updateField(
                    "dateOfBirth",
                    event.target.value
                  )
                }
                className={inputClass(
                  "dateOfBirth"
                )}
              />

            </div>


            {/* RESIDENTIAL ADDRESS */}

            <div className="md:col-span-2 mt-3 border-t border-slate-200 pt-8">

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                {t("Residential Address")}
              </p>

            </div>


            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Street Address")}
              </label>

              <input
                value={formData.residentialAddress}
                onChange={(event) =>
                  updateField(
                    "residentialAddress",
                    event.target.value
                  )
                }
                placeholder={t("Street and number")}
                className={inputClass(
                  "residentialAddress"
                )}
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("City")}
              </label>

              <input
                value={formData.residentialCity}
                onChange={(event) =>
                  updateField(
                    "residentialCity",
                    event.target.value
                  )
                }
                className={inputClass(
                  "residentialCity"
                )}
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Postal Code")}
              </label>

              <input
                value={
                  formData.residentialPostalCode
                }
                onChange={(event) =>
                  updateField(
                    "residentialPostalCode",
                    event.target.value
                  )
                }
                className={inputClass(
                  "residentialPostalCode"
                )}
              />

            </div>


            {/* BUSINESS */}
            {formData.ownerType === "business" && (
              <>

                <div className="md:col-span-2 mt-4 border-t border-slate-200 pt-8">

                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                    {t("Business Information")}
                  </p>

                </div>


                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Legal Business Name *")}
                  </label>

                  <input
                    value={formData.businessName}
                    onChange={(event) =>
                      updateField(
                        "businessName",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "businessName"
                    )}
                  />

                  <ErrorMessage field="businessName" />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Business Registration Number")}
                  </label>

                  <input
                    value={
                      formData.businessRegistrationNumber
                    }
                    onChange={(event) =>
                      updateField(
                        "businessRegistrationNumber",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "businessRegistrationNumber"
                    )}
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("VAT Number")}
                  </label>

                  <input
                    value={formData.vatNumber}
                    onChange={(event) =>
                      updateField(
                        "vatNumber",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "vatNumber"
                    )}
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Tax Identification Number")}
                  </label>

                  <input
                    value={formData.taxId}
                    onChange={(event) =>
                      updateField(
                        "taxId",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "taxId"
                    )}
                  />

                </div>


                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Registered Business Address")}
                  </label>

                  <input
                    value={formData.businessAddress}
                    onChange={(event) =>
                      updateField(
                        "businessAddress",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "businessAddress"
                    )}
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Business City")}
                  </label>

                  <input
                    value={formData.businessCity}
                    onChange={(event) =>
                      updateField(
                        "businessCity",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "businessCity"
                    )}
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Business Postal Code")}
                  </label>

                  <input
                    value={
                      formData.businessPostalCode
                    }
                    onChange={(event) =>
                      updateField(
                        "businessPostalCode",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "businessPostalCode"
                    )}
                  />

                </div>

              </>
            )}

          </div>


          <div className="mt-12 flex justify-end">

            <button
              type="button"
              onClick={continueFromStepOne}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {t("Continue to Property Details →")}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          STEP 2
      ===================================================== */}

      {step === 2 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 02")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Property & Accommodation Setup")}
          </h1>


          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* PROPERTY NAME */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Property Name *")}
              </label>

              <input
                value={formData.propertyName}
                onChange={(event) =>
                  updateField(
                    "propertyName",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyName"
                )}
              />

              <ErrorMessage field="propertyName" />

            </div>


            {/* ADDRESS */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Property Address *")}
              </label>

              <input
                value={formData.propertyAddress}
                onChange={(event) =>
                  updateField(
                    "propertyAddress",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyAddress"
                )}
              />

              <ErrorMessage field="propertyAddress" />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("City / Locality *")}
              </label>

              <input
                value={formData.propertyCity}
                onChange={(event) =>
                  updateField(
                    "propertyCity",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyCity"
                )}
              />

              <ErrorMessage field="propertyCity" />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Region / District")}
              </label>

              <input
                value={formData.propertyRegion}
                onChange={(event) =>
                  updateField(
                    "propertyRegion",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyRegion"
                )}
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Postal Code *")}
              </label>

              <input
                value={formData.propertyPostalCode}
                onChange={(event) =>
                  updateField(
                    "propertyPostalCode",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyPostalCode"
                )}
              />

              <ErrorMessage
                field="propertyPostalCode"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("General Property Category *")}
              </label>

              <select
                value={formData.propertyCategory}
                onChange={(event) =>
                  updateField(
                    "propertyCategory",
                    event.target.value
                  )
                }
                className={inputClass(
                  "propertyCategory"
                )}
              >

                <option value="">
                  {t("Select category")}
                </option>

                <option value="apartment-building">
                  {t("Apartments / Apartment Building")}
                </option>

                <option value="hotel">
                  {t("Hotel / Aparthotel")}
                </option>

                <option value="villa-complex">
                  {t("Villas / Villa Complex")}
                </option>

                <option value="house">
                  {t("Houses / Holiday Homes")}
                </option>

                <option value="guesthouse">
                  {t("Guesthouse")}
                </option>

                <option value="mixed">
                  {t("Mixed Accommodation")}
                </option>

                <option value="other">
                  {t("Other")}
                </option>

              </select>

              <ErrorMessage
                field="propertyCategory"
              />

            </div>


            {/* OWNERSHIP */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("Your Relationship to the Property *")}
              </label>

              <select
                value={formData.ownershipStatus}
                onChange={(event) =>
                  updateField(
                    "ownershipStatus",
                    event.target.value
                  )
                }
                className={inputClass(
                  "ownershipStatus"
                )}
              >

                <option value="">
                  {t("Select option")}
                </option>

                <option value="owner">
                  {t("Owner")}
                </option>

                <option value="co-owner">
                  {t("Co-owner")}
                </option>

                <option value="authorized-manager">
                  {t("Authorized Manager")}
                </option>

                <option value="company">
                  {t("Operated by my company")}
                </option>

                <option value="other">
                  {t("Other")}
                </option>

              </select>

              <ErrorMessage
                field="ownershipStatus"
              />

            </div>


            {/* SALES STRUCTURE */}

            <div className="md:col-span-2 mt-5 border-t border-slate-200 pt-9">

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                {t("Accommodation Structure")}
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {t("How is your accommodation sold? *")}
              </h2>

            </div>


            <div className="md:col-span-2">

              <select
                value={
                  formData.accommodationStructure
                }
                onChange={(event) =>
                  updateField(
                    "accommodationStructure",
                    event.target.value
                  )
                }
                className={inputClass(
                  "accommodationStructure"
                )}
              >

                <option value="">
                  {t("Select option")}
                </option>

                <option value="single-unit">
                  {t("One entire property / one unit")}
                </option>

                <option value="identical-units">
                  {t("Multiple identical units")}
                </option>

                <option value="multiple-unit-types">
                  {t("Multiple room or unit types")}
                </option>

              </select>

              <ErrorMessage
                field="accommodationStructure"
              />

            </div>

          </div>


          {/* =================================================
              UNITS
          ================================================= */}

          <div className="mt-12">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                  {t("Rooms & Units")}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {t("Accommodation Unit Types")}
                </h2>

              </div>

            </div>


            <div className="mt-8 space-y-8">

              {units.map((unit, index) => (

                <div
                  key={unit.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 md:p-9"
                >

                  <div className="flex items-center justify-between">

                    <h3 className="text-2xl font-bold">
                      {t("Unit Type")} {index + 1}
                    </h3>


                    {units.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeUnit(unit.id)
                        }
                        className="cursor-pointer rounded-xl p-3 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={22} />
                      </button>
                    )}

                  </div>


                  <div className="mt-7 grid gap-6 md:grid-cols-2">

                    {/* NAME */}
                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-bold">
                        {t("Room / Unit Type Name *")}
                      </label>

                      <input
                        value={unit.name}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "name",
                            event.target.value
                          )
                        }
                        placeholder={t("Example: Deluxe Sea View Apartment")}
                        className={inputClass(
                          `unit-${unit.id}-name`
                        )}
                      />

                      <ErrorMessage
                        field={`unit-${unit.id}-name`}
                      />

                    </div>


                    {/* TYPE */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Unit Type *")}
                      </label>

                      <select
                        value={unit.type}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "type",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-type`
                        )}
                      >

                        <option value="">
                          {t("Select type")}
                        </option>

                        <option value="double-room">
                          {t("Double Room")}
                        </option>

                        <option value="twin-room">
                          {t("Twin Room")}
                        </option>

                        <option value="triple-room">
                          {t("Triple Room")}
                        </option>

                        <option value="family-room">
                          {t("Family Room")}
                        </option>

                        <option value="studio">
                          {t("Studio")}
                        </option>

                        <option value="apartment">
                          {t("Apartment")}
                        </option>

                        <option value="suite">
                          {t("Suite")}
                        </option>

                        <option value="villa">
                          {t("Villa")}
                        </option>

                        <option value="holiday-home">
                          {t("Holiday Home")}
                        </option>

                        <option value="bungalow">
                          {t("Bungalow")}
                        </option>

                        <option value="chalet">
                          {t("Chalet")}
                        </option>

                        <option value="other">
                          {t("Other")}
                        </option>

                      </select>

                      <ErrorMessage
                        field={`unit-${unit.id}-type`}
                      />

                    </div>


                    {/* QUANTITY */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Number of Identical Units *")}
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={unit.quantity}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "quantity",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-quantity`
                        )}
                      />

                      <ErrorMessage
                        field={`unit-${unit.id}-quantity`}
                      />

                    </div>


                    {/* BEDROOM */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Bedrooms")}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={unit.bedrooms}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "bedrooms",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-bedrooms`
                        )}
                      />

                    </div>


                    {/* BATHROOM */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Bathrooms")}
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={unit.bathrooms}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "bathrooms",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-bathrooms`
                        )}
                      />

                    </div>


                    {/* SIZE */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Approximate Size (m²)")}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={unit.size}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "size",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-size`
                        )}
                      />

                    </div>


                    {/* MAX GUESTS */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Maximum Guests *")}
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={unit.maxGuests}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "maxGuests",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-maxGuests`
                        )}
                      />

                      <ErrorMessage
                        field={`unit-${unit.id}-maxGuests`}
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Maximum Adults")}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={unit.maxAdults}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "maxAdults",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-maxAdults`
                        )}
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Maximum Children")}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={unit.maxChildren}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "maxChildren",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-maxChildren`
                        )}
                      />

                    </div>


                    {/* BED SETUP */}

                    <div className="md:col-span-2 mt-3 border-t border-slate-200 pt-7">

                      <h4 className="text-lg font-bold">
                        {t("Bed Configuration")}
                      </h4>

                    </div>


                    {[
                      ["kingBeds", "King Beds"],
                      ["queenBeds", "Queen Beds"],
                      ["doubleBeds", "Double Beds"],
                      ["singleBeds", "Single Beds"],
                      ["sofaBeds", "Sofa Beds"],
                      ["bunkBeds", "Bunk Beds"],
                    ].map(([field, label]) => (

                      <div key={field}>

                        <label className="mb-2 block text-sm font-bold">
                          {t(label)}
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            unit[
                              field as keyof UnitType
                            ]
                          }
                          onChange={(event) =>
                            updateUnit(
                              unit.id,
                              field as keyof UnitType,
                              event.target.value
                            )
                          }
                          className={inputClass(
                            `unit-${unit.id}-${field}`
                          )}
                        />

                      </div>

                    ))}


                    {/* KITCHEN */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Kitchen / Kitchenette")}
                      </label>

                      <select
                        value={unit.kitchen}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "kitchen",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-kitchen`
                        )}
                      >

                        <option value="">
                          {t("Select")}
                        </option>

                        <option value="full-kitchen">
                          {t("Full Kitchen")}
                        </option>

                        <option value="kitchenette">
                          {t("Kitchenette")}
                        </option>

                        <option value="none">
                          {t("None")}
                        </option>

                      </select>

                    </div>


                    {/* SMOKING */}
                    <div>

                      <label className="mb-2 block text-sm font-bold">
                        {t("Smoking Policy")}
                      </label>

                      <select
                        value={unit.smokingPolicy}
                        onChange={(event) =>
                          updateUnit(
                            unit.id,
                            "smokingPolicy",
                            event.target.value
                          )
                        }
                        className={inputClass(
                          `unit-${unit.id}-smokingPolicy`
                        )}
                      >

                        <option value="">
                          {t("Select")}
                        </option>

                        <option value="non-smoking">
                          {t("Non-Smoking")}
                        </option>

                        <option value="smoking">
                          {t("Smoking Allowed")}
                        </option>

                        <option value="mixed">
                          {t("Mixed / Depends on Unit")}
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            <button
              type="button"
              onClick={addUnit}
              className="mt-7 flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-6 py-4 font-bold text-blue-600 transition hover:border-blue-500 hover:bg-blue-100"
            >
              <Plus size={21} />
              {t("Add Another Unit Type")}
            </button>

          </div>


          {/* =================================================
              LEGAL INFO
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Registration & Legal Information")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">

              {formData.propertyCountry ===
                "Cyprus" &&
                "Cyprus Accommodation Registration"}

              {formData.propertyCountry ===
                "Greece" &&
                "Greek Short-Term Rental Registration"}

              {formData.propertyCountry !==
                "Cyprus" &&
                formData.propertyCountry !==
                  "Greece" &&
                "Local Accommodation Registration"}

            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold">
                  {t("Do you already have the required accommodation registration?")}
                </label>

                <select
                  value={formData.registrationStatus}
                  onChange={(event) =>
                    updateField(
                      "registrationStatus",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "registrationStatus"
                  )}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("Yes")}
                  </option>

                  <option value="not-yet">
                    {t("Not yet")}
                  </option>

                  <option value="not-sure">
                    {t("I&apos;m not sure")}
                  </option>

                </select>

              </div>


              {formData.registrationStatus ===
                "yes" && (
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-bold">

                    {formData.propertyCountry ===
                      "Cyprus" &&
                      "Deputy Ministry of Tourism Registration Number"}

                    {formData.propertyCountry ===
                      "Greece" &&
                      "AMA — Property Registry Number"}

                    {formData.propertyCountry !==
                      "Cyprus" &&
                      formData.propertyCountry !==
                        "Greece" &&
                      "Local Tourism / Short-Term Rental Registration Number"}

                  </label>

                  <input
                    value={
                      formData.registrationNumber
                    }
                    onChange={(event) =>
                      updateField(
                        "registrationNumber",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "registrationNumber"
                    )}
                  />

                </div>
              )}


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Land Registration / Cadastral Reference")}
                </label>

                <input
                  value={
                    formData.landRegistrationNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "landRegistrationNumber",
                      event.target.value
                    )
                  }
                  placeholder={t("If known")}
                  className={inputClass(
                    "landRegistrationNumber"
                  )}
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {t("Optional. This is the official land-registry or cadastral reference used to identify the property in public land records. Leave it blank if you do not know it.")}
                

</p>

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Other Tourism / Accommodation Licence")}
                </label>

                <input
                  value={
                    formData.additionalLegalNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "additionalLegalNumber",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "additionalLegalNumber"
                  )}
                />

              </div>

            </div>

          </div>


          {/* NAVIGATION */}

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold transition hover:border-blue-400 hover:text-blue-600"
            >
              {t("← Back")}
            </button>


            <button
              type="button"
              onClick={continueFromStepTwo}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {t("Continue to Online Presence →")}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          STEP 3
      ===================================================== */}

      {step === 3 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 03")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Existing Online Presence & Systems")}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {t("Tell us where the property is currently listed and which booking systems you already use. If you are unsure about a technical system, simply select &quot;I&apos;m not sure&quot;.")}
          

</p>


          {/* LISTING STATUS */}
          <div className="mt-10">

            <label className="mb-3 block text-sm font-bold text-slate-700">
              {t("Is the property currently listed online? *")}
            </label>

            <div className="grid gap-4 md:grid-cols-3">

              {[
                ["yes", "Yes"],
                ["no", "No"],
                ["partial", "Partially / Some Units"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    updateField("listingStatus", value);

                    if (value === "no") {
                      setSelectedPlatforms([]);
                    }
                  }}
                  className={`cursor-pointer rounded-2xl border px-6 py-5 font-bold transition ${
                    formData.listingStatus === value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-800 hover:border-blue-300"
                  }`}
                >
                  {t(label)}
                </button>
              ))}

            </div>

            <ErrorMessage field="listingStatus" />

          </div>


          {/* PLATFORMS */}
          {(formData.listingStatus === "yes" ||
            formData.listingStatus === "partial") && (
            <div className="mt-12">

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                {t("Booking Platforms")}
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {t("Where is the property currently listed?")}
              </h2>

              <p className="mt-3 text-slate-600">
                {t("Select every platform currently used. You can leave listing links and IDs blank if you do not know them.")}
              
</p>


              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {[
                  {
                    key: "booking",
                    name: "Booking.com",
                    logo: "/platforms/booking.png",
                  },
                  {
                    key: "airbnb",
                    name: "Airbnb",
                    logo: "/platforms/airbnb.png",
                  },
                  {
                    key: "vrbo",
                    name: "Vrbo",
                    logo: "/platforms/vrbo.png",
                  },
                  {
                    key: "expedia",
                    name: "Expedia",
                    logo: "/platforms/expedia.png",
                  },
                  {
                    key: "agoda",
                    name: "Agoda",
                    logo: "/platforms/agoda.png",
                  },
                  {
                    key: "tripcom",
                    name: "Trip.com",
                    logo: "/platforms/tripcom.png",
                  },
                ].map((platform) => {
                  const selected =
                    selectedPlatforms.includes(platform.key);

                  return (
                    <button
                      key={platform.key}
                      type="button"
                      onClick={() =>
                        togglePlatform(platform.key)
                      }
                      className={`cursor-pointer rounded-2xl border p-5 text-left transition duration-300 ${
                        selected
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
                          <img
                            src={platform.logo}
                            alt={`${platform.name} logo`}
                            className="max-h-10 max-w-10 object-contain"
                          />
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {platform.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {selected
                              ? "Selected ✓"
                              : "Select platform"}
                          </p>
                        </div>

                      </div>
                    </button>
                  );
                })}


                <button
                  type="button"
                  onClick={() =>
                    togglePlatform("other")
                  }
                  className={`cursor-pointer rounded-2xl border p-5 text-left transition duration-300 ${
                    selectedPlatforms.includes("other")
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <p className="font-bold text-slate-900">
                    {t("Other Platform")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedPlatforms.includes("other")
                      ? "Selected ✓"
                      : "Select platform"}
                  </p>
                </button>

              </div>

              {selectedPlatforms.includes("other") && (
                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("Which other platform?")}
                  </label>

                  <input
                    value={formData.otherPlatformName}
                    onChange={(event) =>
                      updateField(
                        "otherPlatformName",
                        event.target.value
                      )
                    }
                    placeholder={t("Example: Hotels.com, Hostelworld, regional booking site...")}
                    className={inputClass(
                      "otherPlatformName"
                    )}
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    {t("Write the platform name here. You can add the listing link below if you have it.")}
                  </p>

                </div>
              )}

              <ErrorMessage field="platforms" />

            </div>
          )}


          {/* EXISTING LISTINGS */}
          {selectedPlatforms.length > 0 && (
            <div className="mt-12 space-y-6">

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                  {t("Existing Listings")}
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {t("Add your current listing details")}
                </h2>

                <p className="mt-3 text-slate-600">
                  {t("These fields are optional, but listing links help us review your current setup before we contact you.")}
                
</p>
              </div>


              {selectedPlatforms.includes("booking") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {t("Booking.com")}
                  </h3>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <input
                      value={formData.bookingUrl}
                      onChange={(event) =>
                        updateField(
                          "bookingUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Booking.com listing URL")}
                      className={inputClass("bookingUrl")}
                    />

                    <input
                      value={formData.bookingId}
                      onChange={(event) =>
                        updateField(
                          "bookingId",
                          event.target.value
                        )
                      }
                      placeholder={t("Property / Hotel ID (optional)")}
                      className={inputClass("bookingId")}
                    />

                  </div>

                </div>
              )}


              {selectedPlatforms.includes("airbnb") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {t("Airbnb")}
                  </h3>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <input
                      value={formData.airbnbUrl}
                      onChange={(event) =>
                        updateField(
                          "airbnbUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Airbnb listing URL")}
                      className={inputClass("airbnbUrl")}
                    />

                    <input
                      value={formData.airbnbId}
                      onChange={(event) =>
                        updateField(
                          "airbnbId",
                          event.target.value
                        )
                      }
                      placeholder={t("Listing ID (optional)")}
                      className={inputClass("airbnbId")}
                    />

                  </div>

                </div>
              )}


              {selectedPlatforms.includes("vrbo") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {t("Vrbo")}
                  </h3>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <input
                      value={formData.vrboUrl}
                      onChange={(event) =>
                        updateField(
                          "vrboUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Vrbo listing URL")}
                      className={inputClass("vrboUrl")}
                    />

                    <input
                      value={formData.vrboId}
                      onChange={(event) =>
                        updateField(
                          "vrboId",
                          event.target.value
                        )
                      }
                      placeholder={t("Listing ID (optional)")}
                      className={inputClass("vrboId")}
                    />

                  </div>

                </div>
              )}


              {selectedPlatforms.includes("expedia") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {t("Expedia")}
                  </h3>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <input
                      value={formData.expediaUrl}
                      onChange={(event) =>
                        updateField(
                          "expediaUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Expedia listing URL")}
                      className={inputClass("expediaUrl")}
                    />

                    <input
                      value={formData.expediaId}
                      onChange={(event) =>
                        updateField(
                          "expediaId",
                          event.target.value
                        )
                      }
                      placeholder={t("Property ID (optional)")}
                      className={inputClass("expediaId")}
                    />

                  </div>

                </div>
              )}


              {selectedPlatforms.includes("agoda") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {t("Agoda")}
                  </h3>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <input
                      value={formData.agodaUrl}
                      onChange={(event) =>
                        updateField(
                          "agodaUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Agoda listing URL")}
                      className={inputClass("agodaUrl")}
                    />

                    <input
                      value={formData.agodaId}
                      onChange={(event) =>
                        updateField(
                          "agodaId",
                          event.target.value
                        )
                      }
                      placeholder={t("Property ID (optional)")}
                      className={inputClass("agodaId")}
                    />

                  </div>

                </div>
              )}


              {selectedPlatforms.includes("tripcom") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {t("Trip.com")}
                  </h3>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <input
                      value={formData.tripcomUrl}
                      onChange={(event) =>
                        updateField(
                          "tripcomUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Trip.com listing URL")}
                      className={inputClass("tripcomUrl")}
                    />

                    <input
                      value={formData.tripcomId}
                      onChange={(event) =>
                        updateField(
                          "tripcomId",
                          event.target.value
                        )
                      }
                      placeholder={t("Property ID (optional)")}
                      className={inputClass("tripcomId")}
                    />

                  </div>

                </div>
              )}


              {selectedPlatforms.includes("other") && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                  <h3 className="text-xl font-bold">
                    {formData.otherPlatformName || "Other Platform"}
                  </h3>

                  <div className="mt-5">

                    <input
                      value={formData.otherPlatformUrl}
                      onChange={(event) =>
                        updateField(
                          "otherPlatformUrl",
                          event.target.value
                        )
                      }
                      placeholder={t("Listing URL (optional)")}
                      className={inputClass(
                        "otherPlatformUrl"
                      )}
                    />

                  </div>

                </div>
              )}

            </div>
          )}


          {/* SYSTEMS */}
          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Existing Systems")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("How are reservations currently managed?")}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* CHANNEL MANAGER */}
              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Do you use a Channel Manager? *")}
                </label>

                <select
                  value={formData.channelManagerStatus}
                  onChange={(event) =>
                    updateField(
                      "channelManagerStatus",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "channelManagerStatus"
                  )}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("Yes")}
                  </option>

                  <option value="no">
                    {t("No")}
                  </option>

                  <option value="not-sure">
                    {t("I&apos;m not sure")}
                  </option>
                </select>

                <ErrorMessage
                  field="channelManagerStatus"
                />

              </div>


              {formData.channelManagerStatus ===
                "yes" && (
                <div>

                  <label className="mb-2 block text-sm font-bold">
                    {t("Channel Manager Name")}
                  </label>

                  <input
                    value={
                      formData.channelManagerName
                    }
                    onChange={(event) =>
                      updateField(
                        "channelManagerName",
                        event.target.value
                      )
                    }
                    placeholder={t("Example: SiteMinder, Cloudbeds...")}
                    className={inputClass(
                      "channelManagerName"
                    )}
                  />

                </div>
              )}


              {/* PMS */}
              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Do you use a Property Management System (PMS)? *")}
                </label>

                <select
                  value={formData.pmsStatus}
                  onChange={(event) =>
                    updateField(
                      "pmsStatus",
                      event.target.value
                    )
                  }
                  className={inputClass("pmsStatus")}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("Yes")}
                  </option>

                  <option value="no">
                    {t("No")}
                  </option>

                  <option value="not-sure">
                    {t("I&apos;m not sure")}
                  </option>
                </select>

                <ErrorMessage field="pmsStatus" />

              </div>


              {formData.pmsStatus === "yes" && (
                <div>

                  <label className="mb-2 block text-sm font-bold">
                    {t("PMS Name")}
                  </label>

                  <input
                    value={formData.pmsName}
                    onChange={(event) =>
                      updateField(
                        "pmsName",
                        event.target.value
                      )
                    }
                    placeholder={t("PMS name")}
                    className={inputClass("pmsName")}
                  />

                </div>
              )}


              {/* WEBSITE */}
              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Do you have your own website? *")}
                </label>

                <select
                  value={formData.websiteStatus}
                  onChange={(event) =>
                    updateField(
                      "websiteStatus",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "websiteStatus"
                  )}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("Yes")}
                  </option>

                  <option value="no">
                    {t("No")}
                  </option>
                </select>

                <ErrorMessage
                  field="websiteStatus"
                />

              </div>


              {formData.websiteStatus === "yes" && (
                <div>

                  <label className="mb-2 block text-sm font-bold">
                    {t("Website URL")}
                  </label>

                  <input
                    value={formData.websiteUrl}
                    onChange={(event) =>
                      updateField(
                        "websiteUrl",
                        event.target.value
                      )
                    }
                    placeholder={t("https://...")}
                    className={inputClass(
                      "websiteUrl"
                    )}
                  />

                </div>
              )}


              {/* DIRECT BOOKINGS */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold">
                  {t("Do you currently accept direct bookings? *")}
                </label>

                <select
                  value={
                    formData.directBookingsStatus
                  }
                  onChange={(event) =>
                    updateField(
                      "directBookingsStatus",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "directBookingsStatus"
                  )}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("Yes")}
                  </option>

                  <option value="no">
                    {t("No")}
                  </option>

                  <option value="sometimes">
                    {t("Sometimes")}
                  </option>
                </select>

                <ErrorMessage
                  field="directBookingsStatus"
                />

              </div>

            </div>

          </div>


          {/* NAVIGATION */}
          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold transition hover:border-blue-400 hover:text-blue-600"
            >
              {t("← Back")}
            </button>


            <button
              type="button"
              onClick={continueFromStepThree}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {t("Continue to Property Setup →")}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          STEP 4
      ===================================================== */}

      {step === 4 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 04")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Facilities, Guest Policies & Operations")}
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            {t("Tell us how the property operates day to day and which facilities guests can expect. These details are used across booking platforms, filters, house rules and the guest journey.")}
          

</p>


          {/* =================================================
              CHECK-IN / CHECK-OUT
          ================================================= */}

          <div className="mt-12">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Arrival & Departure")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Check-in and check-out setup")}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Check-in From *")}
                </label>

                <input
                  type="time"
                  value={formData.checkInFrom}
                  onChange={(event) =>
                    updateField(
                      "checkInFrom",
                      event.target.value
                    )
                  }
                  className={inputClass("checkInFrom")}
                />

                <ErrorMessage field="checkInFrom" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Check-in Until")}
                </label>

                <input
                  type="time"
                  value={formData.checkInUntil}
                  onChange={(event) =>
                    updateField(
                      "checkInUntil",
                      event.target.value
                    )
                  }
                  className={inputClass("checkInUntil")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Check-out From")}
                </label>

                <input
                  type="time"
                  value={formData.checkOutFrom}
                  onChange={(event) =>
                    updateField(
                      "checkOutFrom",
                      event.target.value
                    )
                  }
                  className={inputClass("checkOutFrom")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Check-out Until *")}
                </label>

                <input
                  type="time"
                  value={formData.checkOutUntil}
                  onChange={(event) =>
                    updateField(
                      "checkOutUntil",
                      event.target.value
                    )
                  }
                  className={inputClass("checkOutUntil")}
                />

                <ErrorMessage field="checkOutUntil" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Main Check-in Method *")}
                </label>

                <select
                  value={formData.checkInMethod}
                  onChange={(event) =>
                    updateField(
                      "checkInMethod",
                      event.target.value
                    )
                  }
                  className={inputClass("checkInMethod")}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="host-meet">
                    {t("Host / Staff Meets Guest")}
                  </option>

                  <option value="reception">
                    {t("Reception / Front Desk")}
                  </option>

                  <option value="lockbox">
                    {t("Lockbox")}
                  </option>

                  <option value="smart-lock">
                    {t("Smart Lock / Keypad")}
                  </option>

                  <option value="key-collection">
                    {t("Key Collection at Another Location")}
                  </option>

                  <option value="other">
                    {t("Other")}
                  </option>

                </select>

                <ErrorMessage field="checkInMethod" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Reception / Front Desk")}
                </label>

                <select
                  value={formData.receptionStatus}
                  onChange={(event) =>
                    updateField(
                      "receptionStatus",
                      event.target.value
                    )
                  }
                  className={inputClass("receptionStatus")}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="24-hours">
                    {t("24 Hours")}
                  </option>

                  <option value="limited-hours">
                    {t("Limited Hours")}
                  </option>

                  <option value="none">
                    {t("No Reception")}
                  </option>

                </select>

              </div>


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Guest Communication Languages *")}
                </label>

                <input
                  value={formData.guestLanguages}
                  onChange={(event) =>
                    updateField(
                      "guestLanguages",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: English, Greek, German")}
                  className={inputClass("guestLanguages")}
                />

                <ErrorMessage field="guestLanguages" />

              </div>

            </div>

          </div>


          {/* =================================================
              PROPERTY FACILITIES
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Property Facilities")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("What does the property offer?")}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {t("Select every facility that applies to the property as a whole. Room-specific amenities are listed separately below.")}
            
</p>


            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {propertyFacilities.map((facility) => {
                const selected =
                  selectedPropertyFacilities.includes(
                    facility
                  );

                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() =>
                      togglePropertyFacility(facility)
                    }
                    className={`cursor-pointer rounded-2xl border px-5 py-4 text-left font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <span className="mr-2">
                      {selected ? "✓" : "+"}
                    </span>

                    {t(facility)}
                  </button>
                );
              })}

            </div>

          </div>


          {/* =================================================
              ROOM / UNIT AMENITIES
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Room & Unit Amenities")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Amenities by accommodation type")}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {t("Different room or unit types may have different amenities. Select the features that apply to each accommodation type.")}
            
</p>


            <div className="mt-8 space-y-8">

              {units.map((unit, index) => {

                const selectedAmenities =
                  unitAmenities[unit.id] || [];

                return (
                  <div
                    key={unit.id}
                    className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 md:p-9"
                  >

                    <div>

                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                        {t("Unit Type")} {index + 1}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {unit.name ||
                          t("Unnamed Room / Unit Type")}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {unit.quantity || "1"} {t("identical unit")}
                        {Number(unit.quantity) === 1
                          ? ""
                          : "s"}
                      </p>

                    </div>


                    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                      {roomAmenities.map((amenity) => {
                        const selected =
                          selectedAmenities.includes(
                            amenity
                          );

                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() =>
                              toggleUnitAmenity(
                                unit.id,
                                amenity
                              )
                            }
                            className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                              selected
                                ? "border-blue-600 bg-white text-blue-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                            }`}
                          >
                            <span className="mr-2">
                              {selected ? "✓" : "+"}
                            </span>

                            {t(amenity)}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                );
              })}

            </div>

          </div>


          {/* =================================================
              GUEST POLICIES
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Guest Policies")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Rules guests should know")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Children Policy *")}
                </label>

                <select
                  value={formData.childrenPolicy}
                  onChange={(event) =>
                    updateField(
                      "childrenPolicy",
                      event.target.value
                    )
                  }
                  className={inputClass("childrenPolicy")}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="all-ages">
                    {t("Children of All Ages Welcome")}
                  </option>

                  <option value="restrictions">
                    {t("Age Restrictions Apply")}
                  </option>

                  <option value="adults-only">
                    {t("Adults Only")}
                  </option>

                </select>

                <ErrorMessage field="childrenPolicy" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Minimum Guest Age")}
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.minimumGuestAge}
                  onChange={(event) =>
                    updateField(
                      "minimumGuestAge",
                      event.target.value
                    )
                  }
                  placeholder={t("Leave blank if none")}
                  className={inputClass(
                    "minimumGuestAge"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Pets Policy *")}
                </label>

                <select
                  value={formData.petsPolicy}
                  onChange={(event) =>
                    updateField(
                      "petsPolicy",
                      event.target.value
                    )
                  }
                  className={inputClass("petsPolicy")}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="allowed">
                    {t("Pets Allowed")}
                  </option>

                  <option value="request">
                    {t("Pets Allowed on Request")}
                  </option>

                  <option value="not-allowed">
                    {t("Pets Not Allowed")}
                  </option>

                </select>

                <ErrorMessage field="petsPolicy" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Parties / Events *")}
                </label>

                <select
                  value={formData.partiesPolicy}
                  onChange={(event) =>
                    updateField(
                      "partiesPolicy",
                      event.target.value
                    )
                  }
                  className={inputClass("partiesPolicy")}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="not-allowed">
                    {t("Not Allowed")}
                  </option>

                  <option value="allowed">
                    {t("Allowed")}
                  </option>

                  <option value="request">
                    {t("On Request")}
                  </option>

                </select>

                <ErrorMessage field="partiesPolicy" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Smoking Policy *")}
                </label>

                <select
                  value={formData.smokingPropertyPolicy}
                  onChange={(event) =>
                    updateField(
                      "smokingPropertyPolicy",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "smokingPropertyPolicy"
                  )}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="non-smoking">
                    {t("No Smoking")}
                  </option>

                  <option value="designated-areas">
                    {t("Designated Areas Only")}
                  </option>

                  <option value="allowed">
                    {t("Smoking Allowed")}
                  </option>

                </select>

                <ErrorMessage
                  field="smokingPropertyPolicy"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Quiet Hours")}
                </label>

                <input
                  value={formData.quietHours}
                  onChange={(event) =>
                    updateField(
                      "quietHours",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: 23:00 - 08:00")}
                  className={inputClass("quietHours")}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ADDITIONAL OPERATING DETAILS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Additional Details")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Helpful listing information")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Parking Details")}
                </label>

                <textarea
                  rows={4}
                  value={formData.parkingDetails}
                  onChange={(event) =>
                    updateField(
                      "parkingDetails",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: Free private parking, street parking, reservation required...")}
                  className={inputClass("parkingDetails")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Internet / Wi-Fi Details")}
                </label>

                <textarea
                  rows={4}
                  value={formData.internetDetails}
                  onChange={(event) =>
                    updateField(
                      "internetDetails",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: Free Wi-Fi throughout the property...")}
                  className={inputClass("internetDetails")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Breakfast Details")}
                </label>

                <textarea
                  rows={4}
                  value={formData.breakfastDetails}
                  onChange={(event) =>
                    updateField(
                      "breakfastDetails",
                      event.target.value
                    )
                  }
                  placeholder={t("If applicable: included, optional, price, type...")}
                  className={inputClass("breakfastDetails")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Other Operational Notes")}
                </label>

                <textarea
                  rows={4}
                  value={formData.accessibilityNotes}
                  onChange={(event) =>
                    updateField(
                      "accessibilityNotes",
                      event.target.value
                    )
                  }
                  placeholder={t("Anything else we should know about access, facilities or operations...")}
                  className={inputClass(
                    "accessibilityNotes"
                  )}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ACCESSIBILITY
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Accessibility")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Accessibility features")}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {t("Select only features that genuinely apply. We can request supporting accessibility photographs later in the photo step.")}
            
</p>


            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {accessibilityFeatures.map((feature) => {
                const selected =
                  selectedAccessibility.includes(
                    feature
                  );

                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      toggleAccessibility(feature)
                    }
                    className={`cursor-pointer rounded-2xl border px-5 py-4 text-left font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <span className="mr-2">
                      {selected ? "✓" : "+"}
                    </span>

                    {t(feature)}
                  </button>
                );
              })}

            </div>

          </div>


          {/* NAVIGATION */}

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold transition hover:border-blue-400 hover:text-blue-600"
            >
              {t("← Back")}
            </button>


            <button
              type="button"
              onClick={continueFromStepFour}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {t("Continue to Pricing & Availability →")}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          STEP 5
      ===================================================== */}

      {step === 5 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 05")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Pricing, Availability & Booking Rules")}
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            {t("This step is only an estimation of the property's current commercial setup. You may leave any field blank if you do not know the answer. HostMetric will analyse the market, booking history, competition and property performance before deciding the final pricing and booking strategy.")}
          


</p>

          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="font-bold text-blue-950">
              {t("Everything in Step 5 is optional.")}
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              {t("Estimates are enough. If you do not know your current rates, occupancy, discounts, taxes or booking rules, leave them blank. HostMetric will review the property and build the final commercial strategy for you.")}
            


</p>
          </div>


          {/* =================================================
              PRICING APPROACH
          ================================================= */}

          <div className="mt-12">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Smart Pricing Setup")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Set your minimum nightly price")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("HostMetric manages and continuously optimizes pricing using AI, pricing algorithms, market demand, seasonality, booking behaviour and property performance. You only need to tell us the minimum nightly price you are comfortable accepting.")}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Currency")}
                </label>

                <select
                  value={formData.currency}
                  onChange={(event) =>
                    updateField(
                      "currency",
                      event.target.value
                    )
                  }
                  className={inputClass("currency")}
                >
                  <option value="">
                    {t("Select currency")}
                  </option>

                  <option value="EUR">
                    {t("EUR — Euro")}
                  </option>

                  <option value="GBP">
                    {t("GBP — British Pound")}
                  </option>

                  <option value="USD">
                    {t("USD — US Dollar")}
                  </option>

                </select>

                <ErrorMessage field="currency" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Minimum Nightly Price")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumNightlyRate}
                  onChange={(event) =>
                    updateField(
                      "minimumNightlyRate",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: 80")}
                  className={inputClass(
                    "minimumNightlyRate"
                  )}
                />

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t("This is your minimum acceptable nightly price, not your standard selling price. HostMetric may price above this amount whenever market conditions and demand support a higher rate.")}
                </p>

                <ErrorMessage field="minimumNightlyRate" />

              </div>

            </div>

          </div>


          {/* =================================================
              UNIT PRICING
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Current Rates by Unit Type")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Current pricing information")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("These figures are optional. They help us understand your current commercial position before optimization begins.")}
            
</p>


            <div className="mt-8 space-y-7">

              {units.map((unit, index) => {

                const pricing =
                  unitPricing[unit.id] || {
                    currentBaseRate: "",
                    weekendRate: "",
                    minimumStay: "",
                    extraGuestFee: "",
                    childFee: "",
                  };

                return (
                  <div
                    key={unit.id}
                    className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 md:p-9"
                  >

                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                      {t("Unit Type")} {index + 1}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {unit.name ||
                        t("Unnamed Room / Unit Type")}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {unit.quantity || "1"} {t("identical unit")}
                      {Number(unit.quantity) === 1
                        ? ""
                        : "s"}
                    </p>


                    <div className="mt-7 grid gap-6 md:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-sm font-bold">
                          {t("Current / Typical Base Nightly Rate")}
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            pricing.currentBaseRate
                          }
                          onChange={(event) =>
                            updateUnitPricing(
                              unit.id,
                              "currentBaseRate",
                              event.target.value
                            )
                          }
                          placeholder={t("Example: 120")}
                          className={inputClass(
                            `pricing-${unit.id}-base`
                          )}
                        />

                      </div>


                      <div>

                        <label className="mb-2 block text-sm font-bold">
                          {t("Typical Weekend Rate")}
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            pricing.weekendRate
                          }
                          onChange={(event) =>
                            updateUnitPricing(
                              unit.id,
                              "weekendRate",
                              event.target.value
                            )
                          }
                          placeholder={t("Optional")}
                          className={inputClass(
                            `pricing-${unit.id}-weekend`
                          )}
                        />

                      </div>


                      <div>

                        <label className="mb-2 block text-sm font-bold">
                          {t("Unit-Specific Minimum Stay")}
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            pricing.minimumStay
                          }
                          onChange={(event) =>
                            updateUnitPricing(
                              unit.id,
                              "minimumStay",
                              event.target.value
                            )
                          }
                          placeholder={t("Optional")}
                          className={inputClass(
                            `pricing-${unit.id}-minimum-stay`
                          )}
                        />

                      </div>


                      <div>

                        <label className="mb-2 block text-sm font-bold">
                          {t("Extra Guest Fee")}
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            pricing.extraGuestFee
                          }
                          onChange={(event) =>
                            updateUnitPricing(
                              unit.id,
                              "extraGuestFee",
                              event.target.value
                            )
                          }
                          placeholder={t("Optional")}
                          className={inputClass(
                            `pricing-${unit.id}-extra-guest`
                          )}
                        />

                      </div>


                      <div>

                        <label className="mb-2 block text-sm font-bold">
                          {t("Child Fee")}
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={pricing.childFee}
                          onChange={(event) =>
                            updateUnitPricing(
                              unit.id,
                              "childFee",
                              event.target.value
                            )
                          }
                          placeholder={t("Optional")}
                          className={inputClass(
                            `pricing-${unit.id}-child`
                          )}
                        />

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>


          {/* =================================================
              FEES / TAXES
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Fees & Taxes")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Additional charges")}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Cleaning Fee")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cleaningFee}
                  onChange={(event) =>
                    updateField(
                      "cleaningFee",
                      event.target.value
                    )
                  }
                  placeholder={t("Leave blank if included in the nightly rate")}
                  className={inputClass("cleaningFee")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Cleaning Fee Charged")}
                </label>

                <select
                  value={formData.cleaningFeeType}
                  onChange={(event) =>
                    updateField(
                      "cleaningFeeType",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "cleaningFeeType"
                  )}
                >
                  <option value="">
                    {t("Select if applicable")}
                  </option>

                  <option value="per-stay">
                    {t("Per Stay")}
                  </option>

                  <option value="per-night">
                    {t("Per Night")}
                  </option>

                  <option value="included">
                    {t("Included in Rate")}
                  </option>
                </select>

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Security / Damage Deposit")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={(event) =>
                    updateField(
                      "securityDeposit",
                      event.target.value
                    )
                  }
                  placeholder={t("Optional")}
                  className={inputClass(
                    "securityDeposit"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Do you know the applicable local / tourist taxes?")}
                </label>

                <select
                  value={formData.localTaxKnown}
                  onChange={(event) =>
                    updateField(
                      "localTaxKnown",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "localTaxKnown"
                  )}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("Yes")}
                  </option>

                  <option value="no">
                    {t("No / I&apos;m not sure")}
                  </option>
                </select>

              </div>


              {formData.localTaxKnown === "yes" && (
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-bold">
                    {t("Local / Tourist Tax Details")}
                  </label>

                  <textarea
                    rows={4}
                    value={formData.localTaxDetails}
                    onChange={(event) =>
                      updateField(
                        "localTaxDetails",
                        event.target.value
                      )
                    }
                    placeholder={t("Example: amount or percentage, per person / per night / per stay, whether included in the listed price...")}
                    className={inputClass(
                      "localTaxDetails"
                    )}
                  />

                </div>
              )}

            </div>

          </div>


          {/* =================================================
              AVAILABILITY RULES
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Availability Rules")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("How should guests be allowed to book?")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Normal Minimum Stay")}
                </label>

                <input
                  type="number"
                  min="1"
                  value={formData.minimumStayDefault}
                  onChange={(event) =>
                    updateField(
                      "minimumStayDefault",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: 2 nights")}
                  className={inputClass(
                    "minimumStayDefault"
                  )}
                />

                <ErrorMessage
                  field="minimumStayDefault"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Maximum Stay")}
                </label>

                <input
                  type="number"
                  min="1"
                  value={formData.maximumStay}
                  onChange={(event) =>
                    updateField(
                      "maximumStay",
                      event.target.value
                    )
                  }
                  placeholder={t("Optional")}
                  className={inputClass("maximumStay")}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Advance Notice")}
                </label>

                <select
                  value={formData.advanceNotice}
                  onChange={(event) =>
                    updateField(
                      "advanceNotice",
                      event.target.value
                    )
                  }
                  className={inputClass("advanceNotice")}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="same-day">
                    {t("Same-Day Booking Allowed")}
                  </option>

                  <option value="1-day">
                    {t("At Least 1 Day")}
                  </option>

                  <option value="2-days">
                    {t("At Least 2 Days")}
                  </option>

                  <option value="3-days">
                    {t("At Least 3 Days")}
                  </option>

                  <option value="7-days">
                    {t("At Least 7 Days")}
                  </option>
                </select>

                <ErrorMessage field="advanceNotice" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Booking Window")}
                </label>

                <select
                  value={formData.bookingWindow}
                  onChange={(event) =>
                    updateField(
                      "bookingWindow",
                      event.target.value
                    )
                  }
                  className={inputClass("bookingWindow")}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="3-months">
                    {t("Up to 3 Months Ahead")}
                  </option>

                  <option value="6-months">
                    {t("Up to 6 Months Ahead")}
                  </option>

                  <option value="12-months">
                    {t("Up to 12 Months Ahead")}
                  </option>

                  <option value="18-months">
                    {t("Up to 18 Months Ahead")}
                  </option>

                  <option value="24-months">
                    {t("Up to 24 Months Ahead")}
                  </option>

                  <option value="no-limit">
                    {t("No Specific Limit")}
                  </option>
                </select>

                <ErrorMessage field="bookingWindow" />

              </div>


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold">
                  {t("Same-Day Booking Notes")}
                </label>

                <input
                  value={formData.sameDayBooking}
                  onChange={(event) =>
                    updateField(
                      "sameDayBooking",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: accepted until 18:00 local time")}
                  className={inputClass(
                    "sameDayBooking"
                  )}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              CANCELLATION / PAYMENT
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Booking Policies")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Cancellation and booking confirmation")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Cancellation Preference")}
                </label>

                <select
                  value={
                    formData.cancellationPreference
                  }
                  onChange={(event) =>
                    updateField(
                      "cancellationPreference",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "cancellationPreference"
                  )}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="flexible">
                    {t("Flexible")}
                  </option>

                  <option value="moderate">
                    {t("Moderate")}
                  </option>

                  <option value="strict">
                    {t("Strict")}
                  </option>

                  <option value="mixed">
                    {t("Flexible + Non-Refundable Rate Options")}
                  </option>

                  <option value="recommend">
                    {t("Let HostMetric Recommend the Best Structure")}
                  </option>
                </select>

                <ErrorMessage
                  field="cancellationPreference"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Prepayment Preference")}
                </label>

                <select
                  value={
                    formData.prepaymentPreference
                  }
                  onChange={(event) =>
                    updateField(
                      "prepaymentPreference",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "prepaymentPreference"
                  )}
                >
                  <option value="">
                    {t("Select if known")}
                  </option>

                  <option value="none">
                    {t("No Prepayment")}
                  </option>

                  <option value="partial">
                    {t("Partial Prepayment")}
                  </option>

                  <option value="full">
                    {t("Full Prepayment")}
                  </option>

                  <option value="platform-managed">
                    {t("Managed by Booking Platform")}
                  </option>

                  <option value="not-sure">
                    {t("I&apos;m Not Sure")}
                  </option>
                </select>

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("No-Show Policy")}
                </label>

                <select
                  value={formData.noShowPolicy}
                  onChange={(event) =>
                    updateField(
                      "noShowPolicy",
                      event.target.value
                    )
                  }
                  className={inputClass("noShowPolicy")}
                >
                  <option value="">
                    {t("Select if known")}
                  </option>

                  <option value="first-night">
                    {t("Charge First Night")}
                  </option>

                  <option value="full">
                    {t("Charge Full Reservation")}
                  </option>

                  <option value="none">
                    {t("No Charge")}
                  </option>

                  <option value="platform">
                    {t("Follow Platform Policy")}
                  </option>
                </select>

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Booking Confirmation")}
                </label>

                <select
                  value={
                    formData.instantBookingPreference
                  }
                  onChange={(event) =>
                    updateField(
                      "instantBookingPreference",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "instantBookingPreference"
                  )}
                >
                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="instant">
                    {t("Instant Booking")}
                  </option>

                  <option value="request">
                    {t("Request / Owner Approval")}
                  </option>

                  <option value="recommend">
                    {t("Let HostMetric Recommend")}
                  </option>
                </select>

                <ErrorMessage
                  field="instantBookingPreference"
                />

              </div>

            </div>

          </div>


          {/* =================================================
              BREAKFAST
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Meals")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Breakfast pricing")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Breakfast Pricing")}
                </label>

                <select
                  value={formData.breakfastPricing}
                  onChange={(event) =>
                    updateField(
                      "breakfastPricing",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "breakfastPricing"
                  )}
                >
                  <option value="">
                    {t("Select if applicable")}
                  </option>

                  <option value="included">
                    {t("Included in Room Rate")}
                  </option>

                  <option value="optional-paid">
                    {t("Optional — Extra Charge")}
                  </option>

                  <option value="not-offered">
                    {t("Not Offered")}
                  </option>
                </select>

              </div>


              {formData.breakfastPricing ===
                "optional-paid" && (
                <div>

                  <label className="mb-2 block text-sm font-bold">
                    {t("Breakfast Price per Person")}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.breakfastPrice}
                    onChange={(event) =>
                      updateField(
                        "breakfastPrice",
                        event.target.value
                      )
                    }
                    className={inputClass(
                      "breakfastPrice"
                    )}
                  />

                </div>
              )}

            </div>

          </div>


          {/* =================================================
              DISCOUNTS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Promotions & Discounts")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Existing or preferred discounts")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("Optional. Enter percentages only if you already use or strongly prefer these promotions. HostMetric can recommend the final commercial structure later.")}
            

</p>


            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {[
                ["weeklyDiscount", "Weekly Stay Discount"],
                ["monthlyDiscount", "Monthly Stay Discount"],
                ["nonRefundableRate", "Non-Refundable Discount"],
                ["mobileRate", "Mobile Rate Discount"],
                ["lastMinuteDiscount", "Last-Minute Discount"],
                ["earlyBookerDiscount", "Early Booker Discount"],
              ].map(([field, label]) => (
                <div key={field}>

                  <label className="mb-2 block text-sm font-bold">
                    {t(label)} (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      formData[
                        field as keyof FormData
                      ]
                    }
                    onChange={(event) =>
                      updateField(
                        field as keyof FormData,
                        event.target.value
                      )
                    }
                    placeholder={t("Optional")}
                    className={inputClass(field)}
                  />

                </div>
              ))}

            </div>

          </div>


          {/* =================================================
              CURRENT PERFORMANCE
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Current Performance")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Existing performance information")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("Optional. Estimates are fine. If the property is new, leave these fields blank.")}
            
</p>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Approximate Average Occupancy (%)")}
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={
                    formData.currentAverageOccupancy
                  }
                  onChange={(event) =>
                    updateField(
                      "currentAverageOccupancy",
                      event.target.value
                    )
                  }
                  placeholder={t("Optional")}
                  className={inputClass(
                    "currentAverageOccupancy"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Approximate Average Daily Rate")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.currentAverageDailyRate
                  }
                  onChange={(event) =>
                    updateField(
                      "currentAverageDailyRate",
                      event.target.value
                    )
                  }
                  placeholder={t("Optional")}
                  className={inputClass(
                    "currentAverageDailyRate"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Approximate Annual Accommodation Revenue")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.annualRevenueEstimate
                  }
                  onChange={(event) =>
                    updateField(
                      "annualRevenueEstimate",
                      event.target.value
                    )
                  }
                  placeholder={t("Optional")}
                  className={inputClass(
                    "annualRevenueEstimate"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Revenue / Performance Target")}
                </label>

                <input
                  value={formData.revenueTarget}
                  onChange={(event) =>
                    updateField(
                      "revenueTarget",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: +20% revenue, higher ADR, better low-season occupancy...")}
                  className={inputClass(
                    "revenueTarget"
                  )}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              BLOCKED DATES / NOTES
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Owner Restrictions & Notes")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Anything that affects availability or pricing?")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Owner Use / Dates That Must Stay Blocked")}
                </label>

                <textarea
                  rows={5}
                  value={formData.ownerBlockedDates}
                  onChange={(event) =>
                    updateField(
                      "ownerBlockedDates",
                      event.target.value
                    )
                  }
                  placeholder={t("Optional. Example: family uses the property every August 10–20...")}
                  className={inputClass(
                    "ownerBlockedDates"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Other Pricing or Booking Notes")}
                </label>

                <textarea
                  rows={5}
                  value={formData.pricingNotes}
                  onChange={(event) =>
                    updateField(
                      "pricingNotes",
                      event.target.value
                    )
                  }
                  placeholder={t("Anything else we should know about rates, seasonality, minimum stays, promotions or booking rules...")}
                  className={inputClass(
                    "pricingNotes"
                  )}
                />

              </div>

            </div>

          </div>


          {/* NAVIGATION */}

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold transition hover:border-blue-400 hover:text-blue-600"
            >
              {t("← Back")}
            </button>


            <button
              type="button"
              onClick={continueFromStepFive}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {t("Continue to Photos & Listing Content →")}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          STEP 6
      ===================================================== */}

      {step === 6 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 06")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Photos & Listing Content")}
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            {t("Upload any photos you already have and tell us what makes the property special. Everything in this step is optional unless you upload files. HostMetric can reorganize the photo gallery, improve the listing copy and tell you which additional photographs are still needed.")}
          



</p>


          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">

            <p className="font-bold text-blue-950">
              {t("You do not need professional photos to complete this form.")}
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              {t("Upload whatever you currently have. Photos are separated into property-level, room/unit-level and accessibility groups so we can later prepare the galleries correctly for each booking platform.")}
            


</p>

          </div>


          {/* =================================================
              PROPERTY / COMMON AREA PHOTOS
          ================================================= */}

          <div className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Property-Level Photos")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Property & common-area gallery")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("Keep different areas separated so HostMetric can prepare cleaner Airbnb and Booking.com galleries and immediately see which photo types are still missing.")}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {propertyUploadCategories.map((category) =>
                renderUploadGroup({
                  label: category.label,
                  description: category.description,
                  files: propertyPhotoGroups[category.key] || [],
                  onAdd: (files) =>
                    addFilesToGroup(setPropertyPhotoGroups, category.key, files),
                  onRemove: (index) =>
                    removeFileFromGroup(setPropertyPhotoGroups, category.key, index),
                })
              )}
            </div>
          </div>


          {/* =================================================
              ROOM / UNIT PHOTOS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Room & Unit Galleries")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Photos for each sellable unit type")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("Each unit keeps its own gallery, so bedroom, bathroom, kitchen, living area, balcony, private pool and view photos stay attached to the correct room or unit type.")}
            </p>

            <div className="mt-8 space-y-8">
              {units.map((unit, index) => (
                <div
                  key={unit.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 md:p-9"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                    {t("Unit Type")} {index + 1}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {unit.name || t("Unnamed Room / Unit Type")}
                  </h3>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {unitUploadCategories.map((category) =>
                      renderUploadGroup({
                        label: category.label,
                        description: category.description,
                        files: unitPhotoGroups[unit.id]?.[category.key] || [],
                        onAdd: (files) => {
                          setUnitPhotoGroups((previous) => ({
                            ...previous,
                            [unit.id]: {
                              ...(previous[unit.id] || {}),
                              [category.key]: appendFiles(
                                previous[unit.id]?.[category.key] || [],
                                files
                              ).slice(0, 50),
                            },
                          }));
                        },
                        onRemove: (fileIndex) => {
                          setUnitPhotoGroups((previous) => ({
                            ...previous,
                            [unit.id]: {
                              ...(previous[unit.id] || {}),
                              [category.key]: removeFileAtIndex(
                                previous[unit.id]?.[category.key] || [],
                                fileIndex
                              ),
                            },
                          }));
                        },
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* =================================================
              ACCESSIBILITY EVIDENCE
          ================================================= */}

          {selectedAccessibility.length > 0 && (
            <div className="mt-14 border-t border-slate-200 pt-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                {t("Accessibility Evidence")}
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {t("Evidence for the accessibility features you selected")}
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                {t("Upload evidence separately for each selected feature. Door-width categories are intended for clear measurement photos; the lit-path category is intended to show lighting along the route to the guest entrance.")}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {accessibilityUploadCategories
                  .filter((category) => selectedAccessibility.includes(category.feature))
                  .map((category) =>
                    renderUploadGroup({
                      label: category.label,
                      description: category.description,
                      files: accessibilityPhotoGroups[category.key] || [],
                      onAdd: (files) =>
                        addFilesToGroup(setAccessibilityPhotoGroups, category.key, files),
                      onRemove: (index) =>
                        removeFileFromGroup(setAccessibilityPhotoGroups, category.key, index),
                    })
                  )}
              </div>
            </div>
          )}


          {/* =================================================
              CHECK-IN & ACCESS PHOTOS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              {t("Check-in & Access")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Arrival and access photos")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("Optional photos that help us prepare check-in instructions: the building entrance, lockbox or keypad location, and the route from the entrance to the accommodation. Never upload a photo showing an active private access code.")}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {checkInUploadCategories.map((category) =>
                renderUploadGroup({
                  label: category.label,
                  description: category.description,
                  files: checkInPhotoGroups[category.key] || [],
                  onAdd: (files) =>
                    addFilesToGroup(setCheckInPhotoGroups, category.key, files),
                  onRemove: (index) =>
                    removeFileFromGroup(setCheckInPhotoGroups, category.key, index),
                })
              )}
            </div>
          </div>


          {/* =================================================
              FLOOR PLANS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Optional Supporting Files")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Floor plans")}
            </h2>

            <div className="mt-6">
              {renderUploadGroup({
                label: "Floor Plans",
                description: "Upload floor plans as JPG, PNG, WEBP or PDF files.",
                files: floorPlanFiles,
                accept: "image/jpeg,image/png,image/webp,application/pdf",
                onAdd: (files) =>
                  setFloorPlanFiles((previous) =>
                    appendFiles(previous, files).slice(0, 50)
                  ),
                onRemove: (index) =>
                  setFloorPlanFiles((previous) =>
                    removeFileAtIndex(previous, index)
                  ),
              })}
            </div>
          </div>


          {/* =================================================
              LISTING CONTENT
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Listing Content")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Tell us the story of the property")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("Do not worry about perfect wording. Short notes are enough — HostMetric can rewrite and optimize the final listing content.")}
            
</p>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold">
                  {t("Existing Property / Listing Title")}
                </label>

                <input
                  value={formData.existingListingTitle}
                  onChange={(event) =>
                    updateField(
                      "existingListingTitle",
                      event.target.value
                    )
                  }
                  placeholder={t("Leave blank if this is a new property")}
                  className={inputClass(
                    "existingListingTitle"
                  )}
                />

              </div>


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold">
                  {t("Property Summary")}
                </label>

                <textarea
                  rows={5}
                  value={formData.propertySummary}
                  onChange={(event) =>
                    updateField(
                      "propertySummary",
                      event.target.value
                    )
                  }
                  placeholder={t("In your own words, briefly describe the accommodation.")}
                  className={inputClass(
                    "propertySummary"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Unique Selling Points")}
                </label>

                <textarea
                  rows={6}
                  value={formData.uniqueSellingPoints}
                  onChange={(event) =>
                    updateField(
                      "uniqueSellingPoints",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: newly renovated, beach nearby, private pool, panoramic view, quiet location...")}
                  className={inputClass(
                    "uniqueSellingPoints"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Neighbourhood / Area")}
                </label>

                <textarea
                  rows={6}
                  value={
                    formData.neighbourhoodDescription
                  }
                  onChange={(event) =>
                    updateField(
                      "neighbourhoodDescription",
                      event.target.value
                    )
                  }
                  placeholder={t("Tell us what guests can find around the property.")}
                  className={inputClass(
                    "neighbourhoodDescription"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Getting Around / Transport")}
                </label>

                <textarea
                  rows={5}
                  value={formData.gettingAround}
                  onChange={(event) =>
                    updateField(
                      "gettingAround",
                      event.target.value
                    )
                  }
                  placeholder={t("Parking, buses, airport access, walking distances, car recommendations...")}
                  className={inputClass(
                    "gettingAround"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Nearby Attractions / Places")}
                </label>

                <textarea
                  rows={5}
                  value={formData.nearbyAttractions}
                  onChange={(event) =>
                    updateField(
                      "nearbyAttractions",
                      event.target.value
                    )
                  }
                  placeholder={t("Beach, city centre, restaurants, landmarks, convention centre, ski lifts...")}
                  className={inputClass(
                    "nearbyAttractions"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Guest Arrival Notes")}
                </label>

                <textarea
                  rows={5}
                  value={formData.guestArrivalNotes}
                  onChange={(event) =>
                    updateField(
                      "guestArrivalNotes",
                      event.target.value
                    )
                  }
                  placeholder={t("Anything useful about finding or entering the property.")}
                  className={inputClass(
                    "guestArrivalNotes"
                  )}
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold">
                  {t("Other Listing Notes")}
                </label>

                <textarea
                  rows={5}
                  value={formData.otherListingNotes}
                  onChange={(event) =>
                    updateField(
                      "otherListingNotes",
                      event.target.value
                    )
                  }
                  placeholder={t("Anything else HostMetric should know when preparing the listings.")}
                  className={inputClass(
                    "otherListingNotes"
                  )}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              PHOTO RIGHTS
          ================================================= */}

          {totalSelectedUploadFiles > 0 && (
            <div className="mt-14 border-t border-slate-200 pt-10">

              <label className="mb-2 block text-sm font-bold">
                {t("Photo / File Usage Confirmation *")}
              </label>

              <select
                value={formData.photoRightsConfirmed}
                onChange={(event) =>
                  updateField(
                    "photoRightsConfirmed",
                    event.target.value
                  )
                }
                className={inputClass(
                  "photoRightsConfirmed"
                )}
              >

                <option value="">
                  {t("Select")}
                </option>

                <option value="yes">
                  {t("I own these files or have permission to use them")}
                </option>

                <option value="no">
                  {t("I do not currently have permission")}
                </option>

              </select>

              <ErrorMessage
                field="photoRightsConfirmed"
              />

            </div>
          )}


          {/* NAVIGATION */}

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold transition hover:border-blue-400 hover:text-blue-600"
            >
              {t("← Back")}
            </button>


            <button
              type="button"
              onClick={continueFromStepSix}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {t("Continue to Final Review →")}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          STEP 7
      ===================================================== */}

      {step === 7 && (
        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            {t("Step 07")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("Final Review & Property Goals")}
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            {t("Review the key information below, tell us what you want to achieve and confirm that we may use the information you provided to prepare your HostMetric onboarding and listing strategy.")}
          

</p>


          {/* =================================================
              QUICK REVIEW
          ================================================= */}

          <div className="mt-12">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Quick Review")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Your onboarding summary")}
            </h2>


            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("Owner / Contact")}
                </p>

                <p className="mt-4 text-xl font-bold text-slate-900">
                  {formData.firstName || "—"}{" "}
                  {formData.lastName || ""}
                </p>

                <p className="mt-2 text-slate-600">
                  {formData.email || t("No email entered")}
                </p>

                <p className="mt-1 text-slate-600">
                  {formData.phone
                    ? `${formData.phoneCountryCode} ${formData.phone}`
                    : t("No phone entered")}
                </p>

              </div>


              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("Property")}
                </p>

                <p className="mt-4 text-xl font-bold text-slate-900">
                  {formData.propertyName || t("Unnamed Property")}
                </p>

                <p className="mt-2 text-slate-600">
                  {formData.propertyCity || "—"}
                  {formData.propertyCountry
                    ? `, ${formData.propertyCountry}`
                    : ""}
                </p>

                <p className="mt-1 text-slate-600">
                  {formData.propertyCategory || t("Property category not specified")}
                </p>

              </div>


              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("Accommodation Inventory")}
                </p>

                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {units.reduce(
                    (total, unit) =>
                      total +
                      Math.max(
                        Number(unit.quantity) || 0,
                        0
                      ),
                    0
                  )}
                </p>

                <p className="mt-2 text-slate-600">
                  {t("Total sellable unit")}
                  {units.reduce(
                    (total, unit) =>
                      total +
                      Math.max(
                        Number(unit.quantity) || 0,
                        0
                      ),
                    0
                  ) === 1
                    ? ""
                    : "s"}{" "}
                  {t("across")} {units.length} {t("unit type")}
                  {units.length === 1 ? "" : "s"}.
                </p>

              </div>


              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("Existing Online Presence")}
                </p>

                <p className="mt-4 text-xl font-bold text-slate-900">
                  {formData.listingStatus === "no"
                    ? t("New / Not Currently Listed")
                    : selectedPlatforms.length > 0
                    ? `${selectedPlatforms.length} Platform${
                        selectedPlatforms.length === 1
                          ? ""
                          : "s"
                      } Selected`
                    : t("Not Specified")}
                </p>

                {selectedPlatforms.length > 0 && (
                  <p className="mt-2 leading-7 text-slate-600">
                    {selectedPlatforms
                      .map((platform) =>
                        platform === "other" &&
                        formData.otherPlatformName
                          ? formData.otherPlatformName
                          : platform
                      )
                      .join(" • ")}
                  </p>
                )}

              </div>


              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("Facilities Selected")}
                </p>

                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {selectedPropertyFacilities.length}
                </p>

                <p className="mt-2 text-slate-600">
                  {t("Property-level facilities currently selected.")}
                </p>

              </div>


              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("Files Selected")}
                </p>

                <p className="mt-4 text-3xl font-bold text-slate-900">
{totalSelectedUploadFiles}
                </p>

                <p className="mt-2 text-slate-600">
                  {t("Photos and supporting files ready for secure upload.")}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              PROPERTY GOALS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Your Goals")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("What would you like HostMetric to improve?")}
            </h2>


            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Main Goal *")}
                </label>

                <select
                  value={formData.primaryGoal}
                  onChange={(event) =>
                    updateField(
                      "primaryGoal",
                      event.target.value
                    )
                  }
                  className={inputClass("primaryGoal")}
                >

                  <option value="">
                    {t("Select your main goal")}
                  </option>

                  <option value="full-management">
                    {t("Full Professional Property Management")}
                  </option>

                  <option value="increase-revenue">
                    {t("Increase Revenue")}
                  </option>

                  <option value="improve-occupancy">
                    {t("Improve Occupancy")}
                  </option>

                  <option value="better-reviews">
                    {t("Improve Guest Experience & Reviews")}
                  </option>

                  <option value="expand-distribution">
                    {t("Expand to More Booking Platforms")}
                  </option>

                  <option value="reduce-workload">
                    {t("Reduce My Day-to-Day Workload")}
                  </option>

                  <option value="new-property">
                    {t("Launch a New Property Professionally")}
                  </option>

                  <option value="not-sure">
                    {t("I&apos;m Not Sure — Recommend the Best Strategy")}
                  </option>

                </select>

                <ErrorMessage field="primaryGoal" />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Preferred Start Timeline")}
                </label>

                <select
                  value={formData.preferredStartTimeline}
                  onChange={(event) =>
                    updateField(
                      "preferredStartTimeline",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "preferredStartTimeline"
                  )}
                >

                  <option value="">
                    {t("Select if known")}
                  </option>

                  <option value="asap">
                    {t("As Soon as Possible")}
                  </option>

                  <option value="2-weeks">
                    {t("Within 2 Weeks")}
                  </option>

                  <option value="1-month">
                    {t("Within 1 Month")}
                  </option>

                  <option value="1-3-months">
                    {t("Within 1–3 Months")}
                  </option>

                  <option value="later">
                    {t("Later / Just Exploring")}
                  </option>

                </select>

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Preferred Contact Method *")}
                </label>

                <select
                  value={formData.preferredContactMethod}
                  onChange={(event) =>
                    updateField(
                      "preferredContactMethod",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "preferredContactMethod"
                  )}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="phone">
                    {t("Phone Call")}
                  </option>

                  <option value="whatsapp">
                    {t("WhatsApp")}
                  </option>

                  <option value="email">
                    {t("Email")}
                  </option>

                  <option value="any">
                    {t("Any Method")}
                  </option>

                </select>

                <ErrorMessage
                  field="preferredContactMethod"
                />

              </div>


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Best Time to Contact You")}
                </label>

                <input
                  value={formData.bestContactTime}
                  onChange={(event) =>
                    updateField(
                      "bestContactTime",
                      event.target.value
                    )
                  }
                  placeholder={t("Example: Weekdays after 17:00, mornings, anytime...")}
                  className={inputClass(
                    "bestContactTime"
                  )}
                />

              </div>


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Final Notes")}
                </label>

                <textarea
                  rows={6}
                  value={formData.finalNotes}
                  onChange={(event) =>
                    updateField(
                      "finalNotes",
                      event.target.value
                    )
                  }
                  placeholder={t("Anything else you would like our team to know before we review the property?")}
                  className={inputClass(
                    "finalNotes"
                  )}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              FINAL CONFIRMATIONS
          ================================================= */}

          <div className="mt-14 border-t border-slate-200 pt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("Final Confirmations")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("Before sending your property")}
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              {t("These confirmations allow us to review the onboarding properly. Completing this form does not by itself activate a management service or publish a listing.")}
            

</p>


            <div className="mt-8 space-y-6">

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Information Accuracy *")}
                </label>

                <select
                  value={
                    formData.informationAccuracyConfirmed
                  }
                  onChange={(event) =>
                    updateField(
                      "informationAccuracyConfirmed",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "informationAccuracyConfirmed"
                  )}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("I confirm the information is accurate to the best of my knowledge")}
                  </option>

                </select>

                <ErrorMessage
                  field="informationAccuracyConfirmed"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("Property Authorization *")}
                </label>

                <select
                  value={formData.authorizationConfirmed}
                  onChange={(event) =>
                    updateField(
                      "authorizationConfirmed",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "authorizationConfirmed"
                  )}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("I confirm I am the owner or am authorized to provide information for this property")}
                  </option>

                </select>

                <ErrorMessage
                  field="authorizationConfirmed"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("HostMetric Review Authorization *")}
                </label>

                <select
                  value={
                    formData.listingSetupAuthorization
                  }
                  onChange={(event) =>
                    updateField(
                      "listingSetupAuthorization",
                      event.target.value
                    )
                  }
                  className={inputClass(
                    "listingSetupAuthorization"
                  )}
                >

                  <option value="">
                    {t("Select")}
                  </option>

                  <option value="yes">
                    {t("I authorize HostMetric to review this information for onboarding and listing preparation")}
                  </option>

                </select>

                <ErrorMessage
                  field="listingSetupAuthorization"
                />

              </div>

            </div>

          </div>


          {/* =================================================
              WHAT HAPPENS NEXT
          ================================================= */}

          <div className="mt-14 rounded-[28px] bg-slate-950 p-8 text-white md:p-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
              {t("What Happens Next?")}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {t("We review the property before anything goes live.")}
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
              {t("Our team will review the property information, current listings, room or unit structure, facilities, photos and commercial setup. We can then contact you for anything missing and prepare the recommended listing, distribution and pricing strategy.")}
            


</p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl bg-white/10 p-5">

                <p className="text-sm font-bold text-blue-300">
                  01
                </p>

                <p className="mt-2 font-bold">
                  {t("Property Review")}
                </p>

              </div>


              <div className="rounded-2xl bg-white/10 p-5">

                <p className="text-sm font-bold text-blue-300">
                  02
                </p>

                <p className="mt-2 font-bold">
                  {t("Strategy & Missing Details")}
                </p>

              </div>


              <div className="rounded-2xl bg-white/10 p-5">

                <p className="text-sm font-bold text-blue-300">
                  03
                </p>

                <p className="mt-2 font-bold">
                  {t("Onboarding & Listing Setup")}
                </p>

              </div>

            </div>

          </div>


          {submissionError && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700">
              {submissionError}
            </div>
          )}

          {uploadProgress && (
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-900">
              <p className="font-bold">{t("Uploading files...")}</p>
              <p className="mt-1 text-sm font-semibold">
                {uploadProgress.completed} / {uploadProgress.total}
              </p>
            </div>
          )}


          {/* NAVIGATION */}

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold transition hover:border-blue-400 hover:text-blue-600"
            >
              {t("← Back")}
            </button>


            <button
              type="button"
              onClick={submitOnboarding}
              disabled={isSubmitting}
              className="cursor-pointer rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t("Submitting...") : t("Submit Property Onboarding →")}
            </button>

          </div>

        </div>
      )}


    </div>
  );
}