<script setup lang="ts">
import { registerSW } from 'virtual:pwa-register'

/**
 * 注册pwa更新
 *
 * @param enable 是否开启pwa更新
 */
function registerPwaWorker(enable: boolean = true) {
  if (enable) {
    registerSW({
      immediate: true,
      onRegisteredSW(_url, registration) {
        setInterval(() => {
          registration?.update()
        }, 3600000)
      }
    })
  }
}

onMounted(() => {
  registerPwaWorker()
})
</script>
<template>
  <RouterView />
</template>

<style scoped></style>
