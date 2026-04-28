<template>
  <div class="final flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <FinalThemeStep
      v-if="currentStep === 'theme'"
      :theme-title="finalQuestion.themeTitle"
      :theme-progress="themeProgress"
      :remaining-seconds="remainingThemeSeconds"
    />

    <FinalBettingStep
      v-else-if="currentStep === 'betting'"
      :final-players="finalPlayers"
    />

    <CircleReverseTransition>
      <FinalAnswersStep
        v-if="currentStep === 'answers'"
        key="answers"
        :final-players="finalPlayers"
        :theme-title="finalQuestion.themeTitle"
        @show-results="showFinalResults"
      />
        <FinalRevealStep
          v-else-if="currentStep === 'reveal'"
          key="reveal"
          :final-players="finalPlayers"
          :correct-answer="finalQuestion.correctAnswer"
          :accepted-answers="finalQuestion.acceptedAnswers"
          @go-to-results="goToResults"
        />
    </CircleReverseTransition>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useFinalFlow } from '@/composables/useFinalFlow'
  import { useGameStore } from '@/stores/game'
  import { CircleReverseTransition } from '@/components/ui'
  import {
    FinalAnswersStep,
    FinalBettingStep,
    FinalRevealStep,
    FinalThemeStep,
  } from '@/components/final'

  const gameStore = useGameStore()
  const {
    finalQuestion,
    finalPlayers,
    currentStep,
    themeProgress,
    remainingThemeSeconds,
    startThemeTimer,
    goToResults,
    showFinalResults,
  } = useFinalFlow()

  onMounted(() => {
    if (!finalPlayers.value.length) {
      const eligible = gameStore.players.filter((p) => p.score > 0)
      if (!eligible.length) {
        goToResults()
        return
      }
      gameStore.prepareFinal()
    }

    if (currentStep.value === 'theme') {
      startThemeTimer()
    }
  })
</script>
