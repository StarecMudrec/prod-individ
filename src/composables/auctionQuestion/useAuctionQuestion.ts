import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuctionQuestionState } from './useAuctionQuestionState'
import { createAuctionBiddingHandlers } from './useAuctionBidding'
import { createAuctionAnswerHandlers } from './useAuctionAnswer'

export function useAuctionQuestion() {
  const router = useRouter()
  const {
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
  } = useAuctionQuestionState()

  const { initializeAuction, makeBid, passBid } = createAuctionBiddingHandlers({
    router,
    gameStore,
    currentQuestion,
    auctionPhase,
    biddingPlayers,
    currentBidderIndex,
    bidInput,
    bestBid,
    bestBidderId,
    isProcessing,
    currentBidder,
    showWinnerModal,
    passedPlayerIds,
  })

  const { submitAnswer, closeResultModal } = createAuctionAnswerHandlers({
    router,
    gameStore,
    questionsStore,
    currentQuestion,
    answer,
    isSubmittingAnswer,
    showResultModal,
    resultData,
    pendingAction,
  })

  watch(
    () => currentQuestion.value?.type,
    () => {
      if (currentQuestion.value?.type !== 'auction') return

      if (gameStore.auctionWinnerId) {
        auctionPhase.value = 'answering'
        return
      }

      if (auctionPhase.value === 'bidding') {
        initializeAuction()
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    if (currentQuestion.value?.type !== 'auction') return

    if (gameStore.auctionWinnerId) {
      auctionPhase.value = 'answering'
    } else {
      initializeAuction()
    }
  })

  watch(
    () => showWinnerModal.value,
    (visible, wasVisible) => {
      if (!visible && wasVisible && gameStore.auctionWinnerId && auctionPhase.value === 'bidding') {
        auctionPhase.value = 'answering'
      }
    },
  )

  return {
    gameStore,
    currentQuestion,
    auctionPhase,
    biddingPlayers,
    currentBidderIndex,
    currentBidder,
    bidInput,
    isBestBidAllIn,
    minBid,
    inputMax,
    isProcessing,
    answer,
    isSubmittingAnswer,
    showIntroModal,
    showResultModal,
    showWinnerModal,
    resultData,
    auctionWinner,
    auctionWinnerBid,
    passedPlayerIds,
    makeBid,
    passBid,
    submitAnswer,
    closeResultModal,
  }
}

