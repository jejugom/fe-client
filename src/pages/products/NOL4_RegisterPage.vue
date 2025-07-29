<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg :items="topInfos" />

    <div class="flex flex-col gap-4">
      <ReserveInputBox
        :title="getTitle()"
        type="text"
        placeholder="지점 선택"
        :readOnly="true"
        v-model="modelValue"
      />
      <ReserveInputBox
        title="방문할 지점"
        explain="지점 변경하시려면 눌러주세요"
        type="text"
        placeholder="지점 선택"
        :readOnly="true"
        v-model="branchValue"
        @click="showBranchModal = true"
      />
      <ReserveInputBox
        title="방문 날짜･시각"
        :readOnly="true"
        placeholder="예약 날짜와 시간을 선택하세요"
        :modelValue="displayDateTime"
        @click="showDateTimeModal = true"
      />
    </div>
    <div>
      <p class="text-primary-300 mb-2 text-center font-semibold">
        위 내용을 모두 확인하셨다면 지금 바로 버튼을 눌러주세요!
      </p>
      <Btn
        :color="isFormValid ? 'primary' : 'surface'"
        label="예약 완료하기"
        size="large"
        @click="goToRegister"
        :disabled="!isFormValid"
      />
    </div>
    <!-- 모달들 -->
    <Modal
      v-if="showBranchModal"
      title="가까운 지점 안내"
      leftLabel="닫기"
      rightLabel="선택"
      @click1="showBranchModal = false"
      @click2="selectBranch"
    >
      <BranchSelectModal ref="branchModalRef" />
    </Modal>

    <Modal
      v-if="showDateTimeModal"
      title="방문 날짜 및 시간 선택"
      leftLabel="취소"
      rightLabel="선택 완료"
      @click1="showDateTimeModal = false"
      @click2="submitDateTime"
    >
      <DateTimeSelectModal
        ref="dateTimeModalRef"
        @close="showDateTimeModal = false"
        @select="handleDateTimeSelect"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { productDetail } from './_dummy';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import ReserveInputBox from './_components/ReserveInputBox.vue';
import Modal from '@/components/modals/Modal.vue';
import BranchSelectModal from './_components/BranchSelectModal.vue';
import DateTimeSelectModal from './_components/DateTimeSelectModal.vue';

const router = useRouter();
const route = useRoute();

// 라우터 파라미터에 따라 title 설정
const getTitle = () => {
  return route.params.id === 'gift' ? '상담내용' : '상품';
};

// guno: 임시로 증여에서 넘어온 것은 증여 시뮬레이션 결과라고 표시
const modelValue = ref(
  route.params.id === 'gift'
    ? '증여 시뮬레이션 결과'
    : productDetail?.productName || ''
);

const branchValue = ref('');
const showBranchModal = ref(false);
const showDateTimeModal = ref(false);

const branchModalRef = ref<InstanceType<typeof BranchSelectModal> | null>(null);
const dateTimeModalRef = ref<InstanceType<typeof DateTimeSelectModal> | null>(
  null
);

const selectedReservation = ref<{ date: string | null; time: string | null }>({
  date: null,
  time: null,
});

const invalidFields = ref({
  model: false,
  branch: false,
  datetime: false,
});

const isFormValid = computed(() => {
  return (
    !!modelValue.value &&
    !!branchValue.value &&
    !!selectedReservation.value.date &&
    !!selectedReservation.value.time
  );
});

const displayDateTime = computed(() => {
  const { date, time } = selectedReservation.value;
  if (!date || !time) return '';

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedMinute = minute.toString().padStart(2, '0');

  return `${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일 ${ampm} ${displayHour}시 ${formattedMinute}분`;
});

const goToRegister = () => {
  if (!isFormValid.value) {
    alert('모든 값을 입력해주세요.');
    invalidFields.value = {
      model: !modelValue.value,
      branch: !branchValue.value,
      datetime: !(
        selectedReservation.value.date && selectedReservation.value.time
      ),
    };
    return;
  }

  console.log('예약 완료:', {
    상품명: modelValue.value,
    지점: branchValue.value,
    날짜: selectedReservation.value.date,
    시각: selectedReservation.value.time,
  });

  router.push({
    name: 'register-complete',
    params: {
      type: route.params.id === 'gift' ? 'gift' : 'product',
    },
  });
};

const selectBranch = () => {
  const selected = branchModalRef.value?.getSelectedBranch?.();
  if (selected) {
    branchValue.value = selected;
    showBranchModal.value = false;
  } else {
    alert('지점을 선택해주세요.');
  }
};

const handleDateTimeSelect = (payload: { date: string; time: string }) => {
  selectedReservation.value = payload;
};

const submitDateTime = () => {
  dateTimeModalRef.value?.submitSelection();
};

// 상단 정보
const detail = productDetail;
const topInfos =
  detail?.productType === '1'
    ? [
        { label: '금리', value: detail.iconInfo?.금리 ?? '' },
        { label: '가입방법', value: detail.iconInfo?.가입방법 ?? '' },
      ]
    : detail?.productType === '2'
      ? [
          { label: '금리', value: detail.iconInfo?.금리 ?? '' },
          { label: '가입방법', value: detail.iconInfo?.가입방법 ?? '' },
        ]
      : detail?.productType === '3'
        ? [
            {
              label: '연금저축유형',
              value: detail.iconInfo?.연금저축유형 ?? '',
            },
            { label: '저축금리', value: detail.iconInfo?.저축금리 ?? '' },
            { label: '가입방법', value: detail.iconInfo?.가입방법 ?? '' },
          ]
        : detail?.productType === '4'
          ? [
              {
                label: '담보인정비율',
                value: detail.iconInfo?.담보인정비율 ?? '',
              },
              { label: '대출금리', value: detail.iconInfo?.대출금리 ?? '' },
              { label: '가입방법', value: detail.iconInfo?.가입방법 ?? '' },
            ]
          : [];
</script>
