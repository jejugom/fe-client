/** 수증자 요청 DTO (백엔드 RecipientRequestDto와 매칭) */
export interface RecipientRequestDto {
  relationship: string;
  recipientName: string;
  birthDate: string; // YYYY-MM-DD
  isMarried: boolean;
  hasPriorGift: boolean;
  priorGiftAmount?: number;
  giftTaxPayer: string;
}

/** 수증자 응답 DTO (백엔드 RecipientResponseDto와 매칭) */
export interface RecipientResponseDto extends RecipientRequestDto {
  recipientId: number;
  email: string;
}

/** 자산 요약 DTO (백엔드 AssetStatusSummaryDto와 매칭) */
export interface AssetStatusSummaryDto {
  assetCategoryCode: string;
  amount: number;
  // assetName: string;
}

/** 증여 페이지 응답 DTO (백엔드 GiftPageResponseDto와 매칭) */
export interface GiftPageResponseDto {
  recipients: RecipientResponseDto[];
  assetCategories: any[]; // 실제 타입에 맞게 수정 필요
}

/** 증여 시뮬레이션 요청 DTO */
export interface GiftSimulationRequest {
  recipients: {
    recipientId: number;
    giftAmount: number;
  }[];
}

/** 증여 시뮬레이션 응답 DTO */
export interface GiftSimulationResponse {
  totalGiftTax: number;
  recipientSummaries: {
    recipientId: number;
    name: string;
    giftAmount: number;
    estimatedTax: number;
  }[];
  taxSavingStrategies: string[];
}
