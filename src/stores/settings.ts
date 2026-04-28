import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const useSettingsStore = defineStore('settings', () => {
  const devModeStorage = useLocalStorage<boolean>('settings_devMode', false)
  const devModeEnabled = ref<boolean>(devModeStorage.value)

  watch(
    devModeEnabled,
    (val) => {
      devModeStorage.value = val
    },
    { immediate: false }
  )

  function setDevMode(enabled: boolean) {
    devModeEnabled.value = enabled
  }

  function toggleDevMode() {
    devModeEnabled.value = !devModeEnabled.value
  }

  return {
    devModeEnabled,
    setDevMode,
    toggleDevMode,
  }
})

