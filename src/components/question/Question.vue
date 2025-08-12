<template>
  <div class="question-component card-design flex flex-col justify-between">
    <div
      v-if="currentStep === 'initial' || currentStep === 'methodSelect'"
      class="text-primary-500 mb-3 py-3 text-center text-2xl font-bold"
    >
      {{ stepTitle }}
    </div>

    <!-- 1단계: 초기 버튼 -->
    <div v-if="currentStep === 'initial'" class="text-center">
      <Btn
        label="버튼을 눌러서 물어보기"
        color="primary"
        size="large"
        @click="startQuestion"
      />
    </div>

    <!-- 2단계: 방법 선택 버튼들 -->
    <div v-if="currentStep === 'methodSelect'" class="text-center">
      <BtnSet
        label1="직접 입력"
        label2="음성 입력"
        type="type2"
        :onClick1="selectTextInput"
        :onClick2="selectVoiceInput"
      />
    </div>

    <!-- 3-1단계: 텍스트 입력 -->
    <div v-if="currentStep === 'textInput'" class="text-center">
      <InputBox
        v-model="questionText"
        size="medium"
        placeholder="궁금한 내용을 입력해주세요"
        class="mb-3 h-14 w-full"
      />
      <BtnSet
        label1="취소"
        label2="질문하기"
        type="type2"
        :onClick1="resetToInitial"
        :onClick2="submitTextQuestion"
      />
    </div>

    <!-- 3-2단계: 음성 입력 -->
    <div v-if="currentStep === 'voiceInput'" class="text-center">
      <!-- 녹음 버튼 -->
      <div class="mb-3 flex h-14 items-center justify-center">
        <Btn
          :label="
            isRecording
              ? recordingTime >= 1
                ? '질문이 끝나면 눌러주세요!'
                : '듣고 있어요...'
              : isProcessing
                ? '처리 중...'
                : '버튼을 누르고 물어보세요!'
          "
          :color="isRecording ? 'primary' : 'primary'"
          size="large"
          :class="[
            'transition-all duration-300',
            isRecording && 'animate-pulse bg-red-500 text-white',
            isProcessing && 'cursor-not-allowed opacity-50',
          ]"
          :disabled="isProcessing"
          @click="toggleRecording"
        />
      </div>

      <!-- 취소 버튼 (BtnSet과 같은 크기) -->
      <Btn label="취소" color="surface" size="large" @click="resetToInitial" />
    </div>

    <!-- Alert 모달 -->
    <Alert v-if="showAlert" :title="alertTitle" @click="closeAlert">
      <!-- 에러 메시지인 경우 -->
      <div v-if="!currentResponse" class="text-red-600">
        {{ alertContent }}
      </div>

      <!-- 성공 응답인 경우 -->
      <div v-else class="space-y-4">
        <!-- 질문하신 내용 -->
        <div v-if="currentResponse.processedText" class="space-y-2">
          <h4 class="text-primary-600 text-lg font-semibold"
            >질문하신 내용 :</h4
          >
          <p class="text-surface-500 bg-surface-100 rounded-lg p-3 text-base">
            "{{ currentResponse.processedText }}"
          </p>
        </div>

        <!-- 설명 -->
        <div v-if="currentResponse.aiResponse" class="space-y-2">
          <h4 class="text-primary-600 text-lg font-semibold">설명이에요 :</h4>
          <div
            class="text-surface-500 bg-surface-100 relative rounded-lg p-3 text-base leading-relaxed"
          >
            <!-- 일반 텍스트 -->
            <span>{{ displayedText }}</span>
          </div>
        </div>
      </div>
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';
import Alert from '@/components/modals/Alert.vue';
import Btn from '@/components/buttons/Btn.vue';
import BtnSet from '@/components/buttons/BtnSet.vue';
import { questionApi, type QuestionResponse } from '@/api/question/question';
import { useLoadingStore } from '@/stores/loading';

type QuestionStep = 'initial' | 'methodSelect' | 'textInput' | 'voiceInput';

const loadingStore = useLoadingStore();

// 컴포넌트 상태
const currentStep = ref<QuestionStep>('initial');
const questionText = ref('');
const isRecording = ref(false);
const isProcessing = ref(false);
const recordingTime = ref(0);
const audioBlob = ref<Blob | null>(null);

// Alert 모달 상태
const showAlert = ref(false);
const alertTitle = ref('');
const alertContent = ref('');
const currentResponse = ref<QuestionResponse | null>(null);

// 타이핑 애니메이션 상태
const displayedText = ref('');
const isTyping = ref(false);
let typingTimer: number | null = null;

// 미디어 관련 변수
let mediaRecorder: MediaRecorder | null = null;
let recordingTimer: number | null = null;
let audioChunks: BlobPart[] = [];

// 단계별 제목
const stepTitle = computed(() => {
  switch (currentStep.value) {
    case 'initial':
      return '무엇이든 물어보세요';
    case 'methodSelect':
      return '방법을 선택해주세요';
    case 'textInput':
      return '직접 입력하기';
    case 'voiceInput':
      return '음성으로 말하기';
    default:
      return '무엇이든 물어보세요';
  }
});

// 1단계 → 2단계 → 3단계 흐름
const startQuestion = () => {
  currentStep.value = 'methodSelect';
};

// 텍스트 입력 선택
const selectTextInput = () => {
  currentStep.value = 'textInput';
};

// 음성 입력 선택
const selectVoiceInput = () => {
  currentStep.value = 'voiceInput';
};

// 초기 상태로 리셋
const resetToInitial = () => {
  if (isRecording.value) {
    stopRecording();
  }
  currentStep.value = 'initial';
  questionText.value = '';
  audioBlob.value = null;
  isProcessing.value = false;
};

// 음성 녹음 토글
const toggleRecording = async () => {
  if (!isRecording.value) {
    await startRecording();
  } else {
    stopRecording();
  }
};

// 음성 녹음 시작
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm',
    });

    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const mimeType = mediaRecorder?.mimeType || 'audio/webm';
      audioBlob.value = new Blob(audioChunks, { type: mimeType });

      stream.getTracks().forEach((track) => track.stop());

      // 음성 녹음이 완료되면 자동으로 API 호출
      submitVoiceQuestion();
    };

    mediaRecorder.start();
    isRecording.value = true;
    recordingTime.value = 0;

    recordingTimer = window.setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } catch (error) {
    console.error('음성 녹음 시작 실패:', error);
    showErrorAlert('마이크 접근 권한이 필요합니다.');
  }
};

// 음성 녹음 중지
const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    isRecording.value = false;
    mediaRecorder.stop();

    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
  }
};

// 텍스트 질문 제출
const submitTextQuestion = async () => {
  if (!questionText.value.trim() || isProcessing.value) {
    return;
  }

  try {
    isProcessing.value = true;
    loadingStore.startLoading();

    console.log('텍스트 질문 전송 시작...');

    const response: QuestionResponse = await questionApi.askTextOnly(
      questionText.value
    );

    console.log('=== 텍스트 질문 응답 ===');
    console.log('상태:', response.status);
    console.log('메시지:', response.message);
    if (response.processedText) {
      console.log('입력 텍스트:', response.processedText);
    }
    if (response.aiResponse) {
      console.log('AI 응답:', response.aiResponse);
    }
    console.log('===================');

    if (response.status === 'SUCCESS') {
      questionText.value = '';
      showSuccessAlert(response);
    } else {
      showErrorAlert(response.message);
    }
  } catch (error) {
    console.error('텍스트 질문 전송 실패:', error);
    showErrorAlert('텍스트 질문 전송에 실패했습니다. 다시 시도해주세요.');
  } finally {
    loadingStore.stopLoading();
    isProcessing.value = false;
  }
};

// 음성 질문 제출
const submitVoiceQuestion = async () => {
  if (!audioBlob.value) {
    return;
  }

  try {
    isProcessing.value = true;
    loadingStore.startLoading();

    // 음성 파일을 File 객체로 변환
    const fileName = `voice_question_${Date.now()}.webm`;
    const audioFile = new File([audioBlob.value], fileName, {
      type: audioBlob.value.type,
    });

    console.log('음성 질문 전송 시작...');

    const response: QuestionResponse =
      await questionApi.askVoiceOnly(audioFile);

    console.log('=== 음성 질문 응답 ===');
    console.log('상태:', response.status);
    console.log('메시지:', response.message);
    if (response.processedText) {
      console.log('Clova 처리된 텍스트:', response.processedText);
    }
    if (response.aiResponse) {
      console.log('AI 응답:', response.aiResponse);
    }
    console.log('===================');

    if (response.status === 'SUCCESS') {
      audioBlob.value = null;
      showSuccessAlert(response);
    } else {
      showErrorAlert(response.message);
    }
  } catch (error) {
    console.error('음성 질문 전송 실패:', error);
    showErrorAlert('음성 질문 전송에 실패했습니다. 다시 시도해주세요.');
  } finally {
    loadingStore.stopLoading();
    isProcessing.value = false;
  }
};

// 타이핑 애니메이션 함수
const startTypingAnimation = (text: string) => {
  displayedText.value = '';
  isTyping.value = true;

  let currentIndex = 0;
  const typeChar = () => {
    if (currentIndex < text.length) {
      const currentChar = text[currentIndex];
      displayedText.value += currentChar;
      currentIndex++;

      // 띄어쓰기나 줄바꿈에서 더 긴 지연시간 적용
      let delay = 40; // 기본 40ms
      if (currentChar === ' ' || currentChar === '\n' || currentChar === '\r') {
        delay = 80; // 띄어쓰기/줄바꿈에서 80ms
      }

      typingTimer = window.setTimeout(typeChar, delay);
    } else {
      isTyping.value = false;
    }
  };

  typeChar();
};

const stopTypingAnimation = () => {
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  isTyping.value = false;
};

// Alert 모달 제어 함수들
const showSuccessAlert = (response: QuestionResponse) => {
  currentResponse.value = response;
  alertTitle.value = '💡 설명 완료!';
  showAlert.value = true;

  // AI 응답이 있으면 타이핑 애니메이션 시작
  if (response.aiResponse) {
    startTypingAnimation(response.aiResponse);
  }
};

const showErrorAlert = (message: string) => {
  currentResponse.value = null;
  alertTitle.value = '문제가 발생했어요.';
  alertContent.value = message;
  showAlert.value = true;
};

const closeAlert = () => {
  stopTypingAnimation();
  displayedText.value = '';
  showAlert.value = false;
  alertTitle.value = '';
  alertContent.value = '';
  currentResponse.value = null;
  resetToInitial();
};

onUnmounted(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer);
  }
  if (mediaRecorder && isRecording.value) {
    stopRecording();
  }
  stopTypingAnimation();
});
</script>
