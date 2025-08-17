import api from '@/api';
import type {
  AssetResponse,
  CreateAssetRequest,
  UpdateAssetRequest,
} from '@/types/profile/editAsset';

// 자산 카테고리 코드 매핑
export const ASSET_CATEGORY_MAP = {
  '1': '부동산',
  '2': '예금/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타 자산',
} as const;

// 카테고리명을 코드로 변환하는 역매핑 (ASSET_CATEGORY_MAP과 일치)
export const CATEGORY_NAME_TO_CODE = {
  부동산: '1',
  '예금/적금': '2',
  현금: '3',
  '주식/펀드': '4',
  '사업체/지분': '5',
  '기타 자산': '6',
} as const;

/**
 * API 응답 데이터를 컴포넌트에서 사용할 형태로 변환
 * @param apiData API에서 받은 자산 데이터 배열
 * @returns 컴포넌트용 자산 데이터 배열
 */
export function transformApiResponseToAssets(apiData: AssetResponse[]) {
  return apiData.map((item) => ({
    id: item.assetId,
    name: item.assetName,
    type: ASSET_CATEGORY_MAP[
      item.assetCategoryCode as keyof typeof ASSET_CATEGORY_MAP
    ],
    amount: item.amount, // 원 단위 그대로 사용
    companyType: item.businessType || '', // 사업체 종류가 있으면 사용, 없으면 빈 문자열
    email: item.email,
  }));
}

/**
 * 컴포넌트 데이터를 API 요청용 형태로 변환
 * @param assets 컴포넌트 자산 데이터 배열
 * @returns API 요청용 자산 데이터 배열
 */
export function transformAssetsToApiRequest(assets: any[]) {
  return assets.map((item) => ({
    assetId: item.id,
    email: item.email || 'user@gmail.com',
    assetCategoryCode:
      CATEGORY_NAME_TO_CODE[item.type as keyof typeof CATEGORY_NAME_TO_CODE],
    amount: item.amount, // 원 단위 그대로 사용
    assetName: item.name,
    businessType: item.companyType || null,
  }));
}

// 자산 관리 API 함수들
export const assetsApi = {
  /**
   * 사용자의 모든 자산 정보 조회
   * @returns 자산 목록
   */
  async getAssets(): Promise<AssetResponse[]> {
    const response = await api.get('/api/assets');
    return response.data;
  },

  /**
   * 새로운 자산 등록
   * @param assetData 등록할 자산 정보
   * @returns 등록된 자산 정보
   */
  async createAsset(assetData: CreateAssetRequest) {
    const response = await api.post('/api/assets', assetData);
    return response.data;
  },

  /**
   * 기존 자산 정보 수정
   * @param assetId 수정할 자산 ID
   * @param assetData 수정할 자산 정보
   * @returns 수정된 자산 정보
   */
  async updateAsset(assetId: number, assetData: UpdateAssetRequest) {
    const response = await api.put(`/api/assets/${assetId}`, assetData);
    return response.data;
  },

  /**
   * 자산 삭제
   * @param assetId 삭제할 자산 ID
   * @returns 삭제 결과
   */
  async deleteAsset(assetId: number) {
    const response = await api.delete(`/api/assets/${assetId}`);
    return response.data;
  },
};
