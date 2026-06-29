<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    :class="scrolled ? 'header-scrolled' : 'header-top'"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="flex items-center justify-between h-16 lg:h-20">

        <!-- Logo -->
        <a href="#" class="flex items-center shrink-0">
          <img src="/logo.png" alt="Logo" class="h-10 w-auto object-contain logo-img" />
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="nav-link">
            {{ link.label }}
          </a>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <a href="#contact" class="hidden sm:inline-flex btn-primary py-2.5 px-6 text-sm font-semibold">
            <span>Let's Talk</span>
            <ArrowRightIcon :size="14" />
          </a>

          <button @click="menuOpen = !menuOpen" class="lg:hidden theme-btn">
            <XIcon v-if="menuOpen" :size="18" />
            <MenuIcon v-else :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="lg:hidden mobile-menu border-t border-[var(--color-border)]">
        <div class="max-w-7xl mx-auto px-6 py-6 space-y-1">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            @click="menuOpen = false"
            class="mobile-link">
            {{ link.label }}
          </a>
          <div class="pt-4">
            <a href="#contact" @click="menuOpen = false" class="btn-primary w-full justify-center py-3.5">
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ArrowRight as ArrowRightIcon, Menu as MenuIcon, X as XIcon } from 'lucide-vue-next'

const scrolled = ref(false)
const menuOpen = ref(false)

const navLinks = [
  { href: '#about',    label: 'About'     },
  { href: '#services', label: 'Services'  },
  { href: '#process',  label: 'Process'   },
  { href: '#projects', label: 'Work'      },
  { href: '#contact',  label: 'Contact'   },
]

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 40 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.header-top {
  background: transparent;
  border-bottom: 1px solid transparent;
}
.header-scrolled {
  background: rgba(2, 1, 4, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 34, 0, 0.12);
}

.logo-img {
  filter: drop-shadow(0 0 10px rgba(201, 168, 76, 0.3));
  transition: filter 0.3s ease;
}
.logo-img:hover { filter: drop-shadow(0 0 18px rgba(201, 168, 76, 0.55)); }

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1.5px;
  background: var(--color-primary);
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.nav-link:hover { color: var(--color-text-primary); }
.nav-link:hover::after { width: 100%; }

.mobile-menu {
  background: rgba(2, 1, 4, 0.97);
  backdrop-filter: blur(20px);
}

.mobile-link {
  display: block;
  padding: 0.875rem 0.5rem;
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--header-nav-color);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
  transition: color 0.2s ease;
}
.mobile-link:hover { color: var(--header-nav-hover); }


.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
