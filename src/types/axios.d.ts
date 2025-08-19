// src/types/axios.d.ts

import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    // 여기에 우리가 추가하고 싶은 모든 커스텀 속성을 정의합니다.
    _suppressErrorAlert?: boolean; // ?를 붙여서 선택적(optional) 속성으로 만듭니다.
  }
}
