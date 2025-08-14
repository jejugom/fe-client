<template>
  <!-- 현재 위치 표시 -->
  <div class="mb-4">
    <h2 class="text-primary-500 mb-2 text-2xl font-bold">
      나의 국민은행 지점 설정
    </h2>
    <p class="font-semibold">현재 위치: {{ currentAddress }}</p>
    <!-- 현재 설정된 지점 표시 -->
    <div
      v-if="currentBranch"
      class="stroke-primary bg-primary-100 my-2 w-full rounded-lg p-2"
    >
      현재 설정된 지점:
      <span class="text-primary-500 ml-2 text-base font-semibold">{{
        currentBranch
      }}</span>
    </div>
  </div>

  <!-- 검색 영역 -->
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <InputBox
        placeholder="지점 입력 (예: 광진구)"
        size="medium"
        type="text"
        class="flex-1"
        v-model="searchQuery"
      />
      <Btn @click="searchPlaces" color="primary" label="검색" size="square" />
    </div>

    <!-- 선택된 지점 표시 -->
    <div class="min-h-8 transition-[opacity] duration-200">
      <div
        v-if="displaySelectedBranchName"
        class="stroke-secondary bg-secondary-100 flex w-full items-center rounded-lg p-2"
      >
        선택한 지점:
        <span class="font-semibold">{{ displaySelectedBranchName }}</span>
      </div>
    </div>

    <!-- 지도 영역 -->
    <div id="map" class="stroke-secondary mb-8 h-96 w-full rounded-lg"></div>
  </div>

  <!-- 하단 버튼 -->
  <BtnSet
    label1="건너뛰기"
    label2="설정하기"
    @click1="handleSkip"
    @click2="handleComplete"
    type="type2"
  />
  <!-- 지점 설정 완료 -->
  <Alert v-if="showSuccessAlert" @click="onAlertConfirm">
    <p>
      지점 "{{ displaySelectedBranchName }}"이(가) 성공적으로 설정되었습니다.
    </p>
  </Alert>
  <!-- 지점 설정 실패 시 -->
  <Alert v-if="showErrorAlert" @click="showErrorAlert = false">
    <p>
      {{ errorAlertMessage }}
    </p>
  </Alert>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import BtnSet from '@/components/buttons/BtnSet.vue';
import Alert from '@/components/modals/Alert.vue';
import { branchApi } from '@/api/user/branch';
import { branchList } from '@/data/branchList';

// kakao 유틸/타입
import {
  loadKakaoMaps,
  createMap,
  createPlaces,
  keywordSearch,
  coord2Region,
  getCurrentPosition,
  clearMarkers,
  makeMarker,
  isBankBranch,
  debounce,
  type Place,
  type SearchOpts,
} from '@/utils/kakaoMap';

const router = useRouter();
const route = useRoute();

/* ---------- state ---------- */
const searchQuery = ref('');
const currentAddress = ref('');
const currentBranch = ref('');
const displaySelectedBranchName = ref('');
const selectedBranch = ref(''); // 저장용 간단 지점명

const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);
const errorAlertMessage = ref('');

const map = ref<kakao.maps.Map>();
const ps = ref<kakao.maps.services.Places>();
const markers = ref<kakao.maps.Marker[]>([]);

/* ---------- helpers ---------- */
const q = (v: unknown) =>
  Array.isArray(v) ? String(v[0] ?? '') : v != null ? String(v) : '';

function normalizeBranchName(name: string) {
  return name
    .replace(/KB국민은행\s*/g, '')
    .replace(/점/g, '')
    .trim();

/* ---------- 검색/마커 ---------- */
const paintMarkers = (list: Place[]) => {
  if (!map.value) return;
  clearMarkers(markers.value);

  const bounds = new kakao.maps.LatLngBounds();

  for (const p of list) {
    const lat = Number(p.y);
    const lng = Number(p.x);
    const isGolden = p.place_name.includes('골든라이프');

    const m = makeMarker({
      map: map.value,
      lat,
      lng,
      imageUrl: isGolden ? '/images/golden-marker.png' : undefined,
      imageSize: { w: 40, h: 40 },
    });

    kakao.maps.event.addListener(m, 'click', () => {
      displaySelectedBranchName.value = p.place_name; // 전체 표시용
      selectedBranch.value = normalizeBranchName(p.place_name); // 저장용
    });

    markers.value.push(m);
    bounds.extend(new kakao.maps.LatLng(lat, lng));
  }

  if (list.length) map.value.setBounds(bounds);
};

const doSearch = async () => {
  if (!map.value || !ps.value) return;

  const keyword = searchQuery.value.trim();
  // 입력 없으면 현 지도 bounds 사용
  const opts: SearchOpts | undefined = keyword
    ? undefined
    : { bounds: map.value.getBounds() };

  const baseKeyword = keyword ? `국민은행 ${keyword}` : '국민은행';
  const results = await keywordSearch(ps.value, baseKeyword, opts);
  const filtered = results.filter((r) => isBankBranch(r.place_name));

  if (!filtered.length) {
    clearMarkers(markers.value);
    errorAlertMessage.value = '검색 결과가 없습니다.';
    showErrorAlert.value = true;
    return;
  }

  showErrorAlert.value = false;
  paintMarkers(filtered);
};

const debouncedSearch = debounce(doSearch, 300);
const searchPlaces = () => debouncedSearch();

/* ---------- 완료/스킵/알럿 ---------- */
const onAlertConfirm = () => {
  showSuccessAlert.value = false;
  const from = q(route.query.from);
  router.push({
    name: from === 'profile' ? 'profile' : 'asset-signup-complete',
  });
};

function handleSkip() {
  const from = q(route.query.from);
  router.push({
    name: from === 'profile' ? 'profile' : 'asset-signup-complete',
  });
};

async function handleComplete() {
  if (!selectedBranch.value) {
    errorAlertMessage.value = '지점을 선택해주세요.';
    showErrorAlert.value = true;
    return;
  }

  try {
    const match = branchList.find(
      (b) => normalizeBranchName(b.name) === selectedBranch.value
    );
    if (!match) {
      errorAlertMessage.value =
        '선택한 지점을 찾을 수 없습니다. 다시 선택해주세요.';
      showErrorAlert.value = true;
      return;
    }

    await branchApi.setMyBranch({ branchId: match.id });
    currentBranch.value = displaySelectedBranchName.value;
    showErrorAlert.value = false;
    showSuccessAlert.value = true;
  } catch (e) {
    console.error('지점 설정 실패:', e);
    errorAlertMessage.value =
      '지점 설정 중 오류가 발생했습니다. 다시 시도해주세요.';
    showErrorAlert.value = true;
  }
}

/* ---------- mount: 지도/초기검색 ---------- */
onMounted(async () => {
  try {
    const myBranch = await branchApi.getMyBranch();
    currentBranch.value = myBranch.branchName;
  } catch (e) {
    // 초기 지점 없을 수 있음: 무시
    console.warn('내 지점 정보 조회 실패:', e);
  }

  await loadKakaoMaps();

  // 위치 → 실패 시 서울시청
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
    /* noop */
  }

  map.value = createMap(document.getElementById('map') as HTMLElement, {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  });
  ps.value = createPlaces(map.value);

  // 내 위치 마커
  makeMarker({ map: map.value, lat, lng });

  // 역지오 → 현재 주소/기본 검색어
  const region = await coord2Region(lng, lat);
  currentAddress.value = region?.address_name ?? '';
  // 구 단위가 있으면 기본 검색어로 세팅
  searchQuery.value = region?.region_2depth_name ?? '';

  await doSearch();

  // 지도를 드래그한 상태라면 버튼 없이도 즉시 재검색하고 싶다면:
  kakao.maps.event.addListener(map.value, 'dragend', () => {
    // 입력이 비어있을 때만 bounds 검색 자동 실행
    if (!searchQuery.value.trim()) debouncedSearch();
  });
});
</script>
