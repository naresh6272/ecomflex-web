<template>
  <section id="contact" style="padding-top:5rem;padding-bottom:5rem;scroll-margin-top:90px;" class="relative overflow-hidden bg-[var(--color-bg-alt)]">
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10 animate-pulse-glow"
      style="background: radial-gradient(circle, rgb(var(--color-glow-1) / 1), transparent)" />

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-8">
        <div class="section-label mb-6">Get In Touch</div>
        <h2 class="section-title mb-5">
          Let's Build Something<br /><span class="text-gradient">Remarkable Together</span>
        </h2>
        <p class="section-sub">Tell us about your project. We'll get back within 24 hours with insights and a clear path forward.</p>
      </div>

      <div id="contact-form" class="grid lg:grid-cols-3 gap-8 reveal-up">
        <!-- Contact info -->
        <div class="space-y-4">
          <div v-for="info in contactInfo" :key="info.label"
            class="card p-5 flex items-center gap-4 group hover:border-[var(--color-border-strong)] transition-colors reveal-up">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <component :is="info.icon" :size="17" class="text-white" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5 font-semibold">{{ info.label }}</p>
              <a v-if="info.href" :href="info.href" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors truncate block">{{ info.value }}</a>
              <p v-else class="text-sm text-[var(--color-text-secondary)]">{{ info.value }}</p>
            </div>
          </div>

          <div class="card p-5">
            <p class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Follow Us</p>
            <div class="flex gap-2">
              <a v-for="social in socials" :key="social.label" :href="social.href" target="_blank" rel="noopener noreferrer"
                class="flex-1 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-primary-dim)] transition-all"
                :aria-label="social.label">
                <component :is="social.icon" :size="15" />
              </a>
            </div>
          </div>

          <div class="card p-5">
            <p class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Business Hours</p>
            <p class="text-sm text-[var(--color-text-secondary)]">Mon – Sat, 9 AM – 7 PM IST</p>
            <div class="flex items-center gap-2 mt-3">
              <span class="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span class="text-xs text-[#3B82F6] font-semibold">Currently Available</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="lg:col-span-2 glass-strong rounded-3xl p-7 sm:p-9 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-30"
            style="background: radial-gradient(circle, rgb(var(--color-glow-1) / 0.10), transparent); transform: translate(30%, -30%)" />

          <h3 class="text-xl font-bold text-[var(--color-text-primary)] mb-7">Project Enquiry</h3>

          <Transition name="fade">
            <div v-if="submitted" class="absolute inset-0 rounded-3xl bg-[var(--color-surface)] flex flex-col items-center justify-center text-center p-8 z-10">
              <div class="w-16 h-16 rounded-full bg-[rgba(255,34,0,0.12)] flex items-center justify-center mb-5">
                <CheckCircleIcon :size="32" class="text-[#3B82F6]" />
              </div>
              <h3 class="text-xl font-bold text-[var(--color-text-primary)] mb-3">Message Received!</h3>
              <p class="text-[var(--color-text-muted)] text-sm max-w-sm">Our team will review your requirements and respond within 24 hours.</p>
              <button @click="submitted = false; form = defaultForm()" class="mt-6 btn-secondary px-6 py-2 text-sm">Send Another</button>
            </div>
          </Transition>

          <form @submit.prevent="handleSubmit" class="space-y-5 relative">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="form-label">Full Name *</label>
                <input v-model="form.name" type="text" required placeholder="Rajesh Sharma" class="form-input" />
              </div>
              <div>
                <label class="form-label">Company</label>
                <input v-model="form.company" type="text" placeholder="Your Company" class="form-input" />
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="form-label">Email *</label>
                <input v-model="form.email" type="email" required placeholder="you@company.com" class="form-input" />
              </div>
              <div>
                <label class="form-label">Phone</label>
                <input v-model="form.phone" type="tel" placeholder="+91 98765 43210" class="form-input" />
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="form-label">Project Type *</label>
                <select v-model="form.projectType" class="form-input">
                  <option value="" disabled>Select type</option>
                  <option v-for="pt in projectTypes" :key="pt">{{ pt }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Budget Range</label>
                <select v-model="form.budget" class="form-input">
                  <option value="" disabled>Select range</option>
                  <option v-for="b in budgetRanges" :key="b">{{ b }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="form-label">Project Description *</label>
              <textarea v-model="form.description" rows="5" required
                placeholder="Describe your project, goals, and key requirements..."
                class="form-input resize-none" />
            </div>

            <p v-if="submitError" class="text-sm text-red-400">{{ submitError }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <p class="text-xs text-[var(--color-text-muted)]">Typical response time: 2–4 business hours</p>
              <button type="submit"
                class="btn-primary flex items-center gap-2 px-7 py-3 text-sm font-semibold shrink-0"
                :disabled="submitting">
                <span>{{ submitting ? 'Sending...' : 'Send Enquiry' }}</span>
                <SendIcon v-if="!submitting" :size="16" />
                <LoaderIcon v-else :size="16" class="animate-spin" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, Phone, MapPin, MessageCircle, Clock, Linkedin, Instagram, Facebook, Send as SendIcon, Loader as LoaderIcon, CheckCircle as CheckCircleIcon } from 'lucide-vue-next'

const defaultForm = () => ({ name: '', company: '', email: '', phone: '', projectType: '', budget: '', description: '' })
const form = ref(defaultForm())
const submitting = ref(false)
const submitted = ref(false)

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@ecomflex.in', href: 'mailto:support@ecomflex.in' },
  { icon: Phone, label: 'Phone', value: '+91 91486 25342', href: 'tel:+919148625342' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+91 91486 25342', href: 'https://wa.me/919148625342' },
  { icon: MapPin, label: 'Office', value: 'Lakshmipura Cross, Vaderahalli, K.G.Vaderahalli, Karnataka 560097', href: null },
]

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ecom-flex-76157741b/', icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/ecomflex247/', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/share/194Eg9jyxz/', icon: Facebook },
]

const projectTypes = ['Business Website', 'Corporate Website', 'E-Commerce Platform', 'Custom Web Application', 'Enterprise Software', 'SaaS Platform', 'ERP / CRM System', 'AI / Automation', 'UI/UX Design', 'Cloud Deployment', 'Other']
const budgetRanges = ['Under ₹1 Lakh', '₹1–5 Lakhs', '₹5–15 Lakhs', '₹15–50 Lakhs', '₹50 Lakhs+', 'To be discussed']

const submitError = ref('')

const handleSubmit = async () => {
  submitting.value = true
  submitError.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name:        form.value.name,
        email:       form.value.email,
        phone:       form.value.phone,
        company:     form.value.company,
        projectType: form.value.projectType,
        budget:      form.value.budget,
        description: form.value.description,
      },
    })
    submitted.value = true
  } catch (err: any) {
    submitError.value = 'Failed to send. Please contact us directly on WhatsApp.'
    console.error('[contact]', err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
