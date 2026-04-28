<template>
  <div class="mb-4 flex flex-wrap items-center gap-3">
    <span class="text-sm font-medium text-text">Раунд:</span>
    <button
      v-for="(round, index) in rounds"
      :key="round.id ?? index"
      class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
      :class="roundTabClass(index)"
      @click="$emit('setIndex', index)"
    >
      {{ round.id ?? index + 1 }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rounds: any[]
  currentRoundIndex: number
}>()

defineEmits<{
  (e: 'setIndex', index: number): void
}>()

function roundTabClass(index: number) {
  const active = props.currentRoundIndex === index
  return active
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-surface-dark bg-surface text-text-muted hover:border-primary/60 hover:text-text'
}
</script>

