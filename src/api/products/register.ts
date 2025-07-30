import axios from 'axios';

export const fetchReservedSlots = async (branchId: number, token: string) => {
  console.log('Fetching reserved slots for branch:', branchId);
  const res = await axios.get(
    `http://localhost:8080/api/bookings/${branchId}/reserved-slots`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log('Reserved slots fetched:', res.data);
  return res.data;
};
