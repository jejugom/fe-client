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
        작성 중인 예약 페이지는 저장되지 않습니다.<br />
        페이지를 나가겠습니까?
      </p>
    </Modal>
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
    alert('지점을 먼저 선택해주세요.');
    return;
  }
  try {
    const res = await fetchReservedSlots(registerStore.branchId);
    const slots = res?.reserved_slots ?? {};
    registerStore.setReservedSlots(slots);
    showDateTimeModal.value = true;
  } catch (err) {
    console.error('예약 슬롯 조회 실패', err);
    alert('예약 가능한 시간을 불러오는데 실패했습니다.');
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
    alert(
      '아직 해당 지점은 예약서비스를 준비 중입니다. 다른 지점에서 예약을 진행해주세요.'
    );
    return; // 모달을 닫지 않고 함수 종료
  }

  console.log('매칭된 지점:', found);

  const confirmed = window.confirm(
    `해당 지점(${selected})으로 내 지점을 변경하시겠습니까?\n'아니오'를 누르면 이번 예약에만 해당 지점이 적용됩니다.`
  );

  if (confirmed) {
    try {
      // API 명세에 따라 branchId를 포함한 객체를 전달
      await branchApi.setMyBranch({ branchId: found.id });
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

  try {
    const res = await fetchReservedSlots(found.id);
    registerStore.setReservedSlots(res?.reserved_slots ?? {});
    await handleDateTimeModal();
  } catch (e) {
    console.error('예약 슬롯 조회 실패', e);
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
// guno: axios post 로 인해 async 처리
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

  console.log('예약 정보:', payload);

  let bookingResult: { bookingCode: string; docInfo: any } | null = null;
  try {
    bookingResult = await postBooking(payload);
    console.log('예약 성공:', bookingResult);
  } catch (error: any) {
    if (
      error.response?.status === 409 ||
      error.response?.data?.error === 'DUPLICATE_BOOKING'
    ) {
      alert(
        error.response?.data?.detail ??
          '해당 시각은 이미 예약되어 있습니다. 다른 시간을 선택해주세요.'
      );
      selectedReservation.value = { date: '', time: '' };
      registerStore.setDate('');
      registerStore.setTime('');
      await handleDateTimeModal();
      return;
    } else {
      console.error('예약 실패:', error.response?.data || error.message);
      alert('예약 중 오류가 발생했습니다.');
    }
    return; // 예약 실패 시 함수 종료
  }

  // --- SMS 전송 로직 추가 ---

  // SMS 전송을 위한 예약 정보
  const smsData: SmsData = {
    phoneNumber: userPhoneNumber.value, // 사용자 전화번호 사용
    productName: productName.value,
    branchName: branchValue.value,
    reservationDate: selectedReservation.value.date,
    reservationTime: selectedReservation.value.time,
  };

  try {
    router.push({
      name: 'register-complete',
      query: { bookingCode: bookingResult?.bookingCode },
    });

    // SMS 전송 API - 구현 완료 - 추후 이 코드로 교체
    const result = await smsApi.send(smsData);
    if (result.success) {
      console.log('SMS 전송 성공:', result);
      registerStore.$reset(); // 예약 완료 후 store 비우기
      router.push({ name: 'register-complete' });
    } else {
      alert('SMS 전송 실패: ' + result.message);
      // 오류 페이지 라우터 푸시
    }
  } catch (error) {
    console.error('SMS API 오류:', error);
    alert('SMS API 요청에 실패했습니다.');
    // 오류 페이지 라우터 푸시
  }
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
