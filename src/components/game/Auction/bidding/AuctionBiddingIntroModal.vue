<template>
  <ModalFullscreen v-model="open" :no-pulse="true">
    <div>
      <div class="text-center">
        <TextWaveBounce
          text="Аукцион!"
          :char-delay="0.1"
          :duration="1"
          class="mb-2 text-5xl font-rampart text-question-auc-text text-stroke-1"
        />
      </div>
      <div class="mb-8 text-lg text-text-muted text-center">
        Тема: <span class="font-semibold">{{ currentQuestion.themeTitle }}</span>
      </div>
      <div class="mb-1 text-text text-xl text-center">
        Номинал:
        <TextWave
          :text="currentQuestion.cost + 'pts.'"
          base-class="font-semibold font-rampart text-2xl"
        />
      </div>
      <div class="mb-4 text-sm text-text-muted border-dotted border-2 border-surface-darker rounded-md px-4 py-2 bg-surface">
        Игроки по очереди делают ставки. Минимальная ставка — номинал вопроса, максимальная — сумма на счёте игрока.
        Ва-банк (ставка на весь счёт) можно перебить только другим ва-банком.
      </div>
      <div class="flex justify-center">
        <AppButton @click="open = false">
          Начать аукцион
        </AppButton>
      </div>
    </div>
  </ModalFullscreen>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ModalFullscreen, TextWaveBounce, TextWave, AppButton } from '@/components/ui'

const props = defineProps<{
  modelValue: boolean
  currentQuestion: { themeTitle: string; cost: number }
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>
