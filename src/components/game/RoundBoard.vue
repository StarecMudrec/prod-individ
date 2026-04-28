<template>
  <div class="flex min-h-0 flex-1 flex-col items-center justify-center">
    <div v-if="gameStore.players.length" class="mb-8 flex w-full flex-wrap justify-center gap-x-4 gap-y-2">
      <div v-for="p in gameStore.players" :key="p.id" class="min-w-0" :style="playerCardStyle">
        <PlayerCard :player="p" :active="p.id === gameStore.questionChooserId" />
      </div>
    </div>
    <div class="board">
      <h1
        class="mb-12 text-6xl font-normal text-text font-rampart text-center tracking-tight-negative"
        style="-webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: rgb(var(--color-text));"
      >
        Раунд   {{ gameStore.currentRound }}
      </h1>
      <div v-if="gameStore.questionChooser" class="mb-2 text-center font-semibold text-text text-xl">
        Ходит:
        <TextWave :text="gameStore.questionChooser?.name ?? ''" base-class="text-2xl font-semibold text-text" />
      </div>
      <div v-if="currentRoundData" class="overflow-x-auto">
        <div class="rounded-md overflow-hidden border-0 border-surface-darker">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th
                  class="border-4 border-dotted rounded-md border-surface-darker bg-surface px-4 py-2 text-lg text-left font-semibold text-text"
                >
                  Тема
                </th>
                <th
                  v-for="cost in currentRoundData.costs"
                  :key="cost"
                  class="border-4 border-dotted border-surface-darker bg-surface px-4 py-2 text-lg text-center font-semibold text-text"
                >
                  {{ cost }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="theme in currentRoundData.themes" :key="theme.id">
                <td
                  class="border-4 border-dotted border-surface-darker bg-surface-alt px-4 py-3 font-lg text-base text-text"
                >
                  {{ theme.title }}
                </td>
                <td
                  v-for="cost in currentRoundData.costs"
                  :key="`${theme.id}-${cost}`"
                  class="border-4 border-dotted border-surface-darker bg-surface-alt px-2 pb-2.5 pt-1.5 text-center"
                >
                  <AppButtonSecondary
                    v-if="!questionsStore.isCellPlayed(gameStore.currentRound, theme.id, cost)"
                    :variant="getQuestionVariant(gameStore.currentRound, theme.id, cost)"
                    class="w-full h-[3rem]"
                    @click="selectQuestion(theme.id, cost)"
                  >
                    {{ cost }}
                  </AppButtonSecondary>
                  <AppButtonSecondary v-else variant="disabled" class="w-full h-[3rem]"></AppButtonSecondary>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="text-text-muted">Раунд не найден.</div>
      <PreQuestionModal v-model="showPreQuestionModal" :type="preQuestionType" :duration-ms="1500" @finished="openQuestionView" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import { useQuestionsStore } from '@/stores/questions'
  import { useSettingsStore } from '@/stores'
  import { AppButtonSecondary, TextWave } from '@/components/ui'
  import PlayerCard from '@/components/game/PlayerCard.vue'
  import PreQuestionModal from '@/components/game/PreQuestionModal.vue'

  type QuestionPreviewType = 'normal' | 'cat' | 'auction'

  const router = useRouter(),
    gameStore = useGameStore(),
    questionsStore = useQuestionsStore(),
    settingsStore = useSettingsStore()

  const showPreQuestionModal = ref(false),
    preQuestionType = ref<QuestionPreviewType>('normal')

  const currentRoundData = computed(() => questionsStore.getRoundById(gameStore.currentRound))

  const optimalCols = computed(() => {
    const n = gameStore.players.length
    if (n <= 0) return 1
    if (n <= 3) return n
    if (n === 4) return 2
    return 3
  })

  const playerCardStyle = computed(() => {
    const cols = optimalCols.value
    const gapRem = 1
    return { flex: `0 0 calc((100% - ${(cols - 1) * gapRem}rem) / ${cols})` }
  })

  function getQuestionVariant(roundId: number, themeId: string, cost: number): 'primary' | 'auc' | 'cat' {
    if (!settingsStore.devModeEnabled) return 'primary'
    const type = questionsStore.getQuestionTypeForCell(roundId, themeId, cost)
    if (type === 'cat') return 'cat'
    if (type === 'auction') return 'auc'
    return 'primary'
  }

  function selectQuestion(themeId: string, cost: number) {
    if (showPreQuestionModal.value) return
    const question = questionsStore.getQuestionForCell(gameStore.currentRound, themeId, cost)
    if (!question) return
    gameStore.setCurrentQuestion(question.id, question.cost)
    const questionType = questionsStore.getQuestionTypeForCell(gameStore.currentRound, themeId, cost)
    preQuestionType.value = questionType === 'cat' || questionType === 'auction' ? questionType : 'normal'
    showPreQuestionModal.value = true
  }

  function openQuestionView() {
    const currentQuestionId = gameStore.currentQuestionId
    if (currentQuestionId) {
      const question = questionsStore.getQuestionById(currentQuestionId)
      if (question?.type === 'auction') {
        const nominal =
          typeof gameStore.currentQuestionCellCost === 'number' &&
          Number.isFinite(gameStore.currentQuestionCellCost) &&
          gameStore.currentQuestionCellCost > 0
            ? gameStore.currentQuestionCellCost
            : question.cost
        const canSomeoneBid = gameStore.players.some((p) => p.score >= nominal)
        if (!canSomeoneBid) {
          gameStore.setPhase('question')
          router.push('/auction-random')
          return
        }
      }
    }
    gameStore.setPhase('question')
    router.push('/question')
  }
</script>