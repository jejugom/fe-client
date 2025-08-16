<template>
  <div
    class="relative left-1/2 mt-[-1.125rem] w-screen max-w-[600px] -translate-x-1/2"
  >
    <div
      class="bg-secondary-100 shimmer flex h-50 w-full items-center justify-center gap-8 p-8"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="flex w-32 flex-col items-center justify-between"
      >
        <div class="bg-silver h-20 w-20 rounded-full"></div>
        <div class="bg-silver mt-1 mb-2 h-6 w-24 rounded"></div>
        <div class="bg-silver h-8 w-20 rounded"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  animation: shimmer 1.5s infinite linear;
  transform: translateX(-100%);
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
