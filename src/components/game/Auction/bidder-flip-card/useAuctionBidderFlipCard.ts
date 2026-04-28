import { computed, onMounted, ref, watch } from 'vue'
import type { Player } from '@/types'

export function useAuctionBidderFlipCard(props: {
  players: Player[]
  currentBidderIndex: number
  bidInput: number
  minBid: number
  inputMax?: number
  makeBid: (bid?: number) => void
  passBid: () => void
}) {
  const FLIP_DURATION_MS = 500
  const shouldFlip = ref(false)
  const frontPlayer = ref<Player | null>(null)
  const backPlayer = ref<Player | null>(null)
  const lastIndex = ref<number | null>(null)
  const localBidInput = ref(props.bidInput)

  const currentBidder = computed(() => {
    const idx = props.currentBidderIndex
    if (idx < 0 || !props.players.length) return null
    return props.players[idx] ?? null
  })

  const bidValidation = computed(() => {
    const value = localBidInput.value
    const player = currentBidder.value
    if (!player || !Number.isFinite(value)) {
      return { valid: false, error: '' }
    }
    const truncated = Math.trunc(value)
    if (truncated > player.score) {
      return {
        valid: false,
        error: `Недостаточно очков. Максимум: ${player.score}`,
      }
    }
    if (truncated < props.minBid) {
      return { valid: false, error: `Минимальная ставка: ${props.minBid}` }
    }
    return { valid: true, error: '' }
  })

  const bidError = computed(() => bidValidation.value.error)
  const isBidValid = computed(() => bidValidation.value.valid)
  const frontPlayerName = computed(() => frontPlayer.value?.name ?? '')
  const backPlayerName = computed(() => backPlayer.value?.name ?? '')

  function submitBid(bid: number) {
    if (!isBidValid.value) return
    const value = Math.trunc(bid)
    if (!Number.isFinite(value)) return
    props.makeBid(value)
  }

  function getNextEnabledIndex(index: number): number | null {
    const { players, minBid } = props
    if (!players.length) return null
    let attempts = 0
    let nextIndex = index
    while (attempts < players.length) {
      nextIndex = (nextIndex + 1) % players.length
      const player = players[nextIndex]
      if (player && player.score >= minBid) return nextIndex
      attempts++
    }
    return null
  }

  function syncFacesInitial() {
    if (!props.players.length) {
      frontPlayer.value = null
      backPlayer.value = null
      lastIndex.value = null
      return
    }
    const initialIndex = props.currentBidderIndex ?? 0
    const normalizedIndex = Math.min(
      Math.max(initialIndex, 0),
      Math.max(props.players.length - 1, 0)
    )
    frontPlayer.value = props.players[normalizedIndex] ?? null
    const nextIndex = getNextEnabledIndex(normalizedIndex)
    backPlayer.value = nextIndex !== null ? props.players[nextIndex] ?? null : null
    lastIndex.value = normalizedIndex
  }

  function handleFlipComplete() {
    if (lastIndex.value === null || !props.players.length) {
      shouldFlip.value = false
      return
    }
    const currentIndex = props.currentBidderIndex
    const normalizedIndex = Math.min(
      Math.max(currentIndex, 0),
      Math.max(props.players.length - 1, 0)
    )
    frontPlayer.value = props.players[normalizedIndex] ?? null
    const nextIndex = getNextEnabledIndex(normalizedIndex)
    backPlayer.value = nextIndex !== null ? props.players[nextIndex] ?? null : null
    lastIndex.value = normalizedIndex
    shouldFlip.value = false
  }

  onMounted(() => {
    syncFacesInitial()
  })

  watch(
    () => props.bidInput,
    (value) => {
      localBidInput.value = value
    }
  )
  watch(
    () => props.currentBidderIndex,
    (newIndex, oldIndex) => {
      if (!props.players.length) return
      if (lastIndex.value === null) {
        syncFacesInitial()
        return
      }
      if (newIndex === oldIndex) return
      shouldFlip.value = true
    }
  )
  watch(
    () => props.players,
    () => {
      shouldFlip.value = false
      syncFacesInitial()
    },
    { deep: true }
  )
  return {
    FLIP_DURATION_MS,
    shouldFlip,
    frontPlayer,
    backPlayer,
    frontPlayerName,
    backPlayerName,
    localBidInput,
    bidError,
    isBidValid,
    submitBid,
    handleFlipComplete,
  }
}