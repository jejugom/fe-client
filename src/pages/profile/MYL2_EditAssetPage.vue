<template>
  <!-- 새로운 자산 등록 Content -->
  <div class="space-y-8">
    <!-- 자산 등록 버튼과 카테고리 필터 섹션 -->
    <div class="flex items-center justify-between">
      <Btn
        @click="addNewAsset"
        color="primary"
        label="자산 등록"
        size="small"
      />
      <SelectBox v-model="selectedOption" size="small">
        <option value="">전체</option>
        <option value="부동산">부동산</option>
        <option value="예금/현금">예금/현금</option>
        <option value="주식/펀드">주식/펀드</option>
        <option value="사업체/지분">사업체/지분</option>
        <option value="기타 자산">기타 자산</option>
      </SelectBox>
    </div>

    <!-- 자산 목록 -->
    <!-- TODO : 컴포넌트 추가되면 통일된 스타일을 위해 컴포넌트로 구현 -->
    <!-- 자산 목록 -->
    <div class="space-y-3">
      <div
        v-for="asset in filteredAssets"
        :key="asset.id"
        class="border-surface-200 flex h-32 w-full items-center justify-between gap-6 rounded-lg border px-8 py-4"
      >
        <!-- 왼쪽 자산 정보 -->
        <div class="flex flex-col">
          <div class="text-primary-500 text-lg font-semibold">{{
            asset.name
          }}</div>

          <div class="text-surface-500 text-sm">
            <p>{{ asset.type }}</p>
            <p>{{ asset.displayAmount }}</p>
          </div>
        </div>

        <!-- 수정/삭제 버튼 그룹 -->
        <div class="flex gap-2">
          <!-- 수정 버튼 -->
          <button
            @click="editAsset(asset.id)"
            class="bg-primary-100 text-primary-500 flex h-20 w-15 items-center justify-center rounded-lg text-center text-lg font-semibold"
          >
            수정
          </button>

          <!-- 삭제 버튼 -->
          <button
            @click="deleteAsset(asset.id)"
            class="text-primary-500 flex h-20 w-15 items-center justify-center rounded-lg bg-red-100 text-center text-lg font-semibold"
          >
            삭제
          </button>
        </div>
      </div>
    </div>

    <!-- 완료 버튼 -->
    <div class="mt-8">
      <Btn @click="goToProfilePage" color="primary" label="완료" size="large" />
    </div>
  </div>

  <!-- 자산 추가 / 수정 모달 -->
  <Modal
    v-if="isModalOpen"
    :title="modalTitle"
    leftLabel="취소"
    rightLabel="저장"
    @click1="closeModal"
    @click2="saveNewAsset"
  >
    <div class="flex flex-col items-center space-y-6">
      <!-- 1. 카테고리 선택 -->
      <div class="flex w-68 flex-col items-start">
        <label
          for="assetCategory"
          class="text-primary-500 mb-2 block text-sm font-semibold"
        >
          카테고리를 선택하세요
        </label>
        <SelectBox
          id="assetCategory"
          v-model="newAsset.type"
          size="medium"
          :class="getInputClass('type')"
          @focus="handleFocus('type')"
          @blur="handleBlur('type')"
          @update:modelValue="clearFieldError('type')"
        >
          <option value="">선택해주세요</option>
          <option value="부동산">부동산</option>
          <option value="예금/현금">예금/현금</option>
          <option value="주식/펀드">주식/펀드</option>
          <option value="사업체/지분">사업체/지분</option>
          <option value="기타 자산">기타 자산</option>
        </SelectBox>
      </div>

      <!-- 2. 자산 이름 입력 -->
      <div class="flex w-68 flex-col items-start">
        <label
          for="assetName"
          class="text-primary-500 mb-2 block text-sm font-semibold"
        >
          자산 이름 (20자 이내)
        </label>
        <InputBox
          id="assetName"
          placeholder="자산 이름 입력"
          v-model="newAsset.name"
          size="medium"
          type="text"
          :class="getInputClass('name')"
          @focus="handleFocus('name')"
          @blur="handleBlur('name')"
          @update:modelValue="clearFieldError('name')"
        />
      </div>

      <!-- 3. 사업체 종류 선택 (조건부 표시) -->
      <div
        v-if="newAsset.type === '사업체/지분'"
        class="flex w-68 flex-col items-start"
      >
        <label
          for="companyType"
          class="text-primary-500 mb-2 block text-sm font-semibold"
        >
          사업체 종류 선택
        </label>
        <SelectBox
          id="companyType"
          v-model="newAsset.companyType"
          size="medium"
          :class="getInputClass('companyType')"
          @focus="handleFocus('companyType')"
          @blur="handleBlur('companyType')"
          @update:modelValue="clearFieldError('companyType')"
        >
          <option value="">선택해주세요</option>
          <option value="개인 사업자">개인 사업자</option>
          <option value="법인 사업자">법인 사업자</option>
        </SelectBox>
      </div>

      <!-- 4. 금액 입력 -->
      <div class="flex w-68 flex-col items-start">
        <label
          for="assetAmount"
          class="text-primary-500 mb-2 block text-sm font-semibold"
        >
          금액 (만원 단위)
        </label>
        <div class="relative w-full">
          <InputBox
            id="assetAmount"
            placeholder="금액을 입력하세요"
            v-model="newAsset.amount"
            size="medium"
            type="text"
            :class="getInputClass('amount')"
            @focus="handleFocus('amount')"
            @blur="handleBlur('amount')"
            @update:modelValue="clearFieldError('amount')"
          />
          <span
            class="text-surface-500 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-sm"
          >
            만원
          </span>
        </div>
        <p class="mt-1 w-68 text-right text-sm text-red-300">
          결과: {{ formatAmount(newAsset.amount) }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/modals/Modal.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import InputBox from '@/components/forms/InputBox.vue'; // InputBox 추가
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

const modalTitle = ref('자산 정보 등록 및 수정');
const isModalOpen = ref(false);

const newAsset = ref({
  id: null, // 기존 자산 수정 시 사용될 ID
  name: '',
  type: '',
  amount: null, // 만원 단위 숫자로 저장
  companyType: '', // 사업체/지분 선택 시 사용
});

const validationErrors = ref({
  type: false,
  name: false,
  amount: false,
  companyType: false,
});

const focusedField = ref('');

// 포커스 이벤트 핸들러
const handleFocus = (fieldName) => {
  focusedField.value = fieldName;
};

const handleBlur = (fieldName) => {
  focusedField.value = '';
};

// 입력 값 변경 시 에러 상태 클리어
const clearFieldError = (fieldName) => {
  if (validationErrors.value[fieldName]) {
    validationErrors.value[fieldName] = false;
  }
};

// 입력 필드의 클래스 결정 함수 (computed로 변경하여 자동 업데이트)
const getInputClass = computed(() => {
  return (fieldName) => {
    const fieldValue = newAsset.value[fieldName];
    const isFocused = focusedField.value === fieldName;
    const hasSubmitError = validationErrors.value[fieldName];

    // 사업체/지분 선택 시 사업체 종류 필드 추가 검사
    const isCompanyTypeRequired =
      newAsset.value.type === '사업체/지분' && fieldName === 'companyType';

    // 기본 테두리 클래스
    let classes = '!border-1';

    // 저장 버튼을 눌렀을 때만 에러 검사
    if (hasSubmitError) {
      classes += ' !border-red-300';
    } else {
      // 기본 surface 색상 유지
      classes += ' !border-surface-300';
    }

    return classes;
  };
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
    // 모달 제목 설정
    modalTitle.value = '자산 수정하기';

    // 기존 자산 데이터를 newAsset에 복사하여 모달에 표시
    newAsset.value = { ...assetToEdit };

    // 유효성 검사 초기화
    validationErrors.value = {
      type: false,
      name: false,
      amount: false,
      companyType: false,
    };

    // 포커스 상태 초기화
    focusedField.value = '';

    isModalOpen.value = true;
  }
};

const deleteAsset = (assetId) => {
  console.log('Delete asset:', assetId);
  // 자산 삭제 로직
  assets.value = assets.value.filter((asset) => asset.id !== assetId);
};

const addNewAsset = () => {
  // 새 자산 추가를 위해 폼 초기화

  // 모달 제목 설정
  modalTitle.value = '새 자산 등록하기';

  newAsset.value = {
    id: null,
    name: '',
    type: '',
    amount: null,
    companyType: '',
  };

  // 유효성 검사 초기화
  validationErrors.value = {
    type: false,
    name: false,
    amount: false,
    companyType: false,
  };

  // 포커스 상태 초기화
  focusedField.value = '';

  isModalOpen.value = true;
};

const closeModal = () => {
  // 유효성 검사 초기화
  validationErrors.value = {
    type: false,
    name: false,
    amount: false,
    companyType: false,
  };
  // 포커스 상태 초기화
  focusedField.value = '';
  isModalOpen.value = false;
};

const saveNewAsset = () => {
  // 유효성 검사 초기화
  validationErrors.value = {
    type: false,
    name: false,
    amount: false,
    companyType: false,
  };

  const missingFields = [];

  // 필수 필드 유효성 검사
  if (!newAsset.value.type) {
    validationErrors.value.type = true;
    missingFields.push('카테고리');
  }

  if (!newAsset.value.name) {
    validationErrors.value.name = true;
    missingFields.push('자산 이름');
  }

  if (
    newAsset.value.amount === null ||
    newAsset.value.amount === '' ||
    isNaN(newAsset.value.amount)
  ) {
    validationErrors.value.amount = true;
    missingFields.push('금액');
  }

  // 사업체/지분 선택 시 사업체 종류 유효성 검사
  if (newAsset.value.type === '사업체/지분' && !newAsset.value.companyType) {
    validationErrors.value.companyType = true;
    missingFields.push('사업체 종류');
  }

  // 비어있는 필드가 있으면 alert로 알려주기
  if (missingFields.length > 0) {
    alert(`다음 항목을 입력해주세요: ${missingFields.join(', ')}`);
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
      id: Date.now(), // 임시로 간단한 고유 ID 생성
      ...assetToSave,
    });
  }

  // TODO : 서버에 자산 정보 저장 로직 추가
  console.log('저장된 자산:', assetToSave);
  // axios.post()

  // 모달 닫기
  closeModal();
};

const goToProfilePage = () => {
  router.push({ name: 'profile' });
};
</script>
