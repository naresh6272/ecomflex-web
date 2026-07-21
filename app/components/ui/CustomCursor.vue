<template>
  <ClientOnly>
    <div ref="dotEl"  class="cursor-dot"  />
    <div ref="ringEl" class="cursor-ring" />
  </ClientOnly>
</template>

<script setup lang="ts">
const dotEl  = ref<HTMLDivElement>()
const ringEl = ref<HTMLDivElement>()

onMounted(() => {
  if (!import.meta.client) return

  let mx = -200, my = -200
  let rx = -200, ry = -200
  let rafId = 0

  // Use translate3d — pure GPU composite, zero layout recalc
  const moveDot = (e: MouseEvent) => {
    mx = e.clientX; my = e.clientY
    if (dotEl.value) dotEl.value.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`
  }

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const tick = () => {
    rx = lerp(rx, mx, 0.13)
    ry = lerp(ry, my, 0.13)
    if (ringEl.value) ringEl.value.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId)
      rafId = 0
    } else if (!rafId) {
      rafId = requestAnimationFrame(tick)
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  // Event delegation — one listener on document instead of thousands on elements
  const onEnter = (e: MouseEvent) => {
    const t = e.target as Element
    if (t.closest('a,button,[role="button"],.card,label')) {
      dotEl.value?.classList.add('hovering')
      ringEl.value?.classList.add('hovering')
    }
  }
  const onLeave = (e: MouseEvent) => {
    const t = e.target as Element
    if (t.closest('a,button,[role="button"],.card,label')) {
      dotEl.value?.classList.remove('hovering')
      ringEl.value?.classList.remove('hovering')
    }
  }

  document.addEventListener('mouseover',  onEnter, { passive: true })
  document.addEventListener('mouseout',   onLeave, { passive: true })
  window.addEventListener('mousemove', moveDot, { passive: true })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousemove', moveDot)
    document.removeEventListener('mouseover',  onEnter)
    document.removeEventListener('mouseout',   onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})
</script>
