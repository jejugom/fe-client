export interface UserInfo {
  user_name: {
    email: string;
    userName: string;
  };
  asset_status: AssetStatus[];
}

export interface AssetStatus {
  assetId: number;
  email: string;
  assetCategoryCode: string;
  amount: number;
  assetName: string;
  businessType: string | null;
}

export interface CustomRecommendProduct {
  fin_prdt_cd: string;
  score: number;
}

export interface TimeDeposit {
  fin_prdt_cd: string;
  fin_prdt_nm: string;
  prdt_feature: string;
  optionList: Option[];
}

export interface Option {
  save_trm: string;
  intr_rate: number;
  intr_rate2: number;
}

export interface SavingDeposit {
  fin_prdt_cd: string;
  fin_prdt_nm: string;
  prdt_feature: string;
  optionList: Option[];
}

export interface MortgageLoan {
  fin_prdt_cd: string;
  fin_prdt_nm: string;
  prdt_feature: string;
  optionListList: OptionList[];
}

export interface OptionList {
  mrtg_type_nm: string;
  rpay_type_nm: string;
  lend_rate_type_nm: string;
  lend_rate_min: string;
  lend_rate_max: string;
}

export const api_data = {
  user_info: [
    {
      user_name: {
        email: 'skgp0628@naver.com',
        userName: '최나혜',
      },
      asset_status: [
        {
          assetId: 2,
          email: 'skgp0628@naver.com',
          assetCategoryCode: '2',
          amount: 50000000,
          assetName: 'KB Star 정기예금',
          businessType: null,
        },
      ],
    },
  ],
  customRecommend_prdt: [
    { fin_prdt_cd: 'DP010300100335', score: 0.9123 },
    { fin_prdt_cd: 'LN200300000002', score: 0.7634 },
  ],
  timeDeposits: Array.from({ length: 10 }, (_, i) => ({
    fin_prdt_cd: `DP01030010033${i}`,
    fin_prdt_nm: `KB Star 정기예금 ${i + 1}호`,
    prdt_feature: '간편가입 디지털 전용, 편리한 온라인 예금',
    optionList: [
      {
        save_trm: '6',
        intr_rate: 2.0 + i * 0.1,
        intr_rate2: 2.5 + i * 0.1,
      },
    ],
  })),
  savingDeposits: Array.from({ length: 10 }, (_, i) => ({
    fin_prdt_cd: `DP01020010005${i}`,
    fin_prdt_nm: `국민적금 안심형 ${i + 1}`,
    prdt_feature:
      i % 2 === 0
        ? '청년·신혼부부 우대금리 제공, 자유적립 가능'
        : '정액적립식, 급여이체 우대금리',
    optionList: [
      {
        save_trm: '12',
        intr_rate: 2.3 + i * 0.1,
        intr_rate2: 3.0 + i * 0.1,
      },
    ],
  })),
  mortgageLoan: Array.from({ length: 10 }, (_, i) => ({
    fin_prdt_cd: `LN20030000000${i}`,
    fin_prdt_nm: `주택담보대출 선택형 ${i + 1}`,
    prdt_feature:
      i % 2 === 0
        ? '변동금리/고정금리 중 선택 가능, DSR 우대 가능'
        : '분할상환방식, 중도상환수수료 면제 조건 제공',
    optionListList: [
      {
        mrtg_type_nm: i % 2 === 0 ? '아파트' : '다가구',
        rpay_type_nm: '분할상환방식',
        lend_rate_type_nm: i % 2 === 0 ? '변동금리' : '혼합금리',
        lend_rate_min: (3.9 + i * 0.1).toFixed(2),
        lend_rate_max: (4.6 + i * 0.1).toFixed(2),
      },
    ],
  })),
};
