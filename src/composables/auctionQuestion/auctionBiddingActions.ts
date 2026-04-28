import type { Player } from '@/types'
import type { AuctionBiddingDeps } from './auctionBiddingTypes'
import { advanceToNextBidder, finishAuction } from './auctionBiddingFlow'

export function canMakeBid(deps: AuctionBiddingDeps, player: Player, bid: number): boolean {
  const { currentQuestion, bestBid, bestBidderId, gameStore } = deps

  const nominal = currentQuestion.value.cost

  if (bid < nominal) return false
  if (bid <= bestBid.value) return false
  if (bid > player.score) return false

  const isAllIn = bid === player.score
  const bestBidder = bestBidderId.value
    ? gameStore.players.find((p: Player) => p.id === bestBidderId.value)
    : null
  const bestBidIsAllIn =
    bestBidder != null &&
    bestBid.value > 0 &&
    gameStore.getAuctionBid(bestBidder.id) === bestBidder.score

  // Ва-банк можно перебить только другим ва-банком (ставка на весь счёт).
  if (bestBidIsAllIn && !isAllIn) return false
  if (bestBidIsAllIn && isAllIn && player.score <= bestBid.value) return false

  return true
}

export function makeBid(deps: AuctionBiddingDeps, bid?: number) {
  const {
    currentBidder,
    bidInput,
    isProcessing,
    bestBid,
    bestBidderId,
    gameStore,
    biddingPlayers,
    passedPlayerIds,
  } = deps

  if (isProcessing.value) return
  if (!currentBidder.value) return

  const player = currentBidder.value
  const bidValue = bid ?? bidInput.value

  if (!Number.isFinite(bidValue)) return

  const intBid = Math.trunc(bidValue)

  if (!canMakeBid(deps, player, intBid)) return

  isProcessing.value = true

  bestBid.value = intBid
  bestBidderId.value = player.id
  gameStore.setAuctionBid(player.id, intBid)

  const isAllIn = intBid === player.score

  if (isAllIn) {
    const canOverride = biddingPlayers.value.some(
      (p: Player) => p.id !== player.id && p.score > intBid,
    )
    if (!canOverride) {
      finishAuction(deps)
      return
    }
  } else {
    // Ставка не ва-банк: проверяем, может ли кто-то ещё перебить (не пасовал и имеет достаточно очков)
    const canAnyoneOutbid = biddingPlayers.value.some(
      (p: Player) =>
        p.id !== player.id &&
        !passedPlayerIds.value.includes(p.id) &&
        p.score > intBid,
    )
    if (!canAnyoneOutbid) {
      finishAuction(deps)
      return
    }
  }

  isProcessing.value = false
  advanceToNextBidder(deps)
}

export function passBid(deps: AuctionBiddingDeps) {
  const {
    currentBidder,
    isProcessing,
    biddingPlayers,
    currentQuestion,
    bestBid,
    bestBidderId,
    bidInput,
    passedPlayerIds,
  } = deps

  if (isProcessing.value) return
  if (!currentBidder.value) return

  isProcessing.value = true

  const player = currentBidder.value
  const playerId = player.id

  if (!passedPlayerIds.value.includes(playerId)) {
    passedPlayerIds.value = [...passedPlayerIds.value, playerId]
  }

  const activeBidders = biddingPlayers.value.filter(
    (p: Player) => !passedPlayerIds.value.includes(p.id),
  )

  if (activeBidders.length === 0) {
    isProcessing.value = false
    finishAuction(deps)
    return
  }

  if (activeBidders.length === 1) {
    const soleRemaining = activeBidders[0]
    if (bestBid.value > 0 && bestBidderId.value) {
      isProcessing.value = false
      finishAuction(deps)
      return
    }
    // One player left with no prior bid: they win at nominal
    bestBidderId.value = soleRemaining.id
    bestBid.value = 0
    isProcessing.value = false
    finishAuction(deps)
    return
  }

  bidInput.value = currentQuestion.value.cost
  isProcessing.value = false
  advanceToNextBidder(deps)
}

