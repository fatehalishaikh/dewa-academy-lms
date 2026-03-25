import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { ClassActivitiesDashboard } from '@/pages/class-activities'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/class-activities" replace />} />
        <Route path="/class-activities" element={<ClassActivitiesDashboard />} />
        <Route path="*" element={<Navigate to="/class-activities" replace />} />
      </Routes>
    </AppLayout>
  )
}
