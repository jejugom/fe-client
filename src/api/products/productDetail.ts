import api from '@/api';

export interface Option {
  saveTrm: string;
  intrRateTypeNm: string;
  intrRate: number;
  intrRate2: number;
}

export interface FundOption {
  rate3mon: number;
  riskGrade: string;
  priceStd: number;
  totalFee: number;
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
}

export async function fetchProductDetail(id: string): Promise<ProductDetail> {
  const res = await api.get<ProductDetail>(`/api/retirement/${id}`);
  console.log('Product detail response:', res.data);
  return res.data;
}
