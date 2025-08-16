import api from '@/api';
import type { BranchInfo, BranchRequest } from '@/types/user/branch';

// 지점 관리 API 함수들
export const branchApi = {
  /**
   * 내 지점 정보 조회
   * @returns 현재 설정된 지점 정보
   */
  async getMyBranch(): Promise<BranchInfo> {
    const response = await api.get('/api/user/branch');
    return response.data;
  },

  /**
   * 내 지점 설정
   * @param branchData 설정할 지점 정보
   * @returns 설정 결과
   */
  async setMyBranch(branchData: BranchRequest) {
    const response = await api.patch('/api/user/branch', branchData);
    return response.data;
  },
};
