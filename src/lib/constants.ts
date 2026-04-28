
// Константы игры

// Клавиши для ответа игроков (key для события, display - для UI)
export const PLAYER_KEYS = [
  { key: 'KeyA', display: 'A' },
  { key: 'KeyL', display: 'L' },
  { key: 'Space', display: 'Пробел' },
  { key: 'KeyD', display: 'D' },
  { key: 'KeyG', display: 'G' },
  { key: 'KeyJ', display: 'J' },
] as const

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = PLAYER_KEYS.length

export const PLAYER_NAME_MIN_LENGTH = 1
export const PLAYER_NAME_MAX_LENGTH = 16
export const ANSWER_MAX_LENGTH = 30
export const MAX_PLAYER_SCORE = 99999
export const MIN_PLAYER_SCORE = -99999
export const PLAYERS_COUNT = 3

const KEY_DISPLAY_MAP: Record<string, string> = {
  Space: 'Пробел',
  Enter: 'Enter',
  Tab: 'Tab',
  Backspace: 'Backspace',
  Escape: 'Escape',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  ShiftLeft: 'Shift',
  ShiftRight: 'Shift',
  ControlLeft: 'Ctrl',
  ControlRight: 'Ctrl',
  AltLeft: 'Alt',
  AltRight: 'Alt',
  MetaLeft: 'Win',
  MetaRight: 'Win',
}

// Возвращает отображаемое название клавиши (принимает code или key)
export function formatKeyDisplay(key: string): string {
  if (!key) return key
  const f = PLAYER_KEYS.find((p) => p.key === key)
  if (f) return f.display
  if (KEY_DISPLAY_MAP[key]) return KEY_DISPLAY_MAP[key]
  if (key === ' ') return 'Пробел'
  // KeyA -> A, KeyB -> B, ...
  if (/^Key[A-Z]$/i.test(key)) return key.slice(3).toUpperCase()
  // Digit0 -> 0, Digit1 -> 1, ...
  if (/^Digit[0-9]$/.test(key)) return key.slice(5)
  // Numpad0..9, NumpadAdd, etc.
  if (key.startsWith('Numpad')) {
    const rest = key.slice(6)
    if (/^[0-9]$/.test(rest)) return rest
    if (rest === 'Add') return '+'
    if (rest === 'Subtract') return '−'
    if (rest === 'Multiply') return '×'
    if (rest === 'Divide') return '/'
    if (rest === 'Enter') return 'Enter'
    if (rest === 'Decimal') return ','
  }
  if (key.length === 1) return key.toUpperCase()
  return key
}

export const ROUND1_COSTS = [100, 200, 300, 400, 500]
export const ROUND2_POINTS = [200, 400, 600, 800, 1000]
export const QUESTION_TIMEOUT_MS = 30_000
export const FINAL_QUESTION_TIMEOUT_MS = 60_000
export const THEMES_PER_ROUND = 6
export const QUESTIONS_PER_THEME = 5
export const CAT_BET_OPTIONS_ROUND1 = [100, 500]
export const CAT_BET_OPTIONS_ROUND2 = [200, 1000]

// 0 - лояльно; 1 - сбалансировано; 2 - строго
export const ANSWER_MATCH_DIFFICULTY = 0 as 0 | 1 | 2