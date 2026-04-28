<template>
  <div class="game-start flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <Transition name="fade-in">
      <div v-if="showContent" class="game-start-content">
        <h1 class="mb-12 text-center text-6xl font-normal font-rampart tracking-tight-less-negative text-text text-stroke-1">
          Участники :
        </h1>
        <p class="mb-4 text-center text-text-muted">
          Проверьте состав и нажмите «Начать игру», чтобы перейти к табло.
        </p>

        <div class="mb-10 flex w-full flex-wrap justify-center gap-4">
          <div
            v-for="p in gameStore.players"
            :key="p.id"
            class="min-w-0"
            :style="playerCardStyle"
          >
            <PlayerCard :player="p" />
          </div>
        </div>

        <div class="flex flex-col items-center gap-2">
          <AppButton @click="startGame">
            Начать игру
          </AppButton>
          <router-link to="/setup" class="text-text font-normal hover:text-shadow-sm">
            ← Изменить состав
          </router-link>
        </div>
      </div>
    </Transition>

    <ModalFullscreen v-if="showSetupModals" v-model="modalOpen">
      <div class="rounded-card flex flex-col gap-[17px] border-2 border-surface-dark bg-surface-alt px-6 pt-[17px] pb-[17px] shadow-sm">
        <label :for="`player-${currentPlayerIndex}`" class="block text-center text-6xl font-medium font-rampart tracking-tight-negative text-text text-stroke-1">
          Игрок  {{ currentPlayerIndex + 1 }}
        </label>
        <div class="mt-0 flex flex-col items-center justify-start gap-0">
          <div class="min-w-0 flex-1">
            <label :for="`player-${currentPlayerIndex}`" class="mb-1 mt-2 block text-sm font-medium text-text-muted">
              Имя:
            </label>
            <div class="flex w-full flex-col items-center">
              <ElasticTextarea
                :id="`player-${currentPlayerIndex}`"
                :model-value="names[currentPlayerIndex]"
                :maxlength="PLAYER_NAME_MAX_LENGTH"
                :error="!!errors[currentPlayerIndex]"
                autocomplete="off"
                input-class="w-full rounded-button border-2 border-surface-darker px-4 py-2 text-[17px] text-text font-rampart font-bold placeholder-surface-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                @update:model-value="(v) => (names[currentPlayerIndex] = v ?? '')"
                @blur="validateName(currentPlayerIndex)"
                @input="errors[currentPlayerIndex] = ''"
              />
              <Transition name="error-message">
                <p v-if="errors[currentPlayerIndex]" class="mt-0 mb-2 text-sm text-error">
                  {{ errors[currentPlayerIndex] }}
                </p>
              </Transition>
            </div>
          </div>
          <div class="flex shrink-0 mt-2 items-center gap-2 rounded-lg bg-surface border-2 border-dashed px-4 py-1">
            <span class="text-md text-text-muted">Клавиша:</span>
            <kbd class="rounded bg-surface-alt px-2.5 py-1 font-mono text-lg text-text shadow-md">
              {{ currentPlayerKey.display }}
            </kbd>
            <button
              type="button"
              class="rounded bg-surface-darker p-1 text-text-muted hover:bg-surface-dark hover:text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Изменить клавишу"
              @click="openKeyChangeModal"
              @keydown.enter.prevent
              @keydown.space.prevent
            >
              <img src="/arrows-change.svg" alt="" class="size-5 stroke-text-muted fill-text-muted p-1" />
            </button>
          </div>
        </div>
        <div class="mt-0 flex justify-center">
          <AppButton :disabled="!canConfirmCurrent" @click="confirmPlayer">
            {{ currentPlayerIndex < playerCount - 1 ? 'Далее' : 'Готово' }}
          </AppButton>
        </div>
      </div>
    </ModalFullscreen>

    <Teleport to="body">
      <Transition name="key-modal">
        <div
          v-if="showKeyChangeModal"
          class="fixed inset-0 z-[1060] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Назначение клавиши"
        >
          <div
            class="rounded-card border-2 border-surface-dark bg-surface-alt px-8 py-10 shadow-xl"
            @click.stop
          >
            <p class="text-center text-5xl font-medium font-rampart tracking-tight-less-negative text-text">
              Нажмите любую клавишу
            </p>
            <p class="mt-2 text-center text-sm text-text-muted">
              Escape — отмена
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { AppButton, ElasticTextarea, ModalFullscreen } from '@/components/ui'
  import PlayerCard from '@/components/game/PlayerCard.vue'
  import { useGameStart } from '@/composables/useGameStart'

  const {
    gameStore,
    showSetupModals,
    modalOpen,
    playerCount,
    currentPlayerIndex,
    names,
    errors,
    showKeyChangeModal,
    validateName,
    currentPlayerKey,
    playerCardStyle,
    showContent,
    canConfirmCurrent,
    openKeyChangeModal,
    confirmPlayer,
    startGame,
    PLAYER_NAME_MAX_LENGTH,
  } = useGameStart()
</script>

<style scoped src="./GameStartView.css"></style>