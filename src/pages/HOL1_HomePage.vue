<!-- 노후도락 홈페이지: 로그인 상태별 맞춤형 UI 제공 -->
<template>
  <div class="flex flex-col gap-16">
    <!-- 비로그인 사용자를 대상 로그인 유도 -->
    <div v-if="!authStore.isLogin" class="card-design">
      <div class="space-y-4">
        <div class="text-primary-300 text-xl font-bold">
          노후도락에 오신 것을 환영합니다!
        </div>
        <p class="text-surface-500">
          카카오로 로그인해서 맞춤형 금융 서비스를 시작해보세요
        </p>
        <!-- 카카오 로그인 버튼 -->
        <div class="flex justify-center">
          <img
            :src="KakaoLoginBtn"
            alt="카카오 로그인"
            @click="() => authStore.startKakaoLogin()"
          /> </div
      ></div>
    </div>

    <!-- 로그인된 사용자를 위한 개인화된 인사 및 자산 정보 -->
    <div
      v-if="authStore.isLogin && homeData"
      class="card-design relative"
      @click="goToEditAsset"
    >
      <!-- 우측 상단 고정 아이콘 -->
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

    <!-- 맞춤형 서비스 카드 -->
    <section>
      <h2 class="text-primary-500 mb-4 text-2xl font-bold"
        >지금 필요한 것만, 딱 맞게 준비해요</h2
      >
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
            <img :src="card.src" />
          </template>
        </IconCard>
      </div>
    </section>

    <!-- 가장 가까운 골든라이프 -->
    <section v-if="nearestBranch">
      <div class="text-primary-500 mb-2 text-2xl font-bold">
        가장 가까운 골든라이프
      </div>
      <div
        class="stroke-secondary bg-gold flex items-center justify-between rounded-lg p-4"
      >
        <div>
          <div class="text-lg font-semibold text-white">{{
            nearestBranch.name
          }}</div>
          <div class="">
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
    </section>

    <!-- 하단 서비스 특징 -->
    <section class="card-design text-center">
      <div class="mb-4 p-4">
        <p class="text-primary-500 mb-4 text-2xl font-bold"
          >노후도락이 함께 챙겨드립니다</p
        >
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import Btn from '@/components/buttons/Btn.vue';
import { fetchHomeData, type HomeData } from '@/api/home';
import IconCard from '@/components/cards/IconCard.vue';
import Home1 from '@/assets/images/Home1.svg';
import Home2 from '@/assets/images/Home2.svg';
import Home3 from '@/assets/images/Home3.svg';
import Home4 from '@/assets/images/Home4.svg';
import Home5 from '@/assets/images/Home5.svg';
import Home6 from '@/assets/images/Home6.svg';
import KakaoLoginBtn from '@/assets/images/kakao_login_medium_wide.png';
import TextBtn from '@/components/buttons/TextBtn.vue';

/** Vue Router 인스턴스 - 페이지 네비게이션용 */
const router = useRouter();

/** 인증 상태 관리 store - 로그인 여부 확인 및 카카오 로그인 처리 */
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const homeData = ref<HomeData | null>(null);

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

/** 사용자 총 자산 - 로그인된 경우에만 실제 데이터 사용, 비로그인 시 0 */
const totalAsset = computed(() => homeData.value?.userSummary.asset ?? 0);

/**
 * 숫자를 한국 통화 형식으로 포맷팅
 * @param value 포맷팅할 숫자 (예: 1234567)
 * @returns 포맷팅된 문자열 (예: "1,234,567원")
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('ko-KR') + '원';
}

// 맞춤형 서비스 카드
const serviceCards = [
  {
    title: '노후준비',
    content1: '내가 쓸 돈, 내가 준비해요',
    content2: '연금부터 여유자금까지 차근차근 모아드려요',
    onClick: 'goToNohoo',
    src: Home1,
  },
  {
    title: '증여·상속',
    content1: '내가 원할 때, 원하는 만큼',
    content2: '가족에게 남기는 마음을 함께 설계해요',
    src: Home2,
    onClick: 'goToGift',
  },
  {
    title: '건강관리',
    content1: '아프면 돈이 더 들어요',
    content2: '지금부터 차근차근 챙겨요',
    onClick: 'goToEvent',
    src: Home3,
  },
];

// 서비스 카드 클릭 핸들러
const handlers: Record<string, () => void> = {
  goToNohoo: () => {
    router.push({ name: 'nohoo' });
  },
  goToGift: () => {
    router.push({ name: 'gift' });
  },
  goToEvent: () => {
    router.push({ name: 'event' });
  },
};

/**
 * 자산 등록 수정 페이지로 이동
 * 로그인된 사용자에게만 노출
 */
function goToEditAsset() {
  router.push({ name: 'edit-asset' });
}

// 하단 서비스 특징 설명 데이터
const features = [
  {
    keyword: '',
    suffix: '누르기만',
    description: '하면 끝!',
    src: Home4,
  },
  {
    keyword: '',
    suffix: '믿을 수 있는',
    description: '정보만',
    src: Home5,
  },
  {
    keyword: '',
    suffix: '나한테',
    description: '딱 맞는 상품',
    src: Home6,
  },
];

declare const kakao: any;

type Branch = {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  placeUrl: string;
};

const myPos = ref<{ lat: number; lng: number } | null>(null);
const nearestBranch = ref<Branch | null>(null);

/**
 * Haversine 공식을 사용한 두 지점 간 거리 계산
 * @param lat1 첫 번째 지점의 위도
 * @param lng1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lng2 두 번째 지점의 경도
 * @returns 두 지점 간 거리 (미터)
 */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3; // 지구 반지름 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * 미터 단위 거리를 읽기 쉬운 형태로 포맷팅
 * @param m 거리 (미터)
 * @returns 포맷팅된 거리 문자열 (예: "500m", "1.2km")
 */
function formatDistance(m: number) {
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
}

/**
 * 해당 지점을 카카오맵에서 새 창으로 열기
 * @param branch 지점 정보
 */
function openMap(branch: Branch) {
  window.open(branch.placeUrl, '_blank');
}

/**
 * 현재 위치 주변 KB골든라이프 지점 검색
 */
function searchNearestBranch() {
  if (!myPos.value) return;
  const ps = new kakao.maps.services.Places();

  ps.keywordSearch(
    'KB골든라이프',
    (data: any[], status: string) => {
      if (status !== kakao.maps.services.Status.OK) {
        // console.error('검색 실패');
        return;
      }
      const branches = data.map((item) => {
        const lat = parseFloat(item.y);
        const lng = parseFloat(item.x);
        return {
          name: item.place_name,
          lat,
          lng,
          placeUrl: item.place_url,
          distance: haversine(myPos.value!.lat, myPos.value!.lng, lat, lng),
        };
      });
      // 거리순 정렬 후 가장 가까운 1곳만
      branches.sort((a, b) => a.distance - b.distance);
      nearestBranch.value = branches[0];
    },
    {
      location: new kakao.maps.LatLng(myPos.value.lat, myPos.value.lng),
      radius: 10000, // 10km 범위
    }
  );
}

// 현재 위치 조회 및 가장 가까운 지점 검색
onMounted(() => {
  if (!('geolocation' in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      myPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      searchNearestBranch();
    },
    (_err) => {
      // console.error('위치 조회 실패', _err);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});
</script>
