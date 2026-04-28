import type { QuestionType } from '@/types/game'
import { isRecord } from '../utils'
import { VALID_TYPES } from './constants'

export function validateNormalQuestion(
  question: any,
  roundNumber: number,
  themeTitle: string,
  questionIndex: number,
  errors: string[],
) {
  const humanQuestionIndex = questionIndex + 1

  if (!isRecord(question)) {
    errors.push(`Вопрос #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} должен быть объектом.`)
    return
  }

  if (typeof question.id !== 'string' || !question.id.trim()) {
    errors.push(
      `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “id” должно быть непустой строкой.`,
    )
  }

  if (typeof question.text !== 'string' || !question.text.trim()) {
    errors.push(
      `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “text” должно быть непустой строкой.`,
    )
  }

  if (typeof question.cost !== 'number' || !Number.isFinite(question.cost)) {
    errors.push(
      `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “cost” должно быть числом.`,
    )
  }

  if (typeof question.correctAnswer !== 'string' || !question.correctAnswer.trim()) {
    errors.push(
      `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “correctAnswer” должно быть непустой строкой.`,
    )
  }

  if (!VALID_TYPES.includes(question.type as QuestionType)) {
    errors.push(
      `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “type” должно быть одним из: ${VALID_TYPES.join(
        ', ',
      )}.`,
    )
  }

  if (question.acceptedAnswers != null) {
    if (!Array.isArray(question.acceptedAnswers)) {
      errors.push(
        `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “acceptedAnswers” при наличии должно быть массивом строк.`,
      )
    } else if (question.acceptedAnswers.some((a: unknown) => typeof a !== 'string')) {
      errors.push(
        `У вопроса #${humanQuestionIndex} темы “${themeTitle}” раунда #${roundNumber} поле “acceptedAnswers” должно содержать только строки.`,
      )
    }
  }
}

