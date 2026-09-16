/*
 * HostMetric feature availability.
 *
 * Direct Booking is available in every environment.
 * The real public ON/OFF gate is the fail-closed database setting:
 * guesty_settings.direct_booking_enabled.
 *
 * Admin OFF -> public booking stays closed.
 * Admin ON  -> public booking can open.
 */
export const features = {
  directBooking: true,
} as const;
