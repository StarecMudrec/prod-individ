<template>
  <div class="question-content-expand flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4">
    <div class="text-7xl mt-12 font-bold font-rampart" :class="props.timerClass">
      {{ Math.ceil(props.timeRemaining / 1000) }}
    </div>

    <div class="text-xl mb-2 flex items-end flex-row flex-nowrap justify-between px-3 w-full text-shadow-sm">
      <h1 class="text-text">
        {{ props.currentQuestion.themeTitle }}
      </h1>

      <div class="text-text">
        <span class="font-semibold font-rampart">
          {{ props.currentQuestion.cost }}pts.
        </span>
      </div>
    </div>

    <div class="question-container mb-6 rounded-lg border border-surface-dark bg-surface-alt p-6 shadow-sm">
      <p class="font-bold text-2xl text-text text-center">
        {{ props.currentQuestion.text }}
      </p>

      <div
        class="answer-section flex flex-col items-center"
        :class="{ 'answer-section--open': props.gameStore.activePlayer }"
      >
        <Transition name="answer-block">
          <div v-if="props.gameStore.activePlayer" class="answer-block-inner">
            <div class="mb-4 mt-8 rounded-lg answer-block-item flex justify-center">
              <div class="flex flex-row items-center text-text-muted text-xl">
                <p class="font-semibold">
                  Отвечает: 
                </p>
                <p class="font-semibold font-rampart text-2xl">
                  <TextWaveBounce :text="props.gameStore.activePlayer?.name ?? ''" />
                </p>
              </div>
            </div>
            <div class="space-y-4 mb-1 answer-block-item answer-block-item--delay flex flex-col items-center">
              <ElasticTextarea
                :model-value="props.answer"
                :disabled="!props.canAnswer || props.isSubmittingAnswer"
                :error="props.inputStatus === 'error'"
                :maxlength="props.answerMaxLength"
                input-class="w-full rounded-button border-2 border-surface-darker px-4 py-2 text-[17px] text-text font-rampart font-bold placeholder-surface-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                @update:model-value="handleUpdateAnswer"
                @keydown.enter="handleSubmit"
              />
              <AppButton
                :disabled="!props.canAnswer || !props.answer.trim() || props.isSubmittingAnswer"
                @click="handleSubmit"
              >
                Ответить
              </AppButton>
            </div>
          </div>
        </Transition>
      </div>

      <div class="dev-section" :class="{ 'dev-section--open': props.settingsStore.devModeEnabled }">
        <Transition name="dev-mode">
          <div
            v-if="props.settingsStore.devModeEnabled"
            class="dev-section__content mt-4 rounded-md bg-dev-sec p-3 text-sm text-dev-text"
          >
            <span class="font-semibold">Правильный ответ (dev):</span>
            <span class="ml-1">{{ props.currentQuestion.correctAnswer }}</span>
          </div>
        </Transition>
      </div>
    </div>

    <h1
      class="shout-text mb-12 text-8xl font-bold text-text font-rampart tracking-tight-negative text-shadow-sm"
      :class="{ 'shout-text--shrink': props.gameStore.activePlayer }"
    >
      жми !
    </h1>
  </div>
</template>

<script setup lang="ts">
  import { AppButton, ElasticTextarea, TextWaveBounce } from '@/components/ui'

  const props = defineProps<{
    timerClass: string
    timeRemaining: number
    currentQuestion: {
      themeTitle: string
      cost: number
      text: string
      correctAnswer: string
    }
    gameStore: any
    settingsStore: any
    canAnswer: boolean
    isSubmittingAnswer: boolean
    inputStatus: string
    answer: string
    answerMaxLength: number
  }>()

  const emit = defineEmits<{
    (e: 'update:answer', value: string): void
    (e: 'submit-answer'): void
  }>()

  function handleUpdateAnswer(value?: string | null) {
    emit('update:answer', value ?? '')
  }

  function handleSubmit() {
    emit('submit-answer')
  }
</script>

<style scoped src="./NormalQuestionMainContent.css"></style>