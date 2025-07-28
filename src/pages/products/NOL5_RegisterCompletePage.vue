<template>
  <div class="flex flex-col gap-8 text-base">
    <div class="text-primary-300 text-2xl font-bold">방문 예약 완료</div>

    <!-- 예약 정보 -->

    <div class="flex flex-col gap-4">
      <InfoRow
        v-for="(item, index) in infoRows"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </div>

    <!-- 필요 서류 -->
    <div>
      <span class="text-primary-300 font-semibold">방문 시 지참할 서류</span>
      <ul class="mt-4 list-disc pl-5">
        <li
          v-for="(doc, index) in appointment.doc_info.required_documents"
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
import { appointment } from '@/pages/nohoo/_dummy';
import ReserveCompleteBox from './_components/ReserveCompleteBox.vue';
import InfoRow from './_components/InfoRow.vue';

// 날짜 + 시간 포맷팅
const formattedDateTime = `${appointment.date.replace(/-/g, '/')} ${appointment.time}`;

const infoRows = [
  { label: '상품명', value: appointment.prod_code },
  { label: '지점명', value: appointment.bank_name },
  { label: '날짜/시간', value: formattedDateTime },
  { label: '지점 전화', value: appointment.bank_tel },
];
</script>
