<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">상속·증여</h2>
  <p class="text-primary-300 mb-2 text-xl font-semibold">자주 묻는 질문</p>
  <div class="h-8"></div>

  <!-- FAQ 상세 내용 -->
  <div v-if="currentFaq">
    <!-- 카테고리 태그 -->
    <div class="mb-4">
      <span class="text-primary-500 text-lg font-semibold">
        {{ currentFaq.category === 'gift' ? '증여' : '상속' }}
      </span>
    </div>

    <!-- 질문 -->
    <h3 class="text-primary-500 mb-6 text-lg font-semibold">
      {{ currentFaq.question }}
    </h3>

    <!-- 답변 (우선은 하나의 일괄 답변만)-->
    <div class="mb-16 space-y-4">
      <p class="text-surface-500 text-sm">
        네, 손주에게 돈을 주는 것도 '증여'로 보고 세금이 날 수 있습니다.
      </p>

      <p class="text-surface-500 text-sm">
        다만, 일정 금액까지는 세금 없이 줄 수 있는 한도가 정해져 있습니다.
      </p>

      <p class="text-surface-500 text-sm">예를 들어,</p>

      <ul class="text-surface-500 ml-6 list-disc space-y-1 text-sm">
        <li>손주가 미성년자일 경우: 10년 동안 2,000만 원까지</li>
        <li>손주가 성인일 경우: 10년 동안 5,000만 원까지</li>
      </ul>

      <p class="text-surface-500 text-sm">
        이 범위 안에서 주시면 세금이 없습니다.<br />
        하지만 이 금액을 넘으면, 초과한 부분에 대해 증여세를 내야 합니다.
      </p>

      <p class="text-surface-500 text-sm">
        또한 손주가 아닌 자녀를 통해 간접적으로 주는 경우에도 세금이 생길 수
        있으니<br />
        10년 단위로 얼마를 주었는지 기록해두는 것이 중요합니다.
      </p>
    </div>
    <!-- 관련 FAQ -->
    <div class="mb-8">
      <h4 class="text-surface-500 mb-3 text-lg font-semibold">관련 질문</h4>
      <div class="space-y-2">
        <div
          v-for="relatedFaq in relatedFaqs"
          :key="relatedFaq.id"
          @click="goToFaqDetail(relatedFaq.id)"
          class="border-surface-200 bg-surface-50 cursor-pointer rounded-xl border px-4 py-4"
        >
          <p class="text-surface-500 text-sm">{{ relatedFaq.question }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 하단 설명과 버튼 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <p class="text-primary-300 mb-3 text-center text-lg font-semibold">
      내 경우에는 어떻게 될까?
    </p>
    <Btn
      @click="goToStart"
      color="primary"
      label="증여 계획 미리 계산해보기"
      size="large"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

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

// 현재 선택된 FAQ를 계산하는 computed 속성
const currentFaq = computed(() => {
  const idParam = route.params.id;
  const faqId = Number(idParam);

  // id가 숫자가 아니면 null 반환
  if (isNaN(faqId)) return null;

  return faqData.value.find((faq) => faq.id === faqId) || null;
});

// 관련 FAQ (같은 카테고리의 다른 FAQ들) -> 로직 수정해야함
const relatedFaqs = computed(() => {
  if (!currentFaq.value) return [];

  return faqData.value
    .filter(
      (faq) =>
        faq.category === currentFaq.value?.category &&
        faq.id !== currentFaq.value?.id
    )
    .slice(0, 2);
});

// 메서드
const goBack = () => {
  router.go(-1); // 이전 페이지로
};

const goToFaqDetail = (faqId: number) => {
  router.push({
    name: 'gift-detail',
    params: { id: faqId },
  });
};

const goToStart = () => {
  router.push({ name: 'gift-start' });
};

// 컴포넌트 마운트 시 FAQ 데이터 로드
onMounted(() => {
  // 실제로는 여기서 API를 호출해서 FAQ 상세 정보를 가져올 것
});
</script>
