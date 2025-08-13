<template>
  <!-- 자산 카드 컴포넌트 -->
  <div class="card-design overflow-hidden">
    <!-- 상단 영역: 자산 정보 + 버튼 -->
    <div class="flex items-center justify-between">
      <img
        :src="getAssetImage(category.id)"
        :alt="category.name"
        class="mr-6 h-10 w-10"
      />
      <div class="my-2 flex-1">
        <!-- 카테고리 이름 -->
        <div class="text-primary-300 mb-2 text-base">{{ category.name }}</div>
        <!-- 자산 이름 -->
        <div class="text-primary-500 mb-2 text-xl font-semibold">{{
          tempAsset.name
        }}</div>
        <!-- 자산 금액 -->
        <div class="text-primary-500 text-base">
          {{ formatCurrency(tempAsset.value) }}
        </div>
        <!-- 선택된 수증자 정보 (펼치기 전 상태에서만 표시) -->
        <div
          v-if="tempAsset.selected && !isExpanded"
          class="text-primary-300 mt-2 text-base"
        >
          {{ selectedBeneficiaryInfo }}
        </div>
      </div>

      <!-- 우측 버튼 영역 -->
      <div class="flex items-center gap-3">
        <!-- 기본 상태(펼치기 전) -->
        <template v-if="!isExpanded">
          <!-- 선택된 상태일 경우 삭제 버튼 -->
          <Btn
            v-if="tempAsset.selected"
            label="삭제"
            color="surface"
            size="square"
            @click="showDeleteModal"
            class="w-16"
          />
          <!-- 선택 or 변경 버튼 -->
          <Btn
            :label="tempAsset.selected ? '변경' : '선택'"
            :color="tempAsset.selected ? 'surface' : 'primary'"
            size="square"
            class="w-16"
            @click="togglePanel"
          />
        </template>

        <!-- 확장 상태 -->
        <template v-else>
          <div class="flex items-center gap-2">
            <!-- 취소 버튼 -->
            <Btn
              label="취소"
              color="surface"
              size="square"
              class="w-16"
              @click="cancelSelection"
            />
            <!-- 완료 버튼 (조건 만족 시만 활성화) -->
            <Btn
              :disabled="!isCompletable"
              :color="isCompletable ? 'primary' : 'surface'"
              size="square"
              class="w-16"
              @click="completeSelection"
            >
              완료
            </Btn>
          </div>
        </template>
      </div>
    </div>

    <!-- 확장 영역 -->
    <div v-if="isExpanded" class="border-surface-200 border-t">
      <div class="p-4">
        <!-- 수증자 선택 영역 -->
        <div class="my-4 flex flex-col gap-4 md:flex-row md:items-start">
          <h4 class="text-surface-500 text-base font-semibold md:w-32">
            수증자 선택
          </h4>
          <div class="flex-1">
            <!-- 드롭다운 선택 박스 -->
            <div
              class="border-surface-200 cursor-pointer rounded-lg border p-3"
              @click="toggleDropdown"
            >
              <span>{{ dropdownText }}</span>
              <span class="text-surface-500 float-right">
                {{ dropdownOpen ? '▲' : '▼' }}
              </span>
            </div>

            <!-- 드롭다운 목록 -->
            <div
              v-if="dropdownOpen"
              class="border-surface-200 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg"
            >
              <!-- 단일 수증자 선택 -->
              <div
                v-for="beneficiary in beneficiaries"
                :key="beneficiary.id"
                class="border-surface-200 cursor-pointer border-b p-3 last:border-b-0"
                @click="selectSingleBeneficiary(beneficiary)"
              >
                <div class="flex items-center justify-between">
                  <span>{{ beneficiary.name }}</span>
                  <span class="text-surface-500 text-base">
                    {{ beneficiary.relation }}
                  </span>
                </div>
              </div>

              <!-- 다수 수증자 선택 -->
              <div
                class="cursor-pointer p-3"
                @click="selectMultipleBeneficiaries"
              >
                <span class="text-surface-500">여러 명에게 분배</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 다수 수증자 선택 시 비율 설정 -->
        <div v-if="tempAsset.isMultipleBeneficiaries && !dropdownOpen">
          <h5 class="text-surface-500 text-base font-semibold">
            수증자별 분배 비율 설정
          </h5>

          <!-- 비율 유효성 메시지 -->
          <div class="mb-4">
            <span v-if="totalRatio > 100" class="text-xs text-red-300">
              100%를 초과하여 입력하실 수 없습니다.
            </span>
            <span v-else-if="totalRatio < 100" class="text-xs text-red-300">
              총 비율이 100%가 되어야 합니다.
              <span>(남은 비율: {{ 100 - totalRatio }}%)</span>
            </span>
          </div>

          <!-- 수증자별 비율 입력 -->
          <div class="space-y-3">
            <div
              v-for="beneficiary in beneficiaries"
              :key="beneficiary.id"
              class="bg-primary-100 flex items-center justify-between rounded-lg p-3"
            >
              <div class="flex-1">
                <!-- 이름 + 관계 -->
                <div class="mb-2 flex items-center justify-between">
                  <span>{{ beneficiary.name }}</span>
                  <span class="text-surface-500 text-base">
                    {{ beneficiary.relation }}
                  </span>
                </div>

                <!-- 비율 입력 + 금액 계산 -->
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    :value="tempAsset.distributionRatios?.[beneficiary.id]"
                    @input="updateDistributionRatio($event, beneficiary.id)"
                    placeholder="0"
                    min="0"
                    max="100"
                    class="border-surface-200 focus:ring-gold focus:border-gold w-20 rounded border px-2 py-1 text-center focus:ring-1 focus:outline-none"
                  />
                  <span class="text-surface-500 text-base">%</span>
                  <div class="flex-1 text-right">
                    <span class="text-surface-500 text-base">
                      금액:
                      {{
                        formatCurrency(
                          calculateDistributionAmount(beneficiary.id)
                        )
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <Modal
      v-if="showModal"
      title="수증자 삭제"
      left-label="취소"
      right-label="삭제"
      @click1="closeModal"
      @click2="confirmDelete"
    >
      <p class="text-surface-500 text-center text-base">
        <strong>{{ tempAsset.name }}</strong
        >을/를 <strong>{{ selectedBeneficiaryInfo }}</strong
        >에게<br />
        증여하지 않으시겠습니까? <br /><br />
        <span class="text-surface-500">(다시 선택하실 수 있습니다.)</span>
      </p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import { formatCurrency } from '@/utils/format';
import { getAssetImage } from '@/utils/assetImageMapper';
import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';

// --- 인터페이스 정의 ---
interface Asset {
  id: string;
  name: string;
  value: number;
  selected: boolean;
  beneficiary?: Beneficiary | null;
  isMultipleBeneficiaries?: boolean;
  distributionRatios?: { [beneficiaryId: string]: number };
}

interface Beneficiary {
  id: string;
  name: string;
  relation: string;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  asset: Asset;
  beneficiaries: Beneficiary[];
  category: Category;
  mode: 'gift' | 'inheritance';
}

interface Emits {
  (e: 'update-asset', asset: Asset): void;
}

// Props 및 Emits 정의
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// --- 상태 관리 ---
const isExpanded = ref(false); // 확장 패널 열림/닫힘 상태
const dropdownOpen = ref(false); // 수증자 선택 드롭다운 열림/닫힘 상태
const showModal = ref(false); // 삭제 모달 표시 여부
const tempAsset = reactive<Asset>({ ...props.asset }); // 컴포넌트 내부에서 사용할 자산 상태
let backupState: Asset | null = null; // 취소 시 복구를 위한 상태 백업

// props.asset이 변경될 때 tempAsset 동기화
watch(
  () => props.asset,
  (newAsset) => {
    Object.assign(tempAsset, newAsset);
  },
  { deep: true }
);

// --- Computed 속성 ---
const totalRatio = computed(() => {
  // 분배 비율의 총합 계산
  return Object.values(tempAsset.distributionRatios || {}).reduce(
    (sum, ratio) => sum + (ratio || 0),
    0
  );
});

const isCompletable = computed(() => {
  // '완료' 버튼 활성화 여부
  if (!isExpanded.value) return false;
  if (tempAsset.isMultipleBeneficiaries) {
    return totalRatio.value === 100;
  }
  return !!tempAsset.beneficiary;
});

const selectedBeneficiaryInfo = computed(() => {
  // 상단에 표시될 선택된 수증자 정보 텍스트
  if (tempAsset.isMultipleBeneficiaries) {
    return '여러 명에게 분배';
  }
  if (tempAsset.beneficiary) {
    const suffix = props.mode === 'gift' ? '에게 증여' : '에게 상속';
    return `${tempAsset.beneficiary.name}${suffix}`;
  }
  return '';
});

const dropdownText = computed(() => {
  // 드롭다운 버튼에 표시될 텍스트
  if (tempAsset.isMultipleBeneficiaries) {
    return '여러 명에게 분배';
  }
  if (tempAsset.beneficiary) {
    return `${tempAsset.beneficiary.name} (${tempAsset.beneficiary.relation})`;
  }
  return '수증자를 선택하세요';
});

// --- 메소드 ---

const togglePanel = () => {
  // 패널 확장/축소 및 상태 백업
  if (!isExpanded.value) {
    backupState = JSON.parse(JSON.stringify(tempAsset));
  }
  isExpanded.value = !isExpanded.value;
  dropdownOpen.value = false;
};

const toggleDropdown = () => {
  // 드롭다운 열기/닫기
  dropdownOpen.value = !dropdownOpen.value;
};

const showDeleteModal = () => {
  // 삭제 모달 열기
  showModal.value = true;
};

const closeModal = () => {
  // 모달 닫기
  showModal.value = false;
};

const confirmDelete = () => {
  // 수증자 삭제 확정 및 상태 초기화
  tempAsset.beneficiary = null;
  tempAsset.isMultipleBeneficiaries = false;
  tempAsset.distributionRatios = {};
  tempAsset.selected = false;
  closeModal();
  emit('update-asset', tempAsset);
};

const completeSelection = () => {
  // 수증자 선택 완료
  if (isCompletable.value) {
    isExpanded.value = false;
    dropdownOpen.value = false;

    // 만약 한 명에게 100% 분배 시, 단일 수증자 선택으로 전환
    if (tempAsset.isMultipleBeneficiaries) {
      const beneficiaryIdWith100 = Object.entries(
        tempAsset.distributionRatios || {}
      ).find(([, ratio]) => ratio === 100)?.[0];
      if (beneficiaryIdWith100) {
        tempAsset.isMultipleBeneficiaries = false;
        tempAsset.distributionRatios = {};
        const beneficiary = props.beneficiaries.find(
          (b) => b.id === beneficiaryIdWith100
        );
        if (beneficiary) {
          tempAsset.beneficiary = beneficiary;
        }
      }
    }
    emit('update-asset', tempAsset);
  }
};

const cancelSelection = () => {
  // 선택 취소 및 백업 상태로 복원
  isExpanded.value = false;
  dropdownOpen.value = false;
  if (backupState) {
    Object.assign(tempAsset, backupState);
  }
};

const selectSingleBeneficiary = (beneficiary: Beneficiary) => {
  // 단일 수증자 선택
  Object.assign(tempAsset, {
    beneficiary,
    isMultipleBeneficiaries: false,
    distributionRatios: {},
    selected: true,
  });
  dropdownOpen.value = false;
};

const selectMultipleBeneficiaries = () => {
  // 여러 명에게 분배 옵션 선택
  const distributionRatios: { [key: string]: number } = {};
  props.beneficiaries.forEach((beneficiary) => {
    distributionRatios[beneficiary.id] = 0;
  });

  Object.assign(tempAsset, {
    beneficiary: null,
    isMultipleBeneficiaries: true,
    distributionRatios,
    selected: true,
  });
  dropdownOpen.value = false;
};

const updateDistributionRatio = (event: Event, beneficiaryId: string) => {
  // 분배 비율 업데이트
  const inputElement = event.target as HTMLInputElement;
  const value = parseFloat(inputElement.value);
  const newRatio = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));

  if (!tempAsset.distributionRatios) {
    tempAsset.distributionRatios = {};
  }
  tempAsset.distributionRatios[beneficiaryId] = newRatio;
};

const calculateDistributionAmount = (beneficiaryId: string): number => {
  // 비율에 따른 분배 금액 계산
  if (!tempAsset.distributionRatios) return 0;
  const ratio = tempAsset.distributionRatios[beneficiaryId] || 0;
  return Math.floor((tempAsset.value * ratio) / 100);
};
</script>
