<template>
  <div
    class="relative left-1/2 mt-[-1.125rem] w-screen max-w-[600px] -translate-x-1/2"
  >
    <div
      class="bg-secondary-100 flex h-50 w-full items-center justify-center gap-8 p-8"
    >
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="flex w-32 flex-col items-center justify-between"
      >
        <img
          v-if="getIcon(item.label)"
          :src="getIcon(item.label) ?? undefined"
          alt="icon"
          class="h-20 w-20"
          loading="lazy"
        />
        <span
          class="text-surface-300 mt-1 mb-2 text-center text-base font-semibold"
          >{{ item.label }}</span
        >
        <span class="font-point text-surface-300 text-center text-lg">
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { label: string; value: string }[];
}>();

const iconMap: Record<string, string> = {
  최고금리: 'Icon1.svg',
  가입방법: 'Icon2.svg',
  가입제한: 'Icon3.svg',
  대출금리: 'Icon4.svg',
  담보유형: 'Icon5.svg',
  금리유형: 'Icon6.svg',
  매매단위: 'Icon7.svg',
  통화: 'Icon8.svg',
  '3개월 수익률': 'Icon9.svg',
  위험등급: 'Icon10.svg',
  총보수: 'Icon11.svg',
  보호여부: 'Icon12.svg',
  기준가: 'Icon13.svg',
};

// 레이지 로딩
function getIcon(label: string): string | null {
  const keyword = Object.keys(iconMap).find((key) => label.includes(key));
  if (keyword) {
    const filename = iconMap[keyword];
    return new URL(
      `../../../assets/images/productFeats/${filename}`,
      import.meta.url
    ).href;
  }
  return null;
}
</script>
