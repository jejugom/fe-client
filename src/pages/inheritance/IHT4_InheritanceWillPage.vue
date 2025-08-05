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
          v-model="localWillContent"
          @input="updateWillContent"
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import { useInheritanceStore } from '@/stores/inheritance';
import { formatCurrency } from '@/utils/format';

const inheritanceStore = useInheritanceStore();
const router = useRouter();

// Store의 데이터를 computed로 가져오기
const distributedAssets = computed(() => inheritanceStore.distributedAssets);

// 로컬 상태로 유언 내용 관리 (실시간 업데이트를 위해)
const localWillContent = ref<string>('');

// Store의 유언 내용이 변경되면 로컬 상태도 업데이트
watch(
  () => inheritanceStore.additionalWillContent,
  (newContent) => {
    localWillContent.value = newContent;
  },
  { immediate: true }
);

// 유언 내용 업데이트 함수
const updateWillContent = () => {
  inheritanceStore.setAdditionalWillContent(localWillContent.value);
};

const goBack = () => {
  // 현재 작성중인 유언 내용을 Store에 저장하고 뒤로가기
  inheritanceStore.setAdditionalWillContent(localWillContent.value);
  router.go(-1);
};

const goToResultWithWill = () => {
  console.log('goToResultWithWill 시작');
  console.log('현재 유언 내용:', localWillContent.value);
  console.log('현재 분배된 자산:', distributedAssets.value);

  // 최종 유언 내용을 Store에 저장
  inheritanceStore.setAdditionalWillContent(localWillContent.value);

  // 유언장 결과 페이지로 이동
  router.push({
    name: 'inheritance-result',
  });
};

onMounted(() => {
  console.log('=== InheritanceWillFormPage 마운트됨 ===');
  console.log('Store에서 가져온 distributedAssets:', distributedAssets.value);
  console.log(
    'Store에서 가져온 additionalWillContent:',
    inheritanceStore.additionalWillContent
  );

  // 분배된 자산이 없는 경우 경고
  if (distributedAssets.value.length === 0) {
    console.warn(
      '⚠️ 분배된 자산이 없습니다. 이전 페이지에서 자산을 선택해주세요.'
    );
  }

  // Store의 현재 상태 로그
  console.log('Store 전체 상태:', {
    distributedAssets: inheritanceStore.distributedAssets,
    recipientSummaries: inheritanceStore.recipientSummaries,
    // mode: inheritanceStore.mode,
    additionalWillContent: inheritanceStore.additionalWillContent,
  });
});
</script>
