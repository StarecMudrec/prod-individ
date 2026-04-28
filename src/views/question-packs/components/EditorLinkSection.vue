<template>
  <section class="mb-6 rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
    <div class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="mb-1 text-lg font-semibold text-text">
          Редактор тем и вопросов
        </h2>
        <p class="text-sm text-text-muted">
          Открыть встроенный редактор для активного пакета: добавить новые темы и вопросы, изменить существующие.
        </p>
      </div>
      <RouterLink to="/packs/editor">
        <AppButton size="sm" variant="secondary">
          Открыть редактор
        </AppButton>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { AppButton } from '@/components/ui'
</script>

