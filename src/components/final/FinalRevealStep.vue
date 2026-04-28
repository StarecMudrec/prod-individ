<template>
  <div class="w-full max-w-8xl">
    <h1 class="mb-12 text-center text-6xl font-rampart font-bold text-text">
      Результаты:
    </h1>
    <div class="mb-6 flex w-full flex-wrap justify-center gap-8">
      <div
        v-for="(player, index) in finalPlayers"
        :key="player.id"
        class="min-w-0 transition-all duration-300 ease-out"
        :class="{
          'scale-105 origin-center': getPlayerResult(player) === 'correct',
          'scale-95 origin-center': getPlayerResult(player) === 'wrong'
        }"
        :style="playerCardStyle"
      >
        <FlipRevealBox
          :delay="flipDelayForIndex(index)"
          :duration="FLIP_DURATION_MS"
          axis="y"
          class="h-full"
          @flip-complete="markCardFlipped(index)"
        >
          <template #back>
            <div class="player-card-skin h-full  bg-surface-alt"></div>
          </template>
          <FinalRevealPlayerCard
            :player="player"
            :allow-flip="flippedCardIndices.has(index)"
            :score-revealed="scoresRevealed"
            :correct-answer="correctAnswer"
            :accepted-answers="acceptedAnswers"
          />
        </FlipRevealBox>
      </div>
    </div>
    <FinalRevealAnswerCard
      :correct-answer="correctAnswer"
      :revealed="answerCardRevealed"
      :clickable="answerCardClickable"
      :flip-duration-ms="ANSWER_FLIP_DURATION_MS"
      @click="revealAnswerCard"
    />
    <div class="flex justify-center mb-1">
      <AppButton @click="emit('goToResults')">
        Перейти к итогам
      </AppButton>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref, watch, onBeforeUnmount } from 'vue'
  import type { Player } from '@/types'
  import { useGameStore } from '@/stores/game'
  import { runSuccessConfetti } from '@/lib/confetti'
  import { matchAnswer } from '@/lib/answerMatching'
  import { ANSWER_MATCH_DIFFICULTY } from '@/lib/constants'
  import { AppButton, FlipRevealBox } from '@/components/ui'
  import FinalRevealAnswerCard from './FinalRevealAnswerCard.vue'
  import FinalRevealPlayerCard from './FinalRevealPlayerCard.vue'
  const props = defineProps<{
    finalPlayers: Player[]
    correctAnswer: string
    acceptedAnswers?: string[]
  }>()
  const emit = defineEmits<{
    goToResults: []
  }>()
  const gameStore = useGameStore()
  const ANSWER_FLIP_DURATION_MS = 500
  const FLIP_DURATION_MS = 700
  const STAGGER_DELAY_MS = 1600
  const ANSWER_CARD_CLICK_DELAY_MS = 1500
  const CONFETTI_DELAY_MS = 800
  const CONFETTI_DURATION_MS = 5000
  const flippedCardIndices = ref(new Set<number>())
  const answerCardRevealed = ref(false)
  const answerCardClickable = ref(false)
  const scoresRevealed = ref(false)
  let answerCardDelayTimer: ReturnType<typeof setTimeout> | null = null
  let confettiDelayTimer: ReturnType<typeof setTimeout> | null = null
  const candidates = computed(() => [props.correctAnswer, ...(props.acceptedAnswers ?? [])])
  const playersWithCorrectAnswer = computed(() =>
    props.finalPlayers.filter((p) => matchAnswer(gameStore.getFinalAnswer(p.id), candidates.value, { difficulty: ANSWER_MATCH_DIFFICULTY }))
  )

  function markCardFlipped(index: number) {
    flippedCardIndices.value = new Set([...flippedCardIndices.value, index])
  }

  const allPlayerCardsFlipped = computed(
    () => flippedCardIndices.value.size === props.finalPlayers.length && props.finalPlayers.length > 0
  )

  watch(allPlayerCardsFlipped, (allFlipped) => {
    if (answerCardDelayTimer) clearTimeout(answerCardDelayTimer)
    answerCardClickable.value = false
    if (allFlipped) {
      answerCardDelayTimer = setTimeout(() => {
        answerCardClickable.value = true
        answerCardDelayTimer = null
      }, ANSWER_CARD_CLICK_DELAY_MS)
    }
  })

  onBeforeUnmount(() => {
    if (answerCardDelayTimer) clearTimeout(answerCardDelayTimer)
    if (confettiDelayTimer) clearTimeout(confettiDelayTimer)
  })

  function revealAnswerCard() {
    if (!answerCardClickable.value) return
    answerCardRevealed.value = true
    if (confettiDelayTimer) clearTimeout(confettiDelayTimer)
    confettiDelayTimer = setTimeout(() => {
      scoresRevealed.value = true
      if (playersWithCorrectAnswer.value.length > 0) {
        runSuccessConfetti(CONFETTI_DURATION_MS)
      }
      confettiDelayTimer = null
    }, CONFETTI_DELAY_MS)
  }

  function flipDelayForIndex(index: number): number {
    return 700 + index * (FLIP_DURATION_MS + STAGGER_DELAY_MS)
  }

  function getPlayerResult(player: Player): 'correct' | 'wrong' | null {
    if (!scoresRevealed.value || props.correctAnswer == null) return null
    const correct = matchAnswer(gameStore.getFinalAnswer(player.id), candidates.value, { difficulty: ANSWER_MATCH_DIFFICULTY })
    return correct ? 'correct' : 'wrong'
  }

  const optimalCols = computed(() => {
    const n = props.finalPlayers.length
    if (n <= 0) return 1
    if (n <= 3) return n
    if (n === 4) return 2
    return 3
  })

  const playerCardStyle = computed(() => {
    const cols = optimalCols.value
    const gapRem = 2
    return {
      flex: `0 0 calc((100% - ${(cols - 1) * gapRem}rem) / ${cols})`,
    }
  })
</script>