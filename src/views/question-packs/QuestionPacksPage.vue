<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 py-1.5">
    <div class="w-full max-w-4xl">
      <h1 class="mb-6 text-center text-7xl font-rampart text-text tracking-tight-negative text-stroke-1">
        Пакеты   тем   и   вопросов
      </h1>

      <p class="mb-6 text-center text-sm text-text-muted">
        Здесь можно переключаться между наборами вопросов, импортировать новые пакеты из файла
        и экспортировать текущий пакет для редактирования или обмена.
      </p>

      <PacksListSection
        :packs-meta="packsMeta"
        :active-pack-id="activePackId"
        @make-active="makeActive"
        @rename="startRename"
        @delete="deleteUserPack"
      />

      <input
        :ref="setFileInput"
        type="file"
        accept="application/json"
        class="hidden"
        @change="handleFileChange"
      >
      <ImportExportCards
        @select-file="triggerFileSelect"
        @export="exportActive"
      />

      <EditorLinkSection />

      <ImportErrorsAlert :errors="importErrors" />

      <InfoMessageAlert :message="infoMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorLinkSection from './components/EditorLinkSection.vue'
import ImportErrorsAlert from './components/ImportErrorsAlert.vue'
import ImportExportCards from './components/ImportExportCards.vue'
import InfoMessageAlert from './components/InfoMessageAlert.vue'
import PacksListSection from './components/PacksListSection.vue'
import { useQuestionPacksPage } from './useQuestionPacksPage'
import type { ComponentPublicInstance } from 'vue'

const {
  packsMeta,
  activePackId,
  fileInput,
  importErrors,
  infoMessage,
  triggerFileSelect,
  handleFileChange,
  exportActive,
  makeActive,
  startRename,
  deleteUserPack,
} = useQuestionPacksPage()

function setFileInput(refEl: Element | ComponentPublicInstance | null, _refs: Record<string, any>) {
  fileInput.value = refEl as unknown as HTMLInputElement | null
}
</script>

