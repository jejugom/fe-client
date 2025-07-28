<template>
  <h2 class="text-primary-300 mb-2 text-2xl font-bold"
    >자녀에게 미리 마음을 전하고 싶다면</h2
  >
  <p class="text-surface-500 mb-6 text-base">
    자녀나 손주에게 마음을 전하고 싶으신가요? <br />
    복잡하고 어려운 상속·증여, <br />
    쉽고 안전하게 준비하실 수 있도록 도와드릴게요.
  </p>

  <div class="mb-16">
    <GiftStartCard
      :imgSrc="Gift1"
      altText="증여 아이콘"
      title="증여"
      description="자녀나 손주에게 미리 재산을 전하고 싶으신가요? 세금 걱정 없이 증여 계획을 도와드려요."
      @click="goToGiftStart"
    />

    <GiftStartCard
      :imgSrc="Gift2"
      altText="상속 아이콘"
      title="상속"
      description="가족에게 자산이 잘 전달될 수 있도록 상속 계획도 미리미리 준비하실 수 있어요."
    />
  </div>
  <!-- 하단 FAQ 안내 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <p class="text-primary-300 mb-2 text-center font-semibold">
      궁금하신 점이 있으신가요?<br />자주 하시는 질문을 보기 쉽게
      정리해두었어요.
    </p>
    <Btn color="primary" label="자주 묻는 질문" size="large" @click="goToFAQ" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import GiftStartCard from './_components/GiftStartCard.vue';
import Gift1 from '@/assets/images/Gift1.svg';
import Gift2 from '@/assets/images/Gift2.svg';

const router = useRouter();

const goToGiftStart = () => {
  router.push({ name: 'gift-start' });
};

const goToFAQ = () => {
  router.push({ name: 'gift-faq' });
};
</script>
