<template>
  <div class="card-design space-y-4">
    <div class="flex justify-between">
      <div class="text-lg font-semibold"
        ><span class="text-primary-300">최승아</span> 님의 골든라이프</div
      >
      <div class="text-end">
        <div class="text-surface-300 font-semibold">내 포인트</div>
        <div class="text-base font-semibold">1,000 P</div>
      </div>
    </div>
    <div>
      <h3 class="text-primary-500 mb-2 font-semibold">완료 리워드</h3>
      <div class="flex justify-around">
        <div
          v-for="(reward, idx) in rewards"
          :key="idx"
          class="flex w-20 flex-col items-center text-center"
        >
          <img :src="Icon" alt="트로피 아이콘" class="mb-1 h-16 w-16" />
          <span class="">
            {{ reward }}
          </span>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import Icon from '@/assets/icons/PrizeCup.svg';

const rewards = ['금융지식 퀴즈', '숫자 빨리 누르기 게임', '공원 방문 챌린지'];
</script>
