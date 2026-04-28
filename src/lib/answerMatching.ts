import * as distance from '@nlptools/distance'

export type AnswerMatchDifficulty = 0 | 1 | 2

export interface MatchAnswerOptions {
  difficulty: AnswerMatchDifficulty
}

const DEFAULT_THRESHOLDS: Record<AnswerMatchDifficulty, { maxRelativeDistance: number }> = {
  0: { maxRelativeDistance: 0.35 },
  1: { maxRelativeDistance: 0.25 },
  2: { maxRelativeDistance: 0.15 },
}

function stripDiacritics(value: string): string {
  // NFKD splits accented chars into char + combining mark
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

export function normalizeAnswer(value: string): string {
  const v = stripDiacritics(value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[,]/g, '.') // 3,14 -> 3.14
    // Replace most punctuation with spaces so words stay separable
    .replace(/[!"#$%&'()*+/:;<=>?@[\\\]^`{|}~]/g, ' ')
    // Keep dot for decimals (already normalized comma->dot); drop standalone dots elsewhere
    .replace(/\.(?!\d)/g, ' ')
    .replace(/_/g, ' ')
    .trim()

  return v.replace(/\s+/g, ' ')
}
function isWholeWordSubstring(needleNormalized: string, haystackNormalized: string): boolean {
  if (!needleNormalized || !haystackNormalized) return false
  if (needleNormalized.length > haystackNormalized.length) return false
  if (needleNormalized === haystackNormalized) return true

  // Word boundary safe check without regex escaping issues.
  // We check occurrences and verify boundaries by spaces/start/end.
  let idx = haystackNormalized.indexOf(needleNormalized)
  while (idx !== -1) {
    const startOk = idx === 0 || haystackNormalized[idx - 1] === ' '
    const endIdx = idx + needleNormalized.length
    const endOk = endIdx === haystackNormalized.length || haystackNormalized[endIdx] === ' '
    if (startOk && endOk) return true
    idx = haystackNormalized.indexOf(needleNormalized, idx + 1)
  }
  return false
}

function relativeLevenshteinDistance(aNormalized: string, bNormalized: string): number {
  if (!aNormalized && !bNormalized) return 0
  const denom = Math.max(aNormalized.length, bNormalized.length)
  if (denom === 0) return 0
  const d = distance.levenshtein(aNormalized, bNormalized)
  return d / denom
}

export function matchAnswer(
  userAnswer: string,
  acceptedAnswers: string[],
  options: MatchAnswerOptions,
): boolean {
  const user = normalizeAnswer(userAnswer)
  if (!user) return false

  const candidatesRaw = Array.isArray(acceptedAnswers) ? acceptedAnswers : []
  const candidates = candidatesRaw
    .map((a) => normalizeAnswer(a))
    .filter((a) => a.length > 0)

  if (candidates.length === 0) return false

  // Exact match after normalization
  if (candidates.includes(user)) return true

  // Short answer rule (difficulty 0/1): allow matching by whole words sequence in candidate
  if (options.difficulty !== 2) {
    const userWords = user.split(' ')
    // avoid overly short matches like "a", "e", "i"
    const minTokens = 2
    const minChars = 4
    if ((userWords.length >= minTokens || user.length >= minChars) && user.length <= 32) {
      for (const c of candidates) {
        if (isWholeWordSubstring(user, c)) return true
      }
    }
  }

  // Fuzzy match by relative Levenshtein distance
  const threshold = DEFAULT_THRESHOLDS[options.difficulty].maxRelativeDistance
  for (const c of candidates) {
    const rel = relativeLevenshteinDistance(user, c)
    if (rel <= threshold) return true

    // Token-based fallback: compare without spaces (helps with missed spaces/hyphens)
    const userCompact = user.replace(/ /g, '')
    const cCompact = c.replace(/ /g, '')
    if (userCompact && cCompact) {
      const relCompact = relativeLevenshteinDistance(userCompact, cCompact)
      if (relCompact <= threshold) return true
    }
  }

  return false
}

