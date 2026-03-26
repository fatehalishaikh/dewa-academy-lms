import { Routes, Route, Navigate } from 'react-router-dom'
import { ReportsLayout } from './reports-layout'
import { ReportsDashboard } from './dashboard'
import { ReportsAcademic } from './academic'
import { ReportsAttendance } from './attendance'
import { ReportsEngagement } from './engagement'
import { ReportsExams } from './exams'
import { ReportsBuilder } from './builder'

export function ReportsModule() {
  return (
    <ReportsLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<ReportsDashboard />} />
        <Route path="academic"   element={<ReportsAcademic />} />
        <Route path="attendance" element={<ReportsAttendance />} />
        <Route path="engagement" element={<ReportsEngagement />} />
        <Route path="exams"      element={<ReportsExams />} />
        <Route path="builder"    element={<ReportsBuilder />} />
        <Route path="*"          element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ReportsLayout>
  )
}
