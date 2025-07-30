<template>
  <!-- 새로운 자산 등록 Content -->
  <div class="space-y-8">
    <!-- 자산 등록 버튼과 카테고리 필터 섹션 -->
    <div class="flex items-center justify-between">
      <SelectBox v-model="selectedOption" size="small">
        <option value="">전체</option>
        <option
          v-for="category in categoryOptions"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </SelectBox>
      <Btn
        @click="addNewAsset"
        color="primary"
        label="자산 추가"
        size="small"
        class="h-10"
      />
    </div>

    <!-- 자산 목록 -->
    <div class="flex flex-col gap-4">
      <MultiBtnCard
        v-for="asset in filteredAssets"
        :key="asset.id"
        btnText1="수정"
        btnText2="삭제"
        :content="asset.type"
        :tags="asset.displayAmount"
        :title="asset.name"
        @click:edit="editAsset(asset.id)"
        @click:delete="deleteAsset(asset.id)"
      />
    </div>

    <!-- 완료 버튼 -->
    <div class="mt-16">
      <Btn @click="goToProfilePage" color="primary" label="완료" size="large" />
    </div>
  </div>

  <!-- 자산 추가 / 수정 모달 -->
  <Modal
    v-if="isModalOpen"
    :title="modalTitle"
    leftLabel="그만두기"
    rightLabel="저장하기"
    @click1="closeModal"
    @click2="saveNewAsset"
  >
    <AssetForm
      :asset="newAsset"
      :validation-errors="validationErrors"
      :focused-field="focusedField"
      @update:asset="handleAssetUpdate"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/modals/Modal.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';
import AssetForm from './_components/AssetForm.vue';
import {
  assetsApiResponse,
  transformApiResponseToAssets,
  transformAssetsToApiRequest,
  ASSET_CATEGORY_MAP,
} from '@/api/profile/editAsset';

const router = useRouter();

const modalTitle = ref('자산 정보 등록 및 수정');
const isModalOpen = ref(false);

// 자산 입력 폼 데이터
// amount는 문자열로 관리 (InputBox 컴포넌트가 modelValue로 string 타입을 요구하기 때문)
const newAsset = ref({
  id: null, // 기존 자산 수정 시 사용될 ID
  name: '',
  type: '',
  amount: '', // 문자열로 처리 (InputBox 컴포넌트 요구사항)
  companyType: '', // 사업체/지분 선택 시 사용
});

const validationErrors = ref({
  type: false,
  name: false,
  amount: false,
  companyType: false,
});

const focusedField = ref('');

// 자산 데이터 업데이트 핸들러
const handleAssetUpdate = (updatedAsset) => {
  const previousAsset = { ...newAsset.value };
  newAsset.value = updatedAsset;

  // 값이 변경된 필드의 에러 상태 클리어
  Object.keys(updatedAsset).forEach((key) => {
    if (
      previousAsset[key] !== updatedAsset[key] &&
      validationErrors.value[key]
    ) {
      validationErrors.value[key] = false;
    }
  });
};

// 포커스 이벤트 핸들러
const handleFocus = (fieldName) => {
  focusedField.value = fieldName;
};

const handleBlur = () => {
  focusedField.value = '';
};

// 유효성 검사 및 포커스 상태 초기화 (중복 코드 제거)
const resetValidationState = () => {
  validationErrors.value = {
    type: false,
    name: false,
    amount: false,
    companyType: false,
  };
  focusedField.value = '';
};

const selectedOption = ref('');

// API 응답 데이터를 컴포넌트에서 사용할 형태로 변환
const assets = ref(transformApiResponseToAssets(assetsApiResponse));

// 카테고리 목록 (필터용)
const categoryOptions = Object.values(ASSET_CATEGORY_MAP);

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
    return `${eok.toLocaleString()}억 ${manwon > 0 ? manwon.toLocaleString() + '만원' : ''}`;
  }
  return `${amount.toLocaleString()}만원`;
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

    // 기존 자산 데이터를 폼에 복사
    // amount를 문자열로 변환: InputBox 컴포넌트가 string 타입의 modelValue를 요구하므로
    // 숫자형 데이터(4000)를 문자열("4000")로 변환하여 타입 오류 방지
    newAsset.value = {
      ...assetToEdit,
      amount: String(assetToEdit.amount),
    };

    // 유효성 검사 및 포커스 상태 초기화
    resetValidationState();

    isModalOpen.value = true;
  }
};

const deleteAsset = (assetId) => {
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
    amount: '',
    companyType: '',
  };

  // 유효성 검사 및 포커스 상태 초기화
  resetValidationState();

  isModalOpen.value = true;
};

const closeModal = () => {
  resetValidationState();
  isModalOpen.value = false;
};

const saveNewAsset = () => {
  // 유효성 검사 초기화
  resetValidationState();

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

  if (newAsset.value.amount === '' || isNaN(Number(newAsset.value.amount))) {
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

  // 저장 시 amount를 숫자로 변환 (데이터 저장은 숫자형으로)
  const assetToSave = {
    ...newAsset.value,
    amount: Number(newAsset.value.amount),
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
  console.log('저장된 자산 (컴포넌트 형태):', assetToSave);

  // API 형태로 변환하여 서버에 전송할 데이터 확인
  const apiData = transformAssetsToApiRequest([assetToSave]);
  console.log('API 전송용 데이터:', apiData[0]);
  // axios.post('/api/assets', apiData[0])

  // 모달 닫기
  closeModal();
};

const goToProfilePage = () => {
  router.push({ name: 'profile' });
};
</script>
