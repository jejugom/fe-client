<template>
  <Modal
    @click1="$emit('cancel')"
    @click2="handleSubmit"
    :title="isEditing ? '수증자 정보 수정' : '수증자 정보 입력'"
    leftLabel="그만두기"
    rightLabel="저장하기"
  >
    <div class="space-y-4">
      <!-- 이름 -->
      <FormField label="이름을 입력해 주세요">
        <InputBox
          placeholder="입력하세요"
          size="medium"
          type="text"
          v-model="formData.name"
          class="w-full"
        />
      </FormField>

      <!-- 관계 -->
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

      <!-- 생년월일 -->
      <FormField label="생년월일은 언제인가요?">
        <InputBox
          size="medium"
          type="date"
          v-model="formData.birth"
          class="w-full"
        />
      </FormField>

      <!-- 결혼 여부 -->
      <FormField label="결혼하셨나요?">
        <SelectBox
          v-model="formData.maritalStatus"
          size="medium"
          class="w-full"
        >
          <option disabled value="">선택하세요</option>
          <option
            v-for="option in maritalStatusOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </SelectBox>
      </FormField>

      <!-- 최근 10년 내 증여 여부 -->
      <FormField
        :label="`최근 10년 내 ${formData.name || '수증자'}에게 증여한 적 있나요?`"
      >
        <SelectBox v-model="formData.giftedBefore" size="medium" class="w-full">
          <option disabled value="">선택하세요</option>
          <option value="true">예</option>
          <option value="false">아니오</option>
        </SelectBox>
      </FormField>

      <!-- 증여 금액 (조건부 표시) -->
      <FormField
        v-if="formData.giftedBefore === 'true'"
        label="증여한 금액 (원)"
      >
        <div class="flex flex-col items-start">
          <div class="relative w-full">
            <InputBox
              type="text"
              size="medium"
              placeholder="금액을 입력하세요"
              v-model="formData.giftedAmount"
              class="w-full"
              @input="handleAmountInput"
            />
            <span
              class="text-surface-500 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform"
            >
              만원
            </span>
          </div>
          <p class="mt-1 w-full text-right text-blue-300">
            {{ formatAmount(formData.giftedAmount) }}
          </p>
        </div>
      </FormField>
      <!-- 증여세 납부자 -->
      <FormField label="증여세는 누가 부담하나요?">
        <SelectBox v-model="formData.whoPaysTax" size="medium" class="w-full">
          <option disabled value="">선택하세요</option>
          <option value="본인">본인이 대신 납부</option>
          <option value="수증자">
            {{ formData.name ? `${formData.name}이(가) 직접 납부` : '수증자' }}
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

// 타입 정의
interface OriginalRecipient {
  name: string;
  relationship: string;
  birth: string;
  maritalStatus: string;
  giftedBefore: boolean;
  giftedAmount: number;
  whoPaysTax: string;
}

interface FormRecipient {
  name: string;
  relationship: string;
  birth: string;
  maritalStatus: string;
  giftedBefore: string; // 'true' | 'false' | ''
  giftedAmount: string;
  whoPaysTax: string;
}

interface Props {
  recipient?: OriginalRecipient | null;
  isEditing?: boolean;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm', recipient: OriginalRecipient): void;
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  recipient: null,
  isEditing: false,
});

const emit = defineEmits<Emits>();

// 기본값 생성 함수
const createDefaultRecipient = (): FormRecipient => ({
  name: '',
  relationship: '',
  birth: '',
  maritalStatus: '',
  giftedBefore: '',
  giftedAmount: '',
  whoPaysTax: '',
});

// 타입 변환 함수
const convertToFormData = (
  recipient: OriginalRecipient | null
): FormRecipient => {
  if (!recipient) return createDefaultRecipient();

  return {
    ...recipient,
    giftedBefore:
      recipient.giftedBefore === true
        ? 'true'
        : recipient.giftedBefore === false
          ? 'false'
          : '',
    giftedAmount: recipient.giftedAmount.toString(), // 숫자를 문자열로 변환
  };
};

// 숫자 입력만 허용 (숫자가 아니면 제거)
const handleAmountInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const raw = target.value.replace(/[^\d]/g, ''); // 숫자만 남김
  formData.value.giftedAmount = raw; // 숫자가 아닌 문자열 할당 (ex: '5000')
};

// 금액 포맷 함수 (원 단위)
const formatAmount = (amount: number | string): string => {
  const num = Number(amount);

  // 숫자가 아닌 경우 경고 표시
  const eok = Math.floor(num / 100000000);
  const man = Math.floor((num % 100000000) / 10000);
  const won = num % 10000;

  let result = '';

  if (eok > 0) result += `${eok.toLocaleString()}억 `;
  if (man > 0) result += `${man.toLocaleString()}만 `;
  if (won > 0) result += `${won.toLocaleString()}원`;

  // 뒤에 단위가 없는 경우 마지막에 '원' 붙이기
  if (result.trim().endsWith('억') || result.trim().endsWith('만')) {
    result = result.trim() + '원';
  }

  return result.trim();
};

// 더미 옵션
const relationshipOptions = ['자녀', '배우자', '손자녀', '형제자매', '기타'];
const maritalStatusOptions = ['미혼', '결혼', '기타'];

// 반응형 데이터
const formData = ref<FormRecipient>(convertToFormData(props.recipient));

// giftedBefore 변경 시 giftedAmount 초기화
watch(
  () => formData.value.giftedBefore,
  (newVal) => {
    if (newVal !== 'true') {
      formData.value.giftedAmount = '0';
    }
  }
);

// Props가 변경될 때 formData 동기화
watch(
  () => props.recipient,
  (newRecipient) => {
    formData.value = convertToFormData(newRecipient);
  },
  { deep: true, immediate: true }
);

// 제출 처리
const handleSubmit = () => {
  const missingFields: string[] = [];

  if (!formData.value.name.trim()) missingFields.push('이름');
  if (!formData.value.relationship) missingFields.push('관계');
  if (!formData.value.birth) missingFields.push('생년월일');
  if (!formData.value.maritalStatus) missingFields.push('결혼 여부');
  if (formData.value.giftedBefore === '')
    missingFields.push('최근 10년간 증여 여부');
  if (formData.value.giftedBefore === 'true' && !formData.value.giftedAmount) {
    missingFields.push('증여 금액');
    if (!formData.value.whoPaysTax) missingFields.push('증여세 납부자');
  }

  if (missingFields.length > 0) {
    alert(`정보를 입력해주세요:\n${missingFields.join(', ')}`);
    return;
  }

  // 제출할 때는 다시 boolean으로 변환
  const submitData: OriginalRecipient = {
    ...formData.value,
    giftedBefore: formData.value.giftedBefore === 'true',
    giftedAmount: Number(formData.value.giftedAmount), // 문자열을 숫자로 변환
  };

  emit('confirm', submitData);
};
</script>
