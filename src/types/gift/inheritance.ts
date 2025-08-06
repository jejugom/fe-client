export interface Asset {
  id: string;
  name: string;
  value: number;
  selected: boolean;
  beneficiary?: Beneficiary | null;
  isMultipleBeneficiaries?: boolean;
  distributionRatios?: { [beneficiaryId: string]: number };
  [key: string]: any;
}

export interface Beneficiary {
  id: string;
  name: string;
  relation: string;
}

export interface DistributedAsset {
  category: string;
  description: string;
  recipient: {
    name: string;
    relation: string;
  };
  amount: number;
}

export interface RecipientSummary {
  recipientId: number; // recipientId 추가
  name: string;
  giftAmount: number;
  estimatedTax: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface RecipientResponseDto {
  recipientId: number;
  recipientName: string;
  relationship: string;
}

export interface AssetStatusSummaryDto {
  assetCategoryCode: string;
  amount: number;
}
