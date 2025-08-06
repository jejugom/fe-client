import api from '@/api';
import type {
  RecipientRequestDto,
  RecipientResponseDto,
  GiftPageResponseDto,
} from '@/types/gift/recipient';

const API_BASE = '/api/gift';

/** 수증자 생성 */
export const createRecipient = async (
  data: RecipientRequestDto,
  mode: 'gift' | 'inheritance'
) => {
  const response = await api.post<{ recipientId: number }>(
    `${API_BASE}?mode=${mode}`,
    data
  );
  console.log('수증자 생성 응답:', response.data);
  return response.data;
};

/** 증여 페이지 데이터 조회 */
export const fetchGiftPageData = async (mode: 'gift' | 'inheritance') => {
  const cacheBuster = new Date().getTime();
  const response = await api.get<GiftPageResponseDto>(
    `${API_BASE}?mode=${mode}&t=${cacheBuster}`
  );
  console.log('증여 페이지 데이터:', response.data);
  return response.data;
};

/** 특정 수증자 상세 조회 */
export const fetchRecipientById = async (recipientId: number) => {
  const response = await api.get<RecipientResponseDto>(
    `${API_BASE}/${recipientId}`
  );
  console.log('수증자 상세 조회 응답:', response.data);
  return response.data;
};

/** 수증자 수정 */
export const updateRecipient = async (
  recipientId: number,
  data: RecipientRequestDto,
  mode: 'gift' | 'inheritance'
) => {
  await api.put(`${API_BASE}/${recipientId}?mode=${mode}`, data);
  console.log('수증자 수정 완료:', recipientId);
};

/** 수증자 삭제 */
export const deleteRecipient = async (
  recipientId: number,
  mode: 'gift' | 'inheritance'
) => {
  await api.delete(`${API_BASE}/${recipientId}?mode=${mode}`);
  console.log('수증자 삭제 완료:', recipientId);
};