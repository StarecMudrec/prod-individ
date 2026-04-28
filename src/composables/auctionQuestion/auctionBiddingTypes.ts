import type { ComputedRef, Ref } from 'vue'
import type { Router } from 'vue-router'
import type { Player } from '@/types'

export interface AuctionBiddingDeps {
  router: Router
  gameStore: any
  currentQuestion: ComputedRef<any>
  auctionPhase: Ref<'bidding' | 'answering'>
  biddingPlayers: Ref<Player[]>
  currentBidderIndex: Ref<number>
  bidInput: Ref<number>
  bestBid: Ref<number>
  bestBidderId: Ref<string | null>
  isProcessing: Ref<boolean>
  currentBidder: ComputedRef<Player | null>
  showWinnerModal: Ref<boolean>
  passedPlayerIds: Ref<string[]>
}

