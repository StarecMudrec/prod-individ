<template>
  <div
    class="player-card-skin relative overflow-hidden p-4 transition-all duration-300 ease-out"
    :class="resultClasses"
  >
    <div
      v-if="isWrong"
      class="pointer-events-none absolute inset-0 z-10 striped-defeat"
      aria-hidden="true"
    />
    <FittyText
      :text="player.name"
      fitty-class="font-rampart font-bold text-text"
      :min-size="12"
      :max-size="32"
      :cleanup-delay-ms="400"
    />
    <FlipRevealBox
      :delay="0"
      :duration="FLIP_DURATION_MS"
      axis="y"
      :visible="allowFlip"
      class="mt-1"
    >
      <template #back>
        <div class="reveal-box-skin border-dotted border-2 rounded-md border-surface-darker bg-surface min-h-[2.5rem]" />
      </template>
      <div class="text-xl text-text-muted border-dotted border-2 rounded-md border-surface-darker bg-surface">
        <span class="font-normal font-rampart text-stroke-0-5 text-2xl text-text tracking-tight-less-negative">
          Ставка   :         
        </span>
        <AnimatedScore
          v-if="bet > 0"
          :to="bet"
          v-slot="{ animatedValue }"
        >
          <span class="font-normal font-rampart text-stroke-0-5 text-2xl text-text">
            {{ animatedValue }}
          </span>
        </AnimatedScore>
        <span v-else class="font-normal font-rampart text-stroke-0-5 text-2xl text-text">—</span>
      </div>
    </FlipRevealBox>
    <FlipRevealBox
      :delay="FLIP_DURATION_MS"
      :duration="FLIP_DURATION_MS"
      :visible="allowFlip"
      class="mt-2"
    >
      <template #back>
        <div class="text-xl font-medium text-surface border-dotted border-2 rounded-md border-surface-darker bg-surface px-2 py-1">
          Ответ:
          <FittyText
            :text="gameStore.getFinalAnswer(player.id) || '—' "
            fitty-class="font-semibold text-surface"
            :min-size="12"
            :max-size="32"
            :cleanup-delay-ms="400"
          />
        </div>
      </template>
      <div class="text-xl font-medium text-text-muted border-dotted border-2 rounded-md border-surface-darker bg-surface px-2 py-1">
        Ответ:
        <FittyText
          :text="gameStore.getFinalAnswer(player.id) || '—' "
          fitty-class="font-semibold text-text"
          :min-size="12"
          :max-size="32"
          :cleanup-delay-ms="400"
        />
      </div>
    </FlipRevealBox>
    <div class="mt-1 text-lg text-text-muted text-center">
      Итоговый счёт: <span
        class="font-normal font-rampart text-stroke-0-5 text-2xl text-text tabular-nums"
      >
        <template v-if="scoreRevealed">{{ player.score }}pts.</template>
        <template v-else>
          <span
            v-for="(s, i) in scoreSymbols"
            :key="i"
            class="inline-block min-w-[1ch]"
          >{{ s }}</span>
        </template>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import { useGameStore } from '@/stores/game'
  import type { Player } from '@/types'
  import { FittyText, FlipRevealBox } from '@/components/ui'
  import AnimatedScore from '@/components/game/AnimatedScore.vue'
  import { matchAnswer } from '@/lib/answerMatching'
  import { ANSWER_MATCH_DIFFICULTY } from '@/lib/constants'

  const FLIP_DURATION_MS = 700
  const SCORE_SYMBOL_POOL = ['★', '◆', '●', '▲', '■', '♦', '✦', '◎']
  const SCORE_SYMBOL_TICK_MS = 90

  const props = withDefaults(
    defineProps<{ player: Player; allowFlip?: boolean; scoreRevealed?: boolean; correctAnswer?: string; acceptedAnswers?: string[] }>(),
    { allowFlip: false, scoreRevealed: false }
  )

  const gameStore = useGameStore()
  const bet = computed(() => gameStore.getFinalBet(props.player.id))

  const playerAnswer = computed(() => gameStore.getFinalAnswer(props.player.id) ?? '')
  const isCorrect = computed(() => {
    if (!props.scoreRevealed || props.correctAnswer == null) return false
    const candidates = [props.correctAnswer, ...(props.acceptedAnswers ?? [])]
    return matchAnswer(playerAnswer.value, candidates, { difficulty: ANSWER_MATCH_DIFFICULTY })
  })
  const isWrong = computed(() => props.scoreRevealed && props.correctAnswer != null && !isCorrect.value)
  const resultClasses = computed(() => {
    if (isCorrect.value) return 'bg-amber-50 border-2 border-amber-400 glow-victory'
    if (isWrong.value) return 'rounded-[var(--radius-card)] border-2 border-red-400 bg-red-50 glow-defeat ' // defeat styling applied via overlay
    return 'bg-surface-alt'
  })

  const scoreSymbols = ref<string[]>(['?', '?', '?', '?', '?', '?'])
  let symbolInterval: ReturnType<typeof setInterval> | null = null

  const tickSymbols = () => {
    scoreSymbols.value = Array.from(
      { length: 6 },
      () => SCORE_SYMBOL_POOL[Math.floor(Math.random() * SCORE_SYMBOL_POOL.length)]
    )
  }

  onMounted(() => {
    if (props.scoreRevealed) return
    tickSymbols()
    symbolInterval = setInterval(tickSymbols, SCORE_SYMBOL_TICK_MS)
  })

  const stopSymbols = () => {
    if (symbolInterval) {
      clearInterval(symbolInterval)
      symbolInterval = null
    }
  }

  watch(() => props.scoreRevealed, stopSymbols)
  onBeforeUnmount(stopSymbols)
</script>
