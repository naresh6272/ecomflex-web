<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <FloatingWidgets />
  </div>
</template>

<script setup lang="ts">
useScrollReveal()
useTilt()
// Lenis smooth scroll is handled by plugins/lenis.client.ts — do NOT add a second instance here

</script>
