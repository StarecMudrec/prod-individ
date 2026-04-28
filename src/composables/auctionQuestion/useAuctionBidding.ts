import type { AuctionBiddingDeps } from './auctionBiddingTypes'
import { initializeAuction, finishAuction, advanceToNextBidder } from './auctionBiddingFlow'
import { makeBid, passBid } from './auctionBiddingActions'

export function createAuctionBiddingHandlers(deps: AuctionBiddingDeps) {
  return {
    initializeAuction: () => initializeAuction(deps),
    makeBid: (bid?: number) => makeBid(deps, bid),
    passBid: () => passBid(deps),
    finishAuction: () => finishAuction(deps),
    advanceToNextBidder: () => advanceToNextBidder(deps),
  }
}

