import type { FinalQuestion, Question } from '@/types'
import type { QuestionsState } from './state'

export function createQuestionActions(state: QuestionsState) {
  function getQuestionById(questionId: string): Question | null {
    for (const roundData of state.data.value.rounds) {
      for (const theme of roundData.themes) {
        const question = theme.questions.find((q) => q.id === questionId)
        if (question) {
          return {
            id: question.id,
            themeId: theme.id,
            themeTitle: theme.title,
            cost: question.cost,
            text: question.text,
            correctAnswer: question.correctAnswer,
            acceptedAnswers: question.acceptedAnswers,
            type: question.type as Question['type'],
          }
        }
      }
      if (roundData.specialQuestions) {
        const specialQuestion = roundData.specialQuestions.find((q) => q.id === questionId)
        if (specialQuestion) {
          return {
            id: specialQuestion.id,
            themeId: specialQuestion.themeId,
            themeTitle: specialQuestion.themeTitle,
            cost: specialQuestion.cost,
            text: specialQuestion.text,
            correctAnswer: specialQuestion.correctAnswer,
            acceptedAnswers: specialQuestion.acceptedAnswers,
            type: specialQuestion.type as Question['type'],
          }
        }
      }
    }
    return null
  }

  function getQuestionForCell(roundId: number, themeId: string, cost: number): Question | null {
    const key = `${roundId}-${themeId}-${cost}`
    const specialPlacement = state.specialQuestionPlacements.value.get(key)
    if (specialPlacement) {
      const question = getQuestionById(specialPlacement.questionId)
      return question ? { ...question, cost } : null
    }

    const roundData = state.data.value.rounds.find((r) => r.id === roundId)
    if (!roundData) return null
    const theme = roundData.themes.find((t) => t.id === themeId)
    if (!theme) return null
    const question = theme.questions.find((q) => q.cost === cost && q.type === 'normal')
    if (!question) return null
    return {
      id: question.id,
      themeId: theme.id,
      themeTitle: theme.title,
      cost: question.cost,
      text: question.text,
      correctAnswer: question.correctAnswer,
      acceptedAnswers: question.acceptedAnswers,
      type: question.type as Question['type'],
    }
  }

  function isQuestionPlayed(questionId: string): boolean {
    return state.playedQuestionIds.value.has(questionId)
  }

  function markQuestionAsPlayed(questionId: string) {
    state.playedQuestionIds.value.add(questionId)
  }

  function getQuestionTypeForCell(roundId: number, themeId: string, cost: number): 'normal' | 'cat' | 'auction' | null {
    const key = `${roundId}-${themeId}-${cost}`
    const specialPlacement = state.specialQuestionPlacements.value.get(key)
    return specialPlacement ? specialPlacement.type : 'normal'
  }

  function isCellPlayed(roundId: number, themeId: string, cost: number): boolean {
    const question = getQuestionForCell(roundId, themeId, cost)
    return question ? isQuestionPlayed(question.id) : false
  }

  function getFinalQuestion(): FinalQuestion {
    return state.data.value.finalQuestion
  }

  return {
    getQuestionById,
    getQuestionForCell,
    isQuestionPlayed,
    markQuestionAsPlayed,
    getQuestionTypeForCell,
    isCellPlayed,
    getFinalQuestion,
  }
}

