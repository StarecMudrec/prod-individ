<template>
  <Transition
    name="circle-reverse"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<style>
.circle-reverse-enter-active,
.circle-reverse-leave-active {
  position: relative;
  overflow: hidden;
}

.circle-reverse-enter-active {
  animation: circle-expand 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.circle-reverse-leave-active {
  animation: circle-contract 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.circle-reverse-enter-from {
  clip-path: circle(0% at 50% 50%);
}

.circle-reverse-leave-to {
  clip-path: circle(0% at 50% 50%);
}

@keyframes circle-expand {
  from {
    clip-path: circle(0% at 50% 50%);
  }
  to {
    clip-path: circle(105% at 50% 50%);
  }
}

@keyframes circle-contract {
  from {
    clip-path: circle(50% at 50% 50%);
  }
  to {
    clip-path: circle(0% at 50% 50%);
  }
}
</style>
