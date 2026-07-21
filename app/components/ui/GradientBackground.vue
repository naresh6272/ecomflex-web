<template>
  <div class="gb-root" aria-hidden="true">
    <!-- large drifting colour orbs -->
    <div class="gb-orb gb-blue-1" />
    <div class="gb-orb gb-violet" />
    <div class="gb-orb gb-amber" />
    <div class="gb-orb gb-blue-2" />
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

/* Blue — top-left, large */
.gb-blue-1 {
  width: 900px; height: 900px;
  background: radial-gradient(circle, rgba(37,99,235,0.38) 0%, transparent 68%);
  filter: blur(90px);
  top: -380px; left: -320px;
  animation: drift-1 28s ease-in-out infinite;
}
/* Violet — bottom-right */
.gb-violet {
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(124,58,237,0.30) 0%, transparent 68%);
  filter: blur(100px);
  bottom: -320px; right: -260px;
  animation: drift-2 32s ease-in-out infinite 3s;
}
/* Amber — top-right */
.gb-amber {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(245,158,11,0.26) 0%, transparent 68%);
  filter: blur(80px);
  top: -120px; right: -160px;
  animation: drift-3 24s ease-in-out infinite 6s;
}
/* Blue-2 — bottom-left */
.gb-blue-2 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 68%);
  filter: blur(110px);
  bottom: -240px; left: 8%;
  animation: drift-4 36s ease-in-out infinite 1.5s;
}
/* Cyan accent — centre */
.gb-cyan {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 68%);
  filter: blur(75px);
  top: 40%; left: 45%;
  transform: translate(-50%, -50%);
  animation: drift-5 20s ease-in-out infinite 4s;
}

/* Dark-theme: dial everything down */
:root[data-theme="dark"] .gb-blue-1  { background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%); }
:root[data-theme="dark"] .gb-violet  { background: radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%); }
:root[data-theme="dark"] .gb-amber   { background: radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%); }
:root[data-theme="dark"] .gb-blue-2  { background: radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%); }
:root[data-theme="dark"] .gb-cyan    { background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%); }

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
@keyframes drift-3 {
  0%   { transform: translate(0px, 0px)    scale(1.0); }
  40%  { transform: translate(-60px, 80px) scale(1.1); }
  70%  { transform: translate(-30px, 40px) scale(0.92); }
  100% { transform: translate(0px, 0px)    scale(1.0); }
}
@keyframes drift-4 {
  0%   { transform: translate(0px, 0px)     scale(1.0); }
  30%  { transform: translate(70px, -60px)  scale(1.04); }
  60%  { transform: translate(30px, -100px) scale(1.08); }
  100% { transform: translate(0px, 0px)     scale(1.0); }
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
