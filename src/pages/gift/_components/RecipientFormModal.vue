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
        <SelectBox v-model="formData.isMarried" size="medium" class="w-full">
          <option disabled :value="null">선택하세요</option>
          <option :value="true">예</option>
          <option :value="false">아니오</option>
        </SelectBox>
      </FormField>

      <FormField
        :label="`최근 10년 내 ${formData.recipientName || '수증자'}에게 증여한 적 있나요?`"
      >
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
              @input="handleAmountInput"
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
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import Modal from '@/components/modals/Modal.vue';
import InputBox from '@/components/forms/InputBox.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import FormField from './FormField.vue';
import type { RecipientRequestDto } from '@/types/gift/recipient';
import { formatCurrency } from '@/utils/format';

// Props & Emits
interface Props {
  recipient?: RecipientRequestDto | null;
  isEditing?: boolean;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm', recipient: RecipientRequestDto): void;
}

// `mode` prop 제거
const props = withDefaults(defineProps<Props>(), {
  recipient: null,
  isEditing: false,
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

const priorGiftAmountInTenThousand = ref<string>('');

// 숫자 입력 처리 함수
const handleAmountInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const raw = target.value.replace(/[^\d]/g, '');
  formData.value.priorGiftAmount = Number(raw) * 10000 || undefined;
  priorGiftAmountInTenThousand.value = raw;
};

// 더미 옵션
const relationshipOptions = ['자녀', '배우자', '손자녀', '형제자매', '기타'];

// `hasPriorGift` 변경 시 `priorGiftAmount`와 `priorGiftAmountInTenThousand` 초기화
watch(
  () => formData.value.hasPriorGift,
  (newVal) => {
    if (newVal !== true) {
      formData.value.priorGiftAmount = undefined;
      priorGiftAmountInTenThousand.value = '';
    }
  }
);

// Props가 변경될 때 `formData` 동기화 및 `priorGiftAmountInTenThousand` 설정
watch(
  () => props.recipient,
  (newRecipient) => {
    if (newRecipient) {
      formData.value = { ...newRecipient };
      priorGiftAmountInTenThousand.value = newRecipient.priorGiftAmount
        ? String(newRecipient.priorGiftAmount / 10000)
        : '';
    } else {
      formData.value = createDefaultRecipient();
      priorGiftAmountInTenThousand.value = '';
    }
  },
  { immediate: true }
);

// 제출 처리 함수
const handleSubmit = () => {
  const missingFields: string[] = [];

  // 모든 필드에 대한 유효성 검사
  if (!formData.value.recipientName.trim()) missingFields.push('이름');
  if (!formData.value.relationship) missingFields.push('관계');
  if (!formData.value.birthDate) missingFields.push('생년월일');
  if (formData.value.isMarried === null) missingFields.push('결혼 여부');
  if (formData.value.hasPriorGift === null)
    missingFields.push('최근 10년간 증여 여부');
  if (
    formData.value.hasPriorGift === true &&
    (formData.value.priorGiftAmount === undefined ||
      formData.value.priorGiftAmount < 0)
  ) {
    missingFields.push('증여 금액');
  }
  if (!formData.value.giftTaxPayer) missingFields.push('증여세 납부자');

  if (missingFields.length > 0) {
    alert(`모든 필수 정보를 입력해 주세요:\n- ${missingFields.join('\n- ')}`);
    return;
  }

  emit('confirm', formData.value);
};
</script>
