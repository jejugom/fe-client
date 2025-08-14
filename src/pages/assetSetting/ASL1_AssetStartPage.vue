<template>
  <div class="flex flex-col gap-12">
    <!-- 개인정보 처리방침 -->
    <div class="space-y-4">
      <div class="space-y-2">
        <h2 class="text-primary-500 text-2xl font-bold">개인정보 처리방침</h2>
        <p class="text-surface-300">
          노후도락(이하 ‘당사’)은 「개인정보 보호법」 등 관련 법령을 준수하며,
          이용자의 개인정보를 안전하게 보호하고자 다음과 같이 개인정보
          처리방침을 안내드립니다.
        </p>
      </div>

      <!-- 항목 요약 목록 -->
      <div class="card-design space-y-4">
        <ul class="space-y-1">
          <li v-for="v in privateAllow" :key="v.title">{{ v.title }}</li>
        </ul>

        <!-- 동의 + 자세히 보기 -->
        <Btn
          color="primary"
          size="large"
          label="자세히 보기"
          @click="openPrivateModal"
        />
      </div>
    </div>

    <!-- 금융 거래 정보 처리방침 -->
    <div class="space-y-4">
      <div class="space-y-2">
        <h2 class="text-primary-500 text-2xl font-bold"
          >금융 거래 정보 처리방침</h2
        >
        <p class="text-surface-300">
          노후도락(이하 ‘당사’)은 「전자금융거래법」 및 「개인정보 보호법」 등
          관련 법령에 따라 금융 거래 정보를 안전하게 보호하며, 아래와 같이
          처리하고 있습니다.
        </p>
      </div>

      <!-- 항목 요약 목록 -->
      <div class="card-design space-y-4">
        <ul class="space-y-1">
          <li v-for="v in finAllow" :key="v.title">{{ v.title }}</li>
        </ul>

        <!-- 동의 + 자세히 보기 -->
        <Btn
          color="primary"
          size="large"
          label="자세히 보기"
          @click="openFinModal"
        />
      </div>
    </div>

    <!-- 선택 동의 -->
    <div class="space-y-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="agreePrivate" />
        <span class="">[필수] 개인정보 처리방침에 동의합니다.</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="agreeFin" />
        <span class="">[필수] 금융 거래 정보 처리방침에 동의합니다.</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="agreeMarketing" />
        <span class="">
          [선택] 마케팅 및 알림 수신에 동의합니다. (이벤트, 금융상품 소식 등)
        </span>
      </label>
    </div>

    <!-- 다음 버튼 -->
    <Btn
      :color="!canProceed ? 'surface' : 'primary'"
      size="large"
      label="다음으로"
      :disabled="!canProceed"
      @click="goNext"
    />

    <!-- 개인정보 처리방침 모달 -->
    <Modal
      v-if="isPrivateModalOpen"
      @close="isPrivateModalOpen = false"
      title="개인정보 처리방침"
      :leftLabel="'닫기'"
      :rightLabel="'확인'"
      @click1="() => (isPrivateModalOpen = false)"
      @click2="
        () => {
          agreePrivate = true;
          isPrivateModalOpen = false;
        }
      "
      class="max-h-[80vh]"
    >
      <div
        class="no-scrollbar flex max-h-[60vh] flex-col gap-4 overflow-y-auto"
      >
        <div
          v-for="v in privateAllow"
          :key="v.title"
          class="flex flex-col gap-2"
        >
          <div class="font-semibold">{{ v.title }}</div>
          <div
            class="text-surface-300 border-surface-200 rounded border p-3"
            v-html="v.content"
          />
        </div>
      </div>
    </Modal>

    <!-- 금융 거래 정보 처리방침 모달 -->
    <Modal
      v-if="isFinModalOpen"
      @close="isFinModalOpen = false"
      title="금융 거래 정보 처리방침"
      :leftLabel="'닫기'"
      :rightLabel="'확인'"
      @click1="() => (isFinModalOpen = false)"
      @click2="
        () => {
          agreeFin = true;
          isFinModalOpen = false;
        }
      "
      class="max-h-[80vh]"
    >
      <div
        class="no-scrollbar flex max-h-[60vh] flex-col gap-4 overflow-y-auto"
      >
        <div v-for="v in finAllow" :key="v.title" class="flex flex-col gap-2">
          <div class="font-semibold">{{ v.title }}</div>
          <div
            class="text-surface-300 border-surface-200 rounded border p-3"
            v-html="v.content"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';
import { privateAllow, finAllow } from '@/data/allowList';
import { useRouter } from 'vue-router';

const router = useRouter();

/* ---------------- state ---------------- */
const isPrivateModalOpen = ref(false);
const isFinModalOpen = ref(false);

let agreePrivate = ref(false); // [필수] 개인정보
let agreeFin = ref(false); // [필수] 금융거래
let agreeMarketing = ref(false); // [선택]

const canProceed = computed(() => agreePrivate.value && agreeFin.value);

/* ---------------- actions ---------------- */
function openPrivateModal() {
  isPrivateModalOpen.value = true;
}
function openFinModal() {
  isFinModalOpen.value = true;
}

function goNext() {
  if (!canProceed.value) return;
  router.push({ name: 'asset-kookmin-login' });
}
</script>
