import { computed, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import { useQuestionsStore } from '@/stores/questions'

  const THEME_DURATION_MS = 5000

  export function useFinalFlow() {
    const router = useRouter()
    const gameStore = useGameStore()
    const questionsStore = useQuestionsStore()

    const finalQuestion = computed(() => questionsStore.getFinalQuestion())
    const finalPlayers = computed(() => gameStore.finalPlayers)
    const currentStep = computed(() => gameStore.finalStep ?? 'theme')

    // Theme timer
    const themeProgress = ref(0)
    const remainingThemeSeconds = ref(5)
    const themeTimerId = ref<number | null>(null)

    function stopThemeTimer() {
      if (themeTimerId.value !== null) {
        clearInterval(themeTimerId.value)
        themeTimerId.value = null
      }
    }

    function startThemeTimer() {
      stopThemeTimer()
      themeProgress.value = 0
      remainingThemeSeconds.value = 5
      const totalMs = THEME_DURATION_MS
      const startedAt = performance.now()

      themeTimerId.value = window.setInterval(() => {
        const elapsed = performance.now() - startedAt
        const clamped = Math.min(elapsed, totalMs)
        themeProgress.value = Math.round((clamped / totalMs) * 100)
        remainingThemeSeconds.value = Math.max(0, Math.ceil((totalMs - clamped) / 1000))

        if (clamped >= totalMs) {
          stopThemeTimer()
          goToBettingStep()
        }
      }, 100)
    }

    function goToBettingStep() {
      if (!finalPlayers.value.length) {
        goToResults()
        return
      }
      gameStore.finalStep = 'betting'
      gameStore.finalCurrentPlayerIndex = 0
    }

    function goToResults() {
      if (!gameStore.finalScoresApplied) {
        gameStore.applyFinalResults(
          finalQuestion.value.correctAnswer,
          finalQuestion.value.acceptedAnswers,
        )
      }
      gameStore.setPhase('results')
      router.push('/results')
    }

    function showFinalResults() {
      if (!gameStore.finalScoresApplied) {
        gameStore.applyFinalResults(
          finalQuestion.value.correctAnswer,
          finalQuestion.value.acceptedAnswers,
        )
      }
      gameStore.finalStep = 'reveal'
    }

    onUnmounted(() => {
      stopThemeTimer()
    })

    watch(
      () => currentStep.value,
      (step) => {
        if (step === 'theme') {
          startThemeTimer()
        } else {
          stopThemeTimer()
        }
      },
    )

    return {
      finalQuestion,
      finalPlayers,
      currentStep,
      themeProgress,
      remainingThemeSeconds,
      startThemeTimer,
      stopThemeTimer,
      goToBettingStep,
      goToResults,
      showFinalResults,
    }
  }
