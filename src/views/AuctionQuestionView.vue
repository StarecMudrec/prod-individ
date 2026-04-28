<template>
  <div class="question flex min-h-screen flex-col items-center justify-center">
    <!-- Фаза торгов -->
    <AuctionBiddingPhase
      v-if="auctionPhase === 'bidding'"
      v-model:show-intro-modal="showIntroModal"
      v-model:show-winner-modal="showWinnerModal"
      :current-question="currentQuestion"
      :players="biddingPlayers"
      :passed-player-ids="passedPlayerIds"
      :question-chooser-id="gameStore.questionChooserId"
      :current-bidder-index="currentBidderIndex"
      :bid-input="bidInput"
      :min-bid="minBid"
      :input-max="inputMax"
      :only-all-in-beats="isBestBidAllIn"
      :is-processing="isProcessing"
      :auction-winner="auctionWinner"
      :auction-winner-bid="auctionWinnerBid"
      :get-auction-bid="gameStore.getAuctionBid"
      :make-bid="makeBid"
      :pass-bid="passBid"
    />

    <!-- Фаза ответа -->
    <AuctionAnswerPhase
      v-else
      v-model:answer="answer"
      :current-question="currentQuestion"
      :auction-winner="auctionWinner"
      :auction-winner-bid="auctionWinnerBid"
      :is-submitting-answer="isSubmittingAnswer"
      :dev-mode-enabled="settingsStore.devModeEnabled"
      :submit-answer="submitAnswer"
    />

    <AnswerResultModal
      v-if="showResultModal && resultData"
      :is-correct="resultData.isCorrect"
      :previous-score="resultData.previousScore"
      :current-score="resultData.currentScore"
      :player-name="resultData.playerName"
      :points-delta="resultData.pointsDelta"
      @close="closeResultModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { useSettingsStore } from '@/stores'
  import { AnswerResultModal, AuctionBiddingPhase, AuctionAnswerPhase } from '@/components/game'
  import { useAuctionQuestion } from '@/composables/auctionQuestion'

  const settingsStore = useSettingsStore()

  const {
    gameStore,
    currentQuestion,
    auctionPhase,
    biddingPlayers,
    currentBidderIndex,
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
  } = useAuctionQuestion()
</script>
