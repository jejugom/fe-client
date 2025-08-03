<template>
  <div class="min-h-screen">
    <div
      class="fixed top-[calc(4rem)] left-1/2 z-20 box-border w-full max-w-150 -translate-x-1/2 bg-white px-5 pt-4"
    >
      <div class="flex gap-2 overflow-x-auto">
        <TabBtn
          v-for="category in categories"
          :key="category.id"
          :class="{
            'bg-primary-100 border-primary-100': activeTab === category.id,
            'border-surface-200 border': activeTab !== category.id,
          }"
          @click="scrollToSection(category.id)"
        >
          <img
            :src="`/src/assets/images/${category.id}.svg`"
            :alt="category.name"
            class="h-6 w-6"
          />
        </TabBtn>
      </div>
      <div class="bg-surface-200 h-0.5 w-full" />
    </div>

    <div>
      <section
        v-for="category in categories"
        :key="category.id"
        :id="category.id"
        :class="{
          'py-8': true,
        }"
        :style="{ 'scroll-margin-top': '128px' }"
      >
        <h2 class="text-primary-300 mb-4 text-xl font-bold">
          {{ category.name }}
        </h2>

        <div class="space-y-4">
          <AssetCard
            v-for="asset in allAssets.get(category.id) || []"
            :key="asset.id"
            :asset="asset"
            :beneficiaries="beneficiaries"
            @update-asset="onAssetUpdate"
          />
        </div>
      </section>
    </div>

    <div class="border-primary-300 my-16 rounded-xl border bg-white p-4">
      <div class="text-primary-300 mb-2 text-lg font-semibold">
        수증자별 증여 금액
      </div>
      <div
        v-for="beneficiary in beneficiaries"
        :key="beneficiary.id"
        class="mb-2"
      >
        <span class="font-medium">{{ beneficiary.name }}: </span>
        <span>
          {{ formatCurrency(calculateTotalForBeneficiary(beneficiary.id)) }}
        </span>
      </div>
      <div class="text-surface-500 text-sm">
        총 증여 금액: {{ formatCurrency(calculateGrandTotal()) }}
      </div>
    </div>

    <div class="w-full max-w-150">
      <Btn
        color="primary"
        label="세액 및 절세 전략 확인하기"
        size="large"
        @click="goToResult"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { api_data } from '@/api/gift/giftAssets';
import { dummyRecipients } from './_inputDummy';
import Btn from '@/components/buttons/Btn.vue';

import AssetCard from './_components/\bAssetCard.vue';
import TabBtn from '../nohoo/_components/TabBtn.vue';
import { useRouter } from 'vue-router';

import { formatCurrency } from '@/utils/format';
const router = useRouter();

interface Asset {
  id: string;
  name: string;
  value: number;
  selected: boolean;
  beneficiary?: Beneficiary | null;
  isMultipleBeneficiaries?: boolean;
  distributionRatios?: { [beneficiaryId: string]: number };
  [key: string]: any;
}

interface Beneficiary {
  id: string;
  name: string;
  relation: string;
}

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: 'estate', name: '부동산' },
  { id: 'deposits', name: '예금/적금' },
  { id: 'cash', name: '현금' },
  { id: 'stocks', name: '주식/펀드' },
  { id: 'business', name: '사업체/지분' },
  { id: 'etc', name: '기타' },
];

const allAssets = reactive<Map<string, Asset[]>>(new Map());
const activeTab = ref('estate');
const beneficiaries = reactive<Beneficiary[]>([]);

const loadAssetsAndBeneficiaries = () => {
  api_data.category_summary.forEach((category) => {
    let categoryId = '';
    switch (category.category_name) {
      case '부동산':
        categoryId = 'estate';
        break;
      case '예·적금':
        categoryId = 'deposits';
        break;
      case '현금':
        categoryId = 'cash';
        break;
      case '주식·펀드':
        categoryId = 'stocks';
        break;
      case '사업체·지분':
        categoryId = 'business';
        break;
      case '기타':
        categoryId = 'etc';
        break;
      default:
        return;
    }

    const mappedAssets: Asset[] = category.asset_list.map((asset) => ({
      id: asset.asset_id,
      name: asset.asset_name,
      value: asset.asset_amount,
      selected: asset.checked,
      beneficiary: null,
      isMultipleBeneficiaries: false,
      distributionRatios: {},
    }));

    allAssets.set(categoryId, mappedAssets);
  });

  beneficiaries.push(
    ...dummyRecipients.map((recipient, index) => ({
      id: `beneficiary-${index}`,
      name: recipient.name,
      relation: recipient.relationship,
    }))
  );
};

// 자산 선택/해제 함수
// const toggleAssetSelection = (asset: Asset, checked: boolean) => {
//   asset.selected = checked;
// };

// 자산 업데이트 핸들러
const onAssetUpdate = (updatedAsset: Asset) => {
  // 업데이트된 자산을 찾아 반영
  Array.from(allAssets.values()).forEach((assets) => {
    const index = assets.findIndex((a) => a.id === updatedAsset.id);
    if (index !== -1) {
      // Vue의 반응성을 유지하기 위해 직접 교체합니다.
      assets.splice(index, 1, updatedAsset);
    }
  });
};

// 수증자별 총 금액 계산
const calculateTotalForBeneficiary = (beneficiaryId: string): number => {
  let total = 0;

  Array.from(allAssets.values())
    .flat()
    .forEach((asset) => {
      if (asset.selected) {
        if (asset.beneficiary?.id === beneficiaryId) {
          total += asset.value;
        } else if (asset.isMultipleBeneficiaries && asset.distributionRatios) {
          const ratio = asset.distributionRatios[beneficiaryId] || 0;
          total += Math.floor((asset.value * ratio) / 100);
        }
      }
    });

  return total;
};

// 총 증여 금액 계산
const calculateGrandTotal = (): number => {
  return Array.from(allAssets.values())
    .flat()
    .filter((asset) => asset.selected)
    .reduce((sum, asset) => sum + asset.value, 0);
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    activeTab.value = sectionId;
  }
};

const handleScroll = () => {
  const sections = categories
    .map((cat) => document.getElementById(cat.id))
    .filter(Boolean);
  const scrollPosition = window.scrollY + 160;

  for (const section of sections) {
    if (
      section &&
      section.offsetTop <= scrollPosition &&
      section.offsetTop + section.offsetHeight > scrollPosition
    ) {
      activeTab.value = section.id;
      break;
    }
  }
};

const goToResult = () => {
  console.log('결과 페이지로 이동');
  router.push({ name: 'gift-result' });
};

onMounted(() => {
  loadAssetsAndBeneficiaries();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
