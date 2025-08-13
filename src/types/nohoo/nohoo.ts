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
