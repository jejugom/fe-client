<template>
  <div>
    <h1 class="text-primary-300 mb-3 text-2xl font-bold">추가 유언 작성하기</h1>
    <p class="text-surface-600 mb-8">
      유언장 템플릿의 '추가 유언' 부분에 들어갈 내용을 자유롭게 작성해
      주세요.<br />
      가족에게 남기고 싶은 따뜻한 말이나 유언의 배경 등을 적을 수 있습니다.
    </p>

    <div class="space-y-6">
      <div>
        <h2 class="text-primary-300 mb-2 text-xl font-bold">
          남기고 싶은 유언
        </h2>
        <textarea
          v-model="additionalWillContent"
          class="border-primary-300 w-full rounded-lg border p-4 text-base"
          rows="10"
          placeholder="예) 본 유언장은 저의 자유로운 의사에 따라 작성된 것으로, 가족 간의 이해를 부탁드립니다. 제가 남긴 자산이 가족의 행복을 위해 사용되기를 바랍니다."
        ></textarea>
      </div>
    </div>

    <div class="mt-12 flex space-x-4">
      <Btn color="surface" label="이전 단계로" size="large" @click="goBack" />
      <Btn
        color="primary"
        label="유언장 완성하고 결과 보기"
        size="large"
        @click="goToResultWithWill"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

// 추가 유언 내용을 저장할 단일 반응형 변수
const additionalWillContent = ref<string>('');

const goBack = () => {
  router.go(-1);
};

const goToResultWithWill = () => {
  // 작성된 추가 유언 내용과 함께 결과 페이지로 이동
  router.push({
    name: 'inheritance-result',
    state: {
      additionalWillContent: additionalWillContent.value,
      // 필요한 다른 데이터 (예: 상속 자산 정보)도 함께 전달
    },
  });
};
</script>
