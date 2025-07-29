export type ProductType = '1' | '2' | '3';

// src/api/products/productDetail.ts
export interface ProductDetail {
  fin_prdt_cd: string;
  fin_prdt_category: string; // ProductType → string 으로 완화
  fin_prdt_nm: string;
  prdt_feature: string;
  description: string;
  rec_reason: string;
  icon_info?: Record<string, string>;
  kor_co_nm?: string;
  join_way?: string;
  mtrt_int?: string;
  spcl_cnd?: string;
  join_deny?: string;
  join_member?: string;
  etc_note?: string;
  max_limit?: string;
  tendency?: number;

  optionList?: {
    save_trm: string;
    intr_rate: number;
    intr_rate2: number;
  }[];

  optionListList?: {
    mrtg_type_nm: string;
    rpay_type_nm: string;
    lend_rate_type_nm: string;
    lend_rate_min: string;
    lend_rate_max: string;
  }[];
}

export interface DepositOption {
  save_trm: string; // 저축 기간 [개월]
  intr_rate: number;
  intr_rate2: number;
}

export interface SavingOption {
  intr_rate_type_nm: string;
  rsrv_type_nm: string;
  save_trm: string; // 저축 기간 [개월]
  intr_rate: number;
  intr_rate2: number;
}

export interface MortgageOption {
  mrtg_type_nm: string;
  rpay_type_nm: string;
  lend_rate_type_nm: string;
  lend_rate_min: number;
  lend_rate_max: number;
  lend_rate_avg: number;
}

export const api_data: ProductDetail = {
  fin_prdt_cd: 'DP010300100335',
  fin_prdt_category: '1',
  fin_prdt_nm: 'KB Star 정기예금 12개월',
  rec_reason: '금리가 높고 디지털 가입 가능',
  kor_co_nm: '국민은행',
  prdt_feature: '간편가입 디지털 전용 예금 상품',
  description: '인터넷뱅킹을 통해 간편하게 가입 가능한 정기예금 상품입니다.',
  join_way: '인터넷, 모바일, 영업점',
  mtrt_int: '0.3%',
  spcl_cnd: '급여이체 및 마케팅 수신 동의 시 우대금리 제공',
  join_deny: '1',
  join_member: '개인',
  etc_note: '중도 해지 시 약정 이율 미적용',
  max_limit: '5000만원',
  tendency: 0.78,
  optionList: [
    {
      save_trm: '12',
      intr_rate: 2.5,
      intr_rate2: 3.1,
    },
  ],
};
