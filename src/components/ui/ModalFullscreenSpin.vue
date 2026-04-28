<template>
  <component :is="teleport ? 'Teleport' : 'div'" :to="teleport ? 'body' : undefined">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-spin-title"
    >
      <div
        :key="animateKey"
        class="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-auto rounded-3xl border border-surface-dark bg-surface-alt p-8 shadow-xl"
        :class="{
          'modal-spin-in': modelValue,
          'modal-spin-out': !modelValue
        }"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      /** When false, render in place (no Teleport) so parent transitions (e.g. circle) clip this modal */
      teleport?: boolean
    }>(),
    { teleport: true }
  )

  const isVisible = ref(false)
  const animateKey = ref(0)
  let hideTimeout: number | null = null

  watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        if (hideTimeout !== null) {
          clearTimeout(hideTimeout)
          hideTimeout = null
        }
        animateKey.value += 1
        isVisible.value = true
      } else if (isVisible.value) {
        hideTimeout = window.setTimeout(() => {
          isVisible.value = false
          hideTimeout = null
        }, 400)
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  .modal-spin-in {
    animation: modal-spin-in 700ms cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
    transform-origin: center center;
    backface-visibility: hidden;
  }

  @keyframes modal-spin-in {
    0% {
      transform: scale(0.4) rotate(-360deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.08) rotate(15deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  .modal-spin-out {
    animation: modal-spin-out 400ms ease-in forwards;
    transform-origin: center center;
    backface-visibility: hidden;
  }

  @keyframes modal-spin-out {
    from {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    to {
      transform: scale(0.4) rotate(360deg);
      opacity: 0;
    }
  }
</style>