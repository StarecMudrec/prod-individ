import type { Theme } from '@/types'
import type { QuestionsState } from './state'

export function createRoundsActions(state: QuestionsState) {
  function initializeRounds() {
    state.rounds.value = state.data.value.rounds.map((r) => {
      const themes: Theme[] = r.themes.map((t) => ({
        id: t.id,
        title: t.title,
        questionIds: t.questions.map((q) => q.id),
      }))
      return { id: r.id, themes, costs: r.costs, isFinal: false }
    })
    placeSpecialQuestions()
  }

  function placeSpecialQuestions() {
    if (state.specialQuestionPlacements.value.size > 0) return
    state.specialQuestionPlacements.value.clear()

    state.data.value.rounds.forEach((roundData) => {
      if (!roundData.specialQuestions) return
      const round = state.rounds.value.find((r) => r.id === roundData.id)
      if (!round) return

      const catQuestions = roundData.specialQuestions.filter((q) => q.type === 'cat')
      const auctionQuestions = roundData.specialQuestions.filter((q) => q.type === 'auction')

      const availableCells: Array<{ themeId: string; cost: number }> = []
      round.themes.forEach((theme) => {
        round.costs.forEach((cost) => availableCells.push({ themeId: theme.id, cost }))
      })

      const shuffled = [...availableCells].sort(() => Math.random() - 0.5)
      let catIndex = 0
      let auctionIndex = 0

      shuffled.forEach((cell) => {
        const key = `${round.id}-${cell.themeId}-${cell.cost}`
        if (catIndex < catQuestions.length && !state.specialQuestionPlacements.value.has(key)) {
          state.specialQuestionPlacements.value.set(key, { questionId: catQuestions[catIndex].id, type: 'cat' })
          catIndex++
        } else if (auctionIndex < auctionQuestions.length && !state.specialQuestionPlacements.value.has(key)) {
          state.specialQuestionPlacements.value.set(key, { questionId: auctionQuestions[auctionIndex].id, type: 'auction' })
          auctionIndex++
        }
      })
    })
  }

  return { initializeRounds, placeSpecialQuestions }
}

