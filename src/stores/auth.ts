import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import api from '@/api/index'; // 설정된 axios 인스턴스

/**
 * 인증 상태 초기값
 */
const initState = {
  user: {
    userMail: '',
    userName: '',
    roles: [],
  },
  isNewUser: false,
};

/**
 * 인증 상태 관리 Pinia Store (HttpOnly 쿠키 방식)
 */
export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });

  // === Computed Properties ===
  const isLogin = computed(() => !!state.value.user.userName);
  const userMail = computed(() => state.value.user.userMail);
  const userName = computed(() => state.value.user.userName);
  const isNewUser = computed(() => state.value.isNewUser);

  // === Authentication Methods ===

  /**
   * 카카오 로그인 성공 후 사용자 정보 저장
   */
  const setKakaoLoginData = (
    userMail: string,
    userName: string,
    isNew: boolean
  ) => {
    state.value.user = {
      userMail: userMail,
      userName: userName,
      roles: [],
    };
    state.value.isNewUser = isNew;
  };

  /**
   * 카카오 로그인 시작
   */
  const startKakaoLogin = (nextRouteName?: string) => {
    // [수정] 카카오 OAuth 인증 페이지로 직접 리다이렉트합니다.
    // YOUR_KAKAO_CLIENT_ID 부분은 실제 카카오 앱의 REST API 키로 변경해야 합니다.
    const KAKAO_CLIENT_ID = '3915e266f2340851e307cca982620137'; // 실제 값으로 변경
    const REDIRECT_URI = 'http://localhost:8080/auth/kakao/callback';

    let kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    if (nextRouteName) {
      kakaoAuthUrl += `&state=${encodeURIComponent(nextRouteName)}`;
    }
    window.location.href = kakaoAuthUrl;
  };

  /**
   * 로그아웃 처리
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 중 오류 발생:', error);
    } finally {
      // 이 함수의 유일한 책임은 상태를 리셋하는 것입니다.
      state.value = { ...initState };
    }
  };

  /**
   * 앱 초기화 시 인증 상태 확인
   */
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/profile', {
        _suppressErrorAlert: true,
      });
      const userProfile = response.data;
      if (userProfile && userProfile.email) {
        setKakaoLoginData(userProfile.email, userProfile.displayName, false);
      }
    } catch (error) {
      state.value = { ...initState };
      console.log('세션이 유효하지 않습니다.');
    }
  };

  // === 외부로 노출할 API ===
  return {
    state,
    userMail,
    userName,
    isLogin,
    isNewUser,
    startKakaoLogin,
    setKakaoLoginData,
    logout,
    checkAuthStatus,
  };
});
