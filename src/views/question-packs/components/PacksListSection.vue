<template>
  <section class="mb-8 rounded-card border border-surface-dark bg-surface-alt p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold text-text">
      Доступные пакеты
    </h2>
    <div v-if="packsMeta.length" class="space-y-2">
      <div
        v-for="pack in packsMeta"
        :key="pack.id"
        class="flex flex-col gap-2 rounded-md border border-surface-dark bg-surface px-3 py-2"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="truncate text-base font-semibold text-text">
              {{ pack.name }}
            </p>
            <span
              v-if="pack.id === activePackId"
              class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              Активный
            </span>
            <span
              v-if="pack.builtIn"
              class="inline-flex items-center rounded-full bg-surface-dark px-2 py-0.5 text-xs font-medium text-text-muted"
            >
              Встроенный
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <AppButton
            size="sm"
            :variant="pack.id === activePackId ? 'secondary' : 'primary'"
            :disabled="pack.id === activePackId"
            @click="$emit('makeActive', pack.id)"
          >
            Сделать активным
          </AppButton>
          <AppButton
            v-if="!pack.builtIn"
            size="sm"
            variant="secondary"
            @click="$emit('rename', pack.id, pack.name)"
          >
            Переименовать
          </AppButton>
          <AppButton
            v-if="!pack.builtIn"
            size="sm"
            variant="secondary"
            text-class="text-error"
            @click="$emit('delete', pack.id)"
          >
            Удалить
          </AppButton>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-text-muted">
      Пока нет пользовательских пакетов. Можно импортировать первый пакет ниже.
    </p>
  </section>
</template>

<script setup lang="ts">
import { AppButton } from '@/components/ui'

defineProps<{
  packsMeta: Array<{ id: string; name: string; builtIn: boolean }>
  activePackId: string
}>()

defineEmits<{
  (e: 'makeActive', id: string): void
  (e: 'rename', id: string, currentName: string): void
  (e: 'delete', id: string): void
}>()
</script>

