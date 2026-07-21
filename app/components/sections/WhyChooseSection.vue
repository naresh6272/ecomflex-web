<template>
  <section id="why-choose" class="section-padding relative overflow-hidden bg-[var(--color-bg)]">
    <!-- Decorative blobs (opacity-only, no border-radius or filter animation) -->
    <div class="absolute -left-40 top-1/3 w-80 h-80 rounded-full pointer-events-none animate-pulse-glow"
      style="background: radial-gradient(circle, rgb(var(--color-glow-1) / 0.15), transparent 70%)" />
    <div class="absolute -right-40 bottom-1/3 w-64 h-64 rounded-full pointer-events-none animate-pulse-glow"
      style="background: radial-gradient(circle, rgb(var(--color-glow-1) / 0.08), transparent 70%); animation-delay: -1.5s" />

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">Why Choose Us</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          The ECOMFLEX<br /><span class="text-gradient">Advantage</span>
        </h2>
        <p class="section-sub reveal-up delay-200">
          We combine technical excellence with business acumen to deliver solutions that actually work in the real world.
        </p>
      </div>

      <!-- Strengths grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        <div v-for="(s, i) in strengths" :key="s.title"
          class="card tilt-card p-7 reveal-up group"
          :class="`delay-${(i % 3) * 100}`">
          <div class="card-shine" />
          <div class="icon-solid w-14 h-14 mb-5 flex items-center justify-center"
            :style="{ background: s.bg }">
            <component :is="s.icon" :size="22" class="text-white" />
          </div>
          <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-2">{{ s.title }}</h3>
          <p class="text-sm text-[var(--color-text-muted)] leading-relaxed">{{ s.body }}</p>
          <div class="mt-4 pt-4 border-t border-[var(--color-border)]">
            <span class="text-xs font-semibold text-[var(--color-primary)]">{{ s.metric }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Rocket, ShieldCheck, Clock, Users, TrendingUp, Award, Code2, Headphones } from 'lucide-vue-next'

const strengths = [
  { icon: Rocket, title: 'Fast Delivery', body: 'Agile sprints and proven workflows that cut time-to-market without cutting quality.', metric: 'Avg 40% faster delivery', bg: 'linear-gradient(135deg, #1D4ED8, #2563EB)' },
  { icon: ShieldCheck, title: 'Security First', body: 'Every project follows OWASP guidelines, data encryption, and security audits.', metric: '100% secure deployments', bg: 'linear-gradient(135deg, #0e2240, #1D4ED8)' },
  { icon: Code2, title: 'Clean Code', body: 'Maintainable, tested, documented code that your future team will thank you for.', metric: '< 2% bug rate in production', bg: 'linear-gradient(135deg, #1D4ED8, #2563EB)' },
  { icon: Users, title: 'Dedicated Team', body: 'You get a dedicated project manager + engineers — no handoffs, no silos.', metric: 'Direct access to your team', bg: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
  { icon: TrendingUp, title: 'Scalable Architecture', body: 'Systems designed to handle 10x growth without costly rewrites.', metric: 'Handles millions of users', bg: 'linear-gradient(135deg, #0a1e38, #2563EB)' },
  { icon: Headphones, title: '24/7 Support', body: 'Round-the-clock monitoring and support so your business never goes dark.', metric: '99.9% uptime guarantee', bg: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
]
</script>
