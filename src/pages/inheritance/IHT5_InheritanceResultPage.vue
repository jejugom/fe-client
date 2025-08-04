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
          <li><strong>유언자 </strong> 홍길동</li>
          <li><strong>생년월일:</strong> 1950년 5월 1일</li>
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
                <th class="w-1/5 px-4 py-2 font-bold">자산 종류</th>
                <th class="w-2/5 px-4 py-2 font-bold">자산 설명</th>
                <th class="w-1/5 px-4 py-2 font-bold">상속자</th>
                <th class="w-1/5 px-4 py-2 font-bold">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in distributedAssets"
                :key="index"
                class="border-t border-black"
              >
                <td class="px-4 py-2">{{ item.category }}</td>
                <td class="px-4 py-2">{{ item.description }}</td>
                <td class="px-4 py-2">{{ item.recipient.name }}</td>
                <td class="px-4 py-2 text-right">{{
                  formatCurrency(item.amount)
                }}</td>
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
        <p class="text-center text-sm">유언자: 홍길동 (인)</p>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/utils/format';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'inheritance' },
  });
};

interface DistributedAsset {
  category: string;
  description: string;
  recipient: {
    name: string;
    relation: string;
  };
  amount: number;
}

const distributedAssets = ref<DistributedAsset[]>([]);
const additionalWillContent = ref<string>('');

const formattedDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
});

onMounted(() => {
  const state = window.history.state as any;

  const tempAssets: DistributedAsset[] = [
    {
      category: '예금',
      description: 'KB국민은행 예금',
      recipient: { name: '홍철수', relation: '자녀' },
      amount: 50000000,
    },
    {
      category: '부동산',
      description: '○○빌라',
      recipient: { name: '김미희', relation: '배우자' },
      amount: 50000000,
    },
    // 상속자-관계가 별도로 표시되지 않아, 테이블에서 관계 필드를 제거했습니다.
    // 만약 필요하다면, table과 DistributedAsset 인터페이스를 수정해주세요.
  ];
  distributedAssets.value = tempAssets;

  if (state && state.additionalWillContent) {
    additionalWillContent.value = state.additionalWillContent;
  }
});
</script>
