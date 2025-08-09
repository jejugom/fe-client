import { defineStore } from 'pinia';

export type ChallengeId = 'quiz' | 'park' | 'number';

type RewardState = {
  date: string; // yyyy-mm-dd
  completed: Record<ChallengeId, boolean>;
};

const STORAGE_KEY = 'reward_state_v1';

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function load(): RewardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw) as RewardState;
    // 날짜가 바뀌면 초기화
    if (parsed.date !== todayStr()) throw new Error('expired');
    return parsed;
  } catch {
    return {
      date: todayStr(),
      completed: { quiz: false, park: false, number: false },
    };
  }
}

function save(state: RewardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const useRewardStore = defineStore('reward', {
  state: (): RewardState => load(),
  getters: {
    isCompleted: (s) => (id: ChallengeId) => !!s.completed[id],
    completedCount: (s) => Object.values(s.completed).filter(Boolean).length,
    allCompleted: (s) => Object.values(s.completed).every(Boolean),
  },
  actions: {
    complete(id: ChallengeId) {
      // 날짜 넘어갔으면 리셋 후 처리
      if (this.date !== todayStr()) {
        this.date = todayStr();
        this.completed = { quiz: false, park: false, number: false };
      }
      this.completed[id] = true;
      save(this.$state);
    },
    resetToday() {
      this.date = todayStr();
      this.completed = { quiz: false, park: false, number: false };
      save(this.$state);
    },
  },
});
