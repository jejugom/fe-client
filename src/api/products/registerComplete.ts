import api from '@/api';

export interface Register {
  bookingCode: string;
  branchName: string;
  prodName: string;
  date: string;
  time: string;
  docInfo: {
    requiredDocuments: string[];
  };
}

export const fetchReservedDetail = async (identifier: string) => {
  console.log('Fetching reserved detail for identifier:', identifier);
  const res = await api.get(`/api/bookings/detail/${identifier}`);
  console.log('Reserved detail fetched:', res.data);
  return res.data;
};
