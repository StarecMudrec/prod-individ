<template>
  <div class="auction-bidding-phase">
    <AuctionBiddingIntroModal
      v-model="showIntroModalModel"
      :current-question="currentQuestion"
    />

    <AuctionBiddingWinnerModal
      v-model="showWinnerModalModel"
      :auction-winner="auctionWinner"
      :auction-winner-bid="auctionWinnerBid"
    />

    <p class="mt-4 mb-2 text-text text-center font-rampart text-4xl tracking-tight-less-negative text-stroke-0-5">
      Текущая лучшая ставка :
    </p>
    <p class="mb-4 text-text font-rampart text-5xl text-center text-stroke-0-5">
      <AnimatedScore :to="currentBid">
        <template #default="{ animatedValue }">{{ animatedValue }}pts.</template>
      </AnimatedScore>
    </p>

    <div class="relative">
      <div class="flex flex-col items-center w-full max-w-[52rem] mx-auto">
        <div class="mb-2 text-text text-xl text-center">
          Номинал вопроса:
          <TextWave
            :text="currentQuestion.cost + 'pts.'"
            base-class="font-semibold font-rampart text-2xl"
          />
        </div>

        <AuctionBiddersList
          :sorted-players-for-display="sortedPlayersForDisplay"
          :get-auction-bid="getAuctionBid"
          :auction-winner="auctionWinner"
          :is-player-disabled="isPlayerDisabled"
          :is-auction-winner="isAuctionWinner"
        />

        <AuctionBidderFlipCard
          v-if="players.length"
          :players="players"
          :current-bidder-index="currentBidderIndex"
          :bid-input="bidInput"
          :min-bid="minBid"
          :input-max="inputMax"
          :only-all-in-beats="onlyAllInBeats"
          :is-processing="isProcessing"
          :make-bid="makeBid"
          :pass-bid="passBid"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '@/types'
import { TextWave } from '@/components/ui'
import AnimatedScore from '@/components/game/AnimatedScore.vue'
import AuctionBiddingIntroModal from './AuctionBiddingIntroModal.vue'
import AuctionBiddingWinnerModal from './AuctionBiddingWinnerModal.vue'
import AuctionBiddersList from './AuctionBiddersList.vue'
import AuctionBidderFlipCard from '../bidder-flip-card/AuctionBidderFlipCard.vue'
import { useAuctionBiddingDisplay } from './useAuctionBiddingDisplay'
import './auction-bidding-phase.css'

const props = defineProps<{
  currentQuestion: { themeTitle: string; cost: number }
  players: Player[]
  passedPlayerIds: string[]
  questionChooserId: string | null
  currentBidderIndex: number
  bidInput: number
  minBid: number
  inputMax?: number
  onlyAllInBeats?: boolean
  isProcessing: boolean
  showIntroModal: boolean
  auctionWinner?: Player | null
  auctionWinnerBid?: number
  showWinnerModal?: boolean
  getAuctionBid: (playerId: string) => number
  makeBid: (bid?: number) => void
  passBid: () => void
}>()

const emit = defineEmits<{
  'update:showIntroModal': [value: boolean]
  'update:showWinnerModal': [value: boolean]
}>()

const showIntroModalModel = computed({
  get: () => props.showIntroModal,
  set: (value: boolean) => emit('update:showIntroModal', value),
})

const showWinnerModalModel = computed({
  get: () => !!props.showWinnerModal,
  set: (value: boolean) => emit('update:showWinnerModal', value),
})

const {
  currentBid,
  isPlayerDisabled,
  isAuctionWinner,
  sortedPlayersForDisplay,
} = useAuctionBiddingDisplay(props)
</script>
