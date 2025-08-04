<template>
  <Modal
    @click1="$emit('cancel')"
    @click2="$emit('confirm')"
    :title="mode === 'gift' ? '수증자 삭제' : '상속인 삭제'"
    leftLabel="취소"
    rightLabel="삭제"
  >
    <div class="py-4 text-center">
      <p class="text-base">
        <span class="text-primary-500 font-semibold">{{ recipientName }}</span>
        {{ mode === 'gift' ? '수증자' : '상속인' }}을(를) 삭제하시겠습니까?
      </p>
      <p class="text-surface-400 mt-2 text-sm">
        삭제된 정보는 복구할 수 없습니다.
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modals/Modal.vue';

interface Props {
  recipientName: string;
  mode: 'gift' | 'inheritance';
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
