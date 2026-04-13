export type FlaggedStudent = { studentId: string; name: string; initials: string; issue: string; severity: 'warning' | 'destructive' | 'secondary' }
export type LessonRecommendation = { subject: string; class: string; recommendation: string; progress: number }
export type EngagementPoint = { date: string; avg: number; threshold: number }
export type StudentEngagement = { studentId: string; name: string; initials: string; score: number; trend: 'up' | 'down' | 'flat'; status: 'at-risk' | 'engaged' | 'stable' }
export type ChatMessage = { role: 'system' | 'user' | 'bot'; content: string }

export const attendanceSummary = { present: 94, late: 4, absent: 2, total: 312 }

export const flaggedStudents: FlaggedStudent[] = [
  { studentId: 'stu-001', name: 'Ahmed Al-Rashid', initials: 'AR', issue: 'Late 3× this week', severity: 'warning' },
  { studentId: 'stu-002', name: 'Fatima Hassan',   initials: 'FH', issue: 'Absent, no notification', severity: 'destructive' },
  { studentId: 'stu-003', name: 'Omar Khalil',     initials: 'OK', issue: 'Behavioral alert', severity: 'secondary' },
]

export const lessonRecommendations: LessonRecommendation[] = [
  {
    subject: 'Mathematics',
    class: 'Grade 10A',
    recommendation: 'Add visual aids for quadratic equations — 65% comprehension detected',
    progress: 65,
  },
  {
    subject: 'Physics',
    class: 'Grade 11B',
    recommendation: 'Suggest hands-on lab — low engagement last session',
    progress: 78,
  },
  {
    subject: 'English',
    class: 'Grade 9C',
    recommendation: 'On track — continue current lesson plan',
    progress: 92,
  },
]

const dates = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 2, 12 + i)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
const avgValues = [82, 79, 81, 77, 74, 76, 71, 73, 70, 75, 78, 72, 69, 74]
export const engagementTimeline: EngagementPoint[] = dates.map((date, i) => ({
  date,
  avg: avgValues[i],
  threshold: 65,
}))

export const studentEngagement: StudentEngagement[] = [
  { studentId: 'stu-008', name: 'Layla Ibrahim',       initials: 'LI', score: 42, trend: 'down', status: 'at-risk' },
  { studentId: 'stu-005', name: 'Yousef Mahmoud',      initials: 'YM', score: 55, trend: 'down', status: 'at-risk' },
  { studentId: 'stu-004', name: 'Sara Al-Zaabi',       initials: 'SZ', score: 88, trend: 'up',   status: 'engaged' },
  { studentId: 'stu-007', name: 'Khalid Al-Mansoori',  initials: 'KM', score: 76, trend: 'flat', status: 'stable' },
]

export const chatMessages: ChatMessage[] = [
  { role: 'system', content: 'Good morning! I\'ve processed 12 parent inquiries and 5 schedule change requests overnight.' },
  { role: 'user', content: 'How many students are absent today?' },
  { role: 'bot', content: 'Currently 6 students (2%) are marked absent. 2 have submitted medical certificates. Would you like me to send follow-up notifications to the remaining 4?' },
  { role: 'user', content: 'Yes, send notifications.' },
  { role: 'bot', content: 'Done! Notifications sent to parents of 4 students via SMS and email. You\'ll receive delivery confirmations shortly.' },
]
