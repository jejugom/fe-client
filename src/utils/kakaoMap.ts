let _loadPromise: Promise<void> | null = null;

/** Kakao JS SDK 1회 로드 */
export function loadKakaoMaps(
  appKey = import.meta.env.VITE_KAKAO_MAP_KEY
): Promise<void> {
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<void>((resolve) => {
    if (!appKey) {
      console.warn('[kakaoMap] VITE_KAKAO_MAP_KEY가 설정되지 않았습니다.');
      resolve();
      return;
    }
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const s = document.createElement('script');
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services`;
    s.onload = () => (window.kakao!.maps as any).load(() => resolve());
    s.onerror = () => {
      console.error('[kakaoMap] SDK 로드 실패');
      resolve();
    };
    document.head.appendChild(s);
  });

  return _loadPromise;
}

/** 지도가 viewport에 들어올 때만 초기화 */
export function whenInView(
  el: Element,
  cb: () => void,
  rootMargin = '120px'
): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          cb();
          io.disconnect();
        }
      });
    },
    { rootMargin }
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Map/Places/Geocoder 팩토리 */
export function createMap(
  container: HTMLElement,
  options: kakao.maps.MapOptions
) {
  return new window.kakao!.maps.Map(container, options);
}

export function createPlaces(map?: kakao.maps.Map) {
  // 생성자 시그니처가 런타임/타입 정의와 섞여 오류나는 걸 회피
  return new (window.kakao!.maps.services.Places as any)(
    map
  ) as kakao.maps.services.Places;
}

export function createGeocoder() {
  return new window.kakao!.maps.services.Geocoder();
}

/** 디바운스/쓰로틀 */
export const debounce = <T extends (...a: any[]) => any>(fn: T, wait = 350) => {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
};

export const throttle = <T extends (...a: any[]) => any>(fn: T, gap = 300) => {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last > gap) {
      last = now;
      fn(...args);
    }
  };
};

/** 현재 위치 Promise */
export function getCurrentPosition(options?: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!('geolocation' in navigator))
      return reject(new Error('geolocation not supported'));
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/** ATM/지급기 제거 필터 */
export function isBankBranch(name: string) {
  const bad = /(ATM|현금|지급기)/;
  return !bad.test(name);
}

/** 마커 유틸 */
export function clearMarkers(markers: kakao.maps.Marker[]) {
  markers.forEach((m) => m.setMap(null));
  markers.length = 0;
}

export function makeMarker(opts: {
  map: kakao.maps.Map;
  lat: number;
  lng: number;
  imageUrl?: string;
  imageSize?: { w: number; h: number };
}) {
  const { map, lat, lng, imageUrl, imageSize } = opts;
  const pos = new window.kakao!.maps.LatLng(lat, lng);
  const image = imageUrl
    ? new window.kakao!.maps.MarkerImage(
        imageUrl,
        new window.kakao!.maps.Size(imageSize?.w ?? 40, imageSize?.h ?? 40),
        {
          offset: new window.kakao!.maps.Point(
            (imageSize?.w ?? 40) / 2,
            imageSize?.h ?? 40
          ),
        }
      )
    : undefined;

  // 생성 시 map 없이 만들고, setMap으로 올려도 동작합니다.
  const marker = new window.kakao!.maps.Marker({ position: pos, image });
  marker.setMap(map);
  return marker;
}

/** 키워드 검색 (옵션: bounds or location/radius) */
export function keywordSearch(
  ps: kakao.maps.services.Places,
  keyword: string,
  options?: {
    bounds?: kakao.maps.LatLngBounds;
    location?: kakao.maps.LatLng;
    radius?: number;
  }
) {
  return new Promise<any[]>((resolve) => {
    (ps.keywordSearch as any)(
      keyword,
      (data: any[], status: kakao.maps.services.Status) => {
        if (status === window.kakao!.maps.services.Status.OK) resolve(data);
        else resolve([]); // 실패 시 빈 배열
      },
      options?.bounds
        ? { bounds: options.bounds }
        : options?.location
          ? { location: options.location, radius: options.radius ?? 2000 }
          : {}
    );
  });
}

/** 좌표 → 행정구역 */
export function coord2Region(lng: number, lat: number) {
  return new Promise<any>((resolve) => {
    createGeocoder().coord2RegionCode(lng, lat, (result: any, status: any) => {
      if (status === window.kakao!.maps.services.Status.OK && result[0])
        resolve(result[0]);
      else resolve(null);
    });
  });
}

export type Place = { place_name: string; x: string; y: string; id?: string };
export type SearchOpts = {
  bounds?: kakao.maps.LatLngBounds;
  location?: kakao.maps.LatLng;
  radius?: number;
  sort?: string;
};
