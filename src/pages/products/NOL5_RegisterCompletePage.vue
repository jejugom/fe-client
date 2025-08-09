<template>
  <div class="flex flex-col gap-8 text-base">
    <div class="text-primary-300 text-2xl font-bold"
      >은행 방문 예약이 완료되었어요</div
    >

    <!-- 예약 정보 -->
    <div class="card-design py-8">
      <div class="flex flex-col gap-4">
        <InfoRow
          v-for="(item, index) in infoRows"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </div>

      <!-- 필요 서류 -->
      <div class="mt-8">
        <span class="text-primary-300 flex gap-1 font-semibold"
          >은행 방문 시, 아래 서류를
          <p class="text-gold">꼭!</p> 챙겨주세요</span
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

const bookingId = ref('');
const data = ref<Register | null>(null);
const loadingStore = useLoadingStore();

onMounted(async () => {
  const id = route.query.bookingId as string;
  if (!id) return;

  bookingId.value = id;
  loadingStore.startLoading();
  try {
    const result = await fetchReservedDetail(id);
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
    { label: '예약 번호', value: data.value.bookingId },
  ];
});
</script>
