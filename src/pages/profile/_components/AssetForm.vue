<template>
  <div class="flex flex-col items-center space-y-6">
    <!-- 1. 카테고리 선택 -->
    <div class="flex flex-col items-start">
      <label
        for="assetCategory"
        class="text-primary-500 mb-1 block font-semibold"
      >
        어떤 자산인지 골라주세요
      </label>
      <SelectBox
        id="assetCategory"
        :model-value="asset.type"
        @update:model-value="updateAsset('type', $event)"
        size="medium"
        :class="getInputClass('type')"
        @focus="handleFocus('type')"
        @blur="handleBlur('type')"
      >
        <option value="">선택해주세요</option>
        <option
          v-for="category in categoryOptions"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </SelectBox>
    </div>

    <!-- 2. 자산 이름 입력 -->
    <div class="flex flex-col items-start">
      <label for="assetName" class="text-primary-500 mb-1 block font-semibold">
        자산 이름을 써주세요 (예: 금)
      </label>
      <InputBox
        id="assetName"
        placeholder="자산 이름 입력"
        :model-value="asset.name"
        @update:model-value="updateAsset('name', $event)"
        size="medium"
        type="text"
        :class="getInputClass('name')"
        @focus="handleFocus('name')"
        @blur="handleBlur('name')"
      />
    </div>

    <!-- 3. 사업체 종류 선택 (조건부 표시) -->
    <div v-if="asset.type === '사업체/지분'" class="flex flex-col items-start">
      <label
        for="companyType"
        class="text-primary-500 mb-1 block font-semibold"
      >
        사업체 종류를 선택해주세요
      </label>
      <SelectBox
        id="companyType"
        :model-value="asset.companyType"
        @update:model-value="updateAsset('companyType', $event)"
        size="medium"
        :class="getInputClass('companyType')"
        @focus="handleFocus('companyType')"
        @blur="handleBlur('companyType')"
      >
        <option value="">선택해주세요</option>
        <option value="개인 사업자">개인 사업자</option>
        <option value="법인 사업자">법인 사업자</option>
      </SelectBox>
    </div>

    <!-- 4. 금액 입력 -->
    <div class="flex flex-col items-start">
      <label
        for="assetAmount"
        class="text-primary-500 mb-1 block font-semibold"
      >
        금액을 입력하세요
      </label>
      <div class="relative w-full">
        <!--guno: type="number" 로 구현하면 스피너(오른쪽 토글)가 발생하여 사용성에 문제있음 -->
        <!-- 문자열로 관리하여 스피너 발생 방지 -->
        <InputBox
          id="assetAmount"
          placeholder="금액을 입력하세요"
          :model-value="asset.amount"
          @update:model-value="updateAsset('amount', $event)"
          size="medium"
          type="text"
          :class="getInputClass('amount')"
          @focus="handleFocus('amount')"
          @blur="handleBlur('amount')"
        />
        <span
          class="text-surface-500 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-sm"
        >
          만원
        </span>
      </div>
      <p class="mt-1 w-68 text-right text-sm text-blue-300">
        {{ formatAmount(asset.amount) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import InputBox from '@/components/forms/InputBox.vue';
import { ASSET_CATEGORY_MAP } from '@/api/profile/editAsset';

interface Asset {
  id: number | null;
  name: string;
  type: string;
  amount: string;
  companyType: string;
}

interface Props {
  asset: Asset;
  validationErrors: {
    type: boolean;
    name: boolean;
    amount: boolean;
    companyType: boolean;
  };
  focusedField: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:asset': [asset: Asset];
  focus: [fieldName: string];
  blur: [fieldName: string];
}>();

// 카테고리 옵션
const categoryOptions = Object.values(ASSET_CATEGORY_MAP);

// 자산 데이터 업데이트
const updateAsset = (field: keyof Asset, value: string) => {
  const updatedAsset = { ...props.asset, [field]: value };
  emit('update:asset', updatedAsset);
};

// 포커스 이벤트 핸들러
const handleFocus = (fieldName: string) => {
  emit('focus', fieldName);
};

const handleBlur = (fieldName: string) => {
  emit('blur', fieldName);
};

// 금액 포맷팅 함수
const formatAmount = (amountInManwon: string) => {
  if (amountInManwon === '' || isNaN(Number(amountInManwon))) {
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

// 입력 필드 클래스 결정
const getInputClass = computed(() => {
  return (fieldName: string) => {
    const hasSubmitError =
      props.validationErrors[fieldName as keyof typeof props.validationErrors];

    let classes = '!border-1';

    if (hasSubmitError) {
      classes += ' !border-red-300';
    } else {
      classes += ' !border-surface-300';
    }

    return classes;
  };
});
</script>
