<template>
  <button
    type="button"
    class="btn-sketch unselectable"
    :class="[buttonClass, textClass]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span class="btn-sketch__inner font-faberge">
      <span v-if="loading" class="btn-sketch__loader" aria-hidden="true" />
      <slot v-else />
    </span>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      variant?: 'primary' | 'secondary' | 'outline' | 'dev' | 'giant' | 'catBet'
      disabled?: boolean
      loading?: boolean
      textClass?: string
    }>(),
    { variant: 'primary', disabled: false, loading: false, textClass: '' }
  )

  const buttonClass = computed(() => {
    const variants = {
      primary: 'btn-sketch--primary',
      secondary: 'btn-sketch--secondary',
      outline: 'btn-sketch--outline',
      dev: 'btn-sketch--dev',
      giant: 'btn-sketch--giant',
      catBet: 'btn-sketch--cat-bet',
    }
    return variants[props.variant]
  })

  const textClass = computed(() => props.textClass || '')

  const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

  function onClick(event: MouseEvent) {
    if (props.disabled || props.loading) return
    emit('click', event)
  }
</script>

<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap");
  .btn-sketch { position: relative; font: normal 22px/25px "Patrick Hand", sans-serif; text-transform: uppercase; color: #000; text-decoration: none; padding-bottom: 3px; border-radius: 5px; box-shadow: 0 2px 0 #000; transition: padding 0.2s ease-out, box-shadow 0.2s ease-out, transform 0.2s ease-out; background: linear-gradient(45deg, rgb(var(--color-button-default) / 1) 20%, transparent 20%, transparent 50%, rgb(var(--color-button-default) / 1) 50%, rgb(var(--color-button-default) / 1) 70%, transparent 70%); background-size: 5px 5px; border: none; cursor: pointer; margin: 0; display: inline-flex; align-items: center; justify-content: center; }
  .btn-sketch:focus { outline: none; }
  .btn-sketch:hover:not(:disabled) { box-shadow: 0 2px 0 #000, 0 2px 0 2px #f03755; }
  .btn-sketch:active:not(:disabled) { transform: translateY(4px); padding-bottom: 0; box-shadow: 0 1px 0 #000; }
  .btn-sketch--primary { background: linear-gradient(45deg, rgb(var(--color-button-default) / 1) 20%, transparent 20%, transparent 50%, rgb(var(--color-button-default) / 1) 50%, rgb(var(--color-button-default) / 1) 70%, transparent 70%); background-size: 5px 5px; box-shadow: 0 2px 0 rgb(var(--color-button-default)); }
  .btn-sketch--primary:hover:not(:disabled) { box-shadow: 0 2px 0 rgb(var(--color-button-default)), 0 2px 0 2px rgb(var(--color-button-hover-default)); }
  .btn-sketch--primary:active:not(:disabled) { box-shadow: 0 1px 0 rgb(var(--color-button-default)); }
  .btn-sketch--giant { scale: 1.5; }
  .btn-sketch--giant:active:not(:disabled) { scale: 1.5; transform: translateY(4px); }
  .btn-sketch--giant .btn-sketch__inner { background: rgb(var(--color-button-bg-default)); border-color: rgb(var(--color-button-default)); color: rgb(var(--color-button-default)); }
  .btn-sketch--cat-bet { transform: scale(1.5); }
  .btn-sketch--cat-bet:hover:not(:disabled) { transform: scale(1.75); }
  .btn-sketch--cat-bet:active:not(:disabled) { transform: translateY(4px) scale(1.75); }
  .btn-sketch--cat-bet .btn-sketch__inner { background: rgb(var(--color-button-bg-default)); border-color: rgb(var(--color-button-default)); color: rgb(var(--color-button-default)); font-family: var(--font-rampart); }
  .btn-sketch--dev { background: linear-gradient(45deg, rgb(var(--color-button-dev) / 1) 20%, transparent 20%, transparent 50%, rgb(var(--color-button-dev) / 1) 50%, rgb(var(--color-button-dev) / 1) 70%, transparent 70%); background-size: 5px 5px; box-shadow: 0 2px 0 rgb(var(--color-button-dev)); }
  .btn-sketch--dev:hover:not(:disabled) { box-shadow: 0 2px 0 rgb(var(--color-button-dev)), 0 2px 0 2px rgb(var(--color-button-hover-dev)); }
  .btn-sketch--dev:active:not(:disabled) { box-shadow: 0 1px 0 rgb(var(--color-button-dev)); }
  .btn-sketch:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-sketch__inner { display: inline-flex; align-items: center; justify-content: center; padding: 5px 15px; border-radius: 5px; border: 2px solid #000; min-height: 25px; }
  .btn-sketch--primary .btn-sketch__inner { background: rgb(var(--color-button-bg-default)); border-color: rgb(var(--color-button-default)); color: rgb(var(--color-button-default)); }
  .btn-sketch--secondary .btn-sketch__inner { background: #f5f5f5; }
  .btn-sketch--outline .btn-sketch__inner { background: transparent; }
  .btn-sketch--dev .btn-sketch__inner { background: rgb(var(--color-button-bg-dev)); border-color: rgb(var(--color-button-dev)); color: rgb(var(--color-button-dev)); }
  .btn-sketch__loader { width: 1em; height: 1em; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: btn-sketch-spin 0.6s linear infinite; }
  @keyframes btn-sketch-spin { to { transform: rotate(360deg); } }
</style>
