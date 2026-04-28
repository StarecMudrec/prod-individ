<template>
  <section class="mb-6 rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold text-text">
      Финальный вопрос
    </h2>
    <div class="space-y-3">
      <div>
        <label class="mb-1 block text-xs font-semibold text-text-muted">Тема финала</label>
        <input
          v-model="finalQuestion.themeTitle"
          type="text"
          class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
        >
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold text-text-muted">Текст вопроса</label>
        <textarea
          v-model="finalQuestion.text"
          rows="3"
          class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold text-text-muted">Правильный ответ</label>
        <input
          v-model="finalQuestion.correctAnswer"
          type="text"
          class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
        >
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold text-text-muted">Допустимые варианты ответа (через запятую)</label>
        <input
          :value="(finalQuestion.acceptedAnswers ?? []).join(', ')"
          type="text"
          class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
          @input="onFinalAcceptedInput"
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  finalQuestion: any
  onFinalAcceptedInput: (event: Event) => void
}>()
</script>

