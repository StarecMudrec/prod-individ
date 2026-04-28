import { isRecord } from '../utils'
import { validateNormalQuestion } from './validateNormalQuestion'

export function validateTheme(theme: any, roundNumber: number, themeIndex: number, errors: string[]) {
  const humanThemeIndex = themeIndex + 1

  if (!isRecord(theme)) {
    errors.push(`Тема #${humanThemeIndex} в раунде #${roundNumber} должна быть объектом.`)
    return
  }

  if (typeof theme.id !== 'string' || !theme.id.trim()) {
    errors.push(`В теме #${humanThemeIndex} раунда #${roundNumber} поле “id” должно быть непустой строкой.`)
  }

  const themeTitle =
    typeof theme.title === 'string' && theme.title.trim() ? theme.title : `#${humanThemeIndex}`

  if (typeof theme.title !== 'string' || !theme.title.trim()) {
    errors.push(`В теме #${humanThemeIndex} раунда #${roundNumber} поле “title” должно быть непустой строкой.`)
  }

  if (!Array.isArray(theme.questions)) {
    errors.push(`В теме “${themeTitle}” раунда #${roundNumber} поле “questions” должно быть массивом.`)
    return
  }

  if (theme.questions.length !== 5) {
    errors.push(
      `В теме “${themeTitle}” раунда #${roundNumber} должно быть 5 вопросов, найдено ${theme.questions.length}.`,
    )
  }

  theme.questions.forEach((question: any, questionIndex: number) => {
    validateNormalQuestion(question, roundNumber, themeTitle, questionIndex, errors)
  })
}

