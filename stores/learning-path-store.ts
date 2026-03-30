import { create } from 'zustand'

export type LearningPathResult = {
  focusAreas: { subject: string; priority: string; currentLevel: string; targetLevel: string; recommendation: string }[]
  weeklyPlan: { week: number; theme: string; activities: string[]; hoursRequired: number }[]
  resources: { title: string; type: string; subject: string; priority: string; estimatedTime: string }[]
  milestones: { title: string; targetWeek: number; metric: string; subject: string }[]
  overallStrategy: string
}

type PublishedPath = {
  path: LearningPathResult
  publishedAt: string
  teacherName: string
}

type LearningPathStore = {
  // published paths keyed by studentId
  publishedPaths: Record<string, PublishedPath>
  publishPath: (studentId: string, path: LearningPathResult, teacherName: string) => void
  getPublishedPath: (studentId: string) => PublishedPath | undefined
}

export const useLearningPathStore = create<LearningPathStore>((set, get) => ({
  publishedPaths: {},

  publishPath: (studentId, path, teacherName) => {
    set(s => ({
      publishedPaths: {
        ...s.publishedPaths,
        [studentId]: { path, publishedAt: new Date().toISOString(), teacherName },
      },
    }))
  },

  getPublishedPath: (studentId) => get().publishedPaths[studentId],
}))
