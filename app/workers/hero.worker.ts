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
const NODE_COUNT   = 14
const MAX_LINES    = 48
const PACKET_COUNT = 8
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
      color: bright ? 0xA67C00 : 0x52525B,
      emissive: bright ? 0x3D2C05 : 0x1A1A1D, emissiveIntensity: 0.10,
      metalness: 0.85, roughness: 0.40,
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
  innerIcoMatLit = new THREE.MeshStandardMaterial({ color: 0xA67C00, emissive: 0x3D2C05, emissiveIntensity: 0.10, metalness: 0.85, roughness: 0.38, transparent: true, opacity: 0.92 })
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
  group.scale.setScalar(0.80)
  group.visible = false

  // MeshStandardMaterial — no clearcoat, ~2× cheaper per fragment than
  // MeshPhysicalMaterial. Visual quality is almost identical for small
  // decorative objects; clearcoat was the single largest GPU cost.
  const goldMat = () => new THREE.MeshStandardMaterial({
    color: 0xD4AF37, metalness: 0.95, roughness: 0.28,
    emissive: 0x3D2C05, emissiveIntensity: 0.06,
  })
  const glassMat = () => new THREE.MeshStandardMaterial({
    color: 0xF5EAC8, roughness: 0.10, metalness: 0.05,
    transparent: true, opacity: 0.58, side: THREE.DoubleSide,
  })
  const glassMatHero = () => new THREE.MeshStandardMaterial({
    color: 0xFAF0D0, roughness: 0.08, metalness: 0.08,
    transparent: true, opacity: 0.68, side: THREE.DoubleSide,
  })
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.80 })

  // 8 floating glass plates arranged in a balanced ring around the coin
  // (positions rebalanced so their average sits at the origin — the
  // logo/coin is anchored at this same group origin, so this keeps the
  // coin visually centered among the panels instead of off to one side).
  // Edge frames use a single InstancedMesh (1 draw call for all 8
  // instead of 8 separate meshes) — this plus the rod instancing below
  // is the actual fix for the lag: draw-call count, not object count.
  // Plates in 11-14 unit ring. ry kept ≤0.55 so plates always face camera
  // (large ry → plate turns edge-on → nearly invisible).
  const plateSpecs = [
    { w: 6.5, h: 4.5, x:  9.5, y:  7.5, z:  2.6, rx:  0.25, ry:  0.35, rz:  0.12, hero: true  }, // top-right   dist≈12.1
    { w: 5.5, h: 6.0, x: 13.5, y:  0.5, z: -3.0, rx: -0.20, ry:  0.55, rz:  0.30, hero: true  }, // right        dist≈13.5
    { w: 5.5, h: 4.0, x:  8.5, y: -9.5, z:  4.4, rx:  0.30, ry: -0.30, rz: -0.15, hero: false }, // bottom-right dist≈12.8
    { w: 4.5, h: 4.5, x:  0.5, y: -12,  z:  1.8, rx:  0.15, ry: -0.45, rz:  0.20, hero: false }, // bottom       dist≈12
    { w: 5.0, h: 5.5, x: -9.5, y: -8.0, z: -2.6, rx: -0.28, ry:  0.20, rz: -0.22, hero: false }, // bottom-left  dist≈12.4
    { w: 6.0, h: 4.5, x: -13,  y:  0.5, z: -1.8, rx:  0.22, ry: -0.50, rz:  0.18, hero: false }, // left         dist≈13
    { w: 4.5, h: 5.5, x: -8.5, y:  8.0, z: -4.8, rx:  0.20, ry: -0.35, rz:  0.10, hero: false }, // top-left     dist≈11.7
    { w: 5.5, h: 4.0, x:  0.5, y: 12,   z:  3.6, rx: -0.25, ry:  0.30, rz: -0.18, hero: false }, // top          dist≈12
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
      new THREE.TorusGeometry(s.r, s.tube, 6, 18, s.arc),
      s.faint
        ? new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.4, clearcoat: 1, transparent: true, opacity: 0.35 })
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
    color: 0xF5DE9C, emissive: 0xD4AF37, emissiveIntensity: 0.35, metalness: 0.6, roughness: 0.3,
  })
  const rodMat = new THREE.MeshPhysicalMaterial({
    color: 0xA67C00, metalness: 1, roughness: 0.35, clearcoat: 1,
  })
  const JOINT_COUNT = 7
  const joints: THREE.Vector3[] = []
  const jointInstances = new THREE.InstancedMesh(new THREE.SphereGeometry(0.26, 6, 6), jointMat, JOINT_COUNT)
  const dummyM = new THREE.Object3D()
  for (let i = 0; i < JOINT_COUNT; i++) {
    // Tight shell close around the coin — no long reach toward the text.
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 8 + Math.random() * 4
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
  grad.addColorStop(0, 'rgba(255,235,180,0.9)')
  grad.addColorStop(0.4, 'rgba(245,222,156,0.35)')
  grad.addColorStop(1, 'rgba(245,222,156,0)')
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

  // Cubes — doubled count, two size variants for visual variety.
  const CUBE_COUNT = 14
  const cubeGeoLg = new THREE.BoxGeometry(0.65, 0.65, 0.65)
  const cubeGeoSm = new THREE.BoxGeometry(0.38, 0.38, 0.38)
  const cubeInstancesLg = new THREE.InstancedMesh(cubeGeoLg, goldMat(), CUBE_COUNT)
  const cubeInstancesSm = new THREE.InstancedMesh(cubeGeoSm, goldMat(), CUBE_COUNT)
  for (let i = 0; i < CUBE_COUNT; i++) {
    const theta = (i / CUBE_COUNT) * Math.PI * 2 + Math.random() * 0.8
    const r = 9 + Math.random() * 9
    for (const inst of [cubeInstancesLg, cubeInstancesSm]) {
      dummyM.position.set(r * Math.cos(theta), (Math.random() - 0.5) * 16, r * Math.sin(theta) * 0.65)
      dummyM.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      dummyM.updateMatrix()
      inst.setMatrixAt(i, dummyM.matrix)
    }
  }
  group.add(cubeInstancesLg)
  group.add(cubeInstancesSm)
  spinObjects.push({ obj: cubeInstancesLg, rx: 0.0015, ry: 0.0021, rz: 0.0009 })
  spinObjects.push({ obj: cubeInstancesSm, rx: -0.0018, ry: 0.0024, rz: -0.0011 })

  // Shared materials for fragments/rings/spheres — one GPU state per type
  // instead of one per mesh, which was the main source of draw-call overhead.
  const sharedGoldFrag  = goldMat()
  const sharedGlassFrag = glassMat()

  // Fragments: 3 types, each instanced (3 draw calls instead of 9)
  const tetraInst = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(0.7, 0), sharedGlassFrag, 3)
  const hexInst   = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.6, 0.6, 0.18, 6), sharedGoldFrag, 3)
  const octaInst  = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.55, 0), sharedGoldFrag, 3)
  ;[tetraInst, hexInst, octaInst].forEach((inst, ti) => {
    for (let i = 0; i < 3; i++) {
      const theta = ((ti * 3 + i) / 9) * Math.PI * 2 + 0.5
      const r = 10 + i * 2.5
      dummyM.position.set(r * Math.cos(theta), (i - 1) * 4.5, r * Math.sin(theta) * 0.6)
      dummyM.rotation.set(i * 1.1, i * 0.7, i * 0.9)
      dummyM.scale.setScalar(1)
      dummyM.updateMatrix()
      inst.setMatrixAt(i, dummyM.matrix)
    }
    group.add(inst)
  })
  spinObjects.push({ obj: tetraInst, rx:  0.003, ry: -0.002, rz:  0.004 })
  spinObjects.push({ obj: hexInst,   rx: -0.002, ry:  0.003, rz: -0.002 })
  spinObjects.push({ obj: octaInst,  rx:  0.002, ry:  0.004, rz: -0.003 })

  // Rings: single InstancedMesh — 1 draw call for all 5 rings
  // Unit torus (r=1) scaled per instance so tube stays proportional.
  const ringDefs = [
    { r: 2.8, x:  11,   y:  3.5, z: -5,  rx: 0.5,  ry: 0.3 },
    { r: 2.0, x:  -9.5, y:  5.5, z:  4,  rx: 1.1,  ry: 0.6 },
    { r: 3.2, x:   4.5, y: -11,  z:  5,  rx: 0.2,  ry: 0.8 },
    { r: 1.8, x: -11,   y: -4.5, z: -4,  rx: 0.8,  ry: 0.4 },
    { r: 2.4, x:   7.5, y:  9.5, z:  3,  rx: 0.4,  ry: 0.6 },
  ]
  const ringInst = new THREE.InstancedMesh(
    new THREE.TorusGeometry(1, 0.09, 8, 28),
    sharedGoldFrag,
    ringDefs.length,
  )
  ringDefs.forEach((rd, i) => {
    dummyM.position.set(rd.x, rd.y, rd.z)
    dummyM.rotation.set(rd.rx, rd.ry, 0)
    dummyM.scale.setScalar(rd.r)
    dummyM.updateMatrix()
    ringInst.setMatrixAt(i, dummyM.matrix)
  })
  group.add(ringInst)
  spinObjects.push({ obj: ringInst, rx: 0.0007, ry: 0.0013, rz: 0.0005 })

  // Spheres: single InstancedMesh — 1 draw call for all 6 orbs
  const sphereInst = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 8, 8),
    sharedGoldFrag,
    6,
  )
  for (let i = 0; i < 6; i++) {
    const theta = (i / 6) * Math.PI * 2 + 1.0
    const r = 10 + i * 0.8
    const size = 0.45 + (i % 3) * 0.15
    dummyM.position.set(r * Math.cos(theta), ((i % 3) - 1) * 3.5, r * Math.sin(theta) * 0.6)
    dummyM.rotation.set(0, 0, 0)
    dummyM.scale.setScalar(size)
    dummyM.updateMatrix()
    sphereInst.setMatrixAt(i, dummyM.matrix)
  }
  group.add(sphereInst)
  spinObjects.push({ obj: sphereInst, rx: 0.001, ry: 0.0014, rz: 0.0008 })

  scene.add(group)
  lightSculptureGroup = group
}

// ── Render loop (called by setAnimationLoop — works in workers) ─────────────
function animate() {
  frameCount++

  if (lightMode) {
    // ── Light mode: only run sculpture + coin logic ──────────────────────────
    // Node / line / packet systems are all invisible in light mode — skip
    // their CPU work entirely (was the biggest main-thread cost).
    if (lightSculptureGroup) {
      // Spin every 2nd frame — halves the JS work, motion is imperceptible at 30 updates/s
      if (frameCount % 2 === 0) {
        for (const s of spinObjects) {
          s.obj.rotation.x += s.rx * 2
          s.obj.rotation.y += s.ry * 2
          s.obj.rotation.z += s.rz * 2
        }
      }
      lightSculptureGroup.rotation.y += 0.0007
      lightSculptureGroup.position.y = ICO_CY + Math.sin(frameCount * 0.006) * 0.5
    }
    if (logoGroup) logoGroup.rotation.y = Math.sin(frameCount * 0.0035) * 0.28
  } else {
    // ── Dark mode: run the full node / line / packet network ────────────────
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = nodesMeshes[i].position
      const v = nodeVelocities[i]
      p.addScaledVector(v, 1)
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
      const sc = 1 + Math.sin(frameCount * 0.06 + i * 0.7) * 0.22
      nodesMeshes[i].scale.setScalar(sc)
    }

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
            lineColors[idx]   = a * 0.08; lineColors[idx+1] = a * 0.88; lineColors[idx+2] = a
            lineColors[idx+3] = a * 0.08; lineColors[idx+4] = a * 0.88; lineColors[idx+5] = a
            cc++
          }
        }
      }
      for (let k = cc * 6; k < MAX_LINES * 6; k++) { linePositions[k] = 0; lineColors[k] = 0 }
      const lg = lineSegments.geometry as LineSegmentsGeometry
      lg.setPositions(linePositions)
      lg.setColors(lineColors)
    }

    for (let i = 0; i < PACKET_COUNT; i++) {
      const pk = packetData[i]
      pk.t += pk.speed
      if (pk.t >= 1) { pk.t = 0; pk.from = pk.to; pk.to = Math.floor(Math.random() * NODE_COUNT) }
      dummy.position.lerpVectors(nodesMeshes[pk.from].position, nodesMeshes[pk.to].position, pk.t)
      dummy.updateMatrix()
      packetsMesh.setMatrixAt(i, dummy.matrix)
    }
    packetsMesh.instanceMatrix.needsUpdate = true

    icoGroup.rotation.x += 0.0022
    icoGroup.rotation.y += 0.0036
    if (outerShellMesh) { outerShellMesh.rotation.y -= 0.0028; outerShellMesh.rotation.z += 0.0012 }
    if (midShellMesh)   { midShellMesh.rotation.x   += 0.0016; midShellMesh.rotation.y   -= 0.0020 }
    octMesh.rotation.x  += 0.003
    octMesh.rotation.z  += 0.0025
    if (frameCount % 5 === 0) stars.rotation.y += 0.0006
    if (logoGroup) logoGroup.rotation.y = Math.sin(frameCount * 0.0035) * 0.32
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
    renderer.toneMappingExposure = 0.88

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
    if (outerIcoMat)  { outerIcoMat.color.setHex(dark ? 0x06b6d4 : 0x52525B); outerIcoMat.opacity = dark ? 0.55 : 0.65 }
    if (midIcoMat)    { midIcoMat.color.setHex(dark ? 0x6366f1 : 0xA67C00);   midIcoMat.opacity   = dark ? 0.22 : 0.75 }
    if (octMat)       { octMat.color.setHex(dark ? 0x06b6d4 : 0xA67C00);      octMat.opacity      = dark ? 0.22 : 0.40 }
    if (starsMat)     { starsMat.color.setHex(dark ? 0xffffff : 0xA67C00);    starsMat.opacity    = dark ? 0.35 : 0.25 }
    if (packetsMat)   packetsMat.color.setHex(dark ? 0x06b6d4 : 0xA67C00)
    if (logoGlowMat)  logoGlowMat.color.setHex(dark ? ACCENT : 0xD4AF37)
    if (logoRingMat)  logoRingMat.color.setHex(dark ? ACCENT : 0xD4AF37)
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
    const LW = 8.0
    const LH = LW / aspect

    logoGroup = new THREE.Group()
    logoGroup.position.copy(icoGroup.position)
    // theme message arrives before logoGroup exists, so the +4 light-mode
    // x-offset is never applied at that point. Apply it here if already in
    // light mode so the coin sits at the sculpture group's origin (ICO_CX+4).
    if (lightMode) {
      logoGroup.position.x = icoGroup.position.x + 4
      logoGroup.scale.setScalar(0.8)
    }

    // Soft glow disc behind logo
    const glowMat = new THREE.MeshBasicMaterial({
      color: lightMode ? 0xB8860B : ACCENT, transparent: true, opacity: 0.18,
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
      color: 0xD4AF37, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08,
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
      color: lightMode ? 0xB8860B : ACCENT, transparent: true, opacity: 0.50,
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
