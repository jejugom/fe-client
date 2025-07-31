import axios from 'axios';

// API 응답 데이터 구조에 맞게 인터페이스 정의
export interface UserInfo {
  userName: {
    email: string;
    userName: string;
  };
  assetStatus: {
    assetCategoryCode: string;
    amount: number;
  }[];
}

export interface CustomRecommendPrdt {
  finPrdtCd: string;
  score: string;
}

export interface TimeDepositOption {
  saveTrm: string | null;
  intrRate: number;
  intrRate2: number;
}

export interface TimeDeposit {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  optionList: TimeDepositOption[];
}

export interface SavingDepositOption {
  saveTrm: string;
  intrRate: number;
  intrRate2: number;
}

export interface SavingDeposit {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  optionList: SavingDepositOption[];
}

export interface MortgageLoanOption {
  mrtgTypeNm: string;
  rpayTypeNm: string;
  lendRateTypeNm: string;
  lendRateMin: string;
  lendRateMax: string;
}

export interface MortgageLoan {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  optionList: MortgageLoanOption[];
}

export interface GoldProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
}

export interface FundOption {
  rate3mon: string;
  riskGrade: string;
  priceStd: string;
}

export interface FundProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  optionList: FundOption[];
}

export interface ParsedApiResponse {
  userInfo: UserInfo[];
  customRecommendPrdt: CustomRecommendPrdt[];
  timeDeposits: TimeDeposit[];
  savingsDeposits: SavingDeposit[];
  mortgageLoan: MortgageLoan[];
  goldProducts: GoldProduct[];
  fundProducts: FundProduct[];
}

export async function fetchNohooData(
  token: string
): Promise<ParsedApiResponse> {
  const res = await axios.get<ParsedApiResponse>(
    `http://localhost:8080/api/retirement`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('Nohoo data fetched:', res.data);
  return res.data;
}
