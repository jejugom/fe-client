<template>
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">상속·증여</h2>
  <p class="text-surface-500 mb-6 text-base">
    자녀에게 마음을 전하고 싶은 분들을 위해<br />
    증여·상속을 쉽고 안전하게<br />
    준비할 수 있도록 도와드립니다.
  </p>

  <!-- 승아코멘트: 컴포넌트화 필요 - ✅ -->
  <GiftStartCard
    :imgSrc="Gift1"
    altText="증여 아이콘"
    title="증여"
    description="자녀나 손주에게 재산을 미리 물려주고 싶을 때, 세금 걱정 없이 증여 계획을 세워보세요."
    @click="goToGiftStart"
  />

  <GiftStartCard
    :imgSrc="Gift2"
    altText="상속 아이콘"
    title="상속"
    description="내 자산이 가족에게 잘 전달될 수 있도록, 쉽고 정리된 상속 계획을 도와드립니다."
  />

  <!-- 하단 FAQ 안내 -->
  <div>
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
