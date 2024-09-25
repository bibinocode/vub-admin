<Container class="h-40px" >


<script setup lang="ts" >
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

<Swiper :items="items" ></Swiper>


# 标题1测试

* 测试渲染

## 标题2测试

**测试渲染**


</Container>
