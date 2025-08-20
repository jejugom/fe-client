<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 투명 배경 -->
      <div class="bg-surface-300 absolute inset-0 opacity-40"></div>

      <!-- 모달 박스 -->
      <div
        class="card-design relative z-10 max-h-[80vh] overflow-y-auto py-8"
        role="dialog"
        aria-modal="true"
      >
        <!-- 제목 -->
        <div
          v-if="title"
          class="text-primary-300 text-center text-2xl font-bold"
        >
          {{ title }}
        </div>

        <!-- 슬롯 내용 -->
        <div class="my-8 w-74">
          <slot />
        </div>

        <!-- 고정 버튼 (중앙 정렬 추가) -->
        <div class="flex justify-center">
          <BtnSet
            :label1="leftLabel"
            :label2="rightLabel"
            @click1="emit('click1')"
            @click2="emit('click2')"
            type="type1"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import BtnSet from '@/components/buttons/BtnSet.vue';

defineProps<{
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'click1'): void;
  (e: 'click2'): void;
}>();

// 페이지 진입
onMounted(() => {
  document.body.style.overflow = 'hidden';
});
// 페이지 이탈
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>
