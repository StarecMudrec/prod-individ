  <template>
  <span class="text-wave-bounce inline-flex flex-wrap" :style="{ '--wave-duration': `${duration}s` }">
    <span
      v-for="(char, i) in chars"
      :key="`${i}-${char}`"
      class="text-wave-bounce__char inline-block"
      :style="{ animationDelay: `${i * charDelay}s` }"
    >{{ char === ' ' ? '\u00A0' : char }}</span>
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      text: string
      charDelay?: number
      duration?: number
    }>(),
    {
      charDelay: 0.07,
      duration: 1.4,
    },
  )

  const chars = computed(() => (props.text ?? '').split(''))
</script>

<style scoped>
  .text-wave-bounce__char {
    animation: text-wave-bounce var(--wave-duration, 1.4s) ease-in-out infinite;
  }

  @keyframes text-wave-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
</style>
