import type { QuestionType } from '@/types/game'
import { isRecord } from '../utils'
import { VALID_TYPES } from './constants'

export function validateSpecialQuestion(question: any, roundNumber: number, index: number, errors: string[]) {
  const humanIndex = index + 1

  if (!isRecord(question)) {
    errors.push(`Специальный вопрос #${humanIndex} раунда #${roundNumber} должен быть объектом.`)
    return
  }

  const prefix = `Специальный вопрос #${humanIndex} раунда #${roundNumber}`

  if (typeof question.id !== 'string' || !question.id.trim()) {
    errors.push(`${prefix}: поле “id” должно быть непустой строкой.`)
  }
  if (typeof question.themeId !== 'string' || !question.themeId.trim()) {
    errors.push(`${prefix}: поле “themeId” должно быть непустой строкой.`)
  }
  if (typeof question.themeTitle !== 'string' || !question.themeTitle.trim()) {
    errors.push(`${prefix}: поле “themeTitle” должно быть непустой строкой.`)
  }
  if (typeof question.cost !== 'number' || !Number.isFinite(question.cost)) {
    errors.push(`${prefix}: поле “cost” должно быть числом.`)
  }
  if (typeof question.text !== 'string' || !question.text.trim()) {
    errors.push(`${prefix}: поле “text” должно быть непустой строкой.`)
  }
  if (typeof question.correctAnswer !== 'string' || !question.correctAnswer.trim()) {
    errors.push(`${prefix}: поле “correctAnswer” должно быть непустой строкой.`)
  }
  if (!VALID_TYPES.includes(question.type as QuestionType)) {
    errors.push(`${prefix}: поле “type” должно быть одним из: ${VALID_TYPES.join(', ')}.`)
  }
  if (question.acceptedAnswers != null) {
    if (!Array.isArray(question.acceptedAnswers)) {
      errors.push(`${prefix}: поле “acceptedAnswers” при наличии должно быть массивом строк.`)
    } else if (question.acceptedAnswers.some((a: unknown) => typeof a !== 'string')) {
      errors.push(`${prefix}: поле “acceptedAnswers” должно содержать только строки.`)
    }
  }
}

