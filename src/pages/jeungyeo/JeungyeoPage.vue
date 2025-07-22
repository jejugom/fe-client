<template>
  <div class="space-y-6 bg-white px-4">
    <!-- 제목 -->
    <h2 class="mb-2 text-xl font-semibold text-blue-600">상속·증여</h2>
    <p class="my-5 mb-6 text-sm text-gray-800">
      자녀에게 마음을 전하고 싶은 분들을 위해<br />
      증여·상속을 쉽고 안전하게 준비할 수 있도록 도와드립니다.
    </p>

    <!-- 증여 카드 -->
    <div
      class="my-5 mb-4 flex items-start gap-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-8"
      @click="goToJeungyeoStart"
    >
      <img src="" alt="증여 아이콘" class="h-10 w-10" />
      <div>
        <p class="text-xl font-semibold text-gray-800">증여</p>
        <p class="mt-1 text-lg text-gray-700">
          자녀나 손주에게 재산을 미리 물려주고 싶을 때, 세금 걱정 없이 증여
          계획을 세워보세요.
        </p>
      </div>
    </div>

    <!-- 상속 카드 -->
    <div
      class="my-5 mb-4 flex items-start gap-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-8"
    >
      <img src="" alt="상속 아이콘" class="h-10 w-10" />
      <div>
        <p class="text-xl font-semibold text-gray-800">상속</p>
        <p class="mt-1 text-lg text-gray-700">
          내 자산이 가족에게 잘 전달될 수 있도록, 쉽고 정리된 상속 계획을
          도와드립니다.
        </p>
      </div>
    </div>

    <!-- FAQ 안내 -->
    <p class="mt-8 mb-4 text-center text-sm text-gray-700">
      혹시 궁금한 점이 있으신가요?<br />
      많이들 물어보시는 내용을 쉽게 정리해두었어요.
    </p>

    <!-- 자주 묻는 질문 버튼 -->
    <button
      @click="goToFAQ"
      class="mx-auto block w-full rounded-lg bg-blue-100 py-4 text-lg font-semibold text-gray-800 hover:bg-blue-200"
    >
      자주 묻는 질문
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToJeungyeoStart = () => {
  router.push('/jeungyeo/start');
};

const goToFAQ = () => {
  router.push('/jeungyeo/faq'); // FAQ 경로 설정 필요
};
</script>
