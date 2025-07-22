<template>
  <nav
    class="shadow-up-xs relative flex h-20 items-center justify-around bg-white px-5"
  >
    <router-link to="/nohoo" class="text-center">노후설계</router-link>
    <router-link to="/jeungyeo" class="text-center">증여설계</router-link>
    <router-link to="/" class="text-center">홈화면</router-link>
    <router-link to="/event" class="text-center">혜택정보</router-link>
    <router-link to="/profile" class="text-center">내정보</router-link>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
