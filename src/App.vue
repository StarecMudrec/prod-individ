<template>
  <div id="app" class="relative min-h-screen">
    <DevModeToggle />
    <router-view v-slot="{ Component, route }">
      <transition
        :name="shouldUseCircleTransition(route) ? 'circle-reverse' : 'fade'"
        mode="out-in"
      >
        <div :key="route.path" class="transition-viewport">
          <main class="mx-auto max-w-6xl px-4" :class="$route.path === '/question' || $route.path === '/final-question' ? 'py-0' : 'py-3'">
            <component :is="Component" />
          </main>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import DevModeToggle from '@/components/ui/DevModeToggle.vue'
  const route = useRoute()
  const router = useRouter()
  const previousRoute = ref<string | null>(null)
  provide('previousRoute', previousRoute)

  function shouldUseCircleTransition(currentRoute: any): boolean {
    const currentPath = currentRoute.path
    const prevPath = previousRoute.value

    // Check if transitioning between home and setup
    const isHomeToSetup = prevPath === '/' && currentPath === '/setup'
    const isSetupToHome = prevPath === '/setup' && currentPath === '/'

    // Check if transitioning between game-start and board
    const isGameStartToBoard = prevPath === '/game-start' && currentPath === '/board'
    const isBoardToGameStart = prevPath === '/board' && currentPath === '/game-start'

    // Check if transitioning between round-summary and board
    const isRoundSummaryToBoard = prevPath === '/round-summary' && currentPath === '/board'
    const isBoardToRoundSummary = prevPath === '/board' && currentPath === '/round-summary'

    // Check if transitioning between round-summary and final
    const isRoundSummaryToFinal = prevPath === '/round-summary' && currentPath === '/final'
    const isFinalToRoundSummary = prevPath === '/final' && currentPath === '/round-summary'

    // Check if transitioning between round-summary and final
    const isBoardToRandom = prevPath === '/auction-random' && currentPath === '/board'
    const isRandomToBoard = prevPath === '/board' && currentPath === '/auction-random'

    return isHomeToSetup || isSetupToHome || isGameStartToBoard || isBoardToGameStart || isRoundSummaryToBoard || isBoardToRoundSummary || isRoundSummaryToFinal || isFinalToRoundSummary || isBoardToRandom || isRandomToBoard
  }

  // Track previous route using router navigation guard
  router.beforeEach((_to, _from) => {
    // Store current route before it changes (it will become the "from" route)
    previousRoute.value = route.path
  })

  // Initialize previous route on mount
  onMounted(() => {
    previousRoute.value = route.path
  })
</script>

<style scoped>
.transition-viewport {
  width: 100%;
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease-out, transform 0.35s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.fade-enter-to,
.fade-leave-from {
  transform: translateY(0);
}
</style>

<style>
/* Circle reverse transition (from CircleReverseTransition.vue) - not scoped so it applies to transition classes */
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
    clip-path: circle(50% at 50% 50%);
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