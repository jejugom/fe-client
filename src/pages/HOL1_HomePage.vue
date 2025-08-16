<template>
  <div class="flex flex-col gap-16">
    <div v-if="!authStore.isLogin" class="card-design">
      <div class="space-y-4">
        <div class="text-primary-300 text-xl font-bold">
          노후도락에 오신 것을 환영합니다!
        </div>
        <p class="text-surface-500">
          간편 로그인으로 맞춤형 금융 서비스를 시작해보세요
        </p>
        <div class="flex items-center justify-center gap-4">
          <img
            :src="KakaoLoginBtn"
            alt="카카오 로그인"
            @click="() => authStore.startKakaoLogin()"
            class="btn-pressed block h-12 w-48 cursor-pointer object-contain"
          />
          <img
            :src="NaverLoginBtn"
            alt="네이버 로그인"
            @click="showNaverAlert"
            class="btn-pressed block h-12 w-48 cursor-pointer"
          />
        </div>
      </div>
    </div>

    <div
      v-if="authStore.isLogin && homeData"
      class="card-design relative"
      @click="goToEditAsset"
    >
      <TextBtn
        color="surface"
        label="더보기 ➜"
        size="small"
        class="absolute top-4 right-4"
      />

      <div class="text-primary-300 mb-4 text-lg font-semibold">
        {{ homeData.userSummary.name }}님
        <span class="text-surface-500">안녕하세요!</span>
      </div>
      <div class="space-y-1">
        <p class="text-surface-300 font-semibold">내 자산</p>
        <p class="text-surface-500 font-semibold">
          {{ formatCurrency(totalAsset) }}
        </p>
      </div>
    </div>

    <div>
      <h2 class="text-primary-500 mb-4 text-2xl font-bold">
        필요한 것만, 딱 맞게 준비해요
      </h2>
      <div class="space-y-4">
        <IconCard
          v-for="(card, index) in serviceCards"
          :key="index"
          :title="card.title"
          :content1="card.content1"
          :content2="card.content2"
          color="secondary"
          @click="handlers[card.onClick]"
        >
          <template #icon>
            <img :src="card.src" class="h-16 w-16" />
          </template>
        </IconCard>
      </div>
    </div>

    <div v-if="authStore.isLogin" ref="nearestBranchSection">
      <div class="text-primary-500 mb-2 text-2xl font-bold"
        >가장 가까운 골든라이프</div
      >
      <LoaderGoldenLife v-if="isBranchLoading" />
      <div
        v-if="!isBranchLoading && nearestBranch"
        class="stroke-secondary bg-gold flex items-center justify-between rounded-lg p-4"
      >
        <div>
          <div class="text-lg font-semibold text-white">{{
            nearestBranch.name
          }}</div>
          <div>
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
      <div
        v-if="!isBranchLoading && !nearestBranch && branchSearchAttempted"
        class="card-design text-surface-400 text-center"
      >
        주변에 골든라이프 지점이 없습니다.
      </div>
    </div>

    <section class="card-design text-center">
      <div class="mb-4 p-4">
        <p class="text-primary-500 mb-4 text-2xl font-bold">
          노후도락이 함께 챙겨드립니다
        </p>
        <p class="text-surface-400 text-base">
          자산은 얼마나 있는지, 어떤 상품이 나에게 좋은지<br />
          이제 복잡하지 않게 하나씩 알려드릴게요
        </p>
      </div>

      <div class="flex justify-around">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex h-38 w-28 flex-col items-center justify-center"
        >
          <img :src="feature.src" class="mb-2 h-16 w-16" />
          <div class="flex flex-col items-center text-center">
            <div>
              <span class="text-secondary-300 font-semibold">{{
                feature.keyword
              }}</span
              >{{ feature.suffix }}
            </div>
            <div>{{ feature.description }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 네이버 로그인 알림 모달 -->
    <Alert v-if="showNaverModal" title="안내" @click="closeNaverAlert">
      서비스 준비중입니다!
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { fetchHomeData } from '@/api/home';
import type { HomeData } from '@/types/home';
import IconCard from '@/components/cards/IconCard.vue';
import Btn from '@/components/buttons/Btn.vue';
import TextBtn from '@/components/buttons/TextBtn.vue';

import Alert from '@/components/modals/Alert.vue';

import LoaderGoldenLife from '@/components/loaders/LoaderGoldenLife.vue';

import Home1 from '@/assets/images/Home1.svg';
import Home2 from '@/assets/images/Home2.svg';
import Home3 from '@/assets/images/Home3.svg';
import Home4 from '@/assets/images/Home4.svg';
import Home5 from '@/assets/images/Home5.svg';
import Home6 from '@/assets/images/Home6.svg';
import KakaoLoginBtn from '@/assets/images/kakao_login.png';
import NaverLoginBtn from '@/assets/images/naver_login.png';

// Kakao 지도 & 위치 유틸
import {
  haversine,
  formatDistance,
  openMap,
  getCurrentPosition,
  loadKakaoMaps,
  createPlaces,
  keywordSearch,
  whenInView,
} from '@/utils/kakaoMap';

//  로그인 상태
const router = useRouter();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

// 홈 데이터
const homeData = ref<HomeData | null>(null);

// 네이버 로그인 알림 모달
const showNaverModal = ref(false);

function showNaverAlert() {
  showNaverModal.value = true;
}

function closeNaverAlert() {
  showNaverModal.value = false;
}

// 마운트 시 초기 데이터 로드
onMounted(async () => {
  if (authStore.isLogin) {
    loadingStore.startLoading();
    try {
      homeData.value = await fetchHomeData();
    } catch (error) {
      // console.error('홈 데이터 요청 실패', error);
      loadingStore.setError(true);
    } finally {
      loadingStore.stopLoading();
    }
  }
});

// 총 자산
const totalAsset = computed(() => homeData.value?.userSummary.asset ?? 0);
const formatCurrency = (value: number) => value.toLocaleString('ko-KR') + '원';

// 서비스 카드
const serviceCards = [
  {
    title: '노후준비',
    content1: '내가 쓸 돈, 내가 준비',
    content2: '연금부터 여유자금까지 차근차근 모아드려요',
    onClick: 'goToNohoo',
    src: Home1,
  },
  {
    title: '증여·상속',
    content1: '원할 때, 원하는 만큼',
    content2: '가족에게 남기는 마음을 함께 설계해요',
    src: Home2,
    onClick: 'goToGift',
  },
  {
    title: '생활편의',
    content1: '더 편안한 생활',
    content2: '하루하루를 활기차게 만들어드려요',
    onClick: 'goToEvent',
    src: Home3,
  },
] as const;

// 서비스 카드 클릭 핸들러
const handlers: Record<string, () => void> = {
  goToNohoo: () => router.push({ name: 'nohoo' }),
  goToGift: () => router.push({ name: 'gift' }),
  goToEvent: () => router.push({ name: 'event' }),
};

// 자산 수정 페이지로 이동
const goToEditAsset = () => router.push({ name: 'edit-asset' });

/** 하단 특징 */
const features = [
  { keyword: '', suffix: '누르기만', description: '하면 끝!', src: Home4 },
  { keyword: '', suffix: '믿을 수 있는', description: '정보만', src: Home5 },
  { keyword: '', suffix: '나한테', description: '딱 맞는 상품', src: Home6 },
];

// 지점 정보
type Branch = {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  placeUrl: string;
};

const myPos = ref<{ lat: number; lng: number } | null>(null);
const nearestBranch = ref<Branch | null>(null);
const nearestBranchSection = ref<HTMLElement | null>(null);
const isBranchLoading = ref(false);
const branchSearchAttempted = ref(false);
let branchInitDone = false;

// 가장 가까운 지점 검색
async function searchNearestBranch() {
  if (!myPos.value) return;
  try {
    await loadKakaoMaps();
    const ps = createPlaces();

    const results = await keywordSearch(ps, 'KB골든라이프', {
      location: new window.kakao.maps.LatLng(myPos.value.lat, myPos.value.lng),
      radius: 10000,
    });

    if (!results.length) return;
    const branches = results.map((item: any) => {
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);
      return {
        name: item.place_name,
        lat,
        lng,
        placeUrl: item.place_url,
        distance: haversine(myPos.value!.lat, myPos.value!.lng, lat, lng),
      } as Branch;
    });
    branches.sort((a, b) => a.distance - b.distance);
    nearestBranch.value = branches[0];
  } catch (err) {
    console.error('지점 검색 실패', err);
  }
}

// 가장 가까운 지점 검색을 1회만 실행
async function runNearestBranchSearchOnce() {
  if (branchInitDone) return;
  isBranchLoading.value = true;
  branchSearchAttempted.value = false;
  try {
    const pos = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    myPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    await searchNearestBranch();
    branchInitDone = true;
  } catch (err) {
    console.error('위치 조회 실패', err);
  } finally {
    isBranchLoading.value = false;
    branchSearchAttempted.value = true;
  }
}

// 가장 가까운 지점 검색을 1회만 실행
watch(
  () => authStore.isLogin,
  async (loggedIn) => {
    if (!loggedIn) return;
    await nextTick(); // 섹션 ref가 연결되길 대기
    const el = nearestBranchSection.value;
    if (el) {
      whenInView(el, runNearestBranchSearchOnce);
    } else {
      // 혹시 ref가 없다면 바로 실행
      runNearestBranchSearchOnce();
    }
  },
  { immediate: true } // 이미 로그인 상태로 진입했을 때도 실행
);

// 노출할 것들 정의
defineExpose({
  KakaoLoginBtn,
  formatCurrency,
  totalAsset,
  serviceCards,
  handlers,
  goToEditAsset,
  features,
  nearestBranch,
  nearestBranchSection,
  formatDistance,
  openMap,
});
</script>
