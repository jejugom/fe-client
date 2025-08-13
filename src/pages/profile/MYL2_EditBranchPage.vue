<template>
  <!-- 현재 위치 표시 -->
  <div class="mb-8">
    <h2 class="text-primary-500 mb-2 text-2xl font-bold">
      나의 국민은행 지점 설정
    </h2>
    <p class="font-semibold">현재 위치: {{ currentAddress }}</p>
    <!-- 현재 설정된 지점 표시 -->
    <div
      v-if="currentBranch"
      class="stroke-primary bg-primary-100 my-2 w-full rounded-lg p-4"
    >
      현재 설정된 지점:
      <span class="text-primary-500 ml-2 text-base font-semibold">{{
        currentBranch
      }}</span>
    </div>
  </div>

  <!-- 검색 영역 -->
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <InputBox
        placeholder="지점 입력 (예: 광진구)"
        size="medium"
        type="text"
        class="flex-1"
        v-model="searchQuery"
      />
      <Btn @click="searchPlaces" color="primary" label="검색" size="square" />
    </div>

    <!-- 선택된 지점 표시 -->
    <div
      v-if="displaySelectedBranchName"
      class="stroke-secondary bg-secondary-100 w-full rounded-lg p-4"
    >
      선택한 지점:
      <span class="font-semibold">{{ displaySelectedBranchName }}</span>
    </div>

    <!-- 지도 영역 -->
    <div id="map" class="stroke-secondary mb-8 h-96 w-full rounded-lg"></div>
  </div>

  <!-- 하단 버튼 -->
  <BtnSet
    label1="건너뛰기"
    label2="설정하기"
    @click1="handleSkip"
    @click2="handleComplete"
    type="type2"
  />
  <!-- 지점 설정 완료 -->
  <Alert v-if="showSuccessAlert" @click="onAlertConfirm">
    <p>
      지점 "{{ displaySelectedBranchName }}"이(가) 성공적으로 설정되었습니다.
    </p>
  </Alert>
  <!-- 지점 설정 실패 시 -->
  <Alert v-if="showErrorAlert" @click="showErrorAlert = false">
    <p>
      {{ errorAlertMessage }}
    </p>
  </Alert>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import BtnSet from '@/components/buttons/BtnSet.vue';
import Alert from '@/components/modals/Alert.vue';
import { branchApi } from '@/api/user/branch';
import { branchList } from '@/data/branchList';

interface KakaoPlace {
  place_name: string;
  x: string;
  y: string;
}

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const currentAddress = ref('');
const selectedBranch = ref('');
const displaySelectedBranchName = ref(''); // UI에 표시될 전체 지점명
const currentBranch = ref(''); // 현재 설정된 지점
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);
const errorAlertMessage = ref('');
let map: kakao.maps.Map;

function searchPlaces() {
  const ps = new kakao.maps.services.Places();

  ps.keywordSearch(
    `국민은행 ${searchQuery.value}`,
    (data: KakaoPlace[], status: string) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();

        data.forEach((place: KakaoPlace) => {
          const pos = new kakao.maps.LatLng(Number(place.y), Number(place.x));
          const marker = new kakao.maps.Marker({ map, position: pos });

          kakao.maps.event.addListener(marker, 'click', () => {
            displaySelectedBranchName.value = place.place_name; // UI에 표시될 전체 지점명
            selectedBranch.value = place.place_name
              .replace(/KB국민은행\s*/g, '')
              .replace(/점/g, '')
              .trim(); // 로직에 사용될 간소화된 지점명
          });

          bounds.extend(pos);
        });

        map.setBounds(bounds);
      }
    }
  );
}

function normalizeBranchName(name: string) {
  return name
    .replace(/KB국민은행\s*/g, '')
    .replace(/점/g, '')
    .trim();
}

function onAlertConfirm() {
  showSuccessAlert.value = false;
  const from = q(route.query.from);
  if (from === 'profile') {
    router.push({ name: 'profile' });
  } else {
    router.push({ name: 'asset-signup-complete' });
  }
}

function q(v: unknown) {
  return Array.isArray(v) ? String(v[0] ?? '') : v != null ? String(v) : '';
}

function handleSkip() {
  const from = q(route.query.from);

  if (from === 'profile') {
    router.push({ name: 'profile' });
  } else {
    router.push({ name: 'asset-signup-complete' });
  }
}

async function handleComplete() {
  if (!selectedBranch.value) {
    errorAlertMessage.value = '지점을 선택해주세요.';
    showErrorAlert.value = true;
    return;
  }

  try {
    const branchData = branchList.find(
      (b) => normalizeBranchName(b.name) === selectedBranch.value
    );

    if (!branchData) {
      errorAlertMessage.value =
        '선택한 지점을 찾을 수 없습니다. 다시 선택해주세요.';
      showErrorAlert.value = true;
      return;
    }

    await branchApi.setMyBranch({ branchId: branchData.id });
    currentBranch.value = displaySelectedBranchName.value; // 현재 지점 업데이트
    showSuccessAlert.value = true;
  } catch (error) {
    // console.error('지점 설정 실패:', error);
    errorAlertMessage.value =
      '지점 설정 중 오류가 발생했습니다. 다시 시도해주세요.';
    showErrorAlert.value = true;
  }
}

onMounted(async () => {
  try {
    const myBranch = await branchApi.getMyBranch();
    currentBranch.value = myBranch.branchName;
  } catch (error) {
    // console.error('내 지점 정보 조회 실패:', error);
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const locPosition = new kakao.maps.LatLng(lat, lng);

    map = new kakao.maps.Map(document.getElementById('map') as HTMLElement, {
      center: locPosition,
      level: 3,
    });

    new kakao.maps.Marker({ map, position: locPosition });

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(lng, lat, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        currentAddress.value = result[0].address_name;
        searchQuery.value = result[0].address_name || '';
        searchPlaces();
      }
    });
  });
});
</script>

<style scoped></style>
