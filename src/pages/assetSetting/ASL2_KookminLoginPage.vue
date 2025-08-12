<template>
  <!-- 상단 안내 문구 (카드 밖) -->
  <div class="card-design py-8">
    <h1 class="text-primary-500 mb-8 text-center text-2xl font-bold">
      {{ authStore.userName }}님, 안녕하세요!
    </h1>
    <div class="flex flex-col items-center gap-4 text-center">
      <div>
        <p class="text-lg font-semibold">더 정확한 서비스 제공을 위해서</p>
        <p class="mb-4 text-lg font-semibold"
          ><span class="text-primary-300">자산 연동</span>을 진행하겠습니다.</p
        >
      </div>
      <div>
        <p>
          <span class="text-gold font-semibold">국민은행</span>에 있는 내 자산을
          불러오기 위해<br />
          <span class="text-gold font-semibold">국민은행</span> 홈페이지에
          로그인해요.
        </p>
      </div>
      <div>
        입력하신 정보는 오직 자산 확인 용도로만 사용돼요.<br />
        안전하니 걱정 마시고 진행하셔도 됩니다.
      </div>
    </div>

    <!-- 중앙 입력 카드 -->
    <div
      class="px-auto mt-8 mb-4 flex flex-col items-center justify-center gap-4"
    >
      <!-- 입력 필드 -->
      <LoginForm
        :credentials="credentials"
        @update:credentials="credentials = $event"
      />
    </div>
    <div class="flex justify-end">
      <TextBtn
        label="ID/PW 찾기"
        size="small"
        @click="openKbFindUrl"
        class="text-surface-300 text-sm"
      />
    </div>
  </div>
  <BtnSet
    label1="건너뛰기"
    label2="연동하기"
    @click1="handleSkip"
    @click2="handleAssetSync"
    type="type2"
    class="mt-16"
  />
  <!-- 아이디 오류 알럿 -->
  <Alert v-if="alertOpen" @click="alertOpen = false">
    <div class="text-center whitespace-pre-line">{{ alertMsg }}</div>
  </Alert>

  <Confirm
    v-if="confirm.open"
    :title="confirm.title"
    :leftLabel="confirm.left"
    :rightLabel="confirm.right"
    @click1="
      confirm.onLeft?.();
      confirm.open = false;
    "
    @click2="
      confirm.onRight?.();
      confirm.open = false;
    "
  >
    <p class="text-center whitespace-pre-line">{{ confirm.message }}</p>
  </Confirm>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import LoginForm from './_components/LoginForm.vue';
import { codefApi } from '@/api/asset/codef';
import { useLoadingStore } from '@/stores/loading';
import BtnSet from '@/components/buttons/BtnSet.vue';
import Alert from '@/components/modals/Alert.vue';
import Confirm from '@/components/modals/Confirm.vue';
import TextBtn from '@/components/buttons/TextBtn.vue';

const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();

const credentials = ref({
  id: '',
  password: '',
});

const alertOpen = ref(false);
const alertMsg = ref('');

function openAlert(msg: string) {
  alertMsg.value = msg;
  alertOpen.value = true;
}

const confirm = reactive<{
  open: boolean;
  title: string;
  message: string;
  left: string;
  right: string;
  onLeft?: () => void;
  onRight?: () => void;
}>({
  open: false,
  title: '',
  message: '',
  left: '',
  right: '',
});

function openConfirm(opts: Partial<typeof confirm>) {
  Object.assign(
    confirm,
    { open: true, title: '', message: '', left: '닫기', right: '' },
    opts
  );
}

// 모든 값이 채워졌는지 여부
const isFormFilled = computed(
  () =>
    credentials.value.id.trim() !== '' &&
    credentials.value.password.trim() !== ''
);

// 건너뛰기 버튼 처리
const handleSkip = () => {
  router.push({ name: 'asset-custom-quiz' });
};

// Enter 키 이벤트 처리
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && isFormFilled.value) {
    handleAssetSync();
  }
};

// 컴포넌트 마운트 시 Enter 키 이벤트 등록
onMounted(() => {
  window.addEventListener('keypress', handleKeyPress);
});

// 컴포넌트 언마운트 시 Enter 키 이벤트 제거
onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyPress);
});

const KB_FIND_URL =
  'https://obank1.kbstar.com/quics?page=C018897&QViewPC=Y#loading';

function openKbFindUrl() {
  window.open(KB_FIND_URL, '_blank');
}

const handleAssetSync = async () => {
  if (!isFormFilled.value) {
    openConfirm({
      title: '',
      message: '아이디와 비밀번호를 모두 입력해주세요.',
      left: '다시 시도하기',
      right: 'ID/PW 찾기',
      onLeft: () => {
        confirm.open = false;
      },
      // 새 탭 이동이 안전. 앱을 떠나도 괜찮다면 location.href = KB_FIND_URL 사용
      onRight: openKbFindUrl,
    });
    return;
  }
  loadingStore.startLoading();
  try {
    // CODEF 국민은행 API 연동 요청 데이터
    const requestData = {
      accountList: [
        {
          countryCode: 'KR',
          businessType: 'BK',
          clientType: 'P', // 개인
          organization: '0004', // 국민은행 코드
          loginType: '1', // 0: 공인인증서 로그인, 1: IDPW 로그인
          password: credentials.value.password,
          id: credentials.value.id,
          birthday: '', // 선택 사항
        },
      ],
    };

    // CODEF API 호출
    const response = await codefApi.connect(requestData);

    console.log('자산 연동 성공:', response);

    // 현재 route의 쿼리 파라미터 확인
    const isFromProfile = route.query.from === 'profile';

    if (isFromProfile) {
      // 프로필에서 시작한 경우 -> 프로필 페이지로 돌아가기
      router.push({ name: 'profile' });
    } else {
      // 회원가입 과정인 경우 -> 다음 스텝으로 이동
      router.push({ name: 'asset-custom-quiz' });
    }
  } catch (error: any) {
    console.error('자산 연동 실패:', error);
    const detail = error?.response?.data?.detail as string;

    if (detail && detail.includes('아이디/비밀번호')) {
      openConfirm({
        title: '비밀번호 오류',
        message:
          '은행 아이디와 비밀번호가 올바르지 않습니다.\n다시 확인해주세요.',
        left: '다시 시도하기',
        right: 'ID/PW 찾기',
        onLeft: () => {
          confirm.open = false;
        },
        onRight: () => window.open(KB_FIND_URL, '_blank'),
      });
    }
    // 에러 메시지 표시
    else if (error.code === 'ECONNABORTED') {
      openAlert(
        '자산 연동 처리 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.'
      );
    } else if (error.response?.status === 401) {
      openAlert('국민은행 로그인 정보가 올바르지 않습니다. 다시 확인해주세요.');
    } else if (error.response?.status === 500) {
      openAlert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      openAlert('자산 연동 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  } finally {
    loadingStore.stopLoading();
  }
};
</script>
