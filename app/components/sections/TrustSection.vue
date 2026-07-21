<template>
  <section id="trust" class="section-padding relative overflow-hidden bg-[var(--color-bg)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">Trust & Recognition</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Certified &<br /><span class="text-gradient">Recognized</span>
        </h2>
        <p class="section-sub reveal-up delay-200">Industry certifications and partnerships that validate our commitment to excellence.</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="(cert, i) in certificates" :key="cert.title"
          class="card tilt-card p-6 text-center group cursor-pointer reveal-scale hover:shadow-xl hover:border-[var(--color-primary)]"
          :class="`delay-${(i % 4) * 100}`"
          @click="openCertificate(cert)">
          <div class="card-shine" />
          <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
            :style="{ background: cert.bgColor }">
            <component :is="cert.icon" :size="32" :style="{ color: cert.iconColor }" />
          </div>
          <h3 class="font-bold text-[var(--color-text-primary)] mb-1 text-sm">{{ cert.title }}</h3>
          <p class="text-xs text-[var(--color-text-muted)] mb-3">{{ cert.body }}</p>
          <span class="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-dim)] rounded-full px-3 py-1">Click to view</span>
        </div>
      </div>

    </div>
  </section>

  <!-- Modal teleported to body so it's never clipped by overflow:hidden ancestors -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="activeCert"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @wheel.prevent
        @touchmove.prevent>
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeCertificate" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ activeCert.title }}</h3>
              <p class="text-sm text-gray-600">Certified {{ activeCert.year }}</p>
            </div>
            <button @click="closeCertificate" class="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <XIcon :size="20" class="text-gray-600" />
            </button>
          </div>

          <!-- PDF Viewer -->
          <div class="w-full h-[calc(100%-80px)] bg-gray-100">
            <iframe
              v-if="activeCert.path"
              :src="activeCert.path"
              class="w-full h-full"
              style="border: none;" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <p class="text-gray-500">Certificate file not found</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X as XIcon, FileText, Building2, Receipt, CreditCard, DollarSign, Users, CheckCircle } from 'lucide-vue-next'

onUnmounted(() => { document.body.style.overflow = '' })

const activeCert = ref<any>(null)

const openCertificate = (cert: any) => {
  activeCert.value = cert
  document.body.style.overflow = 'hidden'
}

const closeCertificate = () => {
  activeCert.value = null
  document.body.style.overflow = ''
}

const certificates = [
  {
    icon: FileText,
    title: 'Certificate of Incorporation',
    body: 'Officially registered business entity recognized by government authorities.',
    year: '2019',
    bgColor: 'rgba(59,130,246,0.15)',
    iconColor: '#2563EB',
    path: '/certificates/Certificate_of_Incorporation.pdf'
  },
  {
    icon: Building2,
    title: 'MSME Registration',
    body: 'Udyam registered micro, small, and medium enterprise for government recognition.',
    year: '2020',
    bgColor: 'rgba(37,99,235,0.15)',
    iconColor: '#1D4ED8',
    path: '/certificates/MSME_Udyam_Registration.pdf'
  },
  {
    icon: Receipt,
    title: 'GST Registration',
    body: 'GST-RC-29AAICE3114E1ZX — Goods & Services Tax compliance certification.',
    year: '2018',
    bgColor: 'rgba(59,130,246,0.15)',
    iconColor: '#3B82F6',
    path: '/certificates/GST_Registration.pdf'
  },
  {
    icon: CreditCard,
    title: 'PAN Card',
    body: 'Permanent Account Number registered for business taxation compliance.',
    year: '2018',
    bgColor: 'rgba(37,99,235,0.15)',
    iconColor: '#2563EB',
    path: '/certificates/PAN_Card.pdf'
  },
  {
    icon: DollarSign,
    title: 'TAN Certificate',
    body: 'Tax Account Number 8830592460755 — tax deduction authority certification.',
    year: '2019',
    bgColor: 'rgba(59,130,246,0.15)',
    iconColor: '#1D4ED8',
    path: '/certificates/TAN_Certificate.pdf'
  },
  {
    icon: Users,
    title: 'ESIC Registration',
    body: 'Employee Social Security compliance for workforce protection and benefits.',
    year: '2020',
    bgColor: 'rgba(37,99,235,0.15)',
    iconColor: '#3B82F6',
    path: '/certificates/ESIC_Registration.pdf'
  },
  {
    icon: CheckCircle,
    title: 'Board Resolution',
    body: 'Official Board Resolution affirming company governance and authorization.',
    year: '2024',
    bgColor: 'rgba(59,130,246,0.15)',
    iconColor: '#2563EB',
    path: '/certificates/Board_Resolution.pdf'
  },
]
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from .relative { transform: scale(0.85); }
.modal-leave-to .relative { transform: scale(0.9); }
</style>
