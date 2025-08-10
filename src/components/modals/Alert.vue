<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self.stop
    >
      <!-- 투명 배경 -->
      <div class="bg-surface-300 absolute inset-0 opacity-40"></div>

      <!-- 모달 박스 -->
      <div
        class="card-design relative z-10 py-8"
        role="dialog"
        aria-modal="true"
      >
        <!-- 제목 -->
        <div v-if="title" class="text-primary-300 text-left text-xl font-bold">
          {{ title }}
        </div>

        <!-- 슬롯 내용 -->
        <div class="my-8 w-74">
          <slot />
        </div>

        <!-- 고정 버튼 (중앙 정렬 추가) -->
        <div class="flex justify-center">
          <Btn
            color="primary"
            label="확인"
            size="medium"
            @click="emit('click')"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Btn from '@/components/buttons/Btn.vue';

defineProps<{
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

onMounted(() => {
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>
