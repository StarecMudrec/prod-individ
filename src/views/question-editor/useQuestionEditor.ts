import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
import { validateQuestionPack, type QuestionsData } from '@/lib/questionPackValidation'

export type EditorMode = 'rounds' | 'final' | 'special'

export function useQuestionEditor() {
  const router = useRouter()
  const questionsStore = useQuestionsStore()

  const source = questionsStore.exportActivePack()
  const draft = reactive<QuestionsData>(JSON.parse(JSON.stringify(source)) as QuestionsData)

  const editorModes: { value: EditorMode; label: string }[] = [
    { value: 'rounds', label: 'Обычные вопросы' },
    { value: 'special', label: 'Специальные вопросы' },
    { value: 'final', label: 'Финальный вопрос' },
  ]

  const currentMode = ref<EditorMode>('rounds')
  const currentRoundIndex = ref(0)
  const errors = ref<string[]>([])
  const infoMessage = ref('')

  const currentRound = computed(() => draft.rounds?.[currentRoundIndex.value])

  function ensureThemeIds() {
    draft.rounds.forEach((round, roundIndex) => {
      round.themes.forEach((theme, themeIndex) => {
        if (!theme.id) theme.id = `r${round.id ?? roundIndex + 1}-t${themeIndex + 1}`
        theme.questions.forEach((q, questionIndex) => {
          if (!q.id) q.id = `${theme.id}-q${questionIndex + 1}`
        })
      })
      if (round.specialQuestions) {
        round.specialQuestions.forEach((q, index) => {
          if (!q.id) q.id = `r${round.id ?? roundIndex + 1}-special-${index + 1}`
          if (!q.themeId) q.themeId = q.type === 'auction' ? round.themes[0]?.id ?? 'r-theme' : 'special-cat'
        })
      }
    })
    if (!draft.finalQuestion.id) draft.finalQuestion.id = draft.finalQuestion.themeTitle || 'final'
  }

  function addTheme() {
    if (!currentRound.value || currentRound.value.themes.length >= 6) return
    const nextIndex = currentRound.value.themes.length + 1
    currentRound.value.themes.push({
      id: '',
      title: `Новая тема ${nextIndex}`,
      questions: [{
        id: '',
        cost: currentRound.value.costs[0] ?? 100,
        text: 'Новый вопрос',
        correctAnswer: '',
        acceptedAnswers: [],
        type: 'normal',
      }],
    } as any)
  }

  function removeTheme(index: number) {
    if (!currentRound.value || currentRound.value.themes.length <= 1) return
    currentRound.value.themes.splice(index, 1)
  }

  function addQuestion(theme: any) {
    if (!currentRound.value || theme.questions.length >= 5) return
    const costIndex = Math.min(theme.questions.length, currentRound.value.costs.length - 1)
    theme.questions.push({
      id: '',
      cost: currentRound.value.costs[costIndex] ?? currentRound.value.costs[0],
      text: 'Новый вопрос',
      correctAnswer: '',
      acceptedAnswers: [],
      type: 'normal',
    })
  }

  function onAcceptedAnswersInput(event: Event, question: any) {
    const value = (event.target as HTMLInputElement).value
    const parts = value.split(',').map((p) => p.trim()).filter(Boolean)
    question.acceptedAnswers = parts.length ? parts : undefined
  }

  function onFinalAcceptedInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    const parts = value.split(',').map((p) => p.trim()).filter(Boolean)
    draft.finalQuestion.acceptedAnswers = parts.length ? parts : []
  }

  function addSpecialQuestion() {
    if (!currentRound.value) return
    if (!currentRound.value.specialQuestions) currentRound.value.specialQuestions = []
    currentRound.value.specialQuestions.push({
      id: '',
      themeId: 'special-cat',
      themeTitle: 'Новая тема',
      cost: 0,
      text: 'Новый специальный вопрос',
      correctAnswer: '',
      acceptedAnswers: [],
      type: 'cat',
    } as any)
  }

  function removeSpecialQuestion(index: number) {
    if (!currentRound.value?.specialQuestions) return
    currentRound.value.specialQuestions.splice(index, 1)
  }

  function save(asNew: boolean) {
    errors.value = []
    infoMessage.value = ''
    ensureThemeIds()

    const validation = validateQuestionPack(draft as unknown)
    if (!validation.ok) {
      errors.value = validation.errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (asNew) {
      questionsStore.importPack(validation.data, 'Скопированный пакет')
      infoMessage.value = 'Изменения сохранены в новом пакете. Он сделан активным.'
    } else {
      questionsStore.updateActivePack(validation.data)
      infoMessage.value = 'Изменения сохранены в активном пакете.'
    }

    router.push('/packs')
  }

  return {
    draft,
    editorModes,
    currentMode,
    currentRoundIndex,
    currentRound,
    errors,
    infoMessage,
    addTheme,
    removeTheme,
    addQuestion,
    onAcceptedAnswersInput,
    onFinalAcceptedInput,
    addSpecialQuestion,
    removeSpecialQuestion,
    save,
  }
}

