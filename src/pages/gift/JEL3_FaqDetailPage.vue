<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">상속·증여</h2>
  <p class="text-primary-300 mb-8 text-xl font-semibold">자주 묻는 질문</p>

  <div v-if="currentFaq">
    <!-- 카테고리 -->
    <div class="mb-4">
      <span class="text-primary-500 text-lg font-semibold">
        {{ currentFaq.category === 'gift' ? '증여' : '상속' }}
      </span>
    </div>

    <!-- 질문 -->
    <h3 class="text-primary-500 mb-6 text-lg font-semibold">
      {{ currentFaq.title }}
    </h3>

    <!-- 답변 -->
    <div
      class="text-surface-600 mb-16 space-y-4 text-sm leading-relaxed"
      v-html="currentFaq.content"
    />

    <!-- 관련 질문 -->
    <div class="mb-16">
      <h4 class="mb-3 text-lg font-semibold">관련 질문</h4>
      <div class="space-y-2">
        <div
          v-for="related in relatedFaqs"
          :key="related.id"
          @click="goToFaqDetail(related.id)"
          class="border-surface-200 bg-surface-50 cursor-pointer rounded-xl border px-4 py-4"
        >
          <p class="text-surface-500 text-sm">{{ related.title }}</p>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import { api_data } from '@/api/gift/faqDetail';

const router = useRouter();
const route = useRoute();

// 현재 선택된 FAQ를 계산하는 computed 속성
const currentFaq = computed(() => {
  const id = Number(route.params.id);
  return api_data.find((faq) => faq.id === id) || null;
});

const relatedFaqs = computed(() => {
  if (!currentFaq.value) return [];
  return api_data
    .filter(
      (faq) =>
        faq.category === currentFaq.value?.category &&
        faq.id !== currentFaq.value?.id
    )
    .slice(0, 2);
});

const goToFaqDetail = (id: number) => {
  router.push({ name: 'gift-detail', params: { id } });
};

const goToStart = () => {
  router.push({ name: 'gift-start' });
};

// 컴포넌트 마운트 시 FAQ 데이터 로드
onMounted(() => {
  // 실제로는 여기서 API를 호출해서 FAQ 상세 정보를 가져올 것
});
</script>
