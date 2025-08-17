// 타입 정의 (FaqListDto 기준)
export interface Faq {
  faqId: number;
  category: '상속' | '증여';
  title: string;
  content: string;
}
