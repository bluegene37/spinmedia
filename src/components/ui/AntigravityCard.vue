<!-- Gene - Nov, 19, 2026: Borderless antigravity floating card with calibrated Z-axis ambient shadow and damped spring tilt -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAntigravityTilt } from '@/composables/useSpringPhysics'

export type AntigravityDepth = 'hero' | 'elevated' | 'recessed'

const props = withDefaults(
  defineProps<{
    depth?: AntigravityDepth
    maxTilt?: number
    as?: 'article' | 'section' | 'div'
    interactive?: boolean
  }>(),
  {
    depth: 'elevated',
    as: 'article',
    interactive: true,
  },
)

const resolvedMaxTilt = computed(() => {
  if (props.maxTilt !== undefined) return props.maxTilt
  if (props.depth === 'hero') return 1.4
  if (props.depth === 'recessed') return 1.4
  return 1.8
})

const resolvedLift = computed(() => {
  if (props.depth === 'hero') return -8
  if (props.depth === 'recessed') return -5
  return -7
})

const { elementRef, tiltStyle, onPointerEnter, onPointerMove, onPointerLeave } =
  useAntigravityTilt({
    maxTilt: resolvedMaxTilt.value,
    liftY: resolvedLift.value,
    scale: props.depth === 'hero' ? 1.005 : 1.009,
    disabled: () => !props.interactive,
  })

const surfaceClass = computed(() => {
  if (props.depth === 'hero') {
    return 'rounded-[28px] bg-white shadow-float-hero hover:shadow-float-hero-hover ring-1 ring-white/95 dark:bg-obsidian-float dark:ring-white/[0.08]'
  }
  if (props.depth === 'recessed') {
    return 'rounded-[22px] bg-white/88 backdrop-blur-md shadow-float-recessed hover:shadow-float-elevated ring-1 ring-white/85 dark:bg-obsidian-float/88 dark:ring-white/[0.05]'
  }
  return 'rounded-[24px] bg-white shadow-float-elevated hover:shadow-float-elevated-hover ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/[0.06]'
})
</script>

<template>
  <component
    :is="as"
    ref="elementRef"
    :style="tiltStyle"
    class="group/card relative overflow-hidden transition-shadow duration-300"
    :class="surfaceClass"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Whisper specular highlight following cursor -->
    <div
      aria-hidden="true"
      class="antigravity-glare pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
      style="
        opacity: calc(var(--glare-opacity, 0) * 0.65);
        background: radial-gradient(
          480px circle at var(--glare-x, 50%) var(--glare-y, 50%),
          rgba(255, 255, 255, 0.42),
          transparent 62%
        );
      "
    />
    <slot />
  </component>
</template>
