<template>
  <span
    :key="waveDirection"
    class="wave-text"
    @animationend="onWaveEnd"
  >
    <span
      v-for="(char, index) in chars"
      :key="index"
      class="wave-char"
      :data-index="index"
      :style="{ animationDelay: waveDelay(index) }"
    >
      {{ char === ' ' ? '\u00A0' : char }}
    </span>
  </span>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      text: string
      waveHalfDuration?: number
    }>(),
    { waveHalfDuration: 5 },
  )

  const chars = computed(() => props.text.split(''))
  const textLength = computed(() => props.text.length)
  const waveDirection = ref<'lr' | 'rl'>('lr')

  function waveDelay(index: number) {
    const t = textLength.value
    if (t <= 0) return '0s'
    if (waveDirection.value === 'lr') {
      return `${(index / t) * props.waveHalfDuration}s`
    }
    return `${((t - 1 - index) / t) * props.waveHalfDuration}s`
  }

  function onWaveEnd(e: AnimationEvent) {
    const idx = (e.target as HTMLElement).dataset.index
    if (idx === undefined) return
    const i = Number(idx)
    const lastToFinish = waveDirection.value === 'lr' ? textLength.value - 1 : 0
    if (i === lastToFinish) {
      waveDirection.value = waveDirection.value === 'lr' ? 'rl' : 'lr'
    }
  }
</script>

<style scoped>
  .wave-text {
    display: inline;
  }

  .wave-char {
    display: inline-block;
    animation: wave-bump 2s ease-in-out forwards;
  }

  @keyframes wave-bump {
    0%, 40% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
    60%, 100% { transform: translateY(0); }
  }
</style>
