import { ref, watch } from 'vue'

// Синхронизация состояния с localStorage (для сохранения игры при перезагрузке)

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const data = ref<T>(
    stored ? (JSON.parse(stored) as T) : defaultValue
  )

  watch(
    data,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true }
  )

  return data
}