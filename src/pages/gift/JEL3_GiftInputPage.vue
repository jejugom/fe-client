<template>
  <!-- 자산 차트 영역 -->
  <section class="mb-8">
    <!-- 자산현황 파이차트 컴포넌트 -->
    <AssetSummaryCardBar
      :userName="api_data.user_info.user_name"
      :assetAmount="api_data.user_info.asset_info.total"
      :assetInfo="assetArray"
    />
  </section>

  <!-- 수증자 정보 입력 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold"
      >수증자 정보 입력하기</h2
    >
    <p class="mb-4"
      >누구에게 주실지 알려주세요.<br />받으실 분의 정보를 통해 정확한 세금
      계산을 도와드릴 수 있어요</p
    >

    <div class="space-y-3">
      <!-- 수증자 카드 리스트 -->
      <MultiBtnCard
        v-for="(recipient, index) in recipients"
        :key="index"
        :title="recipient.name"
        :content="`${recipient.relationship} | ${recipient.birth}`"
        :tags="`${recipient.maritalStatus} | ${
          recipient.giftedBefore
            ? formatCurrency(recipient.giftedAmount) + ' 증여'
            : '증여 이력 없음'
        }`"
        btnText1="수정"
        btnText2="삭제"
        @click:edit="editRecipient(index)"
        @click:delete="confirmDeleteRecipient(index)"
      />

      <!-- 수증자 정보 입력 모달 -->
      <RecipientFormModal
        v-if="isRecipientModalOpen"
        :recipient="newRecipient"
        :is-editing="isEditing"
        @cancel="cancelRecipientModal"
        @confirm="handleRecipientConfirm"
      />
      <!-- 삭제 확인 모달 -->
      <DeleteConfirmModal
        v-if="isDeleteModalOpen"
        :recipient-name="recipientToDelete?.name || ''"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />

      <!-- 수증자 추가하기 버튼 -->
      <Btn
        @click="openRecipientModal"
        color="surface"
        label="+ 수증자 추가하기"
        size="large"
      />
    </div>

    <!-- 다음 버튼 -->
    <div class="mt-16 flex flex-col">
      <p class="text-primary-300 mb-2 text-center font-semibold">
        간단한 질문을 통해<br />
        더 나은 절세 방법을 찾아드릴게요.
      </p>
      <Btn
        @click="goToQuiz"
        color="primary"
        label="다음 단계로 이동하기"
        size="large"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';
import RecipientFormModal from './_components/RecipientFormModal.vue';
import DeleteConfirmModal from './_components/DeleteConfirmModal.vue';
import { dummyRecipients, emptyRecipient } from './_inputDummy';
import AssetSummaryCardBar from '@/components/cards/AssetSummaryCardBar.vue';
import { api_data } from '@/api/gift/giftAssets';
import { formatCurrency } from '@/utils/format';

const assetArray = Object.entries(api_data.user_info.asset_info).map(
  ([category, amount]) => ({
    category,
    amount,
  })
);

interface Asset {
  name: string;
  amount: string;
  selected: boolean;
}

interface Recipient {
  name: string;
  relationship: string;
  birth: string;
  maritalStatus: string;
  giftedBefore: boolean;
  giftedAmount: number;
  whoPaysTax: string;
}

const newRecipient = ref<Recipient>({
  name: '',
  relationship: '',
  birth: '',
  maritalStatus: '',
  giftedBefore: false,
  giftedAmount: 0,
  whoPaysTax: '',
});

const router = useRouter();

// 모달 상태 관리
const isModalOpen = ref(false);
const isRecipientModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

// 수증자 관리
const recipients = ref<Recipient[]>([...dummyRecipients]);
// const newRecipient = ref<Recipient>({ ...emptyRecipient });
const isEditing = ref(false);
const selectedRecipientIndex = ref<number | null>(null);

// 수증자 모달 관리
const openRecipientModal = () => {
  newRecipient.value = { ...emptyRecipient };
  isRecipientModalOpen.value = true;
  isEditing.value = false;
  selectedRecipientIndex.value = null;
};

const cancelRecipientModal = () => {
  isRecipientModalOpen.value = false;
  isEditing.value = false;
  selectedRecipientIndex.value = null;
};

const handleRecipientConfirm = (recipientData: Recipient) => {
  if (isEditing.value && selectedRecipientIndex.value !== null) {
    recipients.value[selectedRecipientIndex.value] = { ...recipientData };
  } else {
    recipients.value.push({ ...recipientData });
  }
  cancelRecipientModal();
};

// 수증자 수정
const editRecipient = (index: number) => {
  const recipient = recipients.value[index];
  newRecipient.value = { ...recipient };
  isEditing.value = true;
  selectedRecipientIndex.value = index;
  isRecipientModalOpen.value = true;
};

// 수증자 삭제 관리
const recipientToDelete = ref<Recipient | null>(null);
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
  cancelDelete();
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  recipientToDelete.value = null;
  deleteIndex.value = null;
};

//
const goToQuiz = () => {
  router.push({ name: 'gift-quiz' });
};
</script>
