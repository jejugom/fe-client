<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">상속·증여</h2>
  <p class="text-primary-300 mb-8 text-xl font-semibold">자주 묻는 질문</p>

  <div v-if="currentFaq">
    <!-- 카테고리 -->
    <div class="mb-4">
      <span class="text-primary-500 text-lg font-semibold">
        {{ currentFaq.category === '증여' ? '증여' : '상속' }}
      </span>
    </div>

    <!-- 질문 -->
    <h3 class="text-primary-500 mb-6 text-lg font-semibold">
      {{ currentFaq.title }}
    </h3>

    <!-- 답변 -->
    <div
      class="text-surface-600 mb-16 space-y-4 text-base leading-relaxed"
      v-html="currentFaq.content"
    />

    <!-- 관련 질문 -->
    <div class="mb-16">
      <h4 class="mb-3 text-lg font-semibold">관련 질문</h4>
      <div class="space-y-2">
        <div
          v-for="related in relatedFaqs"
          :key="related.faqId"
          @click="goToFaqDetail(related.faqId)"
          class="border-surface-200 bg-surface-50 cursor-pointer rounded-lg border px-4 py-4"
        >
          <p class="text-surface-500 text-base">{{ related.title }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 하단 설명과 버튼 -->
  <div>
    <p class="text-primary-300 mb-2 text-center font-semibold">
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
import { getFaqById, getFaqList, type Faq } from '@/api/gift/faq';
import { useLoadingStore } from '@/stores/loading';

const router = useRouter();
const route = useRoute();
const loadingStore = useLoadingStore();

const currentFaq = ref<Faq | null>(null);
const relatedFaqs = ref<Faq[]>([]);
const allFaqs = ref<Faq[]>([]); // 전체 목록 캐싱

// FAQ 상세 + 관련 질문 계산
const fetchFaqDetail = async (id: number) => {
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
};

// 라우트 param 감시 (초기 실행 포함)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchFaqDetail(Number(newId));
  },
  { immediate: true }
);

const goToFaqDetail = (id: number) =>
  router.push({ name: 'gift-detail', params: { id } });
const goToStart = () => router.push({ name: 'gift-start' });
</script>
