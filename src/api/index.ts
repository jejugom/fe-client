import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000,
  // 쿠키를 자동으로 주고받기 위한 핵심 설정
  withCredentials: true,
});

/**
 * 응답 인터셉터
 * * API 응답을 처리하고, 인증 오류 발생 시 자동으로 토큰 갱신을 시도합니다.
 * HttpOnly 쿠키 방식을 사용하므로, 프론트엔드는 토큰 값을 직접 다루지 않습니다.
 */
instance.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환합니다.
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러가 발생했고, 이전에 재시도한 적이 없는 경우에만 토큰 갱신을 시도합니다.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정 (무한 루프 방지)

      try {
        // 백엔드에 토큰 재발급을 요청합니다.
        // 요청 본문은 비어있으며, 브라우저가 자동으로 refreshToken 쿠키를 전송합니다.
        await instance.post('/auth/refresh');

        // 토큰 재발급이 성공하면, 원래 실패했던 요청을 다시 시도합니다.
        // 브라우저는 이미 백엔드로부터 받은 새 쿠키로 교체한 상태입니다.
        return instance(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급도 실패한 경우 (refreshToken 만료 등)
        // 사용자를 로그아웃 처리하고 로그인 페이지로 보냅니다.
        const authStore = useAuthStore();
        authStore.logout(); // Pinia 스토어의 사용자 상태 초기화
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        router.push({ name: 'login' }); // 로그인 페이지의 라우트 이름으로 변경

        return Promise.reject(refreshError);
      }
    }

    // 401 에러가 아니거나, 이미 재시도한 요청은 그대로 에러를 반환합니다.
    return Promise.reject(error);
  }
);

export default instance;
