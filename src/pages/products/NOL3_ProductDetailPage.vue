<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg :items="topInfos" v-if="topInfos.length" />

    <!-- ★ 펀드: 3개월 일일 수익률 그래프 -->
    <section v-if="isFund && fundReturn.length">
      <p class="text-primary-300 mb-2 font-semibold">3개월 일일 수익률</p>
      <FundReturnChart :fundReturn="fundReturn" />
    </section>

    <!-- 추천 이유 -->
    <div class="stroke-secondary flex flex-col gap-2 rounded-xl px-6 py-4">
      <span class="text-secondary-500 text-lg font-semibold">추천 이유</span>
      <span>{{ detail?.recReason || '추천 사유 없음' }}</span>
    </div>

    <!-- 성향 점수 -->
    <div v-if="detail?.tendency !== undefined" class="text-base">
      <p class="text-primary-300 mb-1 font-semibold">성향 점수</p>
      <p>{{ detail.tendency }}</p>
    </div>

    <!-- 상품 기본 정보 -->
    <div class="flex flex-col gap-4">
      <div class="text-base" v-if="detail?.finPrdtNm">
        <p class="text-primary-300 mb-1 font-semibold">상품명</p>
        <p>{{ detail?.finPrdtNm }}</p>
      </div>

      <div v-if="detail?.description">
        <p class="text-primary-300 mb-1 font-semibold">설명</p>
        <p class="whitespace-pre-line">{{ detail?.description || '설명 없음' }}</p>
      </div>

      <div v-if="detail?.etcNote">
        <p class="text-primary-300 mb-1 font-semibold">기타 참고사항</p>
        <ul class="list-disc space-y-1 pl-4">
          <li v-for="(item, idx) in etcNoteList" :key="idx" class="leading-relaxed">{{ item! }}</li>
        </ul>
      </div>

      <div v-if="detail?.joinWay || detail?.joinMember || detail?.joinDeny">
        <p class="text-primary-300 mb-1 font-semibold">가입 조건</p>
        <ul class="list-disc pl-4">
          <li v-if="detail?.joinWay">가입 방법: {{ detail.joinWay }}</li>
          <li v-if="detail?.joinMember">가입 대상: {{ detail.joinMember }}</li>
          <li v-if="detail?.joinDeny">가입 제한: {{ detail.joinDeny === '1' ? '제한 있음' : '제한 없음' }}</li>
        </ul>
      </div>

      <div v-if="detail?.korCoNm">
        <p class="text-primary-300 mb-1 font-semibold">금융기관 정보</p>
        <ul class="list-disc pl-4">
          <li>은행명: {{ detail.korCoNm }}</li>
          <li>상품 코드: {{ detail.finPrdtCd }}</li>
        </ul>
      </div>

      <div v-if="detail?.mtrtInt">
        <p class="text-primary-300 mb-1 font-semibold">중도 해지 이율</p>
        <ul class="list-disc space-y-1 pl-4">
          <li v-for="(item, idx) in mtrtIntList" :key="idx" class="leading-relaxed">{{ item! }}</li>
        </ul>
      </div>

      <div v-if="detail?.spclCnd">
        <p class="text-primary-300 mb-1 font-semibold">우대 조건</p>
        <ul class="list-disc space-y-1 pl-4">
          <li v-for="(item, idx) in spclCndList" :key="idx" class="leading-relaxed">{{ item! }}</li>
        </ul>
      </div>
    </div>

    <!-- 옵션 테이블: 예금/적금 -->
    <div v-if="depositOptions.length">
      <p class="text-primary-300 mb-2 font-semibold">금리 정보</p>
      <table class="w-full table-auto border-collapse overflow-hidden text-center text-sm">
        <thead class="bg-surface-100 font-semibold">
          <tr>
            <th class="border-surface-200 border px-4 py-2">기간</th>
            <th class="border-surface-200 border px-4 py-2">기본 금리(%)</th>
            <th class="border-surface-200 border px-4 py-2">최고 금리(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(opt, idx) in depositOptions" :key="idx">
            <td class="border-surface-200 border px-4 py-2">{{ opt.saveTrm }}개월</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.intrRate.toFixed(2) }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.intrRate2.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 옵션 테이블: 펀드 -->
    <div v-if="fundOptions.length">
      <p class="text-primary-300 mb-2 font-semibold">펀드 정보</p>
      <table class="w-full table-auto border-collapse overflow-hidden text-center text-sm">
        <thead class="bg-surface-100 font-semibold">
          <tr>
            <th class="border-surface-200 border px-4 py-2">순자산 (운용펀드기준)</th>
            <th class="border-surface-200 border px-4 py-2">환매 수수료</th>
            <th class="border-surface-200 border px-4 py-2">기준가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(opt, idx) in fundOptions" :key="idx">
            <td class="border-surface-200 border px-4 py-2">{{ opt.assetTotal }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.feeRedemp =='없음' ? '매입금액의 1% 이하' : opt.feeRedemp }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.priceStd }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 옵션 테이블: 주담대 -->
    <div v-if="mortgageOptions.length">
      <p class="text-primary-300 mb-2 font-semibold">대출 조건</p>
      <table class="w-full table-auto border-collapse overflow-hidden text-center text-sm">
        <thead class="bg-surface-100 font-semibold">
          <tr>
            <th class="border-surface-200 border px-4 py-2">담보 유형</th>
            <th class="border-surface-200 border px-4 py-2">상환 방식</th>
            <th class="border-surface-200 border px-4 py-2">금리 유형</th>
            <th class="border-surface-200 border px-4 py-2">최저 금리</th>
            <th class="border-surface-200 border px-4 py-2">최고 금리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(opt, idx) in mortgageOptions" :key="idx">
            <td class="border-surface-200 border px-4 py-2">{{ opt.mrtgTypeNm }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.rpayTypeNm }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.lendRateTypeNm }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.lendRateMin }}</td>
            <td class="border-surface-200 border px-4 py-2">{{ opt.lendRateMax }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 가입 예약 버튼 -->
    <div>
      <p class="text-primary-300 mb-2 text-center font-semibold">은행에서 상담받고 가입하실 수 있어요</p>
      <Btn color="primary" label="상담 예약하기" size="large" @click="goToRegister" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchProductDetail,
  fetchFundReturn,            // ★ 추가
  type ProductDetail,
  type Option,
  type MortgageOption,
  type FundOption,
} from '@/api/products/productDetail';

import DetailImg from './_components/DetailImg.vue';
import FundReturnChart from './_components/FundReturnChart.vue'; // ★ 추가
import Btn from '@/components/buttons/Btn.vue';
import { useRegisterStore } from '@/stores/register';
import { useLoadingStore } from '@/stores/loading';

const route = useRoute();
const router = useRouter();

const registerStore = useRegisterStore();
const loadingStore = useLoadingStore();

const detail = ref<ProductDetail | null>(null);
const fundReturn = ref<{ recordDate: string; returnRate: number }[]>([]); // ★ 추가
const isFund = computed(() => detail.value?.finPrdtCategory === '5');      // ★ 추가

onMounted(async () => {
  const id = route.params.id as string;
  if (!id) return;
  loadingStore.startLoading();
  try {
    const raw = await fetchProductDetail(id); // { product, fundReturn? } 또는 ProductDetail
    const result: any = raw.product ?? raw;

    // 옵션 안전 변환 (기존 로직 유지)
    if (Array.isArray(result?.optionList)) {
      if (['1', '2'].includes(result.finPrdtCategory)) {
        result.optionList = result.optionList.map((o: any) => ({
          ...o, saveTrm: o?.saveTrm ?? null, intrRate: Number(o?.intrRate ?? 0), intrRate2: Number(o?.intrRate2 ?? 0),
        }));
      } else if (result.finPrdtCategory === '3') {
        result.optionList = result.optionList.map((o: any) => ({
          ...o,
          mrtgTypeNm: String(o?.mrtgTypeNm ?? ''), rpayTypeNm: String(o?.rpayTypeNm ?? ''),
          lendRateTypeNm: String(o?.lendRateTypeNm ?? ''), lendRateMin: String(o?.lendRateMin ?? ''),
          lendRateMax: String(o?.lendRateMax ?? ''),
        }));
      } else if (result.finPrdtCategory === '5') {
        result.optionList = result.optionList.map((o: any) => ({
          ...o,
          rate3mon: String(o?.rate3mon ?? ''), riskGrade: String(o?.riskGrade ?? ''),
          priceStd: String(o?.priceStd ?? ''), totalFee: o?.totalFee != null ? String(o.totalFee) : undefined,
        }));
      }
    }

    detail.value = result;

    // ★ 펀드면 3개월 수익률 로드 (서버가 같이 준 경우 우선 사용)
    if (result?.finPrdtCategory === '5') {
      fundReturn.value = Array.isArray(raw.fundReturn) ? raw.fundReturn : await fetchFundReturn(result.finPrdtCd, '3m');
    }
  } catch (e) {
    console.error('상품 상세 조회 실패', e);
    loadingStore.setError(true);
  } finally {
    loadingStore.stopLoading();
  }
});

const goToRegister = () => {
  if (!detail.value) return;
  registerStore.setProductName(detail.value.finPrdtNm);
  registerStore.setTopInfos(topInfos.value);
  router.push({ name: 'register', params: { id: detail.value.finPrdtCd } });
};

const etcNoteList = computed<string[]>(() => {
  if (!detail.value?.etcNote) return [];
  return String(detail.value.etcNote)
    .split('\n')
    .flatMap((line) => line.split('-'))
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0);
});

const mtrtIntList = computed<string[]>(() => {
  if (!detail.value?.mtrtInt) return [];
  return String(detail.value.mtrtInt)
    .split('\n')
    .flatMap((line) => line.split('-'))
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0);
});

const spclCndList = computed(() => {
  if (!detail.value?.spclCnd) return [];
  return String(detail.value.spclCnd)
    .split('\n')
    .flatMap((line) => line.split('-'))
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0);
});

// 타입 가드
function isOption(option: any): option is Option { return 'saveTrm' in option; }
function isMortgageOption(option: any): option is MortgageOption { return 'mrtgTypeNm' in option; }
function isFundOption(option: any): option is FundOption { return 'rate3mon' in option; }

// 옵션 computed
const depositOptions = computed(() => {
  if (['1', '2'].includes(detail.value?.finPrdtCategory ?? '') && Array.isArray(detail.value?.optionList)) {
    return detail.value.optionList.filter(isOption) as Option[];
  }
  return [];
});

const fundOptions = computed(() => {
  if (detail.value?.finPrdtCategory === '5' && Array.isArray(detail.value?.optionList)) {
    return detail.value.optionList.filter(isFundOption) as FundOption[];
  }
  return [];
});

const mortgageOptions = computed(() => {
  if (detail.value?.finPrdtCategory === '3' && Array.isArray(detail.value?.optionList)) {
    return detail.value.optionList.filter(isMortgageOption) as MortgageOption[];
  }
  return [];
});

// 상단 대표 정보
const topInfos = computed(() => {
  if (!detail.value) return [];
  const d = detail.value;

  switch (d.finPrdtCategory) {
    case '1':
    case '2':
      const depositRates = depositOptions.value.map((o) => o.intrRate2);
      return [
        { label: '최고금리', value: depositRates.length ? `${Math.max(...depositRates).toFixed(2)}%` : '-' },
        { label: '가입방법', value: d.joinWay ?? '-' },
        { label: '가입제한', value: d.joinDeny === '1' ? '제한 있음' : '제한 없음' },
      ];
    case '3':
      const minRates = mortgageOptions.value.map((o) => parseFloat(o.lendRateMin ?? '999'));
      return [
        { label: '대출금리', value: minRates.length ? `최저 ${Math.min(...minRates).toFixed(2)}%` : '-' },
        { label: '담보유형', value: mortgageOptions.value[0]?.mrtgTypeNm ?? '-' },
        { label: '금리유형', value: mortgageOptions.value[0]?.lendRateTypeNm ?? '-' },
      ];
    case '4':
      return [
        { label: '매매단위', value: d.lot ?? '-' },
        { label: '통화', value: d.currency ?? '-' },
        { label: '가입방법', value: d.joinWay ?? '-' },
      ];
    case '5':
      const riskGradeMap: Record<number, string> = {
        1: '매우 높은 위험',
        2: '높은 위험',
        3: '다소 높은 위험',
        4: '다소 낮은 위험',
        5: '낮은 위험',
        6: '매우 낮은 위험'
      };
      return [
        { label: '3개월 수익률', value: fundOptions.value[0]?.rate3mon?.toString() + '%' ?? '-' },
        {
          label: '위험등급',
          value: riskGradeMap[fundOptions.value[0]?.riskGrade] ?? '-'
        },
        { label: '총보수', value: fundOptions.value[0]?.totalFee?.toString() + '%' ?? '-' },
      ];
    default:
      return [];
  }
});
</script>
