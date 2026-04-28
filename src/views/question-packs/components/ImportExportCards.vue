<template>
  <section class="mb-8 grid gap-4 md:grid-cols-2">
    <div class="rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
      <h2 class="mb-3 text-lg font-semibold text-text">
        Импорт пакета
      </h2>
      <p class="mb-3 text-sm text-text-muted">
        Загрузите JSON-файл в формате <code>questions.json</code>. Формат будет проверен, при ошибках вы увидите
        список проблем.
      </p>
      <AppButton size="sm" @click="$emit('selectFile')">
        Импортировать из файла…
      </AppButton>
    </div>

    <div class="rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
      <h2 class="mb-3 text-lg font-semibold text-text">
        Экспорт активного пакета
      </h2>
      <p class="mb-3 text-sm text-text-muted">
        Сохраните текущий набор вопросов в JSON-файл, чтобы отредактировать его вручную или перенести в другое место.
      </p>
      <AppButton size="sm" @click="$emit('export')">
        Экспортировать в файл
      </AppButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'

defineEmits<{
  (e: 'selectFile'): void
  (e: 'export'): void
}>()
</script>

