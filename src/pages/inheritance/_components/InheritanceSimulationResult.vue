<template>
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
      <p class="mb-2 text-center text-sm">작성일자: 서기 {{ formattedDate }}</p>
      <p class="text-center text-sm">유언자: {{ testator.name }} (인)</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { formatCurrency } from '@/utils/format';
import type { TestatorInfo } from '@/types/gift/simulation';

defineProps<{
  testator: TestatorInfo;
  distributedAssets: any[];
  additionalWillContent: string;
  formattedDate: string;
}>();
</script>
