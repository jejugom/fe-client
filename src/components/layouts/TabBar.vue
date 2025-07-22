<template>
  <nav
    class="shadow-up-xs relative flex h-20 items-center justify-around bg-white px-5"
  >
    <router-link :to="{ name: 'nohoo-page' }" class="text-center"
      >노후설계</router-link
    >
    <router-link :to="{ name: 'gift-page' }" class="text-center"
      >증여설계</router-link
    >
    <router-link :to="{ name: 'home' }" class="text-center">홈화면</router-link>
    <router-link :to="{ name: 'event-page' }" class="text-center"
      >혜택정보</router-link
    >
    <router-link :to="{ name: 'profile-page' }" class="text-center"
      >내정보</router-link
    >
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
