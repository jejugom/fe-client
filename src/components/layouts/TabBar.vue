<template>
  <nav
    class="shadow-up-xs relative flex h-20 items-center justify-around bg-white px-5 text-base"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="flex w-13 flex-col items-center justify-center gap-1 text-sm"
    >
      <img
        :src="isActive(tab.name) ? tab.iconActive : tab.icon"
        class="h-6 w-6"
      />
      <span
        :class="[
          'font-semibold',
          isActive(tab.name) ? 'text-secondary-500' : 'text-primary-500',
        ]"
      >
        {{ tab.label }}
      </span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import TabHome from '@/assets/icons/TabHome.svg';
import TabHomeActive from '@/assets/icons/TabHomeActive.svg';
import TabNohoo from '@/assets/icons/TabNohoo.svg';
import TabNohooActive from '@/assets/icons/TabNohooActive.svg';
import TabGift from '@/assets/icons/TabGift.svg';
import TabGiftActive from '@/assets/icons/TabGiftActive.svg';
import TabEvent from '@/assets/icons/TabEvent.svg';
import TabEventActive from '@/assets/icons/TabEventActive.svg';
import TabUser from '@/assets/icons/TabUser.svg';
import TabUserActive from '@/assets/icons/TabUserActive.svg';

const route = useRoute();

const tabs = [
  {
    name: 'nohoo',
    label: '노후투자',
    icon: TabNohoo,
    iconActive: TabNohooActive,
  },
  {
    name: 'gift',
    label: '증여설계',
    icon: TabGift,
    iconActive: TabGiftActive,
  },
  {
    name: 'home',
    label: '홈화면',
    icon: TabHome,
    iconActive: TabHomeActive,
  },
  {
    name: 'event',
    label: '생활편의',
    icon: TabEvent,
    iconActive: TabEventActive,
  },
  {
    name: 'profile',
    label: '내정보',
    icon: TabUser,
    iconActive: TabUserActive,
  },
];

const isActive = (name: string) => {
  const currentName = route.name as string | undefined;
  const params = route.params ?? {};
  const query = route.query ?? {};

  // 라우트 name 기반 매핑
  const nameMap: Record<string, string[]> = {
    nohoo: ['nohoo', 'product-detail', 'register-product'],
    gift: [
      'gift',
      'gift-start',
      'gift-input',
      'gift-quiz',
      'gift-faq',
      'gift-detail',
      'gift-result',
      'gift-taxinfo',
      'inheritance-start',
      'inheritance-input',
      'inheritance-quiz',
      'inheritance-will',
      'inheritance-result',
    ],
    home: ['home'],
    event: [
      'event',
      'event-quiz',
      'event-number',
      'event-park',
      'event-reward',
    ],
    profile: [
      'profile',
      'register-list',
      'edit-asset',
      'edit-branch',
      'edit-profile',
      'asset-tutorial',
      'asset-start',
      'asset-kookmin-login',
      'asset-custom-start',
      'asset-custom-quiz',
      'asset-signup-complete',
    ],
  };

  // 예약 완료 페이지: from 쿼리 우선
  if (currentName === 'register-complete') {
    const from = (query.from as string) || '';
    if (from === 'gift') return name === 'gift';
    if (from === 'nohoo') return name === 'nohoo';

    // from이 없으면 params.id로 백업 추론
    const id = (params.id as string) || '';
    const isGiftFlow = id === 'gift' || id === 'inheritance';
    return name === (isGiftFlow ? 'gift' : 'nohoo');
  }

  // 예약 진행 페이지(공통): id로 흐름 판별
  if (currentName === 'register-product' || currentName === 'register') {
    const id = (params.id as string) || '';
    const isGiftFlow = id === 'gift' || id === 'inheritance';
    return name === (isGiftFlow ? 'gift' : 'nohoo');
  }

  // 그 외 일반 페이지는 name 매핑으로 판단
  return !!nameMap[name]?.includes(currentName ?? '');
};
</script>
