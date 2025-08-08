import api from '@/api';

// 지점 정보 타입
export interface BranchInfo {
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
export interface BranchRequest {
  branchId: number;
}

export const branchApi = {
  async getMyBranch(): Promise<BranchInfo> {
    const response = await api.get('/api/user/branch');
    return response.data;
  },

  

  async setMyBranch(branchData: BranchRequest) {
    const response = await api.patch('/api/user/branch', branchData);
    return response.data;
  },
};
