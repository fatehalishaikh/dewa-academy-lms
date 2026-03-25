import { Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/app-layout'
import { ClassActivitiesDashboard } from '@/pages/class-activities'
import { AssessmentsDashboard } from '@/pages/assessments'
import { IlpModule } from '@/pages/ilp'
import { CurriculumDashboard } from '@/pages/curriculum'

export default function App() {
  return (
    <TooltipProvider delay={400}>
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/class-activities" replace />} />
        <Route path="/class-activities" element={<ClassActivitiesDashboard />} />
        <Route path="/assessments" element={<AssessmentsDashboard />} />
        <Route path="/ilp/*" element={<IlpModule />} />
        <Route path="/curriculum" element={<CurriculumDashboard />} />
        <Route path="*" element={<Navigate to="/class-activities" replace />} />
      </Routes>
    </AppLayout>
    </TooltipProvider>
  )
}
