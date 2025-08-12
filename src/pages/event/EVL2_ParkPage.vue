<template>
  <div
    class="bg-secondary-100 relative left-1/2 mt-[-1.125rem] w-screen max-w-150 -translate-x-1/2 pb-16"
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
      leftLabel="계속있기"
      rightLabel="돌아가기"
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
import { useRouter } from 'vue-router';
import Confirm from '@/components/modals/Confirm.vue';
import { useRewardStore } from '@/stores/reward';

const rewardStore = useRewardStore();
const router = useRouter();

// Confirm 상태
const showConfirm = ref(false);
const confirmTitle = ref<string | undefined>(undefined);
const confirmMessage = ref('');
let confirmResolve: ((v: boolean) => void) | null = null;

// 열기(프로미스)
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

// Kakao 전역 타입
declare const kakao: any;

type Park = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number; // meters
  checked: boolean;
};

/* ---------- 상태 ---------- */
const mapRef = ref<HTMLDivElement | null>(null);
let map: any | null = null;
let places: any | null = null;
const markers: any[] = [];

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
function loadCheckedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}
function saveCheckedIds(ids: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify(Array.from(ids)));
}

/* ---------- 유틸 ---------- */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function formatDistance(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`;
}

/* ---------- 지도 ---------- */
function initMap(center: { lat: number; lng: number }) {
  if (!mapRef.value || !(window as any)?.kakao?.maps) {
    errorMsg.value = '카카오 지도 스크립트가 로드되지 않았습니다.';
    return;
  }
  const kakaoCenter = new kakao.maps.LatLng(center.lat, center.lng);
  map = new kakao.maps.Map(mapRef.value, { center: kakaoCenter, level: 5 });
  map.setDraggable(false); // 드래그(이동) 막기
  map.setZoomable(false); // 휠/핀치/더블클릭 줌 막기
  places = new kakao.maps.services.Places(map);
  makeMarker(center.lat, center.lng, true); // 내 위치
}
function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers.length = 0;
}
function makeMarker(
  lat: number,
  lng: number,
  me = false,
  visited = false,
  title = ''
) {
  const markerPosition = new kakao.maps.LatLng(lat, lng);

  // 마커 생성
  const marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);

  // 색상 설정
  const color = me ? '#2563eb' : visited ? '#9ca3af' : '#10b981';
  const circle = new kakao.maps.Circle({
    center: markerPosition,
    radius: me ? 12 : 8,
    strokeWeight: 2,
    strokeColor: color,
    strokeOpacity: 0.9,
    fillColor: color,
    fillOpacity: 0.6,
  });
  circle.setMap(map);

  // 인포윈도우 내용
  if (title) {
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div  style="padding:4px; color:#3674b5">${title}</div>`,
    });

    // 마커 클릭 시 인포윈도우 열기
    kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
    });
  }

  markers.push(marker, circle);
  return marker;
}

/* ---------- 고급 필터 세트 ---------- */
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
]); // 편의점, 음식점 등 차단
const NAME_ALLOW =
  /(근린공원|어린이공원|도시공원|생태공원|수변공원|체육공원|공원)$/i; // '…공원' 우선
const NAME_INCLUDE = /공원/i; // 일반 포함
const NAME_DENY =
  /(편의점|CU|GS25?|베드민턴장|운동장|화장실|놀이터|물놀이장|테니스장|축구장|야구장|탁구장|볼링장|헬스|스포츠센터|구의공원점|점$)/i;

function isParkLike(d: any) {
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
}
function normalizeToPark(d: any): Park {
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
}
function applyParksAndMarkers(list: Park[]) {
  const arr = list
    .filter((p) => p.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10); // TOP 10만

  parks.value = arr;
  clearMarkers();
  if (myPos.value) makeMarker(myPos.value.lat, myPos.value.lng, true);
  for (const p of parks.value) {
    makeMarker(p.lat, p.lng, false, p.checked, p.name);
  }
}

/* ---------- 검색 ---------- */
function searchParks() {
  if (!places || !myPos.value) return;
  noticeMsg.value = '근처 공원을 검색 중…';
  const center = new kakao.maps.LatLng(myPos.value.lat, myPos.value.lng);
  const opt = {
    location: center,
    radius: searchRadius,
    sort: kakao.maps.services.SortBy.DISTANCE,
  };

  // 1) 공공기관(PO3)에서 먼저 시도
  places.categorySearch(
    'PO3',
    (data: any[], status: string) => {
      if (status !== kakao.maps.services.Status.OK) return keywordFallback();
      const filtered = data.filter(isParkLike).map(normalizeToPark);
      if (filtered.length > 0) {
        noticeMsg.value = '';
        return applyParksAndMarkers(filtered);
      }
      keywordFallback();
    },
    opt
  );

  // 2) 부족하면 키워드 ‘공원’ 폴백
  function keywordFallback() {
    places.keywordSearch(
      '공원',
      (kData: any[], kStatus: string) => {
        noticeMsg.value = '';
        if (kStatus !== kakao.maps.services.Status.OK) {
          errorMsg.value = '주변에 적합한 공원을 찾지 못했습니다.';
          parks.value = [];
          clearMarkers();
          if (myPos.value) makeMarker(myPos.value.lat, myPos.value.lng, true);
          return;
        }
        const filtered = kData
          .filter((d) => {
            const group = d.category_group_code as string | undefined;
            if (group && DENY_GROUPS.has(group)) return false;
            return isParkLike(d);
          })
          .map(normalizeToPark);

        applyParksAndMarkers(filtered);
      },
      opt
    );
  }
}

/* ---------- 위치 ---------- */
function locateAndSearch() {
  errorMsg.value = '';
  if (!('geolocation' in navigator)) {
    errorMsg.value = '이 브라우저는 위치 정보를 지원하지 않습니다.';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      myPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (!map) initMap(myPos.value);
      if (map) {
        map.setCenter(new kakao.maps.LatLng(myPos.value.lat, myPos.value.lng));
        makeMarker(myPos.value.lat, myPos.value.lng, true);
      }
      searchParks(); // 위치 갱신 후 즉시 검색
    },
    (err) => {
      errorMsg.value = `위치 조회 실패: ${err.message}`;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function panTo(p: Park) {
  if (!map) return;
  map.panTo(new kakao.maps.LatLng(p.lat, p.lng));
}
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

  // 목표 달성 시 보상 기록
  rewardStore.complete('park');

  const ok = await openConfirm(
    '🎉 챌린지를 완료했습니다!\n생활편의 페이지로 돌아가겠습니까?',
    '챌린지 완료'
  );
  if (ok) router.push({ name: 'event' });
}

/* ---------- 거리 재계산 + watch ---------- */
function recalcDistances() {
  if (!myPos.value) return;
  parks.value = parks.value.map((p) => ({
    ...p,
    distance: haversine(myPos.value!.lat, myPos.value!.lng, p.lat, p.lng),
  }));
}

let watchId: number | null = null;
onMounted(() => {
  // 처음 진입 시 한 번 실행
  locateAndSearch();

  // 위치 변화 감시(배터리 고려해서 highAccuracy는 off)
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
onBeforeUnmount(() => {
  if (watchId !== null && 'geolocation' in navigator) {
    navigator.geolocation.clearWatch(watchId);
  }
});
</script>
