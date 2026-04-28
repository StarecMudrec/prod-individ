<template>
  <div class="setup flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <h1 class="mb-16 mt-24 text-center text-7xl text-text font-rampart tracking-tight-negative text-stroke-1">
      Подготовка   игры
    </h1>
    <div class="mx-auto max-w-xs font-bold font-faberge tracking-widest text-text-muted">
      <label for="player-count" class="mb-1 block text-center text-text">
        Количество игроков:
      </label>
      <NumberInput
        id="player-count"
        v-model="playerCount"
        :min="MIN_PLAYERS"
        :max="MAX_PLAYERS"
        :step="1"
      />
      <div class="flex flex-col items-center gap-2 pt-6">
        <AppButton @click="goToModals">
          Продолжить
        </AppButton>
        <router-link to="/" class="text-text font-normal hover:text-shadow-sm">
          ← На главную
        </router-link>
      </div>
    </div>
    <p class="mt-6 p-4 max-w-xl text-center font-normal font-faberge text-sm border-4 rounded-xl border-dashed border-surface-dark text-text-muted-alot text-shadow-sm">
      Каждый игрок вводит имя и получает свою клавишу для ответа во время вопроса.
      Выберите количество участников (от 2 до 6).
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import { AppButton, NumberInput } from '@/components/ui'
  import {
    MIN_PLAYERS,
    MAX_PLAYERS,
  } from '@/lib/constants'

  const router = useRouter()
  const gameStore = useGameStore()

  const initialCount =
    gameStore.players.length >= MIN_PLAYERS && gameStore.players.length <= MAX_PLAYERS
      ? gameStore.players.length
      : 3
  const playerCount = ref(initialCount)

  function goToModals() {
    router.push({
      path: '/game-start',
      query: {
        setup: 'true',
        count: playerCount.value.toString(),
      },
    })
  }
</script>