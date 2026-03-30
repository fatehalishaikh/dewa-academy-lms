// ── Types ─────────────────────────────────────────────────────────────────────

export type EnrollmentTrendPoint  = { month: string; enrolled: number; withdrawn: number }
export type SchoolHealthCategory  = { category: string; score: number; maxScore: number }
export type GpaDistributionBucket = { range: string; count: number }
export type SubjectPerformance    = { subject: string; avgScore: number; passRate: number; studentCount: number }
export type GradeTrendPoint       = { month: string; grade9: number; grade10: number; grade11: number }
export type AttendanceTrendPoint  = { week: string; presentRate: number; lateRate: number; absentRate: number }
export type ClassAttendanceRow    = { className: string; rate: number; change: number }
export type DayAttendance         = { day: string; rate: number }
export type EngagementTrendPoint  = { week: string; score: number; threshold: number }
export type EngagementBySubject   = { subject: string; score: number }
export type ExamResultRow         = { examTitle: string; avgScore: number; passRate: number; highScore: number; lowScore: number; totalStudents: number }
export type DifficultyAccuracy    = { difficulty: string; avgAccuracy: number; questionCount: number }
export type SubjectExamQuarter    = { subject: string; q1: number; q2: number; q3: number }
export type ReportField           = { id: string; label: string; fieldCategory: 'metric' | 'dimension' | 'filter'; dataType: string }
export type SavedReport           = { id: string; name: string; createdDate: string; fields: string[]; schedule: string | null }
export type AiInsight             = { id: string; text: string; severity: 'info' | 'warning' | 'success'; tab: string }

// ── Enrollment Trend (Sep 2025 – Aug 2026) ────────────────────────────────────

export const enrollmentTrend: EnrollmentTrendPoint[] = [
  { month: 'Sep', enrolled: 295, withdrawn: 2 },
  { month: 'Oct', enrolled: 298, withdrawn: 1 },
  { month: 'Nov', enrolled: 301, withdrawn: 0 },
  { month: 'Dec', enrolled: 300, withdrawn: 2 },
  { month: 'Jan', enrolled: 303, withdrawn: 1 },
  { month: 'Feb', enrolled: 306, withdrawn: 0 },
  { month: 'Mar', enrolled: 309, withdrawn: 1 },
  { month: 'Apr', enrolled: 312, withdrawn: 0 },
  { month: 'May', enrolled: 312, withdrawn: 0 },
  { month: 'Jun', enrolled: 310, withdrawn: 2 },
  { month: 'Jul', enrolled: 308, withdrawn: 1 },
  { month: 'Aug', enrolled: 312, withdrawn: 0 },
]

// ── School Health (5 categories) ──────────────────────────────────────────────

export const schoolHealth: SchoolHealthCategory[] = [
  { category: 'Academics',        score: 82, maxScore: 100 },
  { category: 'Attendance',       score: 91, maxScore: 100 },
  { category: 'Engagement',       score: 74, maxScore: 100 },
  { category: 'Curriculum',       score: 88, maxScore: 100 },
  { category: 'Teacher Perf.',    score: 86, maxScore: 100 },
]

// ── Teacher Workload ───────────────────────────────────────────────────────────

export const teacherWorkload = [
  { teacher: 'Ms. Al-Rashidi', classes: 4, students: 108 },
  { teacher: 'Mr. Hassan',     classes: 3, students: 82  },
  { teacher: 'Dr. Al-Falasi',  classes: 5, students: 134 },
  { teacher: 'Ms. Ibrahim',    classes: 3, students: 76  },
  { teacher: 'Mr. Al-Sayed',   classes: 4, students: 112 },
]

// ── GPA Distribution ──────────────────────────────────────────────────────────

export const gpaDistribution: GpaDistributionBucket[] = [
  { range: '0–1', count: 8  },
  { range: '1–2', count: 24 },
  { range: '2–3', count: 89 },
  { range: '3–4', count: 191 },
]

// ── Subject Performance ───────────────────────────────────────────────────────

export const subjectPerformance: SubjectPerformance[] = [
  { subject: 'Mathematics',    avgScore: 74, passRate: 88, studentCount: 312 },
  { subject: 'Science',        avgScore: 79, passRate: 91, studentCount: 312 },
  { subject: 'English',        avgScore: 82, passRate: 94, studentCount: 312 },
  { subject: 'Arabic',         avgScore: 77, passRate: 89, studentCount: 312 },
  { subject: 'Social Studies', avgScore: 85, passRate: 96, studentCount: 312 },
]

// ── GPA Trend by Grade (6 months) ─────────────────────────────────────────────

export const gradeTrend: GradeTrendPoint[] = [
  { month: 'Oct', grade9: 3.21, grade10: 3.18, grade11: 3.05 },
  { month: 'Nov', grade9: 3.24, grade10: 3.22, grade11: 3.08 },
  { month: 'Dec', grade9: 3.19, grade10: 3.20, grade11: 3.12 },
  { month: 'Jan', grade9: 3.28, grade10: 3.25, grade11: 3.15 },
  { month: 'Feb', grade9: 3.30, grade10: 3.27, grade11: 3.18 },
  { month: 'Mar', grade9: 3.33, grade10: 3.29, grade11: 3.21 },
]

// ── Top Performers ────────────────────────────────────────────────────────────

export const topPerformers = [
  { studentId: 'stu-002', name: 'Fatima Hassan',        grade: 'Grade 9',  gpa: 3.9, trend: 'up'   },
  { studentId: 'stu-001', name: 'Ahmed Al-Rashid',      grade: 'Grade 10', gpa: 3.7, trend: 'up'   },
  { studentId: 'stu-006', name: 'Mariam Al-Sayed',      grade: 'Grade 10', gpa: 3.8, trend: 'same' },
  { studentId: 'stu-008', name: 'Layla Ibrahim',        grade: 'Grade 9',  gpa: 3.6, trend: 'up'   },
  { studentId: 'stu-004', name: 'Sara Al-Zaabi',        grade: 'Grade 10', gpa: 3.5, trend: 'same' },
]

// ── Attendance Trend (14 weeks) ───────────────────────────────────────────────

export const attendanceTrend: AttendanceTrendPoint[] = [
  { week: 'W1',  presentRate: 94, lateRate: 3, absentRate: 3 },
  { week: 'W2',  presentRate: 92, lateRate: 4, absentRate: 4 },
  { week: 'W3',  presentRate: 95, lateRate: 3, absentRate: 2 },
  { week: 'W4',  presentRate: 91, lateRate: 4, absentRate: 5 },
  { week: 'W5',  presentRate: 93, lateRate: 3, absentRate: 4 },
  { week: 'W6',  presentRate: 90, lateRate: 5, absentRate: 5 },
  { week: 'W7',  presentRate: 92, lateRate: 4, absentRate: 4 },
  { week: 'W8',  presentRate: 94, lateRate: 3, absentRate: 3 },
  { week: 'W9',  presentRate: 93, lateRate: 3, absentRate: 4 },
  { week: 'W10', presentRate: 91, lateRate: 4, absentRate: 5 },
  { week: 'W11', presentRate: 92, lateRate: 3, absentRate: 5 },
  { week: 'W12', presentRate: 94, lateRate: 3, absentRate: 3 },
  { week: 'W13', presentRate: 93, lateRate: 3, absentRate: 4 },
  { week: 'W14', presentRate: 92, lateRate: 4, absentRate: 4 },
]

// ── Class Attendance (8 classes) ──────────────────────────────────────────────

export const classAttendance: ClassAttendanceRow[] = [
  { className: 'Math 10A',       rate: 96, change: +2  },
  { className: 'Science 11B',    rate: 88, change: -3  },
  { className: 'English 9A',     rate: 94, change: +1  },
  { className: 'Arabic 10B',     rate: 91, change: 0   },
  { className: 'Physics 11A',    rate: 85, change: -5  },
  { className: 'Chemistry 10A',  rate: 93, change: +3  },
  { className: 'History 9B',     rate: 97, change: +4  },
  { className: 'Biology 11B',    rate: 89, change: -1  },
]

// ── Day-of-Week Attendance ────────────────────────────────────────────────────

export const dayAttendance: DayAttendance[] = [
  { day: 'Sun', rate: 94 },
  { day: 'Mon', rate: 92 },
  { day: 'Tue', rate: 93 },
  { day: 'Wed', rate: 90 },
  { day: 'Thu', rate: 88 },
]

// ── Monthly Attendance Summary ────────────────────────────────────────────────

export const monthlyAttendance = [
  { month: 'October',  presentPct: 93, latePct: 4, absentPct: 3 },
  { month: 'November', presentPct: 92, latePct: 4, absentPct: 4 },
  { month: 'December', presentPct: 90, latePct: 5, absentPct: 5 },
  { month: 'January',  presentPct: 91, latePct: 4, absentPct: 5 },
  { month: 'February', presentPct: 93, latePct: 4, absentPct: 3 },
  { month: 'March',    presentPct: 92, latePct: 4, absentPct: 4 },
]

// ── Engagement Trend (14 weeks) ───────────────────────────────────────────────

export const engagementTrend: EngagementTrendPoint[] = [
  { week: 'W1',  score: 68, threshold: 65 },
  { week: 'W2',  score: 65, threshold: 65 },
  { week: 'W3',  score: 70, threshold: 65 },
  { week: 'W4',  score: 62, threshold: 65 },
  { week: 'W5',  score: 67, threshold: 65 },
  { week: 'W6',  score: 60, threshold: 65 },
  { week: 'W7',  score: 63, threshold: 65 },
  { week: 'W8',  score: 69, threshold: 65 },
  { week: 'W9',  score: 72, threshold: 65 },
  { week: 'W10', score: 74, threshold: 65 },
  { week: 'W11', score: 71, threshold: 65 },
  { week: 'W12', score: 75, threshold: 65 },
  { week: 'W13', score: 73, threshold: 65 },
  { week: 'W14', score: 76, threshold: 65 },
]

// ── Engagement by Subject ─────────────────────────────────────────────────────

export const engagementBySubject: EngagementBySubject[] = [
  { subject: 'Mathematics',    score: 68 },
  { subject: 'Science',        score: 76 },
  { subject: 'English',        score: 80 },
  { subject: 'Arabic',         score: 72 },
  { subject: 'Social Studies', score: 84 },
]

// ── At-Risk Students ──────────────────────────────────────────────────────────

export const atRiskStudents = [
  { studentId: 'stu-007', name: 'Khalid Al-Mansoori', engagement: 45, attendance: 72, gpa: 2.1, riskLevel: 'High'     as const },
  { studentId: 'stu-003', name: 'Omar Khalil',         engagement: 52, attendance: 78, gpa: 2.4, riskLevel: 'High'     as const },
  { studentId: 'stu-011', name: 'Abdullah Al-Nuaimi',  engagement: 58, attendance: 85, gpa: 2.9, riskLevel: 'Moderate' as const },
  { studentId: 'stu-009', name: 'Hamdan Al-Falasi',    engagement: 61, attendance: 88, gpa: 3.1, riskLevel: 'Moderate' as const },
]

// ── Risk Distribution ─────────────────────────────────────────────────────────

export const riskDistribution = [
  { name: 'High',     value: 2,   fill: '#EF4444' },
  { name: 'Moderate', value: 8,   fill: '#F59E0B' },
  { name: 'Low',      value: 45,  fill: '#0EA5E9' },
  { name: 'None',     value: 257, fill: '#10B981' },
]

// ── Exam Results ──────────────────────────────────────────────────────────────

export const examResults: ExamResultRow[] = [
  { examTitle: 'Mid-Term Mathematics',  avgScore: 74, passRate: 88, highScore: 98, lowScore: 42, totalStudents: 104 },
  { examTitle: 'Science Quiz Q2',       avgScore: 81, passRate: 92, highScore: 100, lowScore: 55, totalStudents: 96  },
  { examTitle: 'English Comprehension', avgScore: 83, passRate: 94, highScore: 99, lowScore: 60, totalStudents: 104 },
  { examTitle: 'Arabic Final',          avgScore: 77, passRate: 90, highScore: 97, lowScore: 48, totalStudents: 104 },
]

// ── Grade Distribution (A/B/C/D/F) ────────────────────────────────────────────

export const gradeDistribution = [
  { grade: 'A (90–100)', count: 87  },
  { grade: 'B (80–89)',  count: 112 },
  { grade: 'C (70–79)',  count: 68  },
  { grade: 'D (60–69)',  count: 28  },
  { grade: 'F (<60)',    count: 17  },
]

// ── Difficulty Accuracy ───────────────────────────────────────────────────────

export const difficultyAccuracy: DifficultyAccuracy[] = [
  { difficulty: 'Easy',   avgAccuracy: 88, questionCount: 120 },
  { difficulty: 'Medium', avgAccuracy: 72, questionCount: 180 },
  { difficulty: 'Hard',   avgAccuracy: 54, questionCount: 80  },
]

// ── Subject Exam Quarters ─────────────────────────────────────────────────────

export const subjectExamQuarters: SubjectExamQuarter[] = [
  { subject: 'Math',    q1: 71, q2: 74, q3: 78 },
  { subject: 'Science', q1: 76, q2: 79, q3: 83 },
  { subject: 'English', q1: 80, q2: 82, q3: 85 },
  { subject: 'Arabic',  q1: 74, q2: 76, q3: 79 },
  { subject: 'SocStu',  q1: 82, q2: 84, q3: 87 },
]

// ── Report Fields ─────────────────────────────────────────────────────────────

export const reportFields: ReportField[] = [
  { id: 'gpa',          label: 'GPA',               fieldCategory: 'metric',    dataType: 'number' },
  { id: 'attendance',   label: 'Attendance Rate',    fieldCategory: 'metric',    dataType: 'percent' },
  { id: 'engagement',   label: 'Engagement Score',   fieldCategory: 'metric',    dataType: 'number' },
  { id: 'exam_avg',     label: 'Exam Average',       fieldCategory: 'metric',    dataType: 'number' },
  { id: 'pass_rate',    label: 'Pass Rate',          fieldCategory: 'metric',    dataType: 'percent' },
  { id: 'honor_roll',   label: 'Honor Roll',         fieldCategory: 'metric',    dataType: 'boolean' },
  { id: 'student_name', label: 'Student Name',       fieldCategory: 'dimension', dataType: 'string' },
  { id: 'grade_level',  label: 'Grade Level',        fieldCategory: 'dimension', dataType: 'string' },
  { id: 'section',      label: 'Section',            fieldCategory: 'dimension', dataType: 'string' },
  { id: 'subject',      label: 'Subject',            fieldCategory: 'dimension', dataType: 'string' },
  { id: 'at_risk',      label: 'At-Risk Status',     fieldCategory: 'filter',   dataType: 'boolean' },
  { id: 'date_range',   label: 'Date Range',         fieldCategory: 'filter',   dataType: 'daterange' },
]

// ── Saved Reports ─────────────────────────────────────────────────────────────

export const savedReports: SavedReport[] = [
  {
    id: 'rep-001',
    name: 'Monthly Academic Summary',
    createdDate: '2026-02-15',
    fields: ['student_name', 'gpa', 'exam_avg', 'grade_level'],
    schedule: 'Monthly',
  },
  {
    id: 'rep-002',
    name: 'At-Risk Student Tracker',
    createdDate: '2026-03-01',
    fields: ['student_name', 'attendance', 'engagement', 'at_risk'],
    schedule: 'Weekly',
  },
  {
    id: 'rep-003',
    name: 'Term Attendance Report',
    createdDate: '2026-01-10',
    fields: ['student_name', 'attendance', 'grade_level', 'section'],
    schedule: null,
  },
]

// ── AI Insights ───────────────────────────────────────────────────────────────

export const aiInsights: AiInsight[] = [
  { id: 'ins-001', text: 'Enrollment grew 5.8% since September, on track to exceed 320 by Q4.',                   severity: 'success', tab: 'dashboard'  },
  { id: 'ins-002', text: '12 students show concurrent drops in attendance and engagement — immediate intervention recommended.', severity: 'warning', tab: 'dashboard'  },
  { id: 'ins-003', text: 'School health composite score is 84.2 — up 3 points from last term.',                    severity: 'success', tab: 'dashboard'  },
  { id: 'ins-004', text: 'Teacher workload is unevenly distributed; Dr. Al-Falasi carries 22% more students than average.', severity: 'info',    tab: 'dashboard'  },
  { id: 'ins-005', text: 'Grade 11 GPA lags Grade 9 by 0.12 points — curriculum pacing review recommended.',       severity: 'warning', tab: 'academic'   },
  { id: 'ins-006', text: 'Mathematics pass rate (88%) is 6 points below school average — consider additional support sessions.', severity: 'warning', tab: 'academic'   },
  { id: 'ins-007', text: 'Thursday attendance is consistently lowest (88%) — possible schedule optimization opportunity.', severity: 'info',    tab: 'attendance' },
  { id: 'ins-008', text: 'Engagement scores below threshold for 4 consecutive weeks in Physics 11A.',              severity: 'warning', tab: 'engagement' },
]
