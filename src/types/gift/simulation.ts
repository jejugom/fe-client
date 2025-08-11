// 백엔드 SimulationRequestDto에 대응하는 타입
export interface AssetGiftRequestDto {
  assetId: number;
  giftAmount: number;
}

export interface CategoryGiftRequestDto {
  assetCategoryCode: string;
  assets: AssetGiftRequestDto[];
}

export interface RecipientGiftRequestDto {
  recipientId: number;
  categoriesToGift: CategoryGiftRequestDto[];
}

export interface SimulationRequestDto {
  simulationList: RecipientGiftRequestDto[];
}

// 백엔드 SimulationResponseDto에 대응하는 타입
export interface RecipientTaxDetailDto {
  recipientName: string;
  totalGiftAmount: number;
  estimatedTax: number;
}

// New interface for tax saving strategies
export interface TaxSavingStrategy {
  ruleCategory: string;
  content: string;
}

export interface SimulationResponseDto {
  totalEstimatedTax: number;
  recipientDetails: RecipientTaxDetailDto[];
  taxSavingStrategies: TaxSavingStrategy[]; // Changed to new interface
}

export interface TestatorInfo {
  email: string;
  name: string;
  birth: string;
}
