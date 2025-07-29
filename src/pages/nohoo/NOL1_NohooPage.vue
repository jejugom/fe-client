<template>
  <div class="flex flex-col gap-8">
    <!-- 탭 -->
    <TabBtnGroup
      :tabs="['맞춤', '예금', '적금', '주택담보', '금']"
      v-model:selectedTab="selectedTab"
    />

    <!-- 조건부 컴포넌트 -->
    <AdBox
      :selectedTab="selectedTab"
      :userName="userName"
      :assetInfo="assetInfo"
      :assetAmount="totalAsset"
      :assetSummary="assetSummary"
    />
    <!-- 필터링 -->
    <div v-if="selectedTab !== '맞춤'" class="flex justify-end">
      <SelectBox size="small" v-model="sortOption">
        <option value="name">상품명순</option>
        <option
          v-if="selectedTab === '예금' || selectedTab === '적금'"
          value="rate"
          >최고금리순</option
        >
        <option v-if="selectedTab === '주택담보'" value="rate"
          >최저금리순</option
        >
      </SelectBox>
    </div>

    <!-- 리스트 -->
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
        :key="product.fin_prdt_cd"
        :title="product.fin_prdt_nm"
        :content="product.prdt_feature"
        :tags="product.tags"
        btnText="자세히 보기"
        color="primary"
        @click="goToDetail(product.fin_prdt_cd)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import TabBtnGroup from './_components/TabBtnGroup.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import AdBox from './_components/AdBox.vue';
import { useRouter } from 'vue-router';
import SelectBox from '@/components/forms/SelectBox.vue';
import { useProductStore } from '@/stores/product';
import { api_data } from '@/api/nohoo/nohoo';

const userInfo = api_data.user_info[0];
const userName = userInfo.user_name.userName;
const assetInfo = userInfo.asset_status;
const assetStatus = userInfo.asset_status;
const totalAsset = assetInfo.reduce((sum, item) => sum + item.amount, 0);

// 자산 데이터를 카테고리별로 그룹화
const ASSET_CATEGORY_MAP: Record<string, string> = {
  '1': '부동산',
  '2': '예금/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타 자산',
};

const assetSummary = computed(() => {
  return assetStatus.map((item) => ({
    category: ASSET_CATEGORY_MAP[item.assetCategoryCode] ?? '기타',
    amount: item.amount,
  }));
});

const productStore = useProductStore();
onMounted(() => {
  // 전체 상품을 store에 저장
  productStore.setAllProducts({
    timeDeposits: api_data.timeDeposits,
    savingDeposits: api_data.savingDeposits,
    mortgageLoan: api_data.mortgageLoan,
  });
});
// 추천 상품 목록
const recommendedProducts = computed(() => {
  return productStore
    .getProductsByRecommendIds(api_data.customRecommend_prdt)
    .map((product) => {
      let tags: string[] = [];

      if (product.optionList?.length) {
        const saveTerms = product.optionList.map(
          (opt) => `${opt.save_trm}개월`
        );
        const maxRate = Math.max(
          ...product.optionList.map((opt) => opt.intr_rate2)
        );
        tags = [...saveTerms, `최고금리 ${maxRate.toFixed(2)}%`];
      }

      if (product.optionListList?.length) {
        const option = product.optionListList[0];
        tags = [
          option.mrtg_type_nm,
          option.lend_rate_type_nm,
          `최저금리 ${option.lend_rate_min}%`,
        ];
      }

      return {
        ...product,
        tags,
      };
    });
});

const selectedTab = ref('맞춤');
const sortOption = ref('name');
const router = useRouter();

// 탭이 바뀌면 정렬 옵션 초기화
watch(selectedTab, () => {
  sortOption.value = 'name';
});

// 상품 목록 (필터링 및 정렬 포함)
const filteredProducts = computed(() => {
  let products: any[] = [];

  if (selectedTab.value === '예금') {
    products = productStore.allProducts.timeDeposits.map((product) => ({
      ...product,
      tags: [
        ...(product.optionList?.map((opt) => `${opt.save_trm}개월`) || []),
        product.optionList
          ? `최고금리 ${Math.max(
              ...product.optionList.map((opt) => opt.intr_rate2)
            ).toFixed(2)}%`
          : '',
      ],
      maxRate: product.optionList
        ? Math.max(...product.optionList.map((opt) => opt.intr_rate2))
        : 0,
    }));
  } else if (selectedTab.value === '적금') {
    products = productStore.allProducts.timeDeposits.map((product) => ({
      ...product,
      tags: [
        ...(product.optionList?.map((opt) => `${opt.save_trm}개월`) || []),
        product.optionList
          ? `최고금리 ${Math.max(
              ...product.optionList.map((opt) => opt.intr_rate2)
            ).toFixed(2)}%`
          : '',
      ],
      maxRate: product.optionList
        ? Math.max(...product.optionList.map((opt) => opt.intr_rate2))
        : 0,
    }));
  } else if (selectedTab.value === '주택담보') {
    products = productStore.allProducts.mortgageLoan.map((product) => {
      const option = product.optionListList?.[0];

      return {
        ...product,
        tags: option
          ? [
              option.mrtg_type_nm,
              option.lend_rate_type_nm,
              `최저금리 ${option.lend_rate_min}%`,
            ]
          : [],
        maxRate: option ? parseFloat(option.lend_rate_min) : Infinity,
      };
    });
  }

  // 정렬
  if (sortOption.value === 'name') {
    return products.sort((a, b) => a.fin_prdt_nm.localeCompare(b.fin_prdt_nm));
  } else if (sortOption.value === 'rate') {
    return selectedTab.value === '주택담보'
      ? products.sort((a, b) => a.maxRate - b.maxRate)
      : products.sort((a, b) => b.maxRate - a.maxRate);
  }

  return products;
});

const goToDetail = (productId: string) => {
  if (!productId) return;
  router.push({ name: 'product-detail', params: { id: productId } });
};
</script>
