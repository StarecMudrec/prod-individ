<template>
  <ModalFullscreen :model-value="true" fullscreen @update:model-value="() => handleClose()">
    <div class="relative flex h-full w-full flex-col items-center justify-center overflow-auto">
      <div class="text-center">
        <h1
          class="mb-10 mt-10 text-6xl font-bold font-rampart text-stroke-thin tracking-tight-less-negative text-shadow-sm"
          :class="isCorrect ? 'text-success' : 'text-error'"
        >
          {{ isCorrect ? 'Правильно !' : 'Неправильно !' }}
        </h1>
      </div>

      <div class="mb-6 text-center flex flex-row items-end gap-3">
        <p class="text-3xl">
          Счёт:
        </p>
        <AnimatedScore
          :from="props.previousScore"
          :to="props.currentScore"
          v-slot="{ animatedValue }"
        >
          <div
            class="text-5xl font-semibold font-rampart text-stroke-thin"
            :class="animatedValue >= 0 ? 'text' : 'text-error'"
          >
            {{ animatedValue }}
          </div>
        </AnimatedScore>
      </div>

      <!-- Кнопка продолжения -->
      <AppButton @click="handleClose">
        Продолжить
      </AppButton>
      <div class="mb-1"></div>
    </div>
  </ModalFullscreen>
</template>

<script setup lang="ts">
  import { AppButton, ModalFullscreen } from '@/components/ui'
  import AnimatedScore from './AnimatedScore.vue'

  const props = defineProps<{
    isCorrect: boolean
    previousScore: number
    currentScore: number
    playerName: string
    pointsDelta: number
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  function handleClose() {
    emit('close')
  }
</script>
