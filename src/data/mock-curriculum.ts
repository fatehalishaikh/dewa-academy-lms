// ─── Lesson Generator ────────────────────────────────────────────────────────

export type LessonGenStat = {
  subject: string
  khdaAligned: number
  moeAligned: number
  custom: number
}

export const lessonGenStats: LessonGenStat[] = [
  { subject: 'Math',      khdaAligned: 18, moeAligned: 12, custom: 5 },
  { subject: 'Science',   khdaAligned: 15, moeAligned: 10, custom: 8 },
  { subject: 'English',   khdaAligned: 14, moeAligned: 11, custom: 6 },
  { subject: 'Arabic',    khdaAligned: 12, moeAligned: 14, custom: 4 },
  { subject: 'Social St', khdaAligned: 10, moeAligned: 8,  custom: 9 },
]

export type RecentLesson = {
  subject: string
  topic: string
  grade: string
  alignment: number
  timeAgo: string
}

export const recentLessons: RecentLesson[] = [
  { subject: 'Mathematics', topic: 'Quadratic Equations',  grade: 'Grade 10', alignment: 96, timeAgo: '1 hr ago' },
  { subject: 'Science',     topic: 'Photosynthesis',        grade: 'Grade 8',  alignment: 92, timeAgo: '3 hrs ago' },
  { subject: 'Arabic',      topic: 'Poetry Analysis',       grade: 'Grade 11', alignment: 88, timeAgo: 'Yesterday' },
]

// ─── Standards Coverage ───────────────────────────────────────────────────────

export type StandardItem = {
  code: string
  name: string
  status: 'covered' | 'partial' | 'gap' | 'redundant'
  coverage: number
  subject: string
}

export const standardItems: StandardItem[] = [
  { code: 'KHDA-M-4.2', name: 'Algebraic Reasoning',     status: 'covered',   coverage: 95, subject: 'Math' },
  { code: 'MOE-S-3.1',  name: 'Scientific Inquiry',       status: 'partial',   coverage: 62, subject: 'Science' },
  { code: 'KHDA-E-2.3', name: 'Critical Reading',         status: 'gap',       coverage: 28, subject: 'English' },
  { code: 'MOE-A-5.1',  name: 'Classical Arabic Forms',   status: 'redundant', coverage: 100, subject: 'Arabic' },
]

// ─── Pacing & Adaptation ──────────────────────────────────────────────────────

export type PacingPoint = { week: string; planned: number; actual: number }

export const pacingTimeline: PacingPoint[] = [
  { week: 'W1',  planned: 8,   actual: 8  },
  { week: 'W2',  planned: 17,  actual: 15 },
  { week: 'W3',  planned: 25,  actual: 22 },
  { week: 'W4',  planned: 33,  actual: 30 },
  { week: 'W5',  planned: 42,  actual: 37 },
  { week: 'W6',  planned: 50,  actual: 44 },
  { week: 'W7',  planned: 58,  actual: 52 },
  { week: 'W8',  planned: 67,  actual: 61 },
  { week: 'W9',  planned: 75,  actual: 70 },
  { week: 'W10', planned: 83,  actual: 78 },
  { week: 'W11', planned: 92,  actual: 85 },
  { week: 'W12', planned: 100, actual: 91 },
]

export type PacingAdjustment = {
  subject: string
  recommendation: string
  urgency: 'high' | 'moderate' | 'low'
  weeksBehind: number
}

export const pacingAdjustments: PacingAdjustment[] = [
  { subject: 'Science', recommendation: 'Accelerate Unit 5 — combine labs 3 & 4', urgency: 'high',     weeksBehind: 2.5 },
  { subject: 'English', recommendation: 'On track — maintain current pace',         urgency: 'low',      weeksBehind: 0 },
  { subject: 'Math',    recommendation: 'Slow down Unit 7 — low comprehension',     urgency: 'moderate', weeksBehind: -1 },
]

// ─── Resource Recommendations ─────────────────────────────────────────────────

export type ResourceStat = {
  subject: string
  videos: number
  documents: number
  interactive: number
}

export const resourceStats: ResourceStat[] = [
  { subject: 'Math',    videos: 24, documents: 18, interactive: 12 },
  { subject: 'Science', videos: 20, documents: 15, interactive: 18 },
  { subject: 'English', videos: 16, documents: 22, interactive: 8  },
  { subject: 'Arabic',  videos: 12, documents: 20, interactive: 6  },
]

export type ResourceRecommendation = {
  title: string
  resourceType: 'Video' | 'Document' | 'Interactive' | 'Quiz'
  subject: string
  relevance: number
  reason: string
}

export const resourceRecommendations: ResourceRecommendation[] = [
  {
    title: 'Quadratic Functions Visual Guide',
    resourceType: 'Interactive',
    subject: 'Math',
    relevance: 98,
    reason: 'Addresses Grade 10 gap in algebraic reasoning',
  },
  {
    title: 'Scientific Method Lab Series',
    resourceType: 'Video',
    subject: 'Science',
    relevance: 94,
    reason: 'Supports MOE-S-3.1 inquiry standard',
  },
  {
    title: 'Arabic Poetry Anthology',
    resourceType: 'Document',
    subject: 'Arabic',
    relevance: 91,
    reason: 'Aligns with KHDA classical forms requirement',
  },
]

// ─── Curriculum Analytics ─────────────────────────────────────────────────────

export type CurriculumHealthPoint = { week: string; healthScore: number; benchmark: number }

export const curriculumHealthTimeline: CurriculumHealthPoint[] = [
  { week: 'W1',  healthScore: 72, benchmark: 85 },
  { week: 'W2',  healthScore: 75, benchmark: 85 },
  { week: 'W3',  healthScore: 78, benchmark: 85 },
  { week: 'W4',  healthScore: 80, benchmark: 85 },
  { week: 'W5',  healthScore: 82, benchmark: 85 },
  { week: 'W6',  healthScore: 79, benchmark: 85 },
  { week: 'W7',  healthScore: 84, benchmark: 85 },
  { week: 'W8',  healthScore: 86, benchmark: 85 },
  { week: 'W9',  healthScore: 88, benchmark: 85 },
  { week: 'W10', healthScore: 85, benchmark: 85 },
  { week: 'W11', healthScore: 90, benchmark: 85 },
  { week: 'W12', healthScore: 87, benchmark: 85 },
  { week: 'W13', healthScore: 91, benchmark: 85 },
  { week: 'W14', healthScore: 92, benchmark: 85 },
]

export type CurriculumInsight = {
  subject: string
  healthScore: number
  lessonsDelivered: number
  standardsCovered: number
  trend: 'up' | 'down' | 'flat'
}

export const curriculumInsights: CurriculumInsight[] = [
  { subject: 'Mathematics',     healthScore: 92, lessonsDelivered: 38, standardsCovered: 95, trend: 'up' },
  { subject: 'Science',         healthScore: 78, lessonsDelivered: 32, standardsCovered: 72, trend: 'down' },
  { subject: 'English Language',healthScore: 85, lessonsDelivered: 35, standardsCovered: 84, trend: 'flat' },
  { subject: 'Arabic Language', healthScore: 88, lessonsDelivered: 34, standardsCovered: 90, trend: 'up' },
  { subject: 'Social Studies',  healthScore: 74, lessonsDelivered: 28, standardsCovered: 68, trend: 'down' },
]
