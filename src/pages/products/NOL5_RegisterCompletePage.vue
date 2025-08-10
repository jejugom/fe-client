<template>
  <div class="flex flex-col gap-8 text-base">
    <div class="text-primary-300 text-2xl font-bold"
      >은행 방문 예약이 완료되었어요</div
    >

    <div class="flex flex-col gap-4">
      <InfoRow
        v-for="(item, index) in infoRows"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </div>

    <div>
      <span class="text-primary-300 font-semibold"
        >은행 방문 시, 아래 서류를 챙겨주세요</span
      >
      <ul class="mt-4 list-disc pl-5">
        <li
          v-for="(doc, index) in data?.docInfo?.requiredDocuments || []"
          :key="index"
        >
          {{ doc }}
        </li>
      </ul>
    </div>

    <ReserveCompleteBox />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  fetchReservedDetail,
  type Register,
} from '@/api/products/registerComplete';
import ReserveCompleteBox from './_components/ReserveCompleteBox.vue';
import InfoRow from './_components/InfoRow.vue';
import { useLoadingStore } from '@/stores/loading';

const route = useRoute();

const bookingCode = ref('');
const data = ref<Register | null>(null);
const loadingStore = useLoadingStore();

onMounted(async () => {
  // URL 쿼리 파라미터에서 bookingId 대신 bookingCode를 가져옵니다.
  const code = route.query.bookingCode as string;
  if (!code) return;

  bookingCode.value = code;
  loadingStore.startLoading();
  try {
    // API 호출 시 ID 대신 bookingCode를 사용 (백엔드 NHDR-229 Merge 후 사용가능)
    const result = await fetchReservedDetail(code);
    data.value = result;
  } catch (e) {
    console.error('예약 상세 조회 실패', e);
    loadingStore.setError(true);
  } finally {
    loadingStore.stopLoading();
  }
});

const formattedDateTime = computed(() => {
  if (!data.value) return '';
  return `${data.value.date.replace(/-/g, '/')} ${data.value.time}`;
});

const infoRows = computed(() => {
  if (!data.value) return [];
  return [
    { label: '상품명', value: data.value.prodName },
    { label: '지점명', value: data.value.branchName },
    { label: '날짜/시간', value: formattedDateTime.value },
    // 사용자에게 보여주는 예약 번호를 bookingCode로 변경
    { label: '예약 번호', value: data.value.bookingCode },
  ];
});
</script>
