<template>
  <div class="space-y-16">
    <div>
      <h2 class="text-primary-500 mb-3 text-2xl font-bold">
        자녀에게 미리 마음을 전하고 싶다면
      </h2>
      <p class="mb-8">
        복잡하고 어려운 증여와 상속, <br />
        쉽고 안전하게 준비하실 수 있도록 도와드릴게요.
      </p>

      <div class="space-y-8">
        <GiftStartCard
          :icon="Gift1"
          title="증여"
          description="자녀나 손주에게 미리 재산을 전하고 싶으신가요? 간단한 입력으로 맞춤 증여 계획과 절세 전략을 확인해보세요."
          :buttons="[
            {
              label: '증여 시뮬레이션 시작하기',
              color: 'primary',
              onClick: goToGiftStart,
            },
          ]"
        />

        <GiftStartCard
          :icon="Gift2"
          title="상속"
          description="가족에게 소중한 자산을 안전하게 남기고 싶으신가요? 상속 계획부터 유언장 작성까지 한 번에 준비해보세요."
          :buttons="[
            {
              label: '유언장 작성하기',
              color: 'primary',
              onClick: goToInheritanceStart,
            },
            {
              label: '상속 관련 상품 보러가기',
              color: 'surface',
              onClick: goToInheritanceProducts,
            },
          ]"
        />
      </div>
    </div>
    <div class="mt-16 flex flex-col">
      <p class="text-primary-500 mb-2 text-center font-semibold">
        궁금하신 점이 있으신가요?<br />자주 하시는 질문을 보기 쉽게
        정리해두었어요.
      </p>
      <Btn
        color="primary"
        label="자주 묻는 질문"
        size="large"
        @click="goToFAQ"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Gift1 from '@/assets/images/Gift1.svg';
import Gift2 from '@/assets/images/Gift2.svg';
import Btn from '@/components/buttons/Btn.vue';
import GiftStartCard from './_components/GiftStartCard.vue';

const router = useRouter();

const goToGiftStart = () => router.push({ name: 'gift-start' });
const goToInheritanceStart = () => router.push({ name: 'inheritance-start' });
const goToInheritanceProducts = () => router.push({ name: 'nohoo' });
const goToFAQ = () => router.push({ name: 'gift-faq' });
</script>
