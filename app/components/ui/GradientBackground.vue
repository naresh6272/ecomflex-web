<template>
  <div class="gb-root" aria-hidden="true">
    <!-- 3 drifting colour orbs (was 5 — fewer compositing layers) -->
    <div class="gb-orb gb-blue-1" />
    <div class="gb-orb gb-violet" />
    <div class="gb-orb gb-cyan" />
    <!-- dot-grid overlay -->
    <div class="gb-grid" />
  </div>
</template>

<script setup lang="ts">
// purely decorative — no logic
</script>

<style scoped>
.gb-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  /* White base — sits between html background and the transparent body */
  background-color: #FFFFFF;
}
:root[data-theme="dark"] .gb-root {
  background-color: #06090f;
}

/* ── dot grid ─────────────────────────────────────────────── */
.gb-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(37,99,235,0.065) 1px, transparent 1px);
  background-size: 28px 28px;
  background-position: 0 0;
}
:root[data-theme="dark"] .gb-grid {
  background-image: radial-gradient(circle, rgba(96,165,250,0.055) 1px, transparent 1px);
}

/* ── orbs ──────────────────────────────────────────────────── */
.gb-orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* Blue — top-left */
.gb-blue-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(37,99,235,0.32) 0%, transparent 68%);
  filter: blur(48px);
  top: -300px; left: -260px;
  animation: drift-1 34s ease-in-out infinite;
}
/* Violet — bottom-right */
.gb-violet {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(124,58,237,0.26) 0%, transparent 68%);
  filter: blur(52px);
  bottom: -260px; right: -200px;
  animation: drift-2 40s ease-in-out infinite 3s;
}
/* Cyan accent — centre */
.gb-cyan {
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 68%);
  filter: blur(40px);
  top: 42%; left: 46%;
  transform: translate(-50%, -50%);
  animation: drift-5 28s ease-in-out infinite 4s;
}

/* Dark-theme: dial everything down */
:root[data-theme="dark"] .gb-blue-1 { background: radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%); }
:root[data-theme="dark"] .gb-violet { background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%); }
:root[data-theme="dark"] .gb-cyan   { background: radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%); }

/* ── drift keyframes — organic, non-linear paths ───────────── */
@keyframes drift-1 {
  0%   { transform: translate(0px, 0px)    scale(1.0); }
  25%  { transform: translate(80px, 60px)  scale(1.08); }
  50%  { transform: translate(40px, 120px) scale(0.95); }
  75%  { transform: translate(-40px, 50px) scale(1.05); }
  100% { transform: translate(0px, 0px)    scale(1.0); }
}
@keyframes drift-2 {
  0%   { transform: translate(0px, 0px)      scale(1.0); }
  33%  { transform: translate(-80px, -70px)  scale(1.06); }
  66%  { transform: translate(60px, -100px)  scale(0.96); }
  100% { transform: translate(0px, 0px)      scale(1.0); }
}
@keyframes drift-5 {
  0%   { transform: translate(-50%, -50%) scale(1.0); }
  25%  { transform: translate(-44%, -56%) scale(1.12); }
  50%  { transform: translate(-56%, -44%) scale(0.9); }
  75%  { transform: translate(-48%, -52%) scale(1.06); }
  100% { transform: translate(-50%, -50%) scale(1.0); }
}

/* Reduce motion: freeze orbs, keep grid */
@media (prefers-reduced-motion: reduce) {
  .gb-orb { animation: none !important; }
}
</style>
