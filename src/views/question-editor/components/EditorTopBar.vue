<template>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <span class="text-sm text-text-muted">Режим:</span>
      <button
        v-for="mode in editorModes"
        :key="mode.value"
        class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
        :class="modeClass(mode.value)"
        @click="$emit('setMode', mode.value)"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <AppButton size="sm" variant="secondary" @click="$emit('save', false)">
        Сохранить пакет
      </AppButton>
      <AppButton size="sm" variant="primary" @click="$emit('save', true)">
        Сохранить как новый пакет
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'
import type { EditorMode } from '../useQuestionEditor'

const props = defineProps<{
  editorModes: { value: EditorMode; label: string }[]
  currentMode: EditorMode
}>()

defineEmits<{
  (e: 'setMode', mode: EditorMode): void
  (e: 'save', asNew: boolean): void
}>()

function modeClass(mode: EditorMode) {
  const active = mode === props.currentMode
  return active
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-surface-dark bg-surface text-text-muted hover:border-primary/60 hover:text-text'
}
</script>

