<template>
  <div class="auction-answer-phase question flex h-screen max-h-screen min-h-0 flex-col items-center justify-center overflow-y-auto">
    <div class="question-content-expand flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4">
      <div class="text-xl mb-2 flex items-center flex-col flex-nowrap px-3 w-full text-shadow-sm">
        <h1 class="text-text font-rampart text-5xl text-stroke-0-5 mb-4 mt-8">
          Вопрос :
        </h1>
        <div class="text-right text-text">
          <div class="text-lg text-text-muted">
            Номинал:
            <span class="font-semibold font-rampart">{{ currentQuestion.cost }} pts.</span>
          </div>
        </div>
      </div>

      <div class="question-container mb-6 rounded-2xl border border-surface-dark bg-surface-alt p-6 shadow-sm">
        <p class="font-bold text-2xl text-text text-center">
          {{ currentQuestion.text }}
        </p>

        <div class="answer-section flex flex-col items-center answer-section--open">
          <div class="answer-block-inner">
            <div class="mb-4 mt-8 rounded-lg answer-block-item flex justify-center">
              <div class="flex flex-row items-center text-text-muted text-xl">
                <p class="font-semibold">
                  Отвечает: 
                </p>
                <p class="font-semibold font-rampart text-2xl">
                  <TextWaveBounce :text="auctionWinner?.name ?? ''" />
                </p>
              </div>
            </div>
            <div class="space-y-4 mb-1 answer-block-item answer-block-item--delay flex flex-col items-center w-full">
              <ElasticTextarea
                v-model="answerModel"
                :disabled="isSubmittingAnswer"
                :maxlength="ANSWER_MAX_LENGTH"
                input-class="w-full rounded-button border-2 border-surface-darker px-4 py-2 text-[17px] text-text font-rampart font-bold placeholder-surface-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                @keydown.enter="submitAnswer"
              />
              <AppButton :disabled="!answerModel.trim() || isSubmittingAnswer" @click="submitAnswer">
                Ответить
              </AppButton>
            </div>
          </div>
        </div>

        <div class="dev-section" :class="{ 'dev-section--open': devModeEnabled }">
          <Transition name="dev-mode">
            <div
              v-if="devModeEnabled"
              class="dev-section__content mt-4 rounded-md bg-dev-sec p-3 text-sm text-dev-text"
            >
              <span class="font-semibold">Правильный ответ (dev):</span>
              <span class="ml-1">{{ currentQuestion.correctAnswer }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppButton, ElasticTextarea, TextWaveBounce } from '@/components/ui'
import { ANSWER_MAX_LENGTH } from '@/lib/constants'
import type { Player } from '@/types'
import './auction-answer-phase.css'

const props = defineProps<{
  currentQuestion: {
    text: string
    correctAnswer: string
    cost: number
  }
  auctionWinner: Player | null
  auctionWinnerBid: number
  answer: string
  isSubmittingAnswer: boolean
  devModeEnabled: boolean
  submitAnswer: () => void
}>()

const emit = defineEmits<{
  'update:answer': [value: string]
}>()

const answerModel = computed({
  get: () => props.answer,
  set: (value: string) => emit('update:answer', value),
})
</script>