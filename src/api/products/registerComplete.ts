import api from '@/api';

export interface Register {
  bookingId: string;
  branchName: string;
  prodName: string;
  date: string;
  time: string;
  docInfo: {
    requiredDocuments: string[];
  };
}

export const fetchReservedDetail = async (bookingId: string) => {
  console.log('Fetching reserved detail for booking ID:', bookingId);
  const res = await api.get(`/api/bookings/detail/${bookingId}`);
  console.log('Reserved detail fetched:', res.data);
  return res.data;
};
