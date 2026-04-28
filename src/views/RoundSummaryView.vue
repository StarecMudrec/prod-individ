<template>
  <div class="round-summary flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <h1 class="mb-10 text-center text-7xl font-bold font-rampart tracking-tight-negative text-text">Раунд   {{ completedRound }}</h1>
    <h1 class="mb-2 text-center text-2xl font-bold text-text">Итоги:</h1>
    <div class="mb-8 w-fit min-w-3xl">
      <TransitionGroup name="round-summary-list" tag="div" class="flex flex-col items-center space-y-3">
        <div v-for="(player, index) in sortedPlayers" :key="player.id" class="round-summary-player-row">
          <div class="round-summary-player-row-inner player-card-skin flex items-center justify-between bg-surface-alt px-4 py-2 gap-8">
            <img v-if="index === 0" src="/crown.svg" alt="" class="absolute -top-4 -left-4 h-8 w-8 -rotate-45">
            <div class="font-semibold font-rampart text-2xl text-text pb-1">{{ player.name }}</div>
            <div class="flex items-center gap-3">
              <AnimatedScore :to="player.score" v-slot="{ animatedValue }">
                <div
                  class="text-xl font-bold shrink-0 py-1 pb-1.5"
                  :class="player.score > 0 ? 'text-success' : player.score < 0 ? 'text-error' : 'text-text-muted'"
                >
                  <span class="text-text-muted text-2xl"></span>
                  <span class="font-rampart text-stroke-thin text-2xl">{{ animatedValue }} pts.</span>
                </div>
              </AnimatedScore>
              <div
                class="grid min-w-0 overflow-hidden transition-[width,grid-template-rows] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
                :style="{ width: settingsStore.devModeEnabled ? '7.5rem' : '0', gridTemplateRows: settingsStore.devModeEnabled ? '1fr' : '0fr' }"
              >
                <div class="overflow-hidden min-h-0 min-w-0">
                  <Transition name="dev-mode-slide">
                    <div v-if="settingsStore.devModeEnabled" class="text-xs text-text-muted">
                      <label class="inline-flex items-center text-dev-text text-sm gap-1">
                        <span>Dev:</span>
                        <NumberInput
                          :model-value="player.score"
                          :step="1"
                          :max="MAX_PLAYER_SCORE"
                          :min="MIN_PLAYER_SCORE"
                          input-class="w-20 rounded border border-dev px-2 py-1 text-right focus:border-dev focus:outline-none focus:ring-1 focus:ring-dev"
                          @focus="freezeOrder"
                          @blur="unfreezeOrder"
                          @update:model-value="(value) => onDevScoreChange(player.id, value)"
                        />
                      </label>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div class="flex flex-col gap-4">
      <AppButton v-if="gameStore.currentRound < 2" @click="goToNextRound">
        Перейти к раунду {{ gameStore.currentRound + 1 }}
      </AppButton>
      <AppButton v-else @click="goToFinal">
        Перейти к финалу
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import type { Player } from '@/types'
  import { useRouter } from 'vue-router'
  import { MAX_PLAYER_SCORE, MIN_PLAYER_SCORE } from '@/lib/constants'
  import { useGameStore } from '@/stores/game'
  import { useSettingsStore } from '@/stores'
  import { AppButton, NumberInput } from '@/components/ui'
  import AnimatedScore from '@/components/game/AnimatedScore.vue'

  const router = useRouter()
  const gameStore = useGameStore()
  const settingsStore = useSettingsStore()

  const completedRound = ref(1)
  const sortingApplied = ref(false)
  let sortingTimer: ReturnType<typeof setTimeout> | undefined
  onMounted(() => {
    completedRound.value = gameStore.currentRound
    sortingTimer = setTimeout(() => {
      sortingApplied.value = true
    }, 300)
  })
  onUnmounted(() => {
    if (sortingTimer) clearTimeout(sortingTimer)
  })

  const realSortedPlayers = computed(() => [...gameStore.players].sort((a, b) => b.score - a.score))
  const frozenOrder = ref<Player[] | null>(null)
  const sortedPlayers = computed(() => (!sortingApplied.value ? gameStore.players : frozenOrder.value ?? realSortedPlayers.value))

  const freezeOrder = () => {
    frozenOrder.value = [...realSortedPlayers.value]
  }
  const unfreezeOrder = () => {
    frozenOrder.value = null
  }

  function goToNextRound() {
    const nextRound = gameStore.currentRound + 1
    gameStore.startRound(nextRound)
    gameStore.setPhase('round-board')
    router.push('/board')
  }

  function goToFinal() {
    const playersWithPositiveScore = gameStore.players.filter((p) => p.score > 0)
    if (playersWithPositiveScore.length === 0) {
      gameStore.setPhase('results')
      router.push('/results')
    } else {
      gameStore.prepareFinal()
      router.push('/final')
    }
  }

  function onDevScoreChange(playerId: string, value: number | null) {
    if (!settingsStore.devModeEnabled || value == null || !Number.isFinite(value)) return
    const player = gameStore.players.find((p) => p.id === playerId)
    if (!player) return
    const targetScore = Math.trunc(value)
    const delta = targetScore - player.score
    if (delta === 0) return
    gameStore.updatePlayerScore(playerId, delta)
  }
</script>

<style scoped>
  .round-summary-player-row {
    position: relative;
  }
</style>