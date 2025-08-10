<!-- src/pages/event/_components/ChallengeState.vue -->
<template>
  <div class="card-design space-y-4">
    <div class="flex justify-between">
      <div class="text-lg font-semibold">
        <span class="text-primary-300">{{ userName }}</span> 님의 골든라이프
      </div>
      <div class="text-end">
        <div class="text-surface-300 font-semibold">내 포인트</div>
        <div class="text-base font-semibold"
          >{{ points.toLocaleString() }} P</div
        >
      </div>
    </div>
    <div>
      <h3 class="text-primary-500 mb-2 font-semibold">완료 리워드</h3>
      <div class="flex justify-around">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex w-20 flex-col items-center text-center"
        >
          <img
            :src="item.done ? Trophy : TrophyGray"
            alt="트로피 아이콘"
            class="mb-1 h-16 w-16"
          />
          <span class="text-sm whitespace-pre-line">{{ item.label }}</span>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRewardStore } from '@/stores/reward';
import Trophy from '@/assets/icons/PrizeCup.svg';
import TrophyGray from '@/assets/icons/PrizeCupGray.svg'; // 회색 버전 하나 추가 추천

const reward = useRewardStore();

// 사용자/포인트는 프로젝트 데이터에 맞게 교체
const userName = '최승아';
const points = 1000;

const items = computed(() => [
  { id: 'quiz', label: '금융지식\nOX 퀴즈', done: reward.isCompleted('quiz') },
  {
    id: 'park',
    label: '근처 공원\n방문 챌린지',
    done: reward.isCompleted('park'),
  },
  {
    id: 'number',
    label: '두뇌 자극\n클릭 챌린지',
    done: reward.isCompleted('number'),
  },
]);
</script>
