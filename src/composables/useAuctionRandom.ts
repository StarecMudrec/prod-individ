import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useQuestionsStore } from '@/stores/questions'
import {
  startRandomAnimation,
  handleFlipComplete as runHandleFlipComplete,
  type AuctionRandomAnimationCtx,
} from './auctionRandomAnimation'

const SCORE_SYMBOL_POOL = ['★', '◆', '●', '▲', '■', '♦', '✦', '◎']
const SCORE_SYMBOL_TICK_MS = 90
const INTRO_MODAL_DURATION_MS = 1500

export const FLIP_DURATION_MS = 500

export function useAuctionRandom() {
  const router = useRouter()
  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()

  const currentName = ref('...')
  const showIntroModal = ref(true)
  const hasStartedRandom = ref(false)
  const shouldFlip = ref(false)
  const maxNameLength = ref(1)
  const funnySymbols = ref<string[]>(['?'])
  const postFlipActive = ref(false)
  const screenShakeActive = ref(false)

  const flipTimeoutId = { current: null as number | null }
  const shakeStartTimer = { current: null as number | null }
  const shakeEndTimer = { current: null as number | null }
  let symbolIntervalId: number | null = null
  let introTimeoutId: number | null = null

  function pickRandomSymbol() {
    return SCORE_SYMBOL_POOL[Math.floor(Math.random() * SCORE_SYMBOL_POOL.length)]
  }

  function tickSymbols() {
    funnySymbols.value = Array.from(
      { length: maxNameLength.value },
      pickRandomSymbol
    )
  }

  function startSymbolTicker() {
    if (symbolIntervalId !== null) return
    tickSymbols()
    symbolIntervalId = window.setInterval(tickSymbols, SCORE_SYMBOL_TICK_MS)
  }

  function stopSymbolTicker() {
    if (symbolIntervalId !== null) {
      clearInterval(symbolIntervalId)
      symbolIntervalId = null
    }
  }

  const ctx: AuctionRandomAnimationCtx = {
    router,
    gameStore,
    questionsStore,
    currentName,
    hasStartedRandom,
    shouldFlip,
    postFlipActive,
    screenShakeActive,
    maxNameLength,
    startSymbolTicker,
    stopSymbolTicker,
    flipTimeoutId,
    shakeStartTimer,
    shakeEndTimer,
  }

  function onFlipComplete() {
    runHandleFlipComplete(ctx)
  }

  onMounted(() => {
    introTimeoutId = window.setTimeout(() => {
      showIntroModal.value = false
    }, INTRO_MODAL_DURATION_MS)
  })

  watch(showIntroModal, (visible, wasVisible) => {
    if (!visible && wasVisible) {
      startRandomAnimation(ctx)
    }
  })

  onBeforeUnmount(() => {
    stopSymbolTicker()
    if (introTimeoutId !== null) {
      clearTimeout(introTimeoutId)
    }
    if (flipTimeoutId.current !== null) {
      clearTimeout(flipTimeoutId.current)
    }
    if (shakeStartTimer.current !== null) {
      clearTimeout(shakeStartTimer.current)
      shakeStartTimer.current = null
    }
    if (shakeEndTimer.current !== null) {
      clearTimeout(shakeEndTimer.current)
      shakeEndTimer.current = null
    }
  })

  return {
    currentName,
    showIntroModal,
    hasStartedRandom,
    shouldFlip,
    funnySymbols,
    postFlipActive,
    screenShakeActive,
    handleFlipComplete: onFlipComplete,
  }
}
