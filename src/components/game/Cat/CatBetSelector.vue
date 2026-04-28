<template>
  <p class="mb-16 text-5xl text-text text-stroke-0-5 tracking-tight-less-negative font-rampart">
    Сделайте ставку :
  </p>
  <div class="mb-6">
    <AppButton
      v-for="betOption in betOptions"
      :key="betOption"
      variant="catBet"
      class="font-rampart m-left text-stroke-0-5"
      @click="$emit('select', betOption)"
    >
      {{ betOption }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
  import { AppButton } from '@/components/ui';
  defineProps<{
    betOptions: number[]
  }>()

  defineEmits<{
    select: [bet: number]
  }>()
</script>

<style scoped>
  .m-left + .m-left {
    margin-left: 9rem;
  }
</style>
