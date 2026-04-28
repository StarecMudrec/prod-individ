<template>
  <div class="elastic-textarea-wrapper">
    <span
      ref="mirrorRef"
      class="elastic-textarea-mirror"
      aria-hidden="true"
    >{{ displayText }}</span>
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :class="[inputClass, { 'border-error focus:border-error focus:ring-error/30': error }]"
      :style="textareaStyle"
      rows="1"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeydown"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, nextTick } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: string
      id?: string
      placeholder?: string
      maxlength?: number
      inputClass?: string
      error?: boolean
      disabled?: boolean
      minWidth?: number
      maxWidth?: number
    }>(),
    { minWidth: 100, maxWidth: undefined, disabled: false }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    blur: [event: FocusEvent]
    input: [event: Event]
    keydown: [event: KeyboardEvent]
  }>()

  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const mirrorRef = ref<HTMLSpanElement | null>(null)
  const textareaStyle = ref<{ width: string; minWidth: string; maxWidth?: string }>({
    width: `${props.minWidth}px`,
    minWidth: `${props.minWidth}px`,
    maxWidth: props.maxWidth != null ? `${props.maxWidth}px` : '100%',
  })

  const displayText = computed(() => {
    const v = props.modelValue
    if (v && v.length > 0) return v
    return props.placeholder || '\u00A0'
  })

  function resize() {
    const textarea = textareaRef.value
    const mirror = mirrorRef.value
    if (!textarea || !mirror) return

    const computedStyle = getComputedStyle(textarea)
    const fontProps = [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontVariant',
      'letterSpacing',
      'lineHeight',
      'paddingLeft',
      'paddingRight',
    ] as const
    fontProps.forEach((prop) => {
      ;(mirror.style as unknown as Record<string, string>)[prop] = computedStyle[prop]
    })

    const minW = props.minWidth
    const maxW = props.maxWidth
    const mirrorWidth = mirror.offsetWidth
    let w = Math.max(minW, mirrorWidth)
    if (maxW != null) w = Math.min(maxW, w)

    textareaStyle.value = {
      width: `${w}px`,
      minWidth: `${minW}px`,
      ...(maxW != null ? { maxWidth: `${maxW}px` } : { maxWidth: '100%' }),
    }
  }

  function onInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    emit('input', e)
    nextTick(resize)
  }

  function onBlur(e: FocusEvent) {
    emit('blur', e)
  }

  function onKeydown(e: KeyboardEvent) {
    emit('keydown', e)
  }

  watch(
    () => props.modelValue,
    () => nextTick(resize)
  )

  onMounted(() => nextTick(resize))
</script>

<style scoped>
  .elastic-textarea-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .elastic-textarea-mirror {
    position: absolute;
    left: -9999px;
    top: 0;
    visibility: hidden;
    white-space: pre;
    pointer-events: none;
    box-sizing: border-box;
  }

  textarea {
    resize: none;
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
    transition: width 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    white-space: nowrap;
  }
</style>