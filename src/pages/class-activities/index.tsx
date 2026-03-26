import { Routes, Route, Navigate } from 'react-router-dom'
import { ClassActivitiesLayout } from './class-activities-layout'
import { ClassActivitiesDashboardTab } from './dashboard'
import { ClassActivitiesTimetable } from './timetable'
import { ClassActivitiesAttendance } from './attendance'
import { ClassActivitiesLessons } from './lessons'
import { ClassActivitiesEngagement } from './engagement'
import { ClassActivitiesCommunications } from './communications'

export function ClassActivitiesModule() {
  return (
    <ClassActivitiesLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"      element={<ClassActivitiesDashboardTab />} />
        <Route path="timetable"      element={<ClassActivitiesTimetable />} />
        <Route path="attendance"     element={<ClassActivitiesAttendance />} />
        <Route path="lessons"        element={<ClassActivitiesLessons />} />
        <Route path="engagement"     element={<ClassActivitiesEngagement />} />
        <Route path="communications" element={<ClassActivitiesCommunications />} />
        <Route path="*"              element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ClassActivitiesLayout>
  )
}

// Backward-compat export used by App.tsx lazy import
export { ClassActivitiesModule as ClassActivitiesDashboard }
