<template>
  <div class="flip-reveal-box">
    <div
      class="flip-reveal-box-inner"
      :class="{ 'flip-reveal-box-inner--animate': visible }"
      :style="innerStyle"
      @animationend="emit('flipComplete')"
    >
      <!-- Face visible before flip (card "back") -->
      <div class="flip-reveal-box-face flip-reveal-box-back-face unselectable">
        <slot name="back">
          <div class="flip-reveal-box-placeholder" />
        </slot>
      </div>
      <!-- Face revealed after flip (content) - rotated 180deg so it's right-side up when inner hits 180deg -->
      <div class="flip-reveal-box-face flip-reveal-box-front-face">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits<{ flipComplete: [] }>()

const props = withDefaults(
  defineProps<{
    /** Delay before flip starts (ms) */
    delay?: number
    /** Flip duration (ms) */
    duration?: number
    /** Flip axis: 'x' = vertical (top/bottom), 'y' = horizontal (left/right) */
    axis?: 'x' | 'y'
    /** Whether to run the flip (e.g. when true after mount) */
    visible?: boolean
  }>(),
  {
    delay: 0,
    duration: 600,
    axis: 'x',
    visible: true,
  }
)

const innerStyle = computed(() => {
  const rotate = (deg: number) => `rotate${props.axis.toUpperCase()}(${deg}deg)`
  return {
    '--flip-duration': `${props.duration}ms`,
    '--flip-delay': `${props.delay}ms`,
    '--flip-rotate-0': rotate(0),
    '--flip-rotate-180': rotate(180),
    '--flip-animation-name': `flip-reveal-${props.axis}`,
  }
})
</script>

<style scoped>
.flip-reveal-box {
  perspective: 1000px;
  width: 100%;
  /* Keep 3D context for children */
  transform-style: preserve-3d;
}

.flip-reveal-box-inner {
  position: relative;
  width: 100%;
  min-height: 1.5em;
  transform-style: preserve-3d;
  transform: var(--flip-rotate-0);
  /* Force GPU layer so 3D and backface-visibility work reliably */
  will-change: transform;
}

.flip-reveal-box-inner--animate {
  animation: var(--flip-animation-name) var(--flip-duration, 600ms) ease-in-out var(--flip-delay, 0ms) forwards;
}

.flip-reveal-box-face {
  position: relative;
  width: 100%;
  min-height: inherit;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Back face: what we see before flip (0–90°); fills inner so it matches front size */
.flip-reveal-box-back-face {
  position: absolute;
  inset: 0;
  transform: var(--flip-rotate-0);
}

/* Front face: content, only visible after 90° (revealed side); in flow so inner height = front */
.flip-reveal-box-front-face {
  position: relative;
  transform: var(--flip-rotate-180);
}

.flip-reveal-box-placeholder {
  min-height: 1.5em;
}
</style>

<style>
/* Unscoped so keyframe name is stable and animation runs */
@keyframes flip-reveal-x {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(180deg);
  }
}

@keyframes flip-reveal-y {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(180deg);
  }
}
</style>
