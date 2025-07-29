export interface FaqDetail {
  category: string;
  title: string;
  content: string;
  date: string; // 추가된 필드: FAQ 작성 날짜
}

export const api_data: FaqDetail[] = [
  {
    category: '증여',
    title: '손주들에게 돈을 줘도 세금이 나오나요?',
    content: '네, 손주들에게 돈을 줘도 세금이 ~~~...',
    // FAQ에 date 넣은 이유?
    date: '2025-07-17',
  },
];
