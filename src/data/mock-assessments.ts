export type QuestionBankStat = { subject: string; easy: number; medium: number; hard: number }
export type RecentGeneration = { subject: string; count: number; difficulty: 'Mixed' | 'Easy' | 'Medium' | 'Hard'; timeAgo: string }
export type AdaptiveStudent = { name: string; initials: string; difficulty: 'Easy' | 'Medium' | 'Hard'; questionsAnswered: number; accuracy: number; trend: 'up' | 'down' | 'flat' }
export type GradingItem = { student: string; initials: string; assessment: string; confidence: number; status: 'graded' | 'review' | 'manual' }
export type BTECDocument = { filename: string; uploadDate: string; status: 'processed' | 'processing' | 'failed'; fieldsExtracted: number }
export type BTECInsight = { unit: string; completionRate: number; cohortAvg: number; trend: 'up' | 'down' | 'flat' }
export type PerformancePoint = { date: string; actual: number | null; predicted: number | null }
export type RiskStudent = { name: string; initials: string; predictedScore: number; riskLevel: 'high' | 'moderate' | 'low'; trend: 'up' | 'down' | 'flat' }

export const questionBankStats: QuestionBankStat[] = [
  { subject: 'Math', easy: 102, medium: 153, hard: 85 },
  { subject: 'Physics', easy: 84, medium: 126, hard: 70 },
  { subject: 'English', easy: 66, medium: 99, hard: 55 },
  { subject: 'Chemistry', easy: 60, medium: 90, hard: 50 },
  { subject: 'Arabic', easy: 60, medium: 90, hard: 50 },
]

export const recentGenerations: RecentGeneration[] = [
  { subject: 'Mathematics', count: 24, difficulty: 'Mixed', timeAgo: '2 hrs ago' },
  { subject: 'Physics', count: 16, difficulty: 'Hard', timeAgo: '4 hrs ago' },
  { subject: 'English', count: 20, difficulty: 'Medium', timeAgo: 'Yesterday' },
]

export const adaptiveSummary = { easy: 68, medium: 156, hard: 88, total: 312 }

export const adaptiveStudents: AdaptiveStudent[] = [
  { name: 'Ahmed Al-Rashid', initials: 'AA', difficulty: 'Hard', questionsAnswered: 48, accuracy: 88, trend: 'up' },
  { name: 'Fatima Hassan', initials: 'FH', difficulty: 'Medium', questionsAnswered: 34, accuracy: 72, trend: 'flat' },
  { name: 'Omar Khalil', initials: 'OK', difficulty: 'Easy', questionsAnswered: 29, accuracy: 56, trend: 'down' },
  { name: 'Noor Al-Ali', initials: 'NA', difficulty: 'Medium', questionsAnswered: 41, accuracy: 79, trend: 'up' },
]

export const gradingItems: GradingItem[] = [
  { student: 'Sara Ahmed', initials: 'SA', assessment: 'Physics Mid-Term Essay', confidence: 97, status: 'graded' },
  { student: 'Youssef Nabil', initials: 'YN', assessment: 'English Literature Analysis', confidence: 81, status: 'review' },
  { student: 'Layla Mahmoud', initials: 'LM', assessment: 'Arabic Written Response', confidence: 64, status: 'manual' },
]

export const gradingSummary = { autoGraded: 89, pendingReview: 7, manualRequired: 4, total: 847 }

export const btecDocuments: BTECDocument[] = [
  { filename: 'BTEC_Unit4_Assessment_Brief.pdf', uploadDate: 'Mar 24', status: 'processed', fieldsExtracted: 42 },
  { filename: 'BTEC_Unit7_Learner_Evidence.pdf', uploadDate: 'Mar 24', status: 'processed', fieldsExtracted: 38 },
  { filename: 'BTEC_Unit2_Portfolio.pdf', uploadDate: 'Mar 25', status: 'processing', fieldsExtracted: 0 },
]

export const btecInsights: BTECInsight[] = [
  { unit: 'Unit 4 — Business Environment', completionRate: 78, cohortAvg: 74, trend: 'up' },
  { unit: 'Unit 7 — Business Decision Making', completionRate: 65, cohortAvg: 68, trend: 'down' },
  { unit: 'Unit 2 — Marketing Campaign', completionRate: 82, cohortAvg: 79, trend: 'up' },
]

// 14 actual points (Mar 11–24) + bridge + 14 predicted points (Mar 25–Apr 7)
// Index 13 is the bridge — both actual and predicted share the same value
const perfDates = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(2026, 2, 11 + i)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
const actualVals = [76, 74, 78, 72, 75, 71, 73, 77, 74, 70, 72, 75, 71, 73]
const predictedVals = [73, 71, 69, 74, 70, 67, 71, 68, 65, 68, 65, 62, 66, 63, 61]

export const performanceTimeline: PerformancePoint[] = perfDates.map((date, i) => ({
  date,
  actual: i < 14 ? actualVals[i] : null,
  predicted: i >= 13 ? predictedVals[i - 13] : null,
}))

export const riskStudents: RiskStudent[] = [
  { name: 'Ahmed Khalil', initials: 'AK', predictedScore: 42, riskLevel: 'high', trend: 'down' },
  { name: 'Layla Mahmoud', initials: 'LM', predictedScore: 48, riskLevel: 'high', trend: 'down' },
  { name: 'Tariq Hassan', initials: 'TH', predictedScore: 58, riskLevel: 'moderate', trend: 'flat' },
  { name: 'Noor Al-Ali', initials: 'NA', predictedScore: 63, riskLevel: 'moderate', trend: 'up' },
  { name: 'Sara Ahmed', initials: 'SA', predictedScore: 81, riskLevel: 'low', trend: 'up' },
]
