<template>
  <h2 class="text-primary-500 mb-2 text-2xl font-bold"
    >수증할 자산을 선택해주세요</h2
  >
  <p class="text-primary-500 mb-4 text-base"
    >등록하신 수증자 중 선택하실 수 있습니다.<br />한 자산을 여러명에게 나눠서
    분배도 가능합니다.</p
  >
  <div class="mb-16 space-y-4">
    <template v-for="category in categories" :key="category.id">
      <AssetCard
        v-for="asset in allAssets.get(category.id) || []"
        :key="asset.id"
        :asset="asset"
        :category="category"
        :beneficiaries="beneficiaries"
        :mode="mode"
        @update-asset="onAssetUpdate"
      />
    </template>
  </div>

  <div class="text-primary-500 mb-4 text-2xl font-bold">
    {{
      mode === 'gift' ? '수증자별 증여 자산 요약' : '상속인별 상속 자산 요약'
    }}
  </div>
  <div class="space-y-4">
    <!-- 수증자별 자산 카드 -->
    <div
      v-for="beneficiary in beneficiaries"
      :key="beneficiary.id"
      class="card-design bg-primary-100"
    >
      <!-- 수증자 정보 헤더 -->
      <div class="flex items-center justify-between pb-4">
        <span class="text-primary-500 text-base font-semibold">{{
          beneficiary.name
        }}</span>
        <span class="text-primary-500 text-base font-semibold">{{
          formatCurrency(calculateTotalForBeneficiary(beneficiary.id))
        }}</span>
      </div>

      <!-- 자산 목록 -->
      <div class="space-y-1 pl-2">
        <div
          v-for="asset in getAssetsForBeneficiary(beneficiary.id)"
          :key="asset.id"
          class="text-primary-500 flex justify-between text-base"
        >
          <span
            >{{ asset.name }}
            <span v-if="(asset as any).stake" class="text-gold font-semibold">
              (지분 {{ (asset as any).stake }}%)
            </span>
          </span>
          <span>{{ formatCurrency(asset.value) }}</span>
        </div>
      </div>
    </div>

    <!-- 총계 -->
    <div class="mb-4 text-center">
      <span class="text-primary-300 text-base font-semibold">
        {{ mode === 'gift' ? '총 증여 자산' : '총 상속 자산' }}:
        {{ formatCurrency(calculateGrandTotal()) }}
      </span>
    </div>
  </div>

  <div
    v-if="mode === 'inheritance'"
    class="flex w-full max-w-[600px] flex-col space-y-2"
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
  <div v-else class="w-full max-w-[600px]">
    <Btn
      color="primary"
      label="세액 및 절세 전략 확인하기"
      size="large"
      @click="goToResult"
    />
  </div>

  <!-- 에러 알림 모달 -->
  <Alert v-if="showAlert" @click="showAlert = false">
    <p class="text-center">{{ alertMessage }}</p>
  </Alert>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, withDefaults, computed } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import AssetCard from './_components/AssetCard.vue';
import Alert from '@/components/modals/Alert.vue';
import { fetchGiftPageData } from '@/api/gift/recipient';
import { formatCurrency } from '@/utils/format';
import { categories, categoryCodeMap } from '@/types/gift/constants';
import { useLoadingStore } from '@/stores/loading';
import { useInheritanceStore } from '@/stores/inheritance';
import { useGiftStore } from '@/stores/gift';
import { useSimulationStore } from '@/stores/simulation';
import type { RecipientResponseDto } from '@/types/gift/recipient';
import type {
  Asset,
  Beneficiary,
  DistributedAsset,
} from '@/types/gift/inheritance';
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
const giftStore = useGiftStore();
const inheritanceStore = useInheritanceStore();
const simulationStore = useSimulationStore();

const store = computed(() => {
  return props.mode === 'gift' ? giftStore : inheritanceStore;
});

const allAssets = reactive<Map<string, Asset[]>>(new Map());
const beneficiaries = reactive<Beneficiary[]>([]);
const showAlert = ref(false);
const alertMessage = ref('');

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

    store.value.setInitialData({
      allAssets: newAllAssets,
      beneficiaries: newBeneficiaries,
    });
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    alertMessage.value = '데이터를 불러오는 데 실패했습니다.';
    showAlert.value = true;
  } finally {
    loadingStore.stopLoading();
  }
};

const restoreStateFromStore = () => {
  if (store.value.allAssets.size > 0 && store.value.beneficiaries.length > 0) {
    beneficiaries.splice(0, beneficiaries.length, ...store.value.beneficiaries);
    allAssets.clear();
    store.value.allAssets.forEach((value: Asset[], key: string) => {
      allAssets.set(key, value);
    });
  }
};

onMounted(() => {
  if (store.value.allAssets.size > 0) {
    restoreStateFromStore();
  } else {
    loadAssetsAndBeneficiaries();
  }
});

const onAssetUpdate = (updatedAsset: Asset) => {
  Array.from(allAssets.values()).forEach((assets) => {
    const index = assets.findIndex((a) => a.id === updatedAsset.id);
    if (index !== -1) {
      assets.splice(index, 1, updatedAsset);
    }
  });
  store.value.setAllAssets(allAssets);
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
  const assets: (Asset & { stake?: number })[] = [];
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
            stake: asset.distributionRatios[beneficiaryId],
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

// 상속 데이터 준비 로직 추출
const prepareInheritanceData = () => {
  const distributed: DistributedAsset[] = [];
  Array.from(allAssets.values())
    .flat()
    .filter(
      (asset) =>
        asset.selected && (asset.beneficiary || asset.isMultipleBeneficiaries)
    )
    .forEach((asset) => {
      const foundCategory = categories.find(
        (c) => c.id === asset.id.split('-')[0]
      );
      const categoryName = foundCategory?.name ?? '기타';

      if (asset.isMultipleBeneficiaries && asset.distributionRatios) {
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
                description: `${asset.name} (지분 ${ratio}%)`,
                amount: Math.floor((asset.value * ratio) / 100),
              });
            }
          }
        }
      } else if (asset.beneficiary) {
        const foundRecipient = beneficiaries.find(
          (b) => b.id === asset.beneficiary!.id
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

  const recipientSummaries = beneficiaries.map((b) => ({
    recipientId: Number(b.id),
    name: b.name,
    giftAmount: calculateTotalForBeneficiary(b.id),
    estimatedTax: 0,
  }));

  return {
    distributedAssets: distributed,
    recipientSummaries,
    totalGiftTax: 0,
  };
};

const setInheritanceStoreData = () => {
  const inheritanceData = prepareInheritanceData();
  inheritanceStore.setInheritanceData(inheritanceData);
};

const goToWillForm = () => {
  setInheritanceStoreData();
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
      inheritanceStore.setAdditionalWillContent('');
      const inheritanceData = prepareInheritanceData();
      inheritanceStore.setInheritanceData(inheritanceData);
    }

    router.push({
      name: props.mode === 'gift' ? 'gift-result' : 'inheritance-result',
    });
  } catch (error) {
    console.error('시뮬레이션 실패:', error);
    alertMessage.value = '결과를 계산하는 데 실패했습니다.';
    showAlert.value = true;
  } finally {
    loadingStore.stopLoading();
  }
};
</script>
