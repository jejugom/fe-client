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
            <p class="mt-1 text-sm text-gray-400">{{ asset.displayAmount }}</p>
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

  <!-- 자산 추가 / 수정 모달 -->
  <Modal
    v-if="isModalOpen"
    title="자산 정보 등록 및 수정"
    leftLabel="취소"
    rightLabel="저장"
    @click1="closeModal"
    @click2="saveNewAsset"
  >
    <div class="flex flex-col space-y-4">
      <!-- 1. 카테고리 선택 -->
      <div class="text-center">
        <label
          for="assetCategory"
          class="text-primary-500 mb-2 block font-semibold"
          >카테고리를 선택하세요</label
        >
        <SelectBox id="assetCategory" v-model="newAsset.type" size="medium">
          <option value="">선택해주세요</option>
          <option value="부동산">부동산</option>
          <option value="예금/현금">예금/현금</option>
          <option value="주식/펀드">주식/펀드</option>
          <option value="사업체/지분">사업체/지분</option>
          <option value="기타 자산">기타 자산</option>
        </SelectBox>
      </div>

      <!-- 2. 자산 이름 입력 (20자 이내) -->
      <div class="text-center">
        <label for="assetName" class="text-primary-500 mb-2 block font-semibold"
          >자산 이름 (20자 이내)</label
        >
        <InputBox
          id="assetName"
          placeholder="자산 이름 입력"
          v-model="newAsset.name"
          size="medium"
          type="text"
        />
      </div>

      <!-- 3. (사업체, 지분 고른 경우 보여주기) 사업체 종류 선택-->
      <div v-if="newAsset.type === '사업체/지분'" class="text-center">
        <label
          for="companyType"
          class="text-primary-500 mb-2 block font-semibold"
          >사업체 종류 선택</label
        >
        <SelectBox
          id="companyType"
          v-model="newAsset.companyType"
          size="medium"
        >
          <option value="">선택해주세요</option>
          <option value="개인 사업자">개인 사업자</option>
          <option value="법인 사업자">법인 사업자</option>
        </SelectBox>
      </div>

      <!-- 4. 금액 입력 -->
      <div class="text-center">
        <label
          for="assetAmount"
          class="text-primary-500 mb-2 block font-semibold"
          >금액 (만원 단위)</label
        >
        <div class="relative inline-block">
          <InputBox
            placeholder="금액을 입력하세요"
            v-model="newAsset.amount"
            size="medium"
            type="text"
          />
          <span
            class="text-surface-500 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform"
            >만원</span
          >
        </div>
        <div class="mt-1 text-right">
          <p class="text-sm text-red-300"
            >결과: {{ formatAmount(newAsset.amount) }}</p
          >
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import Modal from '@/components/modals/Modal.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import InputBox from '@/components/forms/InputBox.vue'; // InputBox 추가

const isModalOpen = ref(false);
const newAsset = ref({
  id: null, // 기존 자산 수정 시 사용될 ID
  name: '',
  type: '',
  amount: null, // 만원 단위 숫자로 저장
  companyType: '', // 사업체/지분 선택 시 사용
});

const selectedOption = ref('');

const assets = ref([
  {
    id: 1,
    name: '우리집',
    type: '부동산',
    amount: 100000, // 10억원 = 100000만원
  },
  {
    id: 2,
    name: '아파트',
    type: '부동산',
    amount: 50000, // 5억원
  },
  {
    id: 3,
    name: '적금통장',
    type: '예금/현금',
    amount: 3000, // 3천만원
  },
  {
    id: 4,
    name: '삼성전자 주식',
    type: '주식/펀드',
    amount: 500, // 500만원
  },
  {
    id: 5,
    name: '카페 지분',
    type: '사업체/지분',
    amount: 2000, // 2천만원
  },
  {
    id: 6,
    name: '자동차',
    type: '기타 자산',
    amount: 4000, // 4000만원
  },
]);

// 금액을 억/만원 단위로 포맷팅하는 함수
const formatAmount = (amountInManwon) => {
  if (
    amountInManwon === null ||
    amountInManwon === '' ||
    isNaN(amountInManwon)
  ) {
    return '0원';
  }
  const amount = Number(amountInManwon);
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000);
    const manwon = amount % 10000;
    return `${eok}억 ${manwon > 0 ? manwon + '만원' : ''}`;
  }
  return `${amount}만원`;
};

// 선택된 카테고리에 따라 자산 필터링 및 금액 포맷팅
const filteredAssets = computed(() => {
  const baseAssets = selectedOption.value
    ? assets.value.filter((asset) => asset.type === selectedOption.value)
    : assets.value;

  return baseAssets.map((asset) => ({
    ...asset,
    displayAmount: formatAmount(asset.amount),
  }));
});

const editAsset = (assetId) => {
  const assetToEdit = assets.value.find((asset) => asset.id === assetId);
  if (assetToEdit) {
    // 기존 자산 데이터를 newAsset에 복사하여 모달에 표시
    newAsset.value = { ...assetToEdit };
    isModalOpen.value = true;
  }
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
  // 새 자산 추가를 위해 폼 초기화
  newAsset.value = {
    id: null,
    name: '',
    type: '',
    amount: null,
    companyType: '',
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveNewAsset = () => {
  // 필수 필드 유효성 검사
  if (
    !newAsset.value.name ||
    !newAsset.value.type ||
    newAsset.value.amount === null ||
    isNaN(newAsset.value.amount)
  ) {
    alert('모든 필수 필드를 입력해주세요.');
    return;
  }

  // 사업체/지분 선택 시 사업체 종류 유효성 검사
  if (newAsset.value.type === '사업체/지분' && !newAsset.value.companyType) {
    alert('사업체 종류를 선택해주세요.');
    return;
  }

  const assetToSave = {
    ...newAsset.value,
    amount: Number(newAsset.value.amount), // amount를 숫자로 강제 변환
  };

  if (newAsset.value.id) {
    // 기존 자산 수정
    const index = assets.value.findIndex(
      (asset) => asset.id === newAsset.value.id
    );
    if (index !== -1) {
      assets.value[index] = assetToSave;
    }
  } else {
    // 새 자산 추가
    assets.value.push({
      id: Date.now(), // 간단한 고유 ID 생성
      ...assetToSave,
    });
  }
  closeModal();
};
</script>
