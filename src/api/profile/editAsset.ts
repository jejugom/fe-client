// API 응답 형태에 맞는 자산 더미 데이터
export interface AssetResponse {
  assetId: number;
  email: string;
  assetCategoryCode: string;
  amount: number;
  registeredAt: number;
  endDate: number | null;
  assetName: string;
  businessType: string | null;
}

// 자산 카테고리 코드 매핑
export const ASSET_CATEGORY_MAP = {
  '1': '부동산',
  '2': '예금/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타 자산',
} as const;

// 카테고리명을 코드로 변환하는 역매핑
export const CATEGORY_NAME_TO_CODE = {
  부동산: '1',
  예금: '2',
  현금: '3',
  '주식/펀드': '4',
  '사업체/지분': '5',
  '기타 자산': '6',
} as const;

// API 응답 형태의 더미 데이터
export const assetsApiResponse: AssetResponse[] = [
  {
    assetId: 10,
    email: 'user@gmail.com',
    assetCategoryCode: '1',
    amount: 1000000000, // 10억원 (원 단위)
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '우리집',
    businessType: null,
  },
  {
    assetId: 11,
    email: 'user@gmail.com',
    assetCategoryCode: '1',
    amount: 500000000, // 5억원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '아파트',
    businessType: null,
  },
  {
    assetId: 12,
    email: 'user@gmail.com',
    assetCategoryCode: '2',
    amount: 30000000, // 3천만원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: 'KB able Plus통장-보통예금',
    businessType: null,
  },
  {
    assetId: 13,
    email: 'user@gmail.com',
    assetCategoryCode: '3',
    amount: 15000000, // 1천 5백만원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '보유 현금',
    businessType: null,
  },
  {
    assetId: 14,
    email: 'user@gmail.com',
    assetCategoryCode: '4',
    amount: 5000000, // 500만원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '삼성전자 주식',
    businessType: null,
  },
  {
    assetId: 15,
    email: 'user@gmail.com',
    assetCategoryCode: '5',
    amount: 20000000, // 2천만원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '카페 지분',
    businessType: '개인 사업자',
  },
  {
    assetId: 16,
    email: 'user@gmail.com',
    assetCategoryCode: '5',
    amount: 100000000, // 1억원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '유저 회사',
    businessType: '법인 사업자',
  },
  {
    assetId: 17,
    email: 'user@gmail.com',
    assetCategoryCode: '6',
    amount: 40000000, // 4천만원
    registeredAt: 1753410617000,
    endDate: null,
    assetName: '자동차',
    businessType: null,
  },
];

// 컴포넌트에서 사용할 형태로 변환하는 유틸리티 함수
export const transformApiResponseToAssets = (apiData: AssetResponse[]) => {
  return apiData.map((item) => ({
    id: item.assetId,
    name: item.assetName,
    type: ASSET_CATEGORY_MAP[
      item.assetCategoryCode as keyof typeof ASSET_CATEGORY_MAP
    ],
    amount: Math.round(item.amount / 10000), // 원 단위를 만원 단위로 변환
    companyType: item.businessType || '', // 사업체 종류가 있으면 사용, 없으면 빈 문자열
    email: item.email,
    registeredAt: item.registeredAt,
    endDate: item.endDate,
  }));
};

// 컴포넌트 형태를 API 형태로 변환하는 유틸리티 함수
export const transformAssetsToApiRequest = (assets: any[]) => {
  return assets.map((item) => ({
    assetId: item.id,
    email: item.email || 'user@gmail.com',
    assetCategoryCode:
      CATEGORY_NAME_TO_CODE[item.type as keyof typeof CATEGORY_NAME_TO_CODE],
    amount: item.amount * 10000, // 만원 단위를 원 단위로 변환
    registeredAt: item.registeredAt || Date.now(),
    endDate: item.endDate || null,
    assetName: item.name,
    businessType: item.companyType || null,
  }));
};
