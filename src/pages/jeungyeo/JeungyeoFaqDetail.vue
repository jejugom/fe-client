<template>
  <div class="px-5 py-6">
    <!-- 뒤로가기 버튼 -->
    <div class="mb-4">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="text-sm">돌아가기</span>
      </button>
    </div>

    <!-- 타이틀 -->
    <h2 class="text-primary mb-2 text-xl font-semibold">상속·증여</h2>
    <p class="mb-6 text-sm text-gray-700">자주 묻는 질문</p>

    <!-- FAQ 상세 내용 -->
    <div v-if="currentFaq">
      <!-- 카테고리 태그 -->
      <div class="mb-4">
        <span
          :class="[
            'inline-block rounded-full px-3 py-1 text-xs font-medium',
            currentFaq.category === 'gift'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-green-100 text-green-600',
          ]"
        >
          {{ currentFaq.category === 'gift' ? '증여' : '상속' }}
        </span>
      </div>

      <!-- 질문 -->
      <h3 class="mb-6 text-lg font-semibold text-gray-800">
        {{ currentFaq.question }}
      </h3>

      <!-- 답변 (우선은 하나의 일괄 답변만)-->
      <div class="mb-8 space-y-4">
        <p class="text-sm leading-relaxed text-gray-700">
          네, 손주에게 돈을 주는 것도 '증여'로 보고 세금이 날 수 있습니다.
        </p>

        <p class="text-sm leading-relaxed text-gray-700">
          다만, 일정 금액까지는 세금 없이 줄 수 있는 한도가 정해져 있습니다.
        </p>

        <p class="text-sm leading-relaxed text-gray-700">예를 들어,</p>

        <ul class="ml-4 space-y-1 text-sm text-gray-700">
          <li class="flex items-start gap-2">
            <span class="mt-1 block h-1 w-1 rounded-full bg-gray-400"></span>
            <span>손주가 미성년자일 경우: 10년 동안 2,000만 원까지</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 block h-1 w-1 rounded-full bg-gray-400"></span>
            <span>손주가 성인일 경우: 10년 동안 5,000만 원까지</span>
          </li>
        </ul>

        <p class="text-sm leading-relaxed text-gray-700">
          이 범위 안에서 주시면 세금이 없습니다.<br />
          하지만 이 금액을 넘으면, 초과한 부분에 대해 증여세를 내야 합니다.
        </p>

        <p class="text-sm leading-relaxed text-gray-700">
          또한 손주가 아닌 자녀를 통해 간접적으로 주는 경우에도 세금이 생길 수
          있으니<br />
          10년 단위로 얼마를 주었는지 기록해두는 것이 중요합니다.
        </p>
      </div>

      <!-- 관련 도구 추천 -->
      <div class="mb-8 rounded-lg border border-blue-200 p-4">
        <h4 class="mb-3 text-base font-semibold text-blue-800">
          내 경우에는 어떻게 될까?
        </h4>
        <button
          @click="goToStart"
          class="w-full rounded-md bg-blue-100 py-3 font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
        >
          증여 계획 미리 계산해보기
        </button>
      </div>

      <!-- 관련 FAQ -->
      <div class="mb-8">
        <h4 class="mb-4 text-base font-semibold text-gray-800">관련 질문</h4>
        <div class="space-y-2">
          <div
            v-for="relatedFaq in relatedFaqs"
            :key="relatedFaq.id"
            @click="goToFaqDetail(relatedFaq.id)"
            class="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
          >
            <p class="text-sm text-gray-700">{{ relatedFaq.question }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ를 찾을 수 없는 경우 -->
    <div v-else class="py-8 text-center">
      <p class="text-sm text-gray-500">요청하신 FAQ를 찾을 수 없습니다.</p>
      <button
        @click="goBack"
        class="mt-4 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        목록으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 라우트 파라미터 받기 방법 1: useRoute() 사용
const router = useRouter();
const route = useRoute();

// 라우트 파라미터 받기 방법 2: props 사용 (router에서 props: true 설정 시)
interface Props {
  id?: string;
}
const props = defineProps<Props>();

// FAQ 데이터 (실제로는 API에서 가져올 데이터)
const faqData = ref([
  {
    id: 1,
    category: 'gift',
    question: '손주에게 돈을 줄 때 세금이 나오나요?',
    answer: '네, 손주에게 돈을 주는 것도 증여로 보고 세금이 날 수 있습니다...',
  },
  {
    id: 2,
    category: 'gift',
    question: '몇 년마다 나눠서 세금을 줄일 수 있나요?',
    answer:
      '증여세 절약을 위해 10년 주기로 나누어 증여하는 것이 효과적입니다...',
  },
  {
    id: 3,
    category: 'gift',
    question: '집이나 땅을 자녀에게 줄 때 어떤 절차가 필요하나요?',
    answer:
      '부동산 증여시에는 증여계약서 작성, 신고, 등기 절차가 필요합니다...',
  },
]);

// 현재 FAQ - 두 가지 방법 중 선택
const currentFaq = computed(() => {
  // 방법 1: useRoute() 사용
  const faqId = parseInt(route.params.id as string);

  // 방법 2: props 사용 (위에서 props를 정의했을 경우)
  // const faqId = parseInt(props.id || '0')

  return faqData.value.find((faq) => faq.id === faqId);
});

// 관련 FAQ (같은 카테고리의 다른 FAQ들)
const relatedFaqs = computed(() => {
  if (!currentFaq.value) return [];

  return faqData.value
    .filter(
      (faq) =>
        faq.category === currentFaq.value?.category &&
        faq.id !== currentFaq.value?.id
    )
    .slice(0, 3); // 최대 3개만
});

// 메서드
const goBack = () => {
  router.go(-1); // 이전 페이지로
};

const goToFaqDetail = (faqId: number) => {
  router.push(`/jeungyeo/faq/${faqId}`);
};

const goToStart = () => {
  router.push('/jeungyeo/start');
};

// 컴포넌트 마운트 시 FAQ 데이터 로드
onMounted(() => {
  // 실제로는 여기서 API를 호출해서 FAQ 상세 정보를 가져올 것
});
</script>
