<template>
  <ClientOnly>
    <!-- Scroll progress ring -->
    <div class="fixed top-20 right-5 z-40 hidden lg:block">
      <svg width="48" height="48" class="progress-ring drop-shadow-md">
        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(37,99,235,0.15)" stroke-width="3" />
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="url(#progressGrad)"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="progress-ring-circle transition-all duration-100"
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" />
            <stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary-light)]">
        {{ Math.round(progress) }}%
      </span>
    </div>

    <!-- Back to top -->
    <Transition name="fade-up">
      <button v-if="showBackTop" @click="scrollToTop"
        class="fixed bottom-24 right-5 z-40 w-11 h-11 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-white shadow-lg shadow-[rgba(37,99,235,0.30)] hover:shadow-[rgba(37,99,235,0.50)] hover:-translate-y-1 transition-all flex items-center justify-center"
        aria-label="Back to top">
        <ChevronUpIcon :size="20" />
      </button>
    </Transition>

    <!-- WhatsApp float -->
    <a href="https://wa.me/919148625342" target="_blank" rel="noopener noreferrer"
      class="fixed bottom-6 right-5 z-40 rounded-2xl flex items-center justify-center shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all group"
      style="background: linear-gradient(135deg, #2563EB, #1D4ED8); width: 52px; height: 52px;"
      aria-label="Chat on WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span class="absolute inset-0 rounded-2xl animate-ping opacity-20" style="background: #2563EB" />
    </a>

  </ClientOnly>
</template>

<script setup lang="ts">
import { ChevronUp as ChevronUpIcon } from 'lucide-vue-next'
const progress = ref(0)
const showBackTop = ref(false)
const circumference = 2 * Math.PI * 20

const dashOffset = computed(() => circumference - (progress.value / 100) * circumference)

onMounted(() => {
  const onScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    showBackTop.value = scrollTop > 400
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style scoped>
.progress-ring { transform: rotate(-90deg); }
.fade-up-enter-active, .fade-up-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(10px); }
</style>
