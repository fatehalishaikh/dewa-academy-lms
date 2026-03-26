import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/app-layout'
import { TeacherLayout } from '@/components/layout/teacher-layout'
import { StudentLayout } from '@/components/layout/student-layout'
import { ParentLayout } from '@/components/layout/parent-layout'
import { useRoleStore } from '@/stores/role-store'
import { RoleSelectPage } from '@/pages/role-select'

// ── Admin / shared module pages ──────────────────────────────────────────────
const ClassActivitiesDashboard = lazy(() => import('@/pages/class-activities/index').then(m => ({ default: m.ClassActivitiesModule })))
const AssessmentsDashboard = lazy(() => import('@/pages/assessments/index').then(m => ({ default: m.AssessmentsModule })))
const IlpModule = lazy(() => import('@/pages/ilp').then(m => ({ default: m.IlpModule })))
const CurriculumDashboard = lazy(() => import('@/pages/curriculum/index').then(m => ({ default: m.CurriculumDashboard })))
const RegistrationModule = lazy(() => import('@/pages/registration').then(m => ({ default: m.RegistrationModule })))

// ── Teacher pages ─────────────────────────────────────────────────────────────
const TeacherClasses = lazy(() => import('@/pages/teacher/classes').then(m => ({ default: m.TeacherClasses })))
const TeacherHomework = lazy(() => import('@/pages/teacher/homework').then(m => ({ default: m.TeacherHomework })))
const HomeworkCreate = lazy(() => import('@/pages/teacher/homework-create').then(m => ({ default: m.HomeworkCreate })))
const HomeworkDetail = lazy(() => import('@/pages/teacher/homework-detail').then(m => ({ default: m.HomeworkDetail })))
const HomeworkGrade = lazy(() => import('@/pages/teacher/homework-grade').then(m => ({ default: m.HomeworkGrade })))
const ClassDetail = lazy(() => import('@/pages/teacher/class-detail').then(m => ({ default: m.ClassDetail })))
const StudentAnalysis = lazy(() => import('@/pages/teacher/student-analysis').then(m => ({ default: m.StudentAnalysis })))
const TeacherGradebook = lazy(() => import('@/pages/teacher/gradebook').then(m => ({ default: m.TeacherGradebook })))
const TeacherStudents = lazy(() => import('@/pages/teacher/students').then(m => ({ default: m.TeacherStudents })))

// ── Student pages ─────────────────────────────────────────────────────────────
const StudentDashboard = lazy(() => import('@/pages/student/dashboard').then(m => ({ default: m.StudentDashboard })))
const StudentAssignments = lazy(() => import('@/pages/student/assignments').then(m => ({ default: m.StudentAssignments })))
const StudentGrades = lazy(() => import('@/pages/student/grades').then(m => ({ default: m.StudentGrades })))
const StudentSchedule = lazy(() => import('@/pages/student/schedule').then(m => ({ default: m.StudentSchedule })))
const StudentAiTutor = lazy(() => import('@/pages/student/ai-tutor').then(m => ({ default: m.StudentAiTutor })))

// ── Parent pages ──────────────────────────────────────────────────────────────
const ParentDashboard = lazy(() => import('@/pages/parent/dashboard').then(m => ({ default: m.ParentDashboard })))
const ParentGrades = lazy(() => import('@/pages/parent/grades').then(m => ({ default: m.ParentGrades })))
const ParentAttendance = lazy(() => import('@/pages/parent/attendance').then(m => ({ default: m.ParentAttendance })))
const ParentMessages = lazy(() => import('@/pages/parent/messages').then(m => ({ default: m.ParentMessages })))

function AdminRoutes() {
  return (
    <TooltipProvider delay={400}>
      <AppLayout>
        <Suspense>
          <Routes>
            <Route path="/" element={<Navigate to="/class-activities" replace />} />
            <Route path="/class-activities/*" element={<ClassActivitiesDashboard />} />
            <Route path="/assessments/*" element={<AssessmentsDashboard />} />
            <Route path="/ilp/*" element={<IlpModule />} />
            <Route path="/curriculum/*" element={<CurriculumDashboard />} />
            <Route path="/registration/*" element={<RegistrationModule />} />
            <Route path="*" element={<Navigate to="/class-activities" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </TooltipProvider>
  )
}

function TeacherRoutes() {
  return (
    <TooltipProvider delay={400}>
      <TeacherLayout>
        <Suspense>
          <Routes>
            <Route path="/" element={<Navigate to="/teacher/classes" replace />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/classes/:id" element={<ClassDetail />} />
            <Route path="/teacher/homework" element={<TeacherHomework />} />
            <Route path="/teacher/homework/create" element={<HomeworkCreate />} />
            <Route path="/teacher/homework/:id" element={<HomeworkDetail />} />
            <Route path="/teacher/homework/:id/grade/:submissionId" element={<HomeworkGrade />} />
            <Route path="/teacher/gradebook" element={<TeacherGradebook />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/students/:id" element={<StudentAnalysis />} />
            {/* Shared module pages — teacher can view */}
            <Route path="/class-activities/*" element={<ClassActivitiesDashboard />} />
            <Route path="/curriculum/*" element={<CurriculumDashboard />} />
            <Route path="/assessments/*" element={<AssessmentsDashboard />} />
            <Route path="/ilp/*" element={<IlpModule />} />
            <Route path="*" element={<Navigate to="/teacher/classes" replace />} />
          </Routes>
        </Suspense>
      </TeacherLayout>
    </TooltipProvider>
  )
}

function StudentRoutes() {
  return (
    <TooltipProvider delay={400}>
      <StudentLayout>
        <Suspense>
          <Routes>
            <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/grades" element={<StudentGrades />} />
            <Route path="/student/schedule" element={<StudentSchedule />} />
            <Route path="/student/ai-tutor" element={<StudentAiTutor />} />
            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Routes>
        </Suspense>
      </StudentLayout>
    </TooltipProvider>
  )
}

function ParentRoutes() {
  return (
    <TooltipProvider delay={400}>
      <ParentLayout>
        <Suspense>
          <Routes>
            <Route path="/" element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/grades" element={<ParentGrades />} />
            <Route path="/parent/attendance" element={<ParentAttendance />} />
            <Route path="/parent/messages" element={<ParentMessages />} />
            <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
          </Routes>
        </Suspense>
      </ParentLayout>
    </TooltipProvider>
  )
}

export default function App() {
  const { role } = useRoleStore()

  if (!role) return <RoleSelectPage />
  if (role === 'admin') return <AdminRoutes />
  if (role === 'teacher') return <TeacherRoutes />
  if (role === 'student') return <StudentRoutes />
  if (role === 'parent') return <ParentRoutes />

  return <RoleSelectPage />
}
