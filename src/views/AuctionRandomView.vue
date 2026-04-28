<template>
  <div class="question -my-6">
    <div class="flex min-h-[100vh] items-center justify-center">
      <ModalFullscreenSpin v-model="showIntroModal">
        <div class="flex flex-col items-center justify-center">
          <h2
            id="modal-spin-title"
            class="mb-4 text-5xl font-normal text-text font-rampart text-center tracking-tight-less-negative text-stroke-1"
          >
            Никто не может ставить !
          </h2>
          <p class="mb-2 text-center text-text-muted text-xl">
            Поэтому игрок для ответа будет выбран случайно!
          </p>
        </div>
      </ModalFullscreenSpin>

      <div class="">
        <div
          v-if="hasStartedRandom"
          class="mt-8 flex flex-col items-center justify-center"
        >
          <div class="auction-random-card mb-4">
            <div
              class="auction-random-card__shake-wrapper"
              :class="{
                'auction-random-card__shake-wrapper--shake': screenShakeActive,
              }"
            >
              <div
                class="auction-random-card__card-wrapper"
                :class="{
                  'auction-random-card__card-wrapper--pre-flip':
                    hasStartedRandom && !postFlipActive,
                  'auction-random-card__card-wrapper--post-flip': postFlipActive,
                }"
              >
                <FlipRevealBox
                  :delay="0"
                  :duration="FLIP_DURATION_MS"
                  axis="x"
                  :visible="shouldFlip"
                  class="w-screen"
                  @flipComplete="handleFlipComplete"
                >
                  <template #back>
                    <div
                      class="mb-4 rounded-2xl bg-surface w-screen px-10 py-6  text-center"
                    >
                      <span class="text-2xl text-text-muted">Отвечает:</span>
                      <div
                        class="font-rampart font-semibold text-text text-stroke-0-5 text-6xl"
                      >
                        {{ funnySymbols.join('') }}
                      </div>
                    </div>
                  </template>
                  <div
                    class="mb-4 rounded-2xl bg-surface w-screen px-10 py-6 text-center"
                  >
                    <span class="text-2xl text-text-muted">Отвечает:</span>
                    <div
                      class="font-rampart font-semibold text-text text-stroke-0-5 text-6xl"
                    >
                      {{ currentName }}
                    </div>
                  </div>
                </FlipRevealBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ModalFullscreenSpin, FlipRevealBox } from '@/components/ui'
  import { useAuctionRandom, FLIP_DURATION_MS } from '@/composables/useAuctionRandom'
  import './auction-random-keyframes.css'

  const {
    currentName,
    showIntroModal,
    hasStartedRandom,
    shouldFlip,
    funnySymbols,
    postFlipActive,
    screenShakeActive,
    handleFlipComplete,
  } = useAuctionRandom()
</script>

<style scoped>
.auction-random-card__card-wrapper {
  transform-origin: center center;
}

.auction-random-card__card-wrapper--pre-flip {
  animation: auction-random-pre-flip-expand 3.35s cubic-bezier( 0.60, 0.04, 0.98, 0.34 ) forwards;
}

.auction-random-card__card-wrapper--post-flip {
  animation: scale-down-center 0.4s
    cubic-bezier(0.83, -0.38, 0.27, 1.55) both;
}

.auction-random-card__shake-wrapper--shake {
  animation: answer-card-screen-shake 0.36s
    cubic-bezier(0.33, 0, 0.2, 1) forwards;
  will-change: transform;
}

.auction-random-card__shake-wrapper {
  display: inline-block;
  width: 100%;
}

.auction-random-card,
.auction-random-card__shake-wrapper {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
