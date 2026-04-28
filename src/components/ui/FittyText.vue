<template>
  <div ref="parentEl" class="fitty-parent w-full min-w-0 overflow-hidden">
    <component
      :is="tag"
      ref="targetEl"
      :class="['fitty-target', fittyClass]"
    >
      <slot>{{ text }}</slot>
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import fitty, { type FittyInstance } from 'fitty'

const props = withDefaults(
  defineProps<{
    text?: string
    tag?: string
    fittyClass?: string
    minSize?: number
    maxSize?: number
    multiLine?: boolean
    visible?: boolean
  }>(),
  {
    tag: 'div',
    minSize: 12,
    maxSize: 32,
    multiLine: false,
    visible: true,
  }
)

const parentEl = ref<HTMLElement | null>(null)
const targetEl = ref<HTMLElement | null>(null)

let instance: FittyInstance | null = null
let resizeObserver: ResizeObserver | null = null

function init() {
  if (!parentEl.value || !targetEl.value) return

  instance = fitty(targetEl.value, {
    minSize: props.minSize,
    maxSize: props.maxSize,
    multiLine: props.multiLine,
  })

  resizeObserver = new ResizeObserver(() => {
    instance?.fit()
  })

  resizeObserver.observe(parentEl.value)

  requestAnimationFrame(() => instance?.fit())
}

function destroy() {
  resizeObserver?.disconnect()
  resizeObserver = null
  instance = null
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return
    nextTick(() => {
      destroy()
      init()
    })
  }
)

watch(
  () => props.text,
  () => instance?.fit()
)

onMounted(() => {
  if (props.visible) nextTick(init)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  instance?.freeze()
})
</script>

<style scoped>
.fitty-parent {
  min-width: 0;
  box-sizing: border-box;
}

.fitty-target {
  display: inline-block;
  white-space: nowrap;
}
</style>