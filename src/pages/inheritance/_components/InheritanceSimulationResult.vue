<template>
  <div class="border-surface-300 mb-4 border p-6">
    <div class="border-surface-300 mb-8 border-b pb-2">
      <h2 class="text-center text-base font-bold">유언장</h2>
    </div>

    <section class="mb-8">
      <ul class="space-y-1 text-base">
        <li><strong>유언자 성명:</strong> {{ testator.name }}</li>
        <li><strong>생년월일:</strong> {{ testator.birth }}</li>
        <li><strong>이메일:</strong> {{ testator.email }}</li>
      </ul>
    </section>

    <section class="mb-8">
      <h3 class="mb-2 text-base"><strong>유언 사항</strong></h3>
      <p class="mb-4 text-base">
        본인은 다음과 같이 저의 사망 이후 재산을 분배할 것을 유언합니다.
      </p>

      <div
        v-if="groupedAssets.length === 0"
        class="py-4 text-center text-base text-gray-500"
      >
        분배된 자산이 없습니다.
      </div>

      <div
        v-for="(group, groupIndex) in groupedAssets"
        :key="groupIndex"
        class="mb-6 last:mb-0"
      >
        <h4
          class="mb-2 flex items-center justify-between text-base font-semibold"
        >
          <span>{{ groupIndex + 1 }}. {{ group.recipientName }}</span>
          <span class="text-surface-600 text-base"
            >관계: {{ group.recipientRelation }}</span
          >
        </h4>
        <div class="border-surface-200 overflow-x-auto border">
          <table class="w-full">
            <thead>
              <tr>
                <th class="border-surface-300 border px-4 py-2 text-xs"
                  >자산 종류</th
                >
                <th class="border-surface-300 border px-4 py-2 text-xs"
                  >자산 이름</th
                >
                <th class="border-surface-300 border px-4 py-2 text-xs"
                  >금액</th
                >
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in group.assets" :key="itemIndex">
                <td
                  class="border-surface-300 border px-4 py-2 text-center text-xs"
                  >{{ item.category }}</td
                >
                <td
                  class="border-surface-300 border px-4 py-2 text-center text-xs"
                  >{{ item.description }}</td
                >
                <td
                  class="border-surface-300 border px-4 py-2 text-center text-xs"
                  >{{ formatCurrency(item.amount) }}</td
                >
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section v-if="additionalWillContent" class="mb-8">
      <h3 class="mb-2 text-base"><strong>추가 유언</strong></h3>
      <div>
        <div class="w-full text-base">
          {{ additionalWillContent }}
        </div>
      </div>
    </section>

    <section class="border-surface-300 mt-12 border-t pt-4">
      <p class="text- mb-2 text-center">작성일자: 서기 {{ formattedDate }}</p>
      <p class="text-center text-base">유언자: {{ testator.name }} (인)</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { formatCurrency } from '@/utils/format';
import type { TestatorInfo } from '@/types/gift/simulation';
import type { DistributedAsset } from '@/types/gift/inheritance';

const props = defineProps<{
  testator: TestatorInfo;
  distributedAssets: DistributedAsset[];
  additionalWillContent: string;
  formattedDate: string;
}>();

defineEmits(['update:additionalWillContent']);

const groupedAssets = computed(() => {
  const groups: {
    recipientName: string;
    recipientRelation: string;
    assets: DistributedAsset[];
  }[] = [];
  const recipientMap = new Map<
    string,
    {
      recipientName: string;
      recipientRelation: string;
      assets: DistributedAsset[];
    }
  >();

  props.distributedAssets.forEach((asset) => {
    const recipientName = asset.recipient.name;
    const recipientRelation = asset.recipient.relation;
    if (!recipientMap.has(recipientName)) {
      recipientMap.set(recipientName, {
        recipientName,
        recipientRelation,
        assets: [],
      });
    }
    recipientMap.get(recipientName)?.assets.push(asset);
  });

  recipientMap.forEach((group) => {
    groups.push(group);
  });

  return groups;
});
</script>
