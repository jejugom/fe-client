<template>
  <div class="border-surface-300 mb-4 border p-6">
    <div class="border-surface-300 mb-8 border-b pb-2">
      <h2 class="text-center text-2xl font-bold">유언장</h2>
    </div>

    <section class="mb-16">
      <div class="grid grid-cols-[3rem_4rem_1fr] gap-y-2 text-base">
        <!-- 첫 번째 줄 -->
        <div class="text-start font-semibold">유언자</div>
        <div class="flex w-full justify-between font-semibold">
          <span>성</span>
          <span>명 :</span>
        </div>
        <div class="ml-2">{{ testator.name }}</div>

        <!-- 두 번째 줄 -->
        <div></div>
        <div class="text-end font-semibold">생년월일 :</div>
        <div class="ml-2">
          {{
            testator.birth
              ? `${testator.birth.split('-')[0]}년 ${testator.birth.split('-')[1]}월 ${testator.birth.split('-')[2]}일`
              : ''
          }}</div
        >

        <!-- 세 번째 줄 -->
        <div></div>
        <div class="flex w-full justify-between font-semibold">
          <span>이</span>
          <span>메</span>
          <span>일 :</span>
        </div>
        <div class="ml-2">{{ testator.email }}</div>
      </div>
    </section>

    <section class="mb-16">
      <h3 class="mb-2"><span class="font-semibold">유언 사항</span></h3>
      <p class="mb-16">
        {{ testator.name }}은(는) 그의 소유인 아래와 같은 재산을 다음의 사람에게
        증여합니다.
      </p>

      <div
        v-if="groupedAssets.length === 0"
        class="text-surface-300 py-4 text-center"
      >
        분배된 자산이 없습니다.
      </div>

      <h2 class="mb-4 text-center text-lg font-bold">- 다음 -</h2>
      <div
        v-for="(group, groupIndex) in groupedAssets"
        :key="groupIndex"
        class="mb-8 last:mb-0"
      >
        <h4 class="mb-2 flex items-center justify-between font-semibold">
          <span>{{ groupIndex + 1 }}. {{ group.recipientName }}</span>
          <span class="text-surface-600"
            >관계: {{ group.recipientRelation }}</span
          >
        </h4>

        <table class="w-full">
          <thead>
            <tr>
              <th class="border-surface-300 border px-4 py-2 text-sm"
                >자산 종류</th
              >
              <th class="border-surface-300 border px-4 py-2 text-sm"
                >자산 이름</th
              >
              <th class="border-surface-300 border px-4 py-2 text-sm">금액</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in group.assets" :key="itemIndex">
              <td
                class="border-surface-300 border px-4 py-2 text-center text-sm"
                >{{ item.category }}</td
              >
              <td
                class="border-surface-300 border px-4 py-2 text-center text-sm"
                >{{ item.description }}</td
              >
              <td
                class="border-surface-300 border px-4 py-2 text-center text-sm"
                >{{ formatCurrency(item.amount) }}</td
              >
            </tr>
          </tbody>
        </table>
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
