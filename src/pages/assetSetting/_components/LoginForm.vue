<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <label class="w-14 text-right font-semibold">아이디</label>
      <InputBox
        :model-value="credentials.id"
        @update:model-value="updateCredentials('id', $event)"
        placeholder="ID"
        size="medium"
        type="text"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="w-14 text-right font-semibold">비밀번호</label>
      <InputBox
        :model-value="credentials.password"
        @update:model-value="updateCredentials('password', $event)"
        placeholder="Password"
        size="medium"
        type="password"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputBox from '@/components/forms/InputBox.vue';

interface Credentials {
  id: string;
  password: string;
}

interface Props {
  credentials: Credentials;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:credentials': [credentials: Credentials];
}>();

// 입력값 업데이트 함수
function updateCredentials(field: keyof Credentials, value: string) {
  emit('update:credentials', {
    ...props.credentials,
    [field]: value,
  });
}
</script>
