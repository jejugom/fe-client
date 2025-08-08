<template>
  <Modal
    @click1="$emit('close')"
    @click2="$emit('confirm')"
    title="자산 선택"
    leftLabel="취소"
    rightLabel="완료"
  >
    <!-- 단위 -->
    <div class="text-surface-300 text-right text-xs">단위: 원</div>

    <!-- 자산 리스트 -->
    <ul class="mt-4 space-y-3">
      <li v-for="(item, index) in assetList" :key="index">
        <CheckBox
          :label="item.name"
          :amount="item.amount"
          v-model="item.selected"
        />
      </li>
    </ul>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modals/Modal.vue';
import CheckBox from '@/components/forms/CheckBox.vue';

interface Asset {
  name: string;
  amount: string;
  selected: boolean;
}

interface Props {
  assetList: Asset[];
}

interface Emits {
  (e: 'close'): void;
  (e: 'confirm'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
