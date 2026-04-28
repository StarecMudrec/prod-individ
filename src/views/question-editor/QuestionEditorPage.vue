<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 py-1.5">
    <div class="w-full max-w-5xl">
      <h1 class="mb-8 text-center text-7xl font-rampart text-text tracking-tight-negative text-stroke-1">
        Редактор тем и вопросов
      </h1>

      <p class="mb-6 text-center text-sm text-text-muted">
        Вы редактируете активный пакет вопросов. Можно изменить существующие темы и вопросы или добавить новые.
        Для надёжной работы игры сохраняйте структуру: 2 раунда, в каждом по 6 тем и 5 вопросов в теме.
      </p>

      <EditorTopBar
        :editor-modes="editorModes"
        :current-mode="currentMode"
        @set-mode="setMode"
        @save="save"
      />

      <RoundsSection
        v-if="currentMode === 'rounds'"
        :rounds="draft.rounds"
        :current-round-index="currentRoundIndex"
        :current-round="currentRound"
        :add-theme="addTheme"
        :remove-theme="removeTheme"
        :add-question="addQuestion"
        :on-accepted-answers-input="onAcceptedAnswersInput"
        @set-round-index="setRoundIndex"
      />

      <FinalSection
        v-else-if="currentMode === 'final'"
        :final-question="draft.finalQuestion"
        :on-final-accepted-input="onFinalAcceptedInput"
      />

      <SpecialSection
        v-else
        :rounds="draft.rounds"
        :current-round-index="currentRoundIndex"
        :current-round="currentRound"
        :add-special-question="addSpecialQuestion"
        :remove-special-question="removeSpecialQuestion"
        :on-accepted-answers-input="onAcceptedAnswersInput"
        @set-round-index="setRoundIndex"
      />

      <section v-if="errors.length" class="rounded-card border border-error/40 bg-error/5 p-4 text-sm text-error">
        <h2 class="mb-2 text-base font-semibold">
          Ошибки в структуре пакета
        </h2>
        <ul class="list-disc space-y-1 pl-5">
          <li v-for="(err, index) in errors" :key="index">
            {{ err }}
          </li>
        </ul>
      </section>

      <section v-if="infoMessage" class="mt-4 rounded-card border border-surface-dark bg-surface-alt p-3 text-sm text-text">
        {{ infoMessage }}
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorTopBar from './components/EditorTopBar.vue'
import FinalSection from './components/FinalSection.vue'
import RoundsSection from './components/RoundsSection.vue'
import SpecialSection from './components/SpecialSection.vue'
import type { EditorMode } from './useQuestionEditor'
import { useQuestionEditor } from './useQuestionEditor'

const {
  draft,
  editorModes,
  currentMode,
  currentRoundIndex,
  currentRound,
  errors,
  infoMessage,
  addTheme,
  removeTheme,
  addQuestion,
  onAcceptedAnswersInput,
  onFinalAcceptedInput,
  addSpecialQuestion,
  removeSpecialQuestion,
  save,
} = useQuestionEditor()

function setMode(mode: EditorMode) {
  currentMode.value = mode
}

function setRoundIndex(index: number) {
  currentRoundIndex.value = index
}
</script>

