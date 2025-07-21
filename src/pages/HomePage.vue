<template>
  <div>
    <div class="text-xl font-bold">홈페이지</div>
    <button @click="open = true" class="bg-primary-100 p-4">모달 열기</button>

    <!-- 조건부 모달 -->
    <Modal
      v-if="open"
      title="자산 정보 등록"
      leftLabel="취소"
      rightLabel="등록"
      @click1="onCancel"
      @click2="onSubmit"
    >
      <p class="h-62 text-left">여기에 입력 폼 혹은 콘텐츠를 넣으세요.</p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/modals/Modal.vue';

const open = ref(false);

const onCancel = () => {
  open.value = false;
};

const onSubmit = () => {
  alert('등록 처리!');
  open.value = false;
};
</script>
