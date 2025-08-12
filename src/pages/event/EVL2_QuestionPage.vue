<template>
  <div class="flex h-full flex-col">
    <!-- 상단 Title -->
    <div class="text-primary-500 mb-8 text-2xl font-bold">
      무엇이든 물어보세요
    </div>

    <!-- 중단 설명 -->
    <div class="text-surface-500 mb-8 space-y-1 text-base leading-relaxed">
      <p>어려운 금융 단어가 있으신가요?</p>
      <p>궁금한점을 입력해주시거나,</p>
      <p>마이크 버튼을 눌러서 알려주세요.</p>
      <p>쉽게 설명해드릴게요!</p>
    </div>

    <!-- 하단 입력 영역 -->
    <div class="flex flex-1 flex-col justify-end space-y-6">
      <!-- 텍스트로 물어보기 섹션 -->
      <div class="space-y-3">
        <h3 class="text-primary-500 text-lg font-semibold"
          >💬 키보드로 물어보기</h3
        >
        <InputBox
          v-model="questionText"
          size="large"
          placeholder="궁금한 금융 단어를 물어보세요!"
          class="w-full"
        />
        <button
          @click="submitTextQuestion"
          :disabled="!questionText.trim()"
          :class="[
            'w-full rounded-lg py-3 font-semibold text-white transition-colors',
            questionText.trim()
              ? 'bg-primary-500'
              : 'bg-surface-300 cursor-not-allowed',
          ]"
        >
          텍스트로 질문하기
        </button>
      </div>

      <div class="border-surface-200 border-t"></div>

      <!-- 음성으로 물어보기 섹션 -->
      <div class="space-y-3">
        <h3 class="text-primary-500 text-lg font-semibold"
          >🎤 마이크로 물어보기</h3
        >

        <!-- 음성 입력 버튼 -->
        <div class="flex justify-center">
          <button
            @click="toggleRecording"
            :class="[
              'flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300',
              isRecording
                ? 'animate-pulse bg-red-500 hover:bg-red-600'
                : 'bg-primary-500 hover:bg-primary-600',
            ]"
            :disabled="isProcessing"
          >
            <svg
              v-if="!isRecording"
              class="h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"
              />
            </svg>
            <svg
              v-else
              class="h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </div>

        <!-- 녹음 상태 표시 -->
        <div v-if="isRecording" class="text-center">
          <p class="text-sm font-medium text-red-500">
            녹음 중... ({{ recordingTime }}초)
          </p>
          <p class="text-surface-500 mt-1 text-sm">
            마이크 버튼을 다시 눌러 녹음을 종료하세요
          </p>
        </div>

        <div v-if="isProcessing" class="text-center">
          <p class="text-primary-500 text-sm font-medium">
            음성을 처리하고 있습니다...
          </p>
        </div>

        <p class="text-surface-400 text-center text-sm">
          마이크 버튼을 눌러 녹음하고, 다시 눌러 전송하세요
        </p>
      </div>
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
          <p
            class="text-surface-500 bg-surface-100 rounded-lg p-3 text-base leading-relaxed"
          >
            {{ currentResponse.aiResponse }}
          </p>
        </div>
      </div>
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';
import Alert from '@/components/modals/Alert.vue';
import { questionApi, type QuestionResponse } from '@/api/question/question';

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

let mediaRecorder: MediaRecorder | null = null;
let recordingTimer: number | null = null;
let audioChunks: BlobPart[] = [];

const toggleRecording = async () => {
  if (!isRecording.value) {
    await startRecording();
  } else {
    stopRecording();
  }
};

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
    alert('마이크 접근 권한이 필요합니다.');
  }
};

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

// 텍스트 전용 질문 제출
const submitTextQuestion = async () => {
  if (!questionText.value.trim()) {
    return;
  }

  try {
    isProcessing.value = true;

    console.log('텍스트 질문 전송 시작...');
    const response: QuestionResponse = await questionApi.askTextOnly(
      questionText.value
    );

    console.log('=== 텍스트 질문 응답 ===');
    console.log('상태:', response.status);
    console.log('메시지:', response.message);
    if (response.processedText) {
      console.log('처리된 텍스트:', response.processedText);
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
    isProcessing.value = false;
  }
};

// 음성 전용 질문 제출
const submitVoiceQuestion = async () => {
  if (!audioBlob.value) {
    return;
  }

  try {
    isProcessing.value = true;

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
      console.log('처리된 텍스트:', response.processedText);
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
    isProcessing.value = false;
  }
};

// Alert 모달 제어 함수들
const showSuccessAlert = (response: QuestionResponse) => {
  currentResponse.value = response;
  alertTitle.value = '💡 설명 완료!';
  showAlert.value = true;
};

const showErrorAlert = (message: string) => {
  currentResponse.value = null;
  alertTitle.value = '⚠️ 오류 발생';
  alertContent.value = message;
  showAlert.value = true;
};

const closeAlert = () => {
  showAlert.value = false;
  alertTitle.value = '';
  alertContent.value = '';
  currentResponse.value = null;
};

onUnmounted(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer);
  }
  if (mediaRecorder && isRecording.value) {
    stopRecording();
  }
});
</script>
