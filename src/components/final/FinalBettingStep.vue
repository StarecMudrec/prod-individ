<template>
  <ModalFullscreen v-model="bettingModalOpen">
    <div class="rounded-card flex flex-col border border-surface-dark bg-surface-alt px-6 py-6 shadow-sm">
      <span class="font-normal font-rampart text-text text-stroke-0-5 pt-4 tracking-tight-less-negative text-3xl text-center -mb-2 mt-4">
        Игрок :
      </span>
      <FittyText
        :text="`${currentBettingPlayer?.name ?? ''}`"
        tag="h2"
        fitty-class="font-semibold font-rampart text-text pr-2 pt-3"
        class="text-center"
        :min-size="24"
        :max-size="64"
      />
      <p class="text-center text-2xl text-text-muted mt-4">
        <span class="font-semibold text-text font-rampart">
          <span class="tracking-tight-less-negative">счёт   :           </span>{{ currentBettingPlayer?.score }}pts.
        </span>
      </p>
      <div class="mt-0">
        <label class="mb-1 block text-sm font-medium text-text-muted">
          Ваша ставка (от 1 до {{ currentBettingPlayer?.score }}):
        </label>
        <NumberInput
          :model-value="betInput ?? 1"
          :min="1"
          :max="currentBettingPlayer?.score ?? 1"
          :step="1"
          input-class="w-full rounded-button border border-surface-darker px-4 py-2 text-[17px] text-text placeholder-surface-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          @update:model-value="(v) => (betInput = v)"
        />
        <Transition name="error-message">
          <p v-if="betError" class="mt-1 text-sm text-error">
            {{ betError }}
          </p>
        </Transition>
      </div>
      <div class="mt-2 flex justify-center">
        <AppButton :disabled="!canConfirmBet" @click.prevent="confirmBet">
          Подтвердить ставку
        </AppButton>
      </div>
    </div>
  </ModalFullscreen>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useGameStore } from '@/stores/game'
  import type { Player } from '@/types'
  import { AppButton, FittyText, ModalFullscreen, NumberInput } from '@/components/ui'

  const props = defineProps<{
    finalPlayers: Player[]
  }>()

  const emit = defineEmits<{
    allBetsConfirmed: []
  }>()

  const gameStore = useGameStore()

  const bettingModalOpen = ref(false)
  const betInput = ref<number | null>(null)
  const betError = ref<string>('')

  const currentBettingPlayerIndex = computed(() => gameStore.finalCurrentPlayerIndex || 0)
  const currentBettingPlayer = computed(
    () => props.finalPlayers[currentBettingPlayerIndex.value] ?? null,
  )

  const canConfirmBet = computed(() => {
    if (!currentBettingPlayer.value) return false
    const score = currentBettingPlayer.value.score
    if (score <= 0) return false
    if (betInput.value == null) return false
    const v = Math.trunc(betInput.value)
    return v >= 1 && v <= score
  })

  function openBettingModalForCurrent() {
    betError.value = ''
    const player = currentBettingPlayer.value
    if (!player) {
      if (props.finalPlayers.length) {
        gameStore.finalCurrentPlayerIndex = 0
        gameStore.finalStep = 'answers'
      }
      bettingModalOpen.value = false
      emit('allBetsConfirmed')
      return
    }
    const existingBet = gameStore.getFinalBet(player.id)
    const base = existingBet > 0 ? existingBet : 1
    betInput.value = Math.min(Math.max(base, 1), player.score)
    bettingModalOpen.value = true
  }

  function confirmBet() {
    const player = currentBettingPlayer.value
    if (!player) return

    const raw = betInput.value
    if (raw == null || !Number.isFinite(raw)) {
      betError.value = 'Введите целое число'
      return
    }

    const bet = Math.trunc(raw)
    if (bet < 1 || bet > player.score) {
      betError.value = `Ставка должна быть от 1 до ${player.score}`
      return
    }

    betError.value = ''
    gameStore.setFinalBet(player.id, bet)

    const isLastPlayer = currentBettingPlayerIndex.value + 1 >= props.finalPlayers.length

    // Close modal first to trigger closing animation
    bettingModalOpen.value = false

    if (!isLastPlayer) {
      // Move to next player: reopen modal after close animation (like GameStartView)
      gameStore.finalCurrentPlayerIndex = currentBettingPlayerIndex.value + 1
      setTimeout(() => openBettingModalForCurrent(), 0)
    } else {
      setTimeout(() => {
        gameStore.finalCurrentPlayerIndex = 0
        gameStore.finalStep = 'answers'
        emit('allBetsConfirmed')
      }, 300)
    }
  }

  onMounted(() => {
    openBettingModalForCurrent()
  })
</script>

<style scoped>
  .error-message-enter-active { transition: all 0.3s ease-out; }
  .error-message-leave-active { transition: all 0.2s ease-in; }
  .error-message-enter-from,
  .error-message-leave-to { opacity: 0; transform: translateY(-8px); max-height: 0; }
  .error-message-enter-to,
  .error-message-leave-from { opacity: 1; transform: translateY(0); max-height: 100px; }
</style> 