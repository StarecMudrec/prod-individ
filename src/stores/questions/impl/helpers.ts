import type { QuestionPack } from '@/lib/questionPackValidation'

export function ensureBuiltinPack(existing: QuestionPack[], builtin: QuestionPack): QuestionPack[] {
  const withoutBuiltin = existing.filter((p) => p.id !== builtin.id)
  return [builtin, ...withoutBuiltin]
}

export function generatePackId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

