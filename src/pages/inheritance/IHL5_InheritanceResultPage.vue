<template>
  <div>
    <h1 class="text-primary-500 mb-2 text-2xl font-bold">유언장</h1>
    <p class="mb-8 text-base leading-relaxed">
      작성하신 내용을 바탕으로 유언장 템플릿이 완성되었습니다.
      <br />
      아래 유언장은 참고용이며, 법적 효력을 갖기 위해서는 정식 절차에 따라
      작성해야 합니다.
    </p>

    <div ref="pdfRef" class="mb-4">
      <InheritanceSimulationResult
        :testator="testator"
        :distributedAssets="distributedAssets"
        v-model:additionalWillContent="localWillContent"
        :formattedDate="formattedDate"
      />
    </div>

    <div class="flex flex-col">
      <Btn
        class="mb-4"
        color="secondary"
        :label="isMobile ? '결과 공유하기 (PDF)' : '결과 PDF 다운로드'"
        size="large"
        @click="handleShareOrDownload"
      />

      <div class="mt-4 flex flex-col">
        <p class="text-primary-500 mb-2 text-center font-semibold">
          정식 유언장 작성 또는 상속 절차 상담을 받고 싶으시다면,<br />
          은행에 방문하셔서 꼭 전문가와 상담해보세요.
        </p>

        <Btn
          class="mb-4"
          color="primary"
          label="은행 방문 예약하기"
          size="large"
          @click="goToRegister"
        />
      </div>

      <Btn
        color="primary"
        label="증여설계 메인으로 돌아가기"
        size="large"
        @click="goToMain"
      />
    </div>
  </div>
  <Alert v-if="showAlert" @click="showAlert = false">
    <p>{{ alertMessage }}</p>
  </Alert>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  type ComputedRef,
} from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import Alert from '@/components/modals/Alert.vue';
import { useInheritanceStore } from '@/stores/inheritance';
import { fetchWillTestator } from '@/api/gift/simulation';
import type { TestatorInfo } from '@/types/gift/simulation';
import InheritanceSimulationResult from './_components/InheritanceSimulationResult.vue';
import { generateAndSharePdf } from '@/utils/pdf';
import type { DistributedAsset } from '@/types/gift/inheritance';

const router = useRouter();
const inheritanceStore = useInheritanceStore();

const testator = ref<TestatorInfo>({ email: '', name: '', birth: '' });
const localWillContent = ref(inheritanceStore.additionalWillContent);

const distributedAssets: ComputedRef<DistributedAsset[]> = computed(
  () => inheritanceStore.distributedAssets
);

watch(localWillContent, (newContent) => {
  inheritanceStore.setAdditionalWillContent(newContent);
});

const formattedDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
});

function goToRegister() {
  router.push({
    name: 'register',
    params: { id: 'inheritance' },
  });
}
function goToMain() {
  router.push({ name: 'gift' });
}

const isMobile = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');

function checkDeviceType() {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
}

const pdfRef = ref<HTMLElement | null>(null);

// 결과 공유 또는 다운로드 핸들러
async function handleShareOrDownload() {
  if (!pdfRef.value) return;

  const result = await generateAndSharePdf({
    element: pdfRef.value,
    fileName: '유언장_결과.pdf',
    shareTitle: '유언장 결과',
    shareText: '유언장 결과를 PDF로 확인해보세요.',
  });

  if (!result.success || result.message) {
    alertMessage.value = result.message;
    showAlert.value = true;
  }
};

onMounted(async () => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
  try {
    const data = await fetchWillTestator();
    testator.value = data;
  } catch (error) {
    console.error('유언자 정보 로드 실패:', error);
  }
});
</script>
