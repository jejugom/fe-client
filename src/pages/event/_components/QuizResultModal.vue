<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showResultModal"
        class="fixed inset-0 z-50 flex items-end justify-center"
      >
        <!-- 배경 오버레이 -->
        <div class="bg-surface-300 absolute inset-0 opacity-40"></div>

        <!-- 바텀시트 -->
        <Transition
          enter-active-class="transition-transform duration-500 ease-out"
          leave-active-class="transition-transform duration-300 ease-in"
          enter-from-class="transform translate-y-full"
          enter-to-class="transform translate-y-0"
          leave-from-class="transform translate-y-0"
          leave-to-class="transform translate-y-full"
        >
          <div
            v-if="showResultModal"
            class="relative mx-4 mb-4 w-full max-w-2xl rounded-3xl bg-white p-8"
          >
            <!-- 핸들바 -->
            <div
              class="absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 transform rounded-full bg-gray-300"
            ></div>

            <!-- 컨텐츠 -->
            <div class="pt-4">
              <!-- 아이콘과 제목 -->
              <div class="mb-6 flex flex-col items-start gap-4">
                <!-- 아이콘 -->
                <div
                  class="rounded-lg p-4"
                  :class="isCorrect ? 'bg-primary-100' : 'bg-red-100'"
                >
                  <!-- 정답 O 아이콘 -->
                  <div
                    v-if="isCorrect"
                    class="border-primary-300 h-8 w-8 rounded-full border-4"
                  ></div>

                  <!-- 오답 X 아이콘 -->
                  <div
                    v-else
                    class="relative flex h-8 w-8 items-center justify-center"
                  >
                    <div
                      class="absolute h-1 w-10 rotate-45 rounded-full bg-red-300"
                    ></div>
                    <div
                      class="absolute h-1 w-10 -rotate-45 rounded-full bg-red-300"
                    ></div>
                  </div>
                </div>

                <!-- 제목 -->
                <h3
                  class="text-3xl font-bold"
                  :class="isCorrect ? 'text-primary-300' : 'text-primary-500'"
                >
                  {{ isCorrect ? '정답이에요!' : '정답이 아니에요' }}
                </h3>
              </div>

              <!-- 결과 내용 -->
              <div class="text-primary-500 mb-8">
                <p v-if="!isCorrect" class="mb-4 text-lg">
                  정답:
                  <span class="text-primary-500 font-bold">{{
                    currentQuestion.choices[currentQuestion.answer]
                  }}</span>
                </p>

                <div v-if="currentQuestion.explanation">
                  <div class="flex items-start">
                    <div>
                      <p class="text-primary-500 mb-2 text-lg font-semibold"
                        >해설</p
                      >
                      <p class="text-primary-500 text-base">
                        {{ currentQuestion.explanation }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 버튼 -->
              <GlassBtn
                color="primary"
                :label="isLastQuestion ? '결과 보기' : '다음'"
                size="large"
                @click="handleConfirm"
                class="w-full"
              />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import GlassBtn from '@/components/buttons/GlassBtn.vue';
import { type Quiz } from '@/pages/event/quizData';

const props = defineProps<{
  showResultModal: boolean;
  isCorrect: boolean;
  currentQuestion: Quiz;
  isLastQuestion: boolean;
}>();

const emit = defineEmits(['confirm']);

// 바디 스크롤 제어
watch(
  () => props.showResultModal,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

const handleConfirm = () => {
  emit('confirm');
};
</script>
