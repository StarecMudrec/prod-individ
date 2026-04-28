<template>
  <span class="inline">
    <span
      v-for="(char, i) in chars"
      :key="`wave-char-${i}-${char}`"
      class="wave-char font-rampart"
      :class="[baseClass, { 'wave-active': waveActive }]"
      :style="{ '--wave-i': i }"
    >{{ char }}</span>
  </span>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  const props = withDefaults(
    defineProps<{
      text: string
      baseClass?: string
      intervalMs?: number
    }>(),
    {
      baseClass: 'text-text',
      intervalMs: 4000,
    },
  )

  const chars = computed(() => (props.text ?? '').split(''))
  const waveActive = ref(true)

  onMounted(() => {
    const waveTimer = setInterval(() => {
      waveActive.value = false
      setTimeout(() => {
        waveActive.value = true
      }, 20)
    }, props.intervalMs)
    onUnmounted(() => clearInterval(waveTimer))
  })
</script>

<style scoped>
  .wave-char {
    display: inline-block;
    animation-duration: 0.6s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
  }
  .wave-char.wave-active {
    animation-name: wave;
    animation-delay: calc(var(--wave-i) * 50ms);
  }

  @keyframes wave {
    0%,
    100% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(-0.35em);
    }
    75% {
      transform: translateY(0.1em);
    }
  }
</style>
