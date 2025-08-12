import api from '@/api';

export interface Register {
  news: {
    category: number;
    title: string;
    summary: string;
    link: string;
    date: string;
  };
  point: number;
}

export const fetchEventData = async () => {
  const res = await api.get(`/api/event`);
  console.log('Event data fetched:', res.data);
  return res.data;
};

export const postEventData = async () => {
  await api.post(`/api/event`);
};
