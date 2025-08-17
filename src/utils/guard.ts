import { useAuthStore } from '@/stores/auth';
export function isAuthenticated(to: any) {
  const auth = useAuthStore();
  if (!auth.isLogin) {
    if (window.confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
      auth.startKakaoLogin(to.name as string);
      return false; // Prevent current navigation and let Kakao login handle redirection
    }
    return false;
  }
  return true;
}
