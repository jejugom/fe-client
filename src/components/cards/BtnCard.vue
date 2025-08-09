<template>
  <div
    :class="[
      'btn-pressed flex h-31.5 w-full items-center justify-between gap-6 rounded-lg border px-4 py-4',
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
          'truncate overflow-hidden text-lg font-semibold',
          color === 'primary' && 'text-primary-500',
          color === 'secondary' && 'text-secondary-500',
          color === 'surface' && 'text-surface-500',
        ]"
        >{{ title }}</div
      >

      <!-- 내용 -->
      <ul
        class="text-surface-500 mt-2 mb-1 list-disc overflow-hidden pl-5 text-base"
        v-if="contentList.length"
      >
        <li
          v-for="(item, index) in contentList"
          :key="index"
          class="leading-snug"
        >
          {{ item }}
        </li>
      </ul>

      <!-- 태그 -->
      <div class="flex flex-wrap gap-1 pt-1">
        <span
          v-for="tag in parsedTags"
          :key="tag"
          class="text-surface-300 text-base"
        >
          {{ tag }}
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

// content 쉼표 분리 (최대 2개)
const contentList = computed(() => {
  return (
    props.content
      ?.split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 2) ?? []
  );
});

// 태그 쉼표 분리
const parsedTags = computed(() => {
  return Array.isArray(props.tags)
    ? props.tags
    : typeof props.tags === 'string'
      ? props.tags.split('·').map((t) => t.trim())
      : [];
});
</script>
