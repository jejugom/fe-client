<template>
  <div class="flex flex-col gap-8 text-base">
    <div class="text-primary-300 text-2xl font-bold">방문 예약 완료</div>

    <!-- 예약 정보 -->

    <div class="grid grid-cols-[5rem_1fr] gap-y-4">
      <div class="text-primary-300 font-semibold">상품명</div>
      <div>{{ appointment.prod_code }}</div>

      <div class="text-primary-300 font-semibold">지점명</div>
      <div>{{ appointment.bank_name }}</div>

      <div class="text-primary-300 font-semibold">날짜/시간</div>
      <div>{{ formattedDateTime }}</div>

      <div class="text-primary-300 font-semibold">지점 전화</div>
      <div>{{ appointment.bank_tel }}</div>
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

// 날짜 + 시간 포맷팅
const formattedDateTime = `${appointment.date.replaceAll('-', '/')} ${appointment.time}`;
</script>
