<!-- _components/RecipientFormModal.vue -->
<template>
  <Modal
    @click1="$emit('cancel')"
    @click2="handleSubmit"
    :title="isEditing ? '수증자 정보 수정' : '수증자 정보 입력'"
    leftLabel="취소"
    rightLabel="완료"
  >
    <div class="space-y-4">
      <!-- 이름 -->
      <FormField label="이름을 입력하세요">
        <InputBox
          placeholder="입력하세요"
          size="medium"
          type="text"
          v-model="formData.name"
          class="w-full"
        />
      </FormField>

      <!-- 관계 -->
      <FormField label="증여자와의 관계를 입력하세요">
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
      <FormField label="생년월일을 입력하세요">
        <InputBox
          size="medium"
          type="date"
          v-model="formData.birth"
          class="w-full"
        />
      </FormField>

      <!-- 결혼 여부 -->
      <FormField label="수증자의 결혼 여부를 알려주세요">
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

      <!-- 소득 여부 -->
      <FormField
        label="수증자의 소득 유무를 알려주세요"
        description="총급여 100만 원 초과 시 '소득 있음'을 선택하세요."
      >
        <SelectBox v-model="formData.incomeStatus" size="large" class="w-full">
          <option disabled value="">선택하세요</option>
          <option
            v-for="option in incomeStatusOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </SelectBox>
      </FormField>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Modal from '@/components/modals/Modal.vue';
import InputBox from '@/components/forms/InputBox.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import FormField from './FormField.vue';

// 타입 정의
interface Recipient {
  name: string;
  relationship: string;
  birth: string;
  maritalStatus: string;
  incomeStatus: string;
}

interface Props {
  recipient?: Recipient;
  isEditing?: boolean;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm', recipient: Recipient): void;
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  recipient: () => ({
    name: '',
    relationship: '',
    birth: '',
    maritalStatus: '',
    incomeStatus: '',
  }),
  isEditing: false,
});

const emit = defineEmits<Emits>();

// 더미 옵션
const relationshipOptions = ['자녀', '배우자', '손자녀', '형제자매', '기타'];
const maritalStatusOptions = ['미혼', '결혼', '기타'];
const incomeStatusOptions = ['소득 있음', '소득 없음', '소득 모름'];

// 반응형 데이터
const formData = ref<Recipient>({ ...props.recipient });

// Props가 변경될 때 formData 동기화
watch(
  () => props.recipient,
  (newRecipient) => {
    formData.value = { ...newRecipient };
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
  if (!formData.value.incomeStatus) missingFields.push('소득 여부');

  if (missingFields.length > 0) {
    alert(`정보를 입력해주세요:\n${missingFields.join(', ')}`);
    return;
  }

  emit('confirm', { ...formData.value });
};
</script>
