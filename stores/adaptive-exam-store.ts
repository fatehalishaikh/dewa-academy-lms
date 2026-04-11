import { create } from 'zustand'
import type { ExamQuestion, DifficultyLevel } from '@/data/mock-assessments'
import type { DifficultyMix } from '@/lib/adaptive-exam'

export type ExamAssignment = {
  examId: string
  studentId: string
  questions: ExamQuestion[]
  targetDifficulty: DifficultyLevel
  mix: DifficultyMix
  rationale: string
  resolvedAt: string
}

type AdaptiveExamState = {
  assignments: ExamAssignment[]
  resolving: string[]

  getAssignment: (examId: string, studentId: string) => ExamAssignment | undefined
  resolveAssignment: (examId: string, studentId: string, exam?: import('@/data/mock-assessments').Exam) => Promise<ExamAssignment>
}

export const useAdaptiveExamStore = create<AdaptiveExamState>((set, get) => ({
  assignments: [],
  resolving: [],

  getAssignment(examId, studentId) {
    return get().assignments.find(a => a.examId === examId && a.studentId === studentId)
  },

  async resolveAssignment(examId, studentId, passedExam?) {
    // Return cached assignment if already resolved
    const existing = get().getAssignment(examId, studentId)
    if (existing) return existing

    const key = `${examId}:${studentId}`

    // If already in-flight, wait for it
    if (get().resolving.includes(key)) {
      await new Promise<void>(resolve => {
        const interval = setInterval(() => {
          if (!get().resolving.includes(key)) {
            clearInterval(interval)
            resolve()
          }
        }, 100)
      })
      return get().getAssignment(examId, studentId)!
    }

    set(s => ({ resolving: [...s.resolving, key] }))

    try {
      const { getExamById } = await import('@/data/mock-assessments')
      const { selectAdaptiveQuestions, getStudentDifficultyProfile, buildDifficultyMix } = await import('@/lib/adaptive-exam')

      const exam = passedExam ?? getExamById(examId)
      if (!exam) throw new Error(`Exam ${examId} not found`)

      const profile = getStudentDifficultyProfile(studentId)
      const total   = exam.adaptive?.totalQuestions ?? 8
      const mix     = buildDifficultyMix(profile.level, total)
      const questions = await selectAdaptiveQuestions(exam, studentId)

      const assignment: ExamAssignment = {
        examId,
        studentId,
        questions,
        targetDifficulty: profile.level,
        mix,
        rationale: profile.rationale,
        resolvedAt: new Date().toISOString(),
      }

      set(s => ({
        assignments: [...s.assignments, assignment],
        resolving: s.resolving.filter(k => k !== key),
      }))

      return assignment
    } catch (err) {
      set(s => ({ resolving: s.resolving.filter(k => k !== key) }))
      throw err
    }
  },
}))
