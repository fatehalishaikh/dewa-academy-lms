/**
 * Academy Selectors
 *
 * Pure read functions that join the academy store with static registry data.
 * Every page should import from here instead of reaching into raw data files.
 */

import { useAcademyStore } from '@/stores/academy-store'
import { students, type Student } from '@/data/mock-students'
import { teachers, type Teacher } from '@/data/mock-teachers'
import { academyClasses, type AcademyClass } from '@/data/mock-classes'
import { parents, type Parent } from '@/data/mock-parents'
import { type Homework, type Submission } from '@/data/mock-homework'
import type { AttendanceStatus } from '@/stores/academy-store'

// ─── Entity registry lookups ─────────────────────────────────────────────────

export function getStudent(id: string): Student | undefined {
  return students.find(s => s.id === id)
}

export function getTeacher(id: string): Teacher | undefined {
  return teachers.find(t => t.id === id)
}

export function getClass(id: string): AcademyClass | undefined {
  return academyClasses.find(c => c.id === id)
}

export function getParent(id: string): Parent | undefined {
  return parents.find(p => p.id === id)
}

export function getParentByChild(studentId: string): Parent | undefined {
  const stu = getStudent(studentId)
  if (!stu) return undefined
  return parents.find(p => p.id === stu.parentId)
}

export function getClassRoster(classId: string): Student[] {
  const cls = getClass(classId)
  if (!cls) return []
  return cls.studentIds.map(id => getStudent(id)).filter(Boolean) as Student[]
}

export function getTeacherClasses(teacherId: string): AcademyClass[] {
  return academyClasses.filter(c => c.teacherId === teacherId)
}

export function getStudentClasses(studentId: string): AcademyClass[] {
  return academyClasses.filter(c => c.studentIds.includes(studentId))
}

// ─── Homework selectors ──────────────────────────────────────────────────────

export type StudentAssignmentView = {
  id: string
  title: string
  subject: string
  className: string
  teacherName: string
  dueDate: string
  totalPoints: number
  description: string
  instructions: string
  rubric: Homework['rubric']
  status: 'not-submitted' | 'submitted' | 'late' | 'graded'
  grade: number | null
  feedback: string | null
  aiScore: number | null
  aiFeedback: string | null
  submittedContent: string | null
  submittedDate: string | null
  homeworkStatus: Homework['status']
}

export function getStudentAssignments(studentId: string): StudentAssignmentView[] {
  const store = useAcademyStore.getState()
  const studentClasses = getStudentClasses(studentId)
  const classIds = new Set(studentClasses.map(c => c.id))

  const relevantHw = store.homework.filter(
    hw => classIds.has(hw.classId) && hw.status !== 'draft'
  )

  return relevantHw.map(hw => {
    const sub = store.submissions.find(
      s => s.homeworkId === hw.id && s.studentId === studentId
    )
    const cls = getClass(hw.classId)
    const teacher = getTeacher(hw.teacherId)
    return {
      id: hw.id,
      title: hw.title,
      subject: hw.subject,
      className: cls?.name ?? hw.classId,
      teacherName: teacher?.name ?? hw.teacherId,
      dueDate: hw.dueDate,
      totalPoints: hw.totalPoints,
      description: hw.description,
      instructions: hw.instructions,
      rubric: hw.rubric,
      status: sub?.status ?? 'not-submitted',
      grade: sub?.grade ?? null,
      feedback: sub?.feedback ?? null,
      aiScore: sub?.aiScore ?? null,
      aiFeedback: sub?.aiFeedback ?? null,
      submittedContent: sub?.content ?? null,
      submittedDate: sub?.submittedDate ?? null,
      homeworkStatus: hw.status,
    }
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export function getClassAssignments(classId: string): Homework[] {
  return useAcademyStore.getState().homework.filter(h => h.classId === classId)
}

export function getTeacherHomeworkToGrade(teacherId: string): { hw: Homework; sub: Submission; student: Student | undefined }[] {
  const store = useAcademyStore.getState()
  const teacherHwIds = new Set(
    store.homework.filter(h => h.teacherId === teacherId).map(h => h.id)
  )
  return store.submissions
    .filter(s => teacherHwIds.has(s.homeworkId) && s.status === 'submitted')
    .map(sub => ({
      hw: store.homework.find(h => h.id === sub.homeworkId)!,
      sub,
      student: getStudent(sub.studentId),
    }))
    .filter(r => r.hw !== undefined)
}

// ─── Attendance selectors ────────────────────────────────────────────────────

/**
 * Generates a seeded deterministic attendance baseline for a student.
 * Returns attendance for the last 30 days. Teacher-saved records from the
 * store override the baseline for the same date.
 */
export function generateAttendance(studentId: string): { date: string; status: AttendanceStatus }[] {
  // Seeded pseudo-random based on studentId
  const seed = studentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const today = new Date()
  const result: { date: string; status: AttendanceStatus }[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    // Skip weekends (Fri/Sat in UAE)
    const dow = d.getDay() // 0=Sun, 5=Fri, 6=Sat
    if (dow === 5 || dow === 6) continue

    const dateStr = d.toISOString().split('T')[0]
    // Seeded pseudo-random: ~90% present
    const hash = (seed * (i + 1) * 2654435769) >>> 0
    const rand = (hash % 100) / 100
    const status: AttendanceStatus = rand < 0.05 ? 'absent' : rand < 0.10 ? 'late' : 'present'
    result.push({ date: dateStr, status })
  }

  // Overlay store records (teacher-saved attendance overrides baseline)
  const store = useAcademyStore.getState()
  const studentClasses = getStudentClasses(studentId)
  store.attendance
    .filter(r => r.studentId === studentId && studentClasses.some(c => c.id === r.classId))
    .forEach(r => {
      const idx = result.findIndex(x => x.date === r.date)
      if (idx >= 0) {
        result[idx] = { date: r.date, status: r.status }
      } else {
        result.push({ date: r.date, status: r.status })
      }
    })

  return result.sort((a, b) => a.date.localeCompare(b.date))
}

export function getStudentAttendance(studentId: string) {
  return generateAttendance(studentId)
}

// ─── Grade / performance selectors ──────────────────────────────────────────

export function getStudentGrades(studentId: string) {
  const classes = getStudentClasses(studentId)
  const store = useAcademyStore.getState()

  return classes.map(cls => {
    const teacher = getTeacher(cls.teacherId)
    const gradedSubs = store.submissions.filter(
      s => s.studentId === studentId && s.status === 'graded'
    )
    const classHw = store.homework.filter(h => h.classId === cls.id)
    const classGradedSubs = gradedSubs.filter(s => classHw.some(h => h.id === s.homeworkId))

    const avg = classGradedSubs.length > 0
      ? Math.round(
          classGradedSubs.reduce((acc, s) => {
            const hw = classHw.find(h => h.id === s.homeworkId)
            if (!hw || !s.grade) return acc
            return acc + (s.grade / hw.totalPoints) * 100
          }, 0) / classGradedSubs.length
        )
      : cls.averageGrade

    return {
      classId: cls.id,
      subject: cls.subject,
      teacherId: cls.teacherId,
      teacher: teacher?.name ?? cls.teacherId,
      average: avg,
    }
  })
}

// ─── Risk / performance ranking ──────────────────────────────────────────────

export function getAtRiskStudents(limit = 5): Student[] {
  return students
    .filter(s => s.status === 'at-risk' || s.attendanceRate < 80 || s.gpa < 2.5)
    .sort((a, b) => a.gpa - b.gpa)
    .slice(0, limit)
}

export function getTopPerformers(limit = 5): Student[] {
  return students
    .filter(s => s.status === 'active')
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, limit)
}

export function getStudentRiskProfile(studentId: string): {
  level: 'high' | 'moderate' | 'low' | 'none'
  score: number
  factors: string[]
} {
  const stu = getStudent(studentId)
  if (!stu) return { level: 'none', score: 0, factors: [] }

  const factors: string[] = []
  let score = 0

  if (stu.attendanceRate < 75) { factors.push(`Attendance: ${stu.attendanceRate}%`); score += 35 }
  else if (stu.attendanceRate < 85) { factors.push(`Low attendance: ${stu.attendanceRate}%`); score += 15 }

  if (stu.gpa < 2.0) { factors.push('Very low GPA'); score += 40 }
  else if (stu.gpa < 2.5) { factors.push('Below-average GPA'); score += 20 }

  if (stu.status === 'at-risk') { factors.push('Flagged at-risk'); score += 25 }

  // Check missing assignments
  const store = useAcademyStore.getState()
  const classes = getStudentClasses(studentId)
  const classIds = new Set(classes.map(c => c.id))
  const publishedHw = store.homework.filter(h => classIds.has(h.classId) && h.status !== 'draft')
  const missing = publishedHw.filter(hw => {
    const sub = store.submissions.find(s => s.homeworkId === hw.id && s.studentId === studentId)
    return !sub || sub.status === 'not-submitted'
  })
  if (missing.length >= 3) { factors.push(`${missing.length} missing assignments`); score += 20 }
  else if (missing.length >= 1) { factors.push(`${missing.length} missing assignment(s)`); score += 5 }

  const level = score >= 60 ? 'high' : score >= 35 ? 'moderate' : score >= 10 ? 'low' : 'none'
  return { level, score: Math.min(score, 100), factors }
}

// ─── Registration selectors ──────────────────────────────────────────────────

export function getPipelineCounts(): Record<string, number> {
  const apps = useAcademyStore.getState().registrationApps
  const counts: Record<string, number> = {}
  apps.forEach(a => {
    counts[a.stage] = (counts[a.stage] ?? 0) + 1
  })
  return counts
}

export function getApplicationsByStage(stage: string) {
  return useAcademyStore.getState().registrationApps.filter(a => a.stage === stage)
}

// ─── Dashboard inbox ─────────────────────────────────────────────────────────

export type InboxItem = {
  id: string
  title: string
  count?: number
  urgency: 'high' | 'normal'
  href: string
  type: string
}

export function getDashboardInbox(
  role: 'admin' | 'teacher' | 'student' | 'parent',
  personId: string
): InboxItem[] {
  const store = useAcademyStore.getState()
  const items: InboxItem[] = []

  if (role === 'teacher') {
    const pendingSubs = store.getPendingSubmissions(personId)
    if (pendingSubs.length > 0) {
      items.push({
        id: 'pending-grading',
        title: `${pendingSubs.length} submission${pendingSubs.length > 1 ? 's' : ''} to grade`,
        count: pendingSubs.length,
        urgency: 'high',
        href: '/teacher/homework',
        type: 'homework',
      })
    }

    const classes = getTeacherClasses(personId)
    const today = new Date().toISOString().split('T')[0]
    const unmarkedClasses = classes.filter(cls => {
      const map = store.getAttendanceMap(today, cls.id)
      return Object.keys(map).length === 0
    })
    if (unmarkedClasses.length > 0) {
      items.push({
        id: 'attendance-unmarked',
        title: `${unmarkedClasses.length} class${unmarkedClasses.length > 1 ? 'es' : ''} missing attendance`,
        count: unmarkedClasses.length,
        urgency: 'high',
        href: '/class-activities/attendance',
        type: 'attendance',
      })
    }

    const draftHw = store.homework.filter(h => h.teacherId === personId && h.status === 'draft')
    if (draftHw.length > 0) {
      items.push({
        id: 'draft-homework',
        title: `${draftHw.length} draft homework not published`,
        count: draftHw.length,
        urgency: 'normal',
        href: '/teacher/homework',
        type: 'homework',
      })
    }
  }

  if (role === 'admin') {
    const pendingLeave = store.leaveRequests.filter(r => r.status === 'pending')
    if (pendingLeave.length > 0) {
      items.push({
        id: 'pending-leave',
        title: `${pendingLeave.length} leave request${pendingLeave.length > 1 ? 's' : ''} pending`,
        count: pendingLeave.length,
        urgency: 'high',
        href: '/admin/leave-requests',
        type: 'leave',
      })
    }

    const pendingApps = store.registrationApps.filter(a => a.stage === 'Application Submitted')
    if (pendingApps.length > 0) {
      items.push({
        id: 'new-applications',
        title: `${pendingApps.length} new application${pendingApps.length > 1 ? 's' : ''} awaiting review`,
        count: pendingApps.length,
        urgency: 'normal',
        href: '/registration/applications',
        type: 'registration',
      })
    }

    const flaggedApps = store.registrationApps.filter(a => a.flagged)
    if (flaggedApps.length > 0) {
      items.push({
        id: 'flagged-apps',
        title: `${flaggedApps.length} flagged application${flaggedApps.length > 1 ? 's' : ''}`,
        count: flaggedApps.length,
        urgency: 'high',
        href: '/registration/applications',
        type: 'registration',
      })
    }

    const reviewNodes = store.curriculumNodes.filter(n => n.status === 'under-review')
    if (reviewNodes.length > 0) {
      items.push({
        id: 'curriculum-review',
        title: `${reviewNodes.length} curriculum item${reviewNodes.length > 1 ? 's' : ''} awaiting approval`,
        count: reviewNodes.length,
        urgency: 'normal',
        href: '/curriculum/review',
        type: 'curriculum',
      })
    }
  }

  if (role === 'student') {
    const assignments = getStudentAssignments(personId)
    const today = new Date().toISOString().split('T')[0]
    const overdue = assignments.filter(
      a => a.status === 'not-submitted' && a.dueDate < today && a.homeworkStatus !== 'draft'
    )
    if (overdue.length > 0) {
      items.push({
        id: 'overdue',
        title: `${overdue.length} overdue assignment${overdue.length > 1 ? 's' : ''}`,
        count: overdue.length,
        urgency: 'high',
        href: '/student/assignments',
        type: 'homework',
      })
    }
    const dueSoon = assignments.filter(
      a => a.status === 'not-submitted' && a.dueDate >= today && a.homeworkStatus !== 'draft'
    )
    if (dueSoon.length > 0) {
      items.push({
        id: 'due-soon',
        title: `${dueSoon.length} upcoming assignment${dueSoon.length > 1 ? 's' : ''}`,
        count: dueSoon.length,
        urgency: 'normal',
        href: '/student/assignments',
        type: 'homework',
      })
    }
  }

  if (role === 'parent') {
    const childId = students.find(s => s.parentId === personId)?.id
    if (childId) {
      const pendingLeave = store.leaveRequests.filter(
        r => r.studentId === childId && r.status === 'pending'
      )
      if (pendingLeave.length > 0) {
        items.push({
          id: 'leave-pending',
          title: 'Leave request under review',
          urgency: 'normal',
          href: '/parent/leave-request',
          type: 'leave',
        })
      }

      const att = generateAttendance(childId)
      const recentAbsences = att.filter(a => a.status === 'absent').slice(-5).length
      if (recentAbsences > 0) {
        items.push({
          id: 'absences',
          title: `${recentAbsences} recent absence${recentAbsences > 1 ? 's' : ''}`,
          count: recentAbsences,
          urgency: recentAbsences >= 3 ? 'high' : 'normal',
          href: '/parent/attendance',
          type: 'attendance',
        })
      }
    }
  }

  return items
}
