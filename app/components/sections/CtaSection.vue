<template>
  <section id="cta" class="relative py-36 overflow-hidden">

    <!-- Background: deep midnight with blue gradient wash -->
    <div class="absolute inset-0 cta-bg" />
    <div class="absolute inset-0 pointer-events-none cta-glow" />


    <!-- Corner glows -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(37,99,235,0.14), transparent 70%)" />
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(245,158,11,0.10), transparent 70%)" />

    <div class="relative max-w-4xl mx-auto px-6 lg:px-8 text-center reveal-up">

      <!-- Badge -->
      <div class="inline-flex items-center gap-2 mb-10 px-5 py-2 rounded-full border text-sm font-semibold"
        style="background: rgba(37,99,235,0.12); border-color: rgba(59,130,246,0.30); color: #60A5FA">
        <span class="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
        Ready to Build Something Great
      </div>

      <!-- Headline -->
      <h2 class="cta-heading text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
        Your Vision.<br />
        Our Craft.<br />
        <span class="text-gradient">One Partnership.</span>
      </h2>

      <p class="cta-sub text-lg lg:text-xl mb-14 leading-relaxed max-w-2xl mx-auto">
        Join 120+ businesses that trusted ECOMFLEX to build their most important software. Let's talk about what you're building.

      </p>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
        <a href="#contact" class="btn-primary px-10 py-4 text-base font-bold">
          Start Your Project
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="https://wa.me/919148625342" target="_blank" rel="noopener noreferrer"
          class="btn-secondary px-10 py-4 text-base font-semibold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="opacity-80"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Chat on WhatsApp
        </a>
      </div>

      <!-- Feature chips -->
      <div class="flex flex-wrap justify-center gap-3">
        <div v-for="f in features" :key="f"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.18); color: rgba(255,255,255,0.55)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ f }}
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const features = ['Free Consultation', 'No-Obligation Proposal', 'Transparent Pricing', 'Dedicated PM', 'Post-Launch Support', '99.9% Uptime SLA']
</script>

<style scoped>
.cta-bg {
  background: linear-gradient(135deg, #020818 0%, #040c20 50%, #02060f 100%);
}
.cta-glow {
  background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.18) 0%, transparent 65%);
}
.cta-heading { color: #ffffff; }
.cta-sub     { color: rgba(255,255,255,0.52); }

/* light-mode cta overrides live in main.css */
</style>
