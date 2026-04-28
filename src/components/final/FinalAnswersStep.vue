<template>
  <div class="w-full max-w-3xl">
    <h1 class="mb-4 text-center text-5xl font-normal font-rampart text-stroke-1 tracking-tight-less-negative text-text">
      Ваши ставки :
    </h1>
    <p class="mb-12 text-center text-text-muted">
      Тема: <span class="font-semibold">{{ themeTitle }}</span>
    </p>

    <div class="mb-12 flex w-full flex-wrap justify-center gap-4">
      <div
        v-for="player in finalPlayers"
        :key="player.id"
        class="flex min-w-0 flex-col"
        :style="playerCardStyle"
      >
        <PlayerCard
          :player="player"
          :active="currentAnsweringPlayer?.id === player.id"
          :bet="gameStore.getFinalBet(player.id)"
        />
        <div class="mt-1 text-lg text-text-muted text-center text-stroke-0-5">
          Статус:
          <span
            :class="gameStore.finalAnswers.has(player.id) ? 'text-success' : 'text-text-muted'"
          >
            <TextWaveBackAndForth
              :text="gameStore.finalAnswers.has(player.id) ? 'Ответ получен' : 'Ждём ответ...'"
              :wave-half-duration="1.5"
            />
          </span>
        </div>
      </div>
    </div>

    <div class="mt-2 flex flex-col items-center gap-3">
      <template v-if="!allAnswersGiven && currentAnsweringPlayer">
        <p class="text-center text-text">
          Сейчас отвечает:
          <TextWave
            :text="currentAnsweringPlayer.name"
            base-class="font-normal text-text text-stroke-0-5 text-xl"
          />
        </p>
        <AppButton @click.prevent="goToQuestion">
          Ответить
        </AppButton>
      </template>
      <template v-else>
        <p class="text-center text-text">
          Все игроки дали свои ответы.
        </p>
        <AppButton @click="emit('showResults')">
          Показать результаты финала
        </AppButton>
      </template>
    </div>
  </div>

</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import type { Player } from '@/types'
  import { AppButton, TextWave, TextWaveBackAndForth } from '@/components/ui'
  import { PlayerCard } from '@/components/game'

  const props = defineProps<{
    finalPlayers: Player[]
    themeTitle: string
  }>()

  const emit = defineEmits<{
    showResults: []
  }>()

  const router = useRouter()
  const gameStore = useGameStore()

  const currentAnsweringPlayerIndex = computed(() => gameStore.finalCurrentPlayerIndex || 0)
  const currentAnsweringPlayer = computed(
    () => props.finalPlayers[currentAnsweringPlayerIndex.value] ?? null,
  )

  const allAnswersGiven = computed(() => {
    if (!props.finalPlayers.length) return false
    return gameStore.finalAnswers.size >= props.finalPlayers.length
  })

  const optimalCols = computed(() => {
    const n = props.finalPlayers.length
    if (n <= 0) return 1
    if (n <= 3) return n
    if (n === 4) return 2
    return 3
  })

  const playerCardStyle = computed(() => {
    const cols = optimalCols.value
    const gapRem = 1
    return {
      flex: `0 0 calc((100% - ${(cols - 1) * gapRem}rem) / ${cols})`,
    }
  })

  function goToQuestion() {
    router.push('/final-question')
  }
</script>
