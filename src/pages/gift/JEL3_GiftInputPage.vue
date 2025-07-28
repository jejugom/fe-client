<template>
  <!-- 자산 차트 영역 -->
  <section class="mb-8">
    <!-- 자산현황 파이차트 컴포넌트-->
    <AssetSummaryCardPie
      :userName="retirement.user_info.user_name"
      :assetAmount="retirement.user_info.asset_info.total"
      :assetInfo="retirement.user_info.asset_info"
    />
  </section>

  <!-- 자산 카테고리 선택 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold">
      증여 자산 종류 선택하기
    </h2>
    <p class="mb-8 text-sm">
      어떤 자산을 누구에게 줄지<br />
      먼저 나눌 자산 종류부터 골라주세요.
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

  <AssetSelectionModal
    v-if="isModalOpen"
    :asset-list="assetList"
    @close="closeModal"
    @confirm="closeModal"
  />

  <!-- 수증자 정보 입력 -->
  <section>
    <h2 class="text-primary-300 mb-2 text-2xl font-bold"
      >자산을 받으실 분 정보를 입력하기</h2
    >
    <p class="mb-4 text-sm"
      >누구에게 주실지 알려주세요.<br />받으실 분의 정보가 필요해요.</p
    >

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
        label="+ 자산 받을 사람 추가하기"
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
import CategoryCard from './_components/CategoryCard.vue';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';
import AssetSelectionModal from './_components/AssetSelectionModal.vue';
import RecipientFormModal from './_components/RecipientFormModal.vue';
import DeleteConfirmModal from './_components/DeleteConfirmModal.vue';
import { retirement } from '../nohoo/_dummy';
import { dummyAssets, dummyRecipients, emptyRecipient } from './_inputDummy';
import AssetSummaryCardPie from '@/components/cards/AssetSummaryCardPie.vue';

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
  incomeStatus: string;
}

const router = useRouter();

// 자산 관리
const allAssets = ref<Record<string, Asset[]>>(
  JSON.parse(JSON.stringify(dummyAssets))
);
const assetList = ref<Asset[]>([]);
const selectedCategory = ref<string | null>(null);

// 모달 상태 관리
const isModalOpen = ref(false);
const isRecipientModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

// 자산 모달 관리
const openModal = (category: string) => {
  selectedCategory.value = category;
  isModalOpen.value = true;
  assetList.value =
    allAssets.value[category]?.map((item) => ({ ...item })) || [];
};

const closeModal = () => {
  if (selectedCategory.value) {
    allAssets.value[selectedCategory.value] = assetList.value.map((item) => ({
      ...item,
    }));
  }
  isModalOpen.value = false;
};

// 수증자 관리
const recipients = ref<Recipient[]>([...dummyRecipients]);
const newRecipient = ref<Recipient>({ ...emptyRecipient });
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
