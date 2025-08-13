<template>
  <div>
    <h1 class="text-primary-500 mb-4 text-center text-2xl font-bold">
      증여세는 어떻게 계산하나요?</h1
    >

    <div class="space-y-8">
      <div
        class="custom-shadow border-surface-200 bg-primary-100 relative overflow-hidden rounded-lg border px-4 py-8"
      >
        <h2 class="text-primary-500 mb-4 text-xl font-semibold"> 세율 구간 </h2>
        <p class="mb-4 text-base leading-relaxed">
          증여세는 증여받은 재산의 가액에서 각종 공제액을 뺀
          <span class="font-semibold">과세표준</span>에 따라 5단계의
          <span class="font-semibold">초과누진세율</span>이 적용됩니다.
          과세표준이 높을수록 높은 세율이 적용되어 세금 부담이 커져요.
        </p>

        <div class="overflow-x-auto bg-white">
          <table class="divide-primary-100 w-full divide-y text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="bg-primary-500 border border-white px-2 py-4 text-center font-semibold text-white"
                >
                  과세표준 (10년 합산)
                </th>
                <th
                  scope="col"
                  class="bg-primary-500 border border-white px-2 py-4 text-center font-semibold text-white"
                >
                  세율
                </th>
                <th
                  scope="col"
                  class="bg-primary-500 border border-white px-2 py-4 text-center font-semibold text-white"
                >
                  누진공제액
                </th>
              </tr>
            </thead>
            <tbody class="divide-surface-200 divide-y bg-white">
              <tr>
                <td class="py-2 text-center whitespace-nowrap">
                  1억 원 이하
                </td>
                <td class="py-2 text-center whitespace-nowrap"> 10% </td>
                <td class="py-2 text-center whitespace-nowrap"> - </td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  1억 원 초과 ~ 5억 원 이하
                </td>
                <td class="px-4 py-2 text-center whitespace-nowrap"> 20% </td>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  1,000만 원
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  5억 원 초과 ~ 10억 원 이하
                </td>
                <td class="px-4 py-2 text-center whitespace-nowrap"> 30% </td>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  6,000만 원
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  10억 원 초과 ~ 30억 원 이하
                </td>
                <td class="px-4 py-2 text-center whitespace-nowrap"> 40% </td>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  1억 6,000만 원
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  30억 원 초과
                </td>
                <td class="px-4 py-2 text-center whitespace-nowrap"> 50% </td>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  4억 6,000만 원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-8 leading-relaxed">
          <span class="text-primary-500 font-semibold"> * 할증세율 적용: </span>
          증여자가 사망하기 전 자녀를 건너뛰고 손자녀에게 증여하는 경우,
          세대생략 할증으로
          <span class="text-primary-500 font-semibold"
            >일반 증여세액에 30%를 가산</span
          >하여 계산합니다.
        </p>
      </div>

      <div
        class="custom-shadow border-surface-200 bg-primary-100 relative overflow-hidden rounded-lg border px-4 py-8"
      >
        <h2 class="text-primary-500 mb-4 text-xl font-semibold">
          증여재산공제
        </h2>
        <p class="mb-4 leading-relaxed">
          증여세를 계산할 때, 증여자와 수증자 관계에 따라 일정 금액을 공제받을
          수 있습니다. 이 공제는
          <span class="font-semibold"
            >10년 내에 동일인에게 증여받은 금액을 모두 합산</span
          >하여 적용됩니다. 예를 들어, 10년 동안 부모님께 총 1억 원을
          증여받았다면, 5,000만 원까지 공제받을 수 있습니다.
        </p>
        <div class="overflow-x-auto bg-white">
          <table
            class="divide-surface-200 w-full table-fixed border-collapse divide-y text-sm"
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  class="bg-primary-500 w-1/2 border border-white px-2 py-4 text-center font-semibold text-white"
                >
                  증여자와의 관계
                </th>
                <th
                  scope="col"
                  class="bg-primary-500 w-1/2 border border-white px-2 py-4 text-center font-semibold text-white"
                >
                  공제 한도 (10년간 합산)
                </th>
              </tr>
            </thead>
            <tbody class="divide-surface-200 divide-y bg-white">
              <tr>
                <td class="p-2 text-center">배우자</td>
                <td class="p-2 text-center">6억 원</td>
              </tr>
              <tr>
                <td class="p-2 text-center">직계존속 (성년)</td>
                <td class="p-2 text-center">5,000만 원</td>
              </tr>
              <tr>
                <td class="p-2 text-center">직계존속 (미성년자)</td>
                <td class="p-2 text-center">2,000만 원</td>
              </tr>
              <tr>
                <td class="p-2 text-center">직계비속</td>
                <td class="p-2 text-center">5,000만 원</td>
              </tr>
              <tr>
                <td class="p-2 text-center">
                  기타 친족 (6촌 이내 혈족, 4촌 이내 인척)
                </td>
                <td class="p-2 text-center">1,000만 원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="custom-shadow border-surface-200 bg-primary-100 relative overflow-hidden rounded-lg border px-4 py-8"
      >
        <!-- <h2 class="text-primary-500 mb-4 text-lg font-semibold">
          국세청 자료를 참고하세요
        </h2> -->
        <iframe
          class="h-60 w-full"
          src="https://www.youtube.com/embed/eWztSg6_9lU"
          title="(국세매거진) 증여세, 공제 항목 확인하세요~"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <div class="mt-4 text-center">
          <a
            href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2340&cntntsId=7728"
            target="_blank"
            class="text-primary-300 font-semibold underline"
          >
            🔗 국세청 홈페이지에서 세액계산 흐름도를 확인해 보세요
          </a>
        </div>
      </div>

      <div
        class="custom-shadow border-surface-200 relative overflow-hidden rounded-lg border bg-red-100 p-4"
      >
        <div class="flex items-start">
          <div class="mt-1 mr-3">
            <img :src="Error" alt="Error Icon" class="h-5 w-5" />
          </div>
          <div>
            <h4 class="mb-1 text-lg font-semibold text-red-500">참고사항</h4>
            <p class="leading-relaxed text-red-500">
              2024년 1월 1일부터 혼인 또는 출산을 이유로 증여받는 경우, 일반
              증여재산공제와 별도로
              <span class="font-semibold">1억 원</span>까지 추가로 공제받을 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const openYoutubePopup = () => {
  const url = 'https://www.youtube.com/watch?v=eWztSg6_9lU';
  const name = 'youtube_popup';
  const width = 800;
  const height = 500;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const options = `width=${width},height=${height},left=${left},top=${top}`;

  window.open(url, name, options);
};
import Error from '@/assets/icons/Error.svg';
</script>
