<!-- _components/DeleteConfirmModal.vue -->
<template>
  <Modal
    @click1="$emit('cancel')"
    @click2="$emit('confirm')"
    title="수증자 삭제"
    leftLabel="취소"
    rightLabel="삭제"
  >
    <div class="py-4 text-center">
      <p class="text-base">
        <span class="text-primary-500 font-semibold">{{ recipientName }}</span>
        수증자를 삭제하시겠습니까?
      </p>
      <p class="text-surface-400 mt-2">
        삭제된 수증자 정보는 복구할 수 없습니다.
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modals/Modal.vue';

interface Props {
  recipientName: string;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
