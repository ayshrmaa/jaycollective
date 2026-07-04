import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Proportions extracted from 10x.so's starLogo.glb, rendered upright:
// tips at radius 1 (N/E/S/W), waists at 0.25 on the diagonals,
// front/back apexes at z = ±0.105. Flat-shaded for the faceted look.
const TIP_R = 1.0
const WAIST_R = 0.25
const APEX_Z = 0.105

function buildStarGeometry(): THREE.BufferGeometry {
  const outline: [number, number][] = []
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI / 2 - (i * Math.PI) / 4 // start at top, clockwise
    const r = i % 2 === 0 ? TIP_R : WAIST_R
    outline.push([Math.cos(angle) * r, Math.sin(angle) * r])
  }
  const positions: number[] = []
  for (let i = 0; i < 8; i++) {
    const [ax, ay] = outline[i]
    const [bx, by] = outline[(i + 1) % 8]
    // front face (apex toward camera) — counter-clockwise winding
    positions.push(0, 0, APEX_Z, ax, ay, 0, bx, by, 0)
    // back face
    positions.push(0, 0, -APEX_Z, bx, by, 0, ax, ay, 0)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

const IDLE_SPIN = 0.005
const DRAG_SENSITIVITY = 0.01
const INERTIA_DAMPING = 0.95

export function StarLogo() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.z = 4.2

    // No WebGL (old device, headless crawler) → skip the star, never crash the page
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    const canvas = renderer.domElement
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    const geometry = buildStarGeometry()
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0,
      roughness: 0.5,
      flatShading: true,
      side: THREE.DoubleSide,
    })
    const star = new THREE.Mesh(geometry, material)
    scene.add(star)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(2, 3, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.4)
    fill.position.set(-3, -2, 4)
    scene.add(fill)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    // --- interaction state ---
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let dragging = false
    let lastX = 0
    let lastY = 0
    let velX = 0 // rotation velocity applied to y-axis (from horizontal drag)
    let velY = 0 // rotation velocity applied to x-axis (from vertical drag)
    let idleBlend = 1 // 1 = fully idle tumble, 0 = fully user-controlled

    const hitsStar = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return false
      }
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObject(star).length > 0
    }

    // Hover raycast lives on window so it still fires while the canvas has
    // pointer-events: none — that's what lets clicks fall through to the
    // draggable cards when the cursor isn't on the star itself.
    const onWindowMove = (e: PointerEvent) => {
      if (dragging) return
      const over = hitsStar(e.clientX, e.clientY)
      canvas.style.pointerEvents = over ? 'auto' : 'none'
      canvas.style.cursor = over ? 'grab' : 'default'
    }

    const onDragMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      star.rotation.y += dx * DRAG_SENSITIVITY
      star.rotation.x += dy * DRAG_SENSITIVITY
      velX = dx * DRAG_SENSITIVITY
      velY = dy * DRAG_SENSITIVITY
    }

    const onDragEnd = () => {
      dragging = false
      canvas.style.cursor = 'grab'
      window.removeEventListener('pointermove', onDragMove)
      window.removeEventListener('pointerup', onDragEnd)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!hitsStar(e.clientX, e.clientY)) return
      dragging = true
      idleBlend = 0
      lastX = e.clientX
      lastY = e.clientY
      velX = 0
      velY = 0
      canvas.style.cursor = 'grabbing'
      window.addEventListener('pointermove', onDragMove)
      window.addEventListener('pointerup', onDragEnd)
    }

    canvas.style.pointerEvents = 'none'
    window.addEventListener('pointermove', onWindowMove)
    canvas.addEventListener('pointerdown', onPointerDown)

    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      if (!dragging) {
        // inertia from the last drag, decaying
        star.rotation.y += velX
        star.rotation.x += velY
        velX *= INERTIA_DAMPING
        velY *= INERTIA_DAMPING
        // once inertia is spent, ease the idle tumble back in
        if (Math.abs(velX) < 0.0005 && Math.abs(velY) < 0.0005) {
          idleBlend = Math.min(1, idleBlend + 0.01)
        }
        star.rotation.y += IDLE_SPIN * idleBlend
        star.rotation.x +=
          (Math.sin(t * 0.35) * 0.12 - star.rotation.x) * 0.005 * idleBlend
      }
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('pointermove', onWindowMove)
      window.removeEventListener('pointermove', onDragMove)
      window.removeEventListener('pointerup', onDragEnd)
      canvas.removeEventListener('pointerdown', onPointerDown)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      container.removeChild(canvas)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(46vmin, 520px)',
        height: 'min(46vmin, 520px)',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}
