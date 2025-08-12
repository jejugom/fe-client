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
      <Btn color="primary" label="검색" size="square" @click="onSearchClick" />
    </div>
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
      선택한 지점: <span class="font-semibold">{{ selectedBranch }}</span>
    </div>

    <div
      id="map-wrapper"
      class="stroke-secondary relative mt-4 h-64 w-full rounded-lg"
    >
      <div ref="mapEl" class="h-full w-full"></div>

      <Btn
        label="현 지도에서 검색"
        size="small"
        color="primary"
        class="stroke-primary absolute top-2 right-2 z-10 w-28"
        @click="searchInBounds"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import {
  loadKakaoMaps,
  whenInView,
  createMap,
  createPlaces,
  keywordSearch,
  getCurrentPosition,
  coord2Region,
  clearMarkers,
  makeMarker,
  isBankBranch,
  debounce,
} from '@/utils/kakaoMap';

const emit = defineEmits<{ (e: 'select', branch: string): void }>();
const mapEl = ref<HTMLDivElement | null>(null);
const map = ref<kakao.maps.Map>();
const ps = ref<kakao.maps.services.Places>();
const markers = ref<kakao.maps.Marker[]>([]);

const searchQuery = ref('');
const currentAddress = ref('');
const selectedBranch = ref('');
const errorMessage = ref('');
const mapMoved = ref(false);

defineExpose({
  getSelectedBranch: () => selectedBranch.value,
});

const paintMarkers = (list: any[]) => {
  clearMarkers(markers.value);
  const b = new kakao.maps.LatLngBounds();

  for (const place of list) {
    const lat = Number(place.y);
    const lng = Number(place.x);
    const isGolden = (place.place_name as string).includes('골든라이프');

    const m = makeMarker({
      map: map.value!,
      lat,
      lng,
      imageUrl: isGolden ? '/images/golden-marker.png' : undefined,
      imageSize: { w: 40, h: 40 },
    });

    kakao.maps.event.addListener(m, 'click', () => {
      selectedBranch.value = place.place_name;
      emit('select', place.place_name);
    });

    markers.value.push(m);
    b.extend(new kakao.maps.LatLng(lat, lng));
  }

  if (list.length) map.value!.setBounds(b);
};

const doSearch = async () => {
  if (!map.value || !ps.value) return;
  errorMessage.value = '';
  selectedBranch.value = '';

  if (searchQuery.value.trim() && searchQuery.value.trim().length < 2) {
    errorMessage.value = '두 글자 이상 입력해주세요.';
    return;
  }

  const keyword = searchQuery.value.trim()
    ? `국민은행 ${searchQuery.value.trim()}`
    : '국민은행';

  const opts = searchQuery.value.trim()
    ? undefined
    : { bounds: map.value.getBounds() };

  const results = await keywordSearch(ps.value, keyword, opts);
  const filtered = results.filter((r) => isBankBranch(r.place_name));

  if (!filtered.length) {
    clearMarkers(markers.value);
    errorMessage.value = '검색 결과가 없습니다.';
    return;
  }

  paintMarkers(filtered);
};

const debouncedSearch = debounce(doSearch, 350);
const onSearchClick = () => debouncedSearch();

const searchInBounds = async () => {
  if (!map.value || !ps.value) return;
  errorMessage.value = '';
  selectedBranch.value = '';

  const bounds = map.value.getBounds();
  // 현 지도 범위만으로 검색(반경/센터 불필요)
  const results = await keywordSearch(ps.value, '국민은행', { bounds });

  const filtered = results.filter((p) => isBankBranch(p.place_name));

  if (!filtered.length) {
    clearMarkers(markers.value);
    errorMessage.value = '현 지도 범위 내 검색 결과가 없습니다.';
    return;
  }

  paintMarkers(filtered);
  mapMoved.value = false;
};

onMounted(async () => {
  if (!mapEl.value) return;
  await loadKakaoMaps();

  whenInView(mapEl.value, async () => {
    // 현재 위치 시도 → 실패 시 서울시청
    let lat = 37.5665,
      lng = 126.978;
    try {
      const pos = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch {
      // 위치 권한 실패 등: currentAddress 안내는 coord2Region로 커버
    }

    map.value = createMap(mapEl.value!, {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    });
    ps.value = createPlaces(map.value);

    kakao.maps.event.addListener(
      map.value,
      'dragend',
      () => (mapMoved.value = true)
    );

    // 역지오코딩으로 주소/초기 검색
    const region = await coord2Region(lng, lat);
    currentAddress.value = region?.address_name ?? '';
    searchQuery.value = region?.region_2depth_name ?? '';

    await doSearch();
  });
});
</script>
