import { computed } from 'vue'
import type { Player } from '@/types'

export function useAuctionBiddingDisplay(props: {
  players: Player[]
  passedPlayerIds: string[]
  currentBidderIndex: number
  getAuctionBid: (playerId: string) => number
  auctionWinner?: Player | null
}) {
  const currentBid = computed(() => {
    if (!props.players.length) return 0
    const bids = props.players.map((p) => props.getAuctionBid(p.id))
    return Math.max(0, ...bids)
  })

  const isPlayerDisabled = (player: Player) => {
    if (props.passedPlayerIds?.includes(player.id)) return true
    const playerBid = props.getAuctionBid(player.id)
    const bestBid = currentBid.value
    const outbid = playerBid < bestBid
    const unableToRaise = player.score <= bestBid
    return outbid && unableToRaise
  }

  const isAuctionWinner = (player: Player) =>
    props.auctionWinner?.id === player.id

  const sortedPlayersForDisplay = computed(() => {
    const players = props.players
    if (!players.length) return []

    const activeIndices: number[] = []
    const disabledPlayers: Player[] = []

    players.forEach((player, index) => {
      if (isPlayerDisabled(player)) {
        disabledPlayers.push(player)
      } else {
        activeIndices.push(index)
      }
    })

    if (!activeIndices.length) {
      return [...disabledPlayers]
    }

    const totalActive = activeIndices.length
    const activeIndexSet = new Set(activeIndices)
    const normalizedCurrentIndex = Math.min(
      Math.max(props.currentBidderIndex ?? 0, 0),
      Math.max(players.length - 1, 0)
    )

    const orderedActive: Player[] = []
    let idx = normalizedCurrentIndex
    let added = 0

    while (added < totalActive) {
      if (activeIndexSet.has(idx)) {
        orderedActive.push(players[idx])
        added += 1
      }
      idx = (idx + 1) % players.length
    }

    return [...orderedActive, ...disabledPlayers]
  })

  return {
    currentBid,
    isPlayerDisabled,
    isAuctionWinner,
    sortedPlayersForDisplay,
  }
}
