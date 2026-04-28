import { ANSWER_MATCH_DIFFICULTY } from '@/lib/constants'
import { matchAnswer } from '@/lib/answerMatching'
import type { createNormalQuestionState } from './normalQuestionState'

type Ctx = ReturnType<typeof createNormalQuestionState>

export function setupNormalQuestionAnswering(
  ctx: Ctx,
  deps: {
    startTimer: () => void
    returnToBoard: () => void
  }
) {
  function submitAnswer() {
    if (ctx.isSubmittingAnswer.value) return
    if (!ctx.currentQuestion.value || !ctx.gameStore.activePlayer) return
    if (!ctx.answer.value.trim()) {
      ctx.attemptedSubmit.value = true
      return
    }

    ctx.isSubmittingAnswer.value = true

    const acceptedAnswers = [
      ctx.currentQuestion.value.correctAnswer,
      ...(ctx.currentQuestion.value.acceptedAnswers ?? []),
    ]
    const isCorrect = matchAnswer(ctx.answer.value, acceptedAnswers, {
      difficulty: ANSWER_MATCH_DIFFICULTY,
    })
    const previousScore = ctx.gameStore.activePlayer.score
    const pointsDelta = isCorrect
      ? ctx.currentQuestion.value.cost
      : -ctx.currentQuestion.value.cost

    ctx.gameStore.updatePlayerScore(ctx.gameStore.activePlayer.id, pointsDelta)
    const currentScore = ctx.gameStore.activePlayer.score

    ctx.resultData.value = {
      isCorrect,
      previousScore,
      currentScore,
      playerName: ctx.gameStore.activePlayer.name,
      pointsDelta,
    }
    ctx.showResultModal.value = true

    if (isCorrect) {
      ctx.pendingAction.value = () => {
        ctx.isSubmittingAnswer.value = false
        ctx.gameStore.setQuestionChooser(ctx.gameStore.activePlayer!.id)
        ctx.questionsStore.markQuestionAsPlayed(ctx.currentQuestion.value!.id)
        deps.returnToBoard()
      }
    } else {
      ctx.gameStore.addAnsweredPlayer(ctx.gameStore.activePlayer.id)
      ctx.gameStore.setActivePlayer(null)

      ctx.pendingAction.value = () => {
        ctx.isSubmittingAnswer.value = false
        const remainingPlayers = ctx.gameStore.players.filter(
          (p) => !ctx.gameStore.hasPlayerAnswered(p.id)
        )

        if (remainingPlayers.length === 0) {
          ctx.questionsStore.markQuestionAsPlayed(ctx.currentQuestion.value!.id)
          ctx.showAllWrongModal.value = true
        } else {
          ctx.answer.value = ''
          deps.startTimer()
        }
      }
    }
  }

  function closeResultModal() {
    ctx.showResultModal.value = false
    ctx.resultData.value = null
    if (ctx.pendingAction.value) {
      ctx.pendingAction.value()
      ctx.pendingAction.value = null
    }
  }

  function closeAllWrongModal() {
    ctx.showAllWrongModal.value = false
    setTimeout(() => deps.returnToBoard(), 450)
  }

  return {
    submitAnswer,
    closeResultModal,
    closeAllWrongModal,
  }
}

