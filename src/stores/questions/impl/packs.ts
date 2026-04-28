import type { QuestionsData } from '@/lib/questionPackValidation'
import type { QuestionsState } from './state'
import { BUILTIN_PACK_ID } from './constants'
import { generatePackId } from './helpers'

export function createPackActions(state: QuestionsState, deps: { reset: () => void }) {
  function setActivePack(id: string) {
    if (!state.packs.value.some((p) => p.id === id)) return
    state.activePackId.value = id
  }

  function getPacksMeta() {
    return state.packs.value.map((p) => ({ id: p.id, name: p.name, builtIn: p.builtIn }))
  }

  function importPack(newData: QuestionsData, name?: string): string {
    const id = generatePackId()
    state.packs.value.push({
      id,
      name: name?.trim() || `Пакет ${state.packs.value.length}`,
      data: newData,
      builtIn: false,
    })
    state.activePackId.value = id
    deps.reset()
    return id
  }

  function exportActivePack(): QuestionsData {
    return state.activePack.value.data
  }

  function deletePack(id: string) {
    const idx = state.packs.value.findIndex((p) => p.id === id)
    if (idx === -1) return
    const pack = state.packs.value[idx]
    if (pack.builtIn) return

    state.packs.value.splice(idx, 1)

    const { [id]: _, ...restPlayed } = state.playedQuestionIdsStorage.value
    state.playedQuestionIdsStorage.value = restPlayed

    const { [id]: __, ...restSpecial } = state.specialQuestionPlacementsStorage.value
    state.specialQuestionPlacementsStorage.value = restSpecial

    if (state.activePackId.value === id) {
      state.activePackId.value = BUILTIN_PACK_ID
      deps.reset()
    }
  }

  function renamePack(id: string, newName: string) {
    const pack = state.packs.value.find((p) => p.id === id)
    if (!pack) return
    const name = newName.trim()
    if (!name) return
    pack.name = name
  }

  function updateActivePack(updated: QuestionsData) {
    const idx = state.packs.value.findIndex((p) => p.id === state.activePackId.value)
    if (idx === -1) return
    const existing = state.packs.value[idx]
    state.packs.value.splice(idx, 1, { ...existing, data: updated })
    state.data.value = updated
    deps.reset()
  }

  return { setActivePack, getPacksMeta, importPack, exportActivePack, deletePack, renamePack, updateActivePack }
}

