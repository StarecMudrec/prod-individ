<template>
  <ModalFullscreenSpin :model-value="true">
    <div class="text-center rounded-card border border-surface-dark bg-surface-alt px-8 py-4 shadow-sm">
      <h1 class="mt-4 mb-4 text-6xl font-rampart text-text text-stroke-1 tracking-tight-less-negative text-shadow-sm">
        Финал
      </h1>
      <p class="text-lg text-text-muted">
        Тема:
      </p>
      <p class="mb-6 text-3xl font-semibold text-question-auc-text">
        {{ themeTitle }}
      </p>
      <p class="mb-4 text-sm text-text-muted">
        Только игроки с положительным счётом участвуют в финале. Готовьтесь делать ставки!
      </p>
      <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-dark border-solid border-2 border-button-default">
        <div
          class="h-full rounded-full bg-primary transition-all"
          :style="{ width: `${themeProgress}%` }"
        />
      </div>
      <p class="mt-2 text-xs text-text-muted">
        Переход к ставкам через {{ remainingSeconds }}&nbsp;сек.
      </p>
    </div>
  </ModalFullscreenSpin>
</template>

<script setup lang="ts">
  import { ModalFullscreenSpin } from '@/components/ui'

  defineProps<{
    themeTitle: string
    themeProgress: number
    remainingSeconds: number
  }>()
</script>
