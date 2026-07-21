<template>
  <section id="industries" class="section-padding relative overflow-hidden bg-[var(--color-bg-alt)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">Industries</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Industries<br /><span class="text-gradient">We Serve</span>
        </h2>
        <p class="section-sub reveal-up delay-200">Deep domain expertise across the industries that matter most in today's digital economy.</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="(ind, i) in industries"
          :key="ind.id"
          class="card p-6 group cursor-pointer reveal-up"
          :class="`delay-${(i % 4) * 100}`"
          @mouseenter="activeId = ind.id"
          @mouseleave="activeId = null">
          <!-- Top accent line -->
          <div class="absolute top-0 left-0 right-0 h-0.5 rounded-t-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{ background: `linear-gradient(90deg, ${ind.color}, transparent)` }" />

          <div class="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative overflow-hidden"
            :style="{ background: `linear-gradient(135deg, ${ind.color}22, ${ind.color}10)`, border: `1px solid ${ind.color}30` }">
            <!-- Glow effect on hover -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              :style="{ background: `radial-gradient(circle, ${ind.color}30, transparent)` }" />
            <PremiumIcon :name="ind.svgIcon" :size="20" :color="ind.color" :strokeWidth="1.75" />
          </div>

          <h3 class="font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[#ff7a33] transition-colors">{{ ind.name }}</h3>

          <Transition name="expand">
            <div v-if="activeId === ind.id" class="mt-3 pt-3 border-t border-[var(--color-border)]">
              <p class="text-xs text-[var(--color-text-muted)] leading-relaxed">{{ ind.solution }}</p>
            </div>
            <p v-else class="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">{{ ind.challenge }}</p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { industries } from '~/data/industries'
const activeId = ref<string | null>(null)
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
