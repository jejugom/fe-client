<template>
  <Modal
    @click1="$emit('cancel')"
    @click2="handleSubmit"
    :title="isEditing ? '정보 수정' : '수증자 정보 입력'"
    leftLabel="그만두기"
    rightLabel="저장하기"
  >
    <div class="space-y-4">
      <FormField label="이름을 입력해 주세요">
        <InputBox
          placeholder="입력하세요"
          size="medium"
          type="text"
          v-model="formData.recipientName"
          class="w-full"
        />
      </FormField>

      <FormField label="어떤 관계인가요? (자녀, 손주 등)">
        <SelectBox v-model="formData.relationship" size="medium" class="w-full">
          <option disabled value="">선택하세요</option>
          <option
            v-for="option in relationshipOptions"
            :key="option"
            :value="option"
            :disabled="
              option === '배우자' &&
              spouseExists &&
              !(isEditing && formData.relationship === '배우자')
            "
          >
            {{ option }}
          </option>
        </SelectBox>
      </FormField>

      <FormField label="생년월일은 언제인가요?">
        <InputBox
          size="medium"
          type="date"
          v-model="formData.birthDate"
          class="w-full"
        />
      </FormField>

      <FormField label="결혼하셨나요?">
        <SelectBox
          v-model="formData.isMarried"
          size="medium"
          class="w-full"
          :disabled="formData.relationship === '배우자'"
        >
          <option disabled :value="null">선택하세요</option>
          <option :value="true">예</option>
          <option :value="false">아니오</option>
        </SelectBox>
      </FormField>

      <FormField :label="`최근 10년 내 수증자에게 증여한 적 있나요?`">
        <SelectBox v-model="formData.hasPriorGift" size="medium" class="w-full">
          <option disabled :value="null">선택하세요</option>
          <option :value="true">예</option>
          <option :value="false">아니오</option>
        </SelectBox>
      </FormField>

      <FormField v-if="formData.hasPriorGift === true" label="증여한 금액 (원)">
        <div class="flex flex-col items-start">
          <div class="relative w-full">
            <InputBox
              type="text"
              size="medium"
              placeholder="금액을 입력하세요"
              v-model="priorGiftAmountInTenThousand"
              class="w-full"
            />
            <span
              class="text-surface-500 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-base"
            >
              만원
            </span>
          </div>
          <p class="mt-1 w-full text-right text-base text-blue-300">
            {{ formatCurrency(formData.priorGiftAmount || 0) }}
          </p>
        </div>
      </FormField>
      <FormField label="증여세는 누가 부담하나요?">
        <SelectBox v-model="formData.giftTaxPayer" size="medium" class="w-full">
          <option disabled value="">선택하세요</option>
          <option value="본인">본인이 대신 납부</option>
          <option value="수증자">
            {{
              formData.recipientName
                ? `${formData.recipientName}이(가) 직접 납부`
                : '수증자'
            }}
          </option>
        </SelectBox>
      </FormField>
    </div>
  </Modal>
  <Alert v-if="showAlert" @click="showAlert = false">
    <div class="text-center">
      <p class="mb-2 font-semibold">모든 필수 정보를 입력해 주세요:</p>
      <ul class="list-none text-left">
        <li v-for="field in missingFieldsForAlert" :key="field" class="ml-4">
          - {{ field }}
        </li>
      </ul>
    </div>
  </Alert>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, computed } from 'vue';
import Modal from '@/components/modals/Modal.vue';
import Alert from '@/components/modals/Alert.vue';
import InputBox from '@/components/forms/InputBox.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import FormField from './FormField.vue';
import type { RecipientRequestDto } from '@/types/gift/recipient';
import { formatCurrency } from '@/utils/format';

interface Props {
  recipient?: RecipientRequestDto | null;
  isEditing?: boolean;
  spouseExists?: boolean;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm', recipient: RecipientRequestDto): void;
}

const props = withDefaults(defineProps<Props>(), {
  recipient: null,
  isEditing: false,
  spouseExists: false,
});

const emit = defineEmits<Emits>();

// 초기값 생성 함수
const createDefaultRecipient = (): RecipientRequestDto => ({
  relationship: '',
  recipientName: '',
  birthDate: '',
  isMarried: null as any,
  hasPriorGift: null as any,
  priorGiftAmount: undefined,
  giftTaxPayer: '',
});

// 반응형 데이터
const formData = ref<RecipientRequestDto>(
  props.recipient ? { ...props.recipient } : createDefaultRecipient()
);

const showAlert = ref(false);
const missingFieldsForAlert = ref<string[]>([]);

// 만원 단위 입력을 위한 계산된 속성
const priorGiftAmountInTenThousand = computed({
  get: () =>
    formData.value.priorGiftAmount != null
      ? String(formData.value.priorGiftAmount / 10000)
      : '',
  set: (value) => {
    const raw = value.replace(/[^\d]/g, '');
    formData.value.priorGiftAmount = raw ? Number(raw) * 10000 : undefined;
  },
});

// 관계 옵션
const relationshipOptions = ['자녀', '배우자', '손자녀', '형제자매', '기타'];

// 관계가 '배우자'로 변경될 때, 결혼 여부를 '예'로 자동 설정
watch(
  () => formData.value.relationship,
  (newRelationship) => {
    if (newRelationship === '배우자') {
      formData.value.isMarried = true;
    }
  }
);

// `hasPriorGift` 변경 시 `priorGiftAmount` 초기화
watch(
  () => formData.value.hasPriorGift,
  (newVal) => {
    if (newVal !== true) {
      formData.value.priorGiftAmount = undefined;
    }
  }
);

// Props가 변경될 때 `formData` 동기화
watch(
  () => props.recipient,
  (newRecipient) => {
    formData.value = newRecipient
      ? { ...newRecipient }
      : createDefaultRecipient();
  },
  { immediate: true }
);

// 유효성 검사 규칙 정의
const validationRules: {
  [key: string]: (data: RecipientRequestDto) => boolean | string;
} = {
  recipientName: (data) =>
    (data.recipientName && data.recipientName.trim() !== '') || '이름',
  relationship: (data) => !!data.relationship || '관계',
  birthDate: (data) => !!data.birthDate || '생년월일',
  isMarried: (data) => data.isMarried !== null || '결혼 여부',
  hasPriorGift: (data) => data.hasPriorGift !== null || '최근 10년간 증여 여부',
  priorGiftAmount: (data) =>
    !data.hasPriorGift ||
    (data.priorGiftAmount != null && data.priorGiftAmount >= 0) ||
    '증여 금액',
  giftTaxPayer: (data) => !!data.giftTaxPayer || '증여세 납부자',
};

// 제출 처리 함수
function handleSubmit() {
  const missingFields = Object.keys(validationRules)
    .map((field) => validationRules[field](formData.value))
    .filter((result): result is string => typeof result === 'string');

  if (missingFields.length > 0) {
    missingFieldsForAlert.value = missingFields;
    showAlert.value = true;
    return;
  }

  emit('confirm', formData.value);
}
</script>
