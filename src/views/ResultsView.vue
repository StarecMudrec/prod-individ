<template>
  <div class="results flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <h1 class="mb-16 text-center text-7xl font-bold text-text font-rampart ">
      Итоги:
    </h1>

    <div class="mb-8 w-fit min-w-3xl">
      <TransitionGroup
        name="round-summary-list"
        tag="div"
        class="flex flex-col items-center space-y-3"
      >
        <div
          v-for="(player, index) in sortedPlayers"
          :key="player.id"
          class="results-player-row"
        >
          <!-- <span
            v-if="index === 0"
            class="absolute -top-10 -left-56 origin-center -rotate-12 select-none text-2xl font-normal font-rampart text-stroke-1 uppercase tracking-wider text-amber-600"
          >
            Победитель
          </span>
          <img
            v-if="index === 0"
            src="/arrow.png"
            alt=""
            class="absolute -top-14 -left-36 w-44 h-44 origin-center -rotate-[45] select-none"
          > -->
          <div class="results-player-row-inner player-card-skin flex items-center justify-between bg-surface-alt px-4 py-2 gap-8">
            <img
              v-if="index === 0"
              src="/crown.svg"
              alt=""
              class="absolute -top-4 -left-4 h-8 w-8 -rotate-45"
            >
            <div class="font-semibold font-rampart text-2xl text-text pb-1">
              {{ player.name }}
            </div>
            <div class="flex items-center gap-3">
              <AnimatedScore
                :to="player.score"
                v-slot="{ animatedValue }"
              >
                <div
                  class="text-xl font-bold shrink-0 py-1 pb-1.5"
                  :class="
                    player.score > 0
                      ? 'text-success'
                      : player.score < 0
                      ? 'text-error'
                      : 'text-text-muted'
                  "
                >
                  <span class="text-text-muted text-2xl"></span> <span class="font-rampart text-stroke-thin text-2xl">{{ animatedValue }} pts.</span>
                </div>
              </AnimatedScore>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="flex flex-col items-center gap-4">
      <AppButton @click="restartGame">
        Сыграть ещё раз
      </AppButton>
      <router-link to="/" class="text-center text-text font-normal hover:text-shadow-sm">
        ← На главную
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import type { Player } from '@/types'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/stores/game'
  import { useQuestionsStore } from '@/stores/questions'
  import { AppButton } from '@/components/ui'
  import AnimatedScore from '@/components/game/AnimatedScore.vue'

  const router = useRouter()
  const gameStore = useGameStore()
  const questionsStore = useQuestionsStore()

  const sortingApplied = ref(false)
  let sortingTimer: ReturnType<typeof setTimeout> | undefined

  const realSortedPlayers = computed(() =>
    [...gameStore.players].sort((a, b) => b.score - a.score)
  )
  const frozenOrder = ref<Player[] | null>(null)

  const sortedPlayers = computed(() => {
    if (!sortingApplied.value) return gameStore.players
    return frozenOrder.value ?? realSortedPlayers.value
  })

  function restartGame() {
    questionsStore.reset()
    gameStore.reset()
    router.push('/setup')
  }

  onMounted(() => {
    if (!gameStore.players.length) {
      router.push('/setup')
      return
    }
    if (gameStore.phase !== 'results') {
      gameStore.setPhase('results')
    }
    sortingTimer = setTimeout(() => {
      sortingApplied.value = true
    }, 300)
  })
  onUnmounted(() => {
    if (sortingTimer) clearTimeout(sortingTimer)
  })
</script>

<style scoped>
  .results-player-row {
    position: relative;
  }
</style>
