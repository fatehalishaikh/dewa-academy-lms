export type QuestionBankStat = { subject: string; easy: number; medium: number; hard: number }
export type RecentGeneration = { subject: string; count: number; difficulty: 'Mixed' | 'Easy' | 'Medium' | 'Hard'; timeAgo: string }
export type AdaptiveStudent = { studentId: string; name: string; initials: string; difficulty: 'Easy' | 'Medium' | 'Hard'; questionsAnswered: number; accuracy: number; trend: 'up' | 'down' | 'flat' }
export type GradingItem = { studentId: string; student: string; initials: string; assessment: string; confidence: number; status: 'graded' | 'review' | 'manual' }
export type BTECDocument = { filename: string; uploadDate: string; status: 'processed' | 'processing' | 'failed'; fieldsExtracted: number }
export type BTECInsight = { unit: string; completionRate: number; cohortAvg: number; trend: 'up' | 'down' | 'flat' }
export type PerformancePoint = { date: string; actual: number | null; predicted: number | null }
export type RiskStudent = { studentId: string; name: string; initials: string; predictedScore: number; riskLevel: 'high' | 'moderate' | 'low'; trend: 'up' | 'down' | 'flat' }

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
  { studentId: 'stu-001', name: 'Ahmed Al-Rashid',  initials: 'AR', difficulty: 'Hard',   questionsAnswered: 48, accuracy: 88, trend: 'up' },
  { studentId: 'stu-002', name: 'Fatima Hassan',    initials: 'FH', difficulty: 'Medium', questionsAnswered: 34, accuracy: 72, trend: 'flat' },
  { studentId: 'stu-003', name: 'Omar Khalil',      initials: 'OK', difficulty: 'Easy',   questionsAnswered: 29, accuracy: 56, trend: 'down' },
  { studentId: 'stu-010', name: 'Nour Al-Hashimi',  initials: 'NH', difficulty: 'Medium', questionsAnswered: 41, accuracy: 79, trend: 'up' },
]

export const gradingItems: GradingItem[] = [
  { studentId: 'stu-004', student: 'Sara Al-Zaabi',      initials: 'SZ', assessment: 'Physics Mid-Term Essay',       confidence: 97, status: 'graded' },
  { studentId: 'stu-005', student: 'Yousef Mahmoud',     initials: 'YM', assessment: 'English Literature Analysis',  confidence: 81, status: 'review' },
  { studentId: 'stu-008', student: 'Layla Ibrahim',      initials: 'LI', assessment: 'Arabic Written Response',      confidence: 64, status: 'manual' },
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
  { studentId: 'stu-007', name: 'Khalid Al-Mansoori', initials: 'KM', predictedScore: 42, riskLevel: 'high',     trend: 'down' },
  { studentId: 'stu-008', name: 'Layla Ibrahim',      initials: 'LI', predictedScore: 48, riskLevel: 'high',     trend: 'down' },
  { studentId: 'stu-009', name: 'Hamdan Al-Falasi',   initials: 'HF', predictedScore: 58, riskLevel: 'moderate', trend: 'flat' },
  { studentId: 'stu-010', name: 'Nour Al-Hashimi',    initials: 'NH', predictedScore: 63, riskLevel: 'moderate', trend: 'up' },
  { studentId: 'stu-004', name: 'Sara Al-Zaabi',      initials: 'SZ', predictedScore: 81, riskLevel: 'low',      trend: 'up' },
]

// ── New types for actionable sub-pages ────────────────────────────────────────

export type QuestionType = 'MCQ' | 'Essay' | 'Matching' | 'True-False'
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard'
export type ExamStatus = 'draft' | 'published' | 'completed'
export type ExamType = 'formative' | 'summative' | 'diagnostic'
export type SubmissionStatus = 'pending' | 'graded'

export type ExamQuestion = {
  id: string
  text: string
  questionType: QuestionType
  subject: string
  topic: string
  difficulty: DifficultyLevel
  options?: string[]
  correctAnswer: string
  points: number
}

export type ExamRules = {
  timeLimit: boolean
  attempts: number
  randomizeQuestions: boolean
  randomizeAnswers: boolean
  showResultsAfter: boolean
}

export type Exam = {
  id: string
  title: string
  classId: string
  teacherId: string
  date: string
  duration: number
  examType: ExamType
  status: ExamStatus
  totalPoints: number
  questionIds: string[]
  rules: ExamRules
  room: string
  passingScore: number
}

export type ExamSubmission = {
  id: string
  examId: string
  studentId: string
  answers: Record<string, string>
  score: number | null
  submissionStatus: SubmissionStatus
  feedback: string | null
  submittedAt: string
}

export type GradeDistribution = { grade: string; count: number }

// ── Mock Questions ─────────────────────────────────────────────────────────────

export const examQuestions: ExamQuestion[] = [
  // Mathematics
  { id: 'q-001', text: 'Solve for x: 2x² - 8x + 6 = 0', questionType: 'MCQ', subject: 'Mathematics', topic: 'Quadratic Equations', difficulty: 'Medium', options: ['x = 1 or x = 3', 'x = 2 or x = 4', 'x = -1 or x = -3', 'x = 6 or x = 1'], correctAnswer: 'x = 1 or x = 3', points: 4 },
  { id: 'q-002', text: 'What is the discriminant of x² + 4x + 4 = 0?', questionType: 'MCQ', subject: 'Mathematics', topic: 'Quadratic Equations', difficulty: 'Easy', options: ['0', '4', '-4', '16'], correctAnswer: '0', points: 2 },
  { id: 'q-003', text: 'A triangle has vertices at (0,0), (4,0), and (0,3). What is its area?', questionType: 'MCQ', subject: 'Mathematics', topic: 'Coordinate Geometry', difficulty: 'Easy', options: ['6', '12', '7', '5'], correctAnswer: '6', points: 2 },
  { id: 'q-004', text: 'Find the equation of a line with slope 3 passing through (1, 2).', questionType: 'MCQ', subject: 'Mathematics', topic: 'Linear Equations', difficulty: 'Medium', options: ['y = 3x - 1', 'y = 3x + 1', 'y = 3x + 2', 'y = -3x + 5'], correctAnswer: 'y = 3x - 1', points: 4 },
  { id: 'q-005', text: 'Explain the difference between a function and a relation, providing two examples of each.', questionType: 'Essay', subject: 'Mathematics', topic: 'Functions', difficulty: 'Hard', correctAnswer: 'A function maps each input to exactly one output...', points: 10 },
  { id: 'q-006', text: 'If sin(θ) = 0.6 and θ is in the first quadrant, what is cos(θ)?', questionType: 'MCQ', subject: 'Mathematics', topic: 'Trigonometry', difficulty: 'Hard', options: ['0.8', '0.6', '0.75', '1.0'], correctAnswer: '0.8', points: 5 },

  // Physics
  { id: 'q-007', text: 'A car accelerates from rest at 2 m/s². What is its velocity after 5 seconds?', questionType: 'MCQ', subject: 'Physics', topic: 'Kinematics', difficulty: 'Easy', options: ['10 m/s', '5 m/s', '15 m/s', '20 m/s'], correctAnswer: '10 m/s', points: 2 },
  { id: 'q-008', text: 'State Newton\'s Second Law of Motion and give one practical example.', questionType: 'Essay', subject: 'Physics', topic: 'Newton\'s Laws', difficulty: 'Medium', correctAnswer: 'F = ma: Force equals mass times acceleration...', points: 8 },
  { id: 'q-009', text: 'An object has a mass of 5 kg. What force is needed to accelerate it at 3 m/s²?', questionType: 'MCQ', subject: 'Physics', topic: 'Newton\'s Laws', difficulty: 'Easy', options: ['15 N', '8 N', '1.67 N', '2 N'], correctAnswer: '15 N', points: 2 },
  { id: 'q-010', text: 'Which of these is a vector quantity?', questionType: 'MCQ', subject: 'Physics', topic: 'Vectors', difficulty: 'Easy', options: ['Velocity', 'Speed', 'Mass', 'Temperature'], correctAnswer: 'Velocity', points: 2 },
  { id: 'q-011', text: 'Kirchhoff\'s First Law states that the sum of currents at a node is…', questionType: 'True-False', subject: 'Physics', topic: 'Electricity', difficulty: 'Medium', options: ['True — zero', 'False — one'], correctAnswer: 'True — zero', points: 3 },
  { id: 'q-012', text: 'Describe the photoelectric effect and its significance to quantum mechanics.', questionType: 'Essay', subject: 'Physics', topic: 'Quantum Physics', difficulty: 'Hard', correctAnswer: 'The photoelectric effect shows light has particle-like properties...', points: 10 },

  // English Language
  { id: 'q-013', text: 'Identify the literary device in: "The wind screamed through the trees."', questionType: 'MCQ', subject: 'English Language', topic: 'Literary Devices', difficulty: 'Easy', options: ['Personification', 'Simile', 'Metaphor', 'Alliteration'], correctAnswer: 'Personification', points: 2 },
  { id: 'q-014', text: 'Which sentence uses a semicolon correctly?', questionType: 'MCQ', subject: 'English Language', topic: 'Grammar', difficulty: 'Medium', options: ['I went to the store; I bought milk.', 'I went; to the store.', 'I went to the; store.', 'I; went to the store.'], correctAnswer: 'I went to the store; I bought milk.', points: 3 },
  { id: 'q-015', text: 'Write a PEEL paragraph arguing for or against the use of social media in education.', questionType: 'Essay', subject: 'English Language', topic: 'Persuasive Writing', difficulty: 'Hard', correctAnswer: 'Point, Evidence, Explanation, Link...', points: 12 },
  { id: 'q-016', text: '"Forlorn" most closely means:', questionType: 'MCQ', subject: 'English Language', topic: 'Vocabulary', difficulty: 'Medium', options: ['Abandoned and lonely', 'Angry and resentful', 'Joyful and excited', 'Confused and lost'], correctAnswer: 'Abandoned and lonely', points: 3 },

  // Chemistry
  { id: 'q-017', text: 'What is the atomic number of Carbon?', questionType: 'MCQ', subject: 'Chemistry', topic: 'Periodic Table', difficulty: 'Easy', options: ['6', '12', '8', '14'], correctAnswer: '6', points: 1 },
  { id: 'q-018', text: 'Balance this equation: H₂ + O₂ → H₂O', questionType: 'MCQ', subject: 'Chemistry', topic: 'Chemical Equations', difficulty: 'Easy', options: ['2H₂ + O₂ → 2H₂O', 'H₂ + O₂ → H₂O', '4H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → 2H₂O'], correctAnswer: '2H₂ + O₂ → 2H₂O', points: 3 },
  { id: 'q-019', text: 'Describe oxidation in terms of electron transfer and give an example.', questionType: 'Essay', subject: 'Chemistry', topic: 'Redox Reactions', difficulty: 'Hard', correctAnswer: 'Oxidation is loss of electrons (OIL)...', points: 8 },
  { id: 'q-020', text: 'Which of the following is an exothermic reaction?', questionType: 'MCQ', subject: 'Chemistry', topic: 'Thermochemistry', difficulty: 'Medium', options: ['Combustion of methane', 'Photosynthesis', 'Electrolysis of water', 'Dissolution of ammonium nitrate'], correctAnswer: 'Combustion of methane', points: 4 },

  // Arabic
  { id: 'q-021', text: 'ما هو مفرد كلمة "أقلام"؟', questionType: 'MCQ', subject: 'Arabic', topic: 'Grammar', difficulty: 'Easy', options: ['قلم', 'أقلم', 'قلام', 'مقلمة'], correctAnswer: 'قلم', points: 2 },
  { id: 'q-022', text: 'اكتب فقرة من خمس جمل عن أهمية القراءة.', questionType: 'Essay', subject: 'Arabic', topic: 'Writing', difficulty: 'Medium', correctAnswer: 'القراءة مفتاح العلم...', points: 8 },
  { id: 'q-023', text: 'ما نوع الجملة: "يذهب الطالب إلى المدرسة"؟', questionType: 'MCQ', subject: 'Arabic', topic: 'Grammar', difficulty: 'Medium', options: ['جملة فعلية', 'جملة اسمية', 'جملة شرطية', 'جملة خبرية'], correctAnswer: 'جملة فعلية', points: 3 },

  // Cross-subject AI-generated examples
  { id: 'q-024', text: 'Compare and contrast renewable and non-renewable energy sources.', questionType: 'Essay', subject: 'Physics', topic: 'Energy', difficulty: 'Medium', correctAnswer: 'Renewable sources include solar, wind...', points: 8 },
  { id: 'q-025', text: 'The pH of a neutral solution at 25°C is:', questionType: 'MCQ', subject: 'Chemistry', topic: 'Acids & Bases', difficulty: 'Easy', options: ['7', '0', '14', '1'], correctAnswer: '7', points: 2 },
]

// ── Mock Exams ─────────────────────────────────────────────────────────────────

export const exams: Exam[] = [
  {
    id: 'exam-001',
    title: 'Mathematics Mid-Term Exam',
    classId: 'cls-001',
    teacherId: 'tch-001',
    date: '2026-04-01',
    duration: 90,
    examType: 'summative',
    status: 'published',
    totalPoints: 50,
    questionIds: ['q-001', 'q-002', 'q-003', 'q-004', 'q-005', 'q-006'],
    rules: { timeLimit: true, attempts: 1, randomizeQuestions: false, randomizeAnswers: true, showResultsAfter: false },
    room: 'B201',
    passingScore: 60,
  },
  {
    id: 'exam-002',
    title: 'Physics Formative Quiz — Newton\'s Laws',
    classId: 'cls-003',
    teacherId: 'tch-002',
    date: '2026-03-28',
    duration: 40,
    examType: 'formative',
    status: 'published',
    totalPoints: 25,
    questionIds: ['q-007', 'q-008', 'q-009', 'q-010', 'q-011'],
    rules: { timeLimit: true, attempts: 2, randomizeQuestions: true, randomizeAnswers: false, showResultsAfter: true },
    room: 'B103',
    passingScore: 50,
  },
  {
    id: 'exam-003',
    title: 'English Language Diagnostic',
    classId: 'cls-005',
    teacherId: 'tch-003',
    date: '2026-03-20',
    duration: 60,
    examType: 'diagnostic',
    status: 'completed',
    totalPoints: 30,
    questionIds: ['q-013', 'q-014', 'q-015', 'q-016'],
    rules: { timeLimit: false, attempts: 1, randomizeQuestions: false, randomizeAnswers: false, showResultsAfter: true },
    room: 'A201',
    passingScore: 55,
  },
  {
    id: 'exam-004',
    title: 'Chemistry Unit 3 — Reactions Draft',
    classId: 'cls-007',
    teacherId: 'tch-004',
    date: '2026-04-08',
    duration: 75,
    examType: 'summative',
    status: 'draft',
    totalPoints: 40,
    questionIds: ['q-017', 'q-018', 'q-019', 'q-020', 'q-025'],
    rules: { timeLimit: true, attempts: 1, randomizeQuestions: false, randomizeAnswers: true, showResultsAfter: false },
    room: 'C102',
    passingScore: 60,
  },
]

// ── Mock Submissions (for exam-003, the completed one) ─────────────────────────

export const examSubmissions: ExamSubmission[] = [
  { id: 'esub-001', examId: 'exam-003', studentId: 'stu-001', answers: {}, score: 26, submissionStatus: 'graded', feedback: 'Excellent work on the persuasive paragraph. Strong use of PEEL structure.', submittedAt: '2026-03-20T10:45:00' },
  { id: 'esub-002', examId: 'exam-003', studentId: 'stu-002', answers: {}, score: 22, submissionStatus: 'graded', feedback: 'Good overall. Work on vocabulary range for higher marks.', submittedAt: '2026-03-20T10:50:00' },
  { id: 'esub-003', examId: 'exam-003', studentId: 'stu-003', answers: {}, score: null, submissionStatus: 'pending', feedback: null, submittedAt: '2026-03-20T11:00:00' },
  { id: 'esub-004', examId: 'exam-003', studentId: 'stu-004', answers: {}, score: 18, submissionStatus: 'graded', feedback: 'Needs improvement in grammar usage. Semicolons were misused twice.', submittedAt: '2026-03-20T10:52:00' },
  { id: 'esub-005', examId: 'exam-003', studentId: 'stu-005', answers: {}, score: 28, submissionStatus: 'graded', feedback: 'Outstanding. Top marks on the essay section.', submittedAt: '2026-03-20T10:40:00' },
  { id: 'esub-006', examId: 'exam-003', studentId: 'stu-006', answers: {}, score: null, submissionStatus: 'pending', feedback: null, submittedAt: '2026-03-20T11:05:00' },
  { id: 'esub-007', examId: 'exam-003', studentId: 'stu-007', answers: {}, score: 24, submissionStatus: 'graded', feedback: 'Strong performance. Minor errors in literary device identification.', submittedAt: '2026-03-20T10:48:00' },
  { id: 'esub-008', examId: 'exam-003', studentId: 'stu-008', answers: {}, score: 15, submissionStatus: 'graded', feedback: 'More practice needed on grammar. Essay argument lacked supporting evidence.', submittedAt: '2026-03-20T10:58:00' },
  { id: 'esub-009', examId: 'exam-003', studentId: 'stu-009', answers: {}, score: null, submissionStatus: 'pending', feedback: null, submittedAt: '2026-03-20T11:10:00' },
  { id: 'esub-010', examId: 'exam-003', studentId: 'stu-010', answers: {}, score: 21, submissionStatus: 'graded', feedback: 'Good comprehension. Could improve persuasive techniques.', submittedAt: '2026-03-20T10:55:00' },

  // Exam-002 (physics, published — has some pending submissions)
  { id: 'esub-011', examId: 'exam-002', studentId: 'stu-001', answers: {}, score: null, submissionStatus: 'pending', feedback: null, submittedAt: '2026-03-28T09:30:00' },
  { id: 'esub-012', examId: 'exam-002', studentId: 'stu-002', answers: {}, score: null, submissionStatus: 'pending', feedback: null, submittedAt: '2026-03-28T09:35:00' },
  { id: 'esub-013', examId: 'exam-002', studentId: 'stu-003', answers: {}, score: 20, submissionStatus: 'graded', feedback: 'Well done on Newton\'s Laws application.', submittedAt: '2026-03-28T09:28:00' },
  { id: 'esub-014', examId: 'exam-002', studentId: 'stu-004', answers: {}, score: null, submissionStatus: 'pending', feedback: null, submittedAt: '2026-03-28T09:40:00' },
  { id: 'esub-015', examId: 'exam-002', studentId: 'stu-005', answers: {}, score: 23, submissionStatus: 'graded', feedback: 'Excellent conceptual understanding.', submittedAt: '2026-03-28T09:25:00' },
]

// ── Grade distribution for exam-003 ────────────────────────────────────────────

export const gradeDistribution: GradeDistribution[] = [
  { grade: 'A', count: 2 },
  { grade: 'B', count: 3 },
  { grade: 'C', count: 2 },
  { grade: 'D', count: 2 },
  { grade: 'F', count: 1 },
]

// ── Helper functions ───────────────────────────────────────────────────────────

export function getQuestionById(id: string): ExamQuestion | undefined {
  return examQuestions.find(q => q.id === id)
}

export function getExamById(id: string): Exam | undefined {
  return exams.find(e => e.id === id)
}

export function getSubmissionsByExam(examId: string): ExamSubmission[] {
  return examSubmissions.filter(s => s.examId === examId)
}

export function getExamsByStatus(status: ExamStatus): Exam[] {
  return exams.filter(e => e.status === status)
}
