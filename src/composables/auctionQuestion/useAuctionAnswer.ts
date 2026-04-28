import type { ComputedRef, Ref } from 'vue'
import type { Router } from 'vue-router'
import { ANSWER_MATCH_DIFFICULTY } from '@/lib/constants'
import { matchAnswer } from '@/lib/answerMatching'

interface AuctionAnswerDeps {
  router: Router
  gameStore: any
  questionsStore: any
  currentQuestion: ComputedRef<any>
  answer: Ref<string>
  isSubmittingAnswer: Ref<boolean>
  showResultModal: Ref<boolean>
  resultData: Ref<{
    isCorrect: boolean
    previousScore: number
    currentScore: number
    playerName: string
    pointsDelta: number
  } | null>
  pendingAction: Ref<(() => void) | null>
}

export function createAuctionAnswerHandlers({
  router,
  gameStore,
  questionsStore,
  currentQuestion,
  answer,
  isSubmittingAnswer,
  showResultModal,
  resultData,
  pendingAction,
}: AuctionAnswerDeps) {
  function returnToBoard() {
    gameStore.setPhase('round-board')
    gameStore.setActivePlayer(null)
    router.push('/board')
  }

  function submitAnswer() {
    if (isSubmittingAnswer.value) return
    if (!currentQuestion.value || !gameStore.auctionWinnerId) return
    if (!answer.value.trim()) return

    isSubmittingAnswer.value = true

    const winner = gameStore.players.find((p: any) => p.id === gameStore.auctionWinnerId)
    if (!winner) {
      isSubmittingAnswer.value = false
      return
    }

    const bid = gameStore.getAuctionBid(winner.id)
    const acceptedAnswers = [
      currentQuestion.value.correctAnswer,
      ...(currentQuestion.value.acceptedAnswers ?? []),
    ]
    const isCorrect = matchAnswer(answer.value, acceptedAnswers, {
      difficulty: ANSWER_MATCH_DIFFICULTY,
    })
    const previousScore = winner.score
    const pointsDelta = isCorrect ? bid : -bid

    gameStore.updatePlayerScore(winner.id, pointsDelta)
    const currentScore = winner.score

    resultData.value = {
      isCorrect,
      previousScore,
      currentScore,
      playerName: winner.name,
      pointsDelta,
    }
    showResultModal.value = true

    pendingAction.value = () => {
      isSubmittingAnswer.value = false
      gameStore.setQuestionChooser(winner.id)
      questionsStore.markQuestionAsPlayed(currentQuestion.value!.id)
      returnToBoard()
    }
  }

  function closeResultModal() {
    showResultModal.value = false
    resultData.value = null
    if (pendingAction.value) {
      pendingAction.value()
      pendingAction.value = null
    }
  }

  return {
    submitAnswer,
    closeResultModal,
  }
}

