/**
 * Типы данных игровой логики «Твоя игра».
 */

export type QuestionType = 'normal' | 'cat' | 'auction'

export interface Player {
  id: string
  name: string
  key: string
  score: number
}

export interface Question {
  id: string
  themeId: string
  themeTitle: string
  cost: number
  text: string
  correctAnswer: string
  acceptedAnswers?: string[]
  type: QuestionType
}

export interface Theme {
  id: string
  title: string
  questionIds: string[]
}

export interface Round {
  id: number
  themes: Theme[]
  costs: number[]
  isFinal: boolean
}

export interface FinalQuestion {
  id: string
  themeTitle: string
  text: string
  correctAnswer: string
  acceptedAnswers?: string[]
}

export type GamePhase =
  | 'setup'
  | 'round-board'
  | 'question'
  | 'round-summary'
  | 'final'
  | 'results'

export interface GameState {
  phase: GamePhase
  currentRound: number
  currentQuestionId: string | null
  activePlayerId: string | null
  questionChooserId: string | null
}