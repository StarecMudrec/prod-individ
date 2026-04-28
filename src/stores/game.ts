import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Player, GamePhase } from '@/types'
import { ANSWER_MATCH_DIFFICULTY } from '@/lib/constants'
import { matchAnswer } from '@/lib/answerMatching'

export const useGameStore = defineStore('game', () => {
  const playersStorage = useLocalStorage<Player[]>('game_players', []),
    phaseStorage = useLocalStorage<GamePhase>('game_phase', 'setup'),
    currentRoundStorage = useLocalStorage<number>('game_currentRound', 1),
    activePlayerIdStorage = useLocalStorage<string | null>('game_activePlayerId', null),
    questionChooserIdStorage = useLocalStorage<string | null>('game_questionChooserId', null),
    currentQuestionIdStorage = useLocalStorage<string | null>('game_currentQuestionId', null),
    currentQuestionCellCostStorage = useLocalStorage<number | null>('game_currentQuestionCellCost', null),
    answeredPlayerIdsStorage = useLocalStorage<string[]>('game_answeredPlayerIds', []),
    catReceiverIdStorage = useLocalStorage<string | null>('game_catReceiverId', null),
    auctionBidsStorage = useLocalStorage<Record<string, number>>('game_auctionBids', {}),
    auctionWinnerIdStorage = useLocalStorage<string | null>('game_auctionWinnerId', null),
    finalPlayerIdsStorage = useLocalStorage<string[]>('game_finalPlayerIds', []),
    finalBetsStorage = useLocalStorage<Record<string, number>>('game_finalBets', {}),
    finalAnswersStorage = useLocalStorage<Record<string, string>>('game_finalAnswers', {}),
    finalStepStorage = useLocalStorage<'theme' | 'betting' | 'answers' | 'reveal' | null>('game_finalStep', null),
    finalCurrentPlayerIndexStorage = useLocalStorage<number>('game_finalCurrentPlayerIndex', 0),
    finalScoresAppliedStorage = useLocalStorage<boolean>('game_finalScoresApplied', false)

  const players = ref<Player[]>(playersStorage.value),
    phase = ref<GamePhase>(phaseStorage.value),
    currentRound = ref(currentRoundStorage.value),
    activePlayerId = ref<string | null>(activePlayerIdStorage.value),
    questionChooserId = ref<string | null>(questionChooserIdStorage.value),
    currentQuestionId = ref<string | null>(currentQuestionIdStorage.value),
    currentQuestionCellCost = ref<number | null>(currentQuestionCellCostStorage.value),
    answeredPlayerIds = ref<Set<string>>(new Set(answeredPlayerIdsStorage.value)),
    catReceiverId = ref<string | null>(catReceiverIdStorage.value),
    auctionBids = ref<Map<string, number>>(new Map(Object.entries(auctionBidsStorage.value))),
    auctionWinnerId = ref<string | null>(auctionWinnerIdStorage.value),
    finalPlayerIds = ref<string[]>(finalPlayerIdsStorage.value),
    finalBets = ref<Map<string, number>>(new Map(Object.entries(finalBetsStorage.value))),
    finalAnswers = ref<Map<string, string>>(new Map(Object.entries(finalAnswersStorage.value))),
    finalStep = ref<'theme' | 'betting' | 'answers' | 'reveal' | null>(finalStepStorage.value),
    finalCurrentPlayerIndex = ref<number>(finalCurrentPlayerIndexStorage.value),
    finalScoresApplied = ref<boolean>(finalScoresAppliedStorage.value)

  watch(players, v => { playersStorage.value = v }, { deep: true }); watch(phase, v => { phaseStorage.value = v })
  watch(currentRound, v => { currentRoundStorage.value = v }); watch(activePlayerId, v => { activePlayerIdStorage.value = v })
  watch(questionChooserId, v => { questionChooserIdStorage.value = v }); watch(currentQuestionId, v => { currentQuestionIdStorage.value = v })
  watch(currentQuestionCellCost, v => { currentQuestionCellCostStorage.value = v }); watch(catReceiverId, v => { catReceiverIdStorage.value = v })
  watch(auctionWinnerId, v => { auctionWinnerIdStorage.value = v })
  watch(answeredPlayerIds, v => { answeredPlayerIdsStorage.value = Array.from(v) }, { deep: true })
  watch(auctionBids, v => { auctionBidsStorage.value = Object.fromEntries(v) }, { deep: true })
  watch(finalPlayerIds, v => { finalPlayerIdsStorage.value = v }, { deep: true })
  watch(finalBets, v => { finalBetsStorage.value = Object.fromEntries(v) }, { deep: true })
  watch(finalAnswers, v => { finalAnswersStorage.value = Object.fromEntries(v) }, { deep: true })
  watch(finalStep, v => { finalStepStorage.value = v }); watch(finalCurrentPlayerIndex, v => { finalCurrentPlayerIndexStorage.value = v })
  watch(finalScoresApplied, v => { finalScoresAppliedStorage.value = v })

  const activePlayer = computed(() => players.value.find(p => p.id === activePlayerId.value) ?? null)
  const questionChooser = computed(() => players.value.find(p => p.id === questionChooserId.value) ?? null)
  const finalPlayers = computed(() => finalPlayerIds.value.map(id => players.value.find(p => p.id === id)).filter((p): p is Player => Boolean(p)))

  const setPlayers = (newPlayers: Player[]) => { players.value = newPlayers },
    setPhase = (newPhase: GamePhase) => { phase.value = newPhase },
    setActivePlayer = (id: string | null) => { activePlayerId.value = id },
    setQuestionChooser = (id: string | null) => { questionChooserId.value = id }

  function setCurrentQuestion(questionId: string | null, cellCost?: number | null) {
    currentQuestionId.value = questionId; currentQuestionCellCost.value = typeof cellCost === 'number' && Number.isFinite(cellCost) ? cellCost : null; activePlayerId.value = null; answeredPlayerIds.value.clear(); catReceiverId.value = null; auctionBids.value = new Map(); auctionWinnerId.value = null
  }

  const addAnsweredPlayer = (playerId: string) => { answeredPlayerIds.value.add(playerId) }
  const hasPlayerAnswered = (playerId: string) => answeredPlayerIds.value.has(playerId)

  function updatePlayerScore(playerId: string, delta: number) { const player = players.value.find(p => p.id === playerId); if (player) player.score += delta }

  const setCatReceiver = (playerId: string | null) => { catReceiverId.value = playerId }
  const setAuctionBid = (playerId: string, bid: number) => { auctionBids.value.set(playerId, bid) }
  const getAuctionBid = (playerId: string) => auctionBids.value.get(playerId) ?? 0
  const setAuctionWinner = (playerId: string | null) => { auctionWinnerId.value = playerId }
  const clearAuctionState = () => { auctionBids.value = new Map(); auctionWinnerId.value = null }

  function getPlayerWithLowestScore(): Player | null { if (!players.value.length) return null; return players.value.reduce((min, p) => (p.score < min.score ? p : min)) }

  function prepareFinal() {
    const eligiblePlayers = players.value.filter(p => p.score > 0); finalPlayerIds.value = eligiblePlayers.map(p => p.id); finalBets.value = new Map(); finalAnswers.value = new Map(); finalStep.value = 'theme'; finalCurrentPlayerIndex.value = 0; finalScoresApplied.value = false; phase.value = 'final'
  }

  const setFinalBet = (playerId: string, bet: number) => { finalBets.value.set(playerId, bet) }
  const getFinalBet = (playerId: string) => finalBets.value.get(playerId) ?? 0
  const setFinalAnswer = (playerId: string, answer: string) => { finalAnswers.value.set(playerId, answer) }
  const getFinalAnswer = (playerId: string) => finalAnswers.value.get(playerId) ?? ''

  function applyFinalResults(correctAnswer: string, acceptedAnswers?: string[]) {
    if (finalScoresApplied.value) return; for (const playerId of finalPlayerIds.value) { const player = players.value.find(p => p.id === playerId); if (!player) continue; const bet = finalBets.value.get(playerId) ?? 0; if (bet <= 0) continue; const answer = finalAnswers.value.get(playerId) ?? ''; const candidates = [correctAnswer, ...(acceptedAnswers ?? [])]; const isCorrect = matchAnswer(answer, candidates, { difficulty: ANSWER_MATCH_DIFFICULTY }); player.score += isCorrect ? bet : -bet } finalScoresApplied.value = true
  }

  function startRound(roundNumber: number) {
    currentRound.value = roundNumber; activePlayerId.value = null; if (roundNumber === 1) { if (players.value.length > 0) questionChooserId.value = players.value[0].id } else { const lowestScorePlayer = getPlayerWithLowestScore(); if (lowestScorePlayer) questionChooserId.value = lowestScorePlayer.id }
  }

  function reset() {
    players.value = []; phase.value = 'setup'; currentRound.value = 1; activePlayerId.value = null; questionChooserId.value = null; currentQuestionId.value = null; currentQuestionCellCost.value = null; answeredPlayerIds.value.clear(); catReceiverId.value = null; auctionBids.value = new Map(); auctionWinnerId.value = null; finalPlayerIds.value = []; finalBets.value = new Map(); finalAnswers.value = new Map(); finalStep.value = null; finalCurrentPlayerIndex.value = 0; finalScoresApplied.value = false; playersStorage.value = []; phaseStorage.value = 'setup'; currentRoundStorage.value = 1; activePlayerIdStorage.value = null; questionChooserIdStorage.value = null; currentQuestionIdStorage.value = null; currentQuestionCellCostStorage.value = null; answeredPlayerIdsStorage.value = []; catReceiverIdStorage.value = null; auctionBidsStorage.value = {}; auctionWinnerIdStorage.value = null; finalPlayerIdsStorage.value = []; finalBetsStorage.value = {}; finalAnswersStorage.value = {}; finalStepStorage.value = null; finalCurrentPlayerIndexStorage.value = 0; finalScoresAppliedStorage.value = false
  }

  return {
    players, phase, currentRound, activePlayerId, questionChooserId, currentQuestionId, currentQuestionCellCost,
    answeredPlayerIds, catReceiverId, auctionBids, auctionWinnerId, finalPlayerIds, finalBets, finalAnswers,
    finalStep, finalCurrentPlayerIndex, finalScoresApplied, activePlayer, questionChooser, finalPlayers,
    setPlayers, setPhase, setActivePlayer, setQuestionChooser, setCurrentQuestion, addAnsweredPlayer,
    hasPlayerAnswered, updatePlayerScore, setCatReceiver, setAuctionBid, getAuctionBid, setAuctionWinner,
    clearAuctionState, getPlayerWithLowestScore, prepareFinal, setFinalBet, getFinalBet, setFinalAnswer,
    getFinalAnswer, applyFinalResults, startRound, reset,
  }
})