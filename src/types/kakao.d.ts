declare namespace kakao.maps {
  /** autoload=false에서 SDK가 로드된 뒤 호출 */
  function load(callback: () => void): void;

  /** 실제 SDK가 받는 지도 옵션 */
  interface MapOptions {
    center: LatLng;
    level: number;
  }

  class LatLng {
    /** (lat, lng) 순서 */
    constructor(latitude: number, longitude: number);
  }

  class LatLngBounds {
    extend(latlng: LatLng): void;
    /** 실제 API는 contains */
    contains(latlng: LatLng): boolean;
  }

  class Point {
    constructor(x: number, y: number);
  }

  class Size {
    constructor(width: number, height: number);
  }

  interface MarkerImageOptions {
    alt?: string;
    coords?: string;
    offset?: Point;
    shape?: string;
    spriteOrigin?: Point;
    spriteSize?: Size;
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: MarkerImageOptions);
  }

  class Marker {
    /** SDK는 map 없이도 생성 가능 → map?: Map 로 정의 */
    constructor(options: { map?: Map; position: LatLng; image?: MarkerImage });
    setMap(map: Map | null): void;
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    setBounds(bounds: LatLngBounds): void;
  }

  namespace event {
    function addListener(
      target: any,
      type: string,
      handler: (...args: any[]) => void
    ): void;
  }

  namespace services {
    class Places {
      constructor(map?: Map);
      keywordSearch(
        keyword: string,
        callback: (data: any[], status: Status) => void,
        options?: { bounds?: LatLngBounds; location?: LatLng; radius?: number }
      ): void;
    }

    class Geocoder {
      coord2RegionCode(
        longitude: number,
        latitude: number,
        callback: (result: any[], status: Status) => void
      ): void;
    }

    enum Status {
      OK = 'OK',
      ERROR = 'ERROR',
      ZERO_RESULT = 'ZERO_RESULT',
    }
  }
}

type KakaoNS = typeof kakao;

declare global {
  interface Window {
    kakao?: KakaoNS;
  }
}
