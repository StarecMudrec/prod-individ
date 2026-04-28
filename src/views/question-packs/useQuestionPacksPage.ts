import { computed, ref } from 'vue'
import { useQuestionsStore } from '@/stores/questions'
import { validateQuestionPack } from '@/lib/questionPackValidation'

export function useQuestionPacksPage() {
  const questionsStore = useQuestionsStore()

  const packsMeta = computed(() => questionsStore.getPacksMeta())
  const activePackId = computed(() => questionsStore.activePackId)

  const fileInput = ref<HTMLInputElement | null>(null)
  const importErrors = ref<string[]>([])
  const infoMessage = ref('')

  function clearMessages() {
    importErrors.value = []
    infoMessage.value = ''
  }

  function triggerFileSelect() {
    clearMessages()
    fileInput.value?.click()
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      clearMessages()
      try {
        const text = reader.result as string
        const parsed = JSON.parse(text)
        const validation = validateQuestionPack(parsed)
        if (!validation.ok) {
          importErrors.value = validation.errors
          return
        }
        const inferredName = file.name.replace(/\.json$/i, '')
        questionsStore.importPack(validation.data, inferredName)
        infoMessage.value = `Пакет «${inferredName || 'Новый пакет'}» успешно импортирован и сделан активным.`
      } catch (e) {
        importErrors.value = ['Не удалось прочитать или разобрать JSON-файл. Проверьте содержимое файла.']
      } finally {
        target.value = ''
      }
    }
    reader.onerror = () => {
      importErrors.value = ['Ошибка чтения файла. Попробуйте выбрать файл ещё раз.']
      target.value = ''
    }
    reader.readAsText(file, 'utf-8')
  }

  function exportActive() {
    clearMessages()
    const data = questionsStore.exportActivePack()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'question-pack.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    infoMessage.value = 'Текущий пакет успешно экспортирован в файл question-pack.json.'
  }

  function makeActive(id: string) {
    questionsStore.setActivePack(id)
    infoMessage.value = 'Активный пакет изменён. Новая игра будет использовать выбранный набор вопросов.'
  }

  function startRename(id: string, currentName: string) {
    const nextName = window.prompt('Новое имя пакета:', currentName)
    if (!nextName || nextName.trim() === currentName.trim()) return
    questionsStore.renamePack(id, nextName)
    infoMessage.value = 'Имя пакета обновлено.'
  }

  function deleteUserPack(id: string) {
    const confirmed = window.confirm('Удалить этот пакет вопросов? Это действие нельзя отменить.')
    if (!confirmed) return
    questionsStore.deletePack(id)
    infoMessage.value = 'Пакет удалён. Если он был активным, игра переключена на встроенный пакет.'
  }

  return {
    packsMeta,
    activePackId,
    fileInput,
    importErrors,
    infoMessage,
    triggerFileSelect,
    handleFileChange,
    exportActive,
    makeActive,
    startRename,
    deleteUserPack,
  }
}

