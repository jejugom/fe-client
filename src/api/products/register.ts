export interface Reserved {
  [date: string]: string[];
}

export const api_data: { reserved_slots: Reserved } = {
  reserved_slots: {
    '2025-07-30': ['10:00', '11:30', '14:00'],
    '2025-07-31': ['09:30'],
    '2025-08-03': ['10:00', '10:30', '11:00', '15:30'],
  },
};
