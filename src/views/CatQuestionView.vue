<template>
  <div class="question flex min-h-screen flex-col items-center justify-center">
    <ModalFullscreenSpin :model-value="!gameStore.catReceiverId">
      <CatPlayerSelector
        :players="gameStore.players"
        :question-chooser-id="gameStore.questionChooserId"
        @select="selectCatReceiver"
      />
    </ModalFullscreenSpin>

    <Transition name="cat-content">
      <div v-if="gameStore.catReceiverId" class="flex flex-col items-center">
        <CatBetSelector
          v-if="!catBet"
          :bet-options="catBetOptions"
          @select="setCatBet"
        />

        <CatAnswerForm
          v-else
          v-model="answer"
          :theme-title="currentQuestion.themeTitle"
          :question-text="currentQuestion.text"
          :cat-bet="catBet"
          :correct-answer="currentQuestion.correctAnswer"
          :dev-mode-enabled="settingsStore.devModeEnabled"
          :is-submitting="isSubmittingCatAnswer"
          :answering-player-name="catReceiver?.name ?? ''"
          @submit="submitCatAnswer"
        />
      </div>
    </Transition>

    <AnswerResultModal
      v-if="showResultModal && resultData"
      :is-correct="resultData.isCorrect"
      :previous-score="resultData.previousScore"
      :current-score="resultData.currentScore"
      :player-name="resultData.playerName"
      :points-delta="resultData.pointsDelta"
      @close="closeResultModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import { useQuestionsStore } from '@/stores/questions'
  import { useSettingsStore } from '@/stores'
  import { ModalFullscreenSpin } from '@/components/ui'
  import { AnswerResultModal, CatPlayerSelector, CatBetSelector, CatAnswerForm } from '@/components/game'
  import { ANSWER_MATCH_DIFFICULTY, CAT_BET_OPTIONS_ROUND1, CAT_BET_OPTIONS_ROUND2 } from '@/lib/constants'
  import { matchAnswer } from '@/lib/answerMatching'
  type ResultData = { isCorrect: boolean; previousScore: number; currentScore: number; playerName: string; pointsDelta: number }

  const router = useRouter()
  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()
  const settingsStore = useSettingsStore()

  const answer = ref('')
  const catBet = ref<number | null>(null)
  const showResultModal = ref(false)
  const resultData = ref<ResultData | null>(null)
  const pendingAction = ref<(() => void) | null>(null)
  const isSubmittingCatAnswer = ref(false)

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

  const catReceiver = computed(() =>
    !gameStore.catReceiverId ? null : gameStore.players.find((p) => p.id === gameStore.catReceiverId) ?? null,
  )
  const catBetOptions = computed(() =>
    gameStore.currentRound === 1 ? CAT_BET_OPTIONS_ROUND1 : CAT_BET_OPTIONS_ROUND2,
  )

  function selectCatReceiver(playerId: string) { gameStore.setCatReceiver(playerId) }
  function setCatBet(bet: number) { catBet.value = bet }

  function submitCatAnswer() {
    if (isSubmittingCatAnswer.value) return
    if (!currentQuestion.value || !gameStore.catReceiverId || !catBet.value) return
    if (!answer.value.trim()) return

    isSubmittingCatAnswer.value = true

    const receiver = gameStore.players.find((p) => p.id === gameStore.catReceiverId)
    if (!receiver) return

    const acceptedAnswers = [
      currentQuestion.value.correctAnswer,
      ...(currentQuestion.value.acceptedAnswers ?? []),
    ]
    const isCorrect = matchAnswer(answer.value, acceptedAnswers, { difficulty: ANSWER_MATCH_DIFFICULTY })
    const previousScore = receiver.score
    const pointsDelta = isCorrect ? catBet.value : -catBet.value

    gameStore.updatePlayerScore(receiver.id, pointsDelta)
    const currentScore = receiver.score

    resultData.value = {
      isCorrect,
      previousScore,
      currentScore,
      playerName: receiver.name,
      pointsDelta,
    }
    showResultModal.value = true

    pendingAction.value = () => {
      isSubmittingCatAnswer.value = false
      gameStore.setQuestionChooser(receiver.id)
      questionsStore.markQuestionAsPlayed(currentQuestion.value!.id)
      returnToBoard()
    }
  }

  function closeResultModal() {
    showResultModal.value = false
    resultData.value = null
    if (pendingAction.value) { pendingAction.value(); pendingAction.value = null }
  }

  function returnToBoard() { gameStore.setPhase('round-board'); gameStore.setActivePlayer(null); router.push('/board') }
</script>
<style scoped>
  .cat-content-enter-active,
  .cat-content-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
  .cat-content-enter-from,
  .cat-content-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
