interface UserInfo {
  userName: string;
  assetStatus: { assetCategoryCode: string; amount: number }[];
}

interface CustomRecommendPrdt {
  finPrdtCd: string;
  score: string; // 백엔드가 문자열로 줌
}

interface TimeDepositOption {
  saveTrm: string | null;
  intrRate?: number | null;
  intrRate2?: number | null;
}
interface TimeDeposit {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: TimeDepositOption[];
}

interface SavingDepositOption {
  saveTrm: string | null;
  intrRate?: number | null;
  intrRate2?: number | null;
}
interface SavingDeposit {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: SavingDepositOption[];
}

interface MortgageLoanOption {
  mrtgTypeNm?: string | null;
  rpayTypeNm?: string | null;
  lendRateTypeNm?: string | null;
  lendRateMin?: string | null;
  lendRateMax?: string | null;
}
interface MortgageLoan {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: MortgageLoanOption[];
}

interface GoldProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: any[];
}

interface FundOption {
  rate3mon?: string | null;
  riskGrade?: string | null;
  priceStd?: string | null;
}
interface FundProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string | null;
  optionList?: FundOption[];
}

interface TrustProduct {
  finPrdtCd: string;
  finPrdtNm: string | null;
  prdtFeature: string | null;
  optionList?: any[];
}

interface News {
  category: number;
  title: string;
  link: string;
  date: string;
  summary: string;
}

interface ParsedApiResponse {
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

// 공통(모든 탭에서 잠재적으로 쓸 수 있는) 필드
export interface BaseFilters {
  // 공통 숫자/문자 필드가 필요하면 여기에 추가
}

// 예금 탭에서 사용하는 필터
export interface DepositFilters extends BaseFilters {
  terms?: string[]; // 예: ['6','12','24']
  rateTypes?: string[]; // 예: ['고정금리','변동금리']
  minTopRate?: number | null; // 최고금리 하한
}

// 적금 탭에서 사용하는 필터
export interface SavingFilters extends BaseFilters {
  terms?: string[];
  savingKinds?: string[]; // 예: ['정액적립식','자유적립식']
  minTopRate?: number | null;
}

// 펀드 탭에서 사용하는 필터
export interface FundFilters extends BaseFilters {
  riskGrades?: string[]; // 예: ['1','2','3'...]
  min3mReturn?: number | null; // 3개월 수익률 하한
}

// 주택담보 탭에서 사용하는 필터
export interface MortgageFilters extends BaseFilters {
  rateTypes?: string[]; // 대출 금리 유형
  mrtgTypes?: string[]; // 담보 유형
  repayTypes?: string[]; // 상환 방식
  maxRateCeil?: number | null; // 최저금리 상한 (ceil)
  calcLtv?: number | null; // 사용자가 계산한 LTV
}

// 화면에서 다루는 “필터”의 총합 유니온
export type NohooFilters =
  | DepositFilters
  | SavingFilters
  | FundFilters
  | MortgageFilters
  | BaseFilters; // 안전하게 기본 포함

export type {
  UserInfo,
  CustomRecommendPrdt,
  TimeDepositOption,
  TimeDeposit,
  SavingDepositOption,
  SavingDeposit,
  MortgageLoanOption,
  MortgageLoan,
  GoldProduct,
  FundOption,
  FundProduct,
  TrustProduct,
  News,
  ParsedApiResponse,
};
