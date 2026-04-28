<template>
  <div class="absolute bottom-8 flex items-center justify-between">
    <div class="text-sm text-text-muted">
      Нажмите клавишу для ответа:
      <span
        v-for="player in props.gameStore.players"
        :key="player.id"
        class="ml-2"
      >
        <kbd
          :class="[
            'rounded px-2 py-1 font-mono',
            props.gameStore.hasPlayerAnswered(player.id)
              ? 'bg-surface-darker text-text-muted'
              : 'bg-primary/10 text-primary',
          ]"
        >
          {{ props.formatKeyDisplay(player.key) }}
        </kbd>
        <span class="ml-1 text-xs">{{ player.name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    gameStore: any
    formatKeyDisplay: (key: string) => string
  }>()
</script>

