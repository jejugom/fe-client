<template>
  <div class="mb-8 rounded-2xl bg-white p-6 shadow-xs">
    <h2 class="text-surface-500 mb-6 text-center text-lg font-bold">
      이용 절차
    </h2>

    <div class="space-y-6">
      <template v-for="(step, index) in steps" :key="step.id">
        <div class="relative flex items-center">
          <div
            :class="[
              'flex h-10 w-10 items-center justify-center rounded-full font-bold text-white',
              step.bgClass,
            ]"
          >
            {{ step.step }}
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-surface-500 font-semibold">{{ step.title }}</h3>
            <p class="text-surface-400 text-base">{{ step.description }}</p>
          </div>
          <div class="text-2xl">{{ step.emoji }}</div>
        </div>

        <div
          v-if="index < steps.length - 1"
          class="bg-surface-200 ml-5 h-6 w-px"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const steps = [
  {
    id: 1,
    step: 1,
    title: '자산 연동',
    description: '국민은행 계좌 연결 또는 직접 입력',
    emoji: '🏦',
    bgClass: 'bg-secondary-300',
  },
  {
    id: 2,
    step: 2,
    title: '투자 성향 파악',
    description: '1분 안에 끝나는 간단한 설문',
    emoji: '📝',
    bgClass: 'bg-primary-300',
  },
  {
    id: 3,
    step: 3,
    title: '지점 설정',
    description: '가까운 국민은행 지점 선택',
    emoji: '🏢',
    bgClass: 'bg-secondary-300',
  },
];
</script>
