<template>
  <swiper
    :slides-per-view="1"
    :space-between="0"
    @swiper="$emit('swiper', $event)"
    @slideChange="$emit('slideChange', $event)"
    :class="getClassAndStyle(height).class"
    :style="getClassAndStyle(height).style"
    :modules="modules"
    :navigation="{
      prevEl: '.prev',
      nextEl: '.next'
    }"
    :pagination="{
      type: 'fraction',
      el: '.pagination'
    }"
  >
    <swiper-slide v-for="item in items" :key="item.image">
      <slot :item="item">
        <div
          class="w-full h-full bg-cover bg-no-repeat bg-center-center"
          :style="{
            backgroundImage: `url(${item.image})`
          }"
        >
          <Container class="h-full">
            <div class="flex flex-col justify-center items-start h-full">
              <p class="text-4xl font-bold text-white">{{ item.title }}</p>
              <p class="text-xl text-gray-100 pt-4">{{ item.subTitle }}</p>
            </div>
          </Container>
        </div>
      </slot>
    </swiper-slide>
    <!-- prev and next buttons -->
    <div
      class="flex justify-center items-center z-40 absolute right-0 bottom-0 opacity-60 text-dark-300 h-8"
    >
      <div class="pagination w-unset! text-gray-100"></div>
      <!-- <div class="prev i-uil:arrow-left" style="font-size: 2rem"> </div>
      <div class="next i-uil:arrow-right" style="font-size: 2rem"></div> -->
    </div>
  </swiper>
</template>
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import type { SwiperItemType } from './type'
import type { Swiper as SwiperType } from 'swiper/types'
import { Navigation, Pagination } from 'swiper/modules'

defineOptions({
  name: 'Swiper'
})

const props = defineProps({
  height: {
    type: String,
    default: 'h-80'
  },
  items: {
    type: Array as PropType<Array<SwiperItemType>>,
    default: () => []
  }
})

defineSlots<{
  default(props: { item: SwiperItemType }): any
}>()

defineEmits<{
  (e: 'swiper', swiper: SwiperType): void
  (e: 'slideChange', swiper: SwiperType): void
}>()

const modules = [Navigation, Pagination]

function getClassAndStyle(str: string) {
  return {
    style: /(rem|em|px)/.test(props.height) ? { height: str } : {},
    class: /h-/.test(props.height) ? str : ''
  }
}
</script>

<style lang="scss" scoped>
.swiper-button-disabled {
  color: rgba(color: #000, $alpha: 0.3);
}
</style>
