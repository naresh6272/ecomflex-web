<template>
  <span>{{ displayValue }}{{ suffix }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ to: number; suffix?: string; active?: boolean }>()
const displayValue = ref(0)

watch(() => props.active, (val) => {
  if (!val) { displayValue.value = 0; return }
  const duration = 2000
  const start = performance.now()
  const update = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - t, 3)
    displayValue.value = Math.round(ease * props.to)
    if (t < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
})
</script>
