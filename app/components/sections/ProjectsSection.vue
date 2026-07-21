<template>
  <section id="projects" class="section-padding relative overflow-hidden bg-[var(--color-bg-alt)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">Our Work</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Featured<br /><span class="text-gradient">Projects</span>
        </h2>
        <p class="section-sub reveal-up delay-200">Real solutions for real businesses — each one built with care and precision.</p>
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center justify-center gap-3 mb-10 reveal-up">
        <button v-for="tab in ['All', 'Completed', 'Ongoing']" :key="tab"
          @click="activeTab = tab"
          class="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
          :class="activeTab === tab
            ? 'bg-[var(--color-primary)] text-white'
            : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'">
          {{ tab }}
        </button>
      </div>

      <TransitionGroup name="proj" tag="div" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(p, i) in filteredProjects" :key="p.title"
          class="card group overflow-hidden"
          :style="{ transitionDelay: `${(i % 3) * 80}ms` }">
          <!-- Project image -->
          <div class="h-48 relative overflow-hidden" :style="{ background: p.gradient }">
            <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(37,99,235,0.09),transparent 65%)" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-5xl">{{ p.emoji }}</span>
            </div>
            <!-- Status badge -->
            <div class="absolute top-3 left-3">
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full"
                :class="p.status === 'Completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'">
                <span v-if="p.status === 'Ongoing'" class="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1" />
                {{ p.status }}
              </span>
            </div>
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <a v-if="p.link" :href="p.link" target="_blank" rel="noopener noreferrer"
                class="text-white text-xs font-semibold hover:text-blue-300 transition-colors"
                @click.stop>
                Visit Website →
              </a>
              <span v-else class="text-white text-xs font-semibold">In Development →</span>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-3 mb-3">
              <h3 class="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{{ p.title }}</h3>
              <span class="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-dim)] rounded-full px-2.5 py-1 shrink-0">{{ p.type }}</span>
            </div>
            <p class="text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed">{{ p.desc }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in p.tags" :key="tag"
                class="text-[10px] font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-md px-2 py-0.5">
                {{ tag }}
              </span>
            </div>
            <div class="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center gap-4">
              <div v-for="metric in p.metrics" :key="metric.label" class="text-center">
                <div class="font-bold text-sm text-gradient-static">{{ metric.value }}</div>
                <div class="text-[10px] text-[var(--color-text-muted)]">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div class="text-center mt-12 reveal-up">
        <a href="#contact" class="btn-primary px-8 py-3">Start Your Project</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const activeTab = ref('All')

const projects = [
  // ── Completed (real) ──────────────────────────────────────────────────
  {
    emoji: '💼', title: 'WeCool Payroll', type: 'HR & Payroll', status: 'Completed',
    link: 'https://www.wecoolpayroll.co.in/',
    desc: 'Full-featured payroll management platform handling salary processing, compliance, tax filing, and employee self-service for Indian businesses.',
    gradient: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
    tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'AWS'],
    metrics: [{ value: '100%', label: 'GST Compliant' }, { value: 'Auto', label: 'Tax Filing' }, { value: '24/7', label: 'Uptime' }],
  },
  {
    emoji: '🏗️', title: 'Reddy Constructions', type: 'Construction', status: 'Completed',
    link: 'https://www.reddyconstructions.in/',
    desc: 'Corporate website and project showcase platform for a leading construction firm, featuring project portfolios, client testimonials, and inquiry management.',
    gradient: 'linear-gradient(135deg, #0e2240, #2563EB)',
    tags: ['Nuxt.js', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    metrics: [{ value: '3x', label: 'Lead Growth' }, { value: '4.9★', label: 'Client Rating' }, { value: 'Fast', label: 'Load Time' }],
  },
  {
    emoji: '💡', title: 'Vijay Innovation', type: 'Tech Startup', status: 'Completed',
    link: 'https://vijayinnovation.com/',
    desc: 'Brand identity and web presence for an innovative tech company, with a modern design, service showcase, and integrated contact system.',
    gradient: 'linear-gradient(135deg, #2563EB, #f59e0b)',
    tags: ['Vue.js', 'Tailwind CSS', 'Nuxt.js', 'Vercel'],
    metrics: [{ value: '+60%', label: 'Engagement' }, { value: '99%', label: 'Uptime' }, { value: 'SEO', label: 'Optimized' }],
  },
  // ── Ongoing ───────────────────────────────────────────────────────────
  {
    emoji: '📦', title: 'TraceVault — Warehouse Tracker', type: 'Logistics & Warehousing', status: 'Ongoing',
    link: null,
    desc: 'End-to-end warehouse product tracing system with barcode/QR scanning, real-time stock movement, shelf mapping, and automated low-stock alerts.',
    gradient: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
    tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'IoT', 'QR/Barcode'],
    metrics: [{ value: 'Real-time', label: 'Tracking' }, { value: '99%', label: 'Accuracy' }, { value: 'In Dev', label: 'Status' }],
  },
  {
    emoji: '📣', title: 'PromoSpark — Promotions Platform', type: 'Marketing & AdTech', status: 'Ongoing',
    link: null,
    desc: 'All-in-one product promotions platform enabling brands to create, launch, and track campaigns across digital channels with real-time analytics.',
    gradient: 'linear-gradient(135deg, #2563EB, #f59e0b)',
    tags: ['React', 'Node.js', 'MongoDB', 'Redis', 'Meta API'],
    metrics: [{ value: 'Multi', label: 'Channel' }, { value: 'Live', label: 'Analytics' }, { value: 'In Dev', label: 'Status' }],
  },
  {
    emoji: '👷', title: 'InstaWorkers — Construction Staffing', type: 'Construction & Workforce', status: 'Ongoing',
    link: null,
    desc: 'On-demand platform connecting construction sites with verified skilled workers — masons, electricians, plumbers and more — available for daily or contract hire.',
    gradient: 'linear-gradient(135deg, #0a1e38, #1D4ED8)',
    tags: ['Flutter', 'Node.js', 'PostgreSQL', 'Google Maps', 'Aadhaar KYC'],
    metrics: [{ value: 'On-demand', label: 'Hiring' }, { value: 'Verified', label: 'Workers' }, { value: 'In Dev', label: 'Status' }],
  },
]

const filteredProjects = computed(() =>
  activeTab.value === 'All' ? projects : projects.filter(p => p.status === activeTab.value)
)
</script>

<style scoped>
.proj-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.proj-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.proj-enter-from   { opacity: 0; transform: translateY(24px) scale(0.97); }
.proj-leave-to     { opacity: 0; transform: translateY(-12px) scale(0.97); }
.proj-leave-active { position: absolute; }
</style>
