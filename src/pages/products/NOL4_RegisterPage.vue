<template>
  <div class="flex flex-col gap-16">
    <!-- 상단 대표 정보 -->
    <DetailImg v-if="detailItems.length" :items="detailItems" />

    <!-- 입력폼 -->
    <div
      class="stroke-primary relative left-1/2 mt-[-1.125rem] flex w-screen max-w-150 -translate-x-1/2 flex-col gap-4 bg-white px-4 py-8"
    >
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
        @click="openDateTimeModal"
      />
    </div>

    <!-- 예약 완료 버튼 -->
    <div>
      <p class="text-primary-500 mb-2 text-center font-semibold">
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
    <Confirm
      v-if="showLeaveConfirmModal"
      title="예약 종료"
      leftLabel="취소"
      rightLabel="확인"
      @click1="cancelNavigation"
      @click2="confirmNavigation"
    >
      <p class="text-center">
        작성 중인 예약 페이지는 저장되지 않습니다.<br />
        페이지를 나가겠습니까?
      </p>
    </Confirm>

    <Alert v-if="showAlert" :title="alertTitle" @click="closeAlert">
      <p class="text-center whitespace-pre-line">{{ alertMessage }}</p>
    </Alert>

    <Confirm
      v-if="showConfirm"
      :title="confirmTitle"
      leftLabel="아니오"
      rightLabel="바꾸기"
      @click1="onConfirmNo"
      @click2="onConfirmYes"
    >
      <p class="text-center whitespace-pre-line">{{ confirmMessage }}</p>
    </Confirm>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, onUnmounted, onMounted } from 'vue';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import ReserveInputBox from './_components/ReserveInputBox.vue';
import Modal from '@/components/modals/Modal.vue';
import BranchSelectModal from './_components/BranchSelectModal.vue';
import DateTimeSelectModal from './_components/DateTimeSelectModal.vue';
import { useRegisterStore } from '@/stores/register';
import { branchList } from '@/data/branchList';
import { branchApi } from '@/api/user/branch';
import { profileApi } from '@/api/profile/profile'; // profileApi 임포트
import {
  fetchReservedSlots,
  postBooking,
  smsApi,
  type SmsData,
} from '@/api/products/register';
import { useProductStore } from '@/stores/product';
import Alert from '@/components/modals/Alert.vue';
import Confirm from '@/components/modals/Confirm.vue';

const router = useRouter();
const route = useRoute();
const registerStore = useRegisterStore();
const productStore = useProductStore();

// 선택한 상품에 맞는 결과로 수정해야 함
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
const userPhoneNumber = ref(''); // 사용자 전화번호를 저장할 ref 추가

const showBranchModal = ref(false);
const showDateTimeModal = ref(false);
const showLeaveConfirmModal = ref(false); // 페이지 이탈 확인 모달
let resolveNavigation: ((value: boolean) => void) | undefined; // 네비게이션 해결 함수

const branchModalRef = ref<InstanceType<typeof BranchSelectModal> | null>(null);
const dateTimeModalRef = ref<InstanceType<typeof DateTimeSelectModal> | null>(
  null
);

// 알럿 상태
const showAlert = ref(false);
const alertTitle = ref<string | undefined>(undefined);
const alertMessage = ref('');
const openAlert = (message: string, title?: string) => {
  alertMessage.value = message;
  alertTitle.value = title;
  showAlert.value = true;
};
const closeAlert = () => {
  showAlert.value = false;
};

// 컨펌 상태
const showConfirm = ref(false);
const confirmTitle = ref<string | undefined>(undefined);
const confirmMessage = ref('');
let confirmResolve: ((v: boolean) => void) | null = null;

// 열기(프로미스 반환)
const openConfirm = (message: string, title?: string) =>
  new Promise<boolean>((resolve) => {
    confirmMessage.value = message;
    confirmTitle.value = title;
    showConfirm.value = true;
    confirmResolve = resolve;
  });

// 버튼 핸들러
const onConfirmNo = () => {
  showConfirm.value = false;
  confirmResolve?.(false);
  confirmResolve = null;
};
const onConfirmYes = () => {
  showConfirm.value = false;
  confirmResolve?.(true);
  confirmResolve = null;
};

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

// 상품명 쿼리 기반 설정
watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string') {
      if (id === 'gift') {
        // guno: 증여 시뮬레이션에서 온 경우 '증여 시뮬레이션 결과'
        registerStore.setProductName('증여 시나리오 설계');
      } else if (id === 'inheritance') {
        registerStore.setProductName('상속 시나리오 설계');
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

onMounted(async () => {
  try {
    const myBranch = await branchApi.getMyBranch();
    if (myBranch && myBranch.branchName) {
      const foundBranch = branchList.find(
        (b) => b.name === myBranch.branchName
      );
      if (foundBranch) {
        branchValue.value = foundBranch.name;
        registerStore.setBranch(foundBranch.name);
        registerStore.setBranchId(foundBranch.id);
      }
    }
  } catch (error) {
    console.error('내 지점 정보 조회 실패:', error);
  }

  // 사용자 전화번호 가져오기
  try {
    const userProfile = await profileApi.getUserProfile();
    if (userProfile && userProfile.userPhone) {
      userPhoneNumber.value = userProfile.userPhone;
    }
  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
  }
});

// 파일 상단 스코프에 추가
const handleDateTimeModal = async () => {
  if (!registerStore.branchId) {
    openAlert('지점을 먼저 선택해주세요.', '안내');
    return;
  }
  try {
    const res = await fetchReservedSlots(registerStore.branchId);
    const slots = res?.reserved_slots ?? {};
    registerStore.setReservedSlots(slots);
    showDateTimeModal.value = true;
  } catch (err) {
    console.error('예약 슬롯 조회 실패', err);
    openAlert(
      '예약 가능한 시간을 불러오는데 실패했습니다. 다시 시도해주세요.',
      '예약 실패'
    );
  }
};

const selectBranch = async () => {
  const selected = branchModalRef.value?.getSelectedBranch?.();
  if (!selected) {
    console.log('선택된 지점이 없습니다');
    return;
  }

  // 1. 정확한 이름 매칭 시도
  let found = branchList.find((b) => b.name === selected);

  // 2. 정확한 매칭이 안 되면 포함 관계로 재시도
  if (!found) {
    found = branchList.find(
      (b) => selected.includes(b.name) || b.name.includes(selected)
    );
  }

  // 3. 여전히 찾지 못하면 경고 메시지 표시 및 모달 유지
  if (!found) {
    openAlert(
      '아직 해당 지점은 예약서비스를 준비 중입니다.\n다른 지점에서 예약을 진행해주세요.',
      '예약 안내'
    );
    return; // 모달을 닫지 않고 함수 종료
  }

  console.log('매칭된 지점:', found);

  const confirmed = await openConfirm(
    `해당 지점(${selected})으로 내 지점을 변경하시겠습니까?\n'아니오'를 누르면 이번 예약에만 해당 지점이 적용됩니다.`,
    '지점 변경'
  );

  if (confirmed) {
    try {
      await branchApi.setMyBranch({ branchId: found.id });
      openAlert(
        '내 지점 정보가 선택한 지점으로 변경됐습니다.',
        '지점 변경 완료'
      );
    } catch (error) {
      console.error('내 지점 업데이트 실패:', error);
      openAlert(
        '내 지점 업데이트에 실패했습니다.\n이번 예약에만 해당 지점이 적용됩니다.',
        '지점 변경 실패'
      );
    }
  }

  branchValue.value = selected;
  registerStore.setBranch(selected);
  registerStore.setBranchId(found.id);
  showBranchModal.value = false;

  try {
    const res = await fetchReservedSlots(found.id);
    registerStore.setReservedSlots(res?.reserved_slots ?? {});
    await handleDateTimeModal();
  } catch (e) {
    console.error('예약 슬롯 조회 실패', e);
  }
};

// 날짜·시간 선택 모달 열기(항상 최신 슬롯 fetch 후 오픈)
const openDateTimeModal = async () => {
  if (!registerStore.branchId) {
    openAlert('지점을 먼저 선택해주세요.', '안내');
    return;
  }
  try {
    const res = await fetchReservedSlots(registerStore.branchId);
    registerStore.setReservedSlots(res?.reserved_slots ?? {});
    console.log('예약 가능한 시간:', res?.reserved_slots);
    showDateTimeModal.value = true;
  } catch (err) {
    console.error('예약 슬롯 조회 실패', err);
    openAlert(
      '예약 가능한 시간을 불러오는데 실패했습니다. 다시 시도해주세요.',
      '예약 실패'
    );
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

// 현재 예약 흐름: gift/inheritance면 gift, 아니면 nohoo
const flow = computed<'gift' | 'nohoo'>(() => {
  const id = route.params.id as string;
  return id === 'gift' || id === 'inheritance' ? 'gift' : 'nohoo';
});

// 예약 완료 처리
const goToRegister = async () => {
  if (!isFormValid.value) {
    openAlert('모든 값을 올바르게 입력해주세요.', '입력 오류');
    return;
  }

  const payload = {
    branchId: registerStore.branchId,
    finPrdtCode: route.params.id as string,
    date: registerStore.date,
    time: registerStore.time,
  };

  let bookingResult: { bookingCode: string; docInfo: any } | null = null;
  try {
    bookingResult = await postBooking(payload);
  } catch (error: any) {
    if (
      error.response?.status === 409 ||
      error.response?.data?.error === 'DUPLICATE_BOOKING'
    ) {
      openAlert(
        '해당 시각은 이미 예약되어 있습니다. 다른 시간을 선택해주세요.'
      );
      selectedReservation.value = { date: '', time: '' };
      registerStore.setDate('');
      registerStore.setTime('');
      await handleDateTimeModal();
      return;
    } else {
      openAlert('예약 중 오류가 발생했습니다. 다시 시도해주세요.', '예약 실패');
    }
    return;
  }

  // SMS 전송 (성공/실패와 관계없이 완료 페이지로 이동해도 되면 try/catch 밖으로 빼도 OK)
  try {
    const result = await smsApi.send({
      phoneNumber: userPhoneNumber.value,
      productName: productName.value,
      branchName: branchValue.value,
      reservationDate: selectedReservation.value.date,
      reservationTime: selectedReservation.value.time,
    });

    if (!result.success) {
      openAlert('SMS 전송에 실패했습니다. 다시 시도해주세요.', 'SMS 전송 실패');
    }
  } catch (error) {
    openAlert(
      'SMS 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
      'SMS 전송 실패'
    );
  }

  // 완료 페이지 이동: from=gift | nohoo 함께 전달
  registerStore.$reset();
  router.push({
    name: 'register-complete',
    query: {
      bookingCode: bookingResult?.bookingCode,
      from: flow.value,
    },
  });
};

// 페이지 이탈 방지 로직
onBeforeRouteLeave((to) => {
  // 예약 완료 페이지로 이동하는 경우는 예외
  if (to.name === 'register-complete') {
    return true;
  }

  // registerStore에 데이터가 있는 경우에만 모달 표시
  const hasData =
    registerStore.productName ||
    registerStore.branch ||
    registerStore.date ||
    registerStore.time;

  if (!hasData) {
    return true; // 데이터가 없으면 그냥 이동
  }

  showLeaveConfirmModal.value = true;
  return new Promise<boolean>((resolve) => {
    resolveNavigation = resolve;
  });
});

const confirmNavigation = () => {
  showLeaveConfirmModal.value = false;
  registerStore.$reset(); // registerStore 초기화
  if (resolveNavigation) {
    resolveNavigation(true); // 페이지 이동 허용
  }
};

const cancelNavigation = () => {
  showLeaveConfirmModal.value = false;
  if (resolveNavigation) {
    resolveNavigation(false); // 페이지 이동 취소
  }
};
</script>
