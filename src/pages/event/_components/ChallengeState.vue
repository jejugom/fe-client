<template>
  <div class="card-design space-y-4">
    <div class="flex justify-end gap-2 font-semibold">
      <div>내 포인트리</div>
      <div>
        <span class="text-primary-300">{{ fmtPoints }}</span> P
      </div>
    </div>

    <div>
      <div class="flex justify-around">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex w-20 flex-col items-center text-center"
        >
          <img
            :src="item.done ? Trophy : TrophyGray"
            alt=""
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
import TrophyGray from '@/assets/icons/PrizeCupGray.svg';

const props = defineProps<{
  /** 보여줄 포인트 (부모가 내려줌). 없으면 0으로 처리 */
  points?: number | null | undefined;
}>();

const reward = useRewardStore();

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

// 숫자 보정 + 3자리 콤마
const fmtPoints = computed(() => {
  const n = Number(props.points ?? 0);
  return Number.isFinite(n) ? n.toLocaleString() : '0';
});
</script>
