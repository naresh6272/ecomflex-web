<template>
  <div>
    <GradientBackground />
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <FloatingWidgets />
  </div>
</template>

<script setup lang="ts">
useScrollReveal()
useTilt()
useColorTheme().init()
// Lenis smooth scroll is handled by plugins/lenis.client.ts — do NOT add a second instance here

if (import.meta.client) {
  onMounted(() => {
    // On a hard page reload/direct visit, always land on the home page top —
    // ignore any stale #hash from a previous session/bookmark.
    const isReload = performance.getEntriesByType('navigation').some(
      (nav) => (nav as PerformanceNavigationTiming).type === 'reload'
    )
    if (isReload && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      window.scrollTo(0, 0)
    }
  })
}
</script>
