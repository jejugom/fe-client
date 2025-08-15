<template>
  <div
    class="bg-primary-100 relative left-1/2 mt-[-1.125rem] min-h-screen w-screen max-w-[600px] -translate-x-1/2 px-4 py-8"
  >
    <div class="space-y-16">
      <TutorialHeader />
      <ServiceIntro />
      <!-- 핵심 기능 -->
      <section class="card-design flex flex-col gap-8 py-8">
        <h2 class="text-primary-500 text-center text-xl font-bold">
          노후도락의 <span class="text-gold">골든 시니어</span>만을 위한 기능
        </h2>
        <div class="space-y-4">
          <!-- 무엇이든 물어보세요 -->
          <div class="space-y-2">
            <h2 class="text-primary-500 text-lg font-bold"
              >가장 가까운 골든라이프 지점</h2
            >
            <p>
              노후도락은 온라인에서 끝나지 않아요. 가까운 KB 골든라이프 지점과
              연결해 대면 상담·서류 업무를 쉽고 안전하게 도와드립니다.
            </p>
            <div class="flex items-start justify-between gap-2">
              <p class="text-surface-300">
                버튼을 누르면 현재 위치 기준으로 가장 가까운 지점을 찾아드려요.
              </p>

              <Btn
                size="small"
                label="찾기"
                color="primary"
                @click="findNearest"
              />
            </div>
            <div
              v-if="nearestBranch"
              class="stroke-secondary bg-gold flex items-center justify-between rounded-lg p-4 text-white"
            >
              <div>
                <div class="text-lg font-semibold">{{
                  nearestBranch.name
                }}</div>
                <div class="opacity-90">
                  나와의 거리:
                  <span class="tabular-nums">{{
                    formatDistance(nearestBranch.distance)
                  }}</span>
                </div>
              </div>
              <Btn
                color="surface"
                size="small"
                label="찾아가기"
                @click="openMap(nearestBranch)"
              />
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <!-- 무엇이든 물어보세요 -->
          <div class="space-y-2">
            <h2 class="text-primary-500 text-lg font-bold"
              >무엇이든 물어보세요</h2
            >
            <p class="text-surface-300">
              금융관련 궁금한 걸 물어보면, 무엇이든 대답해드려요.
            </p>
          </div>
          <Question />
        </div>
        <!-- 글자 크기 조절 -->
        <!-- 글자 크기 조절 (미리보기 전용) -->
        <div class="space-y-4">
          <div class="space-y-2">
            <h2 class="text-primary-500 text-lg font-bold">글자 크기 조절</h2>
            <p class="text-surface-300"
              >"설정하기"를 누르면 전체 앱에 적용돼요.</p
            >
          </div>
          <FontSize />
        </div>
      </section>
      <UsageSteps />
      <!-- 시작하기 버튼 -->
      <div class="space-y-4">
        <!-- 프로필에서 온 경우에만 돌아가기 버튼 표시 -->
        <Btn
          v-if="isFromProfile"
          label="프로필로 돌아가기"
          color="surface"
          size="large"
          @click="handleBackToProfile"
        />
        <Btn
          v-else
          label="노후 설계 시작하기"
          color="secondary"
          size="large"
          @click="handleStart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router';
import TutorialHeader from './_components/TutorialHeader.vue';
import ServiceIntro from './_components/ServiceIntro.vue';
import UsageSteps from './_components/UsageSteps.vue';
import Btn from '@/components/buttons/Btn.vue';
import { useFontSize } from '@/utils/useFontSize';
import FontSize from './_components/FontSize.vue';

const router = useRouter();
const route = useRoute();

const isFromProfile = computed(() => route.query.from === 'profile');

// ⬇️ 기존 import 아래에 추가
import {
  loadKakaoMaps,
  createPlaces,
  keywordSearch,
  haversine,
  formatDistance,
  openMap,
} from '@/utils/kakaoMap';
import Question from '@/components/question/Question.vue';

// ⬇️ “가장 가까운 지점” 상태/타입
type Branch = {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  placeUrl: string;
};
const myPos = ref<{ lat: number; lng: number } | null>(null);
const nearestBranch = ref<Branch | null>(null);

// 현재 위치 가져오기
async function getMyPosition() {
  return await new Promise<GeolocationPosition>((resolve, reject) => {
    if (!('geolocation' in navigator))
      return reject(new Error('geolocation not supported'));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

// 지점 검색 실행
async function findNearest() {
  try {
    const pos = await getMyPosition();
    myPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };

    await loadKakaoMaps();
    const ps = createPlaces();

    const results = await keywordSearch(ps, 'KB골든라이프', {
      location: new window.kakao.maps.LatLng(myPos.value.lat, myPos.value.lng),
      radius: 10000, // 10km
    });

    if (!results?.length) {
      nearestBranch.value = null;
      return;
    }

    const branches: Branch[] = results.map((r: any) => {
      const lat = parseFloat(r.y);
      const lng = parseFloat(r.x);
      return {
        name: r.place_name,
        lat,
        lng,
        placeUrl: r.place_url,
        distance: haversine(myPos.value!.lat, myPos.value!.lng, lat, lng),
      };
    });

    branches.sort((a, b) => a.distance - b.distance);
    nearestBranch.value = branches[0];
  } catch (e) {
    console.error('가까운 지점 검색 실패:', e);
    nearestBranch.value = null;
  }
}

const {
  init: initFont,
  get: getFont,
  set: setFont,
  DEFAULT_PX,
} = useFontSize();

// 미리보기 전용 상태 (전역과 독립)
const previewPx = ref<number>(DEFAULT_PX);
let dirty = false; // 사용자가 미리보기를 수정했는지 표시

onMounted(() => {
  initFont(); // 전역 적용(기존 저장값) 먼저 불러옴
  previewPx.value = getFont(); // 미리보기 초기값 = 현재 전역값
});

// “노후 설계 시작하기” 누를 때도, 변경이 남아 있으면 적용 후 이동
const handleStart = () => {
  if (dirty) setFont(previewPx.value);
  router.push({ name: 'asset-start' });
  // console.log('시작하기 버튼 클릭됨');
  const fromProfile = route.query.from === 'profile';
  router.push({
    name: 'asset-start',
    query: fromProfile ? { from: 'profile' } : {},
  });
};

const handleBackToProfile = () => {
  router.push({ name: 'profile' });
};

// (선택) 라우터로 다른 페이지로 나갈 때도 변경이 남아 있으면 적용하고 나가고 싶다면:
onBeforeRouteLeave(() => {
  if (dirty) setFont(previewPx.value);
});
</script>
