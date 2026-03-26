import { Routes, Route, Navigate } from 'react-router-dom'
import { AssessmentsLayout } from './assessments-layout'
import { AssessmentsDashboardTab } from './dashboard'
import { AssessmentsQuestionBank } from './question-bank'
import { AssessmentsCreateExam } from './create-exam'
import { AssessmentsSchedule } from './schedule'
import { AssessmentsGrading } from './grading'
import { AssessmentsResults } from './results'

export function AssessmentsModule() {
  return (
    <AssessmentsLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<AssessmentsDashboardTab />} />
        <Route path="question-bank" element={<AssessmentsQuestionBank />} />
        <Route path="create-exam"   element={<AssessmentsCreateExam />} />
        <Route path="schedule"      element={<AssessmentsSchedule />} />
        <Route path="grading"       element={<AssessmentsGrading />} />
        <Route path="results"       element={<AssessmentsResults />} />
        <Route path="*"             element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AssessmentsLayout>
  )
}

// Backward-compat export for App.tsx lazy import
export { AssessmentsModule as AssessmentsDashboard }
