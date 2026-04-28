import { watch } from 'vue'
import type { QuestionsState } from './state'

export function setupQuestionsWatchers(state: QuestionsState, deps: { initializeRounds: () => void }) {
  watch(
    state.packs,
    (val) => {
      state.packsStorage.value = val
    },
    { deep: true },
  )

  watch(state.activePackId, (id) => {
    state.activePackIdStorage.value = id
    state.data.value = state.activePack.value.data
    state.playedQuestionIds.value = new Set(state.playedQuestionIdsStorage.value[id] ?? [])
    state.specialQuestionPlacements.value = new Map(
      Object.entries(state.specialQuestionPlacementsStorage.value[id] ?? {}),
    )
    deps.initializeRounds()
  })

  watch(
    state.playedQuestionIds,
    (val) => {
      state.playedQuestionIdsStorage.value = {
        ...state.playedQuestionIdsStorage.value,
        [state.activePackId.value]: Array.from(val),
      }
    },
    { deep: true },
  )

  watch(
    state.specialQuestionPlacements,
    (val) => {
      state.specialQuestionPlacementsStorage.value = {
        ...state.specialQuestionPlacementsStorage.value,
        [state.activePackId.value]: Object.fromEntries(val),
      }
    },
    { deep: true },
  )
}

