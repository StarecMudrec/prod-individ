<template>
  <slot :animated-value="animatedScore">
    {{ animatedScore }}
  </slot>
</template>


<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      to: number
      from?: number
      durationMs?: number
      delayMs?: number
    }>(),
    {
      from: 0,
      durationMs: 900,
      delayMs: 150,
    }
  )

  const animatedScore = ref(props.from)

  let delayTimer: number | null = null
  let rafId: number | null = null

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3)
  }

  function startAnimation(fromValue?: number) {
    const from = fromValue ?? props.from
    const to = props.to
    if (from === to) {
      animatedScore.value = to
      return
    }

    const durationMs = props.durationMs
    const startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const t = Math.min(1, Math.max(0, elapsed / durationMs))
      const eased = easeOutCubic(t)
      animatedScore.value = Math.round(from + (to - from) * eased)

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        animatedScore.value = to
        rafId = null
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  function scheduleAnimation() {
    delayTimer = window.setTimeout(() => {
      startAnimation()
    }, props.delayMs)
  }

  onMounted(() => {
    scheduleAnimation()
  })

  watch(
    () => props.to,
    () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      if (delayTimer !== null) {
        window.clearTimeout(delayTimer)
        delayTimer = null
      }
      // Animate from current displayed value so it doesn't jump to 0 while typing
      startAnimation(animatedScore.value)
    }
  )

  onBeforeUnmount(() => {
    if (delayTimer !== null) {
      window.clearTimeout(delayTimer)
      delayTimer = null
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  })
</script>
