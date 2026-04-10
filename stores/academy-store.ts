import { create } from 'zustand'
import { initialHomework, initialSubmissions, type Homework, type Submission } from '@/data/mock-homework'
// (AttendanceStatus defined here to avoid circular deps with shim stores)
import { mockApplications, type Application, type KanbanStage } from '@/data/mock-registration'
import {
  curriculumNodes, type CurriculumNode, type NodeStatus,
  lessonTemplates, type LessonTemplate, type LessonTemplateSections,
  curriculumResources, type CurriculumResource,
  standardMappings as initialStandardMappings,
  lessonContents as initialLessonContents, type LessonContent,
} from '@/data/mock-curriculum'
import {
  thresholdBands, curationRules, riskFactors, fieldMappings, diagnosticAssessments,
  advancementRules, pathwayStageConfigs,
  type ThresholdBand, type CurationRule, type RiskFactor,
  type FieldMapping, type DiagnosticAssessment,
  type AdvancementRule, type PathwayStageConfig,
} from '@/data/mock-ilp'

// ─── Re-exported types (so old store imports keep working) ───────────────────

export type { Homework, Submission }
export type { LessonTemplate, LessonTemplateSections, CurriculumResource, LessonContent }

// ─── Attendance ──────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late'

export type AttendanceRecord = {
  date: string
  classId: string
  studentId: string
  status: AttendanceStatus
}

// ─── Learning Paths ──────────────────────────────────────────────────────────

export type LearningPathResult = {
  focusAreas: { subject: string; priority: string; currentLevel: string; targetLevel: string; recommendation: string }[]
  weeklyPlan: { week: number; theme: string; activities: string[]; hoursRequired: number }[]
  resources: { title: string; type: string; subject: string; priority: string; estimatedTime: string }[]
  milestones: { title: string; targetWeek: number; metric: string; subject: string }[]
  overallStrategy: string
}

export type PublishedPath = {
  path: LearningPathResult
  publishedAt: string
  teacherId: string
  teacherName: string
}

// ─── Generated Courses ───────────────────────────────────────────────────────

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

// ─── Leave Requests ──────────────────────────────────────────────────────────

export type LeaveType = 'medical' | 'family-emergency' | 'travel' | 'religious' | 'other'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export type LeaveRequest = {
  id: string
  parentId: string
  studentId: string
  studentName: string
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  submittedDate: string
  reviewedBy?: string
  reviewNote?: string
}

// ─── ILP Settings ────────────────────────────────────────────────────────────

export type IlpSettings = {
  thresholdBands: ThresholdBand[]
  curationRules: CurationRule[]
  riskFactors: RiskFactor[]
  fieldMappings: FieldMapping[]
  diagnosticAssessments: DiagnosticAssessment[]
  advancementRules: AdvancementRule[]
  pathwayStageConfigs: PathwayStageConfig[]
  notificationsEnabled: boolean
}

// ─── App Notifications ───────────────────────────────────────────────────────

export type AppNotificationType = 'homework' | 'attendance' | 'leave' | 'grade' | 'ilp' | 'registration' | 'curriculum' | 'message'

export type AppNotification = {
  id: string
  type: AppNotificationType
  title: string
  body: string
  recipientRole: 'admin' | 'teacher' | 'student' | 'parent' | 'all'
  recipientId?: string
  relatedId?: string
  createdAt: string
  read: boolean
}

// ─── Leave Request extras ────────────────────────────────────────────────────

// (LeaveRequest type is imported from leave-request-store which will remain as a shim)

// ─── Lesson Plan (class-activities/lessons) ──────────────────────────────────

export type LessonPlanStatus = 'draft' | 'approved'

export type LessonPlan = {
  id: string
  teacherId: string
  classId: string
  subject: string
  topic: string
  date: string
  duration: number
  objectives: string[]
  materials: string[]
  status: LessonPlanStatus
  createdAt: string
}

// ─── Student Notes ────────────────────────────────────────────────────────────

export type StudentNote = {
  id: string
  studentId: string
  authorId: string
  authorRole: 'teacher' | 'admin'
  text: string
  createdAt: string
}

// ─── Exams (runtime-created via create-exam wizard) ──────────────────────────

export type { Exam, AdaptiveBlueprint } from '@/data/mock-assessments'
import type { Exam } from '@/data/mock-assessments'

// ─── Exam Submission (assessments/grading) ───────────────────────────────────

export type ExamSubmissionRecord = {
  id: string
  examId: string
  studentId: string
  studentName: string
  submittedAt: string
  score: number | null
  feedback: string
  status: 'submitted' | 'graded'
}

// ─── Academy State ───────────────────────────────────────────────────────────

type AcademyState = {
  // Homework
  homework: Homework[]
  submissions: Submission[]

  // Attendance
  attendance: AttendanceRecord[]

  // Leave requests
  leaveRequests: LeaveRequest[]

  // Learning paths (keyed by studentId)
  publishedPaths: Record<string, PublishedPath>

  // Generated courses
  generatedCourses: GeneratedCourse[]

  // Registration applications
  registrationApps: Application[]

  // Curriculum nodes (drives review kanban + builder)
  curriculumNodes: CurriculumNode[]

  // Curriculum templates
  lessonTemplates: LessonTemplate[]

  // Curriculum resources
  curriculumResources: CurriculumResource[]

  // Standard mappings (nodeId → standardId)
  standardMappings: { nodeId: string; standardId: string }[]

  // Lesson contents (keyed by lessonId)
  lessonContents: Record<string, LessonContent>

  // Lesson plans (class-activities/lessons)
  lessonPlans: LessonPlan[]

  // Student notes (teacher/admin detail pages)
  studentNotes: StudentNote[]

  // Exams created via create-exam wizard (runtime-only)
  customExams: Exam[]

  // Exam submissions (assessments/grading)
  examSubmissions: ExamSubmissionRecord[]

  // ILP settings (mutable config for all ILP sub-pages)
  ilpSettings: IlpSettings

  // In-app notifications
  appNotifications: AppNotification[]

  // ── Homework actions ──────────────────────────────────────────────────────
  createHomework: (hw: Omit<Homework, 'id' | 'createdDate'>) => string
  updateHomeworkStatus: (id: string, status: Homework['status']) => void
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void
  submitHomework: (homeworkId: string, studentId: string, content: string) => void
  getHomeworkById: (id: string) => Homework | undefined
  getSubmissionById: (id: string) => Submission | undefined
  getSubmissionsForHomework: (homeworkId: string) => Submission[]
  getSubmissionForStudent: (homeworkId: string, studentId: string) => Submission | undefined
  getPendingSubmissions: (teacherId: string) => Submission[]

  // ── Attendance actions ────────────────────────────────────────────────────
  setAttendance: (date: string, classId: string, studentId: string, status: AttendanceStatus) => void
  saveAttendance: (date: string, classId: string, records: Record<string, AttendanceStatus>) => void
  getAttendanceMap: (date: string, classId: string) => Record<string, AttendanceStatus>

  // ── Leave request actions ─────────────────────────────────────────────────
  submitRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>) => string
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>) => string
  decideLeaveRequest: (id: string, decision: 'approved' | 'rejected', reviewedBy: string, note?: string) => void
  getRequestsByParent: (parentId: string) => LeaveRequest[]
  getRequestsByStudent: (studentId: string) => LeaveRequest[]

  // ── Learning path actions ─────────────────────────────────────────────────
  publishPath: (studentId: string, path: LearningPathResult, teacherIdOrName: string, teacherName?: string) => void
  getPublishedPath: (studentId: string) => PublishedPath | undefined

  // ── Generated course actions ──────────────────────────────────────────────
  createCourse: (studentId: string, subject: string, path: LearningPathResult) => string
  toggleSectionComplete: (courseId: string, sectionId: string) => void
  toggleMilestoneAchieved: (courseId: string, milestoneIndex: number) => void
  getCoursesByStudent: (studentId: string) => GeneratedCourse[]
  getCourseById: (courseId: string) => GeneratedCourse | undefined

  // ── Registration actions ──────────────────────────────────────────────────
  advanceApplication: (appId: string, actor: string) => void
  setApplicationStatus: (appId: string, status: Application['status'], note?: string) => void
  flagApplication: (appId: string, flag: boolean) => void
  assignReviewer: (appId: string, reviewer: string, initials: string) => void
  getApplicationById: (appId: string) => Application | undefined
  createApplication: (partial: Partial<Application>) => string

  // ── Curriculum node actions ───────────────────────────────────────────────
  updateNodeStatus: (nodeId: string, status: NodeStatus, actor?: string) => void
  addNodeComment: (nodeId: string, comment: string, author: string) => void
  addCurriculumNode: (parentId: string | null, node: Omit<CurriculumNode, 'id'>) => string
  updateCurriculumNode: (nodeId: string, patch: Partial<CurriculumNode>) => void
  setLessonContent: (lessonId: string, content: LessonContent) => void

  // ── Lesson template actions ───────────────────────────────────────────────
  addLessonTemplate: (template: Omit<LessonTemplate, 'id'>) => string
  updateLessonTemplate: (id: string, patch: Partial<LessonTemplate>) => void
  cloneLessonTemplate: (id: string) => string

  // ── Curriculum resource actions ───────────────────────────────────────────
  uploadResource: (resource: Omit<CurriculumResource, 'id'>) => string
  attachResourceToLesson: (resourceId: string, nodeId: string) => void

  // ── Standard mapping actions ──────────────────────────────────────────────
  linkStandard: (nodeId: string, standardId: string) => void
  unlinkStandard: (nodeId: string, standardId: string) => void

  // ── Lesson plan actions (class-activities/lessons) ────────────────────────
  createLessonPlan: (plan: Omit<LessonPlan, 'id' | 'createdAt' | 'status'>) => string
  approveLessonPlan: (id: string) => void

  // ── Student note actions ──────────────────────────────────────────────────
  addStudentNote: (studentId: string, text: string, authorId: string, authorRole: 'teacher' | 'admin') => void
  getStudentNotes: (studentId: string) => StudentNote[]

  // ── Exam actions ──────────────────────────────────────────────────────────
  addExam: (exam: Omit<Exam, 'id'>) => string

  // ── Exam submission actions ───────────────────────────────────────────────
  addExamSubmission: (sub: Omit<ExamSubmissionRecord, 'id'>) => string
  gradeExamSubmission: (subId: string, score: number, feedback: string) => void

  // ── ILP settings actions ──────────────────────────────────────────────────
  updateThresholds: (bands: ThresholdBand[]) => void
  updateRiskFactors: (factors: RiskFactor[]) => void
  updateCurationRules: (rules: CurationRule[]) => void
  updateFieldMappings: (mappings: FieldMapping[]) => void
  toggleDiagnosticAssessment: (id: string) => void
  setNotificationsEnabled: (enabled: boolean) => void

  // ── Notification actions ──────────────────────────────────────────────────
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  getNotificationsFor: (role: AppNotification['recipientRole'], recipientId?: string) => AppNotification[]
}

// ─── Counters ────────────────────────────────────────────────────────────────

let hwCounter = 100
let lrCounter = 100
let notifCounter = 1000
let courseCounter = 1000
let nodeCounter = 1000
let tmplCounter = 100
let resCounter = 100
let planCounter = 100
let noteCounter = 100
let examSubCounter = 100
let examCounter = 100
let appCounter = 20 // APP-2026-020 onwards

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STAGE_ORDER: KanbanStage[] = [
  'Application Submitted',
  'Emirates ID Verified',
  'Documents Under Review',
  'AI Scored',
  'Decision Made',
  'Enrolled',
]

function nextStage(current: KanbanStage): KanbanStage | null {
  const idx = STAGE_ORDER.indexOf(current)
  return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null
}

function normalizeTo5Weeks(
  weeklyPlan: LearningPathResult['weeklyPlan'],
  subject: string
): CourseSection[] {
  const weeks = weeklyPlan.slice(0, 5)
  while (weeks.length < 5) {
    const n = weeks.length + 1
    weeks.push({
      week: n,
      theme: 'Review & Assessment',
      activities: [
        `Review all ${subject} concepts covered`,
        'Complete self-assessment quiz',
        'Reflect on progress and update goals',
      ],
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

// ─── Seed leave requests ─────────────────────────────────────────────────────

const seedLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr-001',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    type: 'medical',
    startDate: '2026-03-05',
    endDate: '2026-03-06',
    reason: 'Scheduled medical appointment at Al Zahra Hospital for routine check-up.',
    status: 'approved',
    submittedDate: '2026-03-03',
    reviewedBy: 'Ms. Fatima Al-Zaabi',
    reviewNote: 'Approved — please bring medical certificate upon return.',
  },
  {
    id: 'lr-002',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    type: 'travel',
    startDate: '2026-02-15',
    endDate: '2026-02-18',
    reason: 'Family travel for a wedding in Riyadh.',
    status: 'approved',
    submittedDate: '2026-02-10',
    reviewedBy: 'Ms. Fatima Al-Zaabi',
  },
  {
    id: 'lr-003',
    parentId: 'par-002',
    studentId: 'stu-002',
    studentName: 'Fatima Hassan',
    type: 'other',
    startDate: '2026-03-20',
    endDate: '2026-03-20',
    reason: 'Participation in external robotics competition.',
    status: 'pending',
    submittedDate: '2026-03-18',
  },
]

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAcademyStore = create<AcademyState>((set, get) => ({
  homework: initialHomework,
  submissions: initialSubmissions,
  attendance: [],
  leaveRequests: seedLeaveRequests,
  publishedPaths: {},
  generatedCourses: [],
  registrationApps: mockApplications,
  curriculumNodes: curriculumNodes,
  lessonTemplates: lessonTemplates,
  curriculumResources: curriculumResources,
  standardMappings: initialStandardMappings,
  lessonContents: Object.fromEntries(initialLessonContents.map(lc => [lc.lessonId, lc])),
  lessonPlans: [],
  studentNotes: [],
  customExams: [],
  examSubmissions: [],
  ilpSettings: {
    thresholdBands,
    curationRules,
    riskFactors,
    fieldMappings,
    diagnosticAssessments,
    advancementRules,
    pathwayStageConfigs,
    notificationsEnabled: true,
  },
  appNotifications: [],

  // ── Homework ──────────────────────────────────────────────────────────────

  createHomework: (hw) => {
    const id = `hw-${String(++hwCounter).padStart(3, '0')}`
    const newHw: Homework = {
      ...hw,
      id,
      createdDate: new Date().toISOString().split('T')[0],
    }
    set(s => ({ homework: [newHw, ...s.homework] }))
    get().addNotification({
      type: 'homework',
      title: 'New homework created',
      body: `"${hw.title}" has been created for class ${hw.classId}.`,
      recipientRole: 'teacher',
    })
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
    const sub = get().submissions.find(s => s.id === submissionId)
    if (sub) {
      get().addNotification({
        type: 'grade',
        title: 'Assignment graded',
        body: `Your submission has been graded: ${grade} points.`,
        recipientRole: 'student',
        recipientId: sub.studentId,
        relatedId: sub.homeworkId,
      })
    }
  },

  submitHomework: (homeworkId, studentId, content) => {
    set(s => {
      const existing = s.submissions.find(
        sub => sub.homeworkId === homeworkId && sub.studentId === studentId
      )
      if (existing) {
        return {
          submissions: s.submissions.map(sub =>
            sub.id === existing.id
              ? { ...sub, content, status: 'submitted' as const, submittedDate: new Date().toISOString().split('T')[0] }
              : sub
          ),
        }
      }
      const newSub: Submission = {
        id: `sub-${Date.now()}`,
        homeworkId,
        studentId,
        content,
        status: 'submitted',
        submittedDate: new Date().toISOString().split('T')[0],
        grade: null,
        feedback: null,
        aiScore: null,
        aiFeedback: null,
      }
      return { submissions: [...s.submissions, newSub] }
    })
  },

  getHomeworkById: (id) => get().homework.find(h => h.id === id),
  getSubmissionById: (id) => get().submissions.find(s => s.id === id),
  getSubmissionsForHomework: (homeworkId) =>
    get().submissions.filter(s => s.homeworkId === homeworkId),
  getSubmissionForStudent: (homeworkId, studentId) =>
    get().submissions.find(s => s.homeworkId === homeworkId && s.studentId === studentId),
  getPendingSubmissions: (teacherId) => {
    const teacherHwIds = new Set(
      get().homework.filter(h => h.teacherId === teacherId).map(h => h.id)
    )
    return get().submissions.filter(
      s => teacherHwIds.has(s.homeworkId) && s.status === 'submitted'
    )
  },

  // ── Attendance ────────────────────────────────────────────────────────────

  setAttendance: (date, classId, studentId, status) => {
    set(state => {
      const filtered = state.attendance.filter(
        r => !(r.date === date && r.classId === classId && r.studentId === studentId)
      )
      return { attendance: [...filtered, { date, classId, studentId, status }] }
    })
  },

  saveAttendance: (date, classId, records) => {
    set(state => {
      const filtered = state.attendance.filter(
        r => !(r.date === date && r.classId === classId)
      )
      const newRecords = Object.entries(records).map(([studentId, status]) => ({
        date, classId, studentId, status,
      }))
      return { attendance: [...filtered, ...newRecords] }
    })
    // Notify admin about any absences
    const absentCount = Object.values(records).filter(s => s === 'absent').length
    if (absentCount > 0) {
      get().addNotification({
        type: 'attendance',
        title: 'Attendance saved',
        body: `${absentCount} absence(s) recorded for class ${classId} on ${date}.`,
        recipientRole: 'admin',
        relatedId: classId,
      })
    }
  },

  getAttendanceMap: (date, classId) => {
    const map: Record<string, AttendanceStatus> = {}
    get().attendance
      .filter(r => r.date === date && r.classId === classId)
      .forEach(r => { map[r.studentId] = r.status })
    return map
  },

  // ── Leave requests ────────────────────────────────────────────────────────

  submitRequest: (req) => {
    return get().submitLeaveRequest(req)
  },

  submitLeaveRequest: (req) => {
    const id = `lr-${String(++lrCounter).padStart(3, '0')}`
    const newReq: LeaveRequest = {
      ...req,
      id,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    }
    set(s => ({ leaveRequests: [newReq, ...s.leaveRequests] }))
    get().addNotification({
      type: 'leave',
      title: 'Leave request submitted',
      body: `New leave request for ${req.studentName} (${req.startDate} – ${req.endDate}).`,
      recipientRole: 'admin',
      relatedId: id,
    })
    return id
  },

  decideLeaveRequest: (id, decision, reviewedBy, note) => {
    set(s => ({
      leaveRequests: s.leaveRequests.map(r =>
        r.id === id
          ? { ...r, status: decision, reviewedBy, reviewNote: note }
          : r
      ),
    }))
    const req = get().leaveRequests.find(r => r.id === id)
    if (req) {
      get().addNotification({
        type: 'leave',
        title: `Leave request ${decision}`,
        body: `Your leave request (${req.startDate} – ${req.endDate}) has been ${decision}.`,
        recipientRole: 'parent',
        recipientId: req.parentId,
        relatedId: id,
      })
    }
  },

  getRequestsByParent: (parentId) =>
    get().leaveRequests.filter(r => r.parentId === parentId),
  getRequestsByStudent: (studentId) =>
    get().leaveRequests.filter(r => r.studentId === studentId),

  // ── Learning paths ────────────────────────────────────────────────────────

  publishPath: (studentId, path, teacherIdOrName, teacherName) => {
    // Backwards-compat: old callers pass (studentId, path, teacherName)
    // New callers pass (studentId, path, teacherId, teacherName)
    const isId = teacherIdOrName?.startsWith('tch-')
    const teacherId = isId ? teacherIdOrName : ''
    const resolvedName = teacherName ?? teacherIdOrName
    set(s => ({
      publishedPaths: {
        ...s.publishedPaths,
        [studentId]: { path, publishedAt: new Date().toISOString(), teacherId, teacherName: resolvedName },
      },
    }))
    get().addNotification({
      type: 'ilp',
      title: 'Learning path published',
      body: 'Your teacher has published a personalised learning path for you.',
      recipientRole: 'student',
      recipientId: studentId,
    })
  },

  getPublishedPath: (studentId) => get().publishedPaths[studentId],

  // ── Generated courses ─────────────────────────────────────────────────────

  createCourse: (studentId, subject, path) => {
    const id = `gc-${String(++courseCounter)}`
    const sections = normalizeTo5Weeks(path.weeklyPlan, subject)
    const milestones: CourseMilestone[] = path.milestones.map(m => ({ ...m, achieved: false }))
    const course: GeneratedCourse = {
      id,
      studentId,
      subject,
      title: `Personalised ${subject} Course`,
      description: path.overallStrategy,
      createdAt: new Date().toISOString(),
      sections,
      resources: path.resources,
      milestones,
      focusAreas: path.focusAreas,
      progress: 0,
      status: 'active',
    }
    set(s => ({ generatedCourses: [course, ...s.generatedCourses] }))
    return id
  },

  toggleSectionComplete: (courseId, sectionId) => {
    set(s => ({
      generatedCourses: s.generatedCourses.map(c => {
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
      generatedCourses: s.generatedCourses.map(c => {
        if (c.id !== courseId) return c
        const milestones = c.milestones.map((m, i) =>
          i === milestoneIndex ? { ...m, achieved: !m.achieved } : m
        )
        return { ...c, milestones }
      }),
    }))
  },

  getCoursesByStudent: (studentId) =>
    get().generatedCourses.filter(c => c.studentId === studentId),
  getCourseById: (courseId) =>
    get().generatedCourses.find(c => c.id === courseId),

  // ── Registration ──────────────────────────────────────────────────────────

  advanceApplication: (appId, actor) => {
    set(s => ({
      registrationApps: s.registrationApps.map(app => {
        if (app.id !== appId) return app
        const next = nextStage(app.stage)
        if (!next) return app
        return {
          ...app,
          stage: next,
          timeline: [
            ...app.timeline,
            { stage: next, date: new Date().toISOString().split('T')[0], actor },
          ],
        }
      }),
    }))
    const app = get().registrationApps.find(a => a.id === appId)
    if (app) {
      get().addNotification({
        type: 'registration',
        title: 'Application advanced',
        body: `Application ${appId} (${app.nameEn}) moved to "${app.stage}".`,
        recipientRole: 'admin',
        relatedId: appId,
      })
    }
  },

  setApplicationStatus: (appId, status, note) => {
    set(s => ({
      registrationApps: s.registrationApps.map(app => {
        if (app.id !== appId) return app
        return {
          ...app,
          status,
          timeline: [
            ...app.timeline,
            {
              stage: `Status: ${status}`,
              date: new Date().toISOString().split('T')[0],
              actor: 'Admin',
              note,
            },
          ],
        }
      }),
    }))
  },

  flagApplication: (appId, flag) => {
    set(s => ({
      registrationApps: s.registrationApps.map(app =>
        app.id === appId ? { ...app, flagged: flag } : app
      ),
    }))
  },

  assignReviewer: (appId, reviewer, initials) => {
    set(s => ({
      registrationApps: s.registrationApps.map(app =>
        app.id === appId
          ? { ...app, assignedReviewer: reviewer, reviewerInitials: initials }
          : app
      ),
    }))
  },

  getApplicationById: (appId) =>
    get().registrationApps.find(a => a.id === appId),

  // ── Curriculum nodes ──────────────────────────────────────────────────────

  updateNodeStatus: (nodeId, status, actor = 'Admin') => {
    set(s => ({
      curriculumNodes: s.curriculumNodes.map(n =>
        n.id === nodeId
          ? { ...n, status, updatedAt: new Date().toISOString().split('T')[0], updatedBy: actor }
          : n
      ),
    }))
    get().addNotification({
      type: 'curriculum',
      title: 'Curriculum node updated',
      body: `Node status changed to "${status}" by ${actor}.`,
      recipientRole: 'admin',
      relatedId: nodeId,
    })
  },

  addNodeComment: (nodeId, comment, author) => {
    // Comments are stored in the notification stream for this prototype
    get().addNotification({
      type: 'curriculum',
      title: `Comment on curriculum node`,
      body: `${author}: ${comment}`,
      recipientRole: 'all',
      relatedId: nodeId,
    })
  },

  // ── ILP settings ──────────────────────────────────────────────────────────

  updateThresholds: (bands) => {
    set(s => ({ ilpSettings: { ...s.ilpSettings, thresholdBands: bands } }))
  },

  updateRiskFactors: (factors) => {
    set(s => ({ ilpSettings: { ...s.ilpSettings, riskFactors: factors } }))
  },

  updateCurationRules: (rules) => {
    set(s => ({ ilpSettings: { ...s.ilpSettings, curationRules: rules } }))
  },

  updateFieldMappings: (mappings) => {
    set(s => ({ ilpSettings: { ...s.ilpSettings, fieldMappings: mappings } }))
  },

  toggleDiagnosticAssessment: (id) => {
    set(s => ({
      ilpSettings: {
        ...s.ilpSettings,
        diagnosticAssessments: s.ilpSettings.diagnosticAssessments.map(d =>
          d.id === id ? { ...d, enabled: !d.enabled } : d
        ),
      },
    }))
  },

  setNotificationsEnabled: (enabled) => {
    set(s => ({ ilpSettings: { ...s.ilpSettings, notificationsEnabled: enabled } }))
  },

  // ── Notifications ─────────────────────────────────────────────────────────

  addNotification: (n) => {
    const notif: AppNotification = {
      ...n,
      id: `notif-${++notifCounter}`,
      createdAt: new Date().toISOString(),
      read: false,
    }
    set(s => ({ appNotifications: [notif, ...s.appNotifications] }))
  },

  markNotificationRead: (id) => {
    set(s => ({
      appNotifications: s.appNotifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  getNotificationsFor: (role, recipientId) => {
    return get().appNotifications.filter(n =>
      n.recipientRole === 'all' ||
      n.recipientRole === role ||
      (recipientId && n.recipientId === recipientId)
    )
  },

  // ── Registration: create application ─────────────────────────────────────

  createApplication: (partial) => {
    const id = `APP-2026-${String(++appCounter).padStart(3, '0')}`
    const now = new Date().toISOString().split('T')[0]
    const newApp: Application = {
      id,
      nameEn: partial.nameEn ?? 'New Applicant',
      nameAr: partial.nameAr ?? '',
      initials: (partial.nameEn ?? 'NA').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      applicationType: partial.applicationType ?? 'New Student',
      gradeApplying: partial.gradeApplying ?? 'Grade 1',
      nationality: partial.nationality ?? '',
      stage: 'Application Submitted',
      status: 'Pending',
      submittedDate: now,
      lastUpdated: now,
      assignedReviewer: null,
      reviewerInitials: null,
      flagged: false,
      flagReasons: [],
      aiScore: null,
      scoring: null,
      documents: [],
      checklist: [],
      timeline: [{ stage: 'Application Submitted', date: now, actor: 'System', note: 'Application submitted online.' }],
      ...partial,
    } as Application
    set(s => ({ registrationApps: [newApp, ...s.registrationApps] }))
    get().addNotification({
      type: 'registration',
      title: 'New application received',
      body: `New application from ${newApp.nameEn} for ${newApp.gradeApplying}.`,
      recipientRole: 'admin',
      relatedId: id,
    })
    return id
  },

  // ── Curriculum CRUD ───────────────────────────────────────────────────────

  addCurriculumNode: (parentId, node) => {
    const id = `node-${String(++nodeCounter).padStart(3, '0')}`
    const newNode: CurriculumNode = { ...node, id, parentId }
    set(s => ({ curriculumNodes: [...s.curriculumNodes, newNode] }))
    get().addNotification({
      type: 'curriculum',
      title: 'Curriculum node added',
      body: `New ${node.nodeType} "${node.title}" added.`,
      recipientRole: 'admin',
      relatedId: id,
    })
    return id
  },

  updateCurriculumNode: (nodeId, patch) => {
    set(s => ({
      curriculumNodes: s.curriculumNodes.map(n =>
        n.id === nodeId
          ? { ...n, ...patch, updatedAt: new Date().toISOString().split('T')[0] }
          : n
      ),
    }))
  },

  setLessonContent: (lessonId, content) => {
    set(s => ({ lessonContents: { ...s.lessonContents, [lessonId]: content } }))
  },

  // ── Lesson templates ──────────────────────────────────────────────────────

  addLessonTemplate: (template) => {
    const id = `tmpl-${String(++tmplCounter).padStart(3, '0')}`
    const newTmpl: LessonTemplate = { ...template, id }
    set(s => ({ lessonTemplates: [newTmpl, ...s.lessonTemplates] }))
    get().addNotification({
      type: 'curriculum',
      title: 'Lesson template created',
      body: `Template "${template.title}" created for ${template.subject}.`,
      recipientRole: 'teacher',
      relatedId: id,
    })
    return id
  },

  updateLessonTemplate: (id, patch) => {
    set(s => ({
      lessonTemplates: s.lessonTemplates.map(t => t.id === id ? { ...t, ...patch } : t),
    }))
  },

  cloneLessonTemplate: (id) => {
    const original = get().lessonTemplates.find(t => t.id === id)
    if (!original) return ''
    const newId = `tmpl-${String(++tmplCounter).padStart(3, '0')}`
    const cloned: LessonTemplate = { ...original, id: newId, title: `${original.title} (Copy)` }
    set(s => ({ lessonTemplates: [cloned, ...s.lessonTemplates] }))
    return newId
  },

  // ── Curriculum resources ──────────────────────────────────────────────────

  uploadResource: (resource) => {
    const id = `res-${String(++resCounter).padStart(3, '0')}`
    const newRes: CurriculumResource = { ...resource, id }
    set(s => ({ curriculumResources: [newRes, ...s.curriculumResources] }))
    get().addNotification({
      type: 'curriculum',
      title: 'Resource uploaded',
      body: `Resource "${resource.name}" uploaded.`,
      recipientRole: 'teacher',
      relatedId: id,
    })
    return id
  },

  attachResourceToLesson: (resourceId, nodeId) => {
    get().addNotification({
      type: 'curriculum',
      title: 'Resource linked to lesson',
      body: `Resource linked to lesson node ${nodeId}.`,
      recipientRole: 'teacher',
      relatedId: nodeId,
    })
  },

  // ── Standard mappings ─────────────────────────────────────────────────────

  linkStandard: (nodeId, standardId) => {
    const already = get().standardMappings.some(m => m.nodeId === nodeId && m.standardId === standardId)
    if (!already) {
      set(s => ({ standardMappings: [...s.standardMappings, { nodeId, standardId }] }))
    }
    get().addNotification({
      type: 'curriculum',
      title: 'Standard linked',
      body: `Standard ${standardId} linked to node ${nodeId}.`,
      recipientRole: 'admin',
    })
  },

  unlinkStandard: (nodeId, standardId) => {
    set(s => ({
      standardMappings: s.standardMappings.filter(m => !(m.nodeId === nodeId && m.standardId === standardId)),
    }))
  },

  // ── Lesson plans ──────────────────────────────────────────────────────────

  createLessonPlan: (plan) => {
    const id = `lp-${String(++planCounter).padStart(3, '0')}`
    const newPlan: LessonPlan = {
      ...plan,
      id,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }
    set(s => ({ lessonPlans: [newPlan, ...s.lessonPlans] }))
    get().addNotification({
      type: 'curriculum',
      title: 'Lesson plan created',
      body: `Lesson plan "${plan.topic}" created for class ${plan.classId}.`,
      recipientRole: 'teacher',
      relatedId: id,
    })
    return id
  },

  approveLessonPlan: (id) => {
    set(s => ({
      lessonPlans: s.lessonPlans.map(p => p.id === id ? { ...p, status: 'approved' as const } : p),
    }))
    const plan = get().lessonPlans.find(p => p.id === id)
    get().addNotification({
      type: 'curriculum',
      title: 'Lesson plan approved',
      body: `Lesson plan "${plan?.topic ?? id}" has been approved.`,
      recipientRole: 'admin',
      relatedId: id,
    })
  },

  // ── Student notes ─────────────────────────────────────────────────────────

  addStudentNote: (studentId, text, authorId, authorRole) => {
    const id = `note-${String(++noteCounter).padStart(3, '0')}`
    const note: StudentNote = {
      id,
      studentId,
      authorId,
      authorRole,
      text,
      createdAt: new Date().toISOString(),
    }
    set(s => ({ studentNotes: [note, ...s.studentNotes] }))
  },

  getStudentNotes: (studentId) => {
    return get().studentNotes.filter(n => n.studentId === studentId)
  },

  // ── Exams ─────────────────────────────────────────────────────────────────

  addExam: (exam) => {
    const id = `exam-custom-${String(++examCounter).padStart(3, '0')}`
    const newExam: Exam = { ...exam, id }
    set(s => ({ customExams: [newExam, ...s.customExams] }))
    return id
  },

  // ── Exam submissions ──────────────────────────────────────────────────────

  addExamSubmission: (sub) => {
    const id = `esub-${String(++examSubCounter).padStart(3, '0')}`
    const newSub: ExamSubmissionRecord = { ...sub, id }
    set(s => ({ examSubmissions: [newSub, ...s.examSubmissions] }))
    return id
  },

  gradeExamSubmission: (subId, score, feedback) => {
    set(s => ({
      examSubmissions: s.examSubmissions.map(sub =>
        sub.id === subId ? { ...sub, score, feedback, status: 'graded' as const } : sub
      ),
    }))
    const sub = get().examSubmissions.find(s => s.id === subId)
    if (sub) {
      get().addNotification({
        type: 'grade',
        title: 'Exam graded',
        body: `Your exam has been graded: ${score} points.`,
        recipientRole: 'student',
        recipientId: sub.studentId,
        relatedId: sub.examId,
      })
    }
  },
}))
