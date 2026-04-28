<template>
  <ModalFullscreenSpin v-model="open">
    <div class="flex flex-col items-center text-center">
      <p class="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">
        Результат аукциона
      </p>
      <p class="mb-2 text-4xl font-rampart text-question-auc-text text-stroke-1 tracking-tight-less-negative">
        Победитель  торгов :
      </p>
      <FittyText
        :text="auctionWinner?.name ?? '—'"
        tag="h2"
        fitty-class="mb-4 font-rampart text-text text-stroke-0-5"
        class="text-center"
        :min-size="24"
        :max-size="64"
      />

      <div
        v-if="auctionWinnerBid != null"
        class="mb-4 rounded-xl border-dotted border-2 border-surface-darker bg-surface px-6 py-3"
      >
        <p class="text-lg text-text-muted">
          Выигрышная ставка:
        </p>
        <TextWave
          :text="auctionWinnerBid + ' pts.'"
          base-class="font-semibold font-rampart text-2xl"
        />
      </div>

      <AppButton @click="open = false">
        Продолжить
      </AppButton>
    </div>
  </ModalFullscreenSpin>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '@/types'
import { ModalFullscreenSpin, FittyText, TextWave, AppButton } from '@/components/ui'

const props = defineProps<{
  modelValue: boolean
  auctionWinner?: Player | null
  auctionWinnerBid?: number
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>
