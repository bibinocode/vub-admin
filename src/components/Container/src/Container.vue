<script setup lang="tsx">
const slots = defineSlots<{
  default(): any
}>()
defineRender(() => <div class="max-w-300 mx-auto">{slots.default?.()}</div>)
</script>
