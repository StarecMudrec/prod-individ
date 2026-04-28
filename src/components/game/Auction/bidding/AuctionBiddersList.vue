<template>
  <div class="mb-6 rounded-2xl player-card-skin bg-surface-alt p-6 shadow-sm w-[56rem]">
    <div>
      <TransitionGroup
        name="auction-bidder-list"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="(player, index) in sortedPlayersForDisplay"
          :key="player.id"
          class="auction-bidder-row"
        >
          <div
            :class="[
              'player-card flex items-center justify-between rounded-lg p-3',
              isPlayerDisabled(player) && !isAuctionWinner(player) && 'player-disabled-stripes border-text opacity-75 scale-95',
              isAuctionWinner(player)
                ? 'border-2 border-solid border-amber-400 bg-amber-50 glow-victory'
                : index === 0
                  ? 'border-2 border-solid border-question-auc-text glow-auction bg-surface'
                  : 'border-dashed border-2 border-surface-darker bg-surface'
            ]"
          >
            <span class="font-normal font-rampart text-text text-2xl text-stroke-0-5">
              {{ player.name }}
              <span class="font-rampart text-xl text-text-muted text-nowrap text-stroke-0-5">
                ({{ player.score }} pts.)
              </span>
              <Transition name="auction-turn-indicator">
                <span
                  v-if="index === 0 && !auctionWinner"
                  class="ml-2 text-[1.5rem] text-question-auc-text tracking-tight inline-block"
                >
                  (ходит)
                </span>
              </Transition>
            </span>
            <span class="font-semibold text-text-muted font-rampart text-xl pl-4">
              <AnimatedScore :to="getAuctionBid(player.id) || 0">
                <template #default="{ animatedValue }">{{ animatedValue }}pts.</template>
              </AnimatedScore>
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@/types'
import AnimatedScore from '@/components/game/AnimatedScore.vue'

defineProps<{
  sortedPlayersForDisplay: Player[]
  getAuctionBid: (playerId: string) => number
  auctionWinner?: Player | null
  isPlayerDisabled: (player: Player) => boolean
  isAuctionWinner: (player: Player) => boolean
}>()
</script>
