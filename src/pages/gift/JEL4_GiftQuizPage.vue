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

    <div class="border-primary-300 my-16 rounded-lg border bg-white p-4">
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
        <div class="text-surface-500 text-base">
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
              class="text-surface-500 flex justify-between text-base"
            >
              <span>{{ asset.name }}</span>
              <span>{{ formatCurrency(asset.value) }}</span>
            </div>
          </div>
        </div>
        <div class="text-primary-300 text-right text-base">
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
        @click="goToWillForm"
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
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  withDefaults,
  computed,
} from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import AssetCard from './_components/AssetCard.vue';
import TabBtn from '../nohoo/_components/TabBtn.vue';
import { fetchGiftPageData } from '@/api/gift/recipient';
import { formatCurrency } from '@/utils/format';
import { categories, categoryCodeMap } from '@/types/gift/constants';
import { useLoadingStore } from '@/stores/loading';

// 두 스토어를 모두 import
import { useInheritanceStore } from '@/stores/inheritance';
import { useGiftStore } from '@/stores/gift';
import { useSimulationStore } from '@/stores/simulation'; // <-- useSimulationStore 추가

import type { RecipientResponseDto } from '@/types/gift/recipient';

import type {
  Asset,
  Beneficiary,
  DistributedAsset,
} from '@/types/gift/inheritance';

// 새로운 DTO 타입 import
import type {
  RecipientGiftRequestDto,
  CategoryGiftRequestDto,
  SimulationRequestDto,
} from '@/types/gift/simulation';

const props = withDefaults(
  defineProps<{
    mode: 'gift' | 'inheritance';
  }>(),
  {
    mode: 'gift',
  }
);

const router = useRouter();
const loadingStore = useLoadingStore();

// mode에 따라 적절한 스토어를 사용하도록 computed 속성으로 묶음
const giftStore = useGiftStore();
const inheritanceStore = useInheritanceStore();
const simulationStore = useSimulationStore(); //

const store = computed(() => {
  return props.mode === 'gift' ? giftStore : inheritanceStore;
});

const allAssets = reactive<Map<string, Asset[]>>(new Map());
const activeTab = ref('estate');
const beneficiaries = reactive<Beneficiary[]>([]);

const loadAssetsAndBeneficiaries = async () => {
  loadingStore.startLoading();
  try {
    const apiResponse = await fetchGiftPageData(props.mode);
    const recipients: RecipientResponseDto[] = apiResponse.recipients || [];
    const assetCategories = apiResponse.assetCategories || [];

    const newBeneficiaries: Beneficiary[] = recipients.map((recipient) => ({
      id: recipient.recipientId.toString(),
      name: recipient.recipientName,
      relation: recipient.relationship,
    }));

    const newAllAssets = new Map<string, Asset[]>();
    categories.forEach((category) => {
      newAllAssets.set(category.id, []);
    });

    assetCategories.forEach((category: any) => {
      const categoryId = categoryCodeMap[category.assetCategoryCode];
      if (categoryId && category.assets) {
        category.assets.forEach((asset: any) => {
          const newAsset: Asset = {
            id: `${categoryId}-${asset.assetId}`,
            name: asset.assetName,
            value: asset.amount,
            selected: false,
            beneficiary: null,
            isMultipleBeneficiaries: false,
            distributionRatios: {},
          };
          newAllAssets.get(categoryId)?.push(newAsset);
        });
      }
    });

    beneficiaries.splice(0, beneficiaries.length, ...newBeneficiaries);
    allAssets.clear();
    newAllAssets.forEach((value, key) => allAssets.set(key, value));

    // `store.value`를 사용하여 현재 모드의 스토어에 데이터 저장
    if (props.mode === 'gift') {
      (giftStore as ReturnType<typeof useGiftStore>).setInitialData({
        allAssets: newAllAssets,
        beneficiaries: newBeneficiaries,
      });
    } else {
      (
        inheritanceStore as ReturnType<typeof useInheritanceStore>
      ).setInitialData({
        allAssets: newAllAssets,
        beneficiaries: newBeneficiaries,
      });
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  } finally {
    loadingStore.stopLoading();
  }
};

const restoreStateFromStore = () => {
  if (props.mode === 'gift') {
    if (
      (giftStore as ReturnType<typeof useGiftStore>).allAssets.size > 0 &&
      (giftStore as ReturnType<typeof useGiftStore>).beneficiaries.length > 0
    ) {
      beneficiaries.splice(
        0,
        beneficiaries.length,
        ...(giftStore as ReturnType<typeof useGiftStore>).beneficiaries
      );
      allAssets.clear();
      (giftStore as ReturnType<typeof useGiftStore>).allAssets.forEach(
        (value: Asset[], key: string) => {
          allAssets.set(key, value);
        }
      );
    }
  } else {
    if (
      (inheritanceStore as ReturnType<typeof useInheritanceStore>).allAssets
        .size > 0 &&
      (inheritanceStore as ReturnType<typeof useInheritanceStore>).beneficiaries
        .length > 0
    ) {
      beneficiaries.splice(
        0,
        beneficiaries.length,
        ...(inheritanceStore as ReturnType<typeof useInheritanceStore>)
          .beneficiaries
      );
      allAssets.clear();
      (
        inheritanceStore as ReturnType<typeof useInheritanceStore>
      ).allAssets.forEach((value: Asset[], key: string) => {
        allAssets.set(key, value);
      });
    }
  }
};

const onAssetUpdate = (updatedAsset: Asset) => {
  Array.from(allAssets.values()).forEach((assets) => {
    const index = assets.findIndex((a) => a.id === updatedAsset.id);
    if (index !== -1) {
      assets.splice(index, 1, updatedAsset);
    }
  });

  if (props.mode === 'gift') {
    (giftStore as ReturnType<typeof useGiftStore>).setAllAssets(allAssets);
  } else {
    (inheritanceStore as ReturnType<typeof useInheritanceStore>).setAllAssets(
      allAssets
    );
  }
};

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

const createSimulationRequest = (): SimulationRequestDto => {
  return {
    simulationList: beneficiaries
      .map((b) => {
        const giftsForRecipient = Array.from(allAssets.values())
          .flat()
          .filter((asset) => asset.selected)
          .flatMap((asset) => {
            if (asset.beneficiary?.id === b.id) {
              return [{ ...asset, amount: asset.value }];
            }
            if (
              asset.isMultipleBeneficiaries &&
              asset.distributionRatios &&
              asset.distributionRatios[b.id] > 0
            ) {
              return [
                {
                  ...asset,
                  amount: Math.floor(
                    (asset.value * asset.distributionRatios[b.id]) / 100
                  ),
                },
              ];
            }
            return [];
          })
          .reduce((acc, asset) => {
            const categoryId = asset.id.split('-')[0];
            const categoryCode = Object.keys(categoryCodeMap).find(
              (key) => categoryCodeMap[key] === categoryId
            );

            if (!categoryCode) return acc;

            let category = acc.find(
              (c) => c.assetCategoryCode === categoryCode
            );
            if (!category) {
              category = { assetCategoryCode: categoryCode, assets: [] };
              acc.push(category);
            }
            category.assets.push({
              assetId: Number(asset.id.split('-')[1]),
              giftAmount: asset.amount,
            });
            return acc;
          }, [] as CategoryGiftRequestDto[]);

        if (giftsForRecipient.length > 0) {
          return {
            recipientId: Number(b.id),
            categoriesToGift: giftsForRecipient,
          };
        }
        return null;
      })
      .filter(Boolean) as RecipientGiftRequestDto[],
  };
};

const setInheritanceStoreData = () => {
  // 상속 모드일 때 distributedAssets와 recipientSummaries를 스토어에 저장
  const distributed: DistributedAsset[] = [];
  Array.from(allAssets.values())
    .flat()
    .filter(
      (asset) =>
        asset.selected && (asset.beneficiary || asset.isMultipleBeneficiaries)
    ) // Only consider selected assets that have a beneficiary or are for multiple beneficiaries
    .forEach((asset) => {
      const foundCategory = categories.find(
        (c) => c.id === asset.id.split('-')[0]
      );
      const categoryName = foundCategory?.name ?? '기타';

      if (asset.isMultipleBeneficiaries && asset.distributionRatios) {
        // Handle multiple beneficiaries
        for (const beneficiaryId in asset.distributionRatios) {
          const ratio = asset.distributionRatios[beneficiaryId];
          if (ratio > 0) {
            const foundRecipient = beneficiaries.find(
              (b) => b.id === beneficiaryId
            );
            if (foundRecipient) {
              distributed.push({
                recipient: {
                  name: foundRecipient.name,
                  relation: foundRecipient.relation,
                },
                category: categoryName,
                description: `${asset.name} (지분 ${ratio}%)`, // Add ratio to description
                amount: Math.floor((asset.value * ratio) / 100),
              });
            }
          }
        }
      } else if (asset.beneficiary) {
        // Handle single beneficiary
        const currentBeneficiary = asset.beneficiary; // Type narrowing
        const foundRecipient = beneficiaries.find(
          (b) => b.id === currentBeneficiary.id
        );
        if (foundRecipient) {
          distributed.push({
            recipient: {
              name: foundRecipient.name,
              relation: foundRecipient.relation,
            },
            category: categoryName,
            description: asset.name,
            amount: asset.value,
          });
        }
      }
    });

  const recipientSummary = beneficiaries.map((b) => ({
    recipientId: Number(b.id),
    name: b.name,
    giftAmount: calculateTotalForBeneficiary(b.id),
    estimatedTax: 0, // 상속세는 여기서 계산하지 않으므로 0으로 설정
  }));

  inheritanceStore.setInheritanceData({
    distributedAssets: distributed,
    recipientSummaries: recipientSummary,
    totalGiftTax: 0, // 상속세는 여기서 계산하지 않으므로 0으로 설정
  });
};

const goToWillForm = () => {
  setInheritanceStoreData(); // 데이터 저장 함수 호출
  router.push({
    name: 'inheritance-will',
  });
};

const goToResult = async () => {
  loadingStore.startLoading();
  try {
    if (props.mode === 'gift') {
      const requestDto = createSimulationRequest();
      await simulationStore.simulateGiftTax(requestDto);
    } else if (props.mode === 'inheritance') {
      // '바로 유언장 보러가기'를 눌렀을 때 추가 유언을 무시하고 초기화
      inheritanceStore.setAdditionalWillContent('');

      // 상속 모드일 때 distributedAssets와 recipientSummaries를 스토어에 저장
      const distributed: DistributedAsset[] = [];
      Array.from(allAssets.values())
        .flat()
        .filter(
          (asset) =>
            asset.selected &&
            (asset.beneficiary || asset.isMultipleBeneficiaries)
        ) // Only consider selected assets that have a beneficiary or are for multiple beneficiaries
        .forEach((asset) => {
          const foundCategory = categories.find(
            (c) => c.id === asset.id.split('-')[0]
          );
          const categoryName = foundCategory?.name ?? '기타';

          if (asset.isMultipleBeneficiaries && asset.distributionRatios) {
            // Handle multiple beneficiaries
            for (const beneficiaryId in asset.distributionRatios) {
              const ratio = asset.distributionRatios[beneficiaryId];
              if (ratio > 0) {
                const foundRecipient = beneficiaries.find(
                  (b) => b.id === beneficiaryId
                );
                if (foundRecipient) {
                  distributed.push({
                    recipient: {
                      name: foundRecipient.name,
                      relation: foundRecipient.relation,
                    },
                    category: categoryName,
                    description: `${asset.name} (지분 ${ratio}%)`, // Add ratio to description
                    amount: Math.floor((asset.value * ratio) / 100),
                  });
                }
              }
            }
          } else if (asset.beneficiary) {
            // Handle single beneficiary
            const currentBeneficiary = asset.beneficiary; // Type narrowing
            const foundRecipient = beneficiaries.find(
              (b) => b.id === currentBeneficiary.id
            );
            if (foundRecipient) {
              distributed.push({
                recipient: {
                  name: foundRecipient.name,
                  relation: foundRecipient.relation,
                },
                category: categoryName,
                description: asset.name,
                amount: asset.value,
              });
            }
          }
        });

      const recipientSummary = beneficiaries.map((b) => ({
        recipientId: Number(b.id),
        name: b.name,
        giftAmount: calculateTotalForBeneficiary(b.id),
        estimatedTax: 0, // 상속세는 여기서 계산하지 않으므로 0으로 설정
      }));

      inheritanceStore.setInheritanceData({
        distributedAssets: distributed,
        recipientSummaries: recipientSummary,
        totalGiftTax: 0, // 상속세는 여기서 계산하지 않으므로 0으로 설정
      });
    }

    router.push({
      name: props.mode === 'gift' ? 'gift-result' : 'inheritance-result',
    });
  } catch (error) {
    console.error('시뮬레이션 실패:', error);
  } finally {
    loadingStore.stopLoading();
  }
};

onMounted(() => {
  // `store.value`를 사용하여 데이터 존재 여부 확인
  if (store.value.allAssets.size > 0) {
    restoreStateFromStore();
  } else {
    loadAssetsAndBeneficiaries();
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
