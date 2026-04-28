<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col">
    <ModalFullscreenSpin
      v-if="showRoundDeclaration"
      v-model="showRoundDeclarationModal"
      :teleport="false"
      class="w-32"
    >
      <h2
        id="modal-spin-title"
        class="text-6xl font-normal text-text font-rampart text-center tracking-tight-negative text-stroke-1 pb-3"
        style="-webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: rgb(var(--color-text));"
      >
        Раунд   {{ gameStore.currentRound }}
      </h2>
    </ModalFullscreenSpin>

    <Transition name="page-fade" mode="out-in">
      <div
        v-if="roundDeclarationDone || !showRoundDeclaration"
        key="board-content"
        class="flex min-h-0 flex-1 flex-col items-center justify-center"
      >
        <RoundBoard />
      </div>
    </Transition>

    <div
      class="grid shrink-0 transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :style="{
        gridTemplateRows:
          settingsStore.devModeEnabled && (roundDeclarationDone || !showRoundDeclaration)
            ? '1fr'
            : '0fr'
      }"
    >
      <div class="overflow-hidden min-h-0">
        <div class="mx-auto mt-8 max-w-2xl rounded-lg border-4 border-dashed border-dev bg-dev-sec p-4 text-sm text-dev-text">
          <div class="mb-2 text-lg font-semibold">
            Dev-mode: инструменты для проверки
          </div>
          <p class="mb-3">
            Можно принудительно завершить текущий раунд и перейти к экрану итогов, даже если не все вопросы сыграны.
          </p>
          <AppButton
            variant="dev"
            @click.prevent="goToRoundSummaryDev"
          >
            Завершить раунд (dev)
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Ref } from 'vue'
  import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import { useQuestionsStore } from '@/stores/questions'
  import { useSettingsStore } from '@/stores'
  import { AppButton } from '@/components/ui'
  import RoundBoard from '@/components/game/RoundBoard.vue'
  import ModalFullscreenSpin from '@/components/ui/ModalFullscreenSpin.vue'

  const router = useRouter()
  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()
  const settingsStore = useSettingsStore()
  const previousRoute = inject<Ref<string | null>>('previousRoute', ref(null))

  const showRoundDeclaration = computed(
    () =>
      previousRoute?.value === '/game-start' || previousRoute?.value === '/round-summary'
  )

  const showRoundDeclarationModal = ref(true)
  const roundDeclarationDone = ref(false)
  const allQuestionsPlayed = computed(() => {
    const round = questionsStore.getRoundById(gameStore.currentRound)
    if (!round) return false

    for (const theme of round.themes) {
      for (const cost of round.costs) {
        if (!questionsStore.isCellPlayed(gameStore.currentRound, theme.id, cost)) {
          return false
        }
      }
    }
    return true
  })

  watch(allQuestionsPlayed, (played) => {
    if (played && gameStore.phase === 'round-board') {
      gameStore.setPhase('round-summary')
      router.push('/round-summary')
    }
  })

  onMounted(() => {
    gameStore.setCurrentQuestion(null)
    if (gameStore.phase !== 'round-board') {
      gameStore.setPhase('round-board')
    }
    if (allQuestionsPlayed.value) {
      gameStore.setPhase('round-summary')
      router.push('/round-summary')
    }
    if (!showRoundDeclaration.value) {
      showRoundDeclarationModal.value = false
      roundDeclarationDone.value = true
    } else {
      const ROUND_MODAL_DURATION_MS = 1500
      const hideModalTimer = window.setTimeout(() => {
        showRoundDeclarationModal.value = false
      }, ROUND_MODAL_DURATION_MS)
      const doneTimer = window.setTimeout(() => {
        roundDeclarationDone.value = true
      }, ROUND_MODAL_DURATION_MS)
      onUnmounted(() => {
        clearTimeout(hideModalTimer)
        clearTimeout(doneTimer)
      })
    }
  })

  function goToRoundSummaryDev() {
    gameStore.setPhase('round-summary')
    router.push('/round-summary')
  }
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-enter-to,
.page-fade-leave-from {
  transform: translateY(0);
}
</style>