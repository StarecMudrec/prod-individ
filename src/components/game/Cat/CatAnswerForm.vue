<template>
  <div class="cat-answer-form-expand max-w-3xl">
    <div class="text-xl mb-2 flex items-end flex-row flex-nowrap justify-between px-3 w-full text-shadow-sm">
      <h1 class="text-text">
        {{ themeTitle }}
      </h1>
      <div class="text-text">
        <span class="font-semibold font-rampart">{{ catBet }}pts.</span>
      </div>
    </div>
    <div class="question-container mb-6 rounded-lg border border-surface-dark bg-surface-alt p-6 shadow-sm">
      <p class="mb-8 font-bold text-2xl text-text text-center">
        {{ questionText }}
      </p>
      <div class="answer-section answer-section--open flex flex-col items-center">
        <div class="answer-block-inner">
          <div class="mb-2 rounded-lg answer-block-item flex justify-center">
            <div class="flex flex-row items-center text-text-muted text-xl">
              <p class="font-semibold">
                Отвечает: 
              </p>
              <p class="font-semibold font-rampart text-2xl">
                <TextWaveBounce :text="answeringPlayerName" />
              </p>
            </div>
          </div>
          <div class="space-y-4 mb-1 answer-block-item answer-block-item--delay flex flex-col items-center">
            <ElasticTextarea
              v-model="answerModel"
              :disabled="isSubmitting"
              :error="inputStatus === 'error'"
              :maxlength="ANSWER_MAX_LENGTH"
              input-class="w-full rounded-button border-2 border-surface-darker px-4 py-2 text-[17px] text-text font-rampart font-bold placeholder-surface-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              @keydown.enter="handleSubmit"
            />
            <AppButton :disabled="!answerModel.trim() || isSubmitting" @click="handleSubmit">
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
            <span class="ml-1">{{ correctAnswer }}</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { AppButton, ElasticTextarea, TextWaveBounce } from '@/components/ui'
  import { ANSWER_MAX_LENGTH } from '@/lib/constants'

  const props = defineProps<{
    modelValue: string
    themeTitle: string
    questionText: string
    catBet: number
    correctAnswer: string
    devModeEnabled: boolean
    isSubmitting: boolean
    answeringPlayerName: string
  }>()
  const emit = defineEmits<{
    'update:modelValue': [value: string]
    submit: []
  }>()
  const answerModel = computed({
    get: () => props.modelValue,
    set: (v: string) => emit('update:modelValue', v),
  })
  const attemptedSubmit = ref(false)
  const inputStatus = computed(() => {
    if (!attemptedSubmit.value) return ''
    return answerModel.value.trim() ? '' : 'error'
  })
  function handleSubmit() {
    if (props.isSubmitting) return
    if (!answerModel.value.trim()) {
      attemptedSubmit.value = true
      return
    }
    emit('submit')
  }
</script>
<style scoped>
.cat-answer-form-expand {
  animation: content-expand 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-origin: center center;
}
@keyframes content-expand {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.question-container {
  transition:
    padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.answer-section {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.answer-section--open {
  max-height: 320px;
}
.dev-section {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.dev-section--open {
  max-height: 120px;
}
.answer-block-item {
  opacity: 0;
  transform: translateY(8px);
  animation: answer-item-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.answer-block-item--delay {
  animation-delay: 0.1s;
}
@keyframes answer-item-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>