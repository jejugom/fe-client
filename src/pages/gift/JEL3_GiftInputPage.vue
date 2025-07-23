<template>
  <!-- 자산 차트 영역 -->
  <section>
    <div
      class="text-surface-500 bg-gradient-cross-1 mb-8 flex h-80 items-center justify-center"
    >
      Chart
    </div>
  </section>

  <!-- 자산 카테고리 선택 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold">
      증여 자산 카테고리 선택하기
    </h2>
    <p class="text-surface-500 mb-4 text-sm">
      수증자에게 어떤 자산을 나눠주실지 카테고리를 선택하면<br />
      해당 카테고리의 세부 자산을 선택하실 수 있습니다.
    </p>

    <div class="mb-8 grid grid-cols-3 gap-8">
      <!-- 반복 렌더링 -->
      <div
        v-for="(assets, category) in allAssets"
        :key="category"
        @click="openModal(category)"
        class="border-primary-300 flex flex-col items-center justify-between rounded-xl border p-4"
      >
        <div class="bg-gradient-cross-1 mb-2 h-12 w-12"></div>
        <div class="text-primary-500 text-sm font-semibold">{{ category }}</div>
        <div
          class="text-primary-500 bg-primary-100 mt-2 w-full rounded-xl py-2 text-center text-sm font-semibold"
        >
          {{ assets.filter((a) => a.selected).length }}/{{ assets.length }}
        </div>
      </div>
    </div>
  </section>

  <!-- 자산 선택 모달 -->
  <Modal
    v-if="isModalOpen"
    @click1="closeModal"
    @click2="closeModal"
    title="자산 선택"
    leftLabel="취소"
    rightLabel="완료"
  >
    <!-- 단위 -->
    <div class="text-surface-300 text-right text-xs">단위: 원</div>

    <!-- 자산 리스트 -->
    <ul class="mt-4 space-y-3">
      <li
        v-for="(item, index) in assetList"
        :key="index"
        class="border-surface-300 flex items-center justify-between rounded-xl border px-4 py-3"
        @click="item.selected = !item.selected"
      >
        <!-- 자산 정보 -->
        <div>
          <p class="text-surface-500 text-base font-semibold">{{
            item.name
          }}</p>
          <p class="text-surface-500 text-base">{{ item.amount }}</p>
        </div>

        <!-- 체크박스 -->
        <input
          type="checkbox"
          class="accent-primary-300 h-5 w-5"
          :checked="item.selected"
        />
      </li>
    </ul>
  </Modal>

  <!-- 수증자 정보 입력 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold"
      >수증자 정보 입력하기</h2
    >
    <p class="text-surface-500 mb-4 text-sm"
      >자산을 받으실 분 정보를 입력해 주세요.</p
    >

    <div class="space-y-3">
      <!-- 수증자 카드 리스트 -->
      <div
        v-for="(recipient, index) in recipients"
        :key="index"
        class="border-primary-300 flex h-32 w-full items-center justify-between gap-6 rounded-lg border px-8 py-4"
      >
        <!-- 왼쪽 수증자 정보 -->
        <div class="flex flex-col">
          <div class="text-primary-500 text-lg font-semibold">{{
            recipient.name
          }}</div>

          <div class="text-surface-500 text-sm">
            <p>{{ recipient.relationship }}</p>
            <p>{{ recipient.birth }}</p>
            <p>{{ recipient.maritalStatus }} | {{ recipient.incomeStatus }}</p>
          </div>
        </div>

        <!-- 수정/삭제 버튼 그룹 -->
        <div class="flex gap-2">
          <!-- 수정 버튼 -->
          <button
            @click="editRecipient(index)"
            class="bg-primary-100 text-primary-500 flex h-20 w-15 items-center justify-center rounded-lg text-center text-lg font-semibold"
          >
            수정
          </button>

          <!-- 삭제 버튼 -->
          <button
            @click="confirmDeleteRecipient(index)"
            class="text-primary-500 flex h-20 w-15 items-center justify-center rounded-lg bg-red-100 text-center text-lg font-semibold"
          >
            삭제
          </button>
        </div>
      </div>

      <!-- 추가하기 버튼 -->
      <Btn
        color="surface"
        label="+ 추가하기"
        size="large"
        @click="openRecipientModal"
      />
    </div>

    <!-- 다음 버튼 -->
    <div class="mt-8 flex flex-col gap-3">
      <Btn @click="goToQuiz" color="primary" label="다음으로" size="large" />
    </div>
  </section>
  <Modal
    v-if="isRecipientModalOpen"
    @click1="cancelRecipientModal"
    @click2="handleAddRecipient"
    title="수증자 정보 입력"
    leftLabel="취소"
    rightLabel="완료"
  >
    <div class="space-y-4">
      <!-- 이름 -->
      <div>
        <label class="text-primary-500 text-base font-semibold"
          >이름을 입력하세요</label
        >
        <InputBox
          placeholder="입력하세요"
          size="large"
          type="text"
          v-model="newRecipient.name"
        />
        <p
          v-if="showErrors && !newRecipient.name.trim()"
          class="mt-1 text-xs text-red-500"
        >
          이름을 입력해주세요
        </p>
      </div>

      <!-- 관계 -->
      <div>
        <label class="text-primary-500 text-base font-semibold"
          >증여자와의 관계를 입력하세요</label
        >
        <select
          v-model="newRecipient.relationship"
          class="border-surface-300 h-12 w-full rounded-lg border px-4 text-base"
        >
          <option disabled value="">선택하세요</option>
          <option>자녀</option>
          <option>배우자</option>
          <option>손자녀</option>
          <option>형제자매</option>
          <option>기타</option>
        </select>
        <p
          v-if="showErrors && !newRecipient.relationship"
          class="mt-1 text-xs text-red-500"
        >
          관계를 선택해주세요
        </p>
      </div>

      <!-- 생년월일 -->
      <div>
        <label class="text-primary-500 text-base font-semibold"
          >생년월일을 입력하세요</label
        >
        <input
          type="date"
          v-model="newRecipient.birth"
          class="border-surface-300 h-12 w-full rounded-lg border px-4 text-base"
        />
        <p
          v-if="showErrors && !newRecipient.birth"
          class="mt-1 text-xs text-red-500"
        >
          생년월일을 입력해주세요
        </p>
      </div>

      <!-- 결혼 여부 -->
      <div>
        <label class="text-primary-500 text-base font-semibold"
          >수증자의 결혼 여부를 알려주세요</label
        >
        <select
          v-model="newRecipient.maritalStatus"
          class="border-surface-300 h-12 w-full rounded-lg border px-4 text-base"
        >
          <option disabled value="">선택하세요</option>
          <option>미혼</option>
          <option>결혼</option>
          <option>기타</option>
        </select>
        <p
          v-if="showErrors && !newRecipient.maritalStatus"
          class="mt-1 text-xs text-red-500"
        >
          결혼 여부를 선택해주세요
        </p>
      </div>

      <!-- 소득 여부 -->
      <div>
        <label class="text-primary-500 text-base font-semibold"
          >수증자의 소득 유무를 알려주세요</label
        >
        <p class="text-primary-500 text-xs"
          >총급여 100만 원 초과 시 ‘소득 있음’을 선택하세요.</p
        >

        <select
          v-model="newRecipient.incomeStatus"
          class="border-surface-300 h-12 w-full rounded-lg border px-4 text-base"
        >
          <option disabled value="">선택하세요</option>
          <option>소득 있음</option>
          <option>소득 없음</option>
          <option>소득 모름</option>
        </select>
        <p
          v-if="showErrors && !newRecipient.incomeStatus"
          class="mt-1 text-xs text-red-500"
        >
          소득 여부를 선택해주세요
        </p>
      </div>
    </div>
  </Modal>

  <!-- 삭제 확인 모달 -->
  <Modal
    v-if="isDeleteModalOpen"
    @click1="cancelDelete"
    @click2="confirmDelete"
    title="수증자 삭제"
    leftLabel="취소"
    rightLabel="삭제"
  >
    <div class="py-4 text-center">
      <p class="text-surface-500 text-base">
        <span class="text-primary-500 font-semibold">{{
          recipientToDelete?.name
        }}</span>
        수증자를 삭제하시겠습니까?
      </p>
      <p class="text-surface-400 mt-2 text-sm">
        삭제된 수증자 정보는 복구할 수 없습니다.
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';
import { ref, computed } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';

// 1. 자산 카테고리 선택하기
// 전체 자산 데이터
const allAssets = ref<
  Record<string, { name: string; amount: string; selected: boolean }[]>
>({
  부동산: [
    { name: '부동산 이름1', amount: '10억 5천만', selected: true },
    { name: '부동산 이름2', amount: '6억 8천만', selected: false },
    { name: '부동산 이름3', amount: '2억', selected: false },
  ],
  예ㆍ적금: [
    { name: '예ㆍ적금1', amount: '5천만', selected: true },
    { name: '예ㆍ적금2', amount: '3천만', selected: true },
  ],
  현금: [
    { name: '현금 자산1', amount: '1억', selected: true },
    { name: '현금 자산2', amount: '3천만', selected: true },
  ],
  주식ㆍ펀드: [
    { name: '삼성전자 주식', amount: '2천만', selected: false },
    { name: '펀드 상품1', amount: '1천만', selected: true },
  ],
  사업체ㆍ지분: [],
  기타: [
    { name: '기타 자산1', amount: '5백만', selected: false },
    { name: '기타 자산2', amount: '1백만', selected: false },
  ],
});

const assetList = ref<any[]>([]); // 모달에서 보여줄 자산 목록

// 모달
const selectedCategory = ref<string | null>(null);
const isModalOpen = ref(false);

// 모달 열기

const openModal = (category: string) => {
  selectedCategory.value = category;
  isModalOpen.value = true;

  assetList.value =
    allAssets.value[category]?.map((item: any) => ({ ...item })) || [];
};

const closeModal = () => {
  if (selectedCategory.value) {
    allAssets.value[selectedCategory.value] = assetList.value.map((item) => ({
      ...item,
    }));
  }
  isModalOpen.value = false;
};

// 2. 수증자 정보 입력하기
// 수증자 데이터
const recipients = ref([
  {
    name: '홍길동',
    relationship: '자녀',
    birth: '2001-04-18',
    maritalStatus: '미혼',
    incomeStatus: '소득 있음',
  },
  {
    name: '최두식',
    relationship: '배우자',
    birth: '2001-04-18',
    maritalStatus: '결혼',
    incomeStatus: '소득 모름',
  },
]);
// 수증자 추가하기 모달
const isRecipientModalOpen = ref(false);

// 새 수증자 입력용 변수
const newRecipient = ref({
  name: '',
  relationship: '',
  birth: '',
  maritalStatus: '',
  incomeStatus: '',
});

// 모달 열기
const openRecipientModal = () => {
  // 초기화
  newRecipient.value = {
    name: '',
    relationship: '',
    birth: '',
    maritalStatus: '',
    incomeStatus: '',
  };
  isRecipientModalOpen.value = true;
};

// 수증자 수정하기
const isEditing = ref(false);
const selectedRecipientIndex = ref<number | null>(null);

// 수증자 수정 모달 열기
const editRecipient = (index: number) => {
  const recipient = recipients.value[index];
  newRecipient.value = { ...recipient };
  isEditing.value = true;
  selectedRecipientIndex.value = index;
  isRecipientModalOpen.value = true;
};

// 수증자 삭제하기
const isDeleteModalOpen = ref(false);
const recipientToDelete = ref<any>(null);
const deleteIndex = ref<number | null>(null);

const confirmDeleteRecipient = (index: number) => {
  recipientToDelete.value = recipients.value[index];
  deleteIndex.value = index;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (deleteIndex.value !== null) {
    recipients.value.splice(deleteIndex.value, 1);
  }
  isDeleteModalOpen.value = false;
  recipientToDelete.value = null;
  deleteIndex.value = null;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  recipientToDelete.value = null;
  deleteIndex.value = null;
};

// 완료 버튼 클릭 핸들러
const handleAddRecipient = () => {
  if (!isFormValid.value) {
    showErrors.value = true;
    return;
  }
  addRecipient();
};

// 완료 버튼 클릭 - 추가 또는 수정
const addRecipient = () => {
  if (isEditing.value && selectedRecipientIndex.value !== null) {
    recipients.value[selectedRecipientIndex.value] = { ...newRecipient.value };
  } else {
    recipients.value.push({ ...newRecipient.value });
  }

  isRecipientModalOpen.value = false;
  isEditing.value = false;
  selectedRecipientIndex.value = null;
  showErrors.value = false; // 에러 표시 초기화
};

// 에러 표시 여부
const showErrors = ref(false);

// 취소
const cancelRecipientModal = () => {
  isRecipientModalOpen.value = false;
  isEditing.value = false;
  selectedRecipientIndex.value = null;
  showErrors.value = false; // 에러 표시 초기화
};

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    newRecipient.value.name.trim() !== '' &&
    newRecipient.value.relationship !== '' &&
    newRecipient.value.birth !== '' &&
    newRecipient.value.maritalStatus !== '' &&
    newRecipient.value.incomeStatus !== ''
  );
});

const router = useRouter();

const goToQuiz = () => {
  router.push({ name: 'gift-quiz' }); // 증여 계획 계산 페이지로 이동
};
</script>

<style scoped></style>
