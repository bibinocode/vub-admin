<template>
  <swiper :slides-per-view="1" :space-between="0" @swiper="onSwiper" @slideChange="onSlideChange">
    <swiper-slide v-for="item in items" :key="item.image">
      <slot :item="item">
        <div
          class="w-full h-full bg-cover bg-no-repeat bg-center-top"
          :style="{
            backgroundImage: `url(${item.image})`
          }"
        >
        </div>
      </slot>
    </swiper-slide>
  </swiper>
</template>
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import type { SwiperItemType } from './type'
import type { Swiper as SwiperType } from 'swiper/types'

defineOptions({
  name: 'Swiper'
})

defineProps({
  items: {
    type: Array as PropType<Array<SwiperItemType>>,
    default: () => []
  }
})

defineSlots<{
  default(props: { item: SwiperItemType }): any
}>()

const onSwiper = (swiepr: SwiperType) => {}
const onSlideChange = (swiper: SwiperType) => {}
</script>
