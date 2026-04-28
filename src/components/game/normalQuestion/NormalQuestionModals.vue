<template>
  <div>
    <ModalFullscreenSpin
      :model-value="props.showAnsweringModal"
      @update:model-value="handleUpdateShowAnsweringModal"
    >
      <div
        id="modal-spin-title"
        class="text-center text-2xl font-bold text-text flex flex-col justify-center gap-2 mb-3 w-full min-w-0"
      >
        <p>
          Отвечает: 
        </p>
        <div class="w-full min-w-0 overflow-hidden text-center">
          <div ref="fittyParentEl" class="fitty-parent w-full">
            <p ref="modalPlayerNameEl" class="font-rampart fitty-name mx-auto pt-3 pb-8">
              {{ props.answeringPlayerName }}
            </p>
          </div>
        </div>
      </div>
    </ModalFullscreenSpin>
    <ModalFullscreenSpin
      :model-value="props.showTimeoutModal"
      @update:model-value="handleUpdateShowTimeoutModal"
    >
      <div
        id="modal-timeout-title"
        class="text-center text-5xl font-bold font-rampart tracking-tight-less-negative pb-3 text-text"
      >
        Время  вышло !
      </div>
    </ModalFullscreenSpin>
    <ModalFullscreen
      :model-value="props.showAllWrongModal"
      no-pulse
      @update:model-value="handleUpdateShowAllWrongModal"
    >
      <div class="flex flex-col items-center gap-6">
        <p class="mb-2 text-center text-5xl font-normal font-rampart text-error text-stroke-1-5 text-shadow-sm">
          <span class="tracking-tight-less-negative">Все  ответили  неправильно  </span> :(
        </p>
        <AppButton @click="emit('close-all-wrong')">
          Продолжить
        </AppButton>
      </div>
    </ModalFullscreen>
    <AnswerResultModal
      v-if="props.showResultModal && props.resultData"
      :is-correct="props.resultData.isCorrect"
      :previous-score="props.resultData.previousScore"
      :current-score="props.resultData.currentScore"
      :player-name="props.resultData.playerName"
      :points-delta="props.resultData.pointsDelta"
      @close="emit('close-result')"
    />
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onUnmounted, ref, watch } from 'vue'
  import fitty, { type FittyInstance } from 'fitty'
  import { AppButton, ModalFullscreen, ModalFullscreenSpin } from '@/components/ui'
  import { AnswerResultModal } from '@/components/game'

  type ResultData = {
    isCorrect: boolean
    previousScore: number
    currentScore: number
    playerName: string
    pointsDelta: number
  }

  const props = defineProps<{
    showAnsweringModal: boolean
    showTimeoutModal: boolean
    showAllWrongModal: boolean
    showResultModal: boolean
    answeringPlayerName: string
    resultData: ResultData | null
  }>()
  const emit = defineEmits<{
    (e: 'update:showAnsweringModal', value: boolean): void
    (e: 'update:showTimeoutModal', value: boolean): void
    (e: 'update:showAllWrongModal', value: boolean): void
    (e: 'close-result'): void
    (e: 'close-all-wrong'): void
  }>()
  const handleUpdateShowAnsweringModal = (value: boolean) => { emit('update:showAnsweringModal', value) }
  const handleUpdateShowTimeoutModal = (value: boolean) => { emit('update:showTimeoutModal', value) }
  const handleUpdateShowAllWrongModal = (value: boolean) => { emit('update:showAllWrongModal', value) }
  const modalPlayerNameEl = ref<HTMLElement | null>(null)
  const fittyParentEl = ref<HTMLElement | null>(null)

  let fittyInstance: FittyInstance | null = null
  let fittyResizeObserver: ResizeObserver | null = null
  let fittyCleanupTimeout: number | null = null

  function cleanupFitty() {
    if (fittyResizeObserver) {
      fittyResizeObserver.disconnect()
      fittyResizeObserver = null
    }
    if (fittyInstance) {
      fittyInstance.unsubscribe()
      fittyInstance = null
    }
  }
  watch(
    () => props.showAnsweringModal,
    (visible) => {
      if (visible) {
        if (fittyCleanupTimeout !== null) {
          clearTimeout(fittyCleanupTimeout)
          fittyCleanupTimeout = null
        }
        nextTick(() => {
          cleanupFitty()
          if (modalPlayerNameEl.value && fittyParentEl.value) {
            fittyInstance = fitty(modalPlayerNameEl.value, {
              minSize: 20,
              maxSize: 72,
              multiLine: true,
            })
            fittyResizeObserver = new ResizeObserver(() => {
              fittyInstance?.fit()
            })
            fittyResizeObserver.observe(fittyParentEl.value)
            requestAnimationFrame(() => {
              fittyInstance?.fit()
            })
          }
        })
      } else {
        fittyCleanupTimeout = window.setTimeout(() => {
          fittyCleanupTimeout = null
          cleanupFitty()
        }, 400)
      }
    }
  )
  onUnmounted(() => {
    if (fittyCleanupTimeout !== null) {
      clearTimeout(fittyCleanupTimeout)
      fittyCleanupTimeout = null
    }
    cleanupFitty()
  })
</script>