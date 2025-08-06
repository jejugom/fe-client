<template>
  <div>
    <h1 class="text-primary-300 mb-3 text-2xl font-bold">유언장</h1>
    <p class="mb-8 text-sm">
      작성하신 내용을 바탕으로 유언장 템플릿이 완성되었습니다.
      <br />
      아래 유언장은 참고용이며, 법적 효력을 갖기 위해서는 정식 절차에 따라
      작성해야 합니다.
    </p>

    <div class="border-surface-300 mb-4 border p-8">
      <div class="border-surface-300 mb-8 border-b pb-2">
        <h2 class="text-center text-base font-bold">유언장</h2>
      </div>

      <section class="mb-8">
        <ul class="space-y-1 text-sm">
          <li><strong>유언자 성명:</strong> {{ testator.name }}</li>
          <li><strong>생년월일:</strong> {{ testator.birth }}</li>
          <li><strong>이메일:</strong> {{ testator.email }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h3 class="mb-2 text-base font-bold">유언 사항</h3>
        <p class="mb-4 text-sm">
          본인은 다음과 같이 저의 사망 이후 재산을 분배할 것을 유언합니다.
        </p>

        <div class="overflow-x-auto border border-black">
          <table class="w-full table-fixed">
            <thead>
              <tr class="border-b border-black bg-gray-100 text-left">
                <th class="w-1/5 px-4 py-2 font-bold">상속자</th>
                <th class="w-1/5 px-4 py-2 font-bold">자산 종류</th>
                <th class="w-2/5 px-4 py-2 font-bold">자산 이름</th>

                <th class="w-1/5 px-4 py-2 font-bold">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in distributedAssets"
                :key="index"
                class="border-t border-black"
              >
                <td class="px-4 py-2">{{ item.recipient.name }}</td>
                <td class="px-4 py-2">{{ item.category }}</td>
                <td class="px-4 py-2">{{ item.description }}</td>

                <td class="px-4 py-2 text-right">{{
                  formatCurrency(item.amount)
                }}</td>
              </tr>
              <tr v-if="distributedAssets.length === 0">
                <td
                  colspan="4"
                  class="px-4 py-2 text-center text-sm text-gray-500"
                >
                  분배된 자산이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="mb-2 text-base font-bold">추가 유언</h3>
        <div>
          <p class="text-sm whitespace-pre-wrap">
            {{ additionalWillContent || '작성된 추가 유언이 없습니다.' }}
          </p>
        </div>
      </section>

      <section class="border-surface-300 mt-12 border-t pt-4">
        <p class="mb-2 text-center text-sm"
          >작성일자: 서기 {{ formattedDate }}</p
        >
        <p class="text-center text-sm">유언자: {{ testator.name }} (인)</p>
      </section>
    </div>

    <div class="flex flex-col">
      <Btn color="secondary" label="가족에게 공유하기" size="large" />
      <div class="mt-16 flex flex-col">
        <p class="text-primary-300 mb-2 text-center font-semibold">
          궁금한 점이 생기셨다면,<br />
          은행에서 자세히 알려드릴게요
        </p>

        <Btn
          color="primary"
          label="은행 방문 예약하기"
          size="large"
          @click="goToRegister"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/utils/format';
import Btn from '@/components/buttons/Btn.vue';
import { useInheritanceStore } from '@/stores/inheritance';
import { fetchWillTestator } from '@/api/gift/simulation';
import type { TestatorInfo } from '@/types/gift/simulation';

const router = useRouter();
const inheritanceStore = useInheritanceStore();

const testator = ref<TestatorInfo>({ email: '', name: '', birth: '' });

const distributedAssets = computed(() => inheritanceStore.distributedAssets);
const additionalWillContent = computed(
  () => inheritanceStore.additionalWillContent
);

const formattedDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
});

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'inheritance' },
  });
};

onMounted(async () => {
  try {
    const data = await fetchWillTestator();
    testator.value = data;
  } catch (error) {
    console.error('유언자 정보 로드 실패:', error);
  }
});
</script>
