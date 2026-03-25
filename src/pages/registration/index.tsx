import { Routes, Route, Navigate } from 'react-router-dom'
import { RegistrationLayout } from './registration-layout'
import { RegistrationDashboard } from './dashboard'
import { Applications } from './applications'
import { NewApplication } from './new-application'
import { DocumentVerification } from './document-verification'
import { AiScoring } from './ai-scoring'
import { Communications } from './communications'
import { Integrations } from './integrations'

export function RegistrationModule() {
  return (
    <RegistrationLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RegistrationDashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="new-application" element={<NewApplication />} />
        <Route path="document-verification" element={<DocumentVerification />} />
        <Route path="ai-scoring" element={<AiScoring />} />
        <Route path="communications" element={<Communications />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </RegistrationLayout>
  )
}
