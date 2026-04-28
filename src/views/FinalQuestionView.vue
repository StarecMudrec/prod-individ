<template>
  <div class="question flex h-screen max-h-screen min-h-0 flex-col items-center justify-center overflow-y-auto">
    <div class="question-content-expand flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4">
      <div class="text-7xl mt-12 font-bold font-rampart" :class="timerClass">{{ Math.ceil(timeRemaining / 1000) }}</div>
      <div class="text-xl mb-2 flex items-end flex-row flex-nowrap justify-between px-3 w-full text-shadow-sm">
        <h1 class="text-text">{{ themeTitle }}</h1>
        <div class="text-text text-xl">Ставка: <span class="font-semibold font-rampart text-2xl">{{ bet }} pts.</span></div>
      </div>
      <div class="question-container mb-6 rounded-lg border border-surface-dark bg-surface-alt p-6 shadow-sm">
        <p class="font-bold text-2xl text-text text-center">{{ questionText }}</p>
        <div class="answer-section answer-section--open flex flex-col items-center">
          <div class="answer-block-inner">
            <div class="mb-4 mt-8 rounded-lg answer-block-item flex justify-center">
              <div class="flex flex-row items-center text-text-muted text-xl">
                <p class="font-semibold">Отвечает:</p>
                <p class="player-name-wave font-semibold font-rampart text-2xl">
                  <span
                    v-for="(char, i) in (displayedPlayer?.name ?? '')"
                    :key="`${i}-${char}`"
                    class="player-name-wave__char inline-block"
                    :style="{ animationDelay: `${i * 0.07}s` }"
                  >{{ char === ' ' ? '\u00A0' : char }}</span>
                </p>
              </div>
            </div>
            <div class="space-y-4 mb-1 answer-block-item answer-block-item--delay flex flex-col items-center">
              <ElasticTextarea
                v-model="answer"
                :disabled="isSubmitting"
                :error="false"
                :maxlength="ANSWER_MAX_LENGTH"
                input-class="w-full rounded-button border-2 border-surface-darker px-4 py-2 text-[17px] text-text font-rampart font-bold placeholder-surface-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                @keydown.enter="submitAnswer"
              />
              <AppButton :disabled="!answer.trim() || isSubmitting" @click="submitAnswer">Ответить</AppButton>
            </div>
          </div>
        </div>
        <div class="dev-section" :class="{ 'dev-section--open': settingsStore.devModeEnabled }">
          <Transition name="dev-mode">
            <div v-if="settingsStore.devModeEnabled" class="dev-section__content mt-4 rounded-md bg-dev-sec p-3 text-sm text-dev-text">
              <span class="font-semibold">Правильный ответ (dev):</span>
              <span class="ml-1">{{ correctAnswer }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <ModalFullscreenSpin v-model="showTimeoutModal">
      <div class="text-center text-5xl font-bold font-rampart tracking-tight-less-negative pb-3 text-text">Время вышло !</div>
    </ModalFullscreenSpin>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'; import { useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/game'; import { useSettingsStore } from '@/stores';
  import { useQuestionsStore } from '@/stores/questions'; import { AppButton, ElasticTextarea, ModalFullscreenSpin } from '@/components/ui';
  import { ANSWER_MAX_LENGTH, FINAL_QUESTION_TIMEOUT_MS } from '@/lib/constants';

  const router = useRouter(), gameStore = useGameStore(), settingsStore = useSettingsStore(), questionsStore = useQuestionsStore();

  const finalQuestion = computed(() => questionsStore.getFinalQuestion());
  const themeTitle = computed(() => finalQuestion.value.themeTitle);
  const questionText = computed(() => finalQuestion.value.text);
  const correctAnswer = computed(() => finalQuestion.value.correctAnswer);

  const finalPlayers = computed(() => gameStore.finalPlayers);
  const currentAnsweringPlayerIndex = computed(() => gameStore.finalCurrentPlayerIndex ?? 0);
  const currentAnsweringPlayer = computed(() => finalPlayers.value[currentAnsweringPlayerIndex.value] ?? null);

  const displayedPlayer = ref<{ id: string; name: string } | null>(null);
  const bet = computed(() => (displayedPlayer.value ? gameStore.getFinalBet(displayedPlayer.value.id) : 0));

  const answer = ref(''), timeRemaining = ref(FINAL_QUESTION_TIMEOUT_MS), timerInterval = ref<number | null>(null), showTimeoutModal = ref(false), isSubmitting = ref(false);

  const timerClass = computed(() => {
    const seconds = Math.ceil(timeRemaining.value / 1000);
    if (seconds <= 5) return 'text-error text-stroke-1';
    if (seconds <= 15) return 'text-warning text-stroke-1';
    return 'text text-stroke-1';
  });

  function startTimer() {
    if (timerInterval.value) clearInterval(timerInterval.value);
    timeRemaining.value = FINAL_QUESTION_TIMEOUT_MS;
    const startedAt = performance.now();
    timerInterval.value = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, FINAL_QUESTION_TIMEOUT_MS - elapsed);
      timeRemaining.value = remaining;
      if (remaining <= 0) handleTimeout();
    }, 100);
  }
  function stopTimer() {
    if (!timerInterval.value) return;
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  function handleTimeout() {
    stopTimer();
    const player = currentAnsweringPlayer.value;
    if (player && !gameStore.finalAnswers.has(player.id)) gameStore.setFinalAnswer(player.id, '');
    showTimeoutModal.value = true;
    setTimeout(() => {
      showTimeoutModal.value = false;
      advanceAndReturn();
    }, 1500);
  }
  function submitAnswer() {
    if (isSubmitting.value) return;
    const player = currentAnsweringPlayer.value;
    if (!player || !answer.value.trim()) return;
    isSubmitting.value = true;
    stopTimer();
    gameStore.setFinalAnswer(player.id, answer.value.trim());
    advanceAndReturn();
  }
  function advanceAndReturn() {
    if (currentAnsweringPlayerIndex.value + 1 < finalPlayers.value.length) gameStore.finalCurrentPlayerIndex = currentAnsweringPlayerIndex.value + 1;
    router.push('/final');
  }
  onMounted(() => {
    const player = currentAnsweringPlayer.value;
    displayedPlayer.value = player;
    if (!player) {
      router.push('/final');
      return;
    }
    answer.value = gameStore.getFinalAnswer(player.id) || '';
    startTimer();
  });
  onUnmounted(() => stopTimer());
</script>

<style scoped>
  .question-content-expand{animation:content-expand 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;transform-origin:center center;}
  @keyframes content-expand{from{opacity:0;transform:scale(0.88);}to{opacity:1;transform:scale(1);}}
  .question-container{transition:padding 0.35s cubic-bezier(0.4,0,0.2,1),box-shadow 0.35s cubic-bezier(0.4,0,0.2,1);}
  .answer-section{overflow:visible;max-height:none;}
  .dev-section{overflow:hidden;max-height:0;transition:max-height 0.4s cubic-bezier(0.4,0,0.2,1);}
  .dev-section--open{max-height:120px;}
  .answer-block-item{opacity:0;transform:translateY(8px);animation:answer-item-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards;}
  .answer-block-item--delay{animation-delay:0.1s;}
  @keyframes answer-item-in{to{opacity:1;transform:translateY(0);}}
  .player-name-wave{display:inline-flex;flex-wrap:wrap;}
  .player-name-wave__char{animation:wave-char 1.4s ease-in-out infinite;}
  @keyframes wave-char{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
</style>