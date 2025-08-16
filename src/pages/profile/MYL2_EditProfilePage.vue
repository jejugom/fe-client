<template>
  <div>
    <h2 class="text-primary-500 mb-8 text-2xl font-bold">내 정보 고치기</h2>
    <div class="card-design py-8">
      <div class="space-y-8">
        <EditInputBox
          title="이메일"
          type="text"
          placeholder="이메일 입력"
          :readOnly="true"
          v-model="email"
        />
        <EditInputBox
          title="이름"
          type="text"
          placeholder="이름 입력"
          v-model="userName"
        />
        <EditInputBox
          title="전화번호"
          type="text"
          placeholder="전화번호 입력"
          v-model="userPhone"
        />
        <EditInputBox
          title="생년월일"
          type="date"
          placeholder="생년월일 입력"
          v-model="birth"
          :displayFormatter="formatKoreanDate"
        />
      </div>
    </div>
    <div class="mt-16">
      <Btn
        label="수정하기"
        color="primary"
        size="large"
        @click="updateProfile"
      />
    </div>
  </div>
  <Alert v-if="showAlert" @click="onAlertConfirm">
    <p>{{ alertMessage }}</p>
  </Alert>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import Alert from '@/components/modals/Alert.vue';
import { profileApi } from '@/api/profile/profile';
import EditInputBox from './_components/EditInputBox.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const userName = ref('');
const userPhone = ref('');
const birth = ref(''); // 내부 형식: YYYY-MM-DD
const showAlert = ref(false);
const alertMessage = ref('');
const isSuccessAlert = ref(false);

// 화면 표시용 포맷터
function formatKoreanDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${y}년 ${m.padStart(2, '0')}월 ${d.padStart(2, '0')}일`;
}

// 알럿 확인 버튼 클릭
function onAlertConfirm() {
  showAlert.value = false;
  if (isSuccessAlert.value) {
    isSuccessAlert.value = false; // Reset flag
    router.push({ name: 'profile' });
  }
}

// 사용자 프로필 조회
async function fetchUserProfile() {
  try {
    const userProfile = await profileApi.getUserProfile();
    email.value = userProfile.email ?? '';
    userName.value = userProfile.userName ?? '';
    userPhone.value = userProfile.userPhone ?? '';
    birth.value = userProfile.birth ?? ''; // 백엔드에서 YYYY-MM-DD로 내려오는 값
  } catch (error) {
    // console.error('프로필 조회 실패:', error);
    alertMessage.value = '프로필 정보를 불러오는데 실패했습니다.';
    showAlert.value = true;
  }
}

// 프로필 수정
async function updateProfile() {
  try {
    await profileApi.updateUserProfile({
      userName: userName.value,
      userPhone: userPhone.value,
      birth: birth.value, // 그대로 YYYY-MM-DD 전송
    });
    alertMessage.value = '프로필 정보가 성공적으로 업데이트되었습니다.';
    isSuccessAlert.value = true;
    showAlert.value = true;
  } catch (error) {
    // console.error('프로필 업데이트 실패:', error);
    alertMessage.value = '프로필 정보 업데이트에 실패했습니다.';
    isSuccessAlert.value = false;
    showAlert.value = true;
  }
}

onMounted(fetchUserProfile);
</script>
