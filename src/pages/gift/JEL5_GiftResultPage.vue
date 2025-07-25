<template>
  <div>
    <h2 class="text-primary-300 mb-8 text-2xl font-bold"
      >증여 시뮬레이션 결과</h2
    >

    <div ref="pdfRef">
      <GiftSimulationResult />
    </div>
    <div class="flex flex-col gap-3">
      <Btn
        color="secondary"
        label="결과 공유하기"
        size="large"
        @click="shareResult"
      />

      <div
        class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
      >
        <p class="text-primary-300 mb-3 text-center text-base font-semibold">
          더 자세한 설명이 필요하시면<br />
          은행에서 친절하게 도와드립니다.
        </p>

        <Btn color="primary" label="내점 예약하기" size="large" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
import GiftSimulationResult from './_components/GiftSimulationResult.vue'; // Updated path
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ref } from 'vue';

const pdfRef = ref<HTMLElement | null>(null);

// OKLCH to RGB 변환 맵핑

// CSS 클래스를 RGB 스타일로 변환하는 함수
const convertOklchToRgb = (element: HTMLElement) => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  const elements: HTMLElement[] = [element];
  let node;
  while ((node = walker.nextNode())) {
    elements.push(node as HTMLElement);
  }

  elements.forEach((el) => {
    const classList = Array.from(el.classList);

    classList.forEach((className) => {
      // 텍스트 색상 변환
      if (className.startsWith('text-primary-')) {
        if (className === 'text-primary-300') {
          el.style.color = 'rgb(147, 197, 253)';
        } else if (className === 'text-primary-600') {
          el.style.color = 'rgb(37, 99, 235)';
        }
      }

      // 배경색 변환
      if (className.startsWith('bg-')) {
        if (className === 'bg-gray-100') {
          el.style.backgroundColor = 'rgb(243, 244, 246)';
        } else if (className === 'bg-white') {
          el.style.backgroundColor = 'rgb(255, 255, 255)';
        }
      }

      // 테두리 색상 변환
      if (className.startsWith('border-')) {
        if (className === 'border-gray-300') {
          el.style.borderColor = 'rgb(209, 213, 219)';
        }
      }
    });

    // 기본 색상들도 강제 적용
    if (el.style.color === '') {
      el.style.color = 'rgb(31, 41, 55)'; // text-gray-800
    }
  });
};

const shareResult = async () => {
  if (!pdfRef.value) return;

  try {
    const original = pdfRef.value;

    // 원본 요소 복제
    const cloned = original.cloneNode(true) as HTMLElement;

    // 기본 스타일 설정
    cloned.style.width = '800px';
    cloned.style.fontSize = '12px';
    cloned.style.backgroundColor = 'rgb(255, 255, 255)';
    cloned.style.color = 'rgb(31, 41, 55)';

    // OKLCH 색상을 RGB로 변환
    convertOklchToRgb(cloned);

    // 임시 wrapper 생성
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    wrapper.style.background = 'rgb(255, 255, 255)';
    wrapper.style.color = 'rgb(31, 41, 55)';
    wrapper.style.width = '800px';
    wrapper.appendChild(cloned);
    document.body.appendChild(wrapper);

    // html2canvas로 캡처
    const canvas = await html2canvas(cloned, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // wrapper 제거
    document.body.removeChild(wrapper);

    // PDF 생성
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // 공유 또는 다운로드
    const blob = pdf.output('blob');
    const file = new File([blob], 'simulation-result.pdf', {
      type: 'application/pdf',
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: '증여 시뮬레이션 결과',
        text: '시뮬레이션 결과 PDF를 확인해보세요.',
      });
    } else {
      pdf.save('simulation-result.pdf');
    }
  } catch (err) {
    console.error('PDF 생성/공유 오류:', err);
    alert('공유 중 문제가 발생했습니다.');
  }
};
</script>
