interface Option {
  saveTrm: string;
  intrRateTypeNm: string;
  intrRate: number;
  intrRate2: number;
}

interface FundOption {
  rate3mon: number;
  riskGrade: number;
  priceStd: number;
  totalFee: number;
  assetTotal?: number | string;
  feeRedemp?: string;
}

interface MortgageOption {
  mrtgTypeNm: string;
  rpayTypeNm: string;
  lendRateTypeNm: string;
  lendRateMin: string;
  lendRateMax: string;
}

interface ProductDetail {
  finPrdtCd: string;
  finPrdtCategory: string;
  finPrdtNm: string;
  recReason: string | null;
  korCoNm: string;
  prdtFeature: string;
  description: string;
  joinWay: string;
  mtrtInt: string;
  spclCnd: string;
  joinDeny: string;
  joinMember: string;
  etcNote: string;
  maxLimit: number | null;
  tendency: string | null;
  optionList: Option[] | FundOption[] | MortgageOption[] | null;
  iconInfo?: Record<string, string>;
  lot?: string;
  currency?: string;
  dlyRate?: string;
  erlyRpayFee?: string;
  loanInciExpn?: string;
  loanLmt?: string;
  basePrice?: string;
  depositProtection?: string;
  fundStructure?: string;
  fundType?: string;
  saleStartDate?: string;
  taxBenefit?: string;
  trustFee?: string;
  yieldRate?: string;
}

interface FundDailyReturn {
  recordDate: string;
  returnRate: number;
}

type ProductDetailApiResponse =
  | ProductDetail
  | { rec?: number; product: ProductDetail; fundReturn?: FundDailyReturn[] };

export type {
  Option,
  FundOption,
  MortgageOption,
  ProductDetail,
  FundDailyReturn,
  ProductDetailApiResponse,
};
