<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-300 mb-4 text-2xl font-bold">상속·증여</h2>
  <p class="text-primary-300 mb-8 text-xl font-semibold"
    >많이 물어보신 질문이에요
  </p>

  <!-- 검색 섹션 -->
  <div class="mb-6">
    <div class="mb-4 flex items-center gap-2">
      <InputBox
        placeholder="궁금한 점을 검색해보세요 (예: 세금, 보험)"
        size="large"
        type="text"
        v-model="searchQuery"
        @keypress.enter="handleSearch"
      />
      <Btn color="primary" label="검색" size="square" @click="handleSearch" />
    </div>
  </div>
  <!-- 카테고리 탭 -->
  <div class="mb-4 flex">
    <FaqTab
      :is-active="activeTab === 'gift'"
      side="left"
      @click="toggleTab('gift')"
    >
      증여
    </FaqTab>

    <FaqTab
      :is-active="activeTab === 'inheritance'"
      side="right"
      @click="toggleTab('inheritance')"
    >
      상속
    </FaqTab>
  </div>
  <!-- FAQ 목록 -->
  <div class="space-y-4">
    <FaqCard
      @click="goToFaqDetail(faq.faqId)"
      v-for="faq in filteredFaqs"
      :key="faq.faqId"
      :id="faq.faqId"
      :category="faq.category"
      :question="faq.title"
    />
  </div>

  <!-- FAQ가 없을 때 -->
  <div v-if="filteredFaqs.length === 0" class="py-10 text-center">
    <p class="text-sm text-gray-500">
      {{ searchQuery ? '검색 결과가 없습니다.' : 'FAQ가 없습니다.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import InputBox from '@/components/forms/InputBox.vue';
import FaqCard from './_components/FaqCard.vue';
import FaqTab from './_components/FaqTab.vue';
import { api_data } from '@/api/gift/faq';
import type { Faq } from '@/api/gift/faq';

const faqData = ref<Faq[]>(api_data);

const router = useRouter();

// 검색어 및 탭 상태
const searchQuery = ref('');
const activeTab = ref<'all' | 'gift' | 'inheritance'>('all');

// 탭 토글
function toggleTab(tab: 'gift' | 'inheritance') {
  activeTab.value = activeTab.value === tab ? 'all' : tab;
}

const categoryMap = {
  gift: '증',
  inheritance: '상',
};

// 검색 필터링
const filteredFaqs = computed(() => {
  let faqs = faqData.value;

  if (activeTab.value !== 'all') {
    const mappedCategory = categoryMap[activeTab.value];
    faqs = faqs.filter((faq) => faq.category === mappedCategory);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    faqs = faqs.filter((faq) => faq.title.toLowerCase().includes(q));
  }

  return faqs;
});

// 검색 버튼 또는 Enter 입력 시
const handleSearch = () => {
  console.log('검색:', searchQuery.value);
};

const goToFaqDetail = (faqId: number) => {
  router.push({
    name: 'gift-detail',
    params: { id: faqId },
  });
};
</script>
