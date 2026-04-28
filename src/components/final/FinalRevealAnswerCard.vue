<template>
  <div class="final-reveal-answer-card mb-6" :class="{ 'final-reveal-answer-card--pre-flip': !revealed && clickable, 'final-reveal-answer-card--post-flip': postFlipActive }">
    <div class="final-reveal-answer-card__shake-wrapper" :class="{ 'final-reveal-answer-card__shake-wrapper--shake': screenShakeActive }">
      <div class="final-reveal-answer-card__card-wrapper" :class="{ 'final-reveal-answer-card__card-wrapper--post-flip': postFlipActive, 'final-reveal-answer-card__card-wrapper--hold-expanded': holdExpanded }">
        <FlipRevealBox
          :visible="revealed"
          :duration="flipDurationMs"
          axis="y"
          class="cursor-pointer h-full"
          :class="{ 'pointer-events-none': !clickable }"
          @click="handleClick"
          @flip-complete="onFlipComplete"
        >
          <template #back>
            <div class="player-card-skin flex h-full flex-col items-center justify-center bg-surface-alt">
              <p class="w-full text-center font-rampart text-stroke-0-5 tracking-tight-less-negative">
                <FittyText
                  text="ПОКАЗАТЬ   ОТВЕТ"
                  fitty-class="font-normal font-rampart text-stroke-0-5 text-text pl-4 pr-5 py-1"
                  :min-size="12"
                  :max-size="48"
                  :cleanup-delay-ms="400"
                />
              </p>
            </div>
          </template>
          <div class="player-card-skin bg-surface-alt text-center h-full">
            <FittyText
              :text="correctAnswer"
              fitty-class="font-normal font-rampart text-stroke-0-5 text-text"
              :min-size="12"
              :max-size="48"
              :cleanup-delay-ms="400"
            />
          </div>
        </FlipRevealBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FlipRevealBox, FittyText } from '@/components/ui'

const props = withDefaults(defineProps<{
  correctAnswer: string
  revealed: boolean
  clickable: boolean
  flipDurationMs?: number
}>(), { flipDurationMs: 500 })

const emit = defineEmits<{
  click: []
  flipComplete: []
}>()

const postFlipActive = ref(false)
const holdExpanded = ref(false)
const screenShakeActive = ref(false)
let shakeStartTimer: ReturnType<typeof setTimeout> | null = null
let shakeEndTimer: ReturnType<typeof setTimeout> | null = null

function handleClick() {
  if (props.clickable) {
    holdExpanded.value = true
    emit('click')
  }
}

function onFlipComplete() {
  holdExpanded.value = false
  postFlipActive.value = true
  emit('flipComplete')
  if (shakeStartTimer) clearTimeout(shakeStartTimer)
  if (shakeEndTimer) clearTimeout(shakeEndTimer)
  shakeStartTimer = setTimeout(() => {
    screenShakeActive.value = true
    shakeStartTimer = null
    shakeEndTimer = setTimeout(() => {
      screenShakeActive.value = false
      shakeEndTimer = null
    }, 320)
  }, 180)
}

watch(() => props.revealed, (v) => {
  if (!v) {
    holdExpanded.value = false
    postFlipActive.value = false
    screenShakeActive.value = false
    if (shakeStartTimer) clearTimeout(shakeStartTimer)
    if (shakeEndTimer) clearTimeout(shakeEndTimer)
  }
})
</script>

<style scoped>
.final-reveal-answer-card { width: 100%; max-width: 30rem; margin-left: auto; margin-right: auto; }
.final-reveal-answer-card--pre-flip .final-reveal-answer-card__card-wrapper {
  animation:
    answer-card-pre-flip-expand 10s cubic-bezier(0.33, 0, 0.2, 1) forwards,
    answer-card-shake-ramp 10s linear forwards;
}
.final-reveal-answer-card--pre-flip .final-reveal-answer-card__card-wrapper :deep(.flip-reveal-box) { animation: horizontal-shaking 0.35s infinite; will-change: transform; }
.final-reveal-answer-card__card-wrapper--post-flip { animation: scale-down-center 0.4s cubic-bezier(0.83, -0.38, 0.27, 1.55) both; }
.final-reveal-answer-card__shake-wrapper--shake { animation: answer-card-screen-shake 0.36s cubic-bezier(0.33, 0, 0.2, 1) forwards; will-change: transform; }
.final-reveal-answer-card__card-wrapper { transform-origin: center center; }
.final-reveal-answer-card__card-wrapper--hold-expanded { transform: scale(1.2); }
.final-reveal-answer-card__shake-wrapper { display: inline-block; width: 100%; }
@property --shake-amp { syntax: '<length>'; initial-value: 0px; inherits: true; }
@keyframes answer-card-pre-flip-expand { 0% { transform: scale(1); } 100% { transform: scale(1.2); } }
@keyframes answer-card-shake-ramp { 0% { --shake-amp: 0px; } 100% { --shake-amp: 5px; } }
@keyframes horizontal-shaking { 0% { transform: translateX(0); } 25% { transform: translateX(var(--shake-amp, 0px)); } 50% { transform: translateX(calc(-1 * var(--shake-amp, 0px))); } 75% { transform: translateX(var(--shake-amp, 0px)); } 100% { transform: translateX(0); } }
@keyframes scale-down-center { 0% { transform: scale(1.2); } 100% { transform: scale(1); } }
@keyframes answer-card-screen-shake { 0% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(2px); } 100% { transform: translateX(0); } }
.final-reveal-answer-card__card-wrapper,
.final-reveal-answer-card__shake-wrapper { backface-visibility: hidden; transform: translateZ(0); }
</style>
