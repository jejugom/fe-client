export {};

declare global {
  interface Window {
    kakao: typeof kakao;
  }

  namespace kakao {
    namespace maps {
      function load(callback: () => void): void;
      class LatLng {
        constructor(lat: number, lng: number);
      }

      class LatLngBounds {
        extend(latlng: LatLng): void;
      }

      class Map {
        constructor(
          container: HTMLElement,
          options: {
            center: LatLng;
            level: number;
          }
        );
        setBounds(bounds: LatLngBounds): void;
      }

      class Marker {
        constructor(options: { map: Map; position: LatLng });
      }

      namespace services {
        class Places {
          keywordSearch(
            keyword: string,
            callback: (data: KakaoPlace[], status: string) => void
          ): void;
        }

        class Geocoder {
          coord2RegionCode(
            x: number,
            y: number,
            callback: (result: any, status: string) => void
          ): void;
        }

        enum Status {
          OK = 'OK',
          ERROR = 'ERROR',
        }
      }

      namespace event {
        function addListener(
          target: any,
          type: string,
          handler: () => void
        ): void;
      }
    }
  }

  interface KakaoPlace {
    x: string;
    y: string;
    place_name: string;
    [key: string]: any;
  }
}
