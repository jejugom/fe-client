<template>
  <!-- 새로운 자산 등록 Content -->
  <div class="px-5 py-6">
    <h2 class="mb-2 text-xl font-semibold text-blue-600"
      >새로운 자산 등록하기</h2
    >
    <!-- 드롭다운 -->
    <div class="mb-6">
      <div class="relative ml-auto w-1/4">
        <select
          v-model="selectedOption"
          class="w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">선택해주세요</option>
          <option value="부동산">부동산</option>
          <option value="예금/현금">예금/현금</option>
          <option value="주식/펀드">주식/펀드</option>
          <option value="사업체/지분">사업체/지분</option>
          <option value="기타 자산">기타 자산</option>
        </select>
        <!-- 드롭다운 아이콘 -->
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
        >
          <svg
            class="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 자산 목록 -->
    <div class="space-y-4">
      <div
        v-for="asset in filteredAssets"
        :key="asset.id"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <!-- 자산 헤더 -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-800">{{
              asset.name
            }}</h3>
            <p class="text-sm text-gray-500">{{ asset.type }}</p>
            <p class="mt-1 text-sm text-gray-400">{{ asset.amount }}</p>
          </div>

          <!-- 수정/삭제 버튼 - 세로 배열 -->
          <div class="ml-4 flex flex-col gap-2">
            <button
              @click="editAsset(asset.id)"
              class="min-w-[60px] rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200"
            >
              수정
            </button>
            <button
              @click="deleteAsset(asset.id)"
              class="min-w-[60px] rounded-full bg-red-100 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-200"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 새 자산 추가 버튼 -->
    <div class="mt-6 mb-6 rounded-lg bg-gray-100 py-4 text-center">
      <button @click="addNewAsset" class="text-lg font-semibold text-gray-800">
        + 자산 추가하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedOption = ref('');

const assets = ref([
  {
    id: 1,
    name: '우리집',
    type: '부동산',
    amount: '10억원',
  },
  {
    id: 2,
    name: '아파트',
    type: '부동산',
    amount: '5억원',
  },
  {
    id: 3,
    name: '적금통장',
    type: '예금/현금',
    amount: '3천만원',
  },
  {
    id: 4,
    name: '삼성전자 주식',
    type: '주식/펀드',
    amount: '500만원',
  },
  {
    id: 5,
    name: '카페 지분',
    type: '사업체/지분',
    amount: '2천만원',
  },
  {
    id: 6,
    name: '자동차',
    type: '기타 자산',
    amount: '4000만원',
  },
]);

// 선택된 카테고리에 따라 자산 필터링
const filteredAssets = computed(() => {
  if (!selectedOption.value) {
    return assets.value;
  }
  return assets.value.filter((asset) => asset.type === selectedOption.value);
});

const editAsset = (assetId) => {
  console.log('Edit asset:', assetId);
  // 자산 수정 로직
};

const deleteAsset = (assetId) => {
  console.log('Delete asset:', assetId);
  // 자산 삭제 로직
  assets.value = assets.value.filter((asset) => asset.id !== assetId);
};

const completeAsset = (assetId) => {
  console.log('Complete asset:', assetId);
  // 자산 완료 로직
};

const addNewAsset = () => {
  console.log('Add new asset');
  // 새 자산 추가 로직 - 모달 열기 또는 새 페이지로 이동
};
</script>
