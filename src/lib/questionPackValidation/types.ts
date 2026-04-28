import baseQuestions from '../questions.json'

export type QuestionsData = typeof baseQuestions

export interface QuestionPack {
  id: string
  name: string
  data: QuestionsData
  builtIn: boolean
}

export type QuestionPackValidationResult =
  | { ok: true; data: QuestionsData }
  | { ok: false; errors: string[] }

