import { ref } from 'vue';

const KEY = 'app.fontSizePx';
const DEFAULT_PX = 14;

const currentPx = ref<number>(DEFAULT_PX);

function apply(px: number) {
  document.documentElement.style.fontSize = `${px}px`;
  currentPx.value = px;
}

function init() {
  const stored = Number(localStorage.getItem(KEY));
  const px = Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_PX;
  apply(px);
}

function set(px: number) {
  localStorage.setItem(KEY, String(px));
  apply(px);
}

function get() {
  return currentPx.value;
}

export function useFontSize() {
  return { init, set, get, apply, KEY, DEFAULT_PX };
}
