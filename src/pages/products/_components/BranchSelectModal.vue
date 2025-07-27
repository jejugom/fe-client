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
      class="bg-secondary-100 my-2 w-full p-2 text-sm text-red-500"
    >
      {{ errorMessage }}
    </div>

    <div v-if="selectedBranch" class="bg-secondary-100 my-2 w-full p-2">
      선택한 지점:
      <span class="text-secondary-500 font-semibold">
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
const emit = defineEmits<{
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
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const locPosition = new kakao.maps.LatLng(lat, lng);

    // 지도 초기화
    map = new kakao.maps.Map(document.getElementById('map') as HTMLElement, {
      center: locPosition,
      level: 3,
    });

    currentCenter = locPosition;

    // 현재 위치 마커 표시
    const marker = new kakao.maps.Marker({
      map,
      position: locPosition,
    });
    markers.value.push(marker);

    // 지도 중심 변경 감지
    kakao.maps.event.addListener(map, 'dragend', () => {
      currentCenter = map.getCenter();
    });

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        currentAddress.value = result[0].address_name;
        searchQuery.value = result[0].region_2depth_name || '';
        searchPlaces();
      }
    });
  });
});
</script>
