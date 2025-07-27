<template>
  <div class="overflow-hidden">
    <swiper
      :modules="[Autoplay, Pagination]"
      :slides-per-view="1.2"
      :space-between="16"
      :centered-slides="true"
      :loop="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      class="!overflow-visible"
    >
      <swiper-slide
        v-for="(image, index) in challengeImages"
        :key="index"
        class="overflow-hidden"
      >
        <img
          :src="image"
          alt="슬라이드 이미지"
          class="h-auto w-full object-cover"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// 이미지 import
import challenge1 from '@/assets/images/challenge1.png';
import challenge2 from '@/assets/images/challenge2.png';
import challenge3 from '@/assets/images/challenge3.png';

const challengeImages = [challenge1, challenge2, challenge3];
</script>
