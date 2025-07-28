<template>
  <div class="mb-8 rounded-2xl bg-white p-6 shadow-xs">
    <h2 class="text-surface-500 mb-6 text-center text-lg font-bold">
      노후도락이 제공하는 서비스
    </h2>

    <div class="space-y-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="flex items-start space-x-4"
      >
        <div
          :class="[
            'flex h-12 w-12 items-center justify-center rounded-full',
            service.bgClass,
          ]"
        >
          <span class="text-xl">{{ service.emoji }}</span>
        </div>
        <div class="flex-1">
          <h3 class="text-surface-500 font-semibold">{{ service.title }}</h3>
          <p class="text-surface-400 text-sm">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const services = [
  {
    id: 1,
    title: '스마트 자산 분석',
    description: '깔끔하고 직관적인 자산 현황을 한눈에 파악',
    emoji: '📊',
    bgClass: 'bg-primary-100',
  },
  {
    id: 2,
    title: '맞춤형 투자 추천',
    description: '당신에게 딱 맞는 최적의 투자 상품 제안',
    emoji: '❤️',
    bgClass: 'bg-secondary-100',
  },
  {
    id: 3,
    title: '증여·상속 시뮬레이션',
    description: '세금을 줄여주는 효율적인 자산 승계 체험',
    emoji: '👁️',
    bgClass: 'bg-primary-100',
  },
  {
    id: 4,
    title: '은행 예약 서비스',
    description: '번거로운 방문 예약을 앱에서 간편하게',
    emoji: '💼',
    bgClass: 'bg-secondary-100',
  },
];
</script>
