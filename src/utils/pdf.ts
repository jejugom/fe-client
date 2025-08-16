import { nextTick } from 'vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLoadingStore } from '@/stores/loading';

interface PdfOptions {
  element: HTMLElement;
  fileName: string;
  shareTitle: string;
  shareText: string;
}

export async function generateAndSharePdf({
  element,
  fileName,
  shareTitle,
  shareText,
}: PdfOptions): Promise<{ success: boolean; message: string }> {
  const loadingStore = useLoadingStore();
  loadingStore.startLoading();

  try {
    await nextTick();
    await document.fonts.ready;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height], // A4 size in pixels
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    // 워터마크 삽입
    pdf.setTextColor(200);
    pdf.setFontSize(20);
    pdf.text('NoHudorak', canvas.width / 2, canvas.height / 2, {
      align: 'center',
      angle: 45,
    });

    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        files: [file],
      });
      return { success: true, message: '결과가 성공적으로 공유되었습니다.' };
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      const message = isMobile
        ? '공유 기능을 사용할 수 없어 PDF를 다운로드합니다.'
        : '결과 PDF가 다운로드되었습니다.';
      return { success: true, message };
    }
  } catch (error) {
    console.error('PDF 생성/공유 실패:', error);
    return { success: false, message: '결과를 공유하거나 저장하는 데 실패했습니다.' };
  } finally {
    loadingStore.stopLoading();
  }
}
