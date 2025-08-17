import api from '@/api';
import type { Event } from '@/types/event/event';

// 이벤트 페이지 조회
export async function fetchEventData() {
  const res = await api.get(`/api/event`);
  // console.log('Event data fetched:', res.data);
  return res.data as Event;
}

// 포인트 추가
export async function postEventData() {
  await api.post(`/api/event`);
}
