<template>
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">상속·증여</h2>
  <p class="text-surface-500 mb-6 text-base">
    자녀에게 마음을 전하고 싶은 분들을 위해<br />
    증여·상속을 쉽고 안전하게<br />
    준비할 수 있도록 도와드립니다.
  </p>

  <!-- 증여 카드 -->
  <div
    class="border-primary-300 mb-4 flex items-start gap-8 rounded-xl border-1 px-8 py-4"
    @click="goToGiftStart"
  >
    <div class="aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg">
      <img src="" alt="증여 아이콘" class="h-full w-full object-cover" />
    </div>
    <div>
      <p class="text-primary-500 text-lg font-semibold">증여</p>
      <p class="text-surface-500 mt-1 text-sm">
        자녀나 손주에게 재산을 미리 물려주고 싶을 때, 세금 걱정 없이 증여 계획을
        세워보세요.
      </p>
    </div>
  </div>

  <!-- 상속 카드 -->
  <div
    class="border-primary-300 mb-4 flex items-start gap-8 rounded-xl border-1 px-8 py-4"
  >
    <div class="aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg">
      <img src="" alt="상속 아이콘" class="h-full w-full object-cover" />
    </div>
    <div>
      <p class="text-primary-500 text-lg font-semibold">상속</p>
      <p class="text-surface-500 mt-1 text-sm">
        내 자산이 가족에게 잘 전달될 수 있도록, 쉽고 정리된 상속 계획을
        도와드립니다.
      </p>
    </div>
  </div>

  <!-- 하단 FAQ 안내 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <p class="text-primary-500 mb-3 text-center text-base">
      혹시 궁금한 점이 있으신가요?<br />
      많이들 물어보시는 내용을 쉽게 정리해두었어요.
    </p>
    <Btn color="primary" label="자주 묻는 질문" size="large" @click="goToFAQ" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

const goToGiftStart = () => {
  router.push({ name: 'gift-start' });
};

const goToFAQ = () => {
  router.push({ name: 'gift-faq' });
};
</script>
