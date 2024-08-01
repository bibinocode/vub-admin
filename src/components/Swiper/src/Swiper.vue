<script setup lang="tsx">
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { SwiperItemType } from './type'

export interface Props {
  items: Array<SwiperItemType>
}

export interface Slots {
  default(props: { item: SwiperItemType }): any
}

/**
 * 定义props
 */
const { items } = withDefaults(defineProps<Props>(), {
  items: () => []
})

/**
 * 插槽类型定义
 */
const slots = defineSlots<Slots>()

/**
 * swiper实例回调事件
 * @param swiper swiper instance
 */
const onSwiper = (swiper: SwiperType) => {
  console.log(swiper)
}

/**
 * slide切换回调事件
 * @param swiper swiper instance
 */
const onSlideChange = (swiper: SwiperType) => {}

defineRender(
  <Swiper
    slidesPerView={0}
    spaceBetween={50}
    onSwiper={onSwiper}
    onSlideChange={onSlideChange}
    class={'h-80'}
  >
    {items.map((item) => (
      <SwiperSlide key={item.image}>
        {slots.default ? (
          slots.default({ item })
        ) : (
          <div
            class={'w-full h-full bg-cover bg-no-repeat bg-center-top'}
            style={{
              backgroundImage: `url(${item.image})`
            }}
          ></div>
        )}
      </SwiperSlide>
    ))}
  </Swiper>
)
</script>
