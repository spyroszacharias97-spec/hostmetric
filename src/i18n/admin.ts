import { getDictionary } from "@/i18n/get-dictionary";

import type { Locale } from "@/i18n/config";

export type AdminDictionary = {
  dashboard: {
    eyebrow: string;
    title: string;
    description: string;

    cards: {
      leads: string;
      contactRequests: string;
      getStarted: string;
      properties: string;
    };

    actions: {
      open: string;
    };

    statusCards: {
      active: string;
      pending: string;
      inactive: string;
    };

    contactRequests: {
      unansweredBadge: string;
    };

    propertiesSection: {
      eyebrow: string;
      title: string;
      description: string;
      allProperties: string;
      units: string;
      empty: string;
    };
  };

  leads: {
    eyebrow: string;
    title: string;
    description: string;

    stats: {
      total: string;
      completed: string;
      pending: string;
    };

    search: {
      placeholder: string;
      button: string;
      clear: string;
      noResults: string;
    };

    sections: {
      completed: {
        title: string;
        description: string;
        empty: string;
      };

      pending: {
        title: string;
        description: string;
        empty: string;
      };
    };

    fields: {
      email: string;
      phone: string;
      requests: string;
      properties: string;
      latestContact: string;
      getStarted: string;
      propertyType: string;
      location: string;
      unitTypes: string;
      physicalProperties: string;
      totalCapacity: string;
      listingStatus: string;
      channelManager: string;
      pms: string;
      website: string;
      directBookings: string;
    };

    cards: {
      getStarted: string;
    };

    status: {
      completed: string;
      pending: string;
    };

    actions: {
      openClient: string;
      backToClients: string;
      openProperty: string;
      completeGetStarted: string;
      editClient: string;
      newClient: string;
    };

    fallback: {
      unnamedClient: string;
      unnamedProperty: string;
      unnamedUnit: string;
      noPhone: string;
      noDate: string;
      noAddress: string;
      noValue: string;
      notConfigured: string;
    };

    client: {
      overviewTitle: string;
      propertiesTitle: string;
      propertiesDescription: string;
      bedrooms: string;
      bathrooms: string;
      maxGuests: string;
      quantity: string;
      units: string;
      physicalProperties: string;
      totalCapacity: string;
      noUnits: string;
      noProperties: string;
      pendingTitle: string;
      pendingDescription: string;
      completedDescription: string;
    };
  };


  contactRequests: {
    title: string;
    description: string;

    stats: {
      total: string;
      unanswered: string;
      answered: string;
    };

    search: {
      placeholder: string;
      button: string;
      clear: string;
    };

    sections: {
      unanswered: {
        title: string;
        description: string;
        empty: string;
      };

      answered: {
        title: string;
        description: string;
        empty: string;
      };
    };

    fields: {
      request: string;
      email: string;
      phone: string;
      location: string;
      date: string;
      propertyType: string;
      client: string;
      message: string;
      photos: string;
      photo: string;
    };

    actions: {
      markAnswered: string;
      markUnanswered: string;
      openClient: string;
    };

    fallback: {
      noValue: string;
      noClient: string;
    };
  };

  properties: {
    eyebrow: string;
    title: string;
    description: string;

    search: {
      placeholder: string;
      button: string;
      clear: string;
    };

    filters: {
      all: string;
      active: string;
      pending: string;
      inactive: string;
    };

    fields: {
      owner: string;
      propertyType: string;
      location: string;
      units: string;
      status: string;
    };

    actions: {
      openProperty: string;
      newProperty: string;
    };

    newProperty: {
      eyebrow: string;
      title: string;
      description: string;
      existingClient: string;
      existingClientDescription: string;
      newClient: string;
      newClientDescription: string;
      selectClient: string;
      selectedClient: string;
      changeClient: string;
      selectClientPlaceholder: string;
      searchClientPlaceholder: string;
      search: string;
      noClientsFound: string;
      fullName: string;
      email: string;
      phone: string;
      phoneOptional: string;
      propertyCountry: string;
      propertyType: string;
      propertyCityArea: string;
      selectPropertyCountry: string;
      selectPropertyType: string;
      createClientAndContinue: string;
      continue: string;
      back: string;
      requiredClient: string;
    };

    empty: {
      title: string;
      description: string;
      searchTitle: string;
      searchDescription: string;
    };
  };

  propertyDetails: {
    eyebrow: string;

    status: {
      pending: string;
      active: string;
      inactive: string;
    };

    stats: {
      units: string;
      totalUnits: string;
      bedrooms: string;
      bathrooms: string;
      maxGuests: string;
    };

    actions: {
      backToClient: string;
      openPhotos: string;
      showRawData: string;
      activateProperty: string;
      deactivateProperty: string;
      saveChanges: string;
      saveUnit: string;
    };

    client: {
      ownerLabel: string;
      openClient: string;
    };

    photos: {
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

    common: {
      yes: string;
      no: string;
    };

    fallback: {
      unnamedProperty: string;
      unnamedUnit: string;
      noValue: string;
      noUnits: string;
      noPhotoFolder: string;
    };

    sections: {
      property: {
        title: string;
        description: string;
      };

      units: {
        title: string;
        description: string;
      };

      distribution: {
        title: string;
        description: string;
      };

      operations: {
        title: string;
        description: string;
      };

      policies: {
        title: string;
        description: string;
      };

      facilities: {
        title: string;
        description: string;
      };

      pricing: {
        title: string;
        description: string;
      };

      listingContent: {
        title: string;
        description: string;
      };

      goals: {
        title: string;
        description: string;
      };

      owner: {
        title: string;
        description: string;
      };

      confirmations: {
        title: string;
        description: string;
      };

      photos: {
        title: string;
        description: string;
      };

      raw: {
        title: string;
        description: string;
      };
    };

    labels: {
      propertyName: string;
      propertyType: string;
      country: string;
      region: string;
      city: string;
      address: string;
      postalCode: string;
      ownershipStatus: string;
      accommodationStructure: string;
      registrationStatus: string;
      registrationNumber: string;
      landRegistrationNumber: string;
      additionalLegalNumber: string;
      listingStatus: string;
      currentlyOperating: string;
      existingListings: string;
      internalNotes: string;

      unitName: string;
      unitType: string;
      quantity: string;

      bedrooms: string;
      bathrooms: string;
      sizeSqm: string;
      maxGuests: string;
      maxAdults: string;
      maxChildren: string;
      kitchen: string;
      smokingPolicy: string;
      beds: string;
      kingBeds: string;
      queenBeds: string;
      doubleBeds: string;
      singleBeds: string;
      sofaBeds: string;
      bunkBeds: string;
      amenities: string;
      accessibility: string;
      currentBaseRate: string;
      weekendRate: string;
      minimumNightlyRate: string;
      extraGuestFee: string;
      childFee: string;
      notes: string;

      bookingId: string;
      bookingUrl: string;
      airbnbId: string;
      airbnbUrl: string;
      vrboId: string;
      vrboUrl: string;
      expediaId: string;
      expediaUrl: string;
      agodaId: string;
      agodaUrl: string;
      tripcomId: string;
      tripcomUrl: string;
      otherPlatform: string;
      otherPlatformUrl: string;
      channelManagerStatus: string;
      channelManagerName: string;
      pmsStatus: string;
      pmsName: string;
      websiteStatus: string;
      websiteUrl: string;
      directBookingsStatus: string;
      selectedPlatforms: string;

      checkInFrom: string;
      checkInUntil: string;
      checkOutFrom: string;
      checkOutUntil: string;
      checkInMethod: string;
      receptionStatus: string;
      guestLanguages: string;
      advanceNotice: string;
      bookingWindow: string;
      sameDayBooking: string;
      minimumStay: string;
      maximumStay: string;
      guestArrivalNotes: string;
      ownerBlockedDates: string;

      childrenPolicy: string;
      minimumGuestAge: string;
      petsPolicy: string;
      partiesPolicy: string;
      smokingPropertyPolicy: string;
      quietHours: string;
      cancellationPreference: string;
      noShowPolicy: string;

      parkingDetails: string;
      breakfastDetails: string;
      internetDetails: string;
      accessibilityNotes: string;
      propertyFacilities: string;
      propertyAccessibility: string;

      currency: string;
      cleaningFee: string;
      cleaningFeeType: string;
      securityDeposit: string;
      localTaxKnown: string;
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
      localTaxDetails: string;
      pricingNotes: string;

      existingListingTitle: string;
      propertySummary: string;
      uniqueSellingPoints: string;
      neighbourhoodDescription: string;
      gettingAround: string;
      nearbyAttractions: string;
      otherListingNotes: string;
      photoRightsConfirmed: string;

      primaryGoal: string;
      preferredStartTimeline: string;
      preferredContactMethod: string;
      bestContactTime: string;
      finalNotes: string;

      ownerType: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      countryOfResidence: string;
      birthDate: string;
      homeAddress: string;
      homeCity: string;
      homePostalCode: string;
      businessName: string;
      businessRegistrationNumber: string;
      vatNumber: string;
      taxId: string;
      businessAddress: string;
      businessCity: string;
      businessPostalCode: string;

      informationAccuracyConfirmed: string;
      authorizationConfirmed: string;
      listingSetupAuthorization: string;
      submissionStatus: string;
      createdAt: string;
      updatedAt: string;

      driveFolderId: string;
    };
  };

  navigation: {
    management: string;
    dashboard: string;
    leads: string;
    contactRequests: string;
    getStarted: string;
    properties: string;
    photos: string;
    logout: string;
  };

  common: {
    administration: string;
    managementSystem: string;
    internalManagementSystem: string;
    adminConsole: string;
    administrator: string;
    hostMetricTeam: string;
    openMenu: string;
    closeMenu: string;
    dateLocale: string;
  };
};

export async function getAdminDictionary(
  locale: Locale
): Promise<AdminDictionary> {
  const adminLocale: Locale =
    locale === "el"
      ? "el"
      : "en";

  const dictionary =
    await getDictionary(adminLocale);

  const adminDictionary =
    (
      dictionary as unknown as {
        admin?: AdminDictionary;
      }
    ).admin;

  if (!adminDictionary) {
    throw new Error(
      `Admin dictionary is missing for locale: ${adminLocale}`
    );
  }

  return adminDictionary;
}
