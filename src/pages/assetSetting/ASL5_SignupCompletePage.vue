<!-- 회원가입완료 -->
<template>
  <div class="text-center text-xl font-bold"> 현재 경로: {{ route.path }} </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
