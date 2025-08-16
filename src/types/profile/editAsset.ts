// API 응답 형태 (백엔드 AssetStatusResponseDto와 일치)
interface AssetResponse {
  assetId: number;
  email: string;
  assetCategoryCode: string;
  amount: number;
  assetName: string;
  businessType: string | null;
}

// 자산 생성 요청 데이터 타입 (백엔드 DTO와 일치)
interface CreateAssetRequest {
  assetCategoryCode: string;
  assetName: string;
  amount: number;
  businessType?: string | null;
}

// 자산 수정 요청 데이터 타입 (백엔드 DTO와 일치)
interface UpdateAssetRequest {
  assetCategoryCode: string;
  amount: number;
  assetName: string;
  businessType?: string | null;
}

export type { AssetResponse, CreateAssetRequest, UpdateAssetRequest };
