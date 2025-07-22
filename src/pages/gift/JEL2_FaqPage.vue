<template>
  <div class="px-5 py-6">
    <!-- 타이틀 -->
    <h2 class="text-primary mb-1 text-xl font-bold">상속·증여</h2>
    <p class="mb-6 text-sm text-gray-600">자주 묻는 질문</p>

    <!-- 검색 섹션 -->
    <div class="mb-6">
      <div class="mb-4 flex items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="무엇이 궁금하신가요? (예: 보험)"
          class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          @keypress.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          class="rounded-lg bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          검색
        </button>
      </div>

      <!-- 카테고리 탭 -->
      <div class="flex">
        <button
          @click="toggleTab('gift')"
          :class="[
            'mr-1 w-1/2 rounded-lg border px-4 py-4 text-xl font-semibold transition-colors',
            activeTab === 'gift'
              ? 'border-blue-300 bg-blue-100 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
          ]"
        >
          증여
        </button>

        <button
          @click="toggleTab('inheritance')"
          :class="[
            'ml-1 w-1/2 rounded-lg border px-4 py-4 text-xl font-semibold transition-colors',
            activeTab === 'inheritance'
              ? 'border-yellow-300 bg-yellow-100 text-yellow-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
          ]"
        >
          상속
        </button>
      </div>
    </div>

    <!-- FAQ 목록 -->
    <div class="space-y-3">
      <div
        v-for="faq in filteredFaqs"
        :key="faq.id"
        class="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 py-8 shadow-sm transition hover:bg-gray-50"
        @click="goToFaqDetail(faq.id)"
      >
        <div class="flex items-start gap-3">
          <!-- 왼쪽 카테고리 뱃지 -->
          <span
            :class="[
              'text-ml min-w-[52px] rounded px-2 py-0.5 text-center font-medium',
              faq.category === 'gift'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-yellow-100 text-yellow-600',
            ]"
          >
            {{ faq.category === 'gift' ? '증여' : '상속' }}
          </span>

          <!-- 오른쪽 질문 텍스트 -->
          <p class="text-lg leading-snug font-medium text-gray-800">
            {{ faq.question }}
          </p>
        </div>
      </div>
    </div>

    <!-- FAQ가 없을 때 -->
    <div v-if="filteredFaqs.length === 0" class="py-10 text-center">
      <p class="text-sm text-gray-500">
        {{
          searchQuery
            ? '검색 결과가 없습니다.'
            : '해당 카테고리에 FAQ가 없습니다.'
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 반응형 데이터
const searchQuery = ref('');
const activeTab = ref<'all' | 'gift' | 'inheritance'>('all');

function toggleTab(tab: 'gift' | 'inheritance') {
  activeTab.value = activeTab.value === tab ? 'all' : tab;
}

// FAQ 데이터
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
  {
    id: 4,
    category: 'inheritance',
    question: '상속세는 언제 내야 하나요?',
    answer: '상속이 개시된 날로부터 6개월 이내에 신고하고 납부해야 합니다...',
  },
  {
    id: 5,
    category: 'inheritance',
    question: '배우자와 자녀가 상속을 받을 때 비율이 어떻게 되나요?',
    answer:
      '민법에 따라 배우자와 직계비속이 공동상속인인 경우 동등한 상속분을 가집니다...',
  },
  {
    id: 6,
    category: 'inheritance',
    question: '미리 상속 계획을 세우면 어떤 점이 좋은가요?',
    answer:
      '사전 상속계획을 통해 세금을 절약하고 가족 간 분쟁을 예방할 수 있습니다...',
  },
]);

// 필터링된 FAQ 목록
const filteredFaqs = computed(() => {
  let faqs = faqData.value;

  if (activeTab.value !== 'all') {
    faqs = faqs.filter((faq) => faq.category === activeTab.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    faqs = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    );
  }

  return faqs;
});

// 메서드
const handleSearch = () => {
  // 검색 로직 (이미 computed에서 처리됨)
  console.log('검색:', searchQuery.value);
};

const goToFaqDetail = (faqId: number) => {
  router.push({
    name: 'gift-detail',
    params: { id: faqId },
  });
};
</script>
