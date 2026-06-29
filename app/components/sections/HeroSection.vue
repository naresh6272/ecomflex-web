<template>
  <section id="hero" class="hero-bg relative min-h-screen flex items-center overflow-hidden">

    <!-- Canvas — Three.js renders here from a background worker thread -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" style="display:block" />

    <!-- CSS 3D orbital rings (pure CSS, zero JS cost) -->
    <div class="geo-wrap" aria-hidden="true">
      <div class="geo-ring geo-r1" />
      <div class="geo-ring geo-r2" />
      <div class="geo-ring geo-r3" />
      <div class="geo-diamond" />
    </div>

    <!-- Ambient orbs (CSS only) -->
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <div class="orb orb-3" />

    <!-- ── CONTENT ── -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-28">
      <div class="max-w-4xl">

        <div ref="tagRef" class="hero-tag" style="opacity:0;transform:translateY(20px)">
          <span class="tag-dot" />
          Premium Software Studio &nbsp;·&nbsp; Trusted Since 2019
        </div>

        <h1 class="hero-h1">
          <span ref="word1" class="hero-word" style="opacity:0;transform:translateY(60px)">We Build</span><br />
          <span ref="word2" class="hero-word gradient-text" style="opacity:0;transform:translateY(60px)">Exceptional</span><br />
          <span ref="word3" class="hero-word" style="opacity:0;transform:translateY(60px)">Software.</span>
        </h1>

        <p ref="subRef" class="hero-sub" style="opacity:0;transform:translateY(24px)">
          Enterprise platforms, SaaS products, AI applications<br class="hidden lg:block" />
          and custom software that drives real business growth.
        </p>

        <div ref="ctaRef" class="hero-ctas" style="opacity:0;transform:translateY(24px)">
          <a href="#contact" class="btn-primary" data-magnetic>
            <span>Start Your Project</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#projects" class="btn-ghost" data-magnetic>
            <span>View Our Work</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>


      </div>
    </div>

    <div class="scroll-cue">
      <div class="scroll-pill"><div class="scroll-dot" /></div>
      <span class="scroll-text">Scroll</span>
    </div>

  </section>
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const tagRef    = ref<HTMLElement | null>(null)
const word1     = ref<HTMLElement | null>(null)
const word2     = ref<HTMLElement | null>(null)
const word3     = ref<HTMLElement | null>(null)
const subRef    = ref<HTMLElement | null>(null)
const ctaRef    = ref<HTMLElement | null>(null)
const statsRef  = ref<HTMLElement | null>(null)

const stats = [
  { end: 50,  suffix: '+', label: 'Projects Delivered' },
  { end: 40,  suffix: '+', label: 'Happy Clients' },
  { end: 6,   suffix: '+', label: 'Years Experience' },
  { end: 98,  suffix: '%', label: 'Satisfaction Rate' },
]

const statDisplays = ref(stats.map(() => '0'))

function animateCountUp() {
  stats.forEach((stat, i) => {
    const duration = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      statDisplays.value[i] = Math.round(ease * stat.end) + stat.suffix
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

let worker:    Worker | null     = null
let resizeObs: ResizeObserver | null = null


// ── Mouse → worker (throttled naturally by worker's animation loop) ──────────
function onMouse(e: MouseEvent) {
  worker?.postMessage({
    type: 'mouse',
    x: (e.clientX / window.innerWidth)  * 2 - 1,
    y: (e.clientY / window.innerHeight) * 2 - 1,
  })
}

// ── Magnetic button effect (main thread only, no Three.js needed) ────────────
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const btn = el as HTMLElement
    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const r  = btn.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.3}px,${(e.clientY - r.top - r.height/2) * 0.3}px)`
    })
    btn.addEventListener('mouseleave', () => { btn.style.transform = '' })
  })
}

// ── GSAP entrance ─────────────────────────────────────────────────────────────
async function runEntrance() {
  const { gsap } = await import('gsap')
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.to(tagRef.value,   { opacity: 1, y: 0, duration: 0.9 }, 0.2)
    .to(word1.value,    { opacity: 1, y: 0, duration: 1.0 }, 0.45)
    .to(word2.value,    { opacity: 1, y: 0, duration: 1.0 }, 0.60)
    .to(word3.value,    { opacity: 1, y: 0, duration: 1.0 }, 0.75)
    .to(subRef.value,   { opacity: 1, y: 0, duration: 0.9 }, 1.05)
    .to(ctaRef.value,   { opacity: 1, y: 0, duration: 0.9 }, 1.20)
    .to(statsRef.value, { opacity: 1, y: 0, duration: 0.9 }, 1.35)
  animateCountUp()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!import.meta.client) return
  await nextTick()

  const canvas = canvasRef.value!
  const W = canvas.clientWidth  || window.innerWidth
  const H = canvas.clientHeight || window.innerHeight

  // Spawn Three.js worker using Vite's ?worker syntax for correct production bundling
  const { default: HeroWorker } = await import('../../workers/hero.worker.ts?worker')
  worker = new HeroWorker()

  // Transfer canvas control to worker — main thread can no longer touch it
  const offscreen = canvas.transferControlToOffscreen()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  worker.postMessage({ type: 'init', canvas: offscreen, width: W, height: H, dpr }, [offscreen])

  // Always dark
  worker.postMessage({ type: 'theme', dark: true })

  // Load logo and send as ImageBitmap to worker
  fetch('/logo.png')
    .then(r => r.blob())
    .then(blob => createImageBitmap(blob))
    .then(bitmap => {
      worker?.postMessage({ type: 'logo', bitmap }, [bitmap])
    })
    .catch(err => console.warn('[hero] logo load failed:', err))

  // Resize → tell worker
  resizeObs = new ResizeObserver(() => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w && h) worker?.postMessage({ type: 'resize', width: w, height: h, dpr })
  })
  resizeObs.observe(canvas)

  window.addEventListener('mousemove', onMouse, { passive: true })
  runEntrance()
  initMagnetic()
})

onBeforeUnmount(() => {
  worker?.postMessage({ type: 'stop' })
  worker?.terminate()
  resizeObs?.disconnect()
  window.removeEventListener('mousemove', onMouse)
})
</script>

<style scoped>
/* ── Hero background — deep midnight with blue gradient wash ── */
.hero-bg {
  background:
    radial-gradient(ellipse 90% 70% at 65% 40%, rgba(37,99,235,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 10% 80%, rgba(245,158,11,0.07) 0%, transparent 60%),
    #04080f;
}
/* hero-bg light override lives in main.css via #hero.hero-bg selector */

/* light-mode hero overrides live in main.css to avoid scoped specificity issues */

/* ── Ambient orbs ── */
.orb { position:absolute; border-radius:50%; pointer-events:none; z-index:1; }
.orb-1 {
  width:700px; height:700px; top:-200px; left:35%;
  background: radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%);
}
.orb-2 {
  width:400px; height:400px; bottom:-60px; right:-80px;
  background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
}
.orb-3 {
  width:300px; height:300px; top:55%; left:-60px;
  background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
}

/* ── CSS 3D orbital rings ── */
.geo-wrap {
  position:absolute; right:6%; top:50%; transform:translateY(-50%);
  width:380px; height:380px; perspective:900px; z-index:2; pointer-events:none;
}
@media (max-width:1024px) { .geo-wrap { display:none; } }

.geo-ring {
  position:absolute; inset:0; border-radius:50%;
  border:1px solid rgba(37,99,235,0.16);
}
.geo-r1 { animation:ring-spin 26s linear infinite; box-shadow:0 0 28px rgba(37,99,235,0.06) inset; }
.geo-r2 { inset:40px; border-color:rgba(245,158,11,0.14); animation:ring-spin 18s linear infinite reverse; }
.geo-r3 { inset:90px; border-color:rgba(37,99,235,0.22); animation:ring-spin 12s linear infinite; box-shadow:0 0 16px rgba(37,99,235,0.10) inset; }
.geo-diamond {
  position:absolute; inset:130px;
  background:rgba(37,99,235,0.03); border:1px solid rgba(37,99,235,0.22);
  transform:rotate(45deg); animation:diamond-rot 22s linear infinite;
  box-shadow:0 0 24px rgba(37,99,235,0.08) inset, 0 0 8px rgba(37,99,235,0.12);
}
@keyframes ring-spin    { to { transform:rotateX(65deg) rotateZ(360deg); } }
@keyframes diamond-rot  { to { transform:rotate(405deg); } }

/* ── Hero text ── */
.hero-tag {
  display:inline-flex; align-items:center; gap:.65rem;
  font-size:.6875rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
  color:rgba(255,255,255,0.38); margin-bottom:2rem; will-change:transform,opacity;
}
.tag-dot {
  width:7px; height:7px; border-radius:50%; background:#2563EB; flex-shrink:0;
  animation:pulse-dot 2.2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,100% { box-shadow:0 0 6px rgba(37,99,235,.5); }
  50%      { box-shadow:0 0 20px rgba(37,99,235,1), 0 0 40px rgba(245,158,11,.4); }
}
.hero-h1 {
  font-size:clamp(3.4rem,8.5vw,8.5rem); font-weight:800;
  line-height:1.0; letter-spacing:-0.04em; color:#ffffff; margin:0 0 2.2rem;
}
.hero-word { display:inline-block; will-change:transform,opacity; }
.gradient-text {
  background:linear-gradient(120deg,#2563EB 0%,#f59e0b 50%,#60A5FA 100%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent; background-clip:text;
}
@keyframes grad-shift {
  0%,100% { background-position:0% 50%; }
  50%      { background-position:100% 50%; }
}
.hero-sub {
  font-size:clamp(1rem,1.8vw,1.25rem); color:rgba(255,255,255,0.50);
  line-height:1.80; max-width:52ch; margin-bottom:2.8rem; will-change:transform,opacity;
}
.hero-ctas {
  display:flex; flex-wrap:wrap; align-items:center; gap:1.1rem;
  margin-bottom:4rem; will-change:transform,opacity;
}
.btn-ghost {
  display:inline-flex; align-items:center; gap:.55rem; padding:.9375rem 2rem;
  border-radius:100px; font-weight:600; font-size:.9375rem; background:transparent;
  color:rgba(255,255,255,0.65); border:1.5px solid rgba(255,255,255,0.12);
  text-decoration:none; transition:all .35s cubic-bezier(.22,1,.36,1);
}
.btn-ghost:hover {
  border-color:rgba(37,99,235,.5); color:#3B82F6;
  background:rgba(37,99,235,0.07); transform:translateY(-2px);
}
[data-magnetic] { transition:transform 0.45s cubic-bezier(.22,1,.36,1) !important; }
.hero-stats {
  display:grid; grid-template-columns:repeat(4,1fr);
  padding-top:2.5rem; border-top:1px solid rgba(37,99,235,0.12);
  will-change:transform,opacity;
}
@media (max-width:640px) { .hero-stats { grid-template-columns:repeat(2,1fr); gap:1.5rem 0; } }
.hero-stat { display:flex; flex-direction:column; gap:.3rem; }
.stat-val {
  font-size:clamp(1.9rem,3.2vw,2.75rem); font-weight:800; letter-spacing:-0.03em;
  background:linear-gradient(135deg,#1D4ED8,#2563EB,#f59e0b);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.stat-lbl { font-size:.8rem; color:rgba(255,255,255,0.32); letter-spacing:.02em; }
.scroll-cue {
  position:absolute; bottom:2.5rem; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:.5rem; z-index:10;
}
.scroll-pill {
  width:22px; height:36px; border-radius:100px;
  border:1.5px solid rgba(37,99,235,0.22);
  display:flex; align-items:flex-start; justify-content:center; padding:5px;
}
.scroll-dot {
  width:4px; height:8px; border-radius:100px; background:#2563EB;
  animation:scroll-bounce 2s ease-in-out infinite;
}
@keyframes scroll-bounce {
  0%,100% { transform:translateY(0); opacity:1; }
  50%      { transform:translateY(10px); opacity:.35; }
}
.scroll-text {
  font-size:8px; font-weight:700; letter-spacing:.22em;
  text-transform:uppercase; color:rgba(255,255,255,0.18);
}
</style>
