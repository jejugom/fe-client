<template>
  <div>
    <div class="mb-4">현재 위치: {{ currentAddress }}</div>
    <div class="flex items-center gap-1">
      <InputBox
        placeholder="지점 입력(예: 광진구)"
        size="medium"
        type="text"
        v-model="searchQuery"
      />
      <Btn color="primary" label="검색" size="square" @click="searchPlaces" />
    </div>

    <div v-if="selectedBranch" class="bg-secondary-100 my-2 w-full p-2">
      선택한 지점:
      <span class="text-secondary-500 text-base font-semibold">{{
        selectedBranch
      }}</span>
    </div>

    <div id="map" class="stroke-secondary mt-4 h-96 w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';

const searchQuery = ref('');
const currentAddress = ref('');
const selectedBranch = ref('');
let map: kakao.maps.Map;

const emit = defineEmits<{
  (e: 'select', branch: string): void;
}>();

// 부모가 선택 버튼 누를 때 사용할 함수 공개
defineExpose({
  getSelectedBranch: () => selectedBranch.value,
});

const searchPlaces = () => {
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(`국민은행 ${searchQuery.value}`, (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new kakao.maps.LatLngBounds();
      data.forEach((place) => {
        const pos = new kakao.maps.LatLng(Number(place.y), Number(place.x));
        const marker = new kakao.maps.Marker({ map, position: pos });

        kakao.maps.event.addListener(marker, 'click', () => {
          selectedBranch.value = place.place_name;
        });

        bounds.extend(pos);
      });
      map.setBounds(bounds);
    }
  });
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
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        currentAddress.value = result[0].address_name;
        searchQuery.value = result[0].address_name || '';
        searchPlaces();
      }
    });
  });
});
</script>
