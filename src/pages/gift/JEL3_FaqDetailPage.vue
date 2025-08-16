<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-500 mb-8 text-2xl font-bold"
    >많이 물어보신 질문이에요</h2
  >

  <div v-if="currentFaq" class="card-design py-8">
    <!-- 카테고리 -->
    <div class="mb-4">
      <span
        class="rounded-lg px-4 py-2 text-xl font-semibold"
        :class="{
          'bg-secondary-100': currentFaq.category === '상속',
          'bg-primary-100': currentFaq.category === '증여',
        }"
      >
        {{ currentFaq.category === '증여' ? '증여' : '상속' }}
      </span>
    </div>

    <!-- 질문 -->
    <h3 class="text-primary-500 mb-8 text-lg font-semibold">
      {{ currentFaq.title }}
    </h3>

    <!-- 답변 -->
    <div
      class="text-surface-600 faq-content mb-16 space-y-4 text-base leading-relaxed"
      v-html="currentFaq.content"
    />

    <!-- 관련 질문 -->
    <div>
      <h4 class="mb-4 text-lg font-semibold">관련 질문</h4>
      <div class="space-y-2">
        <div
          v-for="related in relatedFaqs"
          :key="related.faqId"
          @click="goToFaqDetail(related.faqId)"
          class="btn-pressed border-surface-200 rounded-lg border bg-white px-4 py-4"
        >
          <p>{{ related.title }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 하단 설명과 버튼 -->
  <div class="mt-16">
    <p class="text-primary-500 mb-2 text-center font-semibold">
      나는 세금 얼마나 나올까?
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
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import { getFaqById, getFaqList } from '@/api/gift/faq';
import type { Faq } from '@/types/gift/faq';
import { useLoadingStore } from '@/stores/loading';

const router = useRouter();
const route = useRoute();
const loadingStore = useLoadingStore();

const currentFaq = ref<Faq | null>(null);
const relatedFaqs = ref<Faq[]>([]);
const allFaqs = ref<Faq[]>([]); // 전체 목록 캐싱

// FAQ 상세 + 관련 질문 계산
async function fetchFaqDetail(id: number) {
  loadingStore.startLoading();
  try {
    // 1) 상세 조회
    const { data } = await getFaqById(id);
    currentFaq.value = data;

    // 2) 전체 목록 캐싱
    if (!allFaqs.value.length) {
      const listRes = await getFaqList();
      allFaqs.value = listRes.data;
    }

    // 3) 같은 카테고리 목록에서 관련 질문 찾기
    const sameCategoryFaqs = allFaqs.value
      .filter((f) => f.category === data.category)
      .sort((a, b) => a.faqId - b.faqId);

    const currentIndex = sameCategoryFaqs.findIndex(
      (f) => f.faqId === data.faqId
    );

    // 이전/다음 FAQ 1개씩
    if (currentIndex !== -1) {
      relatedFaqs.value = [
        sameCategoryFaqs[currentIndex - 1],
        sameCategoryFaqs[currentIndex + 1],
      ].filter(Boolean); // undefined 제거
    } else {
      relatedFaqs.value = [];
    }
  } catch (err) {
    console.error('FAQ 상세조회 에러:', err);
  } finally {
    loadingStore.stopLoading();
  }
}

// 라우트 param 감시 (초기 실행 포함)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchFaqDetail(Number(newId));
  },
  { immediate: true }
);

function goToFaqDetail(id: number) {
  router.push({ name: 'gift-detail', params: { id } });
}
function goToStart() {
  router.push({ name: 'gift-start' });
}
</script>

<style scoped>
/* 공통 폰트/간격 */
.faq-content {
  --tw-leading: var(--leading-relaxed) /* 1.625 */;
  line-height: var(--leading-relaxed);
  font-size: 1rem;
}

/* 문단 스타일 */
.faq-content :deep(p) {
  text-indent: 0.5em; /* 첫 문단 들여쓰기 */
}

/* 굵은 글씨 강조 */
.faq-content :deep(strong) {
  font-weight: semibold;
}

/* 리스트 스타일 */
.faq-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1rem;
}
.faq-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1rem;
}

.faq-content :deep(li) {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* 표 스타일 */
.faq-content :deep(table) {
  font-size: 1rem;
  border-collapse: collapse;
  width: 100%;
}
.faq-content :deep(th),
.faq-content :deep(td) {
  border: 1px solid #dedede;
  padding: 0.5rem;
  text-align: center;
}
.faq-content :deep(th) {
  background-color: #17314c;
  color: white;
}
</style>
