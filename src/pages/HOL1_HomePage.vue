<!--
  노후도락 홈페이지
  
  사용자의 로그인 상태에 따라 다른 UI를 제공해야함
  - 비로그인: 카카오 로그인 유도 메시지 및 버튼
  - 로그인: 개인화된 인사말, 자산 정보, 맞춤형 서비스 제공
-->
<template>
  <div>
    <!-- 비로그인 사용자를 대상 로그인 유도 -->
    <div
      v-if="!authStore.isLogin"
      class="border-primary-300 mb-8 rounded-xl border bg-white p-4"
    >
      <div class="space-y-4">
        <div class="text-primary-300 text-xl font-semibold">
          노후도락에 오신 것을 환영합니다!
        </div>
        <p class="text-surface-500 text-base">
          카카오로 로그인해서 맞춤형 금융 서비스를 시작해보세요
        </p>
        <!-- 카카오 로그인 버튼 - auth store를 통해 OAuth2.0 플로우 시작 -->
        <!-- 현재 구현방식 - 서버사이드 (백엔드에서 모든 로직 처리) -->
        <!-- 백엔드에서 처리 후에 [ jwt 토큰, 신규사용자 여부, 리다이렉트 주소] 전달 -->
        <!-- 강사님 피드백 (고도화때 처리)
       1. 로그인 요청을 백엔드로 보내고 필터로 가로채서 구현
       2. 주소에 jwt 토큰 정보 담기는것을 막기위해 httpOnly 쿠키로 보낼 것
       -->

        <!-- <Btn
        color="secondary"
        label="카카오 시작하기"
        size="large"
        @click="authStore.startKakaoLogin"
        class="w-full"
      /> -->
        <div class="flex justify-center">
          <img
            :src="KakaoLoginBtn"
            alt="카카오 로그인"
            @click="authStore.startKakaoLogin"
          /> </div
      ></div>
    </div>

    <!-- 로그인된 사용자를 위한 개인화된 인사 및 자산 정보 -->
    <div
      v-if="authStore.isLogin && homeData"
      class="border-primary-300 mb-2 rounded-xl border bg-white p-4"
    >
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

    <!-- 자산 관리 버튼 - 로그인된 사용자에게만 표시 -->
    <Btn
      v-if="authStore.isLogin"
      class="mb-8"
      color="secondary"
      label="자산 추가 등록·수정"
      size="large"
      @click="goToEditAsset"
    />

    <!-- 맞춤형 서비스 카드 -->
    <section class="mb-16">
      <h2 class="text-primary-300 mb-4 text-2xl font-bold"
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
          class="border-secondary-300 border shadow-none"
          @click="handlers[card.onClick]"
        >
          <template #icon>
            <img :src="card.src" />
          </template>
        </IconCard>
      </div>
    </section>

    <!-- 금융상품 캐러셀 -->
    <section class="mb-16">
      <h2 class="text-primary-300 mb-4 text-2xl font-bold">
        내가 쓸 돈, 미리 챙겨두는 3가지 방법
      </h2>
      <Top3Products :items="slides" />
    </section>

    <!-- 광고 배너 -->
    <img
      :src="AdBanner"
      alt="광고 배너"
      class="mb-16 h-30 w-full object-cover"
    />

    <!-- 하단 서비스 특징 -->
    <section class="border-secondary-300 rounded-xl border p-4 text-center">
      <div class="mb-4 p-4">
        <p class="text-primary-300 mb-4 text-2xl font-semibold"
          >노후도락과 함께 챙겨드립니다</p
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
import Top3Products from '@/components/cards/Top3ProductsCard.vue';
import Btn from '@/components/buttons/Btn.vue';
import { fetchHomeData, type HomeData } from '@/api/home';
import IconCard from '@/components/cards/IconCard.vue';
import AdBanner from '@/assets/images/AdBanner.png';
import Home1 from '@/assets/images/Home1.svg';
import Home2 from '@/assets/images/Home2.svg';
import Home3 from '@/assets/images/Home3.svg';
import Home4 from '@/assets/images/Home4.svg';
import Home5 from '@/assets/images/Home5.svg';
import Home6 from '@/assets/images/Home6.svg';
import KakaoLoginBtn from '@/assets/images/kakao_login_medium_wide.png';

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
      console.error('홈 데이터 요청 실패', error);
      loadingStore.setError(true);
    } finally {
      loadingStore.stopLoading();
    }
  }
});

/** 사용자 총 자산 - 로그인된 경우에만 실제 데이터 사용, 비로그인 시 0 */
const totalAsset = computed(() => homeData.value?.userSummary.asset ?? 0);

/**
 * @param value "1234567"
 * @returns "1,234,567원"
 */
const formatCurrency = (value: number): string => {
  return value.toLocaleString('ko-KR') + '원';
};

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
const goToEditAsset = () => {
  router.push({ name: 'edit-asset' });
};

// 맞춤형 금융상품
const slides = computed(() => {
  if (!homeData.value) return [];
  return homeData.value.recommandTop3.map((product) => ({
    prod_name: product.fin_prdt_nm,
    description: product.prdt_feature,
    rate: product.intr_rate,
  }));
});

// 하단 노후도락 설명
const features = [
  {
    image: '',
    keyword: '',
    suffix: '누르기만',
    description: '하면 끝!',
    src: Home4,
  },
  {
    image: '',
    keyword: '',
    suffix: '믿을 수 있는',
    description: '정보만',
    src: Home5,
  },
  {
    image: '',
    keyword: '',
    suffix: '나한테',
    description: '딱 맞는 상품',
    src: Home6,
  },
];
</script>
