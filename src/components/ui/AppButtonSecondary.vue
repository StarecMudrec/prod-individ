<template>
  <button
    type="button"
    :class="['btn-sketch-root', buttonClass, textClass]"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span class="btn-sketch font-faberge">
      <span v-if="loading" class="btn-sketch__loader" aria-hidden="true" />
      <slot v-else />
    </span>
  </button>
</template>
<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      variant?: 'primary' | 'auc' | 'cat' | 'disabled'
      disabled?: boolean
      loading?: boolean
      textClass?: string
    }>(),
    { variant: 'primary', disabled: false, loading: false, textClass: '' }
  )

  const isDisabled = computed(
    () => props.disabled || props.loading || props.variant === 'disabled'
  )

  const buttonClass = computed(() => {
    const variants = {
      primary: 'btn-sketch--primary',
      auc: 'btn-sketch--auc',
      cat: 'btn-sketch--cat',
      disabled: 'btn-sketch--disabled',
    }
    return variants[props.variant]
  })

  const textClass = computed(() => props.textClass || '')

  const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

  function onClick(event: MouseEvent) {
    if (isDisabled.value) return
    emit('click', event)
  }
</script>
<style scoped>
  .btn-sketch-root {
    display: flex;
  }
  [class*="btn-sketch--"]:focus {
    outline: none;
  }
  [class*="btn-sketch--"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .btn-sketch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 0;
    min-width: 0;
    min-height: 25px;
    padding: 1.5rem 3rem;
    border-radius: 5px;
    border: 2px solid #000;
    box-shadow: 0 2px 0 #000;
    transition: background 0.2s ease-out, box-shadow 0.2s ease-out, transform 0.2s ease-out;
  }
  [class*="btn-sketch--"]:hover:not(:disabled) .btn-sketch {
    box-shadow: 0 2px 0 #000, 0 2px 0 2px #f03755;
  }
  [class*="btn-sketch--"]:active:not(:disabled) .btn-sketch {
    transform: translateY(4px);
    box-shadow: 0 1px 0 #000;
  }
  .btn-sketch--primary .btn-sketch {
    background: rgb(var(--color-button-bg-default));
    border-color: rgb(var(--color-button-default));
    color: rgb(var(--color-button-default));
    box-shadow: 0 2px 0 rgb(var(--color-button-default));
  }
  .btn-sketch--primary:hover:not(:disabled) .btn-sketch {
    box-shadow: 0 2px 0 rgb(var(--color-button-default)), 0 2px 0 2px rgb(var(--color-button-hover-default));
  }
  .btn-sketch--primary:active:not(:disabled) .btn-sketch {
    box-shadow: 0 1px 0 rgb(var(--color-button-default));
  }
  .btn-sketch--auc .btn-sketch {
    background: rgb(var(--color-question-auc-secondary));
  }
  .btn-sketch--auc:hover:not(:disabled) .btn-sketch {
    background: rgb(var(--color-question-auc));
    box-shadow: 0 2px 0 rgb(var(--color-button-default)), 0 2px 0 2px rgb(var(--color-question-auc));
  }
  .btn-sketch--auc:active:not(:disabled) .btn-sketch {
    box-shadow: 0 1px 0 rgb(var(--color-question-auc));
  }
  .btn-sketch--cat .btn-sketch {
    background: rgb(var(--color-question-cat-secondary));
  }
  .btn-sketch--cat:hover:not(:disabled) .btn-sketch {
    background: rgb(var(--color-question-cat));
    box-shadow: 0 2px 0 rgb(var(--color-button-default)), 0 2px 0 2px rgb(var(--color-question-cat));
  }
  .btn-sketch--cat:active:not(:disabled) .btn-sketch {
    box-shadow: 0 1px 0 rgb(var(--color-question-cat));
  }
  .btn-sketch--disabled .btn-sketch {
    background: linear-gradient(
      45deg,
      rgb(var(--color-button-default) / 1) 15%,
      transparent 15%,
      transparent 50%,
      rgb(var(--color-button-default) / 1) 50%,
      rgb(var(--color-button-default) / 1) 65%,
      transparent 65%
    );
    background-size: 10px 10px;
    cursor: default;
  }
  .btn-sketch--outline .btn-sketch {
    background: transparent;
  }
  .btn-sketch--dev .btn-sketch {
    background: rgb(var(--color-button-bg-dev));
    border-color: rgb(var(--color-button-dev));
    color: rgb(var(--color-button-dev));
  }
  .btn-sketch__loader {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: btn-sketch-spin 0.6s linear infinite;
  }
  @keyframes btn-sketch-spin { to { transform: rotate(360deg); } }
</style>
