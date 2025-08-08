import api from '@/api';

// ===== 타입 =====
export interface UserInfo {
  userName: string;
  assetStatus: { assetCategoryCode: string; amount: number }[];
}

export interface CustomRecommendPrdt {
  finPrdtCd: string;
  score: string; // 백엔드가 문자열로 줌
}

export interface TimeDepositOption {
  saveTrm: string | null;
  intrRate?: number | null;
  intrRate2?: number | null;
}
export interface TimeDeposit {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: TimeDepositOption[];
}

export interface SavingDepositOption {
  saveTrm: string | null;
  intrRate?: number | null;
  intrRate2?: number | null;
}
export interface SavingDeposit {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: SavingDepositOption[];
}

export interface MortgageLoanOption {
  mrtgTypeNm?: string | null;
  rpayTypeNm?: string | null;
  lendRateTypeNm?: string | null;
  lendRateMin?: string | null;
  lendRateMax?: string | null;
}
export interface MortgageLoan {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: MortgageLoanOption[];
}

export interface GoldProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: any[];
}

export interface FundOption {
  rate3mon?: string | null; // "12.34%" 혹은 null
  riskGrade?: string | null;
  priceStd?: string | null;
}
export interface FundProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: FundOption[];
}

export interface TrustProduct {
  finPrdtCd: string;
  finPrdtNm: string | null;
  prdtFeature: string | null;
  optionList?: any[];
}

export interface News {
  category: number;
  title: string;
  link: string;
  date: string;
  summary: string;
}

export interface ParsedApiResponse {
  userInfo?: UserInfo;
  customRecommendPrdt?: CustomRecommendPrdt[];
  allProducts?: {
    gold?: GoldProduct[];
    fund?: FundProduct[];
    deposit?: TimeDeposit[];
    trust?: TrustProduct[];
    mortgage?: MortgageLoan[];
    saving?: SavingDeposit[];
  };
  news?: News[];
}

// ===== API =====
export async function fetchNohooData(): Promise<ParsedApiResponse> {
  const res = await api.get<ParsedApiResponse>(`/api/retirement`);
  console.log('Nohoo data fetched:', res.data);
  return res.data;
}
