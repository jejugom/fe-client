import api from '@/api';

export interface Option {
  saveTrm: string;
  intrRateTypeNm: string;
  intrRate: number;
  intrRate2: number;
}

export interface FundOption {
  rate3mon: number;
  riskGrade: number;
  priceStd: number;
  totalFee: number;
  assetTotal?: number | string;
  feeRedemp?: string;
}

export interface MortgageOption {
  mrtgTypeNm: string;
  rpayTypeNm: string;
  lendRateTypeNm: string;
  lendRateMin: string;
  lendRateMax: string;
}

export interface ProductDetail {
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

// 기존 타입들 그대로 두고, 아래 2개 추가/수정

export interface FundDailyReturn {
  recordDate: string;
  returnRate: number;
}

// 백엔드가 product만 주거나 { product, fundReturn }로 주는 두 케이스를 모두 허용
export type ProductDetailApiResponse =
  | ProductDetail
  | { rec?: number; product: ProductDetail; fundReturn?: FundDailyReturn[] };

// 반환 타입을 위 유니온으로 변경
export async function fetchProductDetail(
  id: string
): Promise<ProductDetailApiResponse> {
  const res = await api.get(`/api/retirement/${id}`);
  console.log('Product detail fetched:', res.data);
  return res.data;
}

// (별도 호출 쓰는 경우) named export 준비
export async function fetchFundReturn(
  id: string,
  range = '3m'
): Promise<FundDailyReturn[]> {
  const res = await api.get<FundDailyReturn[]>(
    `/api/retirement/${id}/returns`,
    { params: { range } }
  );
  console.log('Fund return fetched:', res.data);
  return res.data ?? [];
}
