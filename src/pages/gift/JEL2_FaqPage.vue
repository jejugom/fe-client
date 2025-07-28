<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-300 mb-4 text-2xl font-bold">상속·증여</h2>
  <p class="text-primary-300 mb-8 text-xl font-semibold">자주 묻는 질문</p>

  <!-- 검색 섹션 -->
  <div class="mb-6">
    <div class="mb-4 flex items-center gap-2">
      <InputBox
        placeholder="무엇이 궁금하신가요? (예: 상속세)"
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
      @click="goToFaqDetail(faq.id)"
      v-for="faq in filteredFaqs"
      :key="faq.id"
      :id="faq.id"
      :category="faq.category"
      :question="faq.question"
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
import { faqDummyData, FaqItem } from './_faqDummy';

const faqData = ref<FaqItem[]>(faqDummyData);

const router = useRouter();

// 검색어 및 탭 상태
const searchQuery = ref('');
const activeTab = ref<'all' | 'gift' | 'inheritance'>('all');

// 탭 토글
function toggleTab(tab: 'gift' | 'inheritance') {
  activeTab.value = activeTab.value === tab ? 'all' : tab;
}

// 검색 & 필터링
const filteredFaqs = computed(() => {
  let faqs = faqData.value;

  if (activeTab.value !== 'all') {
    faqs = faqs.filter((faq) => faq.category === activeTab.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    faqs = faqs.filter((faq) => faq.question.toLowerCase().includes(q));
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
