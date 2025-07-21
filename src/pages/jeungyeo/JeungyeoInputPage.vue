<template>
  <div class="jeungyeo-input-page">
    <!-- 자산 카테고리 선택 차트 -->
    <section class="asset-chart-section">
      <h2>자산 현황</h2>
      <div class="chart-placeholder">
        <!-- 여기에 차트 라이브러리로 대체 예정 -->
        <div class="radar-chart-box">Chart 영역</div>
      </div>
    </section>

    <!-- 자산 카테고리 선택 박스 -->
    <section class="asset-category-section">
      <h2>증여 자산 카테고리 선택하기</h2>
      <p>
        수증자에게 어떤 자산을 나눠주실지 카테고리를 선택하면 해당 카테고리의
        세부 자산을 선택하실 수 있습니다
      </p>
      <div class="category-grid">
        <div class="category-box">부동산 <span>1/3</span></div>
        <div class="category-box">예ㆍ적금 <span>2/2</span></div>
        <div class="category-box">현금 <span>2/2</span></div>
        <div class="category-box">주식ㆍ펀드 <span>2/2</span></div>
        <div class="category-box">사업체ㆍ지분 <span>2/2</span></div>
        <div class="category-box">기타 <span>2/2</span></div>
      </div>
    </section>

    <!-- 수증자 정보 입력 -->
    <section class="beneficiary-section">
      <h2>수증자 정보 입력하기</h2>
      <p>자산을 받으실 분 정보를 입력해 주세요.</p>

      <div class="beneficiary-box">
        <div class="info">
          <p><strong>홍길동</strong></p>
          <p>자녀<br />2001.04.18<br />미혼 | 소득 있음</p>
        </div>
        <button class="edit-btn">수정</button>
      </div>

      <div class="beneficiary-box">
        <div class="info">
          <p><strong>최두식</strong></p>
          <p>배우자<br />2001.04.18<br />결혼 | 소득 모름</p>
        </div>
        <button class="edit-btn">수정</button>
      </div>

      <button class="add-btn">+ 추가하기</button>
      <button class="calculate-btn" @click="goToQuiz">다음으로</button>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToQuiz = () => {
  router.push('/jeungyeo/quiz');
};
</script>

<style scoped>
.jeungyeo-input-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.asset-chart-section .chart-placeholder {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.radar-chart-box {
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-category-section h2,
.beneficiary-section h2,
.asset-chart-section h2 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.category-box {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  background-color: #f9f9f9;
}

.beneficiary-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
}

.edit-btn,
.add-btn,
.calculate-btn {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  font-size: 14px;
  border-radius: 8px;
  background-color: var(--color-secondary-100);
  border: none;
  cursor: pointer;
}

.edit-btn {
  width: auto;
  background-color: var(--color-secondary-100);
  padding: 6px 12px;
  font-size: 13px;
}
</style>
