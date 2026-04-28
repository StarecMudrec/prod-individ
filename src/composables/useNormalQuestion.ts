import { ANSWER_MAX_LENGTH, formatKeyDisplay, QUESTION_TIMEOUT_MS } from '@/lib/constants'
import { createNormalQuestionState } from './normalQuestion/normalQuestionState'
import { setupNormalQuestionTimer } from './normalQuestion/normalQuestionTimer'
import { setupNormalQuestionAnswering } from './normalQuestion/normalQuestionAnswering'

export function useNormalQuestion() {
  const ctx = createNormalQuestionState()

  const timerApi = setupNormalQuestionTimer(ctx, QUESTION_TIMEOUT_MS)
  const answeringApi = setupNormalQuestionAnswering(ctx, {
    startTimer: timerApi.startTimer,
    returnToBoard: timerApi.returnToBoard,
  })

  return {
    ...ctx,
    ...timerApi,
    ...answeringApi,
    ANSWER_MAX_LENGTH,
    formatKeyDisplay,
  }
}

