<template>
  <div>
    <h1 class="text-primary-500 mb-4 text-2xl font-bold">추가 유언 작성하기</h1>
    <p class="mb-8 leading-relaxed">
      <span class="block indent-2">
        유언장 템플릿의 하단 부분에 들어갈 내용을 자유롭게 작성해 주세요.
      </span>
      <span class="block indent-2">
        가족에게 남기고 싶은 따뜻한 말이나 유언의 배경 등을 적을 수 있습니다.
      </span>
      <span class="block indent-2">
        작성하신 추가 유언 내용은 저장됩니다.
      </span>
    </p>

    <div class="space-y-8">
      <div>
        <h2 class="text-primary-300 mb-2 text-xl font-bold">
          남기고 싶은 유언
        </h2>
        <textarea
          v-model="localWillContent"
          class="border-surface-300 input-focus focus:ring-gold focus:border-gold w-full rounded-lg border bg-white p-4 text-base focus:ring-1 focus:outline-none"
          rows="8"
          placeholder="예) 본 유언장은 저의 자유로운 의사에 따라 작성된 것으로, 가족 간의 이해를 부탁드립니다. 제가 남긴 자산이 가족의 행복을 위해 사용되기를 바랍니다."
        ></textarea>
      </div>
    </div>

    <div class="mt-16">
      <BtnSet
        label1="이전으로"
        label2="저장하고 결과보기"
        type="type2"
        @click1="goBack"
        @click2="saveAndGoToResult"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import { useInheritanceStore } from '@/stores/inheritance';
import BtnSet from '@/components/buttons/BtnSet.vue';

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

const goBack = () => {
  router.go(-1);
};

const saveAndGoToResult = () => {
  // 최종 유언 내용을 Store에 저장
  inheritanceStore.setAdditionalWillContent(localWillContent.value);

  // 유언장 결과 페이지로 이동
  router.push({
    name: 'inheritance-result',
  });
};

onMounted(() => {
  // 분배된 자산이 없는 경우 경고
  if (distributedAssets.value.length === 0) {
    console.warn(
      '⚠️ 분배된 자산이 없습니다. 이전 페이지에서 자산을 선택해주세요.'
    );
  }
});
</script>
