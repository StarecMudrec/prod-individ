import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useQuestionsStore } from '@/stores/questions'
import type { Player } from '@/types'

export function useAuctionQuestionState() {
  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()

  const answer = ref('')
  const auctionPhase = ref<'bidding' | 'answering'>('bidding')
  const biddingPlayers = ref<Player[]>([])
  const currentBidderIndex = ref(0)
  const bidInput = ref<number>(0)
  const bestBid = ref(0)
  const bestBidderId = ref<string | null>(null)
  const isProcessing = ref(false)
  const isSubmittingAnswer = ref(false)
  const showIntroModal = ref(true)
  const showResultModal = ref(false)
  const showWinnerModal = ref(false)
  const resultData = ref<{
    isCorrect: boolean
    previousScore: number
    currentScore: number
    playerName: string
    pointsDelta: number
  } | null>(null)
  const pendingAction = ref<(() => void) | null>(null)
  const passedPlayerIds = ref<string[]>([])

  const currentQuestion = computed(() => {
    if (!gameStore.currentQuestionId) throw new Error('No current question')
    const q = questionsStore.getQuestionById(gameStore.currentQuestionId)
    if (!q) throw new Error('Question not found')
    const overrideCost = gameStore.currentQuestionCellCost
    if (typeof overrideCost === 'number' && Number.isFinite(overrideCost) && overrideCost > 0) {
      return { ...q, cost: overrideCost }
    }
    return q
  })

  const currentBidder = computed(() => {
    if (biddingPlayers.value.length === 0) return null
    return biddingPlayers.value[currentBidderIndex.value % biddingPlayers.value.length]
  })

  const isBestBidAllIn = computed(() => {
    if (!bestBidderId.value || bestBid.value <= 0) return false
    const bestBidder = gameStore.players.find((p) => p.id === bestBidderId.value)
    return (
      bestBidder != null &&
      gameStore.getAuctionBid(bestBidder.id) === bestBidder.score
    )
  })

  const minBid = computed(() => {
    const nominal = currentQuestion.value.cost
    const bidder = currentBidder.value
    // Ва-банк можно перебить только ва-банком; единственная допустимая ставка — весь счёт.
    if (isBestBidAllIn.value && bidder && bidder.score > bestBid.value) {
      return bidder.score
    }
    return bestBid.value > 0 ? bestBid.value + 1 : nominal
  })

  const inputMax = computed(() => {
    const bidder = currentBidder.value
    if (!bidder) return undefined
    if (bidder.score >= minBid.value) {
      return bidder.score
    }
    return minBid.value
  })

  const auctionWinner = computed(() => {
    if (!gameStore.auctionWinnerId) return null
    return gameStore.players.find((p) => p.id === gameStore.auctionWinnerId) ?? null
  })

  const auctionWinnerBid = computed(() => {
    if (!gameStore.auctionWinnerId) return 0
    return gameStore.getAuctionBid(gameStore.auctionWinnerId)
  })

  return {
    gameStore,
    questionsStore,
    answer,
    auctionPhase,
    biddingPlayers,
    currentBidderIndex,
    bidInput,
    bestBid,
    bestBidderId,
    isProcessing,
    isSubmittingAnswer,
    showIntroModal,
    showResultModal,
    showWinnerModal,
    resultData,
    pendingAction,
    currentQuestion,
    currentBidder,
    isBestBidAllIn,
    minBid,
    inputMax,
    auctionWinner,
    auctionWinnerBid,
    passedPlayerIds,
  }
}

