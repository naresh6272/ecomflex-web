// ── Three.js runs 100% in this worker thread ──────────────────────────────
// Main thread NEVER blocks for rendering.
import * as THREE from 'three'

// ── Constants ──────────────────────────────────────────────────────────────
const NODE_COUNT   = 38
const MAX_LINES    = 140
const PACKET_COUNT = 16
const MAX_DIST_SQ  = 14 * 14
const ACCENT  = 0x06b6d4   // electric cyan
const ACCENT2 = 0xf59e0b   // warm gold
const ACCENT3 = 0x6366f1   // indigo

interface PktData { from: number; to: number; t: number; speed: number }

// ── Scene state ─────────────────────────────────────────────────────────────
let renderer: THREE.WebGLRenderer
let scene:    THREE.Scene
let camera:   THREE.PerspectiveCamera

const nodesMeshes:    THREE.Mesh[]     = []
const nodeVelocities: THREE.Vector3[]  = []
let lineSegments: THREE.LineSegments
let linePositions: Float32Array
let lineColors:    Float32Array
let packetsMesh:   THREE.InstancedMesh
let packetData:    PktData[]
let icoGroup:      THREE.Group
let octMesh:       THREE.Mesh
let stars:         THREE.Points
let dummy:         THREE.Object3D
let innerIcoMat:    THREE.MeshBasicMaterial
let outerIcoMat:    THREE.MeshBasicMaterial
let midIcoMat:      THREE.MeshBasicMaterial
let octMat:         THREE.MeshBasicMaterial
let starsMat:       THREE.PointsMaterial
let packetsMat:     THREE.MeshBasicMaterial
let nodeMats:       THREE.MeshBasicMaterial[] = []
let logoGroup:      THREE.Group | null = null

let W = 800, H = 600
let frameCount = 0
let lightMode = false
const mouse = { x: 0, y: 0 }

// ── Build scene ─────────────────────────────────────────────────────────────
function buildScene() {
  // Star field
  const starPos = new Float32Array(1000 * 3)
  for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 210
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.13, transparent: true, opacity: 0.28 })
  stars = new THREE.Points(starGeo, starsMat)
  scene.add(stars)

  // Network nodes
  const nodeGeo = new THREE.SphereGeometry(0.18, 6, 6)
  for (let i = 0; i < NODE_COUNT; i++) {
    const bright = Math.random() > 0.65
    const mat = new THREE.MeshBasicMaterial({
      color: bright ? ACCENT : (Math.random() > 0.5 ? ACCENT2 : ACCENT3),
      transparent: true,
      opacity: bright ? 0.95 : 0.55,
    })
    nodeMats.push(mat)
    const m = new THREE.Mesh(nodeGeo, mat)
    m.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 46,
      (Math.random() - 0.5) * 30 - 4,
    )
    scene.add(m)
    nodesMeshes.push(m)
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.005,
    ))
  }

  // Connection lines — single draw call
  linePositions = new Float32Array(MAX_LINES * 6)
  lineColors    = new Float32Array(MAX_LINES * 6)
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
  lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineColors,    3).setUsage(THREE.DynamicDrawUsage))
  lineSegments = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 1,
  }))
  scene.add(lineSegments)

  // Data packets — instanced
  dummy = new THREE.Object3D()
  packetsMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  packetsMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.11, 4, 4),
    packetsMat,
    PACKET_COUNT,
  )
  packetsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(packetsMesh)
  packetData = Array.from({ length: PACKET_COUNT }, () => ({
    from:  Math.floor(Math.random() * NODE_COUNT),
    to:    Math.floor(Math.random() * NODE_COUNT),
    t:     Math.random(),
    speed: 0.004 + Math.random() * 0.012,
  }))

  // Icosahedron group — right side
  icoGroup = new THREE.Group()
  icoGroup.position.set(22, 1, -8)
  outerIcoMat = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.28 })
  midIcoMat   = new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.10 })
  innerIcoMat = new THREE.MeshBasicMaterial({ color: 0x06090f, transparent: true, opacity: 0.90 })
  icoGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(9, 1), outerIcoMat))
  icoGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(12, 1), midIcoMat))
  icoGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(7, 0), innerIcoMat))
  scene.add(icoGroup)

  // Octahedron — bottom-right accent
  octMat  = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.18 })
  octMesh = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), octMat)
  octMesh.position.set(30, -14, -5)
  scene.add(octMesh)
}

// ── Render loop (called by setAnimationLoop — works in workers) ─────────────
function animate() {
  frameCount++

  // Move nodes + bounce
  for (let i = 0; i < NODE_COUNT; i++) {
    const p = nodesMeshes[i].position
    const v = nodeVelocities[i]
    p.addScaledVector(v, 1)
    if (Math.abs(p.x) > 36) v.x *= -1
    if (Math.abs(p.y) > 24) v.y *= -1
    if (Math.abs(p.z) > 17) v.z *= -1
  }

  // Update connections every 3rd frame — eliminates 2/3 of O(n²) cost
  if (frameCount % 3 === 0) {
    let cc = 0
    for (let i = 0; i < NODE_COUNT && cc < MAX_LINES; i++) {
      const pi = nodesMeshes[i].position
      for (let j = i + 1; j < NODE_COUNT && cc < MAX_LINES; j++) {
        const pj = nodesMeshes[j].position
        const dx = pi.x - pj.x, dy = pi.y - pj.y, dz = pi.z - pj.z
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < MAX_DIST_SQ) {
          const a = (1 - d2 / MAX_DIST_SQ) * 0.75
          const idx = cc * 6
          linePositions[idx]   = pi.x; linePositions[idx+1] = pi.y; linePositions[idx+2] = pi.z
          linePositions[idx+3] = pj.x; linePositions[idx+4] = pj.y; linePositions[idx+5] = pj.z
          const lr = lightMode ? a * 0.14 : a * 0.08
          const lg = lightMode ? a * 0.30 : a * 0.88
          const lb = lightMode ? a * 0.92 : a * 1.00
          lineColors[idx]   = lr; lineColors[idx+1] = lg; lineColors[idx+2] = lb
          lineColors[idx+3] = lr; lineColors[idx+4] = lg; lineColors[idx+5] = lb
          cc++
        }
      }
    }
    for (let k = cc * 6; k < MAX_LINES * 6; k++) { linePositions[k] = 0; lineColors[k] = 0 }
    lineSegments.geometry.setDrawRange(0, cc * 2)
    ;(lineSegments.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(lineSegments.geometry.attributes.color    as THREE.BufferAttribute).needsUpdate = true
  }

  // Data packets
  for (let i = 0; i < PACKET_COUNT; i++) {
    const pk = packetData[i]
    pk.t += pk.speed
    if (pk.t >= 1) { pk.t = 0; pk.from = pk.to; pk.to = Math.floor(Math.random() * NODE_COUNT) }
    dummy.position.lerpVectors(nodesMeshes[pk.from].position, nodesMeshes[pk.to].position, pk.t)
    dummy.updateMatrix()
    packetsMesh.setMatrixAt(i, dummy.matrix)
  }
  packetsMesh.instanceMatrix.needsUpdate = true

  // Rotate shapes
  icoGroup.rotation.x += 0.0022
  icoGroup.rotation.y += 0.0036
  octMesh.rotation.x  += 0.003
  octMesh.rotation.z  += 0.0025
  if (frameCount % 5 === 0) stars.rotation.y += 0.0006
  // Logo spins slowly on Y, gentle tilt on X
  if (logoGroup) {
    logoGroup.rotation.y += 0.006
    logoGroup.rotation.x = Math.sin(frameCount * 0.008) * 0.18
  }

  // Camera parallax
  camera.position.x += (mouse.x * 3  - camera.position.x) * 0.04
  camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

// ── Message handler ──────────────────────────────────────────────────────────
self.onmessage = (e: MessageEvent) => {
  const { type } = e.data

  if (type === 'init') {
    const { canvas, width, height } = e.data
    W = width; H = height

    scene  = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500)
    camera.position.set(0, 0, 38)

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias:      false,
      alpha:          false,
      powerPreference:'high-performance',
    })
    renderer.setPixelRatio(e.data.dpr || 1)
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x06090f, 1)

    buildScene()

    // setAnimationLoop works in OffscreenCanvas workers (Three.js polyfills rAF)
    renderer.setAnimationLoop(animate)
  }

  else if (type === 'resize') {
    W = e.data.width; H = e.data.height
    if (renderer) renderer.setSize(W, H, false)
    if (camera)   { camera.aspect = W / H; camera.updateProjectionMatrix() }
  }

  else if (type === 'mouse') {
    mouse.x = e.data.x
    mouse.y = e.data.y
  }

  else if (type === 'theme') {
    const dark = e.data.dark
    lightMode = !dark
    if (renderer)     renderer.setClearColor(dark ? 0x06090f : 0xEEF4FF, 1)
    if (innerIcoMat)  { innerIcoMat.color.setHex(dark ? 0x06090f : 0xDDE8FF); innerIcoMat.opacity = dark ? 0.88 : 0.90 }
    if (outerIcoMat)  { outerIcoMat.color.setHex(dark ? 0x06b6d4 : 0x2563EB); outerIcoMat.opacity = dark ? 0.55 : 0.60 }
    if (midIcoMat)    { midIcoMat.color.setHex(dark ? 0x6366f1 : 0x7C3AED);   midIcoMat.opacity   = dark ? 0.22 : 0.28 }
    if (octMat)       { octMat.color.setHex(dark ? 0x06b6d4 : 0x2563EB);      octMat.opacity      = dark ? 0.22 : 0.40 }
    if (starsMat)     { starsMat.color.setHex(dark ? 0xffffff : 0x3B82F6);    starsMat.opacity    = dark ? 0.35 : 0.20 }
    if (packetsMat)   packetsMat.color.setHex(dark ? 0x06b6d4 : 0x1D4ED8)
    nodeMats.forEach(m => {
      const hex = (m.color as THREE.Color).getHex()
      if (hex === ACCENT || hex === 0x2563EB)        m.color.setHex(dark ? ACCENT  : 0x2563EB)
      else if (hex === ACCENT2 || hex === 0xd97706)  m.color.setHex(dark ? ACCENT2 : 0xd97706)
      else                                           m.color.setHex(dark ? ACCENT3 : 0x7C3AED)
    })
  }

  else if (type === 'logo') {
    const bitmap = e.data.bitmap as ImageBitmap

    // Draw ImageBitmap onto OffscreenCanvas → CanvasTexture (reliable in workers)
    const oc = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = oc.getContext('2d')
    if (!ctx) return  // browser doesn't support 2d on OffscreenCanvas
    ctx.drawImage(bitmap, 0, 0)
    const tex = new THREE.CanvasTexture(oc as unknown as HTMLCanvasElement)
    tex.needsUpdate = true

    const aspect = bitmap.width / bitmap.height
    const LW = 6.0
    const LH = LW / aspect

    logoGroup = new THREE.Group()
    logoGroup.position.copy(icoGroup.position)

    // Soft glow disc behind logo
    const glowMat = new THREE.MeshBasicMaterial({
      color: ACCENT, transparent: true, opacity: 0.18,
      side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    })
    const glowMesh = new THREE.Mesh(new THREE.CircleGeometry(LW * 0.80, 64), glowMat)
    glowMesh.position.z = -0.6
    glowMesh.renderOrder = 10
    logoGroup.add(glowMesh)

    // Main logo plane — full opacity, always on top
    const logoMat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 1.0,
      side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    })
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW, LH), logoMat)
    logoMesh.renderOrder = 12
    logoGroup.add(logoMesh)

    // Cyan ring outline
    const ringMat = new THREE.MeshBasicMaterial({
      color: ACCENT, transparent: true, opacity: 0.50,
      side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    })
    const ring = new THREE.Mesh(new THREE.RingGeometry(LW * 0.72, LW * 0.77, 64), ringMat)
    ring.position.z = 0.2
    ring.renderOrder = 13
    logoGroup.add(ring)

    scene.add(logoGroup)

    // Hide inner solid fill so logo shows through the icosahedron
    if (innerIcoMat) { innerIcoMat.opacity = 0; innerIcoMat.depthWrite = false }
  }

  else if (type === 'stop') {
    renderer?.setAnimationLoop(null)
    renderer?.dispose()
  }
}
