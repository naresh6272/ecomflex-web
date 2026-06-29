<template>
  <section id="faq" class="section-padding relative overflow-hidden bg-[var(--color-bg)]">
    <div class="relative max-w-3xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">FAQ</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Frequently Asked<br /><span class="text-gradient">Questions</span>
        </h2>
      </div>

      <div class="space-y-3">
        <div v-for="(faq, i) in faqs" :key="i"
          class="card overflow-hidden reveal-up"
          :class="`delay-${(i % 5) * 75}`">
          <button
            class="w-full flex items-center justify-between gap-4 p-5 text-left"
            @click="openIndex = openIndex === i ? null : i">
            <span class="font-semibold text-[var(--color-text-primary)] text-sm">{{ faq.q }}</span>
            <div class="w-7 h-7 rounded-lg bg-[var(--color-primary-dim)] flex items-center justify-center shrink-0 transition-transform"
              :class="openIndex === i ? 'rotate-45' : ''">
              <PlusIcon :size="16" class="text-[var(--color-primary)]" />
            </div>
          </button>
          <Transition name="accordion">
            <div v-if="openIndex === i" class="px-5 pb-5">
              <p class="text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)] pt-4">{{ faq.a }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Plus as PlusIcon } from 'lucide-vue-next'
useScrollReveal()

const openIndex = ref<number | null>(0)

const faqs = [
  { q: 'How much does a custom software project cost?', a: 'Project budgets can range from as low as ₹5,000 for small tasks to ₹50+ lakhs for large enterprise platforms. The cost depends entirely on the scope, complexity, and features required. We provide a detailed, transparent estimate after a free discovery call — no surprises.' },
  { q: 'How long does it take to build a project?', a: 'Small projects can be delivered in as little as 2–3 weeks. Larger projects vary based on complexity — a full web application typically takes 6–16 weeks, while enterprise ERP/SaaS systems can range from 3–12 months. Every project gets a clear timeline committed in writing.' },
  { q: 'Do you provide ongoing support after launch?', a: 'Yes — we offer post-launch support packages with bug fixes, updates, monitoring, and feature additions. Most clients stay with us on a monthly retainer.' },
  { q: 'Which technologies do you specialize in?', a: 'Our primary stack is Vue/Nuxt, React/Next.js, Node.js, Python, PostgreSQL, MongoDB, and AWS/GCP. We pick the right tool for your project, not just our preference.' },
  { q: 'Can you work with our existing codebase?', a: 'Absolutely. We regularly take over legacy projects, modernize them, and add new features. We start with a code audit to understand the existing architecture.' },
  { q: 'Do you sign NDAs and IP agreements?', a: 'Yes, we sign NDAs before any discussion and all IP is 100% transferred to you upon project completion and final payment. Everything is documented in writing.' },
  { q: 'How do you handle project communication?', a: 'You get a dedicated project manager with daily/weekly standups, a shared Slack channel, access to our project management tool, and weekly progress reports.' },
  { q: 'Do you have experience in my specific industry?', a: 'We have delivered projects across 19+ industries including healthcare, fintech, e-commerce, education, logistics, and manufacturing. Ask us about your specific domain.' },
]
</script>

<style scoped>
.accordion-enter-active, .accordion-leave-active { transition: all 0.3s ease; }
.accordion-enter-from, .accordion-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
