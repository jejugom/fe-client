import axios from 'axios';

export interface Option {
  saveTrm: string;
  intrRateTypeNm: string;
  intrRate: number;
  intrRate2: number;
}

export interface Option2 {
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
  optionList: Option[] | Option2[] | null;
  iconInfo?: Record<string, string>;
}

export async function fetchProductDetail(
  id: string,
  token: string
): Promise<ProductDetail> {
  const res = await axios.get<ProductDetail>(
    `http://localhost:8080/api/retirement/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log;
  return res.data;
}
