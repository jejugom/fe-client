<template>
    <teleport to="body">
        <div v-if="visible" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40"
            @click.self="emit('close')">
            <div class="w-[92%] max-w-md rounded-2xl bg-white shadow-xl">
                <!-- 헤더 -->
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-lg font-semibold">검색 조건을 입력하세요.</h3>
                    <button class="px-2 py-1 text-surface-500 hover:text-surface-700" @click="emit('close')">✕</button>
                </div>

                <!-- 바디 -->
                <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    <!-- 예금 / 적금 -->
                    <template v-if="category === '예금' || category === '적금'">
                        <div>
                            <p class="mb-2 font-medium">기간</p>
                            <div class="flex flex-wrap gap-3">
                                <label v-for="t in ['3', '6', '12', '24', '36']" :key="t"
                                    class="inline-flex items-center gap-2">
                                    <input type="checkbox" :value="t" v-model="(local as DepositFilters).terms" />
                                    <span>{{ t }}개월</span>
                                </label>
                            </div>
                        </div>

                        <div v-if="category === '예금'">
                            <p class="mb-2 mt-2 font-medium">금리 유형</p>
                            <div class="flex flex-wrap gap-3">
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="고정금리" v-model="(local as DepositFilters).rateTypes" />
                                    <span>고정</span>
                                </label>
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="변동금리" v-model="(local as DepositFilters).rateTypes" />
                                    <span>변동</span>
                                </label>
                            </div>
                        </div>

                        <div class="pt-2">
                            <label class="block mb-1 font-medium">최소 최고금리(%)</label>
                            <input type="number" step="0.01" class="w-full rounded-lg border px-3 py-2"
                                v-model.number="(local as DepositFilters | SavingFilters).minTopRate"
                                placeholder="예: 2.5" />
                        </div>
                    </template>

                    <!-- 펀드 -->
                    <template v-else-if="category === '펀드'">
                        <div>
                            <p class="mb-2 font-medium">위험등급</p>
                            <div class="flex flex-wrap gap-3">
                                <label v-for="g in ['1', '2', '3', '4', '5', '6']" :key="g"
                                    class="inline-flex items-center gap-2">
                                    <input type="checkbox" :value="g" v-model="(local as FundFilters).riskGrades" />
                                    <span>{{ g }}등급</span>
                                </label>
                            </div>
                        </div>
                        <div class="pt-2">
                            <label class="block mb-1 font-medium">최근 3개월 최소 수익률(%)</label>
                            <input type="number" step="0.01" class="w-full rounded-lg border px-3 py-2"
                                v-model.number="(local as FundFilters).min3mReturn" placeholder="예: 3" />
                        </div>
                    </template>

                    <!-- 주택담보 -->
                    <template v-else-if="category === '주택담보'">
                        <div>
                            <p class="mb-2 font-medium">담보 유형</p>
                            <div class="flex flex-wrap gap-3">
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="아파트" v-model="(local as MortgageFilters).mrtgTypes" />
                                    <span>아파트</span>
                                </label>
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="아파트외"
                                        v-model="(local as MortgageFilters).mrtgTypes" />
                                    <span>아파트외</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <p class="mb-2 mt-2 font-medium">금리 유형</p>
                            <div class="flex flex-wrap gap-3">
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="고정금리"
                                        v-model="(local as MortgageFilters).rateTypes" />
                                    <span>고정</span>
                                </label>
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="변동금리"
                                        v-model="(local as MortgageFilters).rateTypes" />
                                    <span>변동</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <p class="mb-2 mt-2 font-medium">상환 방식</p>
                            <div class="flex flex-wrap gap-3">
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="분할상환방식"
                                        v-model="(local as MortgageFilters).repayTypes" />
                                    <span>원리금분할</span>
                                </label>
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" value="만기일시상환방식"
                                        v-model="(local as MortgageFilters).repayTypes" />
                                    <span>만기일시</span>
                                </label>
                            </div>
                        </div>

                        <div class="pt-2">
                            <label class="block mb-1 font-medium">상한 금리(최저금리 기준, %)</label>
                            <input type="number" step="0.01" class="w-full rounded-lg border px-3 py-2"
                                v-model.number="(local as MortgageFilters).maxRateCeil" placeholder="예: 4.5" />
                        </div>

                        <!-- LTV 영역 (자동계산 + 툴팁) -->
                        <div class="pt-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="font-medium">LTV : </span>
                                <strong v-if="ltv !== null">{{ ltv }}%</strong>
                                <span v-else>-</span>
                                <span class="ml-2"></span>
                                <div class="relative group">
                                    <button type="button"
                                        class="w-5 h-5 leading-5 text-center rounded-full border text-xs"
                                        aria-label="LTV 설명">?</button>
                                    <div
                                        class="absolute left-0 mt-2 hidden w-72 rounded-md border bg-white p-3 text-sm text-gray-700 shadow-lg group-hover:block">
                                        LTV는 담보인정비율로 주택 가격 대비 대출금액의 비율이에요.
                                        (선순위채권·임차보증금 등은 없다고 가정한 단순 계산)
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block mb-1">주택가격(원)</label>
                                    <input type="text" inputmode="numeric" class="w-full rounded-lg border px-3 py-2"
                                        v-model="housePriceStr" placeholder="예: 300,000,000" autocomplete="off" />
                                </div>
                                <div>
                                    <label class="block mb-1">대출금액(원)</label>
                                    <input type="text" inputmode="numeric" class="w-full rounded-lg border px-3 py-2"
                                        v-model="loanAmountStr" placeholder="예: 100,000,000" autocomplete="off" />
                                </div>
                            </div>



                        </div>
                    </template>

                    <!-- 기타 탭 -->
                    <template v-else>
                        <p class="text-surface-500">이 탭은 필터가 없어요.</p>
                    </template>
                </div>

                <!-- 푸터 -->
                <div class="flex justify-end gap-2 p-4 border-t">
                    <button class="px-4 py-2 rounded-lg border hover:bg-surface-50" @click="reset">초기화</button>
                    <button class="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600" @click="apply">
                        적용
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { reactive, watch, toRaw, computed } from 'vue';

// 쉼표 포맷터
const moneyFmt = new Intl.NumberFormat('ko-KR');
const toMoney = (v: number | null | undefined) =>
  v == null || Number.isNaN(Number(v)) ? '' : moneyFmt.format(Number(v));
const fromMoney = (s: string) => {
  const n = Number(String(s).replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : null;
};

// 표시용 문자열 <-> 실제 숫자값 동기화
const housePriceStr = computed<string>({
  get() {
    return toMoney((local as any).housePrice);
  },
  set(val: string) {
    (local as any).housePrice = fromMoney(val);
  },
});

const loanAmountStr = computed<string>({
  get() {
    return toMoney((local as any).loanAmount);
  },
  set(val: string) {
    (local as any).loanAmount = fromMoney(val);
  },
});

/* ===== 타입 ===== */
export type DepositFilters = {
    terms?: string[];
    rateTypes?: string[];
    minTopRate?: number | null;
};
export type SavingFilters = {
    terms?: string[];
    savingKinds?: string[];
    minTopRate?: number | null;
};
export type FundFilters = {
    riskGrades?: string[];
    min3mReturn?: number | null;
};
export type MortgageFilters = {
    mrtgTypes?: string[];
    rateTypes?: string[];
    repayTypes?: string[];
    maxRateCeil?: number | null;
};
export type AnyFilters =
    | DepositFilters
    | SavingFilters
    | FundFilters
    | (MortgageFilters & { housePrice?: number | null; loanAmount?: number | null; calcLtv?: number | null })
    | Record<string, never>;

const props = defineProps<{
    visible: boolean;
    category: '예금' | '적금' | '펀드' | '주택담보' | string;
    initialFilters?: AnyFilters;
}>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'apply', payload: AnyFilters): void }>();

/* ===== 로컬 상태 ===== */
const local = reactive<AnyFilters>({});

/* ===== LTV 계산 ===== */
const ltv = computed<number | null>(() => {
    const hp = Number((local as any).housePrice ?? 0);
    const loan = Number((local as any).loanAmount ?? 0);
    if (!hp || !loan) return null;
    const ratio = (loan / hp) * 100;
    if (!isFinite(ratio)) return null;
    return Math.round(ratio * 10) / 10; // 소수 1자리
});

/* ===== 유틸: 체크박스 배열 보장 ===== */
function ensureArray(obj: any, key: string) {
    if (!Array.isArray(obj[key])) obj[key] = [];
}
function ensureForCategory(cat: string) {
    if (cat === '예금') {
        ensureArray(local, 'terms');
        ensureArray(local, 'rateTypes');
        if ((local as any).minTopRate === undefined) (local as any).minTopRate = null;
    } else if (cat === '적금') {
        ensureArray(local, 'terms');
        ensureArray(local, 'savingKinds');
        if ((local as any).minTopRate === undefined) (local as any).minTopRate = null;
    } else if (cat === '펀드') {
        ensureArray(local, 'riskGrades');
        if ((local as any).min3mReturn === undefined) (local as any).min3mReturn = null;
    } else if (cat === '주택담보') {
        ensureArray(local, 'mrtgTypes');
        ensureArray(local, 'rateTypes');
        ensureArray(local, 'repayTypes');
        if ((local as any).maxRateCeil === undefined) (local as any).maxRateCeil = null;
        if ((local as any).housePrice === undefined) (local as any).housePrice = null;
        if ((local as any).loanAmount === undefined) (local as any).loanAmount = null;
    }
}

/* ===== 워처 ===== */
watch(
    () => props.initialFilters,
    (v) => {
        for (const k of Object.keys(local)) delete (local as any)[k];
        Object.assign(local, v ?? {});
        ensureForCategory(props.category);
    },
    { immediate: true }
);
watch(
    () => props.category,
    (cat) => ensureForCategory(cat),
    { immediate: true }
);

/* ===== 액션 ===== */
function reset() {
    for (const k of Object.keys(local)) delete (local as any)[k];
    ensureForCategory(props.category);
}
function apply() {
    const payload = { ...toRaw(local) } as AnyFilters;
    (payload as any).calcLtv = ltv.value; // 계산된 LTV 동봉
    emit('apply', payload);
}
</script>
