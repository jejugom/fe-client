import axios from 'axios';

export interface Option {
  save_trm: string;
  intr_rate_type_nm: string;
  intr_rate: number;
  intr_rate2: number;
}

export interface ProductDetail {
  fin_prdt_cd: string;
  fin_prdt_category: string;
  fin_prdt_nm: string;
  rec_reason: string | null;
  kor_co_nm: string;
  prdt_feature: string;
  description: string;
  join_way: string;
  mtrt_int: string;
  spcl_cnd: string;
  join_deny: string;
  join_member: string;
  etc_note: string;
  max_limit: number | null;
  tendency: string | null;
  option_list: Option[];
  icon_info?: Record<string, string>;
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
