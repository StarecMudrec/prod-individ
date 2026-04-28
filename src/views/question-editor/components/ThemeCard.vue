<template>
  <div class="rounded-md border border-surface-dark bg-surface p-3">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-text-muted">Название темы</label>
        <input
          v-model="theme.title"
          type="text"
          class="w-full rounded-md border border-surface-darker bg-surface-alt px-2 py-1 text-sm text-text"
          placeholder="Например, Стартапы"
        >
      </div>
      <AppButton
        v-if="canRemove"
        size="xs"
        variant="secondary"
        text-class="text-error"
        @click="$emit('remove')"
      >
        Удалить тему
      </AppButton>
    </div>

    <div class="space-y-3">
      <QuestionCard
        v-for="(question, questionIndex) in theme.questions"
        :key="question.id ?? questionIndex"
        :question="question"
        :on-accepted-answers-input="onAcceptedAnswersInput"
      />

      <div class="flex justify-end">
        <AppButton
          size="xs"
          variant="secondary"
          :disabled="theme.questions.length >= 5"
          @click="$emit('addQuestion')"
        >
          Добавить вопрос
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'
import QuestionCard from './QuestionCard.vue'

defineProps<{
  theme: any
  canRemove: boolean
  onAcceptedAnswersInput: (event: Event, question: any) => void
}>()

defineEmits<{
  (e: 'remove'): void
  (e: 'addQuestion'): void
}>()
</script>

