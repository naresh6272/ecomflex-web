// ── Three.js runs 100% in this worker thread ──────────────────────────────
// Main thread NEVER blocks for rendering.
import * as THREE from 'three'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
// NOTE: EffectComposer/UnrealBloomPass were tried and removed — the
// composer's render targets don't reliably preserve canvas alpha, which
// broke the "transparent canvas over the light-theme page" technique and
// made the whole page render behind an opaque dark layer. Glow now comes
// from emissive materials + tone mapping only (see buildLightSculpture).

// ── Constants ──────────────────────────────────────────────────────────────
const NODE_COUNT   = 23
const MAX_LINES    = 85
const PACKET_COUNT = 16
const MAX_DIST_SQ  = 16 * 16
const ACCENT  = 0x06b6d4   // electric cyan
const ACCENT2 = 0xf59e0b   // warm gold
const ACCENT3 = 0x6366f1   // indigo

interface PktData { from: number; to: number; t: number; speed: number }

// Full-canvas spread, but nodes must stay clear of the heading-text block
// (left-middle of the hero), the fixed header row (top strip), and the
// central 3D sphere itself (so connection lines never clutter over it).
const FIELD_X_MIN = -34, FIELD_X_MAX = 68
const FIELD_Y_MIN = -24, FIELD_Y_MAX = 12
// Text keep-out box — tightened to the heading's actual vertical span
// (previously covered almost the whole field height, which left barely
// any room on the left for nodes and caused them to cluster right at the
// zone edge instead of genuinely spreading across the page).
const TEXT_X_MIN = -34, TEXT_X_MAX = 8
const TEXT_Y_MIN = -13, TEXT_Y_MAX = 8
// Circular keep-out zone around the icosahedron/coin (center 16.5, 1 —
// matches icoGroup.position — radius a bit larger than the outer shell).
const ICO_CX = 16.5, ICO_CY = 1, ICO_R = 15

function inTextZone(x: number, y: number) {
  return x > TEXT_X_MIN && x < TEXT_X_MAX && y > TEXT_Y_MIN && y < TEXT_Y_MAX
}
function inIcoZone(x: number, y: number) {
  const dx = x - ICO_CX, dy = y - ICO_CY
  return dx * dx + dy * dy < ICO_R * ICO_R
}

// Stratified placement — split nodes across the top strip, bottom strip,
// and open right area explicitly, instead of pure rejection sampling
// (which biases toward clustering right at the exclusion-zone edges,
// since that's most of the remaining free area near a large zone).
function randomNodePosition(index: number) {
  const region = index % 3
  let x = 0, y = 0
  for (let tries = 0; tries < 12; tries++) {
    if (region === 0) {
      // top strip — above the text/below the header, full width
      x = Math.random() * (FIELD_X_MAX - FIELD_X_MIN) + FIELD_X_MIN
      y = Math.random() * (FIELD_Y_MAX - TEXT_Y_MAX) + TEXT_Y_MAX
    } else if (region === 1) {
      // bottom strip — below the text/buttons, full width
      x = Math.random() * (FIELD_X_MAX - FIELD_X_MIN) + FIELD_X_MIN
      y = Math.random() * (TEXT_Y_MIN - FIELD_Y_MIN) + FIELD_Y_MIN
    } else {
      // open right area, full height
      x = Math.random() * (FIELD_X_MAX - TEXT_X_MAX) + TEXT_X_MAX
      y = Math.random() * (FIELD_Y_MAX - FIELD_Y_MIN) + FIELD_Y_MIN
    }
    if (!inTextZone(x, y) && !inIcoZone(x, y)) break
  }
  return { x, y, z: (Math.random() - 0.5) * 30 - 4 }
}

// ── Scene state ─────────────────────────────────────────────────────────────
let renderer: THREE.WebGLRenderer
let scene:    THREE.Scene
let camera:   THREE.PerspectiveCamera

const nodesMeshes:    THREE.Mesh[]     = []
const nodeVelocities: THREE.Vector3[]  = []
let lineSegments: LineSegments2
let lineMat:      LineMaterial
let linePositions: Float32Array
let lineColors:    Float32Array
let packetsMesh:   THREE.InstancedMesh
let packetData:    PktData[]
let icoGroup:      THREE.Group
let outerShellMesh: THREE.LineSegments | null = null
let midShellMesh:   THREE.LineSegments | null = null
let octMesh:       THREE.LineSegments
let stars:         THREE.Points
let dummy:         THREE.Object3D
let innerIcoMat:    THREE.MeshBasicMaterial
let outerIcoMat:    THREE.LineBasicMaterial
let midIcoMat:      THREE.LineBasicMaterial
let octMat:         THREE.LineBasicMaterial
let starsMat:       THREE.PointsMaterial
let packetsMat:     THREE.MeshBasicMaterial
let logoGlowMat:    THREE.MeshBasicMaterial | null = null
let logoRingMat:    THREE.MeshBasicMaterial | null = null
let nodeMats:       THREE.MeshBasicMaterial[] = []
let logoGroup:      THREE.Group | null = null
let logoTex:        THREE.CanvasTexture | null = null
let logoCanvasColor: OffscreenCanvas | null = null
let logoCanvasBlack: OffscreenCanvas | null = null

// ── Light-theme-only metallic lighting rig (dark theme keeps the original
// flat/unlit look untouched — these lights don't affect MeshBasicMaterial
// or LineBasicMaterial at all, they only light the Standard materials
// swapped in below). ──
let keyLight:  THREE.DirectionalLight | null = null
let rimLight:  THREE.DirectionalLight | null = null
let innerIcoMesh:    THREE.Mesh | null = null
let innerIcoMatLit:  THREE.MeshStandardMaterial | null = null
const nodeMatsLit: THREE.MeshStandardMaterial[] = []
let coinMesh: THREE.Mesh | null = null

// ── Light-theme sculpture — glass plates, broken gold arcs, a rod+joint
// network, and scattered crystal/metal fragments, replacing the
// wireframe-sphere look entirely. Built once, toggled visible/hidden
// alongside the old dark-theme objects in the 'theme' handler. ──
let lightSculptureGroup: THREE.Group | null = null
const spinObjects: { obj: THREE.Object3D; rx: number; ry: number; rz: number }[] = []

let W = 800, H = 600
let frameCount = 0
let lightMode = false
const mouse = { x: 0, y: 0 }

// ── Build scene ─────────────────────────────────────────────────────────────
function buildScene() {
  // Lighting rig — only affects Standard materials (swapped in for light
  // theme below), zero effect on Basic/Line materials so dark theme is
  // pixel-identical to before.
  scene.add(new THREE.AmbientLight(0xfff6e0, 0.68))
  keyLight = new THREE.DirectionalLight(0xfff2d6, 1.1)
  keyLight.position.set(15, 20, 25)
  scene.add(keyLight)
  rimLight = new THREE.DirectionalLight(0xE8EEFF, 0.55)
  rimLight.position.set(-18, -8, 12)
  scene.add(rimLight)
  // Front fill — prevents metal facets facing the camera from going near-black
  const frontFill = new THREE.DirectionalLight(0xfff8ea, 0.5)
  frontFill.position.set(0, 5, 40)
  scene.add(frontFill)

  // Star field
  const starPos = new Float32Array(400 * 3)
  for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 210
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.13, transparent: true, opacity: 0.28 })
  stars = new THREE.Points(starGeo, starsMat)
  scene.add(stars)

  // Network nodes — each gets both an unlit (dark theme) and a metallic
  // lit (light theme) material; theme handler swaps mesh.material between
  // them rather than trying to recolor one material both ways.
  const nodeGeo = new THREE.SphereGeometry(0.32, 10, 10)
  for (let i = 0; i < NODE_COUNT; i++) {
    const bright = Math.random() > 0.65
    const mat = new THREE.MeshBasicMaterial({
      color: bright ? ACCENT : (Math.random() > 0.5 ? ACCENT2 : ACCENT3),
      transparent: true,
      opacity: bright ? 0.95 : 0.55,
    })
    nodeMats.push(mat)
    const matLit = new THREE.MeshStandardMaterial({
      color: bright ? 0x2563EB : 0x7C3AED,
      emissive: bright ? 0x0A1D5E : 0x2D0E6B, emissiveIntensity: 0.14,
      metalness: 0.80, roughness: 0.35,
      transparent: true, opacity: bright ? 1 : 0.85,
    })
    nodeMatsLit.push(matLit)
    const m = new THREE.Mesh(nodeGeo, mat)
    const pos = randomNodePosition(i)
    m.position.set(pos.x, pos.y, pos.z)
    scene.add(m)
    nodesMeshes.push(m)
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.028,
      (Math.random() - 0.5) * 0.028,
      (Math.random() - 0.5) * 0.010,
    ))
  }

  // Connection lines — single draw call, fat-line (screen-space thickness,
  // since regular WebGL LineBasicMaterial ignores linewidth on most browsers)
  linePositions = new Float32Array(MAX_LINES * 6)
  lineColors    = new Float32Array(MAX_LINES * 6)
  const lineGeo = new LineSegmentsGeometry()
  lineGeo.setPositions(linePositions)
  lineGeo.setColors(lineColors)
  lineMat = new LineMaterial({
    vertexColors: true, transparent: true, opacity: 1,
    linewidth: 1.2, resolution: new THREE.Vector2(W, H),
    alphaToCoverage: false, // renderer has antialias:false — alphaToCoverage needs MSAA or lines render broken/dotted
  })
  lineSegments = new LineSegments2(lineGeo, lineMat)
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

  // Icosahedron group — right side (shifted left)
  // Uses EdgesGeometry + LineSegments (real deduplicated edge lines)
  // instead of mesh wireframe:true mode — wireframe-mode rendering is a
  // known dotted/dashed rendering bug on Windows Chrome/Edge (ANGLE/D3D
  // line emulation), independent of anything in this codebase. Real
  // LineSegments primitives render as solid continuous lines instead.
  icoGroup = new THREE.Group()
  icoGroup.position.set(16.5, 1, -8)
  outerIcoMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.28 })
  midIcoMat   = new THREE.LineBasicMaterial({ color: ACCENT2, transparent: true, opacity: 0.10 })
  innerIcoMat = new THREE.MeshBasicMaterial({ color: 0x06090f, transparent: true, opacity: 0.90 })
  innerIcoMatLit = new THREE.MeshStandardMaterial({ color: 0x1D4ED8, emissive: 0x0A1D5E, emissiveIntensity: 0.12, metalness: 0.85, roughness: 0.35, transparent: true, opacity: 0.92 })
  outerShellMesh = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(9, 2)), outerIcoMat)
  midShellMesh   = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(12, 2)), midIcoMat)
  icoGroup.add(outerShellMesh)
  icoGroup.add(midShellMesh)
  innerIcoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(7, 1), innerIcoMat)
  icoGroup.add(innerIcoMesh)
  scene.add(icoGroup)

  // Octahedron — bottom-right accent
  octMat  = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.18 })
  octMesh = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(4, 0)), octMat)
  octMesh.position.set(24.5, -14, -5)
  scene.add(octMesh)

  buildLightSculpture()
}

// ── Light-theme sculpture ────────────────────────────────────────────────
// An asymmetric composition of independent floating pieces around the
// coin: glass plates, broken gold arcs, a rod+glowing-joint network, and
// scattered crystal/metal fragments. Hidden by default; shown only when
// the light theme is active (see the 'theme' message handler).
function buildLightSculpture() {
  const group = new THREE.Group()
  // Sized to read as ~35-40% of the hero width, per spec — the previous
  // 0.8 scale made the whole sculpture a tiny cluster lost in empty
  // space; this brings it back up while keeping the rightward shift for
  // whitespace from the heading.
  group.position.set(ICO_CX + 4, ICO_CY, -8)
  group.scale.setScalar(0.95)
  group.visible = false

  const goldMat = () => new THREE.MeshPhysicalMaterial({
    color: 0x2563EB, metalness: 0.80, roughness: 0.25,
    clearcoat: 1, clearcoatRoughness: 0.12,
    emissive: 0x0A1D5E, emissiveIntensity: 0.10,
  })
  const glassMat = () => new THREE.MeshPhysicalMaterial({
    color: 0xBFD7FF, roughness: 0.05,
    metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04,
    transparent: true, opacity: 0.32, side: THREE.DoubleSide,
  })
  const glassMatHero = () => new THREE.MeshPhysicalMaterial({
    color: 0xBFD7FF, roughness: 0.04,
    metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
    transparent: true, opacity: 0.42, side: THREE.DoubleSide,
  })
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.55 })

  // 8 floating glass plates arranged in a balanced ring around the coin
  // (positions rebalanced so their average sits at the origin — the
  // logo/coin is anchored at this same group origin, so this keeps the
  // coin visually centered among the panels instead of off to one side).
  // Edge frames use a single InstancedMesh (1 draw call for all 8
  // instead of 8 separate meshes) — this plus the rod instancing below
  // is the actual fix for the lag: draw-call count, not object count.
  const plateSpecs = [
    { w: 6,  h: 4.2, x: 4.6,  y: 3,    z: 2.6,  rx: 0.4,  ry: 0.6,  rz: 0.1,  hero: true },
    { w: 4.2,h: 6,   x: -4.6, y: -2.2, z: -4.4, rx: -0.3, ry: 1.1,  rz: 0.5,  hero: true },
    { w: 4.6,h: 3.1, x: 2.8,  y: -4.8, z: 4.4,  rx: 0.8,  ry: -0.4, rz: -0.2, hero: false },
    { w: 3.5,h: 3.5, x: -5,   y: 4,    z: 1.8,  rx: 0.2,  ry: -0.9, rz: 0.3,  hero: false },
    { w: 3.8,h: 5.4, x: 5.6,  y: -0.8, z: -2.6, rx: -0.5, ry: 0.3,  rz: -0.4, hero: false },
    { w: 5,  h: 3.3, x: -1.8, y: -5.6, z: -1.8, rx: 0.6,  ry: -1.2, rz: 0.2,  hero: false },
    { w: 3.1,h: 4.3, x: 3.4,  y: 5.4,  z: -4.8, rx: 0.3,  ry: -0.6, rz: 0.15, hero: false },
    { w: 4.3,h: 2.9, x: -3.4, y: 0.2,  z: 3.6,  rx: -0.7, ry: 0.5,  rz: -0.3, hero: false },
  ]
  const edgeUnitGeo = new THREE.PlaneGeometry(1, 1)
  const edgeInstances = new THREE.InstancedMesh(edgeUnitGeo, edgeMat, plateSpecs.length)
  const dummyE = new THREE.Object3D()
  plateSpecs.forEach((s, i) => {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, 0.12), s.hero ? glassMatHero() : glassMat())
    plate.position.set(s.x, s.y, s.z)
    plate.rotation.set(s.rx, s.ry, s.rz)
    group.add(plate)
    spinObjects.push({ obj: plate, rx: 0.0006, ry: 0.0009, rz: 0.0004 })

    dummyE.position.set(s.x, s.y, s.z - 0.08)
    dummyE.rotation.set(s.rx, s.ry, s.rz)
    dummyE.scale.set(s.w * 1.06, s.h * 1.06, 1)
    dummyE.updateMatrix()
    edgeInstances.setMatrixAt(i, dummyE.matrix)
  })
  group.add(edgeInstances)

  // 3 broken gold arcs (was 4; partial torus, not full rings) — kept the
  // 2 large near-full bright sweeping orbits, plus a 3rd larger, fainter
  // background ring (per reference) for extra depth without adding
  // visual clutter — clearly separated tilts so all three read as clean
  // orbits, like a gyroscope, instead of tangled scribbles.
  // Full circles, not partial arcs — a tilted PARTIAL ring (with a gap)
  // projects asymmetrically in 2D even though it's perfectly centered in
  // 3D, which is what was making the coin look off-center. Full rings
  // are symmetric around the coin at any tilt/rotation.
  const arcSpecs = [
    { r: 12, tube: 0.14, arc: Math.PI * 2, rx: 0.25, ry: 0.15, rz: 0,   dir: 1,  faint: false },
    { r: 12, tube: 0.14, arc: Math.PI * 2, rx: 1.15, ry: 0.45, rz: 0.3, dir: -1, faint: false },
    { r: 16, tube: 0.10, arc: Math.PI * 2, rx: 0.1,  ry: 0.9,  rz: 0.1, dir: 1,  faint: true  },
  ]
  for (const s of arcSpecs) {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(s.r, s.tube, 8, 28, s.arc),
      s.faint
        ? new THREE.MeshPhysicalMaterial({ color: 0x7C3AED, metalness: 0.8, roughness: 0.4, clearcoat: 1, transparent: true, opacity: 0.30 })
        : goldMat(),
    )
    arc.rotation.set(s.rx, s.ry, s.rz)
    group.add(arc)
    spinObjects.push({ obj: arc, rx: 0.0004 * s.dir, ry: 0.0011 * s.dir, rz: 0.0003 * s.dir })
  }

  // Rod + glowing-joint network — real 3D cylinders/spheres, not flat
  // lines. Joints use a single InstancedMesh (1 draw call for all of
  // them instead of one per joint). Radius tightened so the network
  // never reaches toward the heading text, and count roughly halved.
  const jointMat = new THREE.MeshStandardMaterial({
    color: 0x93C5FD, emissive: 0x2563EB, emissiveIntensity: 0.45, metalness: 0.5, roughness: 0.3,
  })
  const rodMat = new THREE.MeshPhysicalMaterial({
    color: 0x1D4ED8, metalness: 0.90, roughness: 0.28, clearcoat: 1,
  })
  const JOINT_COUNT = 7
  const joints: THREE.Vector3[] = []
  const jointInstances = new THREE.InstancedMesh(new THREE.SphereGeometry(0.26, 8, 8), jointMat, JOINT_COUNT)
  const dummyM = new THREE.Object3D()
  for (let i = 0; i < JOINT_COUNT; i++) {
    // Tight shell close around the coin — no long reach toward the text.
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 6 + Math.random() * 5
    const p = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) * 0.7,
      r * Math.cos(phi),
    )
    joints.push(p)
    dummyM.position.copy(p)
    dummyM.updateMatrix()
    jointInstances.setMatrixAt(i, dummyM.matrix)
  }
  group.add(jointInstances)

  // Soft glow halos — additive-blended billboard sprites sharing one
  // procedurally-generated radial-gradient texture (built once, reused
  // for every sprite). This is the safe substitute for post-process
  // bloom: it stays inside the normal render pass, so it can never touch
  // canvas alpha/transparency the way UnrealBloomPass does.
  const glowCanvas = new OffscreenCanvas(64, 64)
  const glowCtx = glowCanvas.getContext('2d')!
  const grad = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(147,197,253,0.9)')
  grad.addColorStop(0.4, 'rgba(96,165,250,0.35)')
  grad.addColorStop(1, 'rgba(96,165,250,0)')
  glowCtx.fillStyle = grad
  glowCtx.fillRect(0, 0, 64, 64)
  const glowTex = new THREE.CanvasTexture(glowCanvas as unknown as HTMLCanvasElement)
  // Tiny crisp sparkle points on the nodes only (was a huge diffuse halo
  // that washed out the whole composition into a hazy blob — the target
  // look is small bright pinpoints, not a big soft glow cloud).
  const glowSpriteMat = new THREE.SpriteMaterial({
    map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7,
  })
  for (const p of joints) {
    const halo = new THREE.Sprite(glowSpriteMat)
    halo.position.copy(p)
    halo.scale.setScalar(0.55)
    group.add(halo)
  }

  // Rods now use a single InstancedMesh too (was up to 12 separate
  // Mesh objects sharing one geometry — now 1 draw call for all of them).
  const rodDir = new THREE.Vector3()
  const rodUp = new THREE.Vector3(0, 1, 0)
  const rodUnitGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 5)
  const rodPairs: [number, number][] = []
  for (let i = 0; i < JOINT_COUNT && rodPairs.length < 12; i++) {
    for (let j = i + 1; j < JOINT_COUNT && rodPairs.length < 12; j++) {
      if (joints[i].distanceTo(joints[j]) < 7 && Math.random() > 0.4) rodPairs.push([i, j])
    }
  }
  const rodInstances = new THREE.InstancedMesh(rodUnitGeo, rodMat, Math.max(rodPairs.length, 1))
  const dummyR = new THREE.Object3D()
  rodPairs.forEach(([i, j], idx) => {
    rodDir.subVectors(joints[j], joints[i])
    const len = rodDir.length()
    dummyR.position.copy(joints[i]).addScaledVector(rodDir, 0.5)
    dummyR.quaternion.setFromUnitVectors(rodUp, rodDir.clone().normalize())
    dummyR.scale.set(1, len, 1)
    dummyR.updateMatrix()
    rodInstances.setMatrixAt(idx, dummyR.matrix)
  })
  group.add(rodInstances)

  // Scattered fragments — cut from 12 to 7 (cubes specifically down ~40%,
  // instanced into a single draw call since they share geometry).
  const cubeGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55)
  const CUBE_COUNT = 7
  const cubeInstances = new THREE.InstancedMesh(cubeGeo, goldMat(), CUBE_COUNT)
  for (let i = 0; i < CUBE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2
    const r = 9 + Math.random() * 9
    dummyM.position.set(r * Math.cos(theta), (Math.random() - 0.5) * 14, r * Math.sin(theta) * 0.6)
    dummyM.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    dummyM.updateMatrix()
    cubeInstances.setMatrixAt(i, dummyM.matrix)
  }
  group.add(cubeInstances)
  spinObjects.push({ obj: cubeInstances, rx: 0.0015, ry: 0.0021, rz: 0.0009 })

  for (let i = 0; i < 4; i++) {
    const kind = i % 2
    const frag = kind === 0
      ? new THREE.Mesh(new THREE.TetrahedronGeometry(0.6, 0), glassMat())
      : new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 6), goldMat())
    const theta = Math.random() * Math.PI * 2
    const r = 9 + Math.random() * 9
    frag.position.set(r * Math.cos(theta), (Math.random() - 0.5) * 14, r * Math.sin(theta) * 0.6)
    frag.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    group.add(frag)
    spinObjects.push({
      obj: frag,
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.006,
      rz: (Math.random() - 0.5) * 0.006,
    })
  }

  scene.add(group)
  lightSculptureGroup = group
}

// ── Render loop (called by setAnimationLoop — works in workers) ─────────────
function animate() {
  frameCount++

  // Move nodes + bounce
  for (let i = 0; i < NODE_COUNT; i++) {
    const p = nodesMeshes[i].position
    const v = nodeVelocities[i]
    p.addScaledVector(v, 1)
    // Bounce off the outer field edges, and deflect out of the heading-text
    // and 3D-sphere keep-out zones if the drift carries a node into either.
    if (p.x < FIELD_X_MIN || p.x > FIELD_X_MAX) v.x *= -1
    if (p.y < FIELD_Y_MIN || p.y > FIELD_Y_MAX) v.y *= -1
    if (Math.abs(p.z) > 17) v.z *= -1
    if (inTextZone(p.x, p.y)) { v.x = Math.abs(v.x); v.y = -Math.abs(v.y) }
    if (inIcoZone(p.x, p.y)) {
      const dx = p.x - ICO_CX, dy = p.y - ICO_CY
      const len = Math.hypot(dx, dy) || 1
      v.x = (dx / len) * Math.abs(v.x || 0.01)
      v.y = (dy / len) * Math.abs(v.y || 0.01)
    }
    // Gentle per-node pulse so the dots feel alive, not just drifting
    const s = 1 + Math.sin(frameCount * 0.06 + i * 0.7) * 0.22
    nodesMeshes[i].scale.setScalar(s)
  }

  // Update connections every 2nd frame — nodes now move faster, so
  // recomputing more often keeps the connect/disconnect "web" effect
  // reading as fluid rather than jumpy, while still saving half the cost.
  if (frameCount % 2 === 0) {
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
          const lg = lightMode ? a * 0.37 : a * 0.88
          const lb = lightMode ? a * 0.92 : a * 1.00
          lineColors[idx]   = lr; lineColors[idx+1] = lg; lineColors[idx+2] = lb
          lineColors[idx+3] = lr; lineColors[idx+4] = lg; lineColors[idx+5] = lb
          cc++
        }
      }
    }
    // Unused slots stay zeroed (zero-length, invisible segments) so the
    // fat-line geometry can just always rebuild from the full fixed array.
    for (let k = cc * 6; k < MAX_LINES * 6; k++) { linePositions[k] = 0; lineColors[k] = 0 }
    const lg = lineSegments.geometry as LineSegmentsGeometry
    lg.setPositions(linePositions)
    lg.setColors(lineColors)
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

  // Rotate shapes — outer/mid shells spin on independent axes on top of
  // the group's base rotation, for real layered parallax depth instead
  // of both shells moving as one rigid unit.
  icoGroup.rotation.x += 0.0022
  icoGroup.rotation.y += 0.0036
  if (outerShellMesh) { outerShellMesh.rotation.y -= 0.0028; outerShellMesh.rotation.z += 0.0012 }
  if (midShellMesh)   { midShellMesh.rotation.x   += 0.0016; midShellMesh.rotation.y   -= 0.0020 }
  octMesh.rotation.x  += 0.003
  octMesh.rotation.z  += 0.0025
  if (frameCount % 5 === 0) stars.rotation.y += 0.0006
  // Coin/logo: gentle Y-axis oscillation, not a continuous full spin —
  // a full rotation always passes through edge-on at some point (that's
  // just how a spinning disc looks), which conflicts with "keep the coin
  // facing the camera". This wobbles within a bounded range instead, so
  // the face and logo stay visible at all times.
  if (logoGroup) {
    logoGroup.rotation.y = Math.sin(frameCount * 0.0035) * 0.32
  }

  // Light-theme sculpture — every piece spins independently at its own
  // slow rate, plus a very gentle overall group drift for a weightless,
  // floating feel.
  if (lightSculptureGroup && lightSculptureGroup.visible) {
    for (const s of spinObjects) {
      s.obj.rotation.x += s.rx
      s.obj.rotation.y += s.ry
      s.obj.rotation.z += s.rz
    }
    lightSculptureGroup.rotation.y += 0.0007
    lightSculptureGroup.position.y = ICO_CY + Math.sin(frameCount * 0.006) * 0.6
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
      alpha:          true, // lets the CSS page background show through in light theme
      powerPreference:'high-performance',
    })
    renderer.setPixelRatio(e.data.dpr || 1)
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x06090f, 1)
    // Filmic tone mapping — real PBR materials (MeshPhysicalMaterial gold/
    // glass) need this for realistic highlight rolloff instead of blown-
    // out white specular hotspots. Harmless to Basic/Line materials.
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.86
    // Halves the internal render-target resolution used for the glass
    // transmission pass — keeps real refraction on the two hero glass
    // panels without paying full cost for it.
    renderer.transmissionResolutionScale = 0.5

    buildScene()

    // HDR-quality environment reflections without any external asset —
    // RoomEnvironment is a procedural studio-lighting scene baked into a
    // reflection map via PMREMGenerator. This only affects PBR material
    // reflections, never the canvas's own transparency/clear color, so
    // it's safe to keep (unlike the bloom composer, which was removed).
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture
    pmrem.dispose()

    // setAnimationLoop works in OffscreenCanvas workers (Three.js polyfills rAF)
    renderer.setAnimationLoop(animate)
  }

  else if (type === 'resize') {
    W = e.data.width; H = e.data.height
    if (renderer) renderer.setSize(W, H, false)
    if (camera)   { camera.aspect = W / H; camera.updateProjectionMatrix() }
    if (lineMat) lineMat.resolution.set(W, H)
  }

  else if (type === 'mouse') {
    mouse.x = e.data.x
    mouse.y = e.data.y
  }

  else if (type === 'theme') {
    // Light theme: canvas clear alpha is 0 — fully transparent — so the
    // page's actual white background shows through everywhere except
    // where the 3D shapes draw. Palette matches the reference: a gold
    // wireframe sphere with a subtle silver/gray secondary ring and a
    // solid gold "coin" disc behind the logo, gold node beads throughout.
    const dark = e.data.dark
    lightMode = !dark
    if (renderer)     renderer.setClearColor(dark ? 0x06090f : 0xFFFFFF, dark ? 1 : 0)
    // outerIcoMat is geometrically the smaller/inner shell (radius 9) —
    // silver/gray in light theme, a quiet secondary layer. midIcoMat is
    // the larger/outer shell (radius 12) — the dominant gold sphere.
    if (outerIcoMat)  { outerIcoMat.color.setHex(dark ? 0x06b6d4 : 0x3B82F6); outerIcoMat.opacity = dark ? 0.55 : 0.70 }
    if (midIcoMat)    { midIcoMat.color.setHex(dark ? 0x6366f1 : 0x2563EB);   midIcoMat.opacity   = dark ? 0.22 : 0.80 }
    if (octMat)       { octMat.color.setHex(dark ? 0x06b6d4 : 0x7C3AED);      octMat.opacity      = dark ? 0.22 : 0.45 }
    if (starsMat)     { starsMat.color.setHex(dark ? 0xffffff : 0x3B82F6);    starsMat.opacity    = dark ? 0.35 : 0.22 }
    if (packetsMat)   packetsMat.color.setHex(dark ? 0x06b6d4 : 0x60A5FA)
    if (logoGlowMat)  logoGlowMat.color.setHex(dark ? ACCENT : 0x2563EB)
    if (logoRingMat)  logoRingMat.color.setHex(dark ? ACCENT : 0x2563EB)
    if (logoTex) {
      const src = dark ? logoCanvasColor : logoCanvasBlack
      if (src) { logoTex.image = src as unknown as HTMLCanvasElement; logoTex.needsUpdate = true }
    }
    // Swap material references (not colors) for the metallic-lit elements —
    // dark theme uses the original unlit flat materials untouched, light
    // theme uses the lit gold/silver metal variants.
    if (innerIcoMesh) innerIcoMesh.material = dark ? innerIcoMat : (innerIcoMatLit ?? innerIcoMat)
    nodesMeshes.forEach((mesh, i) => {
      mesh.material = dark ? nodeMats[i] : (nodeMatsLit[i] ?? nodeMats[i])
    })
    if (coinMesh) coinMesh.visible = !dark

    // Light theme replaces the wireframe-sphere composition entirely with
    // the sculpture (glass plates, broken arcs, rod+joint network,
    // fragments). Dark theme is untouched — same objects, same look as
    // before this feature existed.
    icoGroup.visible = dark
    octMesh.visible = dark
    lineSegments.visible = dark
    nodesMeshes.forEach(m => { m.visible = dark })
    if (lightSculptureGroup) lightSculptureGroup.visible = !dark
    // Keep the coin centered within the sculpture, which is shifted
    // right and scaled down for light theme — dark theme's coin/logo
    // position and scale are untouched.
    if (logoGroup) {
      logoGroup.position.x = icoGroup.position.x + (dark ? 0 : 4)
      logoGroup.scale.setScalar(dark ? 1 : 0.8)
    }
  }

  else if (type === 'logo') {
    const bitmap = e.data.bitmap as ImageBitmap

    // Color version — draw ImageBitmap onto OffscreenCanvas as-is (dark theme)
    const ocColor = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctxColor = ocColor.getContext('2d')
    if (!ctxColor) return
    ctxColor.drawImage(bitmap, 0, 0)
    logoCanvasColor = ocColor

    // Black version — used in light theme so logo reads clearly on white/dark-coin
    const ocBlack = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctxBlack = ocBlack.getContext('2d')!
    ctxBlack.drawImage(bitmap, 0, 0)
    ctxBlack.globalCompositeOperation = 'source-in'
    ctxBlack.fillStyle = '#000000'
    ctxBlack.fillRect(0, 0, bitmap.width, bitmap.height)
    logoCanvasBlack = ocBlack

    const src = lightMode ? ocBlack : ocColor
    const tex = new THREE.CanvasTexture(src as unknown as HTMLCanvasElement)
    tex.needsUpdate = true
    logoTex = tex

    const aspect = bitmap.width / bitmap.height
    const LW = 6.0
    const LH = LW / aspect

    logoGroup = new THREE.Group()
    logoGroup.position.copy(icoGroup.position)

    // Soft glow disc behind logo
    const glowMat = new THREE.MeshBasicMaterial({
      color: lightMode ? 0x2563EB : ACCENT, transparent: true, opacity: 0.20,
      side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    })
    logoGlowMat = glowMat
    const glowMesh = new THREE.Mesh(new THREE.CircleGeometry(LW * 0.80, 64), glowMat)
    glowMesh.position.z = -0.6
    glowMesh.renderOrder = 10
    logoGroup.add(glowMesh)

    // Light-theme-only: a real 3D gold coin (beveled cylinder, lit +
    // metallic) sitting behind the logo plane — matches the reference's
    // dimensional coin look. Hidden in dark theme (glowMesh above is used
    // there instead, unchanged).
    const coinMat = new THREE.MeshPhysicalMaterial({
      color: 0x0F172A, metalness: 0.95, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.06,
    })
    coinMesh = new THREE.Mesh(new THREE.CylinderGeometry(LW * 0.62, LW * 0.62, 0.55, 48), coinMat)
    coinMesh.rotation.x = Math.PI / 2
    coinMesh.position.z = -0.3
    coinMesh.renderOrder = 9
    coinMesh.visible = lightMode
    logoGroup.add(coinMesh)

    // Main logo plane — full opacity, always on top
    const logoMat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 1.0,
      side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    })
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW, LH), logoMat)
    logoMesh.renderOrder = 12
    logoGroup.add(logoMesh)

    // Ring outline around the logo
    const ringMat = new THREE.MeshBasicMaterial({
      color: lightMode ? 0x2563EB : ACCENT, transparent: true, opacity: 0.55,
      side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    })
    logoRingMat = ringMat
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

  else if (type === 'pause') {
    renderer?.setAnimationLoop(null)
  }

  else if (type === 'resume') {
    renderer?.setAnimationLoop(animate)
  }
}
