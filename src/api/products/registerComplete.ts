import axios from 'axios';

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

export const fetchReservedDetail = async (bookingId: string, token: string) => {
  console.log('Fetching reserved detail for booking ID:', bookingId);
  const res = await axios.get(
    `http://localhost:8080/api/bookings/detail/${bookingId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log('Reserved detail fetched:', res.data);
  return res.data;
};
