<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        class="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-auto rounded-3xl border border-surface-dark bg-surface-alt p-8 shadow-xl"
        :class="{
          'modal-fullscreen-zoom-in': modelValue && props.noPulse,
          'modal-fullscreen-zoom-out': !modelValue,
          'modal-fullscreen-pulse': modelValue && !props.noPulse
        }"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{ 
    modelValue: boolean
    noPulse?: boolean
  }>()

  const isVisible = ref(false)
  let hideTimeout: number | null = null

  watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        if (hideTimeout !== null) {
          clearTimeout(hideTimeout)
          hideTimeout = null
        }
        isVisible.value = true
      } else if (isVisible.value) {
        hideTimeout = window.setTimeout(() => {
          isVisible.value = false
          hideTimeout = null
        }, 220)
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  .modal-fullscreen-zoom-in {
    animation: modal-fullscreen-zoom-in 300ms ease-out forwards;
    transform-origin: center center;
  }

  @keyframes modal-fullscreen-zoom-in {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }

    50% {
      transform: scale(1.01);
      opacity: 1;
    }

    75% {
      transform: scale(0.98);
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .modal-fullscreen-zoom-out {
    animation: modal-fullscreen-zoom-out 300ms ease-in forwards;
    transform-origin: center center;
  }

  @keyframes modal-fullscreen-zoom-out {
    from {
      transform: scale(1);
      opacity: 1;
    }

    to {
      transform: scale(0.8);
      opacity: 0;
    }
  }

  .modal-fullscreen-pulse {
    animation: 
      modal-fullscreen-zoom-in 300ms ease-out forwards,
      modal-fullscreen-pulse 3.5s ease-in-out 3.5s infinite;
  }

  @keyframes modal-fullscreen-pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
    }

    50% {
      transform: scale(1.01);
      box-shadow: 0 25px 30px -5px rgb(0 0 0 / 0.15), 0 15px 15px -5px rgb(0 0 0 / 0.06);
    }
  }
</style>
