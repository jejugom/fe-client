import api from '@/api';

// 질문 응답 타입 (백엔드 QuestionResponseDto와 일치)
export interface QuestionResponse {
  status: string;
  message: string;
  processedText?: string;
  aiResponse?: string;
}

export const questionApi = {
  /**
   * 질문 처리 API 호출
   * @param audioFile 음성 파일 (선택사항)
   * @param text 텍스트 질문 (선택사항)
   * @returns Promise<QuestionResponse>
   */
  async askQuestion(audioFile?: File, text?: string): Promise<QuestionResponse> {
    const formData = new FormData();
    
    if (audioFile) {
      formData.append('audio', audioFile);
    }
    
    if (text && text.trim()) {
      formData.append('text', text.trim());
    }
    
    console.log('API 요청 데이터:', {
      hasAudio: !!audioFile,
      audioName: audioFile?.name,
      audioSize: audioFile?.size,
      text: text || '없음'
    });
    
    try {
      const response = await api.post('/api/question/ask', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('API 응답 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API 요청 실패:', error);
      
      // 백엔드에서 에러 응답을 보낸 경우
      if (error.response?.data) {
        console.error('백엔드 에러 응답:', error.response.data);
        return error.response.data;
      }
      
      // 네트워크 에러 등 기타 에러
      return {
        status: 'ERROR',
        message: '서버와의 통신 중 오류가 발생했습니다.',
      };
    }
  },
  
  /**
   * 텍스트 전용 질문 처리
   * @param text 텍스트 질문
   * @returns Promise<QuestionResponse>
   */
  async askTextOnly(text: string): Promise<QuestionResponse> {
    console.log('텍스트 전용 API 요청:', text);
    
    try {
      const response = await api.post('/api/question/text', { text });
      
      console.log('텍스트 API 응답 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('텍스트 API 요청 실패:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        status: 'ERROR',
        message: '서버와의 통신 중 오류가 발생했습니다.',
      };
    }
  },
  
  /**
   * 음성 전용 질문 처리
   * @param audioFile 음성 파일
   * @returns Promise<QuestionResponse>
   */
  async askVoiceOnly(audioFile: File): Promise<QuestionResponse> {
    console.log('음성 전용 API 요청:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });
    
    try {
      // FormData로 파일 전송
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      const response = await api.post('/api/question/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('음성 API 응답 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('음성 API 요청 실패:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        status: 'ERROR',
        message: '서버와의 통신 중 오류가 발생했습니다.',
      };
    }
  },
};