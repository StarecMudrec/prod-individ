<template>
  <div v-if="frontPlayer" class="auction-bidder-flip-card">
    <FlipRevealBox
      :delay="0"
      :duration="FLIP_DURATION_MS"
      axis="x"
      :visible="shouldFlip"
      class="w-full"
      @flipComplete="handleFlipComplete"
    >
      <template #back>
        <AuctionBidderFlipCardFace
          :player-name="frontPlayerName"
          :model-value="localBidInput"
          :min-bid="minBid"
          :input-max="inputMax"
          :only-all-in-beats="onlyAllInBeats"
          :is-processing="isProcessing"
          :is-bid-valid="isBidValid"
          :bid-error="bidError"
          @update:model-value="localBidInput = $event"
          @submit-bid="(bid: number) => submitBid(bid)"
          @all-in="makeBid(frontPlayer?.score ?? 0)"
          @pass="passBid"
        />
      </template>

      <AuctionBidderFlipCardFace
        :player-name="backPlayerName"
        :model-value="localBidInput"
        :min-bid="minBid"
        :input-max="inputMax"
        :only-all-in-beats="onlyAllInBeats"
        :is-processing="isProcessing"
        :is-bid-valid="isBidValid"
        :bid-error="bidError"
        @update:model-value="localBidInput = $event"
        @submit-bid="(bid: number) => submitBid(bid)"
        @all-in="makeBid(frontPlayer?.score ?? 0)"
        @pass="passBid"
      />
    </FlipRevealBox>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@/types'
import { FlipRevealBox } from '@/components/ui'
import AuctionBidderFlipCardFace from './AuctionBidderFlipCardFace.vue'
import { useAuctionBidderFlipCard } from './useAuctionBidderFlipCard'
import './auction-bidder-flip-card.css'

const props = defineProps<{
  players: Player[]
  currentBidderIndex: number
  bidInput: number
  minBid: number
  inputMax?: number
  onlyAllInBeats?: boolean
  isProcessing: boolean
  makeBid: (bid?: number) => void
  passBid: () => void
}>()

const {
  FLIP_DURATION_MS,
  shouldFlip,
  frontPlayer,
  frontPlayerName,
  backPlayerName,
  localBidInput,
  bidError,
  isBidValid,
  submitBid,
  handleFlipComplete,
} = useAuctionBidderFlipCard(props)
</script>
