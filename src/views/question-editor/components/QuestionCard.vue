<template>
  <div class="rounded-md border border-surface-dark bg-surface-alt p-3">
    <div class="mb-2 flex flex-wrap items-center gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-text-muted">Стоимость</label>
        <input
          v-model.number="question.cost"
          type="number"
          class="w-24 rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
        >
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-text-muted">Тип</label>
        <select
          v-model="question.type"
          class="rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
        >
          <option value="normal">Обычный</option>
          <option value="cat">Кот в мешке</option>
          <option value="auction">Аукцион</option>
        </select>
      </div>
    </div>

    <div class="mb-2">
      <label class="mb-1 block text-xs font-semibold text-text-muted">Текст вопроса</label>
      <textarea
        v-model="question.text"
        rows="2"
        class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
      />
    </div>

    <div class="mb-2">
      <label class="mb-1 block text-xs font-semibold text-text-muted">Правильный ответ</label>
      <input
        v-model="question.correctAnswer"
        type="text"
        class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
      >
    </div>

    <div>
      <label class="mb-1 block text-xs font-semibold text-text-muted">Допустимые варианты ответа (через запятую)</label>
      <input
        :value="(question.acceptedAnswers ?? []).join(', ')"
        type="text"
        class="w-full rounded-md border border-surface-darker bg-surface px-2 py-1 text-sm text-text"
        @input="onAcceptedAnswersInput($event, question)"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  question: any
  onAcceptedAnswersInput: (event: Event, question: any) => void
}>()
</script>

