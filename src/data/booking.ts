/** Four seats per table is an editable initial allocation of the confirmed 48 seats. */
export const bookingConfig = {
  enabled: false,
  timezone: 'Atlantic/Azores',
  terraceBookable: false,
  tables: Array.from({ length: 12 }, (_, index) => ({
    id: `interior-${index + 1}`, name: `Mesa ${index + 1}`, seats: 4,
    active: true, area: 'interior' as const,
  })),
  serviceHours: {
    closedWeekdays: [1],
    periods: [{ start: '12:00', end: '15:00' }, { start: '19:00', end: '22:00' }],
  },
  // Provisional duration requested by the restaurant. Review after observing real service times.
  // TODO: consider different durations for lunch, dinner and larger groups.
  durationMinutes: 60,
  confirmationMode: 'manual' as const,
};
