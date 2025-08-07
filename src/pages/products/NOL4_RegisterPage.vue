<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg v-if="detailItems.length" :items="detailItems" />

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
        @click="handleDateTimeModal"
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

    <!-- 페이지 이탈 확인 모달 -->
    <Modal
      v-if="showLeaveConfirmModal"
      title="예약 종료"
      leftLabel="취소"
      rightLabel="확인"
      @click1="cancelNavigation"
      @click2="confirmNavigation"
    >
      <p class="text-center">
        벗어나면 예약정보는 저장되지 않습니다.<br />
        예약을 종료하시겠습니까?
      </p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, onUnmounted } from 'vue';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import ReserveInputBox from './_components/ReserveInputBox.vue';
import Modal from '@/components/modals/Modal.vue';
import BranchSelectModal from './_components/BranchSelectModal.vue';
import DateTimeSelectModal from './_components/DateTimeSelectModal.vue';
import { useRegisterStore } from '@/stores/register';
import { branchList } from '@/data/branchList';
import {
  fetchReservedSlots,
  postBooking,
  smsApi,
  type SmsData,
  updateUserBranch,
} from '@/api/products/register';
import { useProductStore } from '@/stores/product';

const router = useRouter();
const route = useRoute();
const registerStore = useRegisterStore();
const productStore = useProductStore();

const detailItems = computed(() => registerStore.topInfos);

const productName = computed({
  get: () => registerStore.productName,
  set: (val: string) => registerStore.setProductName(val),
});

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

const isFormValid = computed(() => {
  return (
    productName.value &&
    branchValue.value &&
    selectedReservation.value.date &&
    selectedReservation.value.time
  );
});

// 지점 선택 완료
// 상품명 퀴리 기반 설정
watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string') {
      // 증여 시뮬레이션에서 온 경우 '증여 시뮬레이션 결과'
      if (id === 'gift') {
        registerStore.setProductName('증여 시뮬레이션 결과');
      } else {
        const product = productStore.getProductById(id);
        if (product) {
          registerStore.setProductName(product.finPrdtNm);
        }
      }
    }
  },
  { immediate: true }
);

// 지점 선택 완료
const selectBranch = async () => {
  const selected = branchModalRef.value?.getSelectedBranch?.();
  if (!selected) {
    console.log('선택된 지점이 없습니다');
    return;
  }

  const found = branchList.find((b) => b.name === selected);

  // 데이터에 없는 지점 선택 시
  if (!found) {
    alert(
      '아직 해당 지점은 예약서비스를 준비 중입니다. 다른 지점에서 예약을 진행해주세요.'
    );
    return;
  }

  // 내 지점 업데이트
  const confirmed = window.confirm(
    `${selected} 지점으로 내 지점을 설정하시겠습니까?\n'아니오'를 누르면 이번 예약에만 해당 지점이 적용됩니다.`
  );

  if (confirmed) {
    try {
      await updateUserBranch({ branchId: found.id });
      alert('내 지점 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('내 지점 업데이트 실패:', error);
      alert(
        '내 지점 업데이트에 실패했습니다. 이번 예약에만 해당 지점이 적용됩니다.'
      );
    }
  }

  branchValue.value = selected;
  registerStore.setBranch(selected);
  registerStore.setBranchId(found.id);
  showBranchModal.value = false;

  // 예약 가능한 시간 조회
  try {
    const response = await fetchReservedSlots(found.id);
    const slots = response.reserved_slots || {};
    // 이미 예약된 시간은 제외하고, 예약 가능한 시간만 필터링
    if (Object.keys(slots).length === 0) {
      alert('현재 예약 가능한 시간이 없습니다. 다른 지점을 선택해주세요.');
      return;
    }
    registerStore.setReservedSlots(slots);
  } catch (e) {
    console.error('예약 슬롯 조회 실패', e);
    alert('예약 가능한 시간을 불러오는데 실패했습니다.');
  }
};

const handleDateTimeModal = async () => {
  if (!registerStore.branchId) {
    alert('지점을 먼저 선택해주세요.');
    return;
  }
  // 항상 최신 데이터를 가져오도록 스토어의 데이터를 다시 fetch
  try {
    const response = await fetchReservedSlots(registerStore.branchId);
    const slots = response.reserved_slots || {};

    if (Object.keys(slots).length === 0) {
      alert('현재 예약 가능한 시간이 없습니다. 다른 지점을 선택해주세요.');
      return;
    }
    registerStore.setReservedSlots(slots);
    showDateTimeModal.value = true;
  } catch (e) {
    console.error('예약 슬롯 조회 실패', e);
    alert('예약 가능한 시간을 불러오는데 실패했습니다.');
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
const goToRegister = async () => {
  if (!isFormValid.value) {
    alert('모든 값을 입력해주세요.');
    return;
  }

  const payload = {
    branchId: registerStore.branchId,
    finPrdtCode: route.params.id as string,
    date: registerStore.date,
    time: registerStore.time,
  };

  try {
    await postBooking(payload);
    console.log('예약 성공:', payload);

    const smsData: SmsData = {
      phoneNumber: '01071100441',
      productName: productName.value,
      branchName: branchValue.value,
      reservationDate: selectedReservation.value.date,
      reservationTime: selectedReservation.value.time,
    };

    // SMS는 성공 여부와 관계없이 예약 완료 페이지로 이동
    await smsApi
      .send(smsData)
      .catch((err) => console.error('SMS 전송 실패:', err));
    router.push({ name: 'register-complete' });
  } catch (error: any) {
    if (error.response?.data?.error === 'DUPLICATE_BOOKING') {
      alert(
        '해당 지점의 해당 시각에는 이미 예약이 존재합니다. 다른 시각을 선택해주세요.'
      );
      selectedReservation.value.date = '';
      selectedReservation.value.time = '';
      registerStore.setDate('');
      registerStore.setTime('');
      handleDateTimeModal();
    } else {
      console.error('예약 실패:', error.response?.data || error.message);
      alert('예약 중 오류가 발생했습니다.');
    }
  }
};

// 페이지 이탈 방지 로직
const showLeaveConfirmModal = ref(false);
let resolveNavigation: (value: boolean) => void;

const confirmNavigation = () => {
  showLeaveConfirmModal.value = false;
  resolveNavigation(true);
};

const cancelNavigation = () => {
  showLeaveConfirmModal.value = false;
  resolveNavigation(false);
};

onBeforeRouteLeave((to) => {
  if (to.name === 'register-complete') {
    return true;
  }
  const hasData =
    registerStore.branch || registerStore.date || registerStore.time;
  if (!hasData) {
    return true;
  }
  showLeaveConfirmModal.value = true;
  return new Promise<boolean>((resolve) => {
    resolveNavigation = resolve;
  });
});

onUnmounted(() => {
  registerStore.$reset();
});
</script>
