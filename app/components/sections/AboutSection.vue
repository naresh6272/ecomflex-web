<template>
  <section id="about" class="section-padding relative overflow-hidden bg-[var(--color-bg-alt)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-20">
        <div class="section-label mb-5 reveal-up">About ECOMFLEX</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Crafting Digital<br />
          <span class="text-gradient">Experiences That Matter</span>
        </h2>
        <p class="section-sub reveal-up delay-200">
          We are a team of passionate engineers, designers, and strategists who believe software should solve real problems beautifully.
        </p>
      </div>

      <!-- Mission / Vision / Values cards -->
      <div class="grid md:grid-cols-3 gap-6 mb-20">
        <div v-for="(item, i) in pillars" :key="item.title"
          class="card tilt-card p-8 reveal-scale"
          :class="`delay-${(i+1)*100}`">
          <div class="icon-solid w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
            :style="{ background: item.bg }">
            <component :is="item.icon" :size="24" class="text-white" />
          </div>
          <h3 class="text-xl font-bold text-[var(--color-text-primary)] mb-3">{{ item.title }}</h3>
          <p class="text-[var(--color-text-muted)] leading-relaxed text-sm">{{ item.body }}</p>
        </div>
      </div>

      <!-- Stats row -->
      <div ref="statsRowRef" class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div v-for="(stat, i) in statsData" :key="stat.label"
          class="card p-6 text-center reveal-up"
          :class="`delay-${i*100}`">
          <div class="text-4xl font-black text-gradient-static mb-2">{{ statDisplays[i] }}</div>
          <div class="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{{ stat.label }}</div>
          <div class="text-xs text-[var(--color-text-muted)]">{{ stat.sub }}</div>
        </div>
      </div>

      <!-- Team / Culture split -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="reveal-left">
          <div class="section-label mb-5">Our Culture</div>
          <h3 class="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
            Built on<br /><span class="text-gradient">Excellence & Trust</span>
          </h3>
          <div class="space-y-4">
            <div v-for="value in values" :key="value.title"
              class="flex items-start gap-4 p-4 rounded-2xl hover:bg-[var(--color-surface)] transition-colors group reveal-up">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <component :is="value.icon" :size="18" class="text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-[var(--color-text-primary)] mb-1">{{ value.title }}</h4>
                <p class="text-sm text-[var(--color-text-muted)] leading-relaxed">{{ value.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual panel -->
        <div class="reveal-right">
          <div class="relative">
            <!-- Main card -->
            <div class="glass-strong rounded-3xl p-8 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style="background: radial-gradient(circle, rgb(var(--color-glow-1) / 0.10), transparent); transform: translate(30%, -30%)" />
              <div class="space-y-5">
                <div v-for="tech in techStack" :key="tech.name"
                  class="flex items-center gap-4 reveal-up">
                  <div class="flex items-center gap-2 w-32 shrink-0">
                    <span class="text-lg">{{ tech.icon }}</span>
                    <span class="text-sm font-medium text-[var(--color-text-secondary)]">{{ tech.name }}</span>
                  </div>
                  <div class="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] transition-all duration-1000"
                      :style="{ width: revealed ? tech.level + '%' : '0%' }" />
                  </div>
                  <span class="text-xs font-bold text-[var(--color-primary)] w-10 text-right">{{ tech.level }}%</span>
                </div>
              </div>
            </div>

            <!-- Floating badge -->
            <div class="absolute -bottom-5 -left-5 glass rounded-2xl px-5 py-4 shadow-xl animate-float">
              <div class="text-2xl font-black text-gradient-static">5★</div>
              <div class="text-xs text-[var(--color-text-muted)]">Average Rating</div>
            </div>
            <div class="absolute -top-5 -right-5 glass rounded-2xl px-5 py-4 shadow-xl animate-float-slow">
              <div class="text-2xl font-black text-gradient-static">ISO</div>
              <div class="text-xs text-[var(--color-text-muted)]">9001 Certified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Zap, ShieldCheck, Users, TrendingUp, Award, Clock, Target, Sparkles, Lightbulb } from 'lucide-vue-next'

const revealed = ref(false)
const statsRowRef = ref<HTMLElement | null>(null)

function animateCountUp() {
  statsData.forEach((stat, i) => {
    const duration = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      statDisplays.value[i] = Math.round(ease * stat.end) + stat.suffix
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

onMounted(() => {
  setTimeout(() => { revealed.value = true }, 600)

  nextTick(() => {
    const statsEl = statsRowRef.value
    if (!statsEl) return

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Reset to 0 then animate — works on every scroll into view
        statDisplays.value = statsData.map(() => '0')
        animateCountUp()
      }
    }, { threshold: 0.2 })

    obs.observe(statsEl)
    onUnmounted(() => obs.disconnect())
  })
})

const pillars = [
  {
    icon: Target,
    title: 'Our Mission',
    body: 'To empower businesses with technology that creates genuine value — software that is fast, reliable, and beautiful, built with care and precision.',
    bg: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
  },
  {
    icon: Sparkles,
    title: 'Our Vision',
    body: 'To be the most trusted technology partner for ambitious businesses across India and globally, known for craftsmanship, reliability and innovation.',
    bg: 'linear-gradient(135deg, #2563EB, #3B82F6)',
  },
  {
    icon: Lightbulb,
    title: 'Our Values',
    body: 'Quality over quantity. Transparency in every interaction. Continuous learning. Client success is our success — we measure ourselves by your outcomes.',
    bg: 'linear-gradient(135deg, #0e2240, #1D4ED8)',
  },
]

const statsData = [
  { end: 20,  suffix: '+', label: 'Projects Delivered', sub: 'Across multiple countries' },
  { end: 15,  suffix: '+', label: 'Happy Clients',       sub: '98% retention rate' },
  { end: 6,   suffix: '+', label: 'Years Experience',    sub: 'Since 2019' },
  { end: 15,  suffix: '+', label: 'Expert Team',         sub: 'Engineers & designers' },
]
const statDisplays = ref(statsData.map(() => '0'))

const values = [
  { icon: Zap, title: 'Speed Without Compromise', desc: 'We deliver fast without cutting corners — rapid iterations, quality code.' },
  { icon: ShieldCheck, title: 'Security First', desc: 'Every application is built with enterprise-grade security from the ground up.' },
  { icon: Users, title: 'Client Partnership', desc: 'We work as an extension of your team, not just a vendor.' },
  { icon: TrendingUp, title: 'Scalable by Design', desc: 'Architecture that grows with your business, from MVP to millions of users.' },
]

const techStack = [
  { icon: '⚡', name: 'Vue / Nuxt', level: 98 },
  { icon: '🚀', name: 'Node.js', level: 95 },
  { icon: '🐍', name: 'Python / AI', level: 90 },
  { icon: '☁️', name: 'Cloud / AWS', level: 92 },
  { icon: '📱', name: 'React Native', level: 87 },
]
</script>
