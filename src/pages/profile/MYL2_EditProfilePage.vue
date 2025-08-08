<template>
  <div class="space-y-16">
    <h2 class="text-primary-300 mb-2 text-2xl font-bold">내 정보 고치기</h2>

    <div class="space-y-4">
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
      />
    </div>

    <div class="mt-6">
      <Btn
        label="수정하기"
        color="primary"
        size="large"
        @click="updateProfile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import { profileApi } from '@/api/profile/profile';
import EditInputBox from './_components/EditInputBox.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const userName = ref('');
const userPhone = ref('');
const birth = ref('');

const fetchUserProfile = async () => {
  try {
    const userProfile = await profileApi.getUserProfile();
    email.value = userProfile.email;
    userName.value = userProfile.userName;
    userPhone.value = userProfile.userPhone;
    birth.value = userProfile.birth;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    alert('프로필 정보를 불러오는데 실패했습니다.');
  }
};

const updateProfile = async () => {
  try {
    const updateData = {
      userName: userName.value,
      userPhone: userPhone.value,
      birth: birth.value,
    };
    await profileApi.updateUserProfile(updateData);
    alert('프로필 정보가 성공적으로 업데이트되었습니다.');
    router.push({ name: 'profile' }); // 프로필 페이지로 이동
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    alert('프로필 정보 업데이트에 실패했습니다.');
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped></style>
