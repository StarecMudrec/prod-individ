import { computed, ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import questionsData from '@/lib/questions.json'
import type { Round } from '@/types'
import type { QuestionPack, QuestionsData } from '@/lib/questionPackValidation'
import { BUILTIN_PACK_ID } from './constants'
import type { SpecialPlacement } from './types'
import { ensureBuiltinPack } from './helpers'

export function createQuestionsState() {
  const baseBuiltinPack: QuestionPack = {
    id: BUILTIN_PACK_ID,
    name: 'Стандартный пакет',
    data: questionsData as QuestionsData,
    builtIn: true,
  }

  const packsStorage = useLocalStorage<QuestionPack[]>('question_packs', [])
  const activePackIdStorage = useLocalStorage<string>('question_activePackId', BUILTIN_PACK_ID)
  const playedQuestionIdsStorage = useLocalStorage<Record<string, string[]>>('questions_playedIds', {})
  const specialQuestionPlacementsStorage = useLocalStorage<Record<string, Record<string, SpecialPlacement>>>(
    'questions_specialPlacements',
    {},
  )

  const packs = ref<QuestionPack[]>(ensureBuiltinPack(packsStorage.value, baseBuiltinPack))
  const activePackId = ref<string>(activePackIdStorage.value || BUILTIN_PACK_ID)
  const activePack = computed<QuestionPack>(() => packs.value.find((p) => p.id === activePackId.value) ?? packs.value[0])

  const data = ref<QuestionsData>(activePack.value?.data ?? (questionsData as QuestionsData))
  const rounds = ref<Round[]>([])

  const playedQuestionIds = ref<Set<string>>(new Set(playedQuestionIdsStorage.value[activePackId.value] ?? []))
  const specialQuestionPlacements = ref<Map<string, SpecialPlacement>>(
    new Map(Object.entries(specialQuestionPlacementsStorage.value[activePackId.value] ?? {})),
  )

  return {
    baseBuiltinPack,
    packsStorage,
    activePackIdStorage,
    playedQuestionIdsStorage,
    specialQuestionPlacementsStorage,
    packs,
    activePackId,
    activePack,
    data,
    rounds,
    playedQuestionIds,
    specialQuestionPlacements,
  }
}

export type QuestionsState = ReturnType<typeof createQuestionsState>

