<template>
  <!-- 자산 관리 페이지 -->
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

  <!-- 삭제 확인 모달 -->
  <Modal
    v-if="showDeleteConfirmModal"
    title="자산 삭제"
    leftLabel="아니오"
    rightLabel="예"
    @click1="showDeleteConfirmModal = false"
    @click2="confirmDeleteAsset"
  >
    <p class="text-center"
      >정말로 이 자산을 삭제하시겠습니까?<br />한 번 삭제한 자산은 되돌릴 수
      없습니다.</p
    >
  </Modal>

  <!-- 일반 알림 모달 -->
  <Alert v-if="showAlert" @click="showAlert = false">
    <p>{{ alertMessage }}</p>
  </Alert>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/modals/Modal.vue';
import Alert from '@/components/modals/Alert.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';
import AssetForm from './_components/AssetForm.vue';
import {
  assetsApiResponse,
  transformApiResponseToAssets,
  transformAssetsToApiRequest,
  ASSET_CATEGORY_MAP,
  CATEGORY_NAME_TO_CODE,
  assetsApi,
} from '@/api/profile/editAsset';

const router = useRouter();

const modalTitle = ref('자산 정보 등록 및 수정');
const isModalOpen = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const showDeleteConfirmModal = ref(false);
const assetIdToDelete = ref(null);

// 자산 입력 폼 데이터
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
function handleAssetUpdate(updatedAsset) {
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
}

// 포커스 이벤트 핸들러
function handleFocus(fieldName) {
  focusedField.value = fieldName;
}

function handleBlur() {
  focusedField.value = '';
}

// 유효성 검사 및 포커스 상태 초기화 (중복 코드 제거)
function resetValidationState() {
  validationErrors.value = {
    type: false,
    name: false,
    amount: false,
    companyType: false,
  };
  focusedField.value = '';
}

const selectedOption = ref('');

// 자산 데이터 (초기값은 빈 배열, onMounted에서 로드)
const assets = ref([]);

// 카테고리 목록 (필터용)
const categoryOptions = Object.values(ASSET_CATEGORY_MAP);

// 금액을 억/만원 단위로 포맷팅하는 함수
function formatAmount(amountInManwon) {
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
}

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

function editAsset(assetId) {
  const assetToEdit = assets.value.find((asset) => asset.id === assetId);
  if (assetToEdit) {
    modalTitle.value = '자산 수정하기';
    newAsset.value = {
      ...assetToEdit,
      amount: String(assetToEdit.amount),
    };
    resetValidationState();
    isModalOpen.value = true;
  }
}

function deleteAsset(assetId) {
  if (assetId === null || assetId === undefined) {
    alertMessage.value = '유효하지 않은 자산 ID입니다.';
    showAlert.value = true;
    return;
  }
  assetIdToDelete.value = assetId;
  showDeleteConfirmModal.value = true;
}

async function confirmDeleteAsset() {
  showDeleteConfirmModal.value = false;
  try {
    await assetsApi.deleteAsset(assetIdToDelete.value);
    await loadAssets();
    alertMessage.value = '자산이 삭제되었습니다.';
    showAlert.value = true;
  } catch (error) {
    // console.error('자산 삭제 실패:', error);
    alertMessage.value = '자산 삭제 중 오류가 발생했습니다. 다시 시도해주세요.';
    showAlert.value = true;
  } finally {
    assetIdToDelete.value = null;
  }
}

function addNewAsset() {
  modalTitle.value = '새 자산 등록하기';
  newAsset.value = {
    id: null,
    name: '',
    type: '',
    amount: '',
    companyType: '',
  };
  resetValidationState();
  isModalOpen.value = true;
}

function closeModal() {
  resetValidationState();
  isModalOpen.value = false;
}

async function saveNewAsset() {
  resetValidationState();

  const missingFields = [];

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

  if (newAsset.value.type === '사업체/지분' && !newAsset.value.companyType) {
    validationErrors.value.companyType = true;
    missingFields.push('사업체 종류');
  }

  if (missingFields.length > 0) {
    alertMessage.value = `다음 항목을 입력해주세요: ${missingFields.join(', ')}`;
    showAlert.value = true;
    return;
  }

  const assetToSave = {
    ...newAsset.value,
    amount: Number(newAsset.value.amount),
  };

  try {
    let successMessage = '';
    if (newAsset.value.id) {
      const updateData = {
        assetCategoryCode: CATEGORY_NAME_TO_CODE[assetToSave.type],
        assetName: assetToSave.name,
        amount: assetToSave.amount * 10000,
        businessType: assetToSave.companyType || null,
      };
      await assetsApi.updateAsset(newAsset.value.id, updateData);
      successMessage = '자산 수정이 완료되었습니다.';
    } else {
      const createData = {
        assetCategoryCode: CATEGORY_NAME_TO_CODE[assetToSave.type],
        assetName: assetToSave.name,
        amount: assetToSave.amount * 10000,
        businessType: assetToSave.companyType || null,
      };
      await assetsApi.createAsset(createData);
      successMessage = '자산 등록이 완료되었습니다.';
    }
    await loadAssets();
    closeModal();
    alertMessage.value = successMessage;
    showAlert.value = true;
  } catch (error) {
    // console.error('자산 저장 실패:', error);
    alertMessage.value = '자산 저장 중 오류가 발생했습니다. 다시 시도해주세요.';
    showAlert.value = true;
  }
}

function goToProfilePage() {
  router.push({ name: 'profile' });
}

async function loadAssets() {
  try {
    const apiResponse = await assetsApi.getAssets();
    assets.value = transformApiResponseToAssets(apiResponse);
  } catch (error) {
    // console.error('자산 조회 실패:', error);
    assets.value = transformApiResponseToAssets(assetsApiResponse);
  }
}

onMounted(() => {
  loadAssets();
});
</script>
