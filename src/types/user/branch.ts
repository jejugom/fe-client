// 지점 정보 타입
interface BranchInfo {
  branchName: string;
  branchPhone: string;
  addressName: string;
  roadAddressName: string;
  x: string;
  y: string;
  distance: string;
  branchId: number; // 추가된 필드
}

// 지점 설정 요청 데이터 타입 (백엔드 DTO와 일치)
interface BranchRequest {
  branchId: number;
}

export type { BranchInfo, BranchRequest };
