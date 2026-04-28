<template>
  <section v-if="errors.length" class="rounded-card border border-error/40 bg-error/5 p-4 text-sm text-error">
    <h2 class="mb-2 text-base font-semibold">
      Ошибки при импорте пакета
    </h2>
    <ul class="list-disc space-y-1 pl-5">
      <li v-for="(err, index) in errors" :key="index">
        {{ err }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  errors: string[]
}>()
</script>

