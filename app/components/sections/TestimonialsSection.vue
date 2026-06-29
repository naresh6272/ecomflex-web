<template>
  <section id="testimonials" class="section-padding relative overflow-hidden bg-[var(--color-bg-alt)]">
    <!-- Animated background gradient -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-20"
      style="background: radial-gradient(ellipse, rgba(37,99,235,0.12), transparent 70%)" />

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">Testimonials</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          What Our Clients<br /><span class="text-gradient">Say About Us</span>
        </h2>
      </div>

      <!-- Testimonial grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div v-for="(t, i) in testimonials" :key="t.name"
          class="card tilt-card p-7 flex flex-col reveal-up"
          :class="`delay-${(i % 3) * 150}`"
          :style="i === 1 ? 'grid-row: span 1;' : ''">
          <div class="card-shine" />
          <!-- Stars -->
          <div class="flex gap-1 mb-4">
            <span v-for="s in 5" :key="s" class="text-amber-400 text-sm">★</span>
          </div>
          <!-- Quote -->
          <blockquote class="text-[var(--color-text-secondary)] leading-relaxed mb-6 flex-1 text-sm">
            "{{ t.quote }}"
          </blockquote>
          <!-- Author -->
          <div class="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {{ t.name.charAt(0) }}
            </div>
            <div>
              <div class="font-semibold text-sm text-[var(--color-text-primary)]">{{ t.name }}</div>
              <div class="text-xs text-[var(--color-text-muted)]">{{ t.role }}, {{ t.company }}</div>
            </div>
            <div class="ml-auto">
              <span class="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-dim)] rounded-full px-2.5 py-1">{{ t.industry }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Logos -->
      <div class="glass-strong rounded-2xl px-8 py-6 reveal-up">
        <p class="text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-6">Trusted by leading companies</p>
        <div class="flex flex-wrap items-center justify-center gap-8">
          <div v-for="logo in logos" :key="logo"
            class="text-sm font-bold tracking-wider text-[var(--color-text-faint)] hover:text-[var(--color-primary)] transition-colors cursor-default">
            {{ logo }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()
useTilt()

const testimonials = [
  { name: 'Reddy Construction', role: 'Local Guide', company: 'Google Review', industry: '⭐ Google', quote: 'Had a great experience with Ecomflex. They understood my requirements perfectly and built the website exactly as I wanted. Really happy with the quality and overall service. Highly recommended!' },
  { name: 'Vijay Ram Reddy', role: 'Client', company: 'Google Review', industry: '⭐ Google', quote: 'Working with Ecomflex was a wonderful experience. They listened to my requirements carefully and created the website just the way I wanted. I\'m really impressed with the quality and service. Definitely recommend them.' },
  { name: 'Keerthan Reddy', role: 'Client', company: 'Google Review', industry: '⭐ Google', quote: 'Very satisfied with the work done by Ecomflex. The team was easy to communicate with and delivered the website just as I had imagined. Smooth experience from start to finish. Thanks for the great work!' },
]

const logos = ['RetailPro', 'EduTech', 'FinServe', 'HealthFirst', 'ManufactureX', 'LogiTrack', 'TechCorp', 'BuildNow']
</script>
