// 커스텀 설정이 적용된 Axios 인스턴스를 가져옵니다.
// 이렇게 해야 모든 요청에 인증 토큰이 자동으로 첨부됩니다.
import api from '@/api';
import type {
  RecipientRequestDto,
  RecipientResponseDto,
  GiftPageResponseDto,
} from '@/types/gift/recipient';

const API_BASE = '/api/gift';

/** 수증자 생성 */
export const createRecipient = async (data: RecipientRequestDto) => {
  const response = await api.post<{ recipientId: number }>(API_BASE, data);
  return response.data;
};

/** 증여 페이지 데이터 조회 */
export const fetchGiftPageData = async () => {
  const response = await api.get<GiftPageResponseDto>(API_BASE);
  return response.data;
};

/** 특정 수증자 상세 조회 */
export const fetchRecipientById = async (recipientId: number) => {
  const response = await api.get<RecipientResponseDto>(
    `${API_BASE}/${recipientId}`
  );
  return response.data;
};

/** 수증자 수정 */
export const updateRecipient = async (
  recipientId: number,
  data: RecipientRequestDto
) => {
  await api.put(`${API_BASE}/${recipientId}`, data);
};

/** 수증자 삭제 */
export const deleteRecipient = async (recipientId: number) => {
  await api.delete(`${API_BASE}/${recipientId}`);
};
