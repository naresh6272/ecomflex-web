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

let resizeObs: ResizeObserver | null = null
let threeRenderer: any = null
const mouse = { x: 0, y: 0 }

function onMouse(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1
}

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

async function initThree(canvas: HTMLCanvasElement, W: number, H: number) {
  const THREE = await import('three')

  const NODE_COUNT = 38, MAX_LINES = 140, PACKET_COUNT = 16, MAX_DIST_SQ = 14 * 14
  const ACCENT = 0x06b6d4, ACCENT2 = 0xf59e0b, ACCENT3 = 0x6366f1

  const scene  = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500)
  camera.position.set(0, 0, 38)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(W, H, false)
  renderer.setClearColor(0x06090f, 1)
  threeRenderer = renderer

  // Stars
  const starPos = new Float32Array(1000 * 3)
  for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 210
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.13, transparent: true, opacity: 0.28 }))
  scene.add(stars)

  // Network nodes
  const nodesMeshes: any[] = [], nodeVelocities: any[] = []
  const nodeGeo = new THREE.SphereGeometry(0.18, 6, 6)
  for (let i = 0; i < NODE_COUNT; i++) {
    const bright = Math.random() > 0.65
    const mat = new THREE.MeshBasicMaterial({ color: bright ? ACCENT : (Math.random() > 0.5 ? ACCENT2 : ACCENT3), transparent: true, opacity: bright ? 0.95 : 0.55 })
    const m = new THREE.Mesh(nodeGeo, mat)
    m.position.set((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 46, (Math.random() - 0.5) * 30 - 4)
    scene.add(m); nodesMeshes.push(m)
    nodeVelocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.005))
  }

  // Connection lines
  const linePositions = new Float32Array(MAX_LINES * 6), lineColors = new Float32Array(MAX_LINES * 6)
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
  lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineColors,    3).setUsage(THREE.DynamicDrawUsage))
  const lineSegments = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1 }))
  scene.add(lineSegments)

  // Data packets
  const dummy = new THREE.Object3D()
  const packetsMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 4, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), PACKET_COUNT)
  packetsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(packetsMesh)
  const packetData = Array.from({ length: PACKET_COUNT }, () => ({ from: Math.floor(Math.random() * NODE_COUNT), to: Math.floor(Math.random() * NODE_COUNT), t: Math.random(), speed: 0.004 + Math.random() * 0.012 }))

  // Icosahedron group
  const icoGroup = new THREE.Group()
  icoGroup.position.set(22, 1, -8)
  const innerIcoMat = new THREE.MeshBasicMaterial({ color: 0x06090f, transparent: true, opacity: 0.90 })
  icoGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(9,  1), new THREE.MeshBasicMaterial({ color: ACCENT,  wireframe: true, transparent: true, opacity: 0.28 })))
  icoGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(12, 1), new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.10 })))
  icoGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(7,  0), innerIcoMat))
  scene.add(icoGroup)

  // Octahedron
  const octMesh = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.18 }))
  octMesh.position.set(30, -14, -5)
  scene.add(octMesh)

  // Logo (non-blocking — loads asynchronously)
  fetch('/logo.png').then(r => r.blob()).then(async blob => {
    const img = await createImageBitmap(blob)
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = img.width; tmpCanvas.height = img.height
    tmpCanvas.getContext('2d')!.drawImage(img, 0, 0)
    const tex = new THREE.CanvasTexture(tmpCanvas)
    const LW = 6.0, LH = LW / (img.width / img.height)
    const logoGroup = new THREE.Group()
    logoGroup.position.copy(icoGroup.position)
    const glowMesh = new THREE.Mesh(new THREE.CircleGeometry(LW * 0.80, 64), new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthTest: false, depthWrite: false }))
    glowMesh.position.z = -0.6; glowMesh.renderOrder = 10; logoGroup.add(glowMesh)
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW, LH), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 1.0, side: THREE.DoubleSide, depthTest: false, depthWrite: false }))
    logoMesh.renderOrder = 12; logoGroup.add(logoMesh)
    const ring = new THREE.Mesh(new THREE.RingGeometry(LW * 0.72, LW * 0.77, 64), new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.50, side: THREE.DoubleSide, depthTest: false, depthWrite: false }))
    ring.position.z = 0.2; ring.renderOrder = 13; logoGroup.add(ring)
    scene.add(logoGroup)
    innerIcoMat.opacity = 0; innerIcoMat.depthWrite = false
  }).catch(() => {})

  // Animation loop
  let frameCount = 0
  renderer.setAnimationLoop(() => {
    frameCount++
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = nodesMeshes[i].position, v = nodeVelocities[i]
      p.addScaledVector(v, 1)
      if (Math.abs(p.x) > 36) v.x *= -1
      if (Math.abs(p.y) > 24) v.y *= -1
      if (Math.abs(p.z) > 17) v.z *= -1
    }
    if (frameCount % 3 === 0) {
      let cc = 0
      for (let i = 0; i < NODE_COUNT && cc < MAX_LINES; i++) {
        const pi = nodesMeshes[i].position
        for (let j = i + 1; j < NODE_COUNT && cc < MAX_LINES; j++) {
          const pj = nodesMeshes[j].position
          const dx = pi.x - pj.x, dy = pi.y - pj.y, dz = pi.z - pj.z
          const d2 = dx*dx + dy*dy + dz*dz
          if (d2 < MAX_DIST_SQ) {
            const a = (1 - d2 / MAX_DIST_SQ) * 0.75
            const idx = cc * 6
            linePositions[idx]=pi.x; linePositions[idx+1]=pi.y; linePositions[idx+2]=pi.z
            linePositions[idx+3]=pj.x; linePositions[idx+4]=pj.y; linePositions[idx+5]=pj.z
            lineColors[idx]=a*0.08; lineColors[idx+1]=a*0.88; lineColors[idx+2]=a*1.00
            lineColors[idx+3]=a*0.08; lineColors[idx+4]=a*0.88; lineColors[idx+5]=a*1.00
            cc++
          }
        }
      }
      for (let k = cc * 6; k < MAX_LINES * 6; k++) { linePositions[k] = 0; lineColors[k] = 0 }
      lineSegments.geometry.setDrawRange(0, cc * 2)
      ;(lineSegments.geometry.attributes.position as any).needsUpdate = true
      ;(lineSegments.geometry.attributes.color    as any).needsUpdate = true
    }
    for (let i = 0; i < PACKET_COUNT; i++) {
      const pk = packetData[i]; pk.t += pk.speed
      if (pk.t >= 1) { pk.t = 0; pk.from = pk.to; pk.to = Math.floor(Math.random() * NODE_COUNT) }
      dummy.position.lerpVectors(nodesMeshes[pk.from].position, nodesMeshes[pk.to].position, pk.t)
      dummy.updateMatrix(); packetsMesh.setMatrixAt(i, dummy.matrix)
    }
    packetsMesh.instanceMatrix.needsUpdate = true
    icoGroup.rotation.x += 0.0022; icoGroup.rotation.y += 0.0036
    octMesh.rotation.x  += 0.003;  octMesh.rotation.z  += 0.0025
    if (frameCount % 5 === 0) stars.rotation.y += 0.0006
    camera.position.x += (mouse.x * 3  - camera.position.x) * 0.04
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
  })

  // Resize
  resizeObs = new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  })
  resizeObs.observe(canvas)
}

onMounted(async () => {
  if (!import.meta.client) return
  await nextTick()
  const canvas = canvasRef.value!
  const W = canvas.clientWidth  || window.innerWidth
  const H = canvas.clientHeight || window.innerHeight
  window.addEventListener('mousemove', onMouse, { passive: true })
  initThree(canvas, W, H)
  runEntrance()
  initMagnetic()
})

onBeforeUnmount(() => {
  threeRenderer?.setAnimationLoop(null)
  threeRenderer?.dispose()
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
