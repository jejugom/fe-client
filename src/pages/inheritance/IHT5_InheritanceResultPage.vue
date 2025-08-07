<template>
  <div>
    <h1 class="text-primary-300 mb-3 text-2xl font-bold">유언장</h1>
    <p class="mb-8 text-sm">
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
        color="secondary"
        :label="isMobile ? '결과 공유하기 (PDF)' : '결과 PDF 다운로드'"
        size="large"
        @click="handleShareOrDownload"
      />
      <div class="mt-16 flex flex-col">
        <p class="text-primary-300 mb-2 text-center font-semibold">
          정식 유언장 작성 또는 상속 절차 상담을 받고 싶으시다면,<br />
          은행에 방문하셔서 꼭 전문가와 상담해보세요.
        </p>

        <Btn
          color="primary"
          label="은행 방문 예약하기"
          size="large"
          @click="goToRegister"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch, type ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import { useInheritanceStore } from '@/stores/inheritance';
import { fetchWillTestator } from '@/api/gift/simulation';
import type { TestatorInfo } from '@/types/gift/simulation';
import InheritanceSimulationResult from './_components/InheritanceSimulationResult.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { DistributedAsset } from '@/types/gift/inheritance';

const router = useRouter();
const inheritanceStore = useInheritanceStore();

const testator = ref<TestatorInfo>({ email: '', name: '', birth: '' });
const localWillContent = ref(inheritanceStore.additionalWillContent);

const distributedAssets: ComputedRef<DistributedAsset[]> = computed(() => inheritanceStore.distributedAssets);

watch(localWillContent, (newContent) => {
  inheritanceStore.setAdditionalWillContent(newContent);
});

const formattedDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
});

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'inheritance' },
  });
};

const isMobile = ref(false);

const checkDeviceType = () => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
};

const pdfRef = ref<HTMLElement | null>(null);

const shareResult = async () => {
  if (!pdfRef.value) return;

  await nextTick();
  await document.fonts.ready;

  try {
    const canvas = await html2canvas(pdfRef.value, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    pdf.setTextColor(200);
    pdf.setFontSize(20);
    pdf.text('NoHudorak', canvas.width / 2, canvas.height / 2, {
      align: 'center',
      angle: 45,
    });

    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], '유언장_결과.pdf', {
      type: 'application/pdf',
    });

    if (isMobile.value && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: '유언장 결과',
        text: '유언장 결과를 PDF로 확인해보세요.',
        files: [file],
      });
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = '유언장_결과.pdf';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      alert(
        isMobile.value
          ? '공유 기능을 사용할 수 없어 PDF를 다운로드합니다.'
          : '결과 PDF가 다운로드되었습니다.'
      );
    }
  } catch (error) {
    console.error('PDF 생성/공유 실패:', error);
    alert('결과를 공유하거나 저장하는 데 실패했습니다.');
  }
};

const handleShareOrDownload = () => {
  shareResult();
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
