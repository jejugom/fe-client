<template>
  <!-- 자산 차트 영역 -->
  <section>
    <!-- 승아코멘트: 차트 import해서 시각화 필요(컴포넌트 작성돼있음) -->
    <div class="bg-gradient-cross-1 mb-8 flex h-80 items-center justify-center">
      Chart
    </div>
  </section>

  <!-- 자산 카테고리 선택 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold">
      증여 자산 카테고리 선택하기
    </h2>
    <p class="mb-8 text-sm">
      수증자에게 어떤 자산을 나눠주실지 카테고리를 선택하면<br />
      해당 카테고리의 세부 자산을 선택하실 수 있습니다.
    </p>

    <div class="mb-16 grid grid-cols-3 gap-x-6 gap-y-4">
      <!-- 반복 렌더링 -->
      <CategoryCard
        v-for="(assets, category) in allAssets"
        :key="category"
        :category="category"
        :selectedCount="assets.filter((a) => a.selected).length"
        :totalCount="assets.length"
        @click="openModal(category)"
      />
    </div>
  </section>

  <!-- 승아코멘트: 모달 모두 컴포넌트로 빼서 관리해야 함 -->
  <!-- 승아코멘트: 각 input창 별로 컴포넌트화 필요! src/pages/products/_components/ReserveInputBox.vue 참고-->
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
      <li v-for="(item, index) in assetList" :key="index">
        <CheckBox
          :label="item.name"
          :amount="item.amount"
          v-model="item.selected"
        />
      </li>
    </ul>
  </Modal>

  <!-- 수증자 정보 입력 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold"
      >수증자 정보 입력하기</h2
    >
    <p class="mb-4 text-sm">자산을 받으실 분 정보를 입력해 주세요.</p>

    <div class="space-y-3">
      <!-- 수증자 카드 리스트 -->
      <MultiBtnCard
        v-for="(recipient, index) in recipients"
        :key="index"
        :title="recipient.name"
        :content="`${recipient.relationship} / ${recipient.birth}`"
        :tags="`${recipient.maritalStatus} | ${recipient.incomeStatus}`"
        btnText1="수정"
        btnText2="삭제"
        @click:edit="editRecipient(index)"
        @click:delete="confirmDeleteRecipient(index)"
      />
    </div>

    <!-- 다음 버튼 -->
    <div class="bottom-[calc(5rem+1rem)] mt-8 flex flex-col">
      <Btn @click="goToQuiz" color="primary" label="다음으로" size="large" />
    </div>
  </section>
  <!-- 승아코멘트: 모달컴포넌트화 필요 -->
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
        <label class="text-primary-500 mb-1 text-base font-semibold"
          >이름을 입력하세요</label
        >
        <InputBox
          placeholder="입력하세요"
          size="medium"
          type="text"
          v-model="newRecipient.name"
          class="w-full"
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
        <label class="text-primary-500 mb-1 text-base font-semibold"
          >증여자와의 관계를 입력하세요</label
        >
        <SelectBox
          v-model="newRecipient.relationship"
          size="medium"
          class="w-full"
        >
          <option disabled value="">선택하세요</option>
          <option>자녀</option>
          <option>배우자</option>
          <option>손자녀</option>
          <option>형제자매</option>
          <option>기타</option>
        </SelectBox>
        <p
          v-if="showErrors && !newRecipient.relationship"
          class="mt-1 text-xs text-red-500"
        >
          관계를 선택해주세요
        </p>
      </div>

      <!-- 생년월일 -->
      <div>
        <label class="text-primary-500 mb-1 text-base font-semibold"
          >생년월일을 입력하세요</label
        >
        <InputBox
          size="medium"
          type="date"
          v-model="newRecipient.birth"
          class="w-full"
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

        <SelectBox
          v-model="newRecipient.maritalStatus"
          size="medium"
          class="w-full"
        >
          <option disabled value="">선택하세요</option>
          <option>미혼</option>
          <option>결혼</option>
          <option>기타</option>
        </SelectBox>
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
        <p class="text-primary-500 mb-1"
          >총급여 100만 원 초과 시 ‘소득 있음’을 선택하세요.</p
        >

        <SelectBox
          v-model="newRecipient.incomeStatus"
          size="large"
          class="w-full"
        >
          <option disabled value="">선택하세요</option>
          <option>소득 있음</option>
          <option>소득 없음</option>
          <option>소득 모름</option>
        </SelectBox>
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
  <!-- 승아코멘트: 컴포넌트화 필요 -->
  <Modal
    v-if="isDeleteModalOpen"
    @click1="cancelDelete"
    @click2="confirmDelete"
    title="수증자 삭제"
    leftLabel="취소"
    rightLabel="삭제"
  >
    <div class="py-4 text-center">
      <p class="text-base">
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
import CheckBox from '@/components/forms/CheckBox.vue';
import CategoryCard from './_components/CategoryCard.vue';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';
import SelectBox from '@/components/forms/SelectBox.vue';

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
