<template>
  <div
    class="card-design shimmer flex flex-col gap-2 bg-gray-200 p-0 pt-4 pr-4"
  >
    <div class="ml-4 flex items-center justify-between">
      <div class="bg-silver h-7 w-2/5 rounded"></div>
      <div class="bg-silver h-6 w-1/4 rounded"></div>
    </div>
    <div class="bg-silver m-4 mt-2 h-60 w-full rounded"></div>
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
