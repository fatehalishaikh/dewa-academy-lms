import { Routes, Route, Navigate } from 'react-router-dom'
import { IlpLayout } from './ilp-layout'
import { IlpDashboard } from './dashboard'
import { ProfileAssessment } from './profile-assessment'
import { PathwayBuilder } from './pathway-builder'
import { CurationRules } from './curation-rules'
import { RiskIntervention } from './risk-intervention'
import { Notifications } from './notifications'
import { GoalSetting } from './goal-setting'
import { ContentManagement } from './content-management'

export function IlpModule() {
  return (
    <IlpLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<IlpDashboard />} />
        <Route path="profile-assessment" element={<ProfileAssessment />} />
        <Route path="pathway-builder" element={<PathwayBuilder />} />
        <Route path="curation-rules" element={<CurationRules />} />
        <Route path="risk-intervention" element={<RiskIntervention />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="goal-setting" element={<GoalSetting />} />
        <Route path="content-management" element={<ContentManagement />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </IlpLayout>
  )
}
