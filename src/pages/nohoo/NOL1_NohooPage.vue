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
          <option value="name">상품명순</option>

          <option v-if="selectedTab === '맞춤'" value="score"
            >맞춤점수순</option
          >

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
    title="나에게 찾는 상품은?"
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

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const loadingStore = useLoadingStore();

const data = ref<ParsedApiResponse | null>(null);
const selectedTab = ref<
  '맞춤' | '금' | '예금' | '적금' | '펀드' | '주택담보' | '신탁'
>('맞춤');
const sortOption = ref<string>('name');
const news = ref<News[]>([]);

/* 탭 <-> 코드 */
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

/* 초기 로드 */
onMounted(async () => {
  loadingStore.startLoading();
  try {
    const result = await fetchNohooData();
    if (route.query.tab) selectedTab.value = route.query.tab as any;

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
  } finally {
    loadingStore.stopLoading();
  }
});

/* 공통 표시 */
const filteredNews = computed(() => {
  const category = PRODUCT_CATEGORY_MAP[selectedTab.value];
  return category ? news.value.filter((n) => n.category === category) : [];
});
const userInfo = computed<UserInfo | undefined>(() => data.value?.userInfo);
const userName = computed(() => userInfo.value?.userName ?? '');
const assetInfo = computed(() => userInfo.value?.assetStatus ?? []);
const totalAsset = computed(() =>
  assetInfo.value.reduce(
    (acc: number, cur: { amount: number }) => acc + cur.amount,
    0
  )
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
  assetInfo.value.map((i: { assetCategoryCode: string; amount: number }) => ({
    category: ASSET_CATEGORY_MAP[i.assetCategoryCode] ?? '기타',
    amount: i.amount,
  }))
);

/* 탭 이동 시 초기화 */
watch(selectedTab, async () => {
  if (selectedTab.value === '맞춤') {
    sortOption.value = 'score';
  } else if (selectedTab.value === '예금' || selectedTab.value === '적금') {
    sortOption.value = 'rateDesc'; // 최고금리순
  } else if (selectedTab.value === '주택담보') {
    sortOption.value = 'rateAsc'; // 최저금리순
  } else if (selectedTab.value === '펀드') {
    sortOption.value = 'returnDesc'; // 최고수익률순
  } else {
    sortOption.value = 'name';
  }
  serverFiltered.value = null;

  // 탭 바뀌고 DOM 갱신된 뒤 맨 위로
  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* 맞춤 추천 */
const recommendedProducts = computed(() => {
  const recommendItems = data.value?.customRecommendPrdt ?? [];
  const products = productStore
    .getProductsByRecommendIds(recommendItems)
    .map((product) => {
      const score = Number(
        recommendItems.find((r) => r.finPrdtCd === product.finPrdtCd)?.score ??
          '0'
      );
      const tags = [
        `적합도 ${(score * 100).toFixed(1)}% | ${CATEGORY_LABEL_MAP[product.finPrdtCategory] ?? '기타'}`,
      ];
      return { ...product, tags, score };
    });
  return sortOption.value === 'score'
    ? [...products].sort((a, b) => b.score - a.score)
    : [...products].sort((a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm));
});

/* 필터 모달 상태 */
const isFilterOpen = ref(false);
const canFilter = computed(() =>
  ['예금', '적금', '펀드', '주택담보'].includes(selectedTab.value)
);
const filtersByTab = ref<Record<string, NohooFilters>>({});
const currentFilters = computed<NohooFilters>(
  () => filtersByTab.value[selectedTab.value] ?? {}
);
const draftFilters = ref<NohooFilters>({}); // 모달 내부 임시

function openFilter() {
  const cur = currentFilters.value || {};
  draftFilters.value = {
    terms: Array.isArray((cur as any).terms) ? [...(cur as any).terms] : [],
    rateTypes: Array.isArray((cur as any).rateTypes)
      ? [...(cur as any).rateTypes]
      : [],
    savingKinds: Array.isArray((cur as any).savingKinds)
      ? [...(cur as any).savingKinds]
      : [],
    riskGrades: Array.isArray((cur as any).riskGrades)
      ? [...(cur as any).riskGrades]
      : [],
    mrtgTypes: Array.isArray((cur as any).mrtgTypes)
      ? [...(cur as any).mrtgTypes]
      : [],
    repayTypes: Array.isArray((cur as any).repayTypes)
      ? [...(cur as any).repayTypes]
      : [],
    minTopRate: (cur as any).minTopRate ?? null,
    min3mReturn: (cur as any).min3mReturn ?? null,
    maxRateCeil: (cur as any).maxRateCeil ?? null,
    calcLtv: (cur as any).calcLtv ?? null,
  };
  isFilterOpen.value = true;
}
function handleReset() {
  draftFilters.value = {};
}
async function handleApply() {
  filtersByTab.value[selectedTab.value] = JSON.parse(
    JSON.stringify(draftFilters.value)
  );
  isFilterOpen.value = false;

  loadingStore.startLoading();
  try {
    serverFiltered.value = await fetchFilteredProducts(
      selectedTab.value,
      draftFilters.value
    );
  } catch (e) {
    console.error('filtered fetch fail', e);
    serverFiltered.value = [];
  } finally {
    loadingStore.stopLoading();
  }
}

/* 리스트 구성/정렬 (기본: 12개월 표기 유지) */
const serverFiltered = ref<any[] | null>(null);

function buildLocalListFor(tab: string): any[] {
  if (tab === '예금') {
    return productStore.allProducts.timeDeposits.map((p: any) => {
      const optionList = p.optionList ?? [];
      const option12 = optionList.find(
        (opt: any) => String(opt.saveTrm) === '12'
      );
      const tags = option12
        ? ['12개월', `최고금리 ${Number(option12.intrRate2).toFixed(2)}%`]
        : [];
      const maxRate = option12
        ? Number(option12.intrRate2)
        : Math.max(
            ...optionList.map((opt: any) => Number(opt.intrRate2 ?? 0)),
            0
          );
      return { ...p, tags, maxRate };
    });
  }
  if (tab === '적금') {
    return productStore.allProducts.savingsDeposits.map((p: any) => {
      const optionList = p.optionList ?? [];
      const option12 = optionList.find(
        (opt: any) => String(opt.saveTrm) === '12'
      );
      const tags = option12
        ? ['12개월', `최고금리 ${Number(option12.intrRate2).toFixed(2)}%`]
        : [];
      const maxRate = option12
        ? Number(option12.intrRate2)
        : Math.max(
            ...optionList.map((opt: any) => Number(opt.intrRate2 ?? 0)),
            0
          );
      return { ...p, tags, maxRate };
    });
  }
  if (tab === '주택담보') {
    return productStore.allProducts.mortgageLoan.map((p: any) => {
      const optionList = p.optionList ?? [];
      const minRate = Math.min(
        ...optionList.map((opt: any) => parseFloat(opt.lendRateMin ?? '999')),
        999
      );

      const tags: string[] = [];
      if (isFinite(minRate) && minRate < 999) tags.push(`최저금리 ${minRate}%`);

      return { ...p, maxRate: minRate, tags };
    });
  }
  if (tab === '금') {
    return productStore.allProducts.goldProducts.map((p: any) => ({
      ...p,
      tags: [],
    }));
  }
  if (tab === '펀드') {
    return productStore.allProducts.fundProducts.map((p: any) => {
      const optionList = p.optionList ?? [];
      const first = optionList[0] ?? {};
      const risk = String(first.riskGrade ?? p.riskGrade ?? '').trim();
      const r3m = parseFloat((first.rate3mon ?? p.rate3mon ?? '0').toString());

      const maxReturn = Math.max(
        ...optionList.map((opt: any) =>
          parseFloat((opt.rate3mon ?? '0').toString())
        ),
        0
      );

      const tags: string[] = [];
      if (risk) tags.push(`위험등급 ${risk}`);
      return { ...p, maxRate: maxReturn, tags };
    });
  }
  if (tab === '신탁') {
    return productStore.allProducts.trustProducts.map((p: any) => ({
      ...p,
      tags: [],
    }));
  }
  return [];
}

function sortForTab(list: any[], tab: string, mode: string) {
  if (mode === 'name') {
    return [...list].sort((a, b) => a.finPrdtNm.localeCompare(b.finPrdtNm));
  }
  if (mode === 'score') {
    return [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  // 금리 정렬
  if (mode === 'rateDesc' || mode === 'returnDesc')
    return [...list].sort((a, b) => (b.maxRate ?? 0) - (a.maxRate ?? 0));
  if (mode === 'rateAsc' || mode === 'returnAsc' || mode === 'return3mon')
    return [...list].sort((a, b) => (a.maxRate ?? 999) - (b.maxRate ?? 999));

  // 펀드 추가 정렬
  if (mode === 'riskGrade')
    return [...list].sort((a, b) => (a.riskGrade ?? 99) - (b.riskGrade ?? 99));
  if (mode === 'returnPrice')
    return [...list].sort((a, b) => (b.priceStd ?? 0) - (a.priceStd ?? 0));

  return list;
}

const shownProducts = computed(() => {
  const tab = selectedTab.value;
  const base =
    serverFiltered.value && canFilter.value
      ? serverFiltered.value
      : buildLocalListFor(tab);
  return sortForTab(base, tab, sortOption.value);
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

/* ====== 여기부터: “왜 이 카드가 걸렸는지” 태그/정렬을 매칭 옵션 기준으로 ====== */
// 예금용 태그/정렬값 생성
function buildDepositTags(
  p: any,
  f: { terms?: string[]; rateTypes?: string[] }
) {
  const opts = p.optionList ?? [];

  // 1) 기간 필터가 있으면 그 기간만, 없으면 전체
  let cand =
    !f.terms || f.terms.length === 0
      ? opts
      : opts.filter((o: any) => f.terms!.includes(String(o.saveTrm)));

  // 2) 금리유형 필터가 있으면 유형 일치만
  if (f.rateTypes && f.rateTypes.length) {
    const typeOf = (o: any) => p.intrRateTypeNm ?? p.rateType ?? '고정금리';
    cand = cand.filter((o: any) => f.rateTypes!.includes(typeOf(o)));
  }

  if (cand.length === 0) return { maxRate: 0, tags: [] };

  // 3) 후보 중 최고금리 옵션을 기준으로 표기
  const best = cand.reduce(
    (acc: any, cur: any) =>
      Number(cur.intrRate2 ?? 0) > Number(acc.intrRate2 ?? 0) ? cur : acc,
    cand[0]
  );
  const tags = [
    `${best.saveTrm}개월`,
    `최고금리 ${Number(best.intrRate2 ?? 0).toFixed(2)}%`,
  ];
  const typeLabel = p.intrRateTypeNm ?? p.rateType ?? '';
  if (typeLabel) tags.push(typeLabel);
  return { maxRate: Number(best.intrRate2 ?? 0), tags };
}

// 적금용 태그/정렬값 생성
function buildSavingTags(p: any, f: { terms?: string[] }) {
  const opts = p.optionList ?? [];
  let cand =
    !f.terms || f.terms.length === 0
      ? opts
      : opts.filter((o: any) => f.terms!.includes(String(o.saveTrm)));
  if (cand.length === 0) return { maxRate: 0, tags: [] };
  const best = cand.reduce(
    (acc: any, cur: any) =>
      Number(cur.intrRate2 ?? 0) > Number(acc.intrRate2 ?? 0) ? cur : acc,
    cand[0]
  );
  const tags = [
    `${best.saveTrm}개월`,
    `최고금리 ${Number(best.intrRate2 ?? 0).toFixed(2)}%`,
  ];
  return { maxRate: Number(best.intrRate2 ?? 0), tags };
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

/* (샘플) 서버 필터 자리 */
async function fetchFilteredProducts(category: string, filters: NohooFilters) {
  await new Promise((r) => setTimeout(r, 200)); // demo 딜레이
  const all =
    {
      예금: productStore.allProducts.timeDeposits,
      적금: productStore.allProducts.savingsDeposits,
      펀드: productStore.allProducts.fundProducts,
      주택담보: productStore.allProducts.mortgageLoan,
    }[category] ?? [];
  return frontFilterMock(category, filters, all);
}

function frontFilterMock(category: string, filters: NohooFilters, list: any[]) {
  if (category === '예금') {
    const f = filters as {
      terms?: string[];
      rateTypes?: string[];
      minTopRate?: number;
    };
    return list
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const hitTerm =
          !f.terms?.length ||
          opts.some((o: any) => f.terms!.includes(String(o.saveTrm)));
        const rateType = p.intrRateTypeNm ?? p.rateType ?? '고정금리';
        const hitType = !f.rateTypes?.length || f.rateTypes!.includes(rateType);
        const topAll = Math.max(
          ...opts.map((o: any) => Number(o.intrRate2 || 0)),
          0
        );
        const hitRate = f.minTopRate == null || topAll >= f.minTopRate!;
        return hitTerm && hitType && hitRate;
      })
      .map((p: any) => {
        // 선택한 조건(terms, rateTypes)으로 매칭된 옵션을 기준으로 태그/정렬값 생성
        const { maxRate, tags } = buildDepositTags(p, f);
        return { ...p, maxRate, tags };
      });
  }

  if (category === '적금') {
    const f = filters as {
      terms?: string[];
      savingKinds?: string[];
      minTopRate?: number;
    };
    return list
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const hitTerm =
          !f.terms?.length ||
          opts.some((o: any) => f.terms!.includes(String(o.saveTrm)));
        const kind = p?.savingKind || p?.accType || '정액적립식';
        const hitKind = !f.savingKinds?.length || f.savingKinds!.includes(kind);
        const topAll = Math.max(
          ...opts.map((o: any) => Number(o.intrRate2 || 0)),
          0
        );
        const hitRate = f.minTopRate == null || topAll >= f.minTopRate!;
        return hitTerm && hitKind && hitRate;
      })
      .map((p: any) => {
        const { maxRate, tags } = buildSavingTags(p, f);
        return { ...p, maxRate, tags };
      });
  }

  if (category === '펀드') {
    const f = filters as { riskGrades?: string[]; min3mReturn?: number };
    return list
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const first = opts[0] ?? {};
        const max3m = Math.max(
          ...opts.map((o: any) => parseFloat((o.rate3mon ?? '0').toString())),
          0
        );
        const hitRisk =
          !f.riskGrades?.length ||
          f.riskGrades!.includes(String(first.riskGrade));
        const hitRet = f.min3mReturn == null || max3m >= f.min3mReturn!;
        return hitRisk && hitRet;
      })
      .map((p: any) => {
        const opts = p.optionList ?? [];
        const max3m = Math.max(
          ...opts.map((o: any) => parseFloat((o.rate3mon ?? '0').toString())),
          0
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
  }

  if (category === '주택담보') {
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
      .filter((p: any) => {
        const opts = p.optionList ?? [];
        const minRate = Math.min(
          ...opts.map((o: any) => parseFloat(o.lendRateMin ?? '999')),
          999
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
      .map((p: any) => {
        const opts = p.optionList ?? [];
        const minRate = Math.min(
          ...opts.map((o: any) => parseFloat(o.lendRateMin ?? '999')),
          999
        );
        const first = opts[0] ?? {};
        const tags = [
          `최저금리 ${isFinite(minRate) ? minRate.toFixed(2) : '-'}% | `,
        ];
        if (first.lendRateTypeNm) tags.push(first.lendRateTypeNm);
        if (first.mrtgTypeNm) tags.push(first.mrtgTypeNm);
        return { ...p, maxRate: minRate, tags };
      });
  }

  return list;
}

/* 이동 */
const goToDetail = (id: string) => {
  if (!id) return;
  router.push({ name: 'product-detail', params: { id } });
};
</script>
