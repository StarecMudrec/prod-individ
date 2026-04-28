<template>
  <div
    class="player-card-skin bg-surface-alt p-4"
    :class="{ 'glow-primary': active }"
  >
    <FittyText
      :text="player.name"
      fitty-class="font-rampart font-bold text-text"
      :min-size="12"
      :max-size="32"
      :cleanup-delay-ms="400"
    />
    <div class="mt-1 text-sm text-text-muted">
      Клавиша: <kbd class="rounded bg-surface px-1.5 py-0.5 font-mono shadow-sm">{{ keyDisplay }}</kbd>
    </div>
    <div class="mt-2 text-xl font-bold text-text">
      <span class="font-rampart">{{ player.score }} pts.</span>
    </div>
    <div
      class="grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :style="{ gridTemplateRows: settingsStore.devModeEnabled ? '1fr' : '0fr' }"
      style="max-width: 180px;"
    >
      <div class="overflow-hidden min-h-0">
        <div class="mt-3 rounded-md bg-dev-sec p-2 text-sm text-dev-text">
          <label class="flex items-center gap-2">
            <span class="shrink-0">Dev счёт:</span>
            <NumberInput
              v-model="editableScore"
              :step="1"
              :max="MAX_PLAYER_SCORE"
              :min="MIN_PLAYER_SCORE"
              input-class="w-24 rounded border-0 shadow-sm border-dev bg-surface-alt px-2 py-1 text-right text-sm text-dev focus:border-dev focus:outline-none focus:ring-1 focus:ring-dev"
              @blur="applyScore"
              @keydown.enter="applyScore"
            />
          </label>
        </div>
      </div>
    </div>
    <div
      v-if="bet != null"
      class="mt-1 text-xl text-text-muted border-dotted border-2 rounded-md border-surface-darker bg-surface"
    >
      <span class="font-normal font-rampart text-stroke-0-5 text-2xl text-text tracking-tight-less-negative">
        Ставка   :         
      </span>
      <span class="font-normal font-rampart text-stroke-0-5 text-2xl text-text">
        {{ bet }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { Player } from '@/types'
  import { formatKeyDisplay, MAX_PLAYER_SCORE, MIN_PLAYER_SCORE} from '@/lib/constants'
  import { useGameStore } from '@/stores/game'
  import { useSettingsStore } from '@/stores'
  import { FittyText, NumberInput } from '@/components/ui'

  const props = defineProps<{
    player: Player
    active?: boolean
    bet?: string | number | null
  }>()

  const gameStore = useGameStore()
  const settingsStore = useSettingsStore()

  const keyDisplay = computed(() => formatKeyDisplay(props.player.key))

  const editableScore = ref<number>(props.player.score)

  watch(
    () => props.player.score,
    (val) => {
      editableScore.value = val
    }
  )

  function applyScore() {
    if (!settingsStore.devModeEnabled) return

    const raw = editableScore.value
    if (!Number.isFinite(raw)) {
      editableScore.value = props.player.score
      return
    }

    const targetScore = Math.trunc(raw)
    const currentScore = props.player.score
    if (targetScore === currentScore) return

    gameStore.updatePlayerScore(props.player.id, targetScore - currentScore)
  }

</script>