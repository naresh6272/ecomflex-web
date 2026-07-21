<template>
  <section id="services" class="section-padding relative overflow-hidden bg-[var(--color-bg)]">
    <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse 80% 40% at 50% 0%,rgb(var(--color-glow-1) / 0.09),transparent 65%)" />
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-12">
        <div class="section-label mb-5 reveal-up">What We Build</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          70+ Services Across<br /><span class="text-gradient">7 Categories</span>
        </h2>
        <p class="section-sub reveal-up delay-200">
          From simple websites to enterprise platforms — we build software that scales with your ambitions.
        </p>
      </div>

      <!-- Category filter -->
      <div class="flex flex-wrap justify-center gap-2 mb-10 reveal-up delay-300">
        <button
          v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          class="px-4 py-2 rounded-full text-sm font-semibold transition-all border-2"
          :class="activeCategory === cat
            ? 'bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white border-transparent'
            : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-dim)]'">
          {{ cat === 'All' ? '✦ All' : cat }}
        </button>
      </div>

      <!-- Service cards -->
      <TransitionGroup name="service-fade" tag="div" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="card p-5 group cursor-pointer tilt-card">
          <!-- 3D icon -->
          <div class="icon3d-wrap mb-4">
            <div class="icon3d">
              <PremiumIcon
                :name="iconMap[service.id] || iconMap[service.category] || 'default'"
                :size="24"
                :color="iconColor[service.category] || '#2563EB'"
                :strokeWidth="1.6"
              />
            </div>
          </div>
          <h3 class="font-bold text-sm text-[var(--color-text-primary)] mb-1.5 leading-snug">{{ service.title }}</h3>
          <p class="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">{{ service.description }}</p>
          <div v-if="service.featured" class="mt-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] bg-[rgba(37,99,235,0.12)] rounded-full px-2.5 py-1 border border-[rgba(37,99,235,0.22)]">⚡ Popular</span>
          </div>
        </div>
      </TransitionGroup>

      <div class="text-center mt-12 reveal-up">
        <a href="#contact" class="btn-secondary px-8 py-3">Discuss Your Project</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { services } from '~/data/services'

const categoryColors: Record<string, string> = {
  'Website Development': 'linear-gradient(135deg, #1D4ED8, #2563EB)',
  'Custom Software':     'linear-gradient(135deg, #0e2240, #1D4ED8)',
  'Business Systems':    'linear-gradient(135deg, #1D4ED8, #3d6e50)',
  'APIs & Backend':      'linear-gradient(135deg, #0a1e38, #2563EB)',
  'Cloud & DevOps':      'linear-gradient(135deg, #0e2240, #3B82F6)',
  'AI & Automation':     'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  'Design & Consulting': 'linear-gradient(135deg, #1a3d2a, #f59e0b)',
}

const iconColor: Record<string, string> = {
  'Website Development': '#3B82F6',
  'Custom Software':     '#2563EB',
  'Business Systems':    '#2563EB',
  'APIs & Backend':      '#3B82F6',
  'Cloud & DevOps':      '#3B82F6',
  'AI & Automation':     '#3B82F6',
  'Design & Consulting': '#f59e0b',
}

const iconMap: Record<string, string> = {
  // Website Development
  'business-websites':    'building',
  'corporate-websites':   'building',
  'portfolio-websites':   'layers',
  'landing-pages':        'target',
  'educational-websites': 'graduation',
  'healthcare-websites':  'heart',
  'construction-websites':'building',
  'restaurant-websites':  'globe',
  'hotel-websites':       'hotel',
  'travel-websites':      'map',
  'law-firm-websites':    'briefcase',
  'ngo-websites':         'heart',
  'event-websites':       'sparkles',
  'blog-websites':        'book',
  'membership-platforms': 'lock',
  'customer-portals':     'users',
  'employee-portals':     'briefcase',
  // Custom Software
  'custom-web-apps':      'code',
  'enterprise-software':  'cpu',
  'saas-platforms':       'cloud',
  'lms':                  'book',
  'school-management':    'graduation',
  'hospital-management':  'cross',
  'clinic-management':    'heart',
  'temple-management':    'globe',
  'event-management-sys': 'sparkles',
  'project-management':   'layers',
  'visitor-management':   'eye',
  // Business Systems
  'payroll':              'dollar',
  'hrms':                 'users',
  'attendance':           'eye',
  'crm':                  'handshake',
  'erp':                  'settings',
  'inventory':            'package',
  'accounting':           'chart-bar',
  'pos':                  'credit-card',
  'fleet-management':     'truck',
  // APIs & Backend
  'rest-apis':            'plug',
  'graphql':              'git-branch',
  'microservices':        'settings',
  'payment-gateways':     'credit-card',
  'third-party':          'link',
  'webhooks':             'zap',
  // Cloud & DevOps
  'aws-deployment':       'cloud',
  'docker':               'server',
  'kubernetes':           'server',
  'ci-cd':                'repeat',
  'monitoring':           'eye',
  'security-audit':       'shield',
  // AI & Automation
  'ai-chatbots':          'bot',
  'ml-models':            'brain',
  'nlp':                  'sparkles',
  'computer-vision':      'eye',
  'recommendation':       'sparkles',
  'rpa':                  'repeat',
  // Design & Consulting
  'ui-ux':                'pen-tool',
  'branding':             'palette',
  'design-system':        'layers',
  'consulting':           'lightbulb',
  'code-review':          'search',
  // Category fallbacks
  'Website Development':  'globe',
  'Custom Software':      'code',
  'Business Systems':     'settings',
  'APIs & Backend':       'plug',
  'Cloud & DevOps':       'cloud',
  'AI & Automation':      'brain',
  'Design & Consulting':  'pen-tool',
}

const categories = ['All', ...Object.keys(categoryColors)]
const activeCategory = ref('All')

const filteredServices = computed(() =>
  activeCategory.value === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory.value)
)
</script>

<style scoped>
.service-fade-enter-active, .service-fade-leave-active { transition: all 0.35s ease; }
.service-fade-enter-from, .service-fade-leave-to { opacity: 0; transform: scale(0.92) translateY(10px); }
.service-fade-move { transition: transform 0.35s ease; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
