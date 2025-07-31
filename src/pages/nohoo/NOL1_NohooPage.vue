<template>
  <div class="flex flex-col gap-8">
    <TabBtnGroup
      :tabs="['맞춤', '예금', '적금', '펀드', '금', '주택담보']"
      v-model:selectedTab="selectedTab"
    />

    <AdBox
      :selectedTab="selectedTab"
      :userName="userName"
      :assetAmount="totalAsset"
      :assetSummary="assetSummary"
    />
    <div v-if="selectedTab !== '금'" class="flex justify-end">
      <SelectBox size="small" v-model="sortOption">
        <option value="name">상품명순</option>
        <option v-if="selectedTab === '맞춤'" value="score">맞춤점수순</option>
        <option
          v-if="selectedTab === '예금' || selectedTab === '적금'"
          value="rate"
          >최고금리순</option
        >
        <option v-if="selectedTab === '주택담보'" value="rate"
          >최저금리순</option
        >
        <option v-if="selectedTab === '펀드'" value="rate">최고수익률순</option>
      </SelectBox>
    </div>

    <div class="flex flex-col gap-4">
      <div
        v-if="selectedTab !== '맞춤' && filteredProducts.length === 0"
        class="text-surface-400 text-center text-base"
      >
        찾으신 조건으로는 상품이 아직 준비 중이에요!<br />조건을 조금
        바꿔보시겠어요?
      </div>
      <div
        v-if="selectedTab === '맞춤'"
        class="text-primary-300 text-2xl font-semibold"
      >
        {{ userName }}님께 딱 맞는 상품만 보여드릴게요
      </div>
      <BtnCard
        v-for="product in selectedTab === '맞춤'
          ? recommendedProducts
          : filteredProducts"
        :key="product.finPrdtCd"
        :title="product.finPrdtNm"
        :content="product.prdtFeature"
        :tags="product.tags"
        btnText="자세히 보기"
        color="primary"
        @click="goToDetail(product.finPrdtCd)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TabBtnGroup from './_components/TabBtnGroup.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import AdBox from './_components/AdBox.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import { useProductStore } from '@/stores/product';
import { fetchNohooData, type ParsedApiResponse } from '@/api/nohoo/nohoo';

const router = useRouter();
const productStore = useProductStore();
// 실제 환경에서는 .env 파일에 토큰을 저장하고 가져와야 합니다.
const token = import.meta.env.VITE_ACCESS_TOKEN;

const data = ref<ParsedApiResponse | null>(null);
const selectedTab = ref('맞춤');
const sortOption = ref('name');

onMounted(async () => {
  try {
    const result = await fetchNohooData(token);
    data.value = result;

    // API 응답 데이터를 store에 저장할 형식으로 매핑
    productStore.setAllProducts({
      timeDeposits: result.timeDeposits.map((p) => ({
        ...p,
        finPrdtCategory: '1', // 예금 카테고리
      })),
      savingsDeposits: result.savingsDeposits.map((p) => ({
        ...p,
        finPrdtCategory: '2', // 적금 카테고리
      })),
      mortgageLoan: result.mortgageLoan.map((p) => ({
        ...p,
        finPrdtCategory: '3', // 주택담보대출 카테고리
      })),
      goldProducts: result.goldProducts.map((p) => ({
        ...p,
        finPrdtCategory: '4', // 금 상품 카테고리
      })),
      fundProducts: result.fundProducts.map((p) => ({
        ...p,
        finPrdtCategory: '5', // 펀드 카테고리
      })),
    });
  } catch (error) {
    console.error('Nohoo 데이터 요청 실패', error);
  }
});

const userInfo = computed(() => data.value?.userInfo[0]);
const userName = computed(() => userInfo.value?.userName.userName ?? '');
const assetInfo = computed(() => data.value?.userInfo[0]?.assetStatus ?? []);
const totalAsset = computed(() =>
  assetInfo.value.reduce(
    (acc: number, cur: { amount: number }) => acc + cur.amount,
    0
  )
);

// 자산 데이터를 카테고리별로 그룹화
const ASSET_CATEGORY_MAP: Record<string, string> = {
  '1': '부동산',
  '2': '예금/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타 자산',
};

const assetSummary = computed(() =>
  assetInfo.value.map(
    (item: { assetCategoryCode: string; amount: number }) => ({
      category: ASSET_CATEGORY_MAP[item.assetCategoryCode] ?? '기타',
      amount: item.amount,
    })
  )
);

// 탭 전환 시 정렬 초기화
watch(selectedTab, () => {
  sortOption.value = 'name';
});

// 추천 상품 목록
const recommendedProducts = computed(() => {
  const recommendItems = data.value?.customRecommendPrdt ?? [];

  const products = productStore
    .getProductsByRecommendIds(recommendItems)
    .map((product) => {
      const tags: string[] = [];

      // 추천 점수도 붙여줌 (정렬용)
      const score = Number(
        recommendItems.find((r) => r.finPrdtCd === product.finPrdtCd)?.score ??
          '0'
      );
      tags.push(`맞춤점수 ${score}점 | `);

      // 금리/기간 태그 설정 (예금/적금/주담대)
      if (
        (product.finPrdtCategory === '1' || product.finPrdtCategory === '2') &&
        product.optionList?.length
      ) {
        const option12 = product.optionList.find(
          (opt: any) => opt.saveTrm === '12'
        );
        if (option12) {
          const maxRate = option12.intrRate2 ?? 0;
          tags.push('12개월', `최고금리 ${maxRate.toFixed(2)}%`);
        } else {
          const saveTerms = product.optionList
            .filter((opt: any) => opt.saveTrm !== null)
            .map((opt: any) => `${opt.saveTrm}개월`);
          const maxRate = Math.max(
            ...(product.optionList.map((opt: any) => opt.intrRate2) ?? [0])
          );
          tags.push(...saveTerms, `최고금리 ${maxRate.toFixed(2)}%`);
        }
      }

      if (product.finPrdtCategory === '3' && product.optionList?.length) {
        const minRate = Math.min(
          ...product.optionList.map((opt: any) =>
            parseFloat(opt.lendRateMin ?? '999')
          )
        );
        tags.push(`최저금리 ${minRate.toFixed(2)}%`);
      }

      if (
        product.finPrdtCategory === '5' &&
        Array.isArray(product.optionList)
      ) {
        const maxReturn = Math.max(
          ...product.optionList.map((opt: any) =>
            parseFloat(opt.rate3mon?.replace('%', '') || '0')
          )
        );
        tags.push(`최고수익률 ${maxReturn.toFixed(2)}%`);
      }

      return { ...product, tags, score: Number(score) };
    });

  // 정렬 처리
  if (sortOption.value === 'score') {
    return products.sort((a, b) => b.score - a.score);
  } else {
    return products.sort((a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm));
  }
});

// 탭별 상품 필터링 및 정렬
const filteredProducts = computed(() => {
  const tab = selectedTab.value;
  let products: any[] = [];

  // 예금
  if (tab === '예금') {
    products = productStore.allProducts.timeDeposits.map((p) => {
      const optionList = (p as any).optionList ?? [];
      const option12 = optionList.find(
        (opt: { saveTrm: string }) => opt.saveTrm === '12'
      );
      const tags = option12
        ? ['12개월', `최고금리 ${(option12 as any).intrRate2.toFixed(2)}%`]
        : [];

      const maxRate = option12
        ? (option12 as any).intrRate2
        : Math.max(
            ...(optionList.map(
              (opt: { intrRate2: number }) => opt.intrRate2
            ) ?? [0])
          );

      return { ...p, tags, maxRate };
    });
  }

  // 적금
  else if (tab === '적금') {
    products = productStore.allProducts.savingsDeposits.map((p) => {
      const optionList = (p as any).optionList ?? [];
      const option12 = optionList.find(
        (opt: { saveTrm: string }) => opt.saveTrm === '12'
      );
      const tags = option12
        ? ['12개월', `최고금리 ${(option12 as any).intrRate2.toFixed(2)}%`]
        : [];

      const maxRate = option12
        ? (option12 as any).intrRate2
        : Math.max(
            ...(optionList.map(
              (opt: { intrRate2: number }) => opt.intrRate2
            ) ?? [0])
          );

      return { ...p, tags, maxRate };
    });
  }

  // 주택담보
  else if (tab === '주택담보') {
    products = productStore.allProducts.mortgageLoan.map((p) => {
      const optionList = (p as any).optionList ?? [];
      const minRate = Math.min(
        ...(optionList.map((opt: { lendRateMin: string | null }) =>
          parseFloat(opt.lendRateMin ?? '999')
        ) ?? [999])
      );

      return {
        ...p,
        tags: [`최저금리 ${minRate.toFixed(2)}%`],
        maxRate: minRate,
      };
    });
  }

  // 금 → 태그 비표시
  else if (tab === '금') {
    products = productStore.allProducts.goldProducts.map((p) => ({
      ...p,
      tags: [], // 태그 표시하지 않음
    }));
  } else if (tab === '펀드') {
    products = productStore.allProducts.fundProducts.map((p) => {
      const optionList = (p as any).optionList ?? [];
      const maxReturn = Math.max(
        ...(optionList.map((opt: { rate3mon: string | null }) =>
          parseFloat(opt.rate3mon?.replace('%', '') || '0')
        ) ?? [0])
      );
      return {
        ...p,
        tags: [`수익률 ${maxReturn.toFixed(2)}%`],
        maxRate: maxReturn,
      };
    });
  }

  // 정렬
  return sortOption.value === 'rate'
    ? tab === '주택담보'
      ? products.sort((a, b) => a.maxRate - b.maxRate)
      : products.sort((a, b) => b.maxRate - a.maxRate)
    : products.sort((a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm));
});

const goToDetail = (id: string) => {
  if (!id) return;
  router.push({ name: 'product-detail', params: { id } });
};
</script>

<style scoped>
/* 여기에 필요한 스타일을 추가하세요. */
</style>
