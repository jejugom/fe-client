// 질문 응답 타입 (백엔드 QuestionResponseDto와 일치)
export interface QuestionResponse {
  status: string;
  message: string;
  processedText?: string;
  aiResponse?: string;
}
