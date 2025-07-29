<template>
  <div
    :class="[
      'border-surface-200 flex h-31.5 w-full items-center justify-between gap-6 rounded-lg border p-4',
      $attrs.class,
    ]"
    v-bind="$attrs"
  >
    <!-- 글자부분 -->
    <div class="flex w-2/3 flex-col">
      <!-- 제목 -->
      <div
        :class="['text-primary-500 overflow-hidden text-lg font-semibold']"
        >{{ title }}</div
      >
      <!-- 내용 -->
      <div class="text-surface-500 mt-2 mb-1 flex flex-wrap gap-1 truncate">
        <span>
          {{ content }}
        </span>
      </div>
      <!-- 태그 -->
      <div class="flex flex-wrap">
        {{ tags }}
      </div>
    </div>
    <!-- 버튼부분 -->
    <div class="flex gap-2">
      <div
        :class="[
          'bg-primary-100 text-primary-500 flex h-20 w-15 items-center justify-center rounded-lg text-lg font-semibold',
        ]"
        @click="onClick1"
        >{{ btnText1 }}</div
      >
      <div
        :class="[
          'text-primary-500 flex h-20 w-15 items-center justify-center rounded-lg bg-red-100 text-lg font-semibold',
        ]"
        @click="onClick2"
        >{{ btnText2 }}</div
      ></div
    >
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineProps<{
  title?: string;
  content?: string;
  tags?: string;
  btnText1?: string;
  btnText2?: string;
}>();

const emit = defineEmits<{
  (e: 'click:edit'): void;
  (e: 'click:delete'): void;
}>();

const onClick1 = () => emit('click:edit');
const onClick2 = () => emit('click:delete');
</script>
