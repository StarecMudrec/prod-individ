<template>
  <ModalFullscreen v-model="internalVisible" :no-pulse="true">
    <div class="pre-question-modal mx-auto w-full max-w-4xl pre-question-grow text-center">
      <div class="mt-2 mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Приготовьтесь к вопросу
      </div>
      <div class="mb-8 text-4xl text-stroke-1 font-rampart tracking-tight-less-negative text-shadow-sm pre-question-type-text" :class="typeTextClass">
        {{ typeLabel }}
      </div>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-dark  border-solid border-2 border-button-default">
        <div class="h-full w-full rounded-full bg-primary pre-question-progress"  :class="typeProgressBarClass"/>
      </div>
      <div class="mt-3 text-xs text-text-muted">
        Вопрос откроется через {{ remainingSeconds / 10}} сек.
      </div>
    </div>
  </ModalFullscreen>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { ModalFullscreen } from '@/components/ui'

  type QuestionPreviewType = 'normal' | 'cat' | 'auction'

  const props = defineProps<{
    modelValue: boolean
    type: QuestionPreviewType
    durationMs?: number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'finished'): void
  }>()

  const internalVisible = ref(props.modelValue)
  const remainingMs = ref(0)
  let timerId: number | null = null

  const durationMs = computed(() => props.durationMs ?? 1500)
  const remainingSeconds = computed(() =>
    Math.max(0, Math.ceil(remainingMs.value / 100)),
  )

  const typeLabel = computed(() => {
    if (props.type === 'cat') return 'Кот в мешке'
    if (props.type === 'auction') return 'Аукцион'
    return 'Обычный вопрос'
  })

  const typeTextClass = computed(() => {
    if (props.type === 'cat') return 'text-question-cat-text'
    if (props.type === 'auction') return 'text-question-auc-text'
    return 'text-question-norm-text'
  })

  const typeProgressBarClass = computed(() => {
    if (props.type === 'cat') return 'bg-question-cat-text'
    if (props.type === 'auction') return 'bg-question-auc-text'
    return 'bg-question-norm-text'
  })

  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  function startTimer() {
    clearTimer()
    const total = durationMs.value
    const startedAt = performance.now()
    remainingMs.value = total

    timerId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, total - elapsed)
      remainingMs.value = remaining

      if (remaining <= 0) {
        clearTimer()
        internalVisible.value = false
        emit('update:modelValue', false)
        emit('finished')
      }
    }, 100)
  }

  watch(
    () => props.modelValue,
    (v) => {
      internalVisible.value = v
      if (v) {
        startTimer()
      } else {
        clearTimer()
      }
    },
    { immediate: true },
  )

  watch(internalVisible, (v) => {
    if (!v && props.modelValue) {
      emit('update:modelValue', false)
    }
  })

  onBeforeUnmount(() => {
    clearTimer()
  })
</script>

<style scoped>
  .pre-question-grow {
    animation: pre-question-grow 3s ease-out forwards;
    transform-origin: center center;
  }

  @keyframes pre-question-grow {
    from {
      transform: scale(0.96);
    }

    to {
      transform: scale(1.04);
    }
  }

  .pre-question-progress {
    animation: pre-question-progress 1.5s linear forwards;
    transform-origin: left center;
  }

  .pre-question-type-text {
    font-size: 3rem;
  }

  @keyframes pre-question-progress {
    from {
      width: 0%;
    }

    to {
      width: 100%;
    }
  }
</style>