<template>
  <div class="question flex h-screen max-h-screen min-h-0 flex-col items-center justify-center overflow-y-auto">
    <NormalQuestionMainContent
      :timer-class="timerClass"
      :time-remaining="timeRemaining"
      :current-question="currentQuestion"
      :game-store="gameStore"
      :settings-store="settingsStore"
      :can-answer="canAnswer"
      :is-submitting-answer="isSubmittingAnswer"
      :input-status="inputStatus"
      v-model:answer="answer"
      :answer-max-length="ANSWER_MAX_LENGTH"
      @submit-answer="submitAnswer"
    />

    <NormalQuestionKeyboardHint
      :game-store="gameStore"
      :format-key-display="formatKeyDisplay"
    />

    <NormalQuestionModals
      v-model:show-answering-modal="showAnsweringModal"
      v-model:show-timeout-modal="showTimeoutModal"
      v-model:show-all-wrong-modal="showAllWrongModal"
      :show-result-modal="showResultModal"
      :answering-player-name="answeringPlayerName"
      :result-data="resultData"
      @close-result="closeResultModal"
      @close-all-wrong="closeAllWrongModal"
    />
  </div>
</template>

<script setup lang="ts">
  import NormalQuestionMainContent from '@/components/game/normalQuestion/NormalQuestionMainContent.vue'
  import NormalQuestionKeyboardHint from '@/components/game/normalQuestion/NormalQuestionKeyboardHint.vue'
  import NormalQuestionModals from '@/components/game/normalQuestion/NormalQuestionModals.vue'
  import { useNormalQuestion } from '@/composables/useNormalQuestion'

  const {
    gameStore,
    settingsStore,
    currentQuestion,
    timerClass,
    timeRemaining,
    answer,
    canAnswer,
    inputStatus,
    isSubmittingAnswer,
    showAnsweringModal,
    showTimeoutModal,
    showAllWrongModal,
    answeringPlayerName,
    showResultModal,
    resultData,
    closeResultModal,
    closeAllWrongModal,
    ANSWER_MAX_LENGTH,
    formatKeyDisplay,
    submitAnswer,
  } = useNormalQuestion()
</script>

<style scoped src="./NormalQuestionView.css"></style>
