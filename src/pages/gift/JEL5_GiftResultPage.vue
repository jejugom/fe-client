<template>
  <div>
    <h2 class="text-primary-300 mb-8 text-2xl font-bold"
      >증여 시뮬레이션 결과</h2
    >

    <div ref="pdfRef" class="mb-4">
      <GiftSimulationResult />
      <!-- <GiftSimulationResult /> -->
    </div>

    <div class="flex flex-col gap-3">
      <Btn
        color="secondary"
        label="결과 공유하기"
        size="large"
        @click="shareResult"
      />
    </div>

    <div
      class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
    >
      <p class="text-primary-300 mb-3 text-center text-base font-semibold">
        더 자세한 설명이 필요하시면<br />
        은행에서 친절하게 도와드립니다.
      </p>
    </div>

    <Btn
      color="primary"
      label="내점 예약하기"
      size="large"
      @click="goToRegister"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'gift' },
  });
};
import GiftSimulationResult from './_components/GiftSimulationResult.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pdfRef = ref<HTMLElement | null>(null);

const shareResult = async () => {
  if (!pdfRef.value) return;

  try {
    // 화면을 이미지로 캡쳐 (html2canvas 사용)
    const canvas = await html2canvas(pdfRef.value, {
      scale: 2,
      useCORS: true,
    });

    // pdf 생성 (jsPDF 사용)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pxPerMm = 5.3;

    const originalWidthMm = canvas.width / pxPerMm;
    const originalHeightMm = canvas.height / pxPerMm;
    const margin = 10;
    const maxWidthMm = pageWidth - margin;
    const maxHeightMm = pageHeight - margin;

    const scale = Math.min(
      maxWidthMm / originalWidthMm,
      maxHeightMm / originalHeightMm
    );
    const finalWidthMm = originalWidthMm * scale;
    const finalHeightMm = originalHeightMm * scale;
    const startX = (pageWidth - finalWidthMm) / 2;
    const startY = (pageHeight - finalHeightMm) / 2;

    // 페이지에 이미지 삽입 함수
    const addPageImage = (image: string, y: number) => {
      pdf.addImage(image, 'PNG', startX, y, finalWidthMm, finalHeightMm);
    };

    // canvas를 PNG 이미지로 변환
    const imgData = canvas.toDataURL('image/png');

    // 이미지 크기가 페이지 크기보다 작으면 한 페이지에 삽입
    if (finalHeightMm <= maxHeightMm) {
      pdf.setFontSize(10);
      addPageImage(imgData, startY);

      // 여러 페이지로 나눠야할 경우
    } else {
      let currentY = 0;
      let pageIndex = 0;
      const totalHeightPx = canvas.height;
      const sliceHeightPx = (maxHeightMm / finalHeightMm) * canvas.height;

      while (currentY < totalHeightPx) {
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        if (!pageCtx) throw new Error('Canvas context 생성 실패');

        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;

        pageCtx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx
        );

        const pageImgData = pageCanvas.toDataURL('image/png');
        if (pageIndex > 0) pdf.addPage();
        pdf.setFontSize(10);
        addPageImage(pageImgData, startY);

        currentY += sliceHeightPx;
        pageIndex++;
      }
    }

    // PDF Blob으로 변환하고 공유
    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], 'gift-simulation.pdf', {
      type: 'application/pdf',
    });

    // web share API를 사용하여 공유
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: '증여 시뮬레이션 결과',
        text: '시뮬레이션 결과 PDF를 확인해보세요.',
        files: [file],
      });
    } else {
      alert('이 브라우저에서는 공유 기능을 사용할 수 없습니다.');
    }
  } catch (error) {
    console.error('공유 실패:', error);
    alert('공유에 실패했습니다.');
  }
};
</script>
