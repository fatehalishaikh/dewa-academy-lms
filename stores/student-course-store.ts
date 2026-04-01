import { create } from 'zustand'
import type { LearningPathResult } from '@/stores/learning-path-store'

export type CourseSection = {
  id: string
  weekNumber: number
  title: string
  theme: string
  activities: string[]
  hoursRequired: number
  completed: boolean
  completedAt: string | null
}

export type CourseMilestone = {
  title: string
  targetWeek: number
  metric: string
  subject: string
  achieved: boolean
}

export type GeneratedCourse = {
  id: string
  studentId: string
  subject: string
  title: string
  description: string
  createdAt: string
  sections: CourseSection[]
  resources: LearningPathResult['resources']
  milestones: CourseMilestone[]
  focusAreas: LearningPathResult['focusAreas']
  progress: number
  status: 'active' | 'completed'
}

type StudentCourseStore = {
  courses: GeneratedCourse[]
  createCourse: (studentId: string, subject: string, path: LearningPathResult) => string
  toggleSectionComplete: (courseId: string, sectionId: string) => void
  toggleMilestoneAchieved: (courseId: string, milestoneIndex: number) => void
  getCoursesByStudent: (studentId: string) => GeneratedCourse[]
  getCourseById: (courseId: string) => GeneratedCourse | undefined
}

function normalizeTo5Weeks(weeklyPlan: LearningPathResult['weeklyPlan'], subject: string): CourseSection[] {
  const weeks = weeklyPlan.slice(0, 5)
  // Pad to 5 if fewer weeks
  while (weeks.length < 5) {
    const n = weeks.length + 1
    weeks.push({
      week: n,
      theme: 'Review & Assessment',
      activities: [`Review all ${subject} concepts covered`, 'Complete self-assessment quiz', 'Reflect on progress and update goals'],
      hoursRequired: 3,
    })
  }
  return weeks.map((w, i) => ({
    id: `sec-${i + 1}`,
    weekNumber: w.week,
    title: `Week ${w.week} — ${w.theme}`,
    theme: w.theme,
    activities: w.activities,
    hoursRequired: w.hoursRequired,
    completed: false,
    completedAt: null,
  }))
}

function computeProgress(sections: CourseSection[]): number {
  if (sections.length === 0) return 0
  return Math.round((sections.filter(s => s.completed).length / sections.length) * 100)
}

export const useStudentCourseStore = create<StudentCourseStore>((set, get) => ({
  courses: [],

  createCourse: (studentId, subject, path) => {
    const id = `gc-${Date.now()}`
    const sections = normalizeTo5Weeks(path.weeklyPlan, subject)
    const milestones: CourseMilestone[] = path.milestones.map(m => ({ ...m, achieved: false }))
    const course: GeneratedCourse = {
      id,
      studentId,
      subject,
      title: `Personalized ${subject} Course`,
      description: path.overallStrategy,
      createdAt: new Date().toISOString(),
      sections,
      resources: path.resources,
      milestones,
      focusAreas: path.focusAreas,
      progress: 0,
      status: 'active',
    }
    set(s => ({ courses: [course, ...s.courses] }))
    return id
  },

  toggleSectionComplete: (courseId, sectionId) => {
    set(s => ({
      courses: s.courses.map(c => {
        if (c.id !== courseId) return c
        const sections = c.sections.map(sec =>
          sec.id === sectionId
            ? { ...sec, completed: !sec.completed, completedAt: !sec.completed ? new Date().toISOString() : null }
            : sec
        )
        const progress = computeProgress(sections)
        return { ...c, sections, progress, status: progress === 100 ? 'completed' : 'active' }
      }),
    }))
  },

  toggleMilestoneAchieved: (courseId, milestoneIndex) => {
    set(s => ({
      courses: s.courses.map(c => {
        if (c.id !== courseId) return c
        const milestones = c.milestones.map((m, i) =>
          i === milestoneIndex ? { ...m, achieved: !m.achieved } : m
        )
        return { ...c, milestones }
      }),
    }))
  },

  getCoursesByStudent: (studentId) => get().courses.filter(c => c.studentId === studentId),
  getCourseById: (courseId) => get().courses.find(c => c.id === courseId),
}))
