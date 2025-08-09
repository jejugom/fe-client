<template>
  <div class="mx-auto max-w-5xl p-6">
    <!-- 헤더 -->
    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-primary-600 text-2xl font-bold"
          >근처 공원 방문 챌린지</h1
        >
        <p class="text-surface-500 mt-1 text-base">
          가까운 공원을 찾아가서 <b>100m 이내</b>에서 체크인하세요!
        </p>
      </div>

      <div
        class="border-surface-200 rounded-lg border bg-white px-4 py-2 text-base"
      >
        목표: <b>{{ goalCount }}</b> 곳
        <span class="text-surface-400 mx-2">|</span>
        완료: <b class="text-emerald-600">{{ checkedCount }}</b> 곳
      </div>
    </div>

    <!-- 진행도 -->
    <div class="bg-surface-200 mb-6 h-2 w-full overflow-hidden rounded-full">
      <div
        class="bg-primary-400 h-full transition-[width]"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- 알림 -->
    <div v-if="errorMsg" class="mb-4 rounded-lg bg-rose-50 p-3 text-rose-700">
      {{ errorMsg }}
    </div>
    <div
      v-if="noticeMsg"
      class="mb-4 rounded-lg bg-amber-50 p-3 text-amber-800"
    >
      {{ noticeMsg }}
    </div>

    <!-- 지도 -->
    <div class="mb-6 grid gap-6 lg:grid-cols-2">
      <div
        class="border-surface-200 h-[380px] overflow-hidden rounded-lg border bg-white"
      >
        <div ref="mapRef" class="h-full w-full"></div>
      </div>

      <!-- 내 위치/리프레시 -->
      <div class="flex flex-col gap-3">
        <div class="border-surface-200 rounded-lg border bg-white p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="text-surface-600 text-base">
              내 위치:
              <span class="tabular-nums">
                {{
                  myPos
                    ? myPos.lat.toFixed(5) + ', ' + myPos.lng.toFixed(5)
                    : '-'
                }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="border-surface-300 hover:bg-surface-50 rounded-lg border bg-white px-3 py-1.5 text-base active:translate-y-[1px]"
                @click="locate"
              >
                내 위치 새로고침
              </button>
              <button
                class="border-surface-300 hover:bg-surface-50 rounded-lg border bg-white px-3 py-1.5 text-base active:translate-y-[1px]"
                @click="searchParks"
                :disabled="!myPos"
              >
                근처 공원 다시검색
              </button>
            </div>
          </div>
          <p class="text-surface-500 text-xs">
            지도에 <span class="font-semibold">녹색</span> 마커: 미방문 /
            <span class="font-semibold">회색</span> 마커: 방문 완료
          </p>
        </div>

        <!-- 목표 완료 축하 -->
        <div
          v-if="checkedCount >= goalCount"
          class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          🎉 축하합니다! 목표를 달성했어요. 계속 더 모아볼까요?
        </div>
      </div>
    </div>

    <!-- 공원 리스트 -->
    <div class="border-surface-200 rounded-lg border bg-white">
      <div class="border-surface-200 text-surface-600 border-b p-4 text-base">
        반경 {{ (searchRadius / 1000).toFixed(1) }}km 내 검색 결과
        <span class="text-surface-300 mx-2">|</span>
        총 <b>{{ parks.length }}</b> 곳
      </div>

      <ul class="divide-y">
        <li
          v-for="p in parks"
          :key="p.id"
          class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-semibold">{{ p.name }}</span>
              <span
                class="rounded-lg px-2 py-0.5 text-xs"
                :class="
                  p.checked
                    ? 'bg-surface-200 text-surface-600'
                    : 'bg-emerald-100 text-emerald-800'
                "
              >
                {{ p.checked ? '완료' : '미방문' }}
              </span>
            </div>
            <div class="text-surface-600 mt-1 text-base">
              거리:
              <span class="font-medium tabular-nums">{{
                formatDistance(p.distance)
              }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="border-surface-300 hover:bg-surface-50 rounded-lg border bg-white px-3 py-2 text-base"
              @click="panTo(p)"
            >
              지도에서 보기
            </button>
            <button
              class="rounded-lg px-3 py-2 text-base text-white"
              :class="
                canCheckIn(p)
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-surface-300'
              "
              :disabled="!canCheckIn(p)"
              @click="checkIn(p)"
            >
              체크인
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';

// Kakao 타입 가드(전역)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const kakao: any;

type Park = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number; // meters
  checked: boolean;
};

// ----- 상태 -----
const mapRef = ref<HTMLDivElement | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let places: any | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markers: any[] = [];

const myPos = ref<{ lat: number; lng: number } | null>(null);
const parks = ref<Park[]>([]);
const errorMsg = ref('');
const noticeMsg = ref('');

const searchRadius = 2000; // 2km
const checkInRadius = 100; // 100m 이내 체크인 허용
const goalCount = 3;

const checkedCount = computed(
  () => parks.value.filter((p) => p.checked).length
);
const progress = computed(() =>
  parks.value.length
    ? Math.min(100, Math.round((checkedCount.value / goalCount) * 100))
    : 0
);

// 로컬 스토리지 키
const LS_KEY = 'park_challenge_checked_ids';

// ----- 유틸 -----
function loadCheckedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}
function saveCheckedIds(ids: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify(Array.from(ids)));
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3; // m
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a)); // meters
}

function formatDistance(m: number) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

// ----- 지도/검색 -----
function initMap(center: { lat: number; lng: number }) {
  if (
    !mapRef.value ||
    !window ||
    !(window as any).kakao ||
    !(window as any).kakao.maps
  ) {
    errorMsg.value =
      '카카오 지도 스크립트가 로드되지 않았습니다. 새로고침하거나 네트워크를 확인하세요.';
    return;
  }
  const kakaoCenter = new kakao.maps.LatLng(center.lat, center.lng);
  map = new kakao.maps.Map(mapRef.value, {
    center: kakaoCenter,
    level: 5,
  });
  places = new kakao.maps.services.Places(map);
  // 내 위치 마커
  makeMarker(center.lat, center.lng, true);
}

function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers.length = 0;
}

function makeMarker(lat: number, lng: number, me = false, visited = false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat, lng),
    // 기본/커스텀 이미지 지정 가능
  });
  marker.setMap(map);
  // 색 구분: 나(파랑), 방문완료(회색), 기본(초록)
  const color = me ? '#2563eb' : visited ? '#9ca3af' : '#10b981';
  // 심플한 원형 커스텀 오버레이
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circle = new kakao.maps.Circle({
    center: new kakao.maps.LatLng(lat, lng),
    radius: me ? 12 : 8,
    strokeWeight: 2,
    strokeColor: color,
    strokeOpacity: 0.9,
    fillColor: color,
    fillOpacity: 0.6,
  });
  circle.setMap(map);
  // 마커 제거 시 같이 제거되도록 보관
  markers.push(marker, circle);
  return marker;
}

function locate() {
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
        // 내 위치 마커 갱신
        makeMarker(myPos.value.lat, myPos.value.lng, true);
      }
      // 내 위치가 확보되면 근처 공원 검색
      searchParks();
    },
    (err) => {
      errorMsg.value = `위치 조회 실패: ${err.message}`;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function searchParks() {
  if (!places || !myPos.value) return;
  noticeMsg.value = '근처 공원을 검색 중…';
  // Kakao Places: 키워드 검색(한글 "공원"). 필요 시 categorySearch로 전환 가능.
  const opt = {
    radius: searchRadius,
    location: new kakao.maps.LatLng(myPos.value.lat, myPos.value.lng),
    size: 15, // 최대 15개
    sort: kakao.maps.services.SortBy.DISTANCE,
  };
  places.keywordSearch(
    '공원',
    (data: any[], status: string) => {
      if (status !== kakao.maps.services.Status.OK) {
        noticeMsg.value = '';
        errorMsg.value = '검색 결과를 불러오지 못했습니다.';
        return;
      }

      const checkedIds = loadCheckedIds();
      const arr: Park[] = data
        .map((d) => {
          const lat = Number(d.y);
          const lng = Number(d.x);
          const dist = myPos.value
            ? haversine(myPos.value.lat, myPos.value.lng, lat, lng)
            : Infinity;
          return {
            id: d.id,
            name: d.place_name,
            lat,
            lng,
            distance: dist,
            checked: checkedIds.has(String(d.id)),
          } as Park;
        })
        .filter((p) => p.distance <= searchRadius)
        .sort((a, b) => a.distance - b.distance);

      parks.value = arr;

      // 마커 갱신
      clearMarkers();
      // 내 위치
      if (myPos.value) makeMarker(myPos.value.lat, myPos.value.lng, true);
      // 공원
      for (const p of parks.value) {
        makeMarker(p.lat, p.lng, false, p.checked);
      }
      noticeMsg.value = '';
    },
    opt
  );
}

function panTo(p: Park) {
  if (!map) return;
  map.panTo(new kakao.maps.LatLng(p.lat, p.lng));
}

function canCheckIn(p: Park) {
  if (p.checked) return false;
  if (!myPos.value) return false;
  return p.distance <= checkInRadius;
}

function checkIn(p: Park) {
  const ids = loadCheckedIds();
  ids.add(String(p.id));
  saveCheckedIds(ids);
  p.checked = true;
}

// 내 위치 변하면 거리 재계산
function recalcDistances() {
  if (!myPos.value) return;
  parks.value = parks.value.map((p) => ({
    ...p,
    distance: haversine(myPos.value!.lat, myPos.value!.lng, p.lat, p.lng),
  }));
}

// 주기적으로 내 위치/거리 갱신 (옵션)
let watchId: number | null = null;
onMounted(() => {
  // 지도/위치 시작
  if ((window as any).kakao?.maps) {
    // kakao.maps.load는 main.ts에서 autoload=false 로드 시 필요하지만,
    // 이미 load()를 호출했다면 바로 사용 가능
  }
  locate();
  // 위치 변화 감시(배터리 고려해 highAccuracy는 꺼둠)
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
