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
      <!-- 정렬 + 필터 버튼 라인 -->
      <div v-if="selectedTab !== '금'" class="flex justify-end items-center gap-2">
        <SelectBox size="small" v-model="sortOption">
          <option value="name">상품명순</option>
          <option v-if="selectedTab === '맞춤'" value="score">맞춤점수순</option>
          <option v-if="selectedTab === '예금' || selectedTab === '적금'" value="rate">최고금리순</option>
          <option v-if="selectedTab === '주택담보'" value="rate">최저금리순</option>
          <option v-if="selectedTab === '펀드'" value="rate">최고수익률순</option>
        </SelectBox>

        <!-- 필터 버튼 (예금/적금/펀드/주택담보 탭만) -->
        <button
          v-if="canFilter"
          class="px-3 py-1.5 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50"
          @click="isFilterOpen = true"
        >
          필터
        </button>
      </div>

      <!-- 검색 결과 없음 안내 -->
      <div
        v-if="selectedTab !== '맞춤' && shownProducts.length === 0"
        class="text-surface-400 text-center text-base"
      >
        찾으신 조건으로는 상품이 아직 준비 중이에요!<br />
        조건을 조금 바꿔보시겠어요?
      </div>

      <!-- 맞춤 영역 헤더 -->
      <div v-if="selectedTab === '맞춤'">
        <p class="text-primary-500 text-2xl font-bold">
          딱 맞는 상품만 보여드릴게요
        </p>
        <p v-if="recommendationCommentParts" class="mt-2">
          <span>{{ recommendationCommentParts.name }}</span>
          님께는
          <span class="text-gold font-semibold">
            {{ recommendationCommentParts.category }}
          </span>
          상품이 가장 많이 추천되었어요.
        </p>
      </div>

      <!-- 카드 리스트 -->
      <BtnCard
        v-for="product in selectedTab === '맞춤' ? recommendedProducts : shownProducts"
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

  <!-- 필터 모달 -->
  <FilterModal
    v-if="isFilterOpen"
    :visible="isFilterOpen"
    :category="selectedTab"
    :initialFilters="currentFilters"
    @close="isFilterOpen = false"
    @apply="handleApplyFilter"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import TabBtnGroup from './_components/TabBtnGroup.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import AdBox from './_components/AdBox.vue';
import SelectBox from '@/components/forms/SelectBox.vue';
import FilterModal, { type AnyFilters } from './_components/FilterModal.vue';

import { useProductStore } from '@/stores/product';
import { useLoadingStore } from '@/stores/loading';

import {
  fetchNohooData,
  type ParsedApiResponse,
  type News,
  type UserInfo,
} from '@/api/nohoo/nohoo';

const router = useRouter();
const productStore = useProductStore();
const loadingStore = useLoadingStore();

const ASSUMED_MORTGAGE_LTV = 60; // 주담대 허용 LTV(가정)

const data = ref<ParsedApiResponse | null>(null);
const selectedTab = ref<'맞춤'|'금'|'예금'|'적금'|'펀드'|'주택담보'|'신탁'>('맞춤');
const sortOption = ref<'name'|'score'|'rate'>('name');
const news = ref<News[]>([]);

/** 탭 <-> 카테고리 코드 매핑 */
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

/* =========================
 * 초기 데이터 로드
 * =======================*/
onMounted(async () => {
  loadingStore.startLoading();
  try {
    const result = await fetchNohooData();
    const {
      userInfo = { userName: '', assetStatus: [] },
      customRecommendPrdt = [],
      allProducts = {},
      news: newsArr = [],
    } = result ?? {};

    const {
      deposit = [],
      saving = [],
      mortgage = [],
      gold = [],
      fund = [],
      trust = [],
    } = allProducts ?? {};

    // 옵션 매핑
    const mapTimeDepositOptions = (opts: any[] = []) =>
      opts.map((o) => ({
        saveTrm: o?.saveTrm ?? null,
        intrRate: Number(o?.intrRate ?? 0),
        intrRate2: Number(o?.intrRate2 ?? 0),
      }));

    const mapSavingOptions = (opts: any[] = []) =>
      opts.map((o) => ({
        saveTrm: String(o?.saveTrm ?? ''),
        intrRate: Number(o?.intrRate ?? 0),
        intrRate2: Number(o?.intrRate2 ?? 0),
      }));

    const mapMortgageOptions = (opts: any[] = []) =>
      opts.map((o) => ({
        mrtgTypeNm: String(o?.mrtgTypeNm ?? ''),
        rpayTypeNm: String(o?.rpayTypeNm ?? ''),
        lendRateTypeNm: String(o?.lendRateTypeNm ?? ''),
        lendRateMin: String(o?.lendRateMin ?? ''),
        lendRateMax: String(o?.lendRateMax ?? ''),
      }));

    const mapFundOptions = (opts: any[] = []) =>
      opts.map((o) => ({
        rate3mon: String(o?.rate3mon ?? ''),
        riskGrade: String(o?.riskGrade ?? ''),
        priceStd: String(o?.priceStd ?? ''),
      }));

    // 전역 스토어 저장
    productStore.setAllProducts({
      timeDeposits: (deposit as any[]).map((p) => ({
        finPrdtCategory: '1',
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: mapTimeDepositOptions(p?.optionList),
      })),
      savingsDeposits: (saving as any[]).map((p) => ({
        finPrdtCategory: '2',
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: mapSavingOptions(p?.optionList),
      })),
      mortgageLoan: (mortgage as any[]).map((p) => ({
        finPrdtCategory: '3',
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: mapMortgageOptions(p?.optionList),
      })),
      goldProducts: (gold as any[]).map((p) => ({
        finPrdtCategory: '4',
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: Array.isArray(p?.optionList) ? p.optionList : [],
      })),
      fundProducts: (fund as any[]).map((p) => ({
        finPrdtCategory: '5',
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: mapFundOptions(p?.optionList),
      })),
      trustProducts: (trust as any[]).map((p) => ({
        finPrdtCategory: '6',
        finPrdtCd: String(p?.finPrdtCd ?? ''),
        finPrdtNm: String(p?.finPrdtNm ?? ''),
        prdtFeature: String(p?.prdtFeature ?? ''),
        optionList: Array.isArray(p?.optionList) ? p.optionList : [],
      })),
    });

    // 화면에서 쓰는 원본 데이터
    data.value = {
      userInfo,
      customRecommendPrdt,
      timeDeposits: deposit as any,
      savingsDeposits: saving as any,
      mortgageLoan: mortgage as any,
      goldProducts: gold as any,
      fundProducts: fund as any,
      trustProducts: trust as any,
      news: newsArr,
    } as any;

    news.value = newsArr;
  } catch (error) {
    console.error('Nohoo 데이터 요청 실패', error);
    loadingStore.setError(true);
  } finally {
    loadingStore.stopLoading();
  }
});

/* =========================
 * 공통 표시 데이터
 * =======================*/
const filteredNews = computed(() => {
  const category = PRODUCT_CATEGORY_MAP[selectedTab.value];
  if (category) {
    return news.value.filter((item) => item.category === category);
  }
  return [];
});
const userInfo = computed<UserInfo | undefined>(() => data.value?.userInfo);
const userName = computed(() => userInfo.value?.userName ?? '');
const assetInfo = computed(() => userInfo.value?.assetStatus ?? []);
const totalAsset = computed(() =>
  assetInfo.value.reduce((acc: number, cur: { amount: number }) => acc + cur.amount, 0)
);
const ASSET_CATEGORY_MAP: Record<string, string> = {
  '1': '부동산',
  '2': '예금/적금',
  '3': '현금',
  '4': '주식/펀드',
  '5': '사업체/지분',
  '6': '기타 자산',
};
const assetSummary = computed(() =>
  assetInfo.value.map((item: { assetCategoryCode: string; amount: number }) => ({
    category: ASSET_CATEGORY_MAP[item.assetCategoryCode] ?? '기타',
    amount: item.amount,
  }))
);

// 탭 바꾸면 정렬 기본으로 + 서버 필터 결과 초기화
watch(selectedTab, () => {
  sortOption.value = 'name';
  serverFiltered.value = null;
});

/* =========================
 * 맞춤 추천
 * =======================*/
const recommendedProducts = computed(() => {
  const recommendItems = data.value?.customRecommendPrdt ?? [];
  const products = productStore
    .getProductsByRecommendIds(recommendItems)
    .map((product) => {
      const tags: string[] = [];
      const score = Number(
        recommendItems.find((r) => r.finPrdtCd === product.finPrdtCd)?.score ?? '0'
      );
      tags.push(`맞춤점수 ${(score * 100).toFixed(0)}점 `);
      return { ...product, tags, score: Number(score) };
    });

  return sortOption.value === 'score'
    ? [...products].sort((a, b) => b.score - a.score)
    : [...products].sort((a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm));
});

const mostRecommendedCategory = computed(() => {
  const recommendItems = productStore.getProductsByRecommendIds(
    data.value?.customRecommendPrdt ?? []
  );
  const counts: Record<string, number> = {};
  recommendItems.forEach((item) => {
    const category = item.finPrdtCategory;
    if (!category) return;
    counts[category] = (counts[category] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topCategoryCode = sorted[0]?.[0];
  const count = sorted[0]?.[1] ?? 0;

  return {
    categoryCode: topCategoryCode,
    categoryLabel: CATEGORY_LABEL_MAP[topCategoryCode ?? ''] ?? '기타',
    count,
  };
});

const recommendationCommentParts = computed(() => {
  const { categoryLabel, count } = mostRecommendedCategory.value;
  if (!count) return null;
  return { name: userName.value, category: categoryLabel };
});

/* =========================
 * 필터 모달 연동
 * =======================*/
const isFilterOpen = ref(false);
const canFilter = computed(() => ['예금', '적금', '펀드', '주택담보'].includes(selectedTab.value));

// 탭별 현재 필터 상태 저장
const filtersByTab = ref<Record<string, AnyFilters>>({});
const currentFilters = computed<AnyFilters>(() => filtersByTab.value[selectedTab.value] ?? {});

// 서버에서 내려온 필터 결과 (있으면 이걸 우선 표시)
const serverFiltered = ref<any[] | null>(null);

// 모달 적용
async function handleApplyFilter(payload: AnyFilters) {
  filtersByTab.value[selectedTab.value] = payload;
  isFilterOpen.value = false;

  loadingStore.startLoading();
  try {
    serverFiltered.value = await fetchFilteredProducts(selectedTab.value, payload);
  } catch (e) {
    console.error('filtered fetch fail', e);
    serverFiltered.value = [];
  } finally {
    loadingStore.stopLoading();
  }
}

/* =========================
 * 리스트 구축/정렬
 * =======================*/
// 로컬 데이터 기반(필터 미사용/초기) 리스트 구성
function buildLocalListFor(tab: string): any[] {
  if (tab === '예금') {
    return productStore.allProducts.timeDeposits.map((p: any) => {
      const optionList = p.optionList ?? [];
      const option12 = optionList.find((opt: any) => String(opt.saveTrm) === '12');
      const tags = option12 ? ['12개월', `최고금리 ${Number(option12.intrRate2).toFixed(2)}%`] : [];
      const maxRate = option12
        ? Number(option12.intrRate2)
        : Math.max(...optionList.map((opt: any) => Number(opt.intrRate2 ?? 0)), 0);
      return { ...p, tags, maxRate };
    });
  } else if (tab === '적금') {
    return productStore.allProducts.savingsDeposits.map((p: any) => {
      const optionList = p.optionList ?? [];
      const option12 = optionList.find((opt: any) => String(opt.saveTrm) === '12');
      const tags = option12 ? ['12개월', `최고금리 ${Number(option12.intrRate2).toFixed(2)}%`] : [];
      const maxRate = option12
        ? Number(option12.intrRate2)
        : Math.max(...optionList.map((opt: any) => Number(opt.intrRate2 ?? 0)), 0);
      return { ...p, tags, maxRate };
    });
  } else if (tab === '주택담보') {
    return productStore.allProducts.mortgageLoan.map((p: any) => {
      const optionList = p.optionList ?? [];
      const minRate = Math.min(
        ...optionList.map((opt: any) => parseFloat(opt.lendRateMin ?? '999')),
        999
      );
      return { ...p, maxRate: minRate, tags: [] };
    });
  } else if (tab === '금') {
    return productStore.allProducts.goldProducts.map((p: any) => ({ ...p, tags: [] }));
  } else if (tab === '펀드') {
    return productStore.allProducts.fundProducts.map((p: any) => {
      const optionList = p.optionList ?? [];
      const maxReturn = Math.max(
        ...optionList.map((opt: any) => parseFloat((opt.rate3mon ?? '0').toString())),
        0
      );
      return { ...p, maxRate: maxReturn, tags: [] };
    });
  } else if (tab === '신탁') {
    return productStore.allProducts.trustProducts.map((p: any) => ({ ...p, tags: [] }));
  }
  return [];
}

function sortForTab(list: any[], tab: string, mode: 'name'|'rate'|'score') {
  if (mode === 'name') return [...list].sort((a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm));
  if (mode === 'rate') {
    if (tab === '주택담보') return [...list].sort((a, b) => (a.maxRate ?? 999) - (b.maxRate ?? 999));
    return [...list].sort((a, b) => (b.maxRate ?? 0) - (a.maxRate ?? 0));
  }
  if (mode === 'score') return [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return list;
}

// 실제 화면에 뿌릴 리스트 (서버 필터 결과가 있으면 우선)
const shownProducts = computed(() => {
  const tab = selectedTab.value;
  const base = serverFiltered.value && canFilter.value
    ? serverFiltered.value
    : buildLocalListFor(tab);
  return sortForTab(base, tab, sortOption.value);
});

/* =========================
 * (샘플) 서버 필터 API 자리
 * 실제로는 프로젝트 API로 교체
 * =======================*/
async function fetchFilteredProducts(category: string, filters: AnyFilters) {
  // 실제 구현 예:
  // return await api.post(`/products/search?category=${mapTabToCode(category)}`, filters)
  await new Promise((r) => setTimeout(r, 300)); // demo delay

  // 데모: 로컬 목록을 프론트에서 필터링 (백엔드 붙이면 삭제)
  const all = {
    '예금': productStore.allProducts.timeDeposits,
    '적금': productStore.allProducts.savingsDeposits,
    '펀드': productStore.allProducts.fundProducts,
    '주택담보': productStore.allProducts.mortgageLoan,
  }[category] ?? [];

  return frontFilterMock(category, filters, all);
}

function frontFilterMock(category: string, filters: AnyFilters, list: any[]) {
  if (category === '예금') {
    const f = filters as { terms?: string[]; rateTypes?: string[]; minTopRate?: number };
    return list
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const hitTerm = !f.terms?.length || opts.some((o: any) => f.terms!.includes(String(o.saveTrm)));
        const rateType = p.intrRateTypeNm ?? p.rateType ?? '고정금리';
        const hitType = !f.rateTypes?.length || f.rateTypes!.includes(rateType);
        const top = Math.max(...opts.map((o: any) => Number(o.intrRate2 || 0)), 0);
        const hitRate = f.minTopRate == null || top >= f.minTopRate!;
        return hitTerm && hitType && hitRate;
      })
      .map((p: any) => {
        const opts = p.optionList ?? [];
        const maxRate = Math.max(...opts.map((o: any) => Number(o.intrRate2 || 0)), 0);
        return { ...p, maxRate, tags: ['필터적용'] };
      });
  }

  if (category === '적금') {
    const f = filters as { terms?: string[]; savingKinds?: string[]; minTopRate?: number };
    return list
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const hitTerm = !f.terms?.length || opts.some((o: any) => f.terms!.includes(String(o.saveTrm)));
        const kind = p?.savingKind || p?.accType || '정액적립식';
        const hitKind = !f.savingKinds?.length || f.savingKinds!.includes(kind);
        const top = Math.max(...opts.map((o: any) => Number(o.intrRate2 || 0)), 0);
        const hitRate = f.minTopRate == null || top >= f.minTopRate!;
        return hitTerm && hitKind && hitRate;
      })
      .map((p: any) => {
        const opts = p.optionList ?? [];
        const maxRate = Math.max(...opts.map((o: any) => Number(o.intrRate2 || 0)), 0);
        return { ...p, maxRate, tags: ['필터적용'] };
      });
  }

  if (category === '펀드') {
    const f = filters as { riskGrades?: string[]; min3mReturn?: number };
    return list
      .filter((p: any) => {
        const o = (p.optionList ?? [])[0] ?? {};
        const hitRisk = !f.riskGrades?.length || f.riskGrades!.includes(String(o.riskGrade));
        const r = parseFloat((o.rate3mon ?? '0').toString());
        const hitRet = f.min3mReturn == null || r >= f.min3mReturn!;
        return hitRisk && hitRet;
      })
      .map((p: any) => {
        const o = (p.optionList ?? [])[0] ?? {};
        return { ...p, maxRate: parseFloat((o.rate3mon ?? '0').toString()), tags: ['필터적용'] };
      });
  }

  if (category === '주택담보') {
    const f = filters as (MortgageFilters & { calcLtv?: number | null });
    const ASSUMED_LTV = 60; // 모든 상품 LTV 60%로 가정

    // LTV가 계산되었고 60%를 초과하면 결과 없음
    if (f.calcLtv != null && f.calcLtv > ASSUMED_LTV) {
      return [];
    }

    return list
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const minRate = Math.min(...opts.map((o: any) => parseFloat(o.lendRateMin ?? '999')), 999);

        const hitsType = !f.rateTypes?.length || opts.some((o: any) => f.rateTypes!.includes(o.lendRateTypeNm));
        const hitsMrtg = !f.mrtgTypes?.length || opts.some((o: any) => f.mrtgTypes!.includes(o.mrtgTypeNm));
        const hitsRepay =
          !f.repayTypes?.length ||
          f.repayTypes!.includes(p.rpayTypeNm ?? '') ||
          opts.some((o: any) => f.repayTypes!.includes(o.rpayTypeNm));
        const hitsMax = f.maxRateCeil == null || minRate <= f.maxRateCeil!;

        // 입력 LTV가 있으면 60% 이하만 통과
        const hitsLtv = f.calcLtv == null || f.calcLtv <= ASSUMED_LTV;

        return hitsType && hitsMrtg && hitsRepay && hitsMax && hitsLtv;
      })
      .map((p: any) => {
        const opts = p.optionList ?? [];
        const minRate = Math.min(...opts.map((o: any) => parseFloat(o.lendRateMin ?? '999')), 999);
        const tags = ['필터적용'];
        if ((filters as any).calcLtv != null) tags.push(`LTV ${(filters as any).calcLtv}%`);
        return { ...p, maxRate: minRate, tags };
      });
  }

  return list;
}


/* =========================
 * 이동
 * =======================*/
const goToDetail = (id: string) => {
  if (!id) return;
  router.push({ name: 'product-detail', params: { id } });
};
</script>

<style scoped>
/* 필요 시 페이지 전용 스타일 */
</style>
