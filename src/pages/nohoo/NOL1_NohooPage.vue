<template>
  <div class="flex flex-col gap-8">
    <!-- 탭 -->
    <TabBtnGroup
      :tabs="['맞춤', '예금', '적금', '주택담보', '금']"
      v-model:selectedTab="selectedTab"
    />

    <!-- 조건부 컴포넌트 -->
    <AdBox :selectedTab="selectedTab" />
    <!-- 필터링 -->
    <div v-if="selectedTab !== '맞춤'" class="flex justify-end">
      <SelectBox size="small" v-model="sortOption">
        <option value="name">상품명순</option>
        <option
          v-if="selectedTab === '예금' || selectedTab === '적금'"
          value="rate"
          >최고금리순</option
        >
        <option v-if="selectedTab === '주택담보'" value="rate"
          >최저금리순</option
        >
      </SelectBox>
    </div>

    <!-- 리스트 -->
    <div class="flex flex-col gap-4">
      <div
        v-if="filteredProducts.length === 0"
        class="text-surface-400 text-center text-base"
      >
        찾으신 조건으로는 상품이 아직 준비 중이에요!<br />조건을 조금
        바꿔보시겠어요?
      </div>
      <div
        v-if="selectedTab === '맞춤'"
        class="text-primary-300 text-2xl font-semibold"
      >
        최승아님께 딱 맞는 상품만 보여드릴게요
      </div>
      <BtnCard
        v-for="product in filteredProducts"
        :key="product.id"
        btnText="자세히 보기"
        color="primary"
        :content="product.description"
        :tags="product.tags.join(' · ')"
        :title="product.name"
        @click="goToDetail(product.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TabBtnGroup from './_components/TabBtnGroup.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import AdBox from './_components/AdBox.vue';
import { useRouter } from 'vue-router';
import { productsApiData } from './_dummy';
import SelectBox from '@/components/forms/SelectBox.vue';

const selectedTab = ref('맞춤');
const sortOption = ref('name');
const router = useRouter();

// 탭이 바뀌면 정렬 옵션 초기화
watch(selectedTab, () => {
  sortOption.value = 'name';
});

// 상품 데이터 (API에서 받아올 형태)
const productsData = ref(productsApiData);

// 상품 목록 (필터링 및 정렬 포함)
const filteredProducts = computed(() => {
  let products: any[] = [];

  if (selectedTab.value === '맞춤') {
    // 맞춤 탭: 백엔드에서 이미 맞춤 순서로 정렬된 recommend 배열 사용
    products = productsData.value.recommend.map((item) => {
      const product = item.data;

      if (item.type === 'timeDeposit' || item.type === 'savingDeposit') {
        return {
          id: product.fin_prdt_cd,
          name: product.fin_prdt_nm,
          description: product.prdt_feature,
          // 최고우대금리(intr_rate2) 중 최대값을 maxRate로 설정 (추후 기간에 따른 필터링 수정)
          maxRate: product.optionList
            ? Math.max(...product.optionList.map((opt) => opt.intr_rate2))
            : 0,
          // 가입기간별 태그 생성 (화면 출력용)
          tags: product.optionList
            ? product.optionList.map((opt) => `${opt.save_trm}개월`)
            : [],
        };
      } else if (item.type === 'mortgageLoan') {
        return {
          id: product.fin_prdt_cd,
          name: product.fin_prdt_nm?.replace('\n', ' ') || '',
          description: product.prdt_feature,
          // 대출 상품: 최저금리(lend_rate_min) 중 최소값을 maxRate로 설정 (낮을수록 유리하니까)
          maxRate: product.optionListList
            ? Math.min(
                ...product.optionListList.map((opt) =>
                  parseFloat(opt.lend_rate_min)
                )
              )
            : 0,
          // 담보 유형별 태그 생성
          tags: product.optionListList
            ? product.optionListList.map((opt) => opt.mrtg_type_nm)
            : [],
        };
      }
    });
  } else if (selectedTab.value === '예금') {
    // 예금 탭: 전체 정기예금 상품 데이터 변환
    products = productsData.value.timeDeposits.map((product) => ({
      id: product.fin_prdt_cd,
      name: product.fin_prdt_nm,
      description: product.prdt_feature,
      // 필터링을 위한 최고우대금리 설정
      maxRate: Math.max(...product.optionList.map((opt) => opt.intr_rate2)),
      // 가입기간별 태그 생성
      tags: product.optionList.map((opt) => `${opt.save_trm}개월`),
    }));
  } else if (selectedTab.value === '적금') {
    // 적금 탭: 전체 적금 상품 데이터 변환
    products = productsData.value.savingDeposits.map((product) => ({
      id: product.fin_prdt_cd,
      name: product.fin_prdt_nm,
      description: product.prdt_feature,
      // 필터링을 위한 최고우대금리 설정
      maxRate: Math.max(...product.optionList.map((opt) => opt.intr_rate2)),
      // 가입기간별 태그 생성
      tags: product.optionList.map((opt) => `${opt.save_trm}개월`),
    }));
  } else if (selectedTab.value === '주택담보') {
    // 주택담보대출 탭: 전체 주택담보대출 상품 데이터 변환
    products = productsData.value.mortgageLoan.map((product) => ({
      id: product.fin_prdt_cd,
      name: product.fin_prdt_nm.replace('\n', ' '),
      description: product.prdt_feature,
      // 필터링을 위한 최저금리 설정 (대출은 낮을수록 유리)
      maxRate: Math.min(
        ...product.optionListList.map((opt) => parseFloat(opt.lend_rate_min))
      ),
      // 담보 유형별 태그 생성
      tags: product.optionListList.map((opt) => opt.mrtg_type_nm),
    }));
  }

  // 맞춤 탭 제외하고 사용자 선택에 따른 정렬 수행
  if (selectedTab.value !== '맞춤') {
    if (sortOption.value === 'name') {
      // 가나다순 정렬
      return products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption.value === 'rate') {
      if (selectedTab.value === '주택담보') {
        // 주택담보: 최저금리순 정렬 (오름차순)
        return products.sort((a, b) => a.maxRate - b.maxRate);
      } else {
        // 예금/적금: 최고금리순 정렬 (내림차순)
        return products.sort((a, b) => b.maxRate - a.maxRate);
      }
    }
  }

  return products;
});

const goToDetail = (productId: string) => {
  if (!productId) return;
  router.push({ name: 'product-detail', params: { id: productId } });
};
</script>
