<template>
  <div>
    <div class="mb-4">현재 위치: {{ currentAddress }}</div>

    <div class="flex items-center gap-1">
      <InputBox
        placeholder="지역 입력 (예: 광진구)"
        size="large"
        type="text"
        v-model="searchQuery"
      />
      <Btn color="primary" label="검색" size="square" @click="searchPlaces" />
    </div>
    <Btn
      v-if="mapMoved"
      class="mt-2"
      color="primary"
      label="현 지도 범위에서 검색하기"
      @click="searchCurrentMap"
    />

    <div
      v-if="errorMessage"
      class="stroke-secondary bg-secondary-100 my-2 w-full rounded-lg p-4 text-red-300"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="selectedBranch"
      class="stroke-secondary bg-secondary-100 my-2 w-full rounded-lg p-4"
    >
      선택한 지점:
      <span class="font-semibold">
        {{ selectedBranch }}
      </span>
    </div>

    <div id="map-wrapper" class="relative mt-4 h-64 w-full">
      <div id="map" class="h-full w-full"></div>

      <!-- 우측 상단 고정 버튼 -->
      <Btn
        label="현 지도에서 검색"
        size="small"
        color="primary"
        class="stroke-primary absolute top-2 right-2 z-10 w-28"
        @click="searchCurrentMap"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';

const searchQuery = ref('');
const currentAddress = ref('');
const selectedBranch = ref('');
const errorMessage = ref('');
const markers = ref<kakao.maps.Marker[]>([]);
let map: kakao.maps.Map;
let currentCenter: kakao.maps.LatLng;

// 이벤트 전달용
defineEmits<{
  (e: 'select', branch: string): void;
}>();

defineExpose({
  getSelectedBranch: () => selectedBranch.value,
});

// 마커 초기화
const clearMarkers = () => {
  markers.value.forEach((m) => m.setMap(null));
  markers.value = [];
};

// 검색 실행
const searchPlaces = () => {
  clearMarkers();
  selectedBranch.value = '';
  errorMessage.value = '';

  if (
    searchQuery.value.trim().length > 0 &&
    searchQuery.value.trim().length < 2
  ) {
    errorMessage.value = '두 글자 이상 입력해주세요.';
    return;
  }

  const ps = new kakao.maps.services.Places();
  const keyword = searchQuery.value.trim()
    ? `국민은행 ${searchQuery.value}`
    : '국민은행';

  const options = searchQuery.value.trim()
    ? {} // 사용자가 입력했으면 전체 영역 검색
    : { bounds: map.getBounds() }; // 빈 입력이면 현재 지도 범위만

  (ps.keywordSearch as any)(
    keyword,
    (data: any[], status: kakao.maps.services.Status) => {
      if (status === kakao.maps.services.Status.OK && data.length > 0) {
        // 필터링 적용 (ATM/지급기 제거)
        const filtered = data.filter((place: any) => {
          const name = place.place_name;
          const isAtm =
            name.includes('ATM') ||
            name.includes('현금') ||
            name.includes('지급기');
          return !isAtm;
        });

        if (filtered.length === 0) {
          errorMessage.value = '검색 결과가 없습니다.';
          return;
        }

        const newBounds = new kakao.maps.LatLngBounds();

        filtered.forEach((place: any) => {
          const latlng = new kakao.maps.LatLng(place.y, place.x);
          const isGolden = place.place_name.includes('골든라이프');

          const markerImage = isGolden
            ? new kakao.maps.MarkerImage(
                '/images/golden-marker.png',
                new kakao.maps.Size(40, 40),
                { offset: new kakao.maps.Point(20, 40) }
              )
            : undefined;

          const marker = new kakao.maps.Marker({
            map,
            position: latlng,
            image: markerImage,
          });

          kakao.maps.event.addListener(marker, 'click', () => {
            selectedBranch.value = place.place_name;
          });

          markers.value.push(marker);
          newBounds.extend(latlng);
        });

        map.setBounds(newBounds);
      } else {
        errorMessage.value = '검색 결과가 없습니다.';
      }
    },
    options
  );
};

const mapMoved = ref(false); // 지도 이동 여부

// 카카오 지도 중심 기준 검색
const searchCurrentMap = () => {
  if (!map) return;

  const bounds = map.getBounds();
  const center = map.getCenter();
  const ps = new kakao.maps.services.Places();

  clearMarkers();
  errorMessage.value = '';
  selectedBranch.value = '';

  (ps.keywordSearch as any)(
    '국민은행',
    (data: any[], status: kakao.maps.services.Status) => {
      if (status === kakao.maps.services.Status.OK && data.length > 0) {
        const filtered = data.filter((place: any) => {
          const name = place.place_name;
          const isAtm =
            name.includes('ATM') ||
            name.includes('현금') ||
            name.includes('지급기');
          const latlng = new kakao.maps.LatLng(place.y, place.x);
          return !isAtm && bounds.contain(latlng);
        });

        if (filtered.length === 0) {
          errorMessage.value = '현 지도 범위 내 검색 결과가 없습니다.';
          return;
        }

        const newBounds = new kakao.maps.LatLngBounds();
        filtered.forEach((place: any) => {
          const latlng = new kakao.maps.LatLng(place.y, place.x);
          const marker = new kakao.maps.Marker({ map, position: latlng });

          kakao.maps.event.addListener(marker, 'click', () => {
            selectedBranch.value = place.place_name;
          });

          markers.value.push(marker);
          newBounds.extend(latlng);
        });

        map.setBounds(newBounds);
        mapMoved.value = false; // 다시 숨김
      } else {
        errorMessage.value = '검색 결과가 없습니다.';
      }
    },
    {
      location: center,
      radius: 2000, // 2km 반경
    }
  );
};

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // 성공 시 기존 로직 유지
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const locPosition = new kakao.maps.LatLng(lat, lng);

      map = new kakao.maps.Map(document.getElementById('map') as HTMLElement, {
        center: locPosition,
        level: 3,
      });

      currentCenter = locPosition;

      const marker = new kakao.maps.Marker({
        map,
        position: locPosition,
      });
      markers.value.push(marker);

      kakao.maps.event.addListener(map, 'dragend', () => {
        currentCenter = map.getCenter();
        mapMoved.value = true;
      });

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(lng, lat, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          currentAddress.value = result[0].address_name;
          searchQuery.value = result[0].region_2depth_name || '';
          searchPlaces();
        } else {
          // 주소를 가져오지 못해도 지도 자체는 표시되도록 함
          errorMessage.value = '현재 위치의 주소를 가져올 수 없습니다.';
          searchPlaces(); // 주소 없이도 검색 시도 (예: 기본값 '국민은행'으로)
        }
      });
    },
    (error) => {
      console.error('위치 정보를 가져올 수 없습니다:', error);
      let userMessage = '';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          // code: 1 - 사용자가 위치 권한을 거부함
          userMessage =
            '위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.';
          break;
        case error.POSITION_UNAVAILABLE:
          // code: 2 - 위치 정보를 사용할 수 없음 (GPS/Wi-Fi 신호 문제 등)
          userMessage =
            '현재 위치 정보를 찾을 수 없습니다. (GPS/네트워크 상태를 확인해주세요)';
          break;
        case error.TIMEOUT:
          // code: 3 - 위치 정보를 가져오는 데 시간 초과
          userMessage =
            '위치 정보를 가져오는 데 시간이 초과되었습니다. 다시 시도해주세요.';
          break;
        default:
          userMessage = '알 수 없는 이유로 현재 위치를 가져올 수 없습니다.';
      }
      errorMessage.value = userMessage;

      // 위치 정보를 가져오지 못했을 때의 폴백 처리
      // 예를 들어, 지도를 서울의 특정 위치로 초기화
      const defaultLocPosition = new kakao.maps.LatLng(37.5665, 126.978); // 서울 시청
      map = new kakao.maps.Map(document.getElementById('map') as HTMLElement, {
        center: defaultLocPosition,
        level: 3,
      });
      currentCenter = defaultLocPosition;

      // 지도 이동 감지 리스너는 계속 추가
      kakao.maps.event.addListener(map, 'dragend', () => {
        currentCenter = map.getCenter();
        mapMoved.value = true;
      });

      // 기본 검색 실행 또는 사용자에게 검색 유도
      searchPlaces(); // '국민은행' 또는 빈 값으로 기본 검색 실행
    }
  );
});
</script>
