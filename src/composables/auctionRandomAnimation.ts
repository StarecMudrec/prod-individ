import type { Ref } from 'vue'
import type { Router } from 'vue-router'
import type { useGameStore } from '@/stores/game'
import type { useQuestionsStore } from '@/stores/questions'

const REDIRECT_DELAY_AFTER_SHAKE_MS = 400
const FLIP_DELAY_MS = 3500
const SHAKE_START_DELAY_MS = 180
const SHAKE_DURATION_MS = 320

export type AuctionRandomAnimationCtx = {
  router: Router
  gameStore: ReturnType<typeof useGameStore>
  questionsStore: ReturnType<typeof useQuestionsStore>
  currentName: Ref<string>
  hasStartedRandom: Ref<boolean>
  shouldFlip: Ref<boolean>
  postFlipActive: Ref<boolean>
  screenShakeActive: Ref<boolean>
  maxNameLength: Ref<number>
  startSymbolTicker: () => void
  stopSymbolTicker: () => void
  flipTimeoutId: { current: number | null }
  shakeStartTimer: { current: number | null }
  shakeEndTimer: { current: number | null }
}

export function startRandomAnimation(ctx: AuctionRandomAnimationCtx) {
  if (ctx.hasStartedRandom.value) return

  ctx.shouldFlip.value = false
  ctx.postFlipActive.value = false
  ctx.screenShakeActive.value = false

  const players = ctx.gameStore.players
  if (!players.length || !ctx.gameStore.currentQuestionId) {
    ctx.router.push('/board')
    return
  }

  const randomIndex = Math.floor(Math.random() * players.length)
  const winner = players[randomIndex]

  ctx.maxNameLength.value = players.reduce(
    (max, p) => Math.max(max, p.name.length),
    1
  )

  const question = ctx.questionsStore.getQuestionById(
    ctx.gameStore.currentQuestionId!
  )
  const overrideCost = ctx.gameStore.currentQuestionCellCost
  const nominal =
    typeof overrideCost === 'number' &&
    Number.isFinite(overrideCost) &&
    overrideCost > 0
      ? overrideCost
      : question?.cost ?? 0

  ctx.gameStore.setAuctionBid(winner.id, nominal)
  ctx.gameStore.setAuctionWinner(winner.id)
  ctx.gameStore.setActivePlayer(winner.id)

  ctx.currentName.value = winner.name
  ctx.hasStartedRandom.value = true

  ctx.startSymbolTicker()

  if (ctx.flipTimeoutId.current !== null) {
    clearTimeout(ctx.flipTimeoutId.current)
  }
  ctx.flipTimeoutId.current = window.setTimeout(() => {
    ctx.shouldFlip.value = true
  }, FLIP_DELAY_MS) as unknown as number
}

export function handleFlipComplete(ctx: AuctionRandomAnimationCtx) {
  ctx.stopSymbolTicker()
  ctx.postFlipActive.value = true

  if (ctx.shakeStartTimer.current) clearTimeout(ctx.shakeStartTimer.current)
  if (ctx.shakeEndTimer.current) clearTimeout(ctx.shakeEndTimer.current)

  ctx.shakeStartTimer.current = window.setTimeout(() => {
    ctx.screenShakeActive.value = true
    ctx.shakeStartTimer.current = null
    ctx.shakeEndTimer.current = window.setTimeout(() => {
      ctx.screenShakeActive.value = false
      ctx.shakeEndTimer.current = null
      window.setTimeout(() => {
        ctx.router.push('/question')
      }, REDIRECT_DELAY_AFTER_SHAKE_MS)
    }, SHAKE_DURATION_MS) as unknown as number
  }, SHAKE_START_DELAY_MS) as unknown as number
}
