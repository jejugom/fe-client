export type ProductType = '1' | '2' | '3';

export interface ProductDetail {
  finPrdtCd: string;
  finPrdtCategory: ProductType;
  finPrdtNm: string;
  description: string;
  recReason: string;
  korCoNm?: string;
  prdtFeature?: string;
  joinWay?: string;
  mtrtInt?: string;
  spclCnd?: string;
  joinDeny?: '1' | '2' | '3';
  joinMember?: string;
  etcNote?: string;
  maxLimit?: string;
  tendency?: number;
  iconInfo?: Record<string, string>;

  // 옵션 리스트 (상품 타입에 따라 분기)
  optionList?: DepositOption[] | SavingOption[];
  optionListList?: MortgageOption[];

  // 주택담보 관련 전용 필드
  loan_inci_expn?: string;
  erly_rpay_fee?: string;
  dly_rate?: string;
  loan_lmt?: string;
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
  finPrdtCd: 'DP010300100335',
  finPrdtCategory: '1',
  finPrdtNm: 'KB Star 정기예금 12개월',
  recReason: '금리가 높고 디지털 가입 가능',
  korCoNm: '국민은행',
  prdtFeature: '간편가입 디지털 전용 예금 상품',
  description: '인터넷뱅킹을 통해 간편하게 가입 가능한 정기예금 상품입니다.',
  joinWay: '인터넷, 모바일, 영업점',
  mtrtInt: '0.3%',
  spclCnd: '급여이체 및 마케팅 수신 동의 시 우대금리 제공',
  joinDeny: '1',
  joinMember: '개인',
  etcNote: '중도 해지 시 약정 이율 미적용',
  maxLimit: '5000만원',
  tendency: 0.78,
  optionList: [
    {
      save_trm: '12',
      intr_rate: 2.5,
      intr_rate2: 3.1,
    },
  ],
};
