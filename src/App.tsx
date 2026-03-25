import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/app-layout'

const ClassActivitiesDashboard = lazy(() => import('@/pages/class-activities').then(m => ({ default: m.ClassActivitiesDashboard })))
const AssessmentsDashboard = lazy(() => import('@/pages/assessments').then(m => ({ default: m.AssessmentsDashboard })))
const IlpModule = lazy(() => import('@/pages/ilp').then(m => ({ default: m.IlpModule })))
const CurriculumDashboard = lazy(() => import('@/pages/curriculum').then(m => ({ default: m.CurriculumDashboard })))
const RegistrationModule = lazy(() => import('@/pages/registration').then(m => ({ default: m.RegistrationModule })))

export default function App() {
  return (
    <TooltipProvider delay={400}>
    <AppLayout>
      <Suspense>
        <Routes>
          <Route path="/" element={<Navigate to="/class-activities" replace />} />
          <Route path="/class-activities" element={<ClassActivitiesDashboard />} />
          <Route path="/assessments" element={<AssessmentsDashboard />} />
          <Route path="/ilp/*" element={<IlpModule />} />
          <Route path="/curriculum" element={<CurriculumDashboard />} />
          <Route path="/registration/*" element={<RegistrationModule />} />
          <Route path="*" element={<Navigate to="/class-activities" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
    </TooltipProvider>
  )
}
