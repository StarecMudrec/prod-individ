import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useQuestionsStore } from '@/stores/questions'
import { useSettingsStore } from '@/stores'
import { QUESTION_TIMEOUT_MS } from '@/lib/constants'

export function createNormalQuestionState() {
  const router = useRouter()
  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()
  const settingsStore = useSettingsStore()

  const answer = ref('')
  const attemptedSubmit = ref(false)
  const timeRemaining = ref(QUESTION_TIMEOUT_MS)
  const timerInterval = ref<number | null>(null)
  const showResultModal = ref(false)
  const resultData = ref<{
    isCorrect: boolean
    previousScore: number
    currentScore: number
    playerName: string
    pointsDelta: number
  } | null>(null)
  const pendingAction = ref<(() => void) | null>(null)
  const isSubmittingAnswer = ref(false)
  const showAnsweringModal = ref(false)
  const showTimeoutModal = ref(false)
  const showAllWrongModal = ref(false)
  const answeringPlayerName = ref('')

  const currentQuestion = computed(() => {
    if (!gameStore.currentQuestionId) throw new Error('No current question')
    const q = questionsStore.getQuestionById(gameStore.currentQuestionId)
    if (!q) throw new Error('Question not found')
    const overrideCost = gameStore.currentQuestionCellCost
    if (typeof overrideCost === 'number' && Number.isFinite(overrideCost) && overrideCost > 0) {
      return { ...q, cost: overrideCost }
    }
    return q
  })

  const timerClass = computed(() => {
    const seconds = Math.ceil(timeRemaining.value / 1000)
    if (seconds <= 5) return 'text-error text-stroke-1'
    if (seconds <= 10) return 'text-warning text-stroke-1'
    return 'text text-stroke-1'
  })

  const canAnswer = computed(() => {
    return gameStore.activePlayer !== null && !gameStore.hasPlayerAnswered(gameStore.activePlayer.id)
  })

  const inputStatus = computed(() => {
    if (!attemptedSubmit.value) return ''
    return answer.value.trim() ? '' : 'error'
  })

  return {
    router,
    gameStore,
    questionsStore,
    settingsStore,
    answer,
    attemptedSubmit,
    timeRemaining,
    timerInterval,
    showResultModal,
    resultData,
    pendingAction,
    isSubmittingAnswer,
    showAnsweringModal,
    showTimeoutModal,
    showAllWrongModal,
    answeringPlayerName,
    currentQuestion,
    timerClass,
    canAnswer,
    inputStatus,
  }
}

