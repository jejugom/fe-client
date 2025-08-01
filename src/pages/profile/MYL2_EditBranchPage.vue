<template>
  <!-- guno: featured from wina's branch select modal -->

  <!-- 현재 위치 표시 -->
  <div class="mb-8">
    <h2 class="text-primary-300 mb-2 text-2xl font-bold">
      나의 국민은행 지점 설정
    </h2>
    <p class="text-surface-500 font-semibold"
      >현재 위치: {{ currentAddress }}</p
    >
  </div>

  <!-- 검색 영역 -->
  <div class="flex flex-col">
    <div class="mb-6 flex items-center gap-2">
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
      v-if="selectedBranch"
      class="bg-secondary-100 mb-4 w-full rounded-lg p-3"
    >
      선택한 지점:
      <span class="text-secondary-500 ml-2 text-base font-semibold">{{
        selectedBranch
      }}</span>
    </div>

    <!-- 지도 영역 -->
    <div id="map" class="stroke-secondary mb-8 h-96 w-full rounded-lg"></div>
  </div>

  <!-- 하단 버튼 -->
  <BtnSet
    label1="건너뛰기"
    label2="설정하기"
    @click2="handleComplete"
    type="type2"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import BtnSet from '@/components/buttons/BtnSet.vue';
// import { branchApi } from '@/api/user/branch'; // 백엔드 수정 후 활성화 예정

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
let map: kakao.maps.Map;

/* 백엔드 수정 후 활성화 예정
// 지점 이름에서 branchId 생성하는 임시 함수
// 실제로는 백엔드에 branchName으로 branchId를 조회하는 API가 필요
const generateBranchId = (branchName: string): number => {
  // DB에 실제로 존재하는 작은 범위의 ID 사용 (1-10)
  let hash = 0;
  for (let i = 0; i < branchName.length; i++) {
    const char = branchName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash) % 10 + 1; // 1-10 사이의 양수 (실제 DB에 존재할 가능성 높음)
};
*/

const searchPlaces = () => {
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
            selectedBranch.value = place.place_name;
          });

          bounds.extend(pos);
        });

        map.setBounds(bounds);
      }
    }
  );
};

const handleComplete = async () => {
  try {
    if (!selectedBranch.value) {
      alert('지점을 선택해주세요.');
      return;
    }

    // TODO: 백엔드에서 지점 테이블 구조 수정 후 활성화
    // 현재는 DB의 auto_increment branchId와 프론트에서 생성한 ID가 불일치하여 임시 비활성화
    
    console.log('선택된 지점:', selectedBranch.value);
    console.log('지점 설정 기능은 백엔드 지점 테이블 구조 수정 후 활성화 예정입니다.');
    
    // 임시로 성공 메시지 표시
    alert(`지점 "${selectedBranch.value}"이(가) 선택되었습니다.\n(실제 저장은 백엔드 수정 후 활성화 예정)`);
    
    /* 백엔드 수정 후 활성화 예정 코드:
    try {
      const branchInfo = await branchApi.getBranchByName(selectedBranch.value);
      console.log('지점 정보 조회 성공:', branchInfo);
      
      // 실제 branchId는 백엔드에서 반환받아야 함
      const branchData = {
        branchId: branchInfo.branchId // 백엔드에서 실제 ID 반환 필요
      };

      const response = await branchApi.setMyBranch(branchData);
      console.log('지점 설정 성공:', response);
    } catch (error) {
      console.error('지점 설정 실패:', error);
      alert('지점 설정 중 오류가 발생했습니다.');
      return;
    }
    */

    // 쿼리 파라미터에 따라 다른 페이지로 이동
    if (route.query.from === 'profile') {
      router.push({ name: 'profile' });
    } else {
      router.push({ name: 'asset-signup-complete' });
    }
  } catch (error) {
    console.error('지점 업데이트 실패:', error);
    alert('지점 설정 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

onMounted(() => {
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
