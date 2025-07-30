<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <!-- 입력폼 -->
    <div class="flex flex-col gap-4">
      <ReserveInputBox
        title="상품명"
        type="text"
        placeholder="상품 선택"
        :readOnly="true"
        v-model="productName"
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

    <!-- 예약 완료 버튼 -->
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
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import ReserveInputBox from './_components/ReserveInputBox.vue';
import Modal from '@/components/modals/Modal.vue';
import BranchSelectModal from './_components/BranchSelectModal.vue';
import DateTimeSelectModal from './_components/DateTimeSelectModal.vue';
import { useRegisterStore } from '@/stores/register';
import { api_data } from '@/api/products/productDetail';

const router = useRouter();
const route = useRoute();
const registerStore = useRegisterStore();

const productName = computed({
  get: () => registerStore.productName,
  set: (val: string) => registerStore.setProductName(val),
});

// guno: 임시로 증여에서 넘어온 것은 증여 시뮬레이션 결과라고 표시
// const modelValue = ref(
//   route.params.id === 'gift'
//     ? '증여 시뮬레이션 결과'
//     : productDetail?.productName || ''
// );

const branchValue = ref(registerStore.branch);
const selectedReservation = ref({
  date: registerStore.date,
  time: registerStore.time,
});

const showBranchModal = ref(false);
const showDateTimeModal = ref(false);

const branchModalRef = ref<InstanceType<typeof BranchSelectModal> | null>(null);
const dateTimeModalRef = ref<InstanceType<typeof DateTimeSelectModal> | null>(
  null
);

// 날짜 & 시간 텍스트 변환
const displayDateTime = computed(() => {
  const { date, time } = selectedReservation.value;
  if (!date || !time) return '';

  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');
  const h = parseInt(hour);
  const ampm = h < 12 ? '오전' : '오후';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${year}년 ${month}월 ${day}일 ${ampm} ${hh}시 ${minute}분`;
});

const isFormValid = computed(
  () =>
    productName.value &&
    branchValue.value &&
    selectedReservation.value.date &&
    selectedReservation.value.time
);

// 상품명 쿼리 기반 설정
watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string') {
      const match = api_data.fin_prdt_cd === id ? api_data : null;
      if (match) registerStore.setProductName(match.fin_prdt_nm);
    }
  },
  { immediate: true }
);

// 지점 선택 완료

// axios post 로 인해 async 처리
const goToRegister = async () => {
  if (!isFormValid.value) {
    alert('모든 값을 입력해주세요.');
    return;
  }

  // SMS 전송을 위한 예약 정보
  const smsData = {
    phoneNumber: '01099255708', // 실제로는 사용자 입력값 사용
    productName: productName.value,
    branchName: branchValue.value,
    reservationDate: selectedReservation.value.date,
    reservationTime: selectedReservation.value.time,
    // userName은 생략 - 백엔드에서 못받은 경우 "고객님"으로 처리
    // 추후 프론트에서 보내줄지, 백엔드에서 로그인 정보 토대로 확인 가능한지 파악 후 수정
    // branchAddress: 지점 주소 보내주는 것 프론트에서 보내줄지 백엔드에서 보내줄지 확인 후 수정
  };

  try {
    // 임시로 test 요청만 보냅니다. - 추후 삭제
    const response = await axios.get('http://localhost:8080/api/sms/test');
    if (response.data === 'SMS API 연결 성공!') {
      console.log(smsData);
      console.log('SMS API 테스트 성공:', response.data);
      router.push({ name: 'register-complete' });
    } else {
      alert('SMS API 테스트 실패: ' + response.data);
    }

    // axios POST 요청 - 구현 완료 - 추후 이 코드로 교체
    // const response = await axios.post(
    //   // uri 주소는 추후 개선
    //   'http://localhost:8080/api/sms/send',
    //   smsData
    // );
    // if (response.data.success) {
    //   console.log('SMS 전송 성공:', response.data);
    //   router.push({ name: 'register-complete' });
    // } else {
    //   alert('SMS 전송 실패: ' + response.data.message);
    //   // 오류 페이지 라우터 푸시
    // } end of code
  } catch (error) {
    console.error('SMS 전송 실패:', error);
    alert('SMS 전송에 실패했습니다.');
    // 오류 페이지 라우터 푸시
  }
};

const selectBranch = () => {
  const selected = branchModalRef.value?.getSelectedBranch?.();
  if (selected) {
    branchValue.value = selected;
    registerStore.setBranch(selected);
    showBranchModal.value = false;
  }
};

// 날짜 시간 선택 처리
const handleDateTimeSelect = (payload: { date: string; time: string }) => {
  selectedReservation.value = payload;
  registerStore.setDate(payload.date);
  registerStore.setTime(payload.time);
};
const submitDateTime = () => {
  dateTimeModalRef.value?.submitSelection();
};

// 예약 완료 처리
const goToRegister = () => {
  if (!isFormValid.value) {
    alert('모든 값을 입력해주세요.');
    return;
  }
  console.log('예약 완료:', registerStore.getSummary());

  router.push({
    name: 'register-complete',
    params: { type: route.params.id === 'gift' ? 'gift' : 'product' },
  });
};
</script>
