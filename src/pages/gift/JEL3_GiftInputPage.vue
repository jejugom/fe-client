<template>
  <section class="mb-16">
    <AssetSummaryCardBar
      v-if="transformedAssetSummary.length > 0"
      :userName="userName"
      :assetAmount="totalAssetAmount"
      :assetInfo="transformedAssetSummary"
    />
  </section>

  <section>
    <h2 class="text-primary-500 mb-2 text-2xl font-bold">
      {{ pageConfig.recipientTitle }}
    </h2>
    <p class="mb-4 text-base whitespace-pre-line">
      {{ pageConfig.recipientDescription }}
    </p>

    <div class="space-y-3">
      <MultiBtnCard
        v-for="recipient in recipients"
        :key="recipient.recipientId"
        :title="recipient.recipientName"
        :content="recipient.relationship"
        :tags="
          recipient.hasPriorGift
            ? `${formatCurrency(recipient.priorGiftAmount || 0)} 증여`
            : `증여 이력 없음`
        "
        btnText1="수정"
        btnText2="삭제"
        @click:edit="editRecipient(recipient.recipientId)"
        @click:delete="confirmDeleteRecipient(recipient.recipientId)"
      />

      <RecipientFormModal
        v-if="isRecipientModalOpen"
        :recipient="newRecipient"
        :is-editing="isEditing"
        :mode="mode"
        :spouse-exists="spouseExists"
        @cancel="cancelRecipientModal"
        @confirm="handleRecipientConfirm"
      />

      <DeleteConfirmModal
        v-if="isDeleteModalOpen"
        :recipient-name="recipientToDelete?.recipientName || ''"
        :mode="mode"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />

      <Btn
        @click="openRecipientModal"
        color="surface"
        :label="`+ ${pageConfig.addButtonLabel}`"
        size="large"
      />
    </div>

    <div class="mt-16 flex flex-col">
      <p
        class="text-primary-500 mb-2 text-center font-semibold whitespace-pre-line"
      >
        {{ pageConfig.nextStepMessage }}
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
import { ref, computed, withDefaults, watch } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';
import RecipientFormModal from './_components/RecipientFormModal.vue';
import DeleteConfirmModal from './_components/DeleteConfirmModal.vue';
import AssetSummaryCardBar from '@/components/cards/AssetSummaryCardBar.vue';
import { formatCurrency } from '@/utils/format';
import { useLoadingStore } from '@/stores/loading';

// 공통 API 함수들
import {
  fetchGiftPageData,
  createRecipient,
  updateRecipient,
  deleteRecipient,
} from '@/api/gift/recipient';

import type {
  RecipientRequestDto,
  RecipientResponseDto,
  GiftPageResponseDto,
} from '@/types/gift/recipient';

import { useGiftStore } from '@/stores/gift';
import { useInheritanceStore } from '@/stores/inheritance';

// 타입 정의
interface AssetInfoForCard {
  category: string;
  amount: number;
}

interface PageConfig {
  recipientTitle: string;
  recipientDescription: string;
  addButtonLabel: string;
  historyLabel: string;
  nextStepMessage: string;
  quizRouteName: string;
}

const router = useRouter();
const loadingStore = useLoadingStore();

const props = withDefaults(defineProps<{ mode: 'gift' | 'inheritance' }>(), {
  mode: 'gift',
});

const giftStore = useGiftStore();
const inheritanceStore = useInheritanceStore();

const store = computed(() => {
  return props.mode === 'gift' ? giftStore : inheritanceStore;
});

const spouseExists = computed(() => {
  return recipients.value.some((r) => r.relationship === '배우자');
});

// 페이지 설정
const pageConfigs: Record<'gift' | 'inheritance', PageConfig> = {
  gift: {
    recipientTitle: '수증자 정보 입력하기',
    recipientDescription: `누구에게 자산을 나눠주고 싶은지 알려주세요.\n받으실 분의 정보를 통해 정확한 세금 계산을 도와드릴게요.`, // Corrected newline escape
    addButtonLabel: '수증자 추가하기',
    historyLabel: '증여',
    nextStepMessage:
      '간단한 클릭을 통해\n어떤 자산을 누구에게 증여할지 알려주세요.', // Corrected newline escape
    quizRouteName: 'gift-quiz',
  },
  inheritance: {
    recipientTitle: '수증자 정보 입력하기',
    recipientDescription: `누구에게 자산을 남길지 알려주세요.\n입력한 정보는 유언장 템플릿 작성에 활용돼요.`, // Corrected newline escape
    addButtonLabel: '수증자 추가하기',
    historyLabel: '상속',
    nextStepMessage:
      '간단한 클릭을 통해\n어떤 자산을 누구에게 상속할지 알려주세요.', // Corrected newline escape
    quizRouteName: 'inheritance-quiz',
  },
};

const pageConfig = computed(() => {
  return pageConfigs[props.mode] || pageConfigs.gift;
});

// 모달 상태
const isRecipientModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

// 데이터 상태
const recipients = ref<RecipientResponseDto[]>([]);
const assetCategories = ref<any[]>([]);
const userName = ref<string>('사용자');

// 총 자산 금액 계산
const totalAssetAmount = computed(() => {
  return assetCategories.value.reduce(
    (sum, category) => sum + (category?.totalAmount || 0),
    0
  );
});

// 자산 카테고리 매핑
const categoryMap: { [key: string]: string } = {
  '1': '부동산',
  '2': '예/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타',
};

// 카테고리별 자산 합계 계산
const transformedAssetSummary = computed<AssetInfoForCard[]>(() => {
  if (!assetCategories.value || assetCategories.value.length === 0) {
    return [];
  }

  return assetCategories.value.map((category) => ({
    category: categoryMap[category.assetCategoryCode] || '기타',
    amount: Number(category.totalAmount),
  }));
});

// 수증자/상속인 초기값
const emptyRecipient: RecipientRequestDto = {
  relationship: '',
  recipientName: '',
  birthDate: '',
  isMarried: false,
  hasPriorGift: false,
  priorGiftAmount: 0,
  giftTaxPayer: '',
};

const newRecipient = ref<RecipientRequestDto>({ ...emptyRecipient });
const isEditing = ref(false);
const selectedRecipientId = ref<number | null>(null);

// 페이지 데이터 로드
const loadPageData = async () => {
  loadingStore.startLoading();
  try {
    const data: GiftPageResponseDto = await fetchGiftPageData(props.mode);
    recipients.value = data.recipients || [];
    assetCategories.value = data.assetCategories || [];
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  } finally {
    loadingStore.stopLoading();
  }
};

// mode가 변경될 때마다 데이터를 다시 로드
watch(
  () => props.mode,
  async (newMode, oldMode) => {
    if (newMode !== oldMode) {
      await loadPageData();
    }
  },
  { immediate: true } // 컴포넌트가 처음 로드될 때도 실행
);

// 수증자/상속인 추가 모달 열기
const openRecipientModal = () => {
  newRecipient.value = { ...emptyRecipient };
  isEditing.value = false;
  isRecipientModalOpen.value = true;
};

// 모달 닫기
const cancelRecipientModal = () => {
  isRecipientModalOpen.value = false;
  isEditing.value = false;
  selectedRecipientId.value = null;
};

// 수증자/상속인 저장/수정
const handleRecipientConfirm = async (recipientData: RecipientRequestDto) => {
  loadingStore.startLoading();
  try {
    if (isEditing.value && selectedRecipientId.value !== null) {
      await updateRecipient(
        selectedRecipientId.value,
        recipientData,
        props.mode
      );
    } else {
      await createRecipient(recipientData, props.mode);
    }
    await loadPageData();
    cancelRecipientModal();
  } catch (error) {
    console.error('수증자/상속인 저장/수정 실패:', error);
  } finally {
    loadingStore.stopLoading();
  }
};

// 수증자/상속인 수정 모달 열기
const editRecipient = (id: number) => {
  const recipient = recipients.value.find((r) => r.recipientId === id);
  if (recipient) {
    newRecipient.value = {
      relationship: recipient.relationship,
      recipientName: recipient.recipientName,
      birthDate: recipient.birthDate,
      isMarried: recipient.isMarried,
      hasPriorGift: recipient.hasPriorGift,
      priorGiftAmount: recipient.priorGiftAmount,
      giftTaxPayer: recipient.giftTaxPayer,
    };
    isEditing.value = true;
    selectedRecipientId.value = id;
    isRecipientModalOpen.value = true;
  }
};

// 삭제 확인 모달
const recipientToDelete = ref<RecipientResponseDto | null>(null);

const confirmDeleteRecipient = (id: number) => {
  const recipient = recipients.value.find((r) => r.recipientId === id);
  if (recipient) {
    recipientToDelete.value = recipient;
    selectedRecipientId.value = id;
    isDeleteModalOpen.value = true;
  }
};

// 삭제
const confirmDelete = async () => {
  if (selectedRecipientId.value !== null) {
    loadingStore.startLoading();
    try {
      await deleteRecipient(selectedRecipientId.value, props.mode);
      await loadPageData();
      cancelDelete();
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      loadingStore.stopLoading();
    }
  }
};

// 삭제 모달 닫기
const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  recipientToDelete.value = null;
  selectedRecipientId.value = null;
};

// 다음 단계로 이동
const goToQuiz = () => {
  // 스토어의 데이터를 초기화하여 JEL4에서 항상 새로운 데이터를 불러오도록 함
  if (props.mode === 'gift') {
    (giftStore as ReturnType<typeof useGiftStore>).setInitialData({
      allAssets: new Map(),
      beneficiaries: [],
    });
  } else {
    (inheritanceStore as ReturnType<typeof useInheritanceStore>).setInitialData(
      {
        allAssets: new Map(),
        beneficiaries: [],
      }
    );
  }
  router.push({ name: pageConfig.value.quizRouteName });
};
</script>
