<template>
  <div class="flex flex-col items-center">
    <div class="mb-3">
      <h1 class="mb-12 text-5xl font-rampart text-stroke-1 text-question-cat-text text-center tracking-tight-less-negative">
        Кот в мешке !
      </h1>
      <p class="text-text-muted">
        Выберите игрока, которому передать этот вопрос
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <button
        v-for="player in players"
        :key="player.id"
        :disabled="player.id === questionChooserId"
        class="rounded-lg border-2 border-surface-dark bg-surface-alt p-4 text-left transition-all hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
        @click="$emit('select', player.id)"
      >
        <FittyText
          :text="player.name"
          tag="h2"
          fitty-class="font-rampart font-normal text-text"
          class="text-stroke-0-5"
          :min-size="12"
          :max-size="32"
        />
        <div class="mt-1 text-sm text-text-muted">
          <span class="font-rampart text-stroke-0-5">{{ player.score }}</span> очков
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Player } from '@/types/game'
  import { FittyText } from '@/components/ui'

  defineProps<{
    players: Player[]
    questionChooserId: string | null
  }>()

  defineEmits<{
    select: [playerId: string]
  }>()
</script>
