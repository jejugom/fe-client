<template>
  <!-- 타이틀 -->
  <h2 class="text-primary-500 mb-8 text-2xl font-bold"
    >많이 물어보신 질문이에요</h2
  >

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
      :is-active="activeTab === '증여'"
      side="left"
      @click="toggleTab('증여')"
    >
      증여
    </FaqTab>

    <FaqTab
      :is-active="activeTab === '상속'"
      side="right"
      @click="toggleTab('상속')"
    >
      상속
    </FaqTab>
  </div>
  <div class="mb-4 flex justify-end">
    <Btn color="primary" label="초기화" size="small" @click="resetFilters" />
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
    <p class="text-base text-gray-500">
      {{ searchQuery ? '검색 결과가 없습니다.' : 'FAQ가 없습니다.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import InputBox from '@/components/forms/InputBox.vue';
import FaqCard from './_components/FaqCard.vue';
import FaqTab from './_components/FaqTab.vue';
import { getFaqList, type Faq } from '@/api/gift/faq';
import { useLoadingStore } from '@/stores/loading';

const router = useRouter();
const loadingStore = useLoadingStore();

const faqData = ref<Faq[]>([]);
const filteredFaqs = ref<Faq[]>([]);
const searchQuery = ref('');
const activeTab = ref<'all' | '상속' | '증여'>('all');

// 탭 토글
function toggleTab(tab: '상속' | '증여') {
  activeTab.value = activeTab.value === tab ? 'all' : tab;
}

// 공통 필터 함수
function applyFilter() {
  let faqs = [...faqData.value];

  if (activeTab.value !== 'all') {
    faqs = faqs.filter((faq) => faq.category === activeTab.value);
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    faqs = faqs.filter((faq) => faq.title.toLowerCase().includes(q));
  }

  filteredFaqs.value = faqs;
}

// 버튼/엔터 시에만 필터 적용
const handleSearch = () => {
  applyFilter();
};

// 탭이 바뀌면 현재 검색어 기준으로 재필터
watch(activeTab, applyFilter);

// 상세 페이지 이동
const goToFaqDetail = (faqId: number) => {
  router.push({ name: 'gift-detail', params: { id: faqId } });
};

const resetFilters = () => {
  searchQuery.value = '';
  activeTab.value = 'all';
  applyFilter();
};

// 초기 로딩
onMounted(async () => {
  loadingStore.startLoading();
  try {
    const res = await getFaqList();
    faqData.value = res.data;
    filteredFaqs.value = res.data; // 초기엔 전체 노출
  } catch (e) {
    console.error('FAQ 목록 조회 실패:', e);
  } finally {
    loadingStore.stopLoading();
  }
});
</script>
