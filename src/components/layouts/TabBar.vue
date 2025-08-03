<template>
  <nav
    class="shadow-up-xs relative flex h-20 items-center justify-around bg-white px-5 text-sm"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="flex w-13 flex-col items-center justify-center gap-1"
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
    label: '노후설계',
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
    label: '혜택정보',
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

const isActive = (name: string) => route.name === name;
</script>
