<template>
  <TabBtnGroup
    :tabs="['맞춤', '금', '예금', '적금', '펀드', '주택담보', '신탁']"
    v-model:selectedTab="selectedTab"
  />

  <div class="mt-12 flex flex-col gap-8">
    <AdBox
      :selectedTab="selectedTab"
      :userName="userName"
      :assetAmount="totalAsset"
      :assetSummary="assetSummary"
      :news="filteredNews"
    />

    <div class="flex flex-col gap-4">
      <!-- 정렬 + 필터 버튼 -->
      <div
        v-if="selectedTab !== '금' && selectedTab !== '신탁'"
        class="flex items-center justify-end gap-2"
      >
        <SelectBox size="small" v-model="sortOption" class="w-40">
          <option v-if="selectedTab === '맞춤'" value="score">적합도순</option>
          <option value="name">상품명순</option>

          <!-- 예금 / 적금 -->
          <template v-if="selectedTab === '예금' || selectedTab === '적금'">
            <option value="rateDesc">최고금리순</option>
            <option value="rateAsc">최저금리순</option>
          </template>

          <!-- 주택담보 -->
          <template v-if="selectedTab === '주택담보'">
            <option value="rateAsc">최저금리순</option>
            <option value="rateDesc">최고금리순</option>
          </template>

          <!-- 펀드 -->
          <template v-if="selectedTab === '펀드'">
            <option value="returnDesc">최고수익률순</option>
            <option value="returnAsc">최저수익률순</option>
            <option value="return3mon">3개월수익률순</option>
            <option value="riskGrade">위험등급순</option>
            <option value="returnPrice">기준가순</option>
          </template>
        </SelectBox>

        <Btn
          v-if="canFilter"
          size="square"
          label="필터"
          color="primary"
          class="max-h-10"
          @click="openFilter()"
        />
      </div>

      <!-- 검색 결과 없음 -->
      <div
        v-if="selectedTab !== '맞춤' && shownProducts.length === 0"
        class="text-surface-400 text-center text-base"
      >
        찾으신 조건으로는 상품이 아직 준비 중이에요!<br />
        조건을 조금 바꿔보시겠어요?
      </div>

      <!-- 맞춤 헤더 -->
      <div v-if="selectedTab === '맞춤'">
        <p class="text-primary-500 text-2xl font-bold"
          >딱 맞는 상품만 보여드릴게요</p
        >
        <p v-if="recommendationCommentParts" class="mt-2">
          <span>{{ recommendationCommentParts.name }}</span>
          님께는
          <span class="text-gold font-semibold">{{
            recommendationCommentParts.category
          }}</span>
          상품이 가장 많이 추천되었어요
        </p>
      </div>

      <!-- 카드 리스트 -->
      <BtnCard
        v-for="product in selectedTab === '맞춤'
          ? recommendedProducts
          : shownProducts"
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

  <!-- 우리 모달: Modal(껍데기) + FilterForm(폼만) -->
  <Modal
    v-if="isFilterOpen"
    title="나에게 맞는 상품 찾기"
    leftLabel="초기화"
    rightLabel="적용"
    @click1="handleReset"
    @click2="handleApply"
  >
    <FilterForm :category="selectedTab" v-model:filters="draftFilters" />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TabBtnGroup from './_components/TabBtnGroup.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import AdBox from './_components/AdBox.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import { useProductStore } from '@/stores/product';
import { useLoadingStore } from '@/stores/loading';
import {
  type ParsedApiResponse,
  type News,
  type UserInfo,
  type NohooFilters,
} from '@/types/nohoo/nohoo';
import { fetchNohooData } from '@/api/nohoo/nohoo';
import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';
import FilterForm from './_components/FilterForm.vue';

const PRODUCT_CATEGORY_MAP: Record<string, number> = {
  예금: 1,
  적금: 2,
  주택담보: 3,
  금: 4,
  펀드: 5,
  신탁: 6,
};
const CATEGORY_LABEL_MAP = Object.fromEntries(
  Object.entries(PRODUCT_CATEGORY_MAP).map(([k, v]) => [String(v), k])
);
const ASSET_CATEGORY_MAP: Record<string, string> = {
  '1': '부동산',
  '2': '예금/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타 자산',
};
const DEFAULT_SORT_OPTIONS: Record<string, string> = {
  맞춤: 'score',
  예금: 'rateDesc',
  적금: 'rateDesc',
  주택담보: 'rateAsc',
  펀드: 'returnDesc',
  default: 'name',
};

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const loadingStore = useLoadingStore();

const data = ref<ParsedApiResponse | null>(null);
const selectedTab = ref<string>('맞춤');
const sortOption = ref<string>('score');
const news = ref<News[]>([]);
const isFilterOpen = ref(false);
const draftFilters = ref<NohooFilters>({});
const filtersByTab = ref<Record<string, NohooFilters>>({});
const serverFiltered = ref<any[] | null>(null);

//   초기 데이터 로딩
const mapProductOptions = {
  deposit: (opts: any[] = []) =>
    opts.map((o) => ({
      saveTrm: o?.saveTrm ?? null,
      intrRate: Number(o?.intrRate ?? 0),
      intrRate2: Number(o?.intrRate2 ?? 0),
    })),
  saving: (opts: any[] = []) =>
    opts.map((o) => ({
      saveTrm: String(o?.saveTrm ?? ''),
      intrRate: Number(o?.intrRate ?? 0),
      intrRate2: Number(o?.intrRate2 ?? 0),
    })),
  mortgage: (opts: any[] = []) =>
    opts.map((o) => ({
      mrtgTypeNm: String(o?.mrtgTypeNm ?? ''),
      rpayTypeNm: String(o?.rpayTypeNm ?? ''),
      lendRateTypeNm: String(o?.lendRateTypeNm ?? ''),
      lendRateMin: String(o?.lendRateMin ?? ''),
      lendRateMax: String(o?.lendRateMax ?? ''),
    })),
  fund: (opts: any[] = []) =>
    opts.map((o) => ({
      rate3mon: String(o?.rate3mon ?? ''),
      riskGrade: String(o?.riskGrade ?? ''),
      priceStd: String(o?.priceStd ?? ''),
    })),
  default: (opts: any[] = []) => (Array.isArray(opts) ? opts : []),
};

function processApiData(result: ParsedApiResponse) {
  const {
    userInfo,
    customRecommendPrdt,
    allProducts,
    news: newsArr,
  } = result ?? {};
  const { deposit, saving, mortgage, gold, fund, trust } = allProducts ?? {};

  const productMapping = {
    timeDeposits: {
      data: deposit,
      category: '1',
      map: mapProductOptions.deposit,
    },
    savingsDeposits: {
      data: saving,
      category: '2',
      map: mapProductOptions.saving,
    },
    mortgageLoan: {
      data: mortgage,
      category: '3',
      map: mapProductOptions.mortgage,
    },
    goldProducts: { data: gold, category: '4', map: mapProductOptions.default },
    fundProducts: { data: fund, category: '5', map: mapProductOptions.fund },
    trustProducts: {
      data: trust,
      category: '6',
      map: mapProductOptions.default,
    },
  };

  const allMappedProducts = Object.entries(productMapping).reduce(
    (acc, [key, { data, category, map }]) => {
      acc[key] = (data as any[]).map((p) => ({
        finPrdtCategory: category,
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: map(p?.optionList),
      }));
      return acc;
    },
    {} as any
  );

  productStore.setAllProducts(allMappedProducts);
  data.value = { ...result, userInfo, customRecommendPrdt, news: newsArr };
  news.value = newsArr ?? [];
}

// API 데이터 로딩
const productViewBuilder: Record<string, () => any[]> = {
  예금: () =>
    productStore.allProducts.timeDeposits.map((p: any) => {
      const opt12 = p.optionList?.find((o: any) => String(o.saveTrm) === '12');
      return {
        ...p,
        tags: opt12
          ? ['12개월', `최고금리 ${Number(opt12.intrRate2).toFixed(2)}%`]
          : [],
        maxRate:
          opt12?.intrRate2 ??
          Math.max(...p.optionList.map((o: any) => o.intrRate2), 0),
      };
    }),
  적금: () =>
    productStore.allProducts.savingsDeposits.map((p: any) => {
      const opt12 = p.optionList?.find((o: any) => String(o.saveTrm) === '12');
      return {
        ...p,
        tags: opt12
          ? ['12개월', `최고금리 ${Number(opt12.intrRate2).toFixed(2)}%`]
          : [],
        maxRate:
          opt12?.intrRate2 ??
          Math.max(...p.optionList.map((o: any) => o.intrRate2), 0),
      };
    }),
  주택담보: () =>
    productStore.allProducts.mortgageLoan.map((p: any) => {
      const minRate = Math.min(
        ...p.optionList.map((o: any) => parseFloat(o.lendRateMin ?? '999'))
      );
      return {
        ...p,
        maxRate: minRate,
        tags: isFinite(minRate) ? [`최저금리 ${minRate}%`] : [],
      };
    }),
  펀드: () =>
    productStore.allProducts.fundProducts.map((p: any) => {
      const first = p.optionList?.[0] ?? {};
      const risk = String(first.riskGrade ?? '').trim();
      return {
        ...p,
        maxRate: Math.max(
          ...p.optionList.map((o: any) => parseFloat(o.rate3mon ?? '0'))
        ),
        tags: risk ? [`위험등급 ${risk}`] : [],
        riskGrade: Number(risk || 0),
        priceStd: Number(first.priceStd ?? 0),
      };
    }),
  금: () =>
    productStore.allProducts.goldProducts.map((p: any) => ({ ...p, tags: [] })),
  신탁: () =>
    productStore.allProducts.trustProducts.map((p: any) => ({
      ...p,
      tags: [],
    })),
};

// 정렬 함수
const sorters: Record<string, (a: any, b: any) => number> = {
  name: (a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm),
  score: (a, b) => (b.score ?? 0) - (a.score ?? 0),
  rateDesc: (a, b) => (b.maxRate ?? 0) - (a.maxRate ?? 0),
  rateAsc: (a, b) => (a.maxRate ?? 999) - (b.maxRate ?? 999),
  returnDesc: (a, b) => (b.maxRate ?? 0) - (a.maxRate ?? 0),
  returnAsc: (a, b) => (a.maxRate ?? 999) - (b.maxRate ?? 999),
  return3mon: (a, b) => (a.maxRate ?? 999) - (b.maxRate ?? 999),
  riskGrade: (a, b) => (a.riskGrade ?? 99) - (b.riskGrade ?? 99),
  returnPrice: (a, b) => (b.priceStd ?? 0) - (a.priceStd ?? 0),
};

// 표시할 제품 목록
const shownProducts = computed(() => {
  const tab = selectedTab.value;
  let list = serverFiltered.value ?? productViewBuilder[tab]?.() ?? [];

  if (tab === '신탁') {
    list = list.filter((p) => p.finPrdtCd?.startsWith('TR'));
  }

  const sorter = sorters[sortOption.value];
  return sorter ? [...list].sort(sorter) : list;
});

// 추천 제품 목록
const recommendedProducts = computed(() => {
  const recommendItems = data.value?.customRecommendPrdt ?? [];
  const products = productStore
    .getProductsByRecommendIds(recommendItems)
    .filter((p) => p.finPrdtCategory)
    .map((p) => {
      const r = recommendItems.find((r) => r.finPrdtCd === p.finPrdtCd);
      const score = Number(r?.score ?? '0');
      return {
        ...p,
        score,
        tags: [
          `적합도 ${(score * 100).toFixed(1)}% | ${CATEGORY_LABEL_MAP[p.finPrdtCategory]}`,
        ],
      };
    });

  const sorter = sorters[sortOption.value] ?? sorters.name;
  return [...products].sort(sorter);
});

// 뉴스 필터링
const filteredNews = computed(() =>
  news.value.filter(
    (n) => n.category === PRODUCT_CATEGORY_MAP[selectedTab.value]
  )
);
const userInfo = computed<UserInfo | undefined>(() => data.value?.userInfo);
const userName = computed(() => userInfo.value?.userName ?? '');
const assetInfo = computed(() => userInfo.value?.assetStatus ?? []);
const totalAsset = computed(() =>
  assetInfo.value.reduce((acc, cur) => acc + cur.amount, 0)
);
// 자산 요약
const assetSummary = computed(() =>
  assetInfo.value.map((i) => ({
    category: ASSET_CATEGORY_MAP[i.assetCategoryCode] ?? '기타',
    amount: i.amount,
  }))
);
// 가장 많이 추천된 카테고리
const mostRecommendedCategory = computed(() => {
  const counts = productStore
    .getProductsByRecommendIds(data.value?.customRecommendPrdt ?? [])
    .reduce(
      (acc, p) => {
        if (p.finPrdtCategory)
          acc[p.finPrdtCategory] = (acc[p.finPrdtCategory] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  const topCode = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  return topCode ? { code: topCode, label: CATEGORY_LABEL_MAP[topCode] } : null;
});
// 추천 제품 카테고리
const recommendationCommentParts = computed(() => {
  const cat = mostRecommendedCategory.value;
  return cat ? { name: userName.value, category: cat.label } : null;
});

const canFilter = computed(() =>
  ['예금', '적금', '펀드', '주택담보'].includes(selectedTab.value)
);
// 필터링된 제품 목록
const currentFilters = computed<NohooFilters>(
  () => filtersByTab.value[selectedTab.value] ?? {}
);

// 필터 열기
function openFilter() {
  draftFilters.value = JSON.parse(JSON.stringify(currentFilters.value ?? {}));
  isFilterOpen.value = true;
}
// 필터 초기화
function handleReset() {
  draftFilters.value = {};
  serverFiltered.value = null; // 필터 초기화 시 서버 필터링 결과도 초기화
}
// 필터 적용
async function handleApply() {
  filtersByTab.value[selectedTab.value] = draftFilters.value;
  isFilterOpen.value = false;
  loadingStore.startLoading();
  try {
    await new Promise((r) => setTimeout(r, 200)); // Mock delay
    serverFiltered.value = frontFilterMock(
      selectedTab.value,
      draftFilters.value
    );
  } finally {
    loadingStore.stopLoading();
  }
}

// 예금 태그 생성
function buildDepositTags(
  p: any,
  f: { terms?: string[]; rateTypes?: string[] }
) {
  const opts = p.optionList ?? [];
  let cand = !f.terms?.length
    ? opts
    : opts.filter((o: any) => f.terms!.includes(String(o.saveTrm)));
  if (f.rateTypes?.length) {
    cand = cand.filter((o: any) =>
      f.rateTypes!.includes(p.intrRateTypeNm ?? '고정금리')
    );
  }
  if (cand.length === 0) return { maxRate: 0, tags: [] };
  const best = cand.reduce((a: any, c: any) =>
    Number(c.intrRate2) > Number(a.intrRate2) ? c : a
  );
  const tags = [
    `${best.saveTrm}개월`,
    `최고금리 ${Number(best.intrRate2).toFixed(2)}%`,
  ];
  if (p.intrRateTypeNm) tags.push(p.intrRateTypeNm);
  return { maxRate: Number(best.intrRate2), tags };
}

function buildSavingTags(p: any, f: { terms?: string[] }) {
  const opts = p.optionList ?? [];
  let cand = !f.terms?.length
    ? opts
    : opts.filter((o: any) => f.terms!.includes(String(o.saveTrm)));
  if (cand.length === 0) return { maxRate: 0, tags: [] };
  const best = cand.reduce((a: any, c: any) =>
    Number(c.intrRate2) > Number(a.intrRate2) ? c : a
  );
  const tags = [
    `${best.saveTrm}개월`,
    `최고금리 ${Number(best.intrRate2).toFixed(2)}%`,
  ];
  return { maxRate: Number(best.intrRate2), tags };
}

function buildFundTags(p: any) {
  const o = (p.optionList ?? [])[0] ?? {};
  const tags = [
    `3개월수익률 ${parseFloat((o.rate3mon ?? '0').toString()).toFixed(2)}% | `,
  ];
  if (o.riskGrade) tags.push(`위험등급 ${o.riskGrade} | `);
  if (o.priceStd) tags.push(`기준가 ${o.priceStd}`);
  return tags;
}

// 필터링 전략
const filterStrategies: Record<
  string,
  (list: any[], filters: NohooFilters) => any[]
> = {
  예금: (list, filters) => {
    const f = filters as {
      terms?: string[];
      rateTypes?: string[];
      minTopRate?: number;
    };
    return list
      .filter((p) => {
        const opts = p.optionList ?? [];
        const hitTerm =
          !f.terms?.length ||
          opts.some((o: any) => f.terms!.includes(String(o.saveTrm)));
        const rateType = p.intrRateTypeNm ?? p.rateType ?? '고정금리';
        const hitType = !f.rateTypes?.length || f.rateTypes!.includes(rateType);
        const topAll = Math.max(
          ...opts.map((o: any) => Number(o.intrRate2 || 0))
        );
        const hitRate = f.minTopRate == null || topAll >= f.minTopRate!;
        return hitTerm && hitType && hitRate;
      })
      .map((p) => ({ ...p, ...buildDepositTags(p, f) }));
  },
  적금: (list, filters) => {
    const f = filters as {
      terms?: string[];
      savingKinds?: string[];
      minTopRate?: number;
    };
    return list
      .filter((p) => {
        const opts = p.optionList ?? [];
        const hitTerm =
          !f.terms?.length ||
          opts.some((o: any) => f.terms!.includes(String(o.saveTrm)));
        const kind = p?.savingKind || p?.accType || '정액적립식';
        const hitKind = !f.savingKinds?.length || f.savingKinds!.includes(kind);
        const topAll = Math.max(
          ...opts.map((o: any) => Number(o.intrRate2 || 0))
        );
        const hitRate = f.minTopRate == null || topAll >= f.minTopRate!;
        return hitTerm && hitKind && hitRate;
      })
      .map((p) => ({ ...p, ...buildSavingTags(p, f) }));
  },
  펀드: (list, filters) => {
    const f = filters as { riskGrades?: string[]; min3mReturn?: number };
    return list
      .filter((p) => {
        const opts = p.optionList ?? [];
        const first = opts[0] ?? {};
        const max3m = Math.max(
          ...opts.map((o: any) => parseFloat((o.rate3mon ?? '0').toString()))
        );
        const hitRisk =
          !f.riskGrades?.length ||
          f.riskGrades!.includes(String(first.riskGrade));
        const hitRet = f.min3mReturn == null || max3m >= f.min3mReturn!;
        return hitRisk && hitRet;
      })
      .map((p) => {
        const opts = p.optionList ?? [];
        const max3m = Math.max(
          ...opts.map((o: any) => parseFloat((o.rate3mon ?? '0').toString()))
        );
        const first = opts[0] ?? {};
        return {
          ...p,
          maxRate: max3m,
          riskGrade: Number(first.riskGrade ?? 0),
          priceStd: Number(first.priceStd ?? 0),
          tags: buildFundTags(p),
        };
      });
  },
  주택담보: (list, filters) => {
    const f = filters as {
      rateTypes?: string[];
      mrtgTypes?: string[];
      repayTypes?: string[];
      maxRateCeil?: number;
      calcLtv?: number | null;
    };
    const ASSUMED_LTV = 60;
    if (f.calcLtv != null && f.calcLtv > ASSUMED_LTV) return [];
    return list
      .filter((p) => {
        const opts = p.optionList ?? [];
        const minRate = Math.min(
          ...opts.map((o: any) => parseFloat(o.lendRateMin ?? '999'))
        );
        const hitsType =
          !f.rateTypes?.length ||
          opts.some((o: any) => f.rateTypes!.includes(o.lendRateTypeNm));
        const hitsMrtg =
          !f.mrtgTypes?.length ||
          opts.some((o: any) => f.mrtgTypes!.includes(o.mrtgTypeNm));
        const hitsRepay =
          !f.repayTypes?.length ||
          f.repayTypes!.includes(p.rpayTypeNm ?? '') ||
          opts.some((o: any) => f.repayTypes!.includes(o.rpayTypeNm));
        const hitsMax = f.maxRateCeil == null || minRate <= f.maxRateCeil!;
        const hitsLtv = f.calcLtv == null || f.calcLtv <= ASSUMED_LTV;
        return hitsType && hitsMrtg && hitsRepay && hitsMax && hitsLtv;
      })
      .map((p) => {
        const opts = p.optionList ?? [];
        const minRate = Math.min(
          ...opts.map((o: any) => parseFloat(o.lendRateMin ?? '999'))
        );
        const first = opts[0] ?? {};
        const tags = [
          `최저금리 ${isFinite(minRate) ? minRate.toFixed(2) : '-'}% | `,
        ];
        if (first.lendRateTypeNm) tags.push(first.lendRateTypeNm);
        if (first.mrtgTypeNm) tags.push(first.mrtgTypeNm);
        return { ...p, maxRate: minRate, tags };
      });
  },
};

// 필터링 전략
function frontFilterMock(category: string, filters: NohooFilters): any[] {
  const initialList = productViewBuilder[category]?.() ?? [];
  if (Object.keys(filters).length === 0) return initialList;

  const filterFn = filterStrategies[category];
  return filterFn ? filterFn(initialList, filters) : initialList;
}

// 제품 상세 페이지로 이동
function goToDetail(id: string) {
  if (id) router.push({ name: 'product-detail', params: { id } });
}

// 제품 목록 초기화
onMounted(async () => {
  loadingStore.startLoading();
  try {
    const result = await fetchNohooData();
    if (route.query.tab) selectedTab.value = route.query.tab as string;
    processApiData(result);
  } finally {
    loadingStore.stopLoading();
  }
});

// 필터링 전략
watch(selectedTab, (tab) => {
  sortOption.value = DEFAULT_SORT_OPTIONS[tab] || DEFAULT_SORT_OPTIONS.default;
  serverFiltered.value = null;
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
</script>
