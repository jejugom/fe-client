<template>
  <div
    class="bg-secondary-100 relative left-1/2 mt-[-1.125rem] w-screen max-w-[600px] -translate-x-1/2 pb-16"
  >
    <div class="space-y-8 p-4">
      <!-- 제목 -->
      <div class="space-y-2">
        <h1 class="text-primary-500 text-2xl font-bold"
          >근처 공원 방문 챌린지</h1
        >
        <p
          >가까운 공원을 찾아가서
          <span class="font-semibold">200m 이내</span>에서 체크인하세요!</p
        >
      </div>

      <!-- 지도 -->
      <div class="stroke-secondary relative h-90 rounded-lg">
        <Btn
          color="primary"
          label="내 위치 새로고침"
          size="small"
          @click="locateAndSearch"
          class="absolute top-4 right-4 z-10 w-32 shadow-md"
        />
        <div ref="mapRef" class="h-full w-full rounded-lg"></div>
      </div>

      <!-- 안내/에러 -->
      <p v-if="noticeMsg" class="">{{ noticeMsg }}</p>
      <p v-if="errorMsg" class="text-red-300">{{ errorMsg }}</p>

      <!-- 공원 리스트 -->
      <div class="stroke-secondary rounded-lg bg-white">
        <div class="border-surface-200 border-b p-4">
          반경 {{ (searchRadius / 1000).toFixed(0) }}km 내 검색 결과
          <span class="text-surface-300 mx-2">|</span>
          총 <span class="text-gold font-semibold">{{ parks.length }}</span> 곳
        </div>

        <ul class="divide-surface-200 divide-y">
          <li
            v-for="p in parks"
            :key="p.id"
            class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-semibold">{{ p.name }}</span>
                <span
                  class="rounded-lg px-2 py-0.5 font-semibold"
                  :class="
                    p.checked ? 'bg-primary-300 text-white' : 'bg-surface-100'
                  "
                >
                  {{ p.checked ? '완료' : '미방문' }}
                </span>
              </div>
              <div class="mt-2">
                거리:
                <span class="tabular-nums">{{
                  formatDistance(p.distance)
                }}</span>
              </div>
            </div>
            <Btn
              color="primary"
              label="방문 인증"
              size="square"
              :disabled="!canCheckIn(p)"
              @click="checkIn(p)"
              :class="canCheckIn(p) ? '' : 'bg-surface-200'"
              class="px-2"
            />
          </li>
        </ul>
      </div>
    </div>

    <Confirm
      v-if="showConfirm"
      :title="confirmTitle"
      leftLabel="야니오"
      rightLabel="예"
      @click1="onConfirmNo"
      @click2="onConfirmYes"
    >
      <p class="text-center whitespace-pre-line">{{ confirmMessage }}</p>
    </Confirm>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import Confirm from '@/components/modals/Confirm.vue';
import { useRouter } from 'vue-router';
import { useRewardStore } from '@/stores/reward';

import {
  loadKakaoMaps,
  whenInView,
  createMap,
  createPlaces,
  getCurrentPosition,
  clearMarkers as clearAllMarkers,
  makeMarker as makeBasicMarker,
  keywordSearch as kwSearch,
} from '@/utils/kakaoMap';

type Park = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number; // meters
  checked: boolean;
};

const router = useRouter();
const rewardStore = useRewardStore();

/* ---------- Confirm ---------- */
const showConfirm = ref(false);
const confirmTitle = ref<string>();
const confirmMessage = ref('');
let confirmResolve: ((v: boolean) => void) | null = null;

const openConfirm = (message: string, title?: string) =>
  new Promise<boolean>((resolve) => {
    confirmMessage.value = message;
    confirmTitle.value = title;
    showConfirm.value = true;
    confirmResolve = resolve;
  });
const onConfirmNo = () => {
  showConfirm.value = false;
  confirmResolve?.(false);
  confirmResolve = null;
};
const onConfirmYes = () => {
  showConfirm.value = false;
  confirmResolve?.(true);
  confirmResolve = null;
};

/* ---------- 상태 ---------- */
const mapRef = ref<HTMLDivElement | null>(null);
let map: kakao.maps.Map | null = null;
let places: kakao.maps.services.Places | null = null;
const markers: kakao.maps.Marker[] = [];

const myPos = ref<{ lat: number; lng: number } | null>(null);
const parks = ref<Park[]>([]);
const errorMsg = ref('');
const noticeMsg = ref('');

const searchRadius = 2000; // 2km
const checkInRadius = 200; // 200m 내 체크인 허용
const goalCount = 1;

const checkedCount = computed(
  () => parks.value.filter((p) => p.checked).length
);
const progress = computed(() =>
  parks.value.length
    ? Math.min(100, Math.round((checkedCount.value / goalCount) * 100))
    : 0
);

/* ---------- 로컬 스토리지 ---------- */
const LS_KEY = 'park_challenge_checked_ids';
const loadCheckedIds = () => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
  } catch {
    return new Set<string>();
  }
};
const saveCheckedIds = (ids: Set<string>) =>
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]));

/* ---------- 유틸 ---------- */
const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};
const formatDistance = (m: number) =>
  m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`;

/* ---------- 필터 ---------- */
const ALLOW_GROUPS = new Set(['AT4', 'CT1', 'PO3']); // 관광명소/문화시설/공공기관 허용
const DENY_GROUPS = new Set([
  'CS2',
  'FD6',
  'CE7',
  'MT1',
  'HP8',
  'PM9',
  'BK9',
  'SW8',
  'OL7',
]); // 편의점/음식점 등
const NAME_ALLOW =
  /(근린공원|어린이공원|도시공원|생태공원|수변공원|체육공원|공원)$/i;
const NAME_INCLUDE = /공원/i;
const NAME_DENY =
  /(편의점|CU|GS25?|베드민턴장|운동장|화장실|놀이터|물놀이장|테니스장|축구장|야구장|탁구장|볼링장|헬스|스포츠센터|구의공원점|점$)/i;

const isParkLike = (d: any) => {
  const group = d.category_group_code as string | undefined;
  const name = d.place_name as string;
  if (group) {
    if (DENY_GROUPS.has(group)) return false;
    if (ALLOW_GROUPS.has(group)) {
      if (NAME_DENY.test(name)) return false;
      return NAME_ALLOW.test(name) || NAME_INCLUDE.test(name);
    }
  }
  if (NAME_DENY.test(name)) return false;
  return NAME_ALLOW.test(name) || NAME_INCLUDE.test(name);
};

const normalizeToPark = (d: any): Park => {
  const lat = Number(d.y);
  const lng = Number(d.x);
  const dist = haversine(myPos.value!.lat, myPos.value!.lng, lat, lng);
  return {
    id: String(d.id),
    name: d.place_name,
    lat,
    lng,
    distance: dist,
    checked: loadCheckedIds().has(String(d.id)),
  };
};

/* ---------- 마커 ---------- */
const clearMarkers = () => clearAllMarkers(markers);

// (필요 시 원형 오버레이/인포윈도우까지 쓰려면 any 캐스팅)
const makeMarker = (opts: {
  lat: number;
  lng: number;
  me?: boolean;
  visited?: boolean;
  title?: string;
}) => {
  if (!map) return;
  const { lat, lng, me, visited, title } = opts;

  // 기본 마커(공통 유틸)
  const m = makeBasicMarker({ map, lat, lng });

  // 색상 원형(타입 정의 외라 캐스팅)
  const kakaoAny = window.kakao as any;
  const pos = new kakaoAny.maps.LatLng(lat, lng);
  const color = me ? '#2563eb' : visited ? '#9ca3af' : '#10b981';
  const circle = new kakaoAny.maps.Circle({
    center: pos,
    radius: me ? 12 : 8,
    strokeWeight: 2,
    strokeColor: color,
    strokeOpacity: 0.9,
    fillColor: color,
    fillOpacity: 0.6,
  });
  circle.setMap(map);

  if (title) {
    const infowindow = new kakaoAny.maps.InfoWindow({
      content: `<div style="padding:4px; color:#3674b5">${title}</div>`,
    });
    kakaoAny.maps.event.addListener(m, 'click', () => infowindow.open(map, m));
  }

  markers.push(m);
};

/* ---------- 지도 초기화 ---------- */
const initMap = (center: { lat: number; lng: number }) => {
  if (!mapRef.value || !window.kakao?.maps) {
    errorMsg.value = '카카오 지도 스크립트가 로드되지 않았습니다.';
    return;
  }
  map = createMap(mapRef.value, {
    center: new window.kakao.maps.LatLng(center.lat, center.lng),
    level: 5,
  });
  (map as any).setDraggable(false);
  (map as any).setZoomable(false);
  places = createPlaces(map);

  makeMarker({ lat: center.lat, lng: center.lng, me: true });
};

/* ---------- 검색 ---------- */
const applyParksAndMarkers = (list: Park[]) => {
  const arr = list
    .filter((p) => p.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
  parks.value = arr;

  clearMarkers();
  if (myPos.value)
    makeMarker({ lat: myPos.value.lat, lng: myPos.value.lng, me: true });
  for (const p of parks.value)
    makeMarker({ lat: p.lat, lng: p.lng, visited: p.checked, title: p.name });
};

const searchParks = async () => {
  if (!places || !myPos.value) return;
  noticeMsg.value = '근처 공원을 검색 중…';

  // 1) 공공기관(PO3) 카테고리 우선 시도
  let list: Park[] = [];
  try {
    const res = await new Promise<any[]>((resolve) => {
      (places as any).categorySearch(
        'PO3',
        (data: any[], status: kakao.maps.services.Status) => {
          resolve(status === kakao.maps.services.Status.OK ? data : []);
        },
        {
          location: new window.kakao!.maps.LatLng(
            myPos.value!.lat,
            myPos.value!.lng
          ),
          radius: searchRadius,
          // SortBy 타입이 d.ts에 없으므로 생략 (기본 거리 정렬)
        }
      );
    });
    list = res.filter(isParkLike).map(normalizeToPark);
  } catch {
    // noop
  }

  // 2) 부족하면 키워드 ‘공원’ 폴백 (공통 유틸)
  if (list.length === 0) {
    const k = await kwSearch(places, '공원', {
      location: new window.kakao!.maps.LatLng(
        myPos.value!.lat,
        myPos.value!.lng
      ),
      radius: searchRadius,
    });
    list = k
      .filter((d) => {
        const g = d.category_group_code as string | undefined;
        if (g && DENY_GROUPS.has(g)) return false;
        return isParkLike(d);
      })
      .map(normalizeToPark);
  }

  noticeMsg.value = '';
  if (list.length === 0) {
    errorMsg.value = '주변에 적합한 공원을 찾지 못했습니다.';
    parks.value = [];
    clearMarkers();
    if (myPos.value)
      makeMarker({ lat: myPos.value.lat, lng: myPos.value.lng, me: true });
    return;
  }
  applyParksAndMarkers(list);
};

/* ---------- 위치 ---------- */
const locateAndSearch = async () => {
  errorMsg.value = '';
  try {
    const pos = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    myPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };

    if (!map) initMap(myPos.value);
    if (map) {
      const center = new window.kakao!.maps.LatLng(
        myPos.value.lat,
        myPos.value.lng
      );
      const bounds = new window.kakao!.maps.LatLngBounds();
      bounds.extend(center);
      map.setBounds(bounds);
      makeMarker({ lat: myPos.value.lat, lng: myPos.value.lng, me: true });
    }
    searchParks();
  } catch (err: any) {
    errorMsg.value = `위치 조회 실패: ${err?.message ?? '알 수 없는 오류'}`;
  }
};

function canCheckIn(p: Park) {
  if (!myPos.value) return false;
  return p.distance <= checkInRadius;
}
async function checkIn(p: Park) {
  if (!canCheckIn(p)) return;
  const ids = loadCheckedIds();
  ids.add(String(p.id));
  saveCheckedIds(ids);
  p.checked = true;

  rewardStore.complete('park');

  const ok = await openConfirm(
    '방문 인증이 완료되었습니다.\n생활편의 페이지로 돌아가겠습니까?',
    '🎉 챌린지 완료'
  );
  if (ok) router.push({ name: 'event' });
}

/* ---------- 거리 재계산 + watch ---------- */
const recalcDistances = () => {
  if (!myPos.value) return;
  parks.value = parks.value.map((p) => ({
    ...p,
    distance: haversine(myPos.value!.lat, myPos.value!.lng, p.lat, p.lng),
  }));
};

let watchId: number | null = null;

/* ---------- lazy load: 지도가 화면에 들어올 때만 SDK 로드 ---------- */
onMounted(() => {
  if (!mapRef.value) return;

  const stop = whenInView(mapRef.value, async () => {
    await loadKakaoMaps();
    locateAndSearch();

    // 위치 변화 감시(배터리 고려)
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          myPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          recalcDistances();
        },
        () => {},
        { enableHighAccuracy: false, maximumAge: 5000, timeout: 10000 }
      );
    }
  });

  // 컴포넌트 unmount 시 옵저버 해제
  onBeforeUnmount(() => {
    stop();
    if (watchId !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId);
    }
  });
});
</script>
