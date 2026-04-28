import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'
import {
  PLAYER_KEYS,
  PLAYER_NAME_MIN_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  formatKeyDisplay,
} from '@/lib/constants'
import type { Player } from '@/types'

export function useGameStart() {
  const router = useRouter(),
    route = useRoute(),
    gameStore = useGameStore()
  const showSetupModals = ref(false),
    modalOpen = ref(false),
    playerCount = ref(3),
    currentPlayerIndex = ref(0),
    names = ref<string[]>([]),
    errors = ref<string[]>([]),
    isFinishingSetup = ref(false),
    showKeyChangeModal = ref(false),
    keyOverrides = ref<Record<number, { key: string; display: string }>>({})
  const playerKeysForCount = computed(() => PLAYER_KEYS.slice(0, playerCount.value))
  const currentPlayerKey = computed(
    () =>
      keyOverrides.value[currentPlayerIndex.value] ??
      playerKeysForCount.value[currentPlayerIndex.value],
  )
  const optimalCols = computed(() => {
    const n = gameStore.players.length
    if (n <= 0) return 1
    if (n <= 3) return n
    if (n === 4) return 2
    return 3
  })
  const playerCardStyle = computed(() => {
    const cols = optimalCols.value,
      gapRem = 1
    return { flex: `0 0 calc((100% - ${(cols - 1) * gapRem}rem) / ${cols})` }
  })
  const showContent = computed(
    () =>
      !showSetupModals.value || (isFinishingSetup.value && !modalOpen.value),
  )
  const validateName = (index: number): string => {
    const name = names.value[index]?.trim() ?? ''
    if (name.length < PLAYER_NAME_MIN_LENGTH)
      return (errors.value[index] = 'Введите имя')
    if (name.length > PLAYER_NAME_MAX_LENGTH)
      return (errors.value[index] = `Не более ${PLAYER_NAME_MAX_LENGTH} символов`)
    errors.value[index] = ''
    return ''
  }
  const validateAllUpTo = (index: number): boolean => {
    let valid = true
    for (let i = 0; i <= index; i++) if (validateName(i)) valid = false
    return valid
  }
  const canConfirmCurrent = computed(() => {
    const name = names.value[currentPlayerIndex.value]?.trim() ?? ''
    return (
      name.length >= PLAYER_NAME_MIN_LENGTH &&
      name.length <= PLAYER_NAME_MAX_LENGTH
    )
  })
  const onKeyChangeKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      showKeyChangeModal.value = false
      return
    }
    const key = e.code || e.key
    const display = formatKeyDisplay(key)
    keyOverrides.value = {
      ...keyOverrides.value,
      [currentPlayerIndex.value]: { key, display },
    }
    showKeyChangeModal.value = false
  }
  watch(showKeyChangeModal, (open) => {
    if (open) window.addEventListener('keydown', onKeyChangeKeydown, { once: true })
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyChangeKeydown)
  })
  const finishSetup = () => {
    const keys = playerKeysForCount.value,
      overrides = keyOverrides.value
    const players: Player[] = names.value.map((name, i) => ({
      id: crypto.randomUUID(),
      name: name.trim(),
      key: overrides[i]?.key ?? keys[i].key,
      score: 0,
    }))
    gameStore.setPlayers(players)
    setTimeout(() => {
      router.replace({ path: '/game-start', query: {} })
      showSetupModals.value = false
      isFinishingSetup.value = false
    }, 300)
  }
  const confirmPlayer = () => {
    if (!canConfirmCurrent.value || !validateAllUpTo(currentPlayerIndex.value)) return
    const isLastPlayer = currentPlayerIndex.value === playerCount.value - 1
    modalOpen.value = false
    if (!isLastPlayer) {
      currentPlayerIndex.value++
      setTimeout(() => {
        modalOpen.value = true
      }, 0)
    } else {
      isFinishingSetup.value = true
      finishSetup()
    }
  }
  const startGame = () => {
    if (!gameStore.players.length) return
    gameStore.startRound(1)
    gameStore.setPhase('round-board')
    router.push('/board')
  }
  onMounted(() => {
    if (route.query.setup !== 'true' || !route.query.count) return
    const count = parseInt(route.query.count as string, 10)
    if (count < 2 || count > 6) return
    playerCount.value = count
    names.value = Array.from({ length: count }, () => '')
    errors.value = Array.from({ length: count }, () => '')
    currentPlayerIndex.value = 0
    showSetupModals.value = true
    modalOpen.value = true
  })
  watch(
    () => route.query,
    (newQuery) => {
      if (newQuery.setup !== 'true') {
        showSetupModals.value = false
        modalOpen.value = false
        isFinishingSetup.value = false
      }
    },
  )
  return { gameStore, showSetupModals, modalOpen, playerCount, currentPlayerIndex, names, errors, isFinishingSetup, showKeyChangeModal, validateName, currentPlayerKey, playerCardStyle, showContent, canConfirmCurrent, openKeyChangeModal: () => { showKeyChangeModal.value = true }, confirmPlayer, startGame, PLAYER_NAME_MAX_LENGTH }
}