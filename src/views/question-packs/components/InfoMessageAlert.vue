<template>
  <section
    v-if="message"
    class="mt-4 rounded-card border border-surface-dark bg-surface-alt p-3 text-sm text-text"
  >
    {{ message }}
  </section>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

