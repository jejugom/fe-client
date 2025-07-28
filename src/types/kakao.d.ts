declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
  }

  class LatLngBounds {
    extend(latlng: LatLng): void;
    contain(latlng: LatLng): boolean;
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
    constructor(options: { map: Map; position: LatLng; image?: MarkerImage });
    setMap(map: Map | null): void;
  }

  class Map {
    constructor(
      container: HTMLElement,
      options: { center: LatLng; level: number }
    );
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    setBounds(bounds: LatLngBounds): void;
  }

  namespace event {
    function addListener(target: any, type: string, handler: () => void): void;
  }

  namespace services {
    class Places {
      keywordSearch(
        keyword: string,
        callback: (data: any[], status: string) => void,
        options?: { bounds?: LatLngBounds; location?: LatLng; radius?: number }
      ): void;
    }

    class Geocoder {
      coord2RegionCode(
        longitude: number,
        latitude: number,
        callback: (result: any[], status: string) => void
      ): void;
    }

    enum Status {
      OK = 'OK',
      ERROR = 'ERROR',
      ZERO_RESULT = 'ZERO_RESULT',
    }
  }
}
