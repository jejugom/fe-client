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
        class="py-8"
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
      <template v-if="mode === 'gift'">
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
      </template>

      <template v-else-if="mode === 'inheritance'">
        <div class="text-primary-300 mb-4 text-lg font-semibold">
          상속인별 상속 자산 요약
        </div>
        <div
          v-for="beneficiary in beneficiaries"
          :key="beneficiary.id"
          class="border-primary-100 mb-4 border-b pb-2 last:mb-0 last:border-b-0"
        >
          <div class="mb-2 flex items-center justify-between">
            <div class="text-primary-500 text-base font-semibold">
              {{ beneficiary.name }}
            </div>
            <div class="text-primary-500 text-base font-semibold">
              {{ formatCurrency(calculateTotalForBeneficiary(beneficiary.id)) }}
            </div>
          </div>
          <div class="pl-2">
            <div
              v-for="asset in getAssetsForBeneficiary(beneficiary.id)"
              :key="asset.id"
              class="text-surface-500 flex justify-between text-sm"
            >
              <span>{{ asset.name }}</span>
              <span>{{ formatCurrency(asset.value) }}</span>
            </div>
          </div>
        </div>
        <div class="text-primary-300 text-right text-sm">
          총 상속 자산: {{ formatCurrency(calculateGrandTotal()) }}
        </div>
      </template>
    </div>

    <div
      v-if="mode === 'inheritance'"
      class="flex w-full max-w-150 flex-col space-y-2"
    >
      <Btn
        color="primary"
        label="추가 유언 작성하기"
        size="large"
        @click="goToWill"
      />
      <Btn
        color="surface"
        label="바로 유언장 보러가기"
        size="large"
        @click="goToResult"
      />
    </div>
    <div v-else class="w-full max-w-150">
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
import { ref, reactive, onMounted, onUnmounted, withDefaults } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import AssetCard from './_components/AssetCard.vue';
import TabBtn from '../nohoo/_components/TabBtn.vue';
import { fetchGiftPageData } from '@/api/gift/recipient';
import { formatCurrency } from '@/utils/format';

// types/gift/recipient.ts에서 필요한 타입들을 직접 임포트합니다.
import type {
  AssetStatusSummaryDto,
  RecipientResponseDto,
} from '@/types/gift/recipient';

// 타입 정의
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

const props = withDefaults(
  defineProps<{
    mode: 'gift' | 'inheritance';
  }>(),
  {
    mode: 'gift',
  }
);

const router = useRouter();

// 카테고리 설정
const categories: Category[] = [
  { id: 'estate', name: '부동산' },
  { id: 'deposits', name: '예금/적금' },
  { id: 'cash', name: '현금' },
  { id: 'stocks', name: '주식/펀드' },
  { id: 'business', name: '사업체/지분' },
  { id: 'etc', name: '기타' },
];

// 자산 카테고리 코드(숫자)를 카테고리 ID(문자열)로 매핑
const categoryCodeMap: { [key: string]: string } = {
  '1': 'estate',
  '2': 'deposits',
  '3': 'cash',
  '4': 'stocks',
  '5': 'business',
  '6': 'etc',
};

// 상태 관리
const allAssets = reactive<Map<string, Asset[]>>(new Map());
const activeTab = ref('estate');
const beneficiaries = reactive<Beneficiary[]>([]);

// 자산과 수증자 데이터 로드
const loadAssetsAndBeneficiaries = async () => {
  try {
    const apiResponse = await fetchGiftPageData();
    const recipients: RecipientResponseDto[] = apiResponse.recipients;
    const assetSummary: AssetStatusSummaryDto[] = apiResponse.assetSummary;

    // 수증자/상속인 목록 업데이트
    beneficiaries.splice(
      0,
      beneficiaries.length,
      ...recipients.map((recipient) => ({
        id: recipient.recipientId.toString(),
        name: recipient.recipientName,
        relation: recipient.relationship,
      }))
    );

    // allAssets Map 초기화
    allAssets.clear();
    categories.forEach((category) => {
      allAssets.set(category.id, []);
    });

    // 백엔드 필드 수정 요청하기 -> name만 수정
    assetSummary.forEach((summaryItem, index) => {
      const categoryId = categoryCodeMap[summaryItem.assetCategoryCode];
      if (categoryId) {
        const newAsset: Asset = {
          id: `${categoryId}-${index}`,
          name: `${categories.find((c) => c.id === categoryId)?.name || ''} 자산`,
          value: summaryItem.amount,
          selected: false,
          beneficiary: null,
          isMultipleBeneficiaries: false,
          distributionRatios: {},
        };
        allAssets.get(categoryId)?.push(newAsset);
      }
    });
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
};

// 자산 업데이트 핸들러
const onAssetUpdate = (updatedAsset: Asset) => {
  Array.from(allAssets.values()).forEach((assets) => {
    const index = assets.findIndex((a) => a.id === updatedAsset.id);
    if (index !== -1) {
      assets.splice(index, 1, updatedAsset);
    }
  });
};

// 수증자/상속인별 총 금액 계산
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

// 특정 상속인에게 할당된 자산 목록 반환
const getAssetsForBeneficiary = (beneficiaryId: string) => {
  const assets: Asset[] = [];
  Array.from(allAssets.values())
    .flat()
    .forEach((asset) => {
      if (asset.selected) {
        if (asset.beneficiary?.id === beneficiaryId) {
          assets.push(asset);
        } else if (
          asset.isMultipleBeneficiaries &&
          asset.distributionRatios &&
          asset.distributionRatios[beneficiaryId] > 0
        ) {
          // 비율로 나눈 자산도 목록에 추가 (예: "부동산 자산 (지분 50%)")
          assets.push({
            ...asset,
            name: `${asset.name} (지분 ${asset.distributionRatios[beneficiaryId]}%)`,
            value: Math.floor(
              (asset.value * (asset.distributionRatios[beneficiaryId] || 0)) /
                100
            ),
          });
        }
      }
    });
  return assets;
};

// 총 증여/상속 금액 계산
const calculateGrandTotal = (): number => {
  return Array.from(allAssets.values())
    .flat()
    .filter((asset) => asset.selected)
    .reduce((sum, asset) => sum + asset.value, 0);
};

// 탭 스크롤 처리
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    activeTab.value = sectionId;
  }
};

// 스크롤 시 활성 탭 업데이트
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

// 결과 페이지로 이동
const goToResult = () => {
  const recipientSummaries = beneficiaries.map((beneficiary) => {
    const giftAmount = calculateTotalForBeneficiary(beneficiary.id);
    return {
      name: beneficiary.name,
      giftAmount: giftAmount,
      estimatedTax: 0,
    };
  });

  // 총 세금도 임시 값
  const totalGiftTax = 0;

  router.push({
    name: props.mode === 'gift' ? 'gift-result' : 'inheritance-result',
    state: {
      recipientSummaries: recipientSummaries,
      totalGiftTax: totalGiftTax,
      mode: props.mode,
    },
  });
};

// 유언 페이지로 이동
const goToWill = () => {
  router.push({
    name: 'inheritance-will',
    state: {
      beneficiaries: beneficiaries,
    },
  });
};

// 생명주기 훅
onMounted(() => {
  loadAssetsAndBeneficiaries();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
