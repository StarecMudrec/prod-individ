import { defineStore } from 'pinia'
import { computed } from 'vue'
import { createQuestionActions } from './impl/questions'
import { createPackActions } from './impl/packs'
import { createRoundsActions } from './impl/rounds'
import { createQuestionsState } from './impl/state'
import { setupQuestionsWatchers } from './impl/watchers'

export const useQuestionsStore = defineStore('questions', () => {
  const state = createQuestionsState()
  const { initializeRounds, placeSpecialQuestions } = createRoundsActions(state)

  function reset() {
    state.playedQuestionIds.value.clear()
    state.specialQuestionPlacements.value.clear()
    state.playedQuestionIdsStorage.value = { ...state.playedQuestionIdsStorage.value, [state.activePackId.value]: [] }
    state.specialQuestionPlacementsStorage.value = {
      ...state.specialQuestionPlacementsStorage.value,
      [state.activePackId.value]: {},
    }
    initializeRounds()
  }

  const questionActions = createQuestionActions(state)
  const packActions = createPackActions(state, { reset })
  const getRoundById = computed(() => (roundId: number) => state.rounds.value.find((r) => r.id === roundId) ?? null)

  setupQuestionsWatchers(state, { initializeRounds })
  initializeRounds()

  return {
    rounds: state.rounds,
    playedQuestionIds: state.playedQuestionIds,
    specialQuestionPlacements: state.specialQuestionPlacements,
    activePackId: state.activePackId,
    getRoundById,
    reset,
    placeSpecialQuestions,
    ...questionActions,
    ...packActions,
  }
})
