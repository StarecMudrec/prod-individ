<template>
  <section class="mb-6 rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold text-text">
      Специальные вопросы (кот и аукцион)
    </h2>
    <p class="mb-3 text-sm text-text-muted">
      Дополнительные особые вопросы для «Кота в мешке» и «Аукциона». Они автоматически
      распределяются по ячейкам табло при начале игры.
    </p>

    <RoundTabs
      :rounds="rounds"
      :current-round-index="currentRoundIndex"
      @set-index="$emit('setRoundIndex', $event)"
    />

    <div v-if="currentRound" class="space-y-3">
      <SpecialQuestionCard
        v-for="(question, index) in (currentRound.specialQuestions ?? [])"
        :key="question.id ?? index"
        :question="question"
        :on-accepted-answers-input="onAcceptedAnswersInput"
        @remove="removeSpecialQuestion(index)"
      />

      <div class="flex justify-end">
        <AppButton size="xs" variant="secondary" @click="addSpecialQuestion">
          Добавить спецвопрос
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'
import RoundTabs from './RoundTabs.vue'
import SpecialQuestionCard from './SpecialQuestionCard.vue'

defineProps<{
  rounds: any[]
  currentRoundIndex: number
  currentRound: any | null
  addSpecialQuestion: () => void
  removeSpecialQuestion: (index: number) => void
  onAcceptedAnswersInput: (event: Event, question: any) => void
}>()

defineEmits<{
  (e: 'setRoundIndex', index: number): void
}>()
</script>

