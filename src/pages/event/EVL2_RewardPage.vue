<template>
  <div class="mx-auto max-w-6xl p-6">
    <!-- 헤더 -->
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-primary-600 text-2xl font-bold">보상 선택하기</h1>
        <p class="text-surface-500 mt-1 text-sm"
          >모은 포인트로 원하는 보상을 교환하세요.</p
        >
      </div>

      <!-- 내 포인트 -->
      <div
        class="border-surface-200 rounded-xl border bg-white px-4 py-2 text-sm"
      >
        보유 포인트:
        <b class="text-primary-600 tabular-nums">{{ points }}</b
        >P
      </div>
    </div>

    <!-- 알림 -->
    <div
      v-if="notice"
      class="mb-4 rounded-lg bg-emerald-50 p-3 text-emerald-800"
    >
      {{ notice }}
    </div>
    <div v-if="error" class="mb-4 rounded-lg bg-rose-50 p-3 text-rose-700">
      {{ error }}
    </div>

    <!-- 필터/검색 -->
    <div
      class="border-surface-200 mb-6 grid grid-cols-1 gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div class="flex items-center gap-2">
        <label class="text-surface-600 text-sm">카테고리</label>
        <select
          v-model="filter.category"
          class="border-surface-300 w-full rounded-lg border bg-white px-3 py-2 text-sm"
        >
          <option value="ALL">전체</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-surface-600 text-sm">정렬</label>
        <select
          v-model="sort"
          class="border-surface-300 w-full rounded-lg border bg-white px-3 py-2 text-sm"
        >
          <option value="popular">인기순</option>
          <option value="low">낮은 포인트순</option>
          <option value="high">높은 포인트순</option>
          <option value="name">이름순</option>
        </select>
      </div>

      <div class="sm:col-span-2 lg:col-span-2">
        <input
          v-model.trim="filter.keyword"
          type="text"
          placeholder="보상명 검색 (예: 커피, 기프티콘)"
          class="border-surface-300 w-full rounded-lg border bg-white px-3 py-2 text-sm"
        />
      </div>
    </div>

    <!-- 보상 그리드 -->
    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="r in filteredRewards"
        :key="r.id"
        class="group border-surface-200 relative flex flex-col overflow-hidden rounded-2xl border bg-white"
      >
        <div class="bg-surface-100 h-36 w-full">
          <img
            v-if="r.image"
            :src="r.image"
            alt=""
            class="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>

        <div class="flex flex-1 flex-col gap-2 p-4">
          <div class="flex items-start justify-between gap-2">
            <h3 class="line-clamp-2 text-base leading-snug font-semibold">
              {{ r.name }}
            </h3>
            <span
              class="bg-surface-100 text-surface-600 shrink-0 rounded-md px-2 py-0.5 text-xs"
              >{{ r.category }}</span
            >
          </div>

          <p class="text-surface-600 line-clamp-2 min-h-[2.5rem] text-sm">
            {{ r.desc }}
          </p>

          <div class="mt-auto flex items-center justify-between">
            <div class="text-sm">
              <span class="font-semibold tabular-nums">{{ r.point }}</span
              >P
              <span
                v-if="r.stock === 0"
                class="ml-2 rounded-md bg-rose-100 px-2 py-0.5 text-xs text-rose-700"
                >품절</span
              >
            </div>

            <button
              class="rounded-lg px-3 py-2 text-sm text-white transition-colors"
              :class="
                canRedeem(r)
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-surface-300'
              "
              :disabled="!canRedeem(r)"
              @click="openConfirm(r)"
            >
              교환
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 교환 내역 -->
    <div class="border-surface-200 mt-10 rounded-2xl border bg-white">
      <div class="border-surface-200 border-b p-4">
        <h2 class="text-lg font-semibold">내 교환 내역</h2>
      </div>

      <div v-if="history.length === 0" class="text-surface-600 p-4 text-sm">
        아직 교환한 보상이 없어요.
      </div>

      <ul v-else class="divide-y">
        <li
          v-for="h in history"
          :key="h.txId"
          class="flex items-center justify-between p-4"
        >
          <div class="min-w-0">
            <p class="truncate font-medium">{{ h.name }}</p>
            <p class="text-surface-500 mt-0.5 text-xs">
              {{ new Date(h.ts).toLocaleString() }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-primary-600 font-semibold tabular-nums"
              >-{{ h.point }}P</p
            >
            <p class="text-surface-500 text-xs">잔여: {{ h.remain }}P</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 확인 모달 -->
    <div
      v-if="confirmTarget"
      class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
    >
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div class="border-surface-200 border-b p-4">
          <h3 class="text-lg font-semibold">교환 확인</h3>
        </div>
        <div class="p-4">
          <p class="text-surface-700">
            <b>{{ confirmTarget.name }}</b
            >을(를) <b class="tabular-nums">{{ confirmTarget.point }}</b
            >P로 교환할까요?
          </p>
          <p class="text-surface-500 mt-2 text-sm">
            교환 후 잔여 포인트:
            <b class="tabular-nums">{{ points - confirmTarget.point }}</b
            >P
          </p>
        </div>
        <div class="border-surface-200 flex justify-end gap-2 border-t p-3">
          <button
            class="border-surface-300 hover:bg-surface-50 rounded-lg border bg-white px-4 py-2 text-sm"
            @click="confirmTarget = null"
          >
            취소
          </button>
          <button
            class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm text-white"
            @click="redeem"
          >
            교환하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type Reward = {
  id: string;
  name: string;
  point: number;
  category: string;
  desc?: string;
  image?: string;
  stock: number;
  popularity?: number; // 큰 값일수록 인기
};

type HistoryItem = {
  txId: string;
  rewardId: string;
  name: string;
  point: number;
  ts: number;
  remain: number;
};

// ===== Mock 데이터 (원하면 API 연동 부분으로 교체) =====
const defaultRewards: Reward[] = [
  {
    id: 'gift-coffee-1',
    name: '커피 기프티콘 (아메리카노)',
    point: 1200,
    category: 'e쿠폰',
    desc: '어느 카페에서나 달콤한 휴식!',
    image:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop',
    stock: 20,
    popularity: 95,
  },
  {
    id: 'gift-movie-1',
    name: '영화 예매권',
    point: 3000,
    category: 'e쿠폰',
    desc: '주말엔 시원한 영화관으로!',
    image:
      'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop',
    stock: 10,
    popularity: 88,
  },
  {
    id: 'gift-candle-1',
    name: '아로마 캔들',
    point: 2500,
    category: '리빙',
    desc: '편안한 향기로 집을 채우세요.',
    image:
      'https://images.unsplash.com/photo-1516054575922-6060eca2d984?q=80&w=1200&auto=format&fit=crop',
    stock: 6,
    popularity: 70,
  },
  {
    id: 'gift-steps-1',
    name: '만보 달성 보너스 500P',
    point: 0,
    category: '포인트',
    desc: '걸음 챌린지 보너스! (무료 수령)',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    stock: 9999,
    popularity: 50,
  },
  {
    id: 'gift-eco-1',
    name: '친환경 쇼핑백',
    point: 1800,
    category: '리빙',
    desc: '튼튼하고 예쁜 에코백.',
    image:
      'https://images.unsplash.com/photo-1629198735660-c22b84f08a7d?q=80&w=1200&auto=format&fit=crop',
    stock: 0,
    popularity: 60,
  },
];

const LS_POINTS = 'reward_points';
const LS_REWARDS = 'reward_catalog';
const LS_HISTORY = 'reward_history';

// ===== 상태 =====
const points = ref<number>(0);
const rewards = ref<Reward[]>([]);
const history = ref<HistoryItem[]>([]);
const error = ref('');
const notice = ref('');

const filter = ref({ category: 'ALL', keyword: '' });
const sort = ref<'popular' | 'low' | 'high' | 'name'>('popular');
const confirmTarget = ref<Reward | null>(null);

const categories = computed(() => {
  const set = new Set(rewards.value.map((r) => r.category));
  return Array.from(set);
});

// ===== 로컬스토리지 유틸 =====
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ===== 초기화 =====
onMounted(() => {
  // 포인트가 없다면 초깃값 3,000P 지급 (원하면 0으로 바꿔)
  const p = loadJSON<number>(LS_POINTS, 3000);
  points.value = p;

  // 카탈로그/히스토리 로드
  rewards.value = loadJSON<Reward[]>(LS_REWARDS, defaultRewards);
  history.value = loadJSON<HistoryItem[]>(LS_HISTORY, []);
});

// ===== 파생 =====
const filteredRewards = computed(() => {
  let list = rewards.value.slice();

  // 필터
  if (filter.value.category !== 'ALL') {
    list = list.filter((r) => r.category === filter.value.category);
  }
  if (filter.value.keyword) {
    const kw = filter.value.keyword.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(kw) ||
        (r.desc ?? '').toLowerCase().includes(kw)
    );
  }

  // 정렬
  switch (sort.value) {
    case 'low':
      list.sort((a, b) => a.point - b.point);
      break;
    case 'high':
      list.sort((a, b) => b.point - a.point);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }

  return list;
});

// ===== 액션 =====
function canRedeem(r: Reward) {
  return r.stock > 0 && points.value >= r.point;
}

function openConfirm(r: Reward) {
  error.value = '';
  if (!canRedeem(r)) {
    error.value =
      r.stock === 0 ? '해당 보상은 품절입니다.' : '포인트가 부족합니다.';
    return;
  }
  confirmTarget.value = r;
}

function redeem() {
  if (!confirmTarget.value) return;
  const r = confirmTarget.value;

  if (!canRedeem(r)) {
    error.value = '교환할 수 없습니다.';
    confirmTarget.value = null;
    return;
  }

  // 차감/재고 감소
  points.value -= r.point;
  r.stock -= 1;

  // 히스토리 기록
  const tx: HistoryItem = {
    txId: `${r.id}-${Date.now()}`,
    rewardId: r.id,
    name: r.name,
    point: r.point,
    ts: Date.now(),
    remain: points.value,
  };
  history.value.unshift(tx);

  // 저장
  saveJSON(LS_POINTS, points.value);
  saveJSON(LS_REWARDS, rewards.value);
  saveJSON(LS_HISTORY, history.value);

  // UX 메시지
  notice.value = `'${r.name}' 교환이 완료되었습니다. 🎉`;
  confirmTarget.value = null;

  // 3초 뒤 안내문 숨김
  setTimeout(() => (notice.value = ''), 3000);
}
</script>
