<template>
  <div class="bg-gold shimmer rounded-lg p-4">
    <div class="bg-silver mb-4 h-8 w-3/4 rounded"></div>
    <div class="flex items-center justify-between">
      <div class="bg-silver mb-2 h-6 w-1/2 rounded"></div>
      <div class="bg-silver h-10 w-24 rounded"></div>
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
