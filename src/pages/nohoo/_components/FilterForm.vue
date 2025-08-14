<template>
  <!-- 예금 -->
  <div v-if="category === '예금'" class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">예치기간</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="m in ['6', '12', '24', '36']"
          :key="m"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="m" v-model="local.terms" />
          <span>{{ m }}개월</span>
        </label>
      </div>
    </div>
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">최고금리 하한(%)</h3>
      <InputBox
        type="number"
        step="0.1"
        v-model.number="local.minTopRate"
        placeholder="예: 3.5"
        size="medium"
      />
    </div>
  </div>

  <!-- 적금 -->
  <div v-else-if="category === '적금'" class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">예치기간</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="m in ['6', '12', '24', '36']"
          :key="m"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="m" v-model="local.terms" />
          <span>{{ m }}개월</span>
        </label>
      </div>
    </div>
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">최고금리 하한(%)</h3>
      <InputBox
        type="number"
        step="0.1"
        v-model.number="local.minTopRate"
        placeholder="예: 3.5"
        size="medium"
      />
    </div>
  </div>

  <!-- 펀드 -->
  <div v-else-if="category === '펀드'" class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">위험등급</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="g in ['1', '2', '3', '4', '5', '6', '7']"
          :key="g"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="g" v-model="local.riskGrades" />
          <span>{{ g }}</span>
        </label>
      </div>
    </div>
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">3개월 수익률 하한(%)</h3>
      <InputBox
        type="number"
        step="0.1"
        v-model.number="local.min3mReturn"
        placeholder="예: 2.0"
        size="medium"
    /></div>
  </div>

  <!-- 주택담보 -->
  <div v-else-if="category === '주택담보'" class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">금리유형</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="t in ['고정금리', '변동금리', '혼합금리']"
          :key="t"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="t" v-model="local.rateTypes" />
          <span>{{ t }}</span>
        </label>
      </div>
    </div>
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">담보유형</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="m in ['아파트', '연립주택', '단독주택', '오피스텔']"
          :key="m"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="m" v-model="local.mrtgTypes" />
          <span>{{ m }}</span>
        </label>
      </div>
    </div>
  </div>

  <!-- 주택담보 -->
  <div v-else-if="category === '주택담보'" class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-primary-500 font-semibold">금리유형</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="t in ['고정금리', '변동금리', '혼합금리']"
          :key="t"
          class="flex items-center gap-2"
        >
          <input type="checkbox" :value="t" v-model="local.rateTypes" />
          <span>{{ t }}</span>
        </label>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="font-semibold">담보유형</h3>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="m in ['아파트', '연립주택', '단독주택', '오피스텔']"
          :key="m"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="m" v-model="local.mrtgTypes" />
          <span>{{ m }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputBox from '@/components/forms/InputBox.vue';
import { reactive, watch } from 'vue';

type AnyFilters = Record<string, any>;

const props = defineProps<{
  category: string;
  filters?: AnyFilters;
}>();
const emit = defineEmits<{ (e: 'update:filters', v: AnyFilters): void }>();

const local = reactive<AnyFilters>({
  // 배열로 초기화
  terms: [],
  rateTypes: [],
  savingKinds: [],
  riskGrades: [],
  mrtgTypes: [],
  repayTypes: [],
  minTopRate: null,
  min3mReturn: null,
  maxRateCeil: null,
  calcLtv: null,
});

// 배열 강제 함수
function asArray(v: any) {
  return Array.isArray(v) ? [...v] : [];
}

// 부모 → 자식 동기화(정규화)
watch(
  () => [props.category, props.filters],
  () => {
    const f = props.filters ?? {};
    local.terms = asArray(f.terms);
    local.rateTypes = asArray(f.rateTypes);
    local.savingKinds = asArray(f.savingKinds);
    local.riskGrades = asArray(f.riskGrades);
    local.mrtgTypes = asArray(f.mrtgTypes);
    local.repayTypes = asArray(f.repayTypes);

    // 숫자류는 그대로(없으면 null)
    local.minTopRate = f.minTopRate ?? null;
    local.min3mReturn = f.min3mReturn ?? null;
    local.maxRateCeil = f.maxRateCeil ?? null;
    local.calcLtv = f.calcLtv ?? null;
  },
  { immediate: true }
);

// 자식 → 부모
watch(local, (v) => emit('update:filters', JSON.parse(JSON.stringify(v))), {
  deep: true,
});
</script>
