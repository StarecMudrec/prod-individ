import type { Player } from '@/types'
import type { AuctionBiddingDeps } from './auctionBiddingTypes'
export function initializeAuction(deps: AuctionBiddingDeps) {
  const {
    gameStore,
    currentQuestion,
    auctionPhase,
    biddingPlayers,
    currentBidderIndex,
    bidInput,
    bestBid,
    bestBidderId,
    isProcessing,
    router,
    passedPlayerIds,
  } = deps
  auctionPhase.value = 'bidding'
  bestBid.value = 0
  bestBidderId.value = null
  isProcessing.value = false
  passedPlayerIds.value = []
  if (gameStore.auctionBids.size > 0 || gameStore.auctionWinnerId) {
    gameStore.clearAuctionState()
  }
  const nominal = currentQuestion.value.cost
  const canSomeoneBid = gameStore.players.some((p: Player) => p.score >= nominal)
  if (!canSomeoneBid) {
    router.push('/auction-random')
    return
  }
  biddingPlayers.value = gameStore.players.filter((p: Player) => p.score >= nominal)
  currentBidderIndex.value = 0
  if (gameStore.questionChooserId) {
    const idx = biddingPlayers.value.findIndex((p: Player) => p.id === gameStore.questionChooserId)
    if (idx >= 0) {
      currentBidderIndex.value = idx
    }
  }
  bidInput.value = nominal
}
export function finishAuction(deps: AuctionBiddingDeps) {
  const {
    router,
    gameStore,
    currentQuestion,
    bestBid,
    bestBidderId,
    isProcessing,
    showWinnerModal,
  } = deps
  if (!bestBidderId.value) {
    // Fallback: winner may have been set only in store (e.g. overbidder) — derive from highest bid
    if (gameStore.auctionBids.size > 0) {
      let maxBid = 0
      let winnerId: string | null = null
      gameStore.auctionBids.forEach((bid: number, playerId: string) => {
        if (bid > maxBid) {
          maxBid = bid
          winnerId = playerId
        }
      })
      if (winnerId) {
        bestBidderId.value = winnerId
        bestBid.value = maxBid
      }
    }
    if (!bestBidderId.value) {
      router.push('/auction-random')
      return
    }
  }
  const nominal = currentQuestion.value.cost
  const winnerId = bestBidderId.value
  const winner = gameStore.players.find((p: Player) => p.id === winnerId)
  if (!winner) return
  const finalBid = bestBid.value > 0 ? bestBid.value : Math.min(winner.score, nominal)
  gameStore.setAuctionBid(winnerId, finalBid)
  gameStore.setAuctionWinner(winnerId)
  gameStore.setActivePlayer(winnerId)
  isProcessing.value = false
  // Сначала игрок подсвечивается в списке (как в финале), затем показываем модалку победителя
  const WINNER_HIGHLIGHT_DELAY_MS = 2500
  setTimeout(() => {
    showWinnerModal.value = true
  }, WINNER_HIGHLIGHT_DELAY_MS)
}
export function advanceToNextBidder(deps: AuctionBiddingDeps) {
  const {
    biddingPlayers,
    currentBidder,
    currentBidderIndex,
    bestBid,
    bestBidderId,
    currentQuestion,
    bidInput,
    gameStore,
    passedPlayerIds,
  } = deps
  if (biddingPlayers.value.length === 0) {
    finishAuction(deps)
    return
  }
  const nominal = currentQuestion.value.cost
  const bestBidder =
    bestBidderId.value != null
      ? gameStore.players.find((p: Player) => p.id === bestBidderId.value)
      : null
  const bestBidIsAllIn =
    bestBidder != null &&
    bestBid.value > 0 &&
    gameStore.getAuctionBid(bestBidder.id) === bestBidder.score
  let attempts = 0
  const total = biddingPlayers.value.length
  let foundBidder = false
  while (attempts < total) {
    currentBidderIndex.value = (currentBidderIndex.value + 1) % total
    const player = currentBidder.value
    if (!player) break
    const hasPassed = passedPlayerIds.value.includes(player.id)
    const canBid = !hasPassed && player.score >= nominal && player.score > bestBid.value
    if (canBid) {
      if (bestBidIsAllIn && player.score > bestBid.value) {
        bidInput.value = player.score
      } else {
        bidInput.value = Math.max(nominal, bestBid.value + 1)
      }
      foundBidder = true
      break
    }
    attempts++
  }
  if (!foundBidder) {
    finishAuction(deps)
  }
}