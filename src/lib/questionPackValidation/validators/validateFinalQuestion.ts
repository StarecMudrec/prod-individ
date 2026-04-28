import { isRecord } from '../utils'

export function validateFinalQuestion(finalQuestion: any, errors: string[]) {
  if (!isRecord(finalQuestion)) {
    errors.push('Поле “finalQuestion” должно быть объектом.')
    return
  }

  if (typeof finalQuestion.id !== 'string' || !finalQuestion.id.trim()) {
    errors.push('У “finalQuestion” поле “id” должно быть непустой строкой.')
  }
  if (typeof finalQuestion.themeTitle !== 'string' || !finalQuestion.themeTitle.trim()) {
    errors.push('У “finalQuestion” поле “themeTitle” должно быть непустой строкой.')
  }
  if (typeof finalQuestion.text !== 'string' || !finalQuestion.text.trim()) {
    errors.push('У “finalQuestion” поле “text” должно быть непустой строкой.')
  }
  if (typeof finalQuestion.correctAnswer !== 'string' || !finalQuestion.correctAnswer.trim()) {
    errors.push('У “finalQuestion” поле “correctAnswer” должно быть непустой строкой.')
  }
  if (finalQuestion.acceptedAnswers != null) {
    if (!Array.isArray(finalQuestion.acceptedAnswers)) {
      errors.push('У “finalQuestion” поле “acceptedAnswers” при наличии должно быть массивом строк.')
    } else if (finalQuestion.acceptedAnswers.some((a: unknown) => typeof a !== 'string')) {
      errors.push('У “finalQuestion” поле “acceptedAnswers” должно содержать только строки.')
    }
  }
}

