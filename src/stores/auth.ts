import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/**
 * 사용자 정보 타입 정의
 */
interface Member {
  userMail?: string;
  userName: string;
  password: string;
}

/**
 * 인증 상태 초기값
 * 애플리케이션 시작 시 또는 로그아웃 시 사용되는 기본 상태
 */
const initState = {
  token: '', // JWT Access Token
  refreshToken: '', // JWT Refresh Token
  user: {
    userMail: '', // 사용자 이메일
    userName: '', // 사용자 표시명 (닉네임)
    roles: [], // 사용자 권한 목록 (향후 확장용)
  },
  isNewUser: false, // 신규 회원 여부 (회원가입 완료 후 추가 정보 입력 필요 여부)
};

/**
 * 인증 상태 관리 Pinia Store
 *
 * 사용자 로그인/로그아웃, JWT 토큰 관리, 카카오 OAuth 로그인을 처리합니다.
 * 인증 상태는 sessionStorage에 저장해서 브라우저 새로고침 시에도 유지됩니다.
 * 단, 브라우저 탭을 닫으면 토큰이 초기화됩니다.
 * (로컬스토리지는 탭을 닫아도 유지가 되니까 일단 세션으로 구현)
 * 추후에 쿠키관리 방식으로 고도화
 */
export const useAuthStore = defineStore('auth', () => {
  /** 인증 상태 반응형 객체 */
  const state = ref({ ...initState });

  // === Computed Properties (상태 접근자) ===
  /** 로그인 여부 - userName이 있으면 로그인된 상태로 판단 */
  const isLogin = computed(() => !!state.value.user.userName);

  /** userMail 사용자의 이메일 */
  const userMail = computed(() => state.value.user.userMail);

  /** 로그인한 사용자의 표시명 */
  const userName = computed(() => state.value.user.userName);

  /** 신규 회원 여부 */
  const isNewUser = computed(() => state.value.isNewUser);

  // === Authentication Methods ===

  /**
   * 카카오 로그인 성공 후 토큰 정보 저장
   *
   * AuthSuccessPage에서 백엔드 리다이렉트로 받은 토큰 정보를
   * Pinia store와 sessionStorage에 저장합니다.
   *
   * @param accessToken JWT Access Token
   * @param refreshToken JWT Refresh Token
   * @param userId 사용자 이메일
   * @param userName 사용자 표시명
   * @param isNew 신규 회원 여부
   */
  function setKakaoLoginData(
    accessToken: string,
    refreshToken: string,
    userMail: string,
    userName: string,
    isNew: boolean
  ) {
    state.value = {
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        userMail: userMail,
        userName: userName,
        roles: [],
      },
      isNewUser: isNew,
    };
    sessionStorage.setItem('auth', JSON.stringify(state.value));
    sessionStorage.setItem('userMail', userMail);
    sessionStorage.setItem('userName', userName);
  }

  /**
   * 카카오 로그인 시작
   *
   * 카카오 OAuth 인증 페이지로 리다이렉트합니다.
   * 사용자가 카카오에서 로그인하면 백엔드 콜백 URL로 인가 코드가 전송됩니다.
   */
  let kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY;
  let kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  function startKakaoLogin(nextRouteName?: string) {
    /** 인가코드 전달은 백엔드로 보냄. */
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    let kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(
      kakaoRedirectUri
    )}&response_type=code`;

    if (nextRouteName) {
      kakaoAuthUrl += `&state=${encodeURIComponent(nextRouteName)}`; // Using 'state' parameter to pass the next route
    }
    window.location.href = kakaoAuthUrl;
  }

  /**
   * 로그아웃 처리
   *
   * sessionStorage에서 인증 정보를 제거하고 상태를 초기화합니다.
   * 서버측 로그아웃 API 호출은 별도로 처리해야 합니다.
   */
  function logout() {
    sessionStorage.removeItem('auth');
    state.value = { ...initState };
  }

  /**
   * 현재 저장된 Access Token 반환
   * API 요청 시 Authorization 헤더에 사용됩니다.
   */
  function getToken() {
    return state.value.token;
  }

  /**
   * Access Token 업데이트
   * 토큰 재발급 시 새로운 토큰으로 상태를 갱신합니다.
   */
  function setToken(token: string) {
    state.value.token = token;
    sessionStorage.setItem('auth', JSON.stringify(state.value));
  }

  /**
   * sessionStorage에서 인증 상태 복원
   *
   * 브라우저 새로고침이나 페이지 재방문 시 이전 로그인 상태를 복원합니다.
   * store 초기화 시 자동으로 호출됩니다.
   */
  function load() {
    const auth = sessionStorage.getItem('auth');
    if (auth != null) {
      state.value = JSON.parse(auth);
      // console.log('Auth state loaded:', state.value);
    }
  }

  /**
   * 사용자 프로필 정보 업데이트
   * (향후 확장용 - 현재는 이메일 변경만 지원)
   */
  function changeProfile(member: Partial<Member>) {
    if (member.userMail) {
      state.value.user.userMail = member.userMail;
      sessionStorage.setItem('auth', JSON.stringify(state.value));
    }
  }

  // === Store 초기화 ===
  // sessionStorage에서 기존 인증 상태 복원
  load();

  // === 외부로 노출할 API ===
  return {
    state,
    userMail,
    userName,
    isLogin,
    isNewUser,
    changeProfile,
    startKakaoLogin,
    setKakaoLoginData,
    logout,
    getToken,
    setToken,
  };
});
