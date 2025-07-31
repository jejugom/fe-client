import axios from 'axios';

import { useAuthStore } from '@/stores/auth';
import router from '@/router';

/**
 * API 클라이언트 Axios 인스턴스
 * 
 * 백엔드 API 통신을 위한 설정된 axios 인스턴스입니다.
 * 자동 JWT 토큰 첨부, 토큰 만료 시 자동 갱신, 인증 오류 처리 등을 담당합니다.
 */
const instance = axios.create({
  timeout: 30000, // 30초 타임아웃 (CODEF API 등 외부 API 호출 고려)
  // Vite 프록시를 통해 /api 요청을 백엔드로 전달
  // 개발환경에서는 Vite 프록시가 localhost:8080으로 포워딩
  baseURL: import.meta.env.DEV ? '' : 'http://localhost:8080',
});

/**
 * 요청 인터셉터
 * 
 * 모든 API 요청에 자동으로 Authorization 헤더를 추가합니다.
 * sessionStorage에 저장된 JWT 토큰을 Bearer 형식으로 헤더에 포함시킵니다.
 */
instance.interceptors.request.use(
  (config) => {
    // auth store에서 현재 저장된 토큰 가져오기
    const { getToken } = useAuthStore();
    const token = getToken();
    
    if (token) {
      // 토큰이 있으면 Authorization 헤더에 Bearer 토큰 형식으로 추가
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 설정 중 오류 발생 시 처리
    return Promise.reject(error);
  }
);
/**
 * 응답 인터셉터
 * 
 * API 응답을 처리하고, 인증 오류 발생 시 자동으로 토큰 갱신을 시도합니다.
 * JWT 토큰이 만료되어 401 오류가 발생하면 Refresh Token으로 새 토큰을 발급받고
 * 원래 요청을 재시도합니다.
 */
instance.interceptors.response.use(
  (response) => {
    // 성공 응답 처리
    if (response.status === 200) {
      return response;
    }
    if (response.status === 404) {
      return Promise.reject('404: 페이지 없음 ' + response.request);
    }
    return response;
  },
  async (error) => {
    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      try {
        const authStore = useAuthStore();
        const refreshToken = authStore.state.refreshToken;
        
        // Refresh Token이 없으면 로그아웃 처리
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // 백엔드 토큰 재발급 API 호출
        const { data } = await axios.post('http://localhost:8080/auth/refresh', {
          refreshToken: refreshToken
        });
        
        // 새 Access Token 저장
        authStore.setToken(data.accessToken);
        
        // 새 Refresh Token이 있다면 업데이트 (Refresh Token Rotation)
        if (data.refreshToken) {
          authStore.state.refreshToken = data.refreshToken;
          sessionStorage.setItem('auth', JSON.stringify(authStore.state));
        }

        // 실패했던 원래 요청을 새 토큰으로 재시도
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return instance.request(error.config);
        
      } catch {
        // Refresh Token도 만료되었거나 재발급 실패 시 로그아웃
        const { logout } = useAuthStore();
        logout();
        router.push({ name: 'home' });
        return Promise.reject(error);
      }
    }
    
    // 다른 HTTP 오류는 그대로 전파
    return Promise.reject(error);
  }
);

/** 설정된 axios 인스턴스를 기본 내보내기 */
export default instance;
