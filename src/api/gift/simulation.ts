import api from '@/api';
import type {
  SimulationRequestDto,
  SimulationResponseDto,
  TestatorInfo,
} from '@/types/gift/simulation';

const API_BASE = '/api/gift/simulation';

// 증여세 시뮬레이션 실행
export async function runGiftTaxSimulation(
  requestDto: SimulationRequestDto
): Promise<SimulationResponseDto> {
  try {
    const response = await api.post<SimulationResponseDto>(
      API_BASE,
      requestDto
    );
    // console.log('증여세 시뮬레이션 응답:', response.data);
    return response.data;
  } catch (error) {
    // console.error('증여세 시뮬레이션 API 호출 실패:', error);
    throw error;
  }
}

// 유언자 정보 조회
export async function fetchWillTestator(): Promise<TestatorInfo> {
  try {
    const response = await api.get<TestatorInfo>(`${API_BASE}/will`);
    // console.log('유언자 정보 응답:', response.data);
    return response.data;
  } catch (error) {
    // console.error('유언자 정보 API 호출 실패:', error);
    throw error;
  }
}
