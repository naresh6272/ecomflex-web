<template>
  <section id="process" class="section-padding relative overflow-hidden bg-[var(--color-bg-alt)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">How We Work</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Our Development<br /><span class="text-gradient">Process</span>
        </h2>
        <p class="section-sub reveal-up delay-200">
          A proven 8-phase framework refined over 8 years and 500+ projects. Every step is deliberate, every milestone is tracked.
        </p>
      </div>

      <!-- Row 1 -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div v-for="(step, i) in steps.slice(0, 4)" :key="step.phase"
          class="card p-6 text-center group reveal-up"
          :class="`delay-${i * 100}`">
          <div class="flex justify-center mb-5">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-white text-sm font-black flex items-center justify-center shadow-lg shadow-[rgba(37,99,235,0.30)] group-hover:scale-110 transition-transform">
              {{ step.phase }}
            </div>
          </div>
          <div class="flex justify-center mb-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :style="{ background: step.bg, border: `1.5px solid ${step.border}` }">
              <component :is="step.icon" :size="22" :style="{ color: step.color }" />
            </div>
          </div>
          <h3 class="font-bold text-[var(--color-text-primary)] mb-2">{{ step.title }}</h3>
          <p class="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">{{ step.desc }}</p>
          <span class="inline-block text-xs font-semibold rounded-full px-3 py-1" :style="{ color: step.color, background: step.bg, border: `1px solid ${step.border}` }">
            {{ step.duration }}
          </span>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(step, i) in steps.slice(4)" :key="step.phase"
          class="card p-6 text-center group reveal-up"
          :class="`delay-${i * 100}`">
          <div class="flex justify-center mb-5">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white text-sm font-black flex items-center justify-center shadow-lg shadow-[rgba(37,99,235,0.25)] group-hover:scale-110 transition-transform">
              {{ step.phase }}
            </div>
          </div>
          <div class="flex justify-center mb-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :style="{ background: step.bg, border: `1.5px solid ${step.border}` }">
              <component :is="step.icon" :size="22" :style="{ color: step.color }" />
            </div>
          </div>
          <h3 class="font-bold text-[var(--color-text-primary)] mb-2">{{ step.title }}</h3>
          <p class="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">{{ step.desc }}</p>
          <span class="inline-block text-xs font-semibold rounded-full px-3 py-1" :style="{ color: step.color, background: step.bg, border: `1px solid ${step.border}` }">
            {{ step.duration }}
          </span>
        </div>
      </div>

      <!-- CTA strip -->
      <div class="mt-16 glass-strong rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 reveal-up">
        <div>
          <h3 class="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Ready to Start Your Project?</h3>
          <p class="text-[var(--color-text-muted)]">Get a free consultation and project estimate within 24 hours.</p>
        </div>
        <div class="flex gap-3 shrink-0">
          <a href="#contact" class="btn-primary px-7 py-3">Get Started</a>
          <a href="#projects" class="btn-secondary px-7 py-3">See Work</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Search, Layers, Palette, Code2,
  ShieldCheck, Rocket, LineChart, TrendingUp
} from 'lucide-vue-next'

useScrollReveal()

const steps = [
  { phase: 1, icon: Search,      title: 'Discovery',        desc: 'Deep dive into your business goals, user needs, and technical requirements.',          duration: '1–3 days',   color: '#7B8CCC', bg: 'rgba(123,140,204,0.12)', border: 'rgba(123,140,204,0.22)' },
  { phase: 2, icon: Layers,      title: 'Architecture',     desc: 'System design, tech stack selection, database schema, and API planning.',              duration: '2–5 days',   color: '#4A85C8', bg: 'rgba(74,133,200,0.12)',  border: 'rgba(74,133,200,0.22)'  },
  { phase: 3, icon: Palette,     title: 'UI/UX Design',     desc: 'Wireframes, prototypes and pixel-perfect designs before a single line of code.',      duration: '1–2 weeks',  color: '#B07BAC', bg: 'rgba(176,123,172,0.12)', border: 'rgba(176,123,172,0.22)' },
  { phase: 4, icon: Code2,       title: 'Development',      desc: 'Agile sprints with daily standups, code reviews, and continuous integration.',        duration: '4–12 weeks', color: '#5A9E78', bg: 'rgba(90,158,120,0.12)',  border: 'rgba(90,158,120,0.22)'  },
  { phase: 5, icon: ShieldCheck, title: 'QA Testing',       desc: 'Manual + automated testing, performance benchmarking, and security audits.',          duration: '1–2 weeks',  color: '#B8943A', bg: 'rgba(184,148,58,0.12)',  border: 'rgba(184,148,58,0.22)'  },
  { phase: 6, icon: Rocket,      title: 'Deployment',       desc: 'Zero-downtime deployment, CI/CD pipelines, and monitoring setup.',                    duration: '2–4 days',   color: '#B07060', bg: 'rgba(176,112,96,0.12)',  border: 'rgba(176,112,96,0.22)'  },
  { phase: 7, icon: LineChart,   title: 'Launch & Monitor', desc: 'Real-time monitoring, performance tracking, and rapid issue resolution.',             duration: 'Ongoing',    color: '#4A96A8', bg: 'rgba(74,150,168,0.12)',  border: 'rgba(74,150,168,0.22)'  },
  { phase: 8, icon: TrendingUp,  title: 'Growth & Iterate', desc: 'Continuous improvements based on analytics, user feedback, and scaling needs.',      duration: 'Ongoing',    color: '#8878BC', bg: 'rgba(136,120,188,0.12)', border: 'rgba(136,120,188,0.22)' },
]
</script>
