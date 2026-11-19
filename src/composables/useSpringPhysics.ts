// Gene - Nov, 19, 2026: Damped harmonic spring physics composable for antigravity card levitation and cursor-following 1-2 deg tilt
import { computed, onUnmounted, ref, toValue, watch, type CSSProperties, type MaybeRefOrGetter } from 'vue'

export interface AntigravityTiltOptions {
  maxTilt?: number
  liftY?: number
  scale?: number
  stiffness?: number
  damping?: number
  mass?: number
  disabled?: MaybeRefOrGetter<boolean>
}

interface SpringChannel {
  current: number
  target: number
  velocity: number
}

function createChannel(initial: number): SpringChannel {
  return { current: initial, target: initial, velocity: 0 }
}

function stepChannel(
  ch: SpringChannel,
  stiffness: number,
  damping: number,
  mass: number,
  dt: number,
): boolean {
  const displacement = ch.current - ch.target
  const springForce = -stiffness * displacement
  const dampingForce = -damping * ch.velocity
  const acceleration = (springForce + dampingForce) / mass

  ch.velocity += acceleration * dt
  ch.current += ch.velocity * dt

  const settled = Math.abs(ch.target - ch.current) < 0.0005 && Math.abs(ch.velocity) < 0.0005
  if (settled) {
    ch.current = ch.target
    ch.velocity = 0
  }
  return !settled
}

export function useAntigravityTilt(options: AntigravityTiltOptions = {}) {
  const maxTilt = options.maxTilt ?? 1.8
  const liftY = options.liftY ?? -7
  const hoverScale = options.scale ?? 1.008
  const stiffness = options.stiffness ?? 230
  const damping = options.damping ?? 22
  const mass = options.mass ?? 0.9

  const elementRef = ref<HTMLElement | null>(null)
  const isHovered = ref(false)
  const reducedMotion = ref(false)

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const rx = createChannel(0)
  const ry = createChannel(0)
  const y = createChannel(0)
  const scale = createChannel(1)
  const shadowX = createChannel(0)
  const shadowY = createChannel(0)
  const glareX = createChannel(50)
  const glareY = createChannel(50)
  const glareOpacity = createChannel(0)

  const renderState = ref({
    rx: 0,
    ry: 0,
    y: 0,
    scale: 1,
    shadowX: 0,
    shadowY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  })

  let rafId: number | null = null
  let lastTs = 0

  const syncRenderState = () => {
    renderState.value = {
      rx: rx.current,
      ry: ry.current,
      y: y.current,
      scale: scale.current,
      shadowX: shadowX.current,
      shadowY: shadowY.current,
      glareX: glareX.current,
      glareY: glareY.current,
      glareOpacity: glareOpacity.current,
    }
  }

  const tick = (now: number) => {
    const dt = lastTs === 0 ? 1 / 60 : Math.min((now - lastTs) / 1000, 0.032)
    lastTs = now

    let moving = false
    if (stepChannel(rx, stiffness, damping, mass, dt)) moving = true
    if (stepChannel(ry, stiffness, damping, mass, dt)) moving = true
    if (stepChannel(y, stiffness, damping, mass, dt)) moving = true
    if (stepChannel(scale, stiffness, damping, mass, dt)) moving = true
    if (stepChannel(shadowX, stiffness, damping, mass, dt)) moving = true
    if (stepChannel(shadowY, stiffness, damping, mass, dt)) moving = true
    if (stepChannel(glareX, stiffness * 1.15, damping, mass, dt)) moving = true
    if (stepChannel(glareY, stiffness * 1.15, damping, mass, dt)) moving = true
    if (stepChannel(glareOpacity, stiffness, damping * 1.1, mass, dt)) moving = true

    syncRenderState()

    if (moving) {
      rafId = requestAnimationFrame(tick)
    } else {
      rafId = null
      lastTs = 0
    }
  }

  const startLoop = () => {
    if (typeof requestAnimationFrame === 'undefined' || rafId !== null) return
    lastTs = 0
    rafId = requestAnimationFrame(tick)
  }

  const resetTargets = () => {
    isHovered.value = false
    rx.target = 0
    ry.target = 0
    y.target = 0
    scale.target = 1
    shadowX.target = 0
    shadowY.target = 0
    glareOpacity.target = 0
    startLoop()
  }

  const isDisabled = () => Boolean(toValue(options.disabled)) || reducedMotion.value

  watch(
    () => Boolean(toValue(options.disabled)),
    (disabled) => {
      if (disabled) {
        resetTargets()
      }
    },
  )

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || isDisabled()) return
    isHovered.value = true
    y.target = liftY
    scale.target = hoverScale
    glareOpacity.target = 1
    startLoop()
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || isDisabled() || !elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))

    isHovered.value = true
    // Tilt gently toward cursor: pressing the cursor corner toward the viewer
    ry.target = -nx * maxTilt
    rx.target = ny * maxTilt
    y.target = liftY
    scale.target = hoverScale
    shadowX.target = -nx * 10
    shadowY.target = -ny * 8
    glareX.target = ((nx + 1) / 2) * 100
    glareY.target = ((ny + 1) / 2) * 100
    glareOpacity.target = 1
    startLoop()
  }

  const onPointerLeave = () => {
    resetTargets()
  }

  onUnmounted(() => {
    if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  })

  const tiltStyle = computed<CSSProperties>(() => {
    const s = renderState.value
    const isAtRest =
      s.rx === 0 && s.ry === 0 && s.y === 0 && s.scale === 1 && s.glareOpacity === 0

    if (reducedMotion.value || isAtRest) {
      return {
        '--glare-x': '50%',
        '--glare-y': '50%',
        '--glare-opacity': '0',
        '--shadow-dx': '0px',
        '--shadow-dy': '0px',
      } as CSSProperties
    }

    return {
      transform: `perspective(1100px) translate3d(0, ${s.y.toFixed(2)}px, 0) rotateX(${s.rx.toFixed(3)}deg) rotateY(${s.ry.toFixed(3)}deg) scale3d(${s.scale.toFixed(4)}, ${s.scale.toFixed(4)}, 1)`,
      willChange: 'transform',
      '--glare-x': `${s.glareX.toFixed(1)}%`,
      '--glare-y': `${s.glareY.toFixed(1)}%`,
      '--glare-opacity': s.glareOpacity.toFixed(3),
      '--shadow-dx': `${s.shadowX.toFixed(1)}px`,
      '--shadow-dy': `${s.shadowY.toFixed(1)}px`,
    } as CSSProperties
  })

  return {
    elementRef,
    isHovered,
    tiltStyle,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
  }
}
