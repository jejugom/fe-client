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
import { ref, computed, onMounted } from 'vue';
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
  CATEGORY_NAME_TO_CODE,
  assetsApi,
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

// 자산 데이터 (초기값은 빈 배열, onMounted에서 로드)
const assets = ref([]);

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

const deleteAsset = async (assetId) => {
  try {
    console.log('삭제 요청 assetId:', assetId);
    console.log('현재 자산 목록:', assets.value);
    
    if (assetId === null || assetId === undefined) {
      alert('유효하지 않은 자산 ID입니다.');
      return;
    }
    
    if (confirm('정말로 이 자산을 삭제하시겠습니까?')) {
      // 자산 삭제 API 호출
      await assetsApi.deleteAsset(assetId);
      console.log('자산 삭제 성공:', assetId);

      // 삭제 후 전체 자산 목록을 다시 조회하여 최신 상태로 업데이트
      await loadAssets();
    }
  } catch (error) {
    console.error('자산 삭제 실패:', error);
    alert('자산 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
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

const saveNewAsset = async () => {
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

  try {
    console.log('저장할 자산 데이터:', assetToSave);
    console.log('newAsset.value.id:', newAsset.value.id);
    
    if (newAsset.value.id) {
      // 기존 자산 수정
      const updateData = {
        assetCategoryCode: CATEGORY_NAME_TO_CODE[assetToSave.type],
        assetName: assetToSave.name,
        amount: assetToSave.amount * 10000, // 만원 단위를 원 단위로 변환
        businessType: assetToSave.companyType || null,
      };

      console.log('수정 요청 데이터:', updateData);
      await assetsApi.updateAsset(newAsset.value.id, updateData);
      console.log('자산 수정 성공:', updateData);

      // 수정 후 전체 자산 목록을 다시 조회하여 최신 상태로 업데이트
      await loadAssets();
    } else {
      // 새 자산 추가
      const createData = {
        assetCategoryCode: CATEGORY_NAME_TO_CODE[assetToSave.type],
        assetName: assetToSave.name,
        amount: assetToSave.amount * 10000, // 만원 단위를 원 단위로 변환
        businessType: assetToSave.companyType || null,
      };

      await assetsApi.createAsset(createData);
      console.log('자산 생성 성공');

      // 생성 후 전체 자산 목록을 다시 조회하여 정확한 ID로 업데이트
      await loadAssets();
    }

    // 모달 닫기
    closeModal();
  } catch (error) {
    console.error('자산 저장 실패:', error);
    alert('자산 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

const goToProfilePage = () => {
  router.push({ name: 'profile' });
};

// 자산 데이터 로드
const loadAssets = async () => {
  try {
    const apiResponse = await assetsApi.getAssets();
    assets.value = transformApiResponseToAssets(apiResponse);
    console.log('자산 조회 성공:', apiResponse);
    console.log('변환된 자산 데이터:', assets.value);
  } catch (error) {
    console.error('자산 조회 실패:', error);
    // 실패 시 더미 데이터 사용
    assets.value = transformApiResponseToAssets(assetsApiResponse);
    console.log('더미 데이터 사용:', assets.value);
  }
};

// 컴포넌트 마운트 시 자산 데이터 로드
onMounted(() => {
  loadAssets();
});
</script>
