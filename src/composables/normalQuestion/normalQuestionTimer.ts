import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { createNormalQuestionState } from './normalQuestionState'

type Ctx = ReturnType<typeof createNormalQuestionState>

function startTimer(ctx: Ctx, timeoutMs: number) {
  if (ctx.timerInterval.value) {
    clearInterval(ctx.timerInterval.value)
  }
  ctx.timeRemaining.value = timeoutMs
  ctx.timerInterval.value = window.setInterval(() => {
    ctx.timeRemaining.value -= 100
    if (ctx.timeRemaining.value <= 0) {
      stopTimer(ctx.timerInterval)
      handleTimeout(ctx)
    }
  }, 100)
}

function stopTimer(timerInterval: Ref<number | null>) {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

function handleTimeout(ctx: Ctx) {
  const questionId = ctx.gameStore.currentQuestionId
  if (questionId) {
    ctx.questionsStore.markQuestionAsPlayed(questionId)
  }
  ctx.showTimeoutModal.value = true
  setTimeout(() => {
    ctx.showTimeoutModal.value = false
    setTimeout(() => returnToBoard(ctx), 450)
  }, 1500)
}

function handleKeyPress(ctx: Ctx, event: KeyboardEvent) {
  const target = event.target as HTMLElement
  const isTyping =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  if (isTyping) return

  if (ctx.gameStore.activePlayer) return

  const key = event.code
  const player = ctx.gameStore.players.find((p) => p.key === key)

  if (player && !ctx.gameStore.hasPlayerAnswered(player.id)) {
    ctx.gameStore.setActivePlayer(player.id)
    ctx.answeringPlayerName.value = player.name
    ctx.showAnsweringModal.value = true
    setTimeout(() => {
      ctx.showAnsweringModal.value = false
    }, 1500)
  }
}

function returnToBoard(ctx: Ctx) {
  stopTimer(ctx.timerInterval)
  ctx.gameStore.setPhase('round-board')
  ctx.gameStore.setActivePlayer(null)
  ctx.router.push('/board')
}

export function setupNormalQuestionTimer(ctx: Ctx, timeoutMs: number) {
  const keyHandler = (event: KeyboardEvent) => handleKeyPress(ctx, event)

  onMounted(() => {
    startTimer(ctx, timeoutMs)
    window.addEventListener('keydown', keyHandler)
  })

  onUnmounted(() => {
    stopTimer(ctx.timerInterval)
    window.removeEventListener('keydown', keyHandler)
  })

  watch(
    [ctx.showAnsweringModal, ctx.showResultModal],
    ([answering, result]) => {
      if (answering || result) {
        stopTimer(ctx.timerInterval)
      }
    }
  )

  return {
    startTimer: () => startTimer(ctx, timeoutMs),
    stopTimer: () => stopTimer(ctx.timerInterval),
    returnToBoard: () => returnToBoard(ctx),
  }
}

