<template>
  <!-- guno: featured from wina's branch select modal -->

  <!-- 현재 위치 표시 -->
  <div class="mb-8">
    <h2 class="text-primary-300 mb-2 text-2xl font-bold">
      나의 국민은행 지점 설정
    </h2>
    <p class="text-surface-500 font-semibold"
      >현재 위치: {{ currentAddress }}</p
    >
  </div>

  <!-- 검색 영역 -->
  <div class="flex flex-col">
    <div class="mb-6 flex items-center gap-2">
      <InputBox
        placeholder="지점 입력 (예: 광진구)"
        size="medium"
        type="text"
        class="flex-1"
        v-model="searchQuery"
      />
      <Btn @click="searchPlaces" color="primary" label="검색" size="small" />
    </div>

    <!-- 선택된 지점 표시 -->
    <div
      v-if="selectedBranch"
      class="bg-secondary-100 mb-4 w-full rounded-lg p-3"
    >
      선택한 지점:
      <span class="text-secondary-500 ml-2 text-base font-semibold">{{
        selectedBranch
      }}</span>
    </div>

    <!-- 지도 영역 -->
    <div id="map" class="stroke-secondary mb-8 h-96 w-full rounded-lg"></div>
  </div>

  <!-- 하단 버튼 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <Btn
      @click="handleComplete"
      color="primary"
      label="완료하기"
      size="large"
      :disabled="!selectedBranch"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';

interface KakaoPlace {
  place_name: string;
  x: string;
  y: string;
}

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const currentAddress = ref('');
const selectedBranch = ref('');
let map: kakao.maps.Map;

const searchPlaces = () => {
  const ps = new kakao.maps.services.Places();

  ps.keywordSearch(
    `국민은행 ${searchQuery.value}`,
    (data: KakaoPlace[], status: string) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();

        data.forEach((place: KakaoPlace) => {
          const pos = new kakao.maps.LatLng(Number(place.y), Number(place.x));
          const marker = new kakao.maps.Marker({ map, position: pos });

          kakao.maps.event.addListener(marker, 'click', () => {
            selectedBranch.value = place.place_name;
          });

          bounds.extend(pos);
        });

        map.setBounds(bounds);
      }
    }
  );
};

const handleComplete = async () => {
  try {
    if (!selectedBranch.value) {
      alert('지점을 선택해주세요.');
      return;
    }

    // TODO: API 호출하여 지점 정보 업데이트
    console.log('선택된 지점:', selectedBranch.value);

    // 쿼리 파라미터에 따라 다른 페이지로 이동
    if (route.query.from === 'profile') {
      router.push({ name: 'profile' });
    } else {
      router.push({ name: 'asset-signup-complete' });
    }
  } catch (error) {
    console.error('지점 업데이트 실패:', error);
  }
};

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const locPosition = new kakao.maps.LatLng(lat, lng);

    map = new kakao.maps.Map(document.getElementById('map') as HTMLElement, {
      center: locPosition,
      level: 3,
    });

    new kakao.maps.Marker({ map, position: locPosition });

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(lng, lat, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        currentAddress.value = result[0].address_name;
        searchQuery.value = result[0].address_name || '';
        searchPlaces();
      }
    });
  });
});
</script>

<style scoped></style>
