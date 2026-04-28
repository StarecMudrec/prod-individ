import type { QuestionsData, QuestionPackValidationResult } from './types'
import { isRecord } from './utils'
import { validateFinalQuestion, validateRound } from './validators'

export function validateQuestionPack(raw: unknown): QuestionPackValidationResult {
  const errors: string[] = []

  if (!isRecord(raw)) {
    return { ok: false, errors: ['Файл должен содержать JSON‑объект с корневым полем “rounds”.'] }
  }

  const data = raw as any

  if (!Array.isArray(data.rounds)) {
    errors.push('Поле “rounds” должно быть массивом раундов.')
  } else if (data.rounds.length !== 2) {
    errors.push(`Ожидается 2 раунда, найдено ${data.rounds.length}.`)
  }

  if (!isRecord(data.finalQuestion)) {
    errors.push('Поле “finalQuestion” должно быть объектом с финальным вопросом.')
  } else {
    validateFinalQuestion(data.finalQuestion, errors)
  }

  if (Array.isArray(data.rounds)) {
    data.rounds.forEach((round: any, roundIndex: number) => {
      validateRound(round, roundIndex, errors)
    })
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return { ok: true, data: data as QuestionsData }
}

