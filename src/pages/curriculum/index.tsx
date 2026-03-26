import { Routes, Route, Navigate } from 'react-router-dom'
import { CurriculumLayout } from './curriculum-layout'
import { CurriculumDashboardTab } from './dashboard'
import { CurriculumBuilder } from './builder'
import { CurriculumStandards } from './standards'
import { CurriculumTemplates } from './templates'
import { CurriculumResources } from './resources'
import { CurriculumReview } from './review'

export function CurriculumModule() {
  return (
    <CurriculumLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CurriculumDashboardTab />} />
        <Route path="builder"   element={<CurriculumBuilder />} />
        <Route path="standards" element={<CurriculumStandards />} />
        <Route path="templates" element={<CurriculumTemplates />} />
        <Route path="resources" element={<CurriculumResources />} />
        <Route path="review"    element={<CurriculumReview />} />
        <Route path="*"         element={<Navigate to="dashboard" replace />} />
      </Routes>
    </CurriculumLayout>
  )
}

// Backward-compat export for App.tsx lazy import
export { CurriculumModule as CurriculumDashboard }
