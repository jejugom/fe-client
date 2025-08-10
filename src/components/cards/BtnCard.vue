<template>
  <div
    :class="[
      'btn-pressed flex h-36 w-full justify-between gap-6 rounded-lg bg-white px-4 py-4',
      color === 'primary' && 'stroke-primary',
      color === 'secondary' && 'stroke-secondary',
      color === 'surface' && 'border-surface-300',
      $attrs.class,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <!-- 글자부분 -->
    <div class="grid w-8/10 grid-rows-[30%_50%_20%]">
      <!-- 제목 -->
      <div
        class="row-[1] flex items-center truncate text-lg font-semibold"
        :class="{
          'text-primary-500': color === 'primary',
          'text-secondary-500': color === 'secondary',
          'text-surface-500': color === 'surface',
        }"
      >
        {{ title }}
      </div>

      <!-- 내용 -->
      <ul v-if="contentList.length" class="row-[2] list-disc space-y-1">
        <li
          v-for="(item, idx) in contentList"
          :key="idx"
          class="line-clamp-2 leading-snug"
        >
          {{ item }}
        </li>
      </ul>

      <!-- 태그 -->
      <div class="row-[3] flex gap-1">
        <span
          v-for="tag in parsedTags"
          :key="tag"
          class="text-gold font-semibold"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <!-- 버튼부분 -->
    <div class="flex h-full items-center">
      <div
        :class="[
          'flex h-20 w-15 items-center rounded-lg text-center text-lg font-semibold',
          color === 'primary' && 'bg-primary-100 text-primary-500',
          color === 'secondary' && 'bg-secondary-100 text-secondary-500',
          color === 'surface' && 'border-surface-300 text-surface-300 border',
        ]"
        >{{ btnText }}</div
      >
    </div></div
  >
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
