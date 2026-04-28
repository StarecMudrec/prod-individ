<template>
  <input
    :id="id"
    :value="modelValue"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    :class="[inputClass]"
    @input="onInput"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: number
      id?: string
      min?: number
      max?: number
      step?: number
      inputClass?: string
      commitOnBlur?: boolean
    }>(),
    { step: 1, commitOnBlur: true }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const defaultInputClass =
    'w-full mt-0 rounded-button border-2 border-surface-darker px-4 py-2 text-lg text-text transition-[border-color,box-shadow] duration-200 ease-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  const inputClass = computed(() => props.inputClass ?? defaultInputClass)

  function integerDigitCount(n: number): number {
    const s = String(Math.floor(Math.abs(n)))
    return s.length || 1
  }

  const maxDigits = computed(() =>
    props.max != null ? integerDigitCount(props.max) : Infinity
  )

  function clamp(value: number): number {
    let result = value
    if (props.min != null && value < props.min) result = props.min
    if (props.max != null && value > props.max) result = props.max
    return result
  }

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement
    const raw = target.valueAsNumber
    if (Number.isNaN(raw)) {
      return
    }
    if (integerDigitCount(raw) > maxDigits.value) {
      target.value = String(props.modelValue)
      return
    }
    emit('update:modelValue', raw)
  }

  function onBlur(e: Event) {
    if (!props.commitOnBlur) {
      const target = e.target as HTMLInputElement
      target.value = String(props.modelValue)
      return
    }
    const target = e.target as HTMLInputElement
    const raw = target.valueAsNumber
    if (Number.isNaN(raw) || target.value.trim() === '') {
      const fallback = clamp(props.min ?? 0)
      emit('update:modelValue', fallback)
      target.value = String(fallback)
      return
    }
    const clamped = clamp(raw)
    emit('update:modelValue', clamped)
    target.value = String(clamped)
  }
</script>
