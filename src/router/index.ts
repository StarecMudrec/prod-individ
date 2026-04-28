import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Главная' },
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/SetupView.vue'),
    meta: { title: 'Подготовка игры' },
  },
  {
    path: '/game-start',
    name: 'game-start',
    component: () => import('@/views/GameStartView.vue'),
    meta: { title: 'Старт игры' },
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('@/views/BoardView.vue'),
    meta: { title: 'Игровое табло' },
  },
  {
    path: '/question',
    name: 'question',
    component: () => import('@/views/QuestionView.vue'),
    meta: { title: 'Вопрос' },
  },
  {
    path: '/auction-random',
    name: 'auction-random',
    component: () => import('@/views/AuctionRandomView.vue'),
    meta: { title: 'Случайный игрок' },
  },
  {
    path: '/round-summary',
    name: 'round-summary',
    component: () => import('@/views/RoundSummaryView.vue'),
    meta: { title: 'Итоги раунда' },
  },
  {
    path: '/final',
    name: 'final',
    component: () => import('@/views/FinalView.vue'),
    meta: { title: 'Финальный раунд' },
  },
  {
    path: '/final-question',
    name: 'final-question',
    component: () => import('@/views/FinalQuestionView.vue'),
    meta: { title: 'Финальный вопрос' },
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('@/views/ResultsView.vue'),
    meta: { title: 'Итоги игры' },
  },
  {
    path: '/packs',
    name: 'packs',
    component: () => import('@/views/QuestionPacksView.vue'),
    meta: { title: 'Пакеты вопросов' },
  },
  {
    path: '/packs/editor',
    name: 'packs-editor',
    component: () => import('@/views/QuestionEditorView.vue'),
    meta: { title: 'Редактор вопросов' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  if (title) {
    document.title = `${title} — Твоя игра`
  }
})

export default router