import { create } from 'zustand'
import { initialHomework, initialSubmissions, type Homework, type Submission } from '@/data/mock-homework'

type HomeworkStore = {
  homework: Homework[]
  submissions: Submission[]

  // Queries
  getHomeworkById: (id: string) => Homework | undefined
  getSubmissionById: (id: string) => Submission | undefined
  getSubmissionsForHomework: (homeworkId: string) => Submission[]
  getSubmissionForStudent: (homeworkId: string, studentId: string) => Submission | undefined
  getPendingSubmissions: (teacherId: string) => Submission[]

  // Actions
  createHomework: (hw: Omit<Homework, 'id' | 'createdDate'>) => string
  updateHomeworkStatus: (id: string, status: Homework['status']) => void
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void
}

let hwCounter = 100

export const useHomeworkStore = create<HomeworkStore>((set, get) => ({
  homework: initialHomework,
  submissions: initialSubmissions,

  getHomeworkById: (id) => get().homework.find(h => h.id === id),
  getSubmissionById: (id) => get().submissions.find(s => s.id === id),
  getSubmissionsForHomework: (homeworkId) => get().submissions.filter(s => s.homeworkId === homeworkId),
  getSubmissionForStudent: (homeworkId, studentId) =>
    get().submissions.find(s => s.homeworkId === homeworkId && s.studentId === studentId),
  getPendingSubmissions: (teacherId) => {
    const teacherHwIds = new Set(get().homework.filter(h => h.teacherId === teacherId).map(h => h.id))
    return get().submissions.filter(s => teacherHwIds.has(s.homeworkId) && s.status === 'submitted')
  },

  createHomework: (hw) => {
    const id = `hw-${String(++hwCounter).padStart(3, '0')}`
    const newHw: Homework = {
      ...hw,
      id,
      createdDate: new Date().toISOString().split('T')[0],
    }
    set(s => ({ homework: [newHw, ...s.homework] }))
    return id
  },

  updateHomeworkStatus: (id, status) => {
    set(s => ({
      homework: s.homework.map(h => h.id === id ? { ...h, status } : h),
    }))
  },

  gradeSubmission: (submissionId, grade, feedback) => {
    set(s => ({
      submissions: s.submissions.map(sub =>
        sub.id === submissionId
          ? { ...sub, grade, feedback, status: 'graded' as const }
          : sub
      ),
    }))
  },
}))
