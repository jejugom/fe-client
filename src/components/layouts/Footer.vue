<template>
  <footer
    class="bg-surface-200 text-surface-600 relative left-1/2 w-screen max-w-[600px] -translate-x-1/2 px-6 py-8 text-sm"
  >
    <div class="grid gap-8 md:grid-cols-3">
      <!-- 유틸리티 & 정책 -->
      <div class="space-y-2">
        <h3 class="font-semibold">정책</h3>
        <ul class="space-y-1">
          <li
            ><span @click="openModal('private')" class="cursor-pointer"
              >개인정보 처리방침</span
            ></li
          >
          <li
            ><span @click="openModal('financial')" class="cursor-pointer"
              >이용약관</span
            ></li
          >
          <li
            ><span @click="openModal('copyright')" class="cursor-pointer"
              >저작권 처리 방침</span
            ></li
          >
        </ul>
      </div>

      <!-- 고객 서비스 -->
      <div class="space-y-2">
        <h3 class="font-semibold">고객 서비스</h3>
        <ul class="space-y-1">
          <li @click="router.push({ name: 'asset-tutorial' })">사용 가이드</li>
          <li>
            <a
              href="https://github.com/jejugom"
              target="_blank"
              rel="noopener noreferrer"
              class=""
            >
              GitHub
            </a>
          </li>
          <li>
            <a href="tel:1588-9999" class=""> 전화: 1588-9999 (국민은행) </a>
          </li>
        </ul>
      </div>

      <!-- 저작권 -->
      <div class="text-surface-500 flex flex-col justify-end text-xs">
        <p>© 2025 노후도락. All rights reserved.</p>
        <p>KB IT's Your Life 6기 최종 프로젝트</p>
        <p> 본 서비스는 KB금융그룹과 무관한 비영리 프로젝트입니다.</p>
      </div>
    </div>
  </footer>

  <Alert
    v-if="isModalOpen"
    @close="isModalOpen = false"
    :title="currentPolicyTitle"
    :label="'닫기'"
    @click="isModalOpen = false"
    class="max-h-[80vh]"
  >
    <div class="no-scrollbar flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
      <div
        v-for="(item, index) in currentPolicyContent"
        :key="index"
        class="flex flex-col gap-2"
      >
        <div class="font-semibold">{{ item.title }}</div>
        <div
          class="text-surface-300 border-surface-200 rounded border p-3"
          v-html="item.content"
        />
      </div>
    </div>
  </Alert>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { privateAllow, termsAllow, copyrightAllow } from '@/data/allowList';
import Alert from '@/components/modals/Alert.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isModalOpen = ref(false);
const currentPolicyTitle = ref('');
const currentPolicyContent = ref<{ title: string; content: string }[]>([]);

function openModal(policyType: 'private' | 'financial' | 'copyright') {
  isModalOpen.value = true;
  if (policyType === 'private') {
    currentPolicyTitle.value = '개인정보 처리방침';
    currentPolicyContent.value = privateAllow;
  } else if (policyType === 'financial') {
    currentPolicyTitle.value = '금융정보 처리방침';
    currentPolicyContent.value = termsAllow;
  } else if (policyType === 'copyright') {
    currentPolicyTitle.value = '저작권 정책';
    currentPolicyContent.value = copyrightAllow;
  }
}
</script>
