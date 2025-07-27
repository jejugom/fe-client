<template>
  <div
    :class="[
      'flex h-31.5 w-full items-center justify-between gap-6 rounded-lg border px-8 py-4',
      color === 'primary' && 'border-primary-300',
      color === 'secondary' && 'border-gold',
      color === 'surface' && 'border-surface-300',
      $attrs.class,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <!-- 글자부분 -->
    <div class="flex w-7/10 flex-col">
      <!-- 제목 -->
      <div
        :class="[
          'overflow-hidden text-lg font-semibold',
          color === 'primary' && 'text-primary-500',
          color === 'secondary' && 'text-secondary-500',
          color === 'surface' && 'text-surface-500',
        ]"
        >{{ title }}</div
      >
      <!-- 내용 -->
      <div
        class="text-surface-500 mt-2 mb-1 flex flex-wrap gap-1 truncate text-sm"
      >
        <span
          v-for="(item, index) in contentList"
          :key="index"
          class="inline-block max-w-full truncate"
        >
          {{ item }}
        </span>
      </div>
      <!-- 태그 -->
      <div class="flex flex-wrap gap-1 pt-1">
        <span
          v-for="tag in parsedTags"
          :key="tag"
          class="text-surface-300 text-sm"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
    <!-- 버튼부분 -->
    <div
      :class="[
        'flex h-20 w-15 items-center rounded-lg text-center text-lg font-semibold',
        color === 'primary' && 'bg-primary-100 text-primary-500',
        color === 'secondary' && 'bg-secondary-100 text-secondary-500',
        color === 'surface' && 'border-surface-300 text-surface-300 border',
      ]"
      >{{ btnText }}</div
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  title?: string;
  content?: string;
  tags?: string;
  btnText?: string;
  color?: 'primary' | 'secondary' | 'surface';
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => emit('click');

// 태그 파싱
const parsedTags = computed(
  () => props.tags?.split(',').map((t) => t.trim()) ?? []
);

// 쉼표 기준 분리 + 3개까지만 노출
const contentList = computed(() => {
  return (
    props.content
      ?.split(',')
      .map((s) => s.trim())
      .slice(0, 2) ?? []
  );
});
</script>
