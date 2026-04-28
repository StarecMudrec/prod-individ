<template>
  <NormalQuestionView v-if="displayedQuestionType === 'normal'" />
  <CatQuestionView v-else-if="displayedQuestionType === 'cat'" />
  <AuctionQuestionView v-else-if="displayedQuestionType === 'auction'" />
  <div v-else class="question pt-20">
    <p class="text-center text-text text-3xl text-stroke-0-5 font-rampart">Вопрос не найден</p>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useGameStore } from '@/stores/game'
  import { useQuestionsStore } from '@/stores/questions'
  import NormalQuestionView from './NormalQuestionView.vue'
  import CatQuestionView from './CatQuestionView.vue'
  import AuctionQuestionView from './AuctionQuestionView.vue'

  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()

  const questionTypeStore = computed(() => {
    if (!gameStore.currentQuestionId) return null
    const q = questionsStore.getQuestionById(gameStore.currentQuestionId)
    return q?.type ?? null
  })

  const lastValidType =ref<null | 'normal' | 'cat' | 'auction'>(null)
  watch(questionTypeStore, (t) => {
    if (t!=null) lastValidType.value = t
  }, { immediate: true })
  const displayedQuestionType=computed(() => questionTypeStore.value ?? lastValidType.value)
</script>
