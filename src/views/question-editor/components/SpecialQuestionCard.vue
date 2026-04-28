<template>
  <div class="rounded-md border border-surface-dark bg-surface p-3">
    <div class="mb-2 flex flex-wrap items-center gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-text-muted">Тип</label>
        <select
          v-model="question.type"
          class="rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
        >
          <option value="cat">Кот в мешке</option>
          <option value="auction">Аукцион</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-text-muted">Тема</label>
        <input
          v-model="question.themeTitle"
          type="text"
          class="w-48 rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
        >
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-text-muted">Стоимость (обычно 0)</label>
        <input
          v-model.number="question.cost"
          type="number"
          class="w-24 rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
        >
      </div>
    </div>

    <div class="mb-2">
      <label class="mb-1 block text-xs font-semibold text-text-muted">Текст вопроса</label>
      <textarea
        v-model="question.text"
        rows="2"
        class="w-full rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
      />
    </div>

    <div class="mb-2">
      <label class="mb-1 block text-xs font-semibold text-text-muted">Правильный ответ</label>
      <input
        v-model="question.correctAnswer"
        type="text"
        class="w-full rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
      >
    </div>

    <div class="mb-2">
      <label class="mb-1 block text-xs font-semibold text-text-muted">Допустимые варианты ответа (через запятую)</label>
      <input
        :value="(question.acceptedAnswers ?? []).join(', ')"
        type="text"
        class="w-full rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
        @input="onAcceptedAnswersInput($event, question)"
      >
    </div>

    <div class="flex justify-end">
      <AppButton
        size="xs"
        variant="secondary"
        text-class="text-error"
        @click="$emit('remove')"
      >
        Удалить спецвопрос
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'

defineProps<{
  question: any
  onAcceptedAnswersInput: (event: Event, question: any) => void
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

