<template>
  <div class="bg-red">
    <Swiper :items="items"></Swiper>
  </div>
</template>
<script setup lang="ts">
import type { SwiperItemType } from '@/components/Swiper'
import Bg from '@/assets/images/banner/banner-1.jpg'

const items: SwiperItemType[] = [
  {
    image: Bg,
    title: '技术改变生活',
    subTitle: '让生活更美好'
  }
]
</script>

<route lang="yaml">
meta:
  layout: default
</route>
