<template>
  <section class="mb-6 rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
    <RoundTabs
      :rounds="rounds"
      :current-round-index="currentRoundIndex"
      @set-index="$emit('setRoundIndex', $event)"
    />

    <div v-if="currentRound" class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <span>Темы: {{ currentRound.themes.length }}/6</span>
          <span>Стоимость: {{ currentRound.costs.join(', ') }}</span>
        </div>
        <AppButton
          size="sm"
          variant="secondary"
          :disabled="currentRound.themes.length >= 6"
          @click="addTheme"
        >
          Добавить тему
        </AppButton>
      </div>

      <ThemeCard
        v-for="(theme, themeIndex) in currentRound.themes"
        :key="theme.id ?? themeIndex"
        :theme="theme"
        :can-remove="currentRound.themes.length > 1"
        :on-accepted-answers-input="onAcceptedAnswersInput"
        @remove="removeTheme(themeIndex)"
        @add-question="addQuestion(theme)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'
import RoundTabs from './RoundTabs.vue'
import ThemeCard from './ThemeCard.vue'

defineProps<{
  rounds: any[]
  currentRoundIndex: number
  currentRound: any | null
  addTheme: () => void
  removeTheme: (index: number) => void
  addQuestion: (theme: any) => void
  onAcceptedAnswersInput: (event: Event, question: any) => void
}>()

defineEmits<{
  (e: 'setRoundIndex', index: number): void
}>()
</script>

