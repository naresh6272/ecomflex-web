<template>
  <footer class="relative overflow-hidden footer-bg border-t border-[var(--color-border)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
      <!-- Top grid -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <!-- Brand -->
        <div class="col-span-2 lg:col-span-2">
          <div class="mb-4">
            <img src="/logo.png" alt="Logo" class="h-16 w-auto object-contain footer-logo" />
          </div>
          <p class="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xs">
            Premium software development studio building world-class digital products for ambitious businesses.
          </p>
          <!-- Social -->
          <div class="flex gap-2">
            <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noopener noreferrer"
              class="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300"
              :aria-label="s.label">
              <component :is="s.icon" :size="16" />
            </a>
          </div>
        </div>

        <!-- Links columns -->
        <div v-for="col in footerLinks" :key="col.heading">
          <h4 class="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">{{ col.heading }}</h4>
          <ul class="space-y-2.5">
            <li v-for="link in col.links" :key="link.label">
              <a :href="link.href"
                class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-[var(--color-text-muted)]">
          © {{ new Date().getFullYear() }} ECOMFLEX. All rights reserved. Made with ❤️ in Karnataka.
        </p>
        <div class="flex gap-4">
          <a v-for="l in legalLinks" :key="l" href="#" class="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{{ l }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Instagram, Facebook, Twitter } from 'lucide-vue-next'

const socials = [
  { label: 'GitHub', href: '#', icon: Github },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Twitter', href: '#', icon: Twitter },
]

const footerLinks = [
  {
    heading: 'Services',
    links: [
      { label: 'Website Development', href: '#services' },
      { label: 'Custom Software', href: '#services' },
      { label: 'ERP / CRM Systems', href: '#services' },
      { label: 'AI & Automation', href: '#services' },
      { label: 'Cloud & DevOps', href: '#services' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Process', href: '#process' },
      { label: 'Projects', href: '#projects' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'E-Commerce', href: '#industries' },
      { label: 'Healthcare', href: '#industries' },
      { label: 'Education', href: '#industries' },
      { label: 'FinTech', href: '#industries' },
      { label: 'Manufacturing', href: '#industries' },
    ],
  },
]

const legalLinks = ['Privacy Policy', 'Terms of Service', 'Sitemap']
</script>

<style scoped>
.footer-bg { background: var(--color-bg-alt); }
.footer-logo {
  filter: drop-shadow(0 0 10px rgba(201, 168, 76, 0.3));
  transition: filter 0.3s ease;
}
.footer-logo:hover { filter: drop-shadow(0 0 18px rgba(201, 168, 76, 0.55)); }
</style>
