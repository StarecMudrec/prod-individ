<template>
  <div class="mb-4 rounded-2xl bg-surface-alt player-card-skin py-6 px-16">
    <p class="text-text-muted text-xl text-center">
      Ставку делает:
    </p>
    <div class="-mt-3 mb-4 h-16 w-96 flex items-center justify-center">
      <FittyText
        :text="playerName"
        tag="h2"
        fitty-class="font-rampart font-normal text-text"
        class="text-center text-stroke-0-5"
        :min-size="24"
        :max-size="64"
      />
    </div>

    <div class="flex flex-col items-center">
      <NumberInput
        :model-value="modelValue"
        :min="minBid"
        :max="inputMax"
        :step="1"
        :commit-on-blur="false"
        class="max-w-44 flex-1 rounded-lg border border-surface-darker px-4 py-2 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 md:w-auto mb-2"
        :disabled="isProcessing"
        @update:model-value="$emit('update:modelValue', $event)"
      />
      <Transition name="error-message">
        <p v-if="bidError" class="mt-0 mb-2 text-sm text-error">
          {{ bidError }}
        </p>
      </Transition>
    </div>

    <div class="mt-2 flex flex-nowrap items-center justify-center gap-2">
      <AppButton
        :class="{ 'opacity-50 pointer-events-none': onlyAllInBeats }"
        :disabled="isProcessing || !isBidValid || onlyAllInBeats"
        @click.prevent="$emit('submitBid', modelValue)"
      >
        Ставить
      </AppButton>
      <AppButton
        variant="secondary"
        :disabled="isProcessing"
        @click.prevent="$emit('allIn')"
      >
        Ва-банк
      </AppButton>
      <AppButton
        variant="secondary"
        :disabled="isProcessing"
        @click.prevent="$emit('pass')"
      >
        Пас
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton, FittyText, NumberInput } from '@/components/ui'

defineProps<{
  playerName: string
  modelValue: number
  minBid: number
  inputMax?: number
  onlyAllInBeats?: boolean
  isProcessing: boolean
  isBidValid: boolean
  bidError: string
}>()

defineEmits<{
  'update:modelValue': [value: number]
  submitBid: [bid: number]
  allIn: []
  pass: []
}>()
</script>
