import { isRecord } from '../utils'
import { validateSpecialQuestion } from './validateSpecialQuestion'
import { validateTheme } from './validateTheme'

export function validateRound(round: any, roundIndex: number, errors: string[]) {
  const humanIndex = roundIndex + 1

  if (!isRecord(round)) {
    errors.push(`Раунд #${humanIndex} должен быть объектом.`)
    return
  }

  if (typeof round.id !== 'number') {
    errors.push(`В раунде #${humanIndex} поле “id” должно быть числом.`)
  }

  if (!Array.isArray(round.costs) || round.costs.some((c: unknown) => typeof c !== 'number')) {
    errors.push(`В раунде #${humanIndex} поле “costs” должно быть массивом чисел.`)
  } else if (round.costs.length !== 5) {
    errors.push(`В раунде #${humanIndex} должно быть 5 стоимостей вопросов, найдено ${round.costs.length}.`)
  }

  if (!Array.isArray(round.themes)) {
    errors.push(`В раунде #${humanIndex} поле “themes” должно быть массивом тем.`)
  } else if (round.themes.length !== 6) {
    errors.push(`В раунде #${humanIndex} должно быть 6 тем, найдено ${round.themes.length}.`)
  } else {
    round.themes.forEach((theme: any, themeIndex: number) => {
      validateTheme(theme, humanIndex, themeIndex, errors)
    })
  }

  if (round.specialQuestions != null) {
    if (!Array.isArray(round.specialQuestions)) {
      errors.push(`В раунде #${humanIndex} поле “specialQuestions” при наличии должно быть массивом.`)
    } else {
      round.specialQuestions.forEach((question: any, i: number) => {
        validateSpecialQuestion(question, humanIndex, i, errors)
      })
    }
  }
}

